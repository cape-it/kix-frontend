import { KIXObjectType, WidgetType, KIXObjectLoadingOptions, ObjectIcon } from "@kix/core/dist/model";
import { ContextService, ActionFactory, WidgetService, BrowserUtil } from "@kix/core/dist/browser";
import { ComponentState } from './ComponentState';
import { FAQArticle, Attachment, FAQArticleAttachmentLoadingOptions } from "@kix/core/dist/model/kix/faq";

class Component {

    private state: ComponentState;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        WidgetService.getInstance().setWidgetType('faq-article-group', WidgetType.GROUP);

        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        const loadingOptions = new KIXObjectLoadingOptions(
            null, null, null, null, null, ['Attachments', 'Votes'], ['Attachments', 'Votes']
        );
        const faqs = await ContextService.getInstance().loadObjects<FAQArticle>(
            KIXObjectType.FAQ_ARTICLE, [context.objectId], loadingOptions
        );

        if (faqs && faqs.length) {
            this.state.faqArticle = faqs[0];

            this.setActions();
        }
    }

    private setActions(): void {
        if (this.state.widgetConfiguration && this.state.faqArticle) {
            this.state.actions = ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, false, [this.state.faqArticle]
            );
        }
    }

    public getRating(): number {
        if (this.state.faqArticle && this.state.faqArticle.Votes) {
            let sum = 0;
            this.state.faqArticle.Votes.forEach((v) => sum += v.Rating);

            return this.round(sum / this.state.faqArticle.Votes.length);
        }
        return 0;
    }

    private round(value: number, step: number = 0.5): number {
        const inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }

    public getRatingTooltip(): string {
        return `Anzahl Bewertungen: ${this.state.faqArticle.Votes.length}`;
    }

    public fillStar(index: number): boolean {
        const rating = this.getRating() * 2;
        return index <= rating;
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
        const loadingOptions = new KIXObjectLoadingOptions(null, null, null, null, null, ['Content']);
        const faqArticleAttachmentOptions = new FAQArticleAttachmentLoadingOptions(
            this.state.faqArticle.ID, attachment.ID
        );
        const attachments = await ContextService.getInstance().loadObjects<Attachment>(
            KIXObjectType.FAQ_ARTICLE_ATTACHMENT, [attachment.ID], loadingOptions, faqArticleAttachmentOptions
        );

        if (attachments && attachments.length) {
            BrowserUtil.startBrowserDownload(attachment.Filename, attachment.Content, attachment.ContentType);
        }
    }
}

module.exports = Component;
