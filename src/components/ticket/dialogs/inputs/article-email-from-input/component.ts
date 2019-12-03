/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from "./ComponentState";
import {
    FormInputComponent, TreeNode, TicketProperty,
    FormFieldValue, Queue, KIXObjectType, ContextType, ContextMode, Ticket, SystemAddress, TreeHandler
} from "../../../../../core/model";
import { FormService, KIXObjectService, ContextService } from "../../../../../core/browser";
import { TicketDetailsContext } from "../../../../../core/browser/ticket";
import { TranslationService } from "../../../../../core/browser/i18n/TranslationService";
import { AgentService } from "../../../../../core/browser/application/AgentService";
import { FormFieldConfiguration } from "../../../../../core/model/components/form/configuration";

class Component extends FormInputComponent<number, ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        super.onInput(input);
        this.update();
    }

    public async update(): Promise<void> {
        const placeholderText = this.state.field.placeholder
            ? this.state.field.placeholder
            : this.state.field.required ? this.state.field.label : '';

        this.state.placeholder = await TranslationService.translate(placeholderText);
    }

    public async onMount(): Promise<void> {
        await super.onMount();

        const context = ContextService.getInstance().getActiveContext(ContextType.DIALOG);
        const objectTypes = context.getDescriptor().kixObjectTypes;
        const contextMode = context.getDescriptor().contextMode;

        if (objectTypes.some((ot) => ot === KIXObjectType.ARTICLE) && contextMode === ContextMode.CREATE_SUB) {
            this.initValuesByContext();
        } else if (objectTypes.some((ot) => ot === KIXObjectType.TICKET)
            && (contextMode === ContextMode.EDIT || contextMode === ContextMode.CREATE)) {
            this.initValuesByForm();
        }
    }

    private async initValuesByContext(): Promise<void> {
        const context = await ContextService.getInstance().getContext<TicketDetailsContext>(
            TicketDetailsContext.CONTEXT_ID
        );

        if (context) {
            const ticket = await context.getObject<Ticket>();
            if (ticket) {
                this.initNodes(ticket.QueueID);
            }
        }
    }

    private async initValuesByForm(): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        const queueValue = await formInstance.getFormFieldValueByProperty<number>(TicketProperty.QUEUE_ID);
        if (queueValue && queueValue.value) {
            this.initNodes(queueValue.value);
        }

        formInstance.registerListener({
            formListenerId: 'article-email-from-input',
            formValueChanged: async (formField: FormFieldConfiguration, value: FormFieldValue<any>, oldValue: any) => {
                if (formField && formField.property === TicketProperty.QUEUE_ID) {
                    if (!value) {
                        value = await formInstance.getFormFieldValueByProperty(TicketProperty.QUEUE_ID);
                    }

                    if (value && value.value) {
                        this.initNodes(value.value);
                    }

                }
            },
            updateForm: () => { return; }
        });
    }

    private async initNodes(queueId: number): Promise<void> {
        const queues = await KIXObjectService.loadObjects<Queue>(KIXObjectType.QUEUE, [queueId]);
        if (queues && queues.length) {
            const user = await AgentService.getInstance().getCurrentUser();

            const queue = queues[0];

            let userName = `${user.UserFirstname} ${user.UserLastname}`;
            userName = userName
                .replace(/ä/g, 'ae').replace(/Ä/g, 'Ae')
                .replace(/ö/g, 'oe').replace(/Ö/g, 'Oe')
                .replace(/ü/g, 'ue').replace(/Ü/g, 'Ue');

            const systemAddress = await KIXObjectService.loadObjects<SystemAddress>(
                KIXObjectType.SYSTEM_ADDRESS, [queue.SystemAddressID], null, null, true
            );
            const queueMail = systemAddress[0].Name;
            let realName = systemAddress[0].Realname;
            realName = realName
                .replace(/ä/g, 'ae').replace(/Ä/g, 'Ae')
                .replace(/ö/g, 'oe').replace(/Ö/g, 'Oe')
                .replace(/ü/g, 'ue').replace(/Ü/g, 'Ue');

            const labels = [
                [`\"<${realName}>\" <${queueMail}>`, `${realName}`],
                [`<${userName}> \"via\" <${realName}> <${queueMail}>`, `${userName} via ${realName}`],
                [`<${userName}> <${queueMail}>`, `${userName}`]
            ];

            const nodes: TreeNode[] = [];
            labels.forEach((l) => nodes.push(
                new TreeNode(
                    l[0], l[1], null, null, null, null, null, null, null,
                    undefined, undefined, undefined, undefined, l[0]
                )
            ));

            const formList = (this as any).getComponent("article-email-from-input");
            if (formList) {
                const treeHandler: TreeHandler = formList.getTreeHandler();
                if (treeHandler) {
                    treeHandler.setTree(nodes);
                    treeHandler.setSelection([nodes[0]], true);
                }
            }

            this.nodesChanged([nodes[0]]);
        }
    }

    public nodesChanged(nodes: TreeNode[]): void {
        const currentNode = nodes && nodes.length ? nodes[0] : null;
        super.provideValue(currentNode ? currentNode.id : null);
    }

    public async focusLost(event: any): Promise<void> {
        await super.focusLost();
    }
}

module.exports = Component;
