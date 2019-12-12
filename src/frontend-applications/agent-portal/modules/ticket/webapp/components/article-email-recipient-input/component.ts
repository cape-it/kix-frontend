/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from "./ComponentState";
import { FormInputComponent } from "../../../../../modules/base-components/webapp/core/FormInputComponent";
import { IEventSubscriber } from "../../../../../modules/base-components/webapp/core/IEventSubscriber";
import { TreeHandler, TreeService, TreeNode } from "../../../../base-components/webapp/core/tree";
import { LabelService } from "../../../../../modules/base-components/webapp/core/LabelService";
import { KIXObjectType } from "../../../../../model/kix/KIXObjectType";
import { AutoCompleteConfiguration } from "../../../../../model/configuration/AutoCompleteConfiguration";
import { ArticleProperty } from "../../../model/ArticleProperty";
import { EventService } from "../../../../../modules/base-components/webapp/core/EventService";
import { FormService } from "../../../../../modules/base-components/webapp/core/FormService";
import { KIXObjectService } from "../../../../../modules/base-components/webapp/core/KIXObjectService";
import { SystemAddress } from "../../../../system-address/model/SystemAddress";
import { KIXObjectLoadingOptions } from "../../../../../model/KIXObjectLoadingOptions";
import { FilterCriteria } from "../../../../../model/FilterCriteria";
import { SearchOperator } from "../../../../search/model/SearchOperator";
import { FilterDataType } from "../../../../../model/FilterDataType";
import { FilterType } from "../../../../../model/FilterType";
import { FormInputAction } from "../../../../../modules/base-components/webapp/core/FormInputAction";
import { Label } from "../../../../../modules/base-components/webapp/core/Label";
import { ContextService } from "../../../../../modules/base-components/webapp/core/ContextService";
import { ContextType } from "../../../../../model/ContextType";
import { TranslationService } from "../../../../../modules/translation/webapp/core/TranslationService";
import { FormFieldConfiguration } from "../../../../../model/configuration/FormFieldConfiguration";
import { Ticket } from "../../../model/Ticket";
import { Article } from "../../../model/Article";
import { ArticleReceiver } from "../../../model/ArticleReceiver";
import { KIXObject } from "../../../../../model/kix/KIXObject";
import { ServiceRegistry } from "../../../../../modules/base-components/webapp/core/ServiceRegistry";
import { IKIXObjectService } from "../../../../../modules/base-components/webapp/core/IKIXObjectService";
class Component extends FormInputComponent<string[], ComponentState> {

    private ccSubscriber: IEventSubscriber;
    private ccReadySubscriber: IEventSubscriber;
    private treeHandler: TreeHandler;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        super.onInput(input);
    }

    public async onMount(): Promise<void> {
        await super.onMount();
        this.state.searchCallback = this.searchContacts.bind(this);
        const objectName = await LabelService.getInstance().getObjectName(KIXObjectType.CONTACT, true, false);
        this.state.autoCompleteConfiguration = new AutoCompleteConfiguration(10, 2000, 3, objectName);

        this.treeHandler = new TreeHandler([], null, null, true);
        TreeService.getInstance().registerTreeHandler(this.state.treeId, this.treeHandler);

        await this.prepareActions();
        await this.setCurrentNodes();

        if (this.state.field.property === ArticleProperty.CC) {
            this.ccSubscriber = {
                eventSubscriberId: 'article-email-cc-recipient-input',
                eventPublished: (data: any, eventId: string) => {
                    const newCcNodes = this.prepareMailNodes(data ? data.ccList : null, data ? data.filterList : null);
                    this.treeHandler.setSelection(newCcNodes, true, true, true);
                    this.contactChanged(newCcNodes);
                }
            };
            EventService.getInstance().subscribe('SET_CC_RECIPIENTS', this.ccSubscriber);
            EventService.getInstance().publish('CC_READY');
        }

        this.state.prepared = true;
    }

    public async onDestroy(): Promise<void> {
        EventService.getInstance().unsubscribe('SET_CC_RECIPIENTS', this.ccSubscriber);
        EventService.getInstance().unsubscribe('CC_READY', this.ccReadySubscriber);
    }

    public async setCurrentNodes(): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        const defaultValue = formInstance.getFormFieldValue<number>(this.state.field.instanceId);
        if (defaultValue && defaultValue.value) {
            const contactEmails: any[] = Array.isArray(defaultValue.value)
                ? defaultValue.value : [defaultValue.value];

            const nodes = [];
            const systemAddresses = await KIXObjectService.loadObjects<SystemAddress>(
                KIXObjectType.SYSTEM_ADDRESS
            );

            // TODO: nicht sehr performant
            for (const email of contactEmails) {
                const plainMail = email.replace(/.+ <(.+)>/, '$1');
                const contacts = await KIXObjectService.loadObjects(KIXObjectType.CONTACT, null,
                    new KIXObjectLoadingOptions(
                        [
                            new FilterCriteria(
                                'Email', SearchOperator.EQUALS, FilterDataType.STRING,
                                FilterType.OR, plainMail
                            )
                        ]

                    ), null, true
                );
                if (contacts && !!contacts.length) {
                    nodes.push(await this.createTreeNode(contacts[0]));
                } else {
                    if (
                        !systemAddresses
                        || !!!systemAddresses.length
                        || !systemAddresses.map((sa) => sa.Name).some((f) => f === plainMail)
                    ) {
                        nodes.push(new TreeNode(plainMail, email));
                    }
                }
            }

            this.treeHandler.setSelection(nodes, true);
            this.contactChanged(nodes);
        }
    }

    private async prepareActions(): Promise<void> {
        const additionalTypeOption = this.state.field.options.find((o) => o.option === 'ADDITIONAL_RECIPIENT_TYPES');
        const actions = [];
        if (additionalTypeOption && additionalTypeOption.value && Array.isArray(additionalTypeOption.value)) {
            const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
            for (const property of additionalTypeOption.value) {
                const label = await LabelService.getInstance().getPropertyText(
                    property, KIXObjectType.ARTICLE
                );
                const currentValue = formInstance ? await formInstance.getFormFieldValueByProperty(property) : null;
                const action = new FormInputAction(
                    property, new Label(null, property, null, label), this.actionClicked.bind(this),
                    currentValue ? true : false
                );
                actions.push(action);
            }
        }
        if (this.state.field.property === ArticleProperty.TO) {
            const replyAllAction = await this.getReplyAllAction();
            if (replyAllAction) {
                actions.push(replyAllAction);
            }
        }
        this.state.actions = actions;
    }

    private async getReplyAllAction(): Promise<FormInputAction> {
        let action: FormInputAction = null;
        const context = ContextService.getInstance().getActiveContext(ContextType.DIALOG);
        if (context) {
            const addReplyAll = context.getAdditionalInformation('ARTICLE_REPLY');
            if (addReplyAll) {
                action = new FormInputAction(
                    'ReplyAll', new Label(null, 'ReplyAll', 'kix-icon-mail-answerall-outline', null, null,
                        await TranslationService.translate('Translatable#Reply all')
                    ),
                    this.actionClicked.bind(this), false, false
                );
            }
        }
        return action;
    }

    private async actionClicked(action: FormInputAction): Promise<void> {
        if (action.id === 'ReplyAll') {
            await this.handleReplyAll();
        } else {
            const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
            let field = this.state.field.children.find((f) => f.property === action.id);
            if (field) {
                formInstance.removeFormField(field, this.state.field);
                action.active = false;
            } else {
                const label = await LabelService.getInstance().getPropertyText(action.id, KIXObjectType.ARTICLE);
                const helpText = action.id === ArticleProperty.CC
                    ? 'Translatable#Helptext_Tickets_ArticleCreate_ReceiverCc'
                    : 'Translatable#Helptext_Tickets_ArticleCreate_ReceiverBcc';
                field = new FormFieldConfiguration(
                    'recipinet-field',
                    label, action.id, 'article-email-recipient-input', false, helpText
                );
                formInstance.addNewFormField(this.state.field, [field]);
                action.active = true;
            }
            (this as any).setStateDirty('actions');
        }
    }

    private async handleReplyAll(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext(ContextType.MAIN);
        const dialogContext = ContextService.getInstance().getActiveContext(ContextType.DIALOG);
        if (this.state.field.property === ArticleProperty.TO && context && dialogContext) {
            const replyId = dialogContext.getAdditionalInformation('REFERENCED_ARTICLE_ID');
            const ticket = await context.getObject<Ticket>();
            if (replyId && ticket) {
                const replyArticle = ticket.Articles.find((a) => a.ArticleID === replyId);
                if (replyArticle) {
                    const systemAddresses = await KIXObjectService.loadObjects<SystemAddress>(
                        KIXObjectType.SYSTEM_ADDRESS
                    );
                    const newToNodes = this.prepareMailNodes(replyArticle.toList, systemAddresses.map((sa) => sa.Name));
                    this.treeHandler.setSelection(newToNodes, true, true, true);
                    this.contactChanged(newToNodes);

                    this.handleCcField(
                        replyArticle,
                        [...newToNodes.map((n) => n.id), ...systemAddresses.map((sa) => sa.Name)]
                    );
                }
            }
        }
    }

    private async handleCcField(replyArticle: Article, filterList: string[]): Promise<void> {
        const ccAction = this.state.actions.find((a) => a.id === ArticleProperty.CC);
        if (ccAction) {
            const ccField = this.state.field.children.find((f) => f.property === ArticleProperty.CC);
            if (!ccField) {
                this.ccReadySubscriber = {
                    eventSubscriberId: 'article-email-to-recipient-input',
                    eventPublished: (data: any, eventId: string) => {
                        EventService.getInstance().publish('SET_CC_RECIPIENTS', {
                            ccList: replyArticle.ccList,
                            filterList
                        });
                        EventService.getInstance().unsubscribe('CC_READY', this.ccReadySubscriber);
                    }
                };
                EventService.getInstance().subscribe('CC_READY', this.ccReadySubscriber);
                await this.actionClicked(ccAction);
            } else {
                EventService.getInstance().publish('SET_CC_RECIPIENTS', {
                    ccList: replyArticle.ccList,
                    filterList
                });
            }
        }
    }

    private prepareMailNodes(receiverList: ArticleReceiver[], filterList: string[] = []): TreeNode[] {
        const nodes: TreeNode[] = this.treeHandler.getVisibleNodes();
        if (Array.isArray(receiverList)) {
            for (const receiver of receiverList) {
                const email = receiver.email.replace(/.+ <(.+)>/, '$1');
                if (!nodes.some((n) => n.id === email)) {
                    nodes.push(new TreeNode(email, receiver.email, 'kix-icon-man-bubble'));
                }
            }
        }
        return nodes.filter((n) => !filterList.some((f) => f === n.id));
    }

    public contactChanged(nodes: TreeNode[]): void {
        nodes = nodes ? nodes : [];
        super.provideValue(nodes.map((n) => n.id));
    }

    private async searchContacts(limit: number, searchValue: string): Promise<TreeNode[]> {
        const nodes = [];
        const service = ServiceRegistry.getServiceInstance<IKIXObjectService>(KIXObjectType.CONTACT);
        if (service) {
            const filter = await service.prepareFullTextFilter(searchValue);
            const loadingOptions = new KIXObjectLoadingOptions(filter, null, limit);
            const contacts = await KIXObjectService.loadObjects(
                KIXObjectType.CONTACT, null, loadingOptions, null, false
            );


            if (searchValue && searchValue !== '') {
                for (const c of contacts.filter((co) => co['Email'])) {
                    const node = await this.createTreeNode(c);
                    nodes.push(node);
                }
            }
        }

        return nodes;
    }

    private async createTreeNode(contact: KIXObject): Promise<TreeNode> {
        const displayValue = await LabelService.getInstance().getText(contact);
        return new TreeNode(
            contact['Email'], displayValue, 'kix-icon-man-bubble', null, null, null,
            null, null, null, null, undefined, undefined, undefined,
            `"${contact['Firstname']} ${contact['Lastname']}" <${contact['Email']}>`
        );
    }

    public async focusLost(event: any): Promise<void> {
        await super.focusLost();
    }
}

module.exports = Component;