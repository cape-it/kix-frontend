import { Attachment } from '@kix/core/dist/model';
import { TicketService } from '@kix/core/dist/browser/ticket';
import { ArticleAttachmentComponentState } from './ArticleAttachmentComponentState';
import { ApplicationService } from '@kix/core/dist/browser/application/ApplicationService';

declare var window: any;

class ArticleAttachmentComponent {

    private state: ArticleAttachmentComponentState;

    public onCreate(): void {
        this.state = new ArticleAttachmentComponentState();
    }

    public onInput(input: any): void {
        this.state.article = input.article;
        this.state.attachment = input.attachment;

        if (this.state.attachment) {
            const fileName = this.state.attachment.Filename;
            const idx = fileName.lastIndexOf('.');
            if (idx >= 0) {
                this.state.extension = fileName.substring(idx + 1, fileName.length);
            }
        }
    }

    private async download(): Promise<void> {
        if (!this.state.progress && this.state.article && this.state.attachment) {
            this.state.progress = true;
            const attachment = await this.loadArticleAttachment(this.state.attachment.ID);
            this.state.progress = false;

            TicketService.getInstance().startBrowserDownload(attachment);
        }
    }

    private async loadArticleAttachment(attachmentId: number): Promise<Attachment> {
        const attachment = await TicketService.getInstance().loadArticleAttachment(
            this.state.article.TicketID, this.state.article.ArticleID, attachmentId
        );
        return attachment;
    }

}

module.exports = ArticleAttachmentComponent;
