/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction } from '../../../../../../modules/base-components/webapp/core/AbstractAction';
import { UIComponentPermission } from '../../../../../../model/UIComponentPermission';
import { CRUD } from '../../../../../../../../server/model/rest/CRUD';
import { ContextService } from '../../../../../../modules/base-components/webapp/core/ContextService';
import { NewTicketArticleContext } from '../..';
import { TranslationService } from '../../../../../../modules/translation/webapp/core/TranslationService';
import { AuthenticationSocketClient } from '../../../../../base-components/webapp/core/AuthenticationSocketClient';
import { AdditionalContextInformation } from '../../../../../base-components/webapp/core/AdditionalContextInformation';

export class ArticleReplyAction extends AbstractAction {

    private articleId: number = null;
    private ticketId: number = null;

    public hasLink: boolean = true;

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Reply';
        this.icon = 'kix-icon-mail-answer-outline';
    }

    public async canShow(): Promise<boolean> {
        let show = false;
        const context = ContextService.getInstance().getActiveContext();
        const objectId = context.getObjectId();

        if (objectId) {
            this.ticketId = Number(objectId);
            const permissions = [
                new UIComponentPermission(`tickets/${objectId}/articles`, [CRUD.CREATE])
            ];
            show = await AuthenticationSocketClient.getInstance().checkPermissions(permissions);
        }

        return show;
    }

    public async setData(data: any): Promise<void> {
        super.setData(data);
        if (this.data) {
            if (Array.isArray(this.data)) {
                this.articleId = this.data[0].ArticleID;
            } else if (typeof this.data === 'string' || typeof this.data === 'number') {
                this.articleId = Number(this.data);
            }
        }
    }

    public async run(event: any): Promise<void> {
        if (this.articleId) {
            await this.openDialog();
        } else {
            super.run(event);
        }
    }

    public canRun(): boolean {
        return this.articleId !== null && this.ticketId !== null;
    }

    public async getLinkData(): Promise<string> {
        return this.articleId.toString();
    }
    private async openDialog(): Promise<void> {
        if (this.articleId) {
            ContextService.getInstance().setActiveContext(NewTicketArticleContext.CONTEXT_ID, this.articleId,
                undefined,
                [
                    ['REFERENCED_TICKET_ID', this.ticketId],
                    ['REFERENCED_ARTICLE_ID', this.articleId],
                    ['ARTICLE_REPLY', true],
                    [
                        AdditionalContextInformation.DISPLAY_TEXT,
                        await TranslationService.translate(this.text)
                    ],
                    [AdditionalContextInformation.ICON, this.icon]
                ]
            );
        }
    }
}
