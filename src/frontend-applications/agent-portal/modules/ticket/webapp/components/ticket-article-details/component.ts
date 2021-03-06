/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { Article } from '../../../model/Article';
import { Ticket } from '../../../model/Ticket';
import { KIXObjectService } from '../../../../../modules/base-components/webapp/core/KIXObjectService';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { KIXObjectLoadingOptions } from '../../../../../model/KIXObjectLoadingOptions';
import { ArticleProperty } from '../../../model/ArticleProperty';
import { ArticleLoadingOptions } from '../../../model/ArticleLoadingOptions';

export class TicketArticleDetailsComponent {

    private state: ComponentState;

    public onCreate(input: any): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.inputObject = input.article;
    }

    public async onMount(): Promise<void> {
        if (this.state.inputObject instanceof Article) {
            this.state.article = this.state.inputObject;
        } else if (this.state.inputObject instanceof Ticket) {
            const ticket = (this.state.inputObject as Ticket);
            const articles = await KIXObjectService.loadObjects<Article>(
                KIXObjectType.ARTICLE, null,
                new KIXObjectLoadingOptions(null, 'Article.-IncomingTime', 1, [ArticleProperty.ATTACHMENTS, 'ObjectActions']),
                new ArticleLoadingOptions(ticket.TicketID)
            );

            if (articles && articles.length) {
                this.state.article = articles[0];
            }
        }

        this.state.loading = false;
    }
}

module.exports = TicketArticleDetailsComponent;
