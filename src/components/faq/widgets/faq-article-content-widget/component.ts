/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import {
    KIXObjectType, WidgetType, KIXObjectLoadingOptions, ObjectIcon, Context, Attachment
} from "../../../../core/model";
import {
    ContextService, ActionFactory, WidgetService, BrowserUtil, IdService, KIXObjectService, LabelService
} from "../../../../core/browser";
import { ComponentState } from './ComponentState';
import {
    FAQArticle, FAQArticleAttachmentLoadingOptions, FAQArticleProperty
} from "../../../../core/model/kix/faq";
import { TranslationService } from "../../../../core/browser/i18n/TranslationService";
import { FAQDetailsContext } from "../../../../core/browser/faq/context/FAQDetailsContext";
import { FAQService } from "../../../../core/browser/faq";

class Component {

    public eventSubscriberId: string = 'FAQContentComponent';

    private state: ComponentState;
    private contextListenerId: string = null;

    public stars: Array<string | ObjectIcon> = [];
    public rating: number;

    public onCreate(): void {
        this.state = new ComponentState();
        this.contextListenerId = IdService.generateDateBasedId('faq-content-widget');
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {

        this.state.translations = await TranslationService.createTranslationObject([
            "Translatable#Symptom", "Translatable#Cause", "Translatable#Solution", "Translatable#Comment",
            "Translatable#Number of ratings"
        ]);

        WidgetService.getInstance().setWidgetType('faq-article-group', WidgetType.GROUP);

        const context = await ContextService.getInstance().getContext<FAQDetailsContext>(FAQDetailsContext.CONTEXT_ID);
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        context.registerListener(this.contextListenerId, {
            objectChanged: (id: string | number, faqArticle: FAQArticle, type: KIXObjectType) => {
                if (type === KIXObjectType.FAQ_ARTICLE) {
                    this.initWidget(context, faqArticle);
                }
            },
            sidebarToggled: () => { return; },
            explorerBarToggled: () => { return; },
            objectListChanged: () => { return; },
            filteredObjectListChanged: () => { return; },
            scrollInformationChanged: () => { return; },
            additionalInformationChanged: () => { return; }
        });

        await this.initWidget(context, await context.getObject<FAQArticle>());
        this.state.loading = false;
    }

    private async initWidget(context: Context, faqArticle?: FAQArticle): Promise<void> {
        this.state.faqArticle = faqArticle;

        if (faqArticle && faqArticle.Attachments) {
            this.state.attachments = faqArticle.Attachments.filter((a) => a.Disposition !== 'inline');
            this.state.inlineContent = await FAQService.getInstance().getFAQArticleInlineContent(faqArticle);

            const labelProvider = LabelService.getInstance().getLabelProviderForType(KIXObjectType.FAQ_ARTICLE);
            this.stars = await labelProvider.getIcons(faqArticle, FAQArticleProperty.VOTES);
            this.rating = BrowserUtil.calculateAverage(faqArticle.Votes.map((v) => v.Rating));
            this.prepareActions();
        }
    }

    private async prepareActions(): Promise<void> {
        if (this.state.widgetConfiguration && this.state.faqArticle) {
            this.state.actions = await ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, [this.state.faqArticle]
            );
        }
    }

    public getRatingTooltip(): string {
        const count = this.state.faqArticle.Votes ? this.state.faqArticle.Votes.length : 0;
        return `${this.state.translations["Translatable#Number of ratings"]}: ${count}`;
    }

    public getIcon(attachment: Attachment): ObjectIcon {
        const fileName = attachment.Filename;
        const idx = fileName.lastIndexOf('.');
        if (idx >= 0) {
            const extension = fileName.substring(idx + 1, fileName.length);
            return new ObjectIcon("Filetype", extension);
        }
        return null;
    }

    public async download(attachment: Attachment): Promise<void> {
        const loadingOptions = new KIXObjectLoadingOptions(null, null, null, ['Content']);
        const faqArticleAttachmentOptions = new FAQArticleAttachmentLoadingOptions(
            this.state.faqArticle.ID, attachment.ID
        );
        const attachments = await KIXObjectService.loadObjects<Attachment>(
            KIXObjectType.FAQ_ARTICLE_ATTACHMENT, [attachment.ID], loadingOptions, faqArticleAttachmentOptions
        );

        if (attachments && attachments.length) {
            BrowserUtil.startBrowserDownload(
                attachments[0].Filename, attachments[0].Content, attachments[0].ContentType
            );
        }
    }
}

module.exports = Component;
