/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import {
    Article, SenderType, KIXObjectType,
    ArticleReceiver, ArticleProperty
} from '../../model';
import { IKIXObjectFactory, KIXObjectService } from '../kix';

export class ArticleBrowserFactory implements IKIXObjectFactory<Article> {

    private static INSTANCE: ArticleBrowserFactory;

    public static getInstance(): ArticleBrowserFactory {
        if (!ArticleBrowserFactory.INSTANCE) {
            ArticleBrowserFactory.INSTANCE = new ArticleBrowserFactory();
        }
        return ArticleBrowserFactory.INSTANCE;
    }

    private constructor() { }

    public async create(article: Article): Promise<Article> {
        const newArticle = new Article(article);
        await this.mapArticleData(newArticle);
        return newArticle;
    }

    private async mapArticleData(article: Article): Promise<void> {
        const senderTypes = await KIXObjectService.loadObjects<SenderType>(
            KIXObjectType.SENDER_TYPE, [article.SenderTypeID]
        ).catch((error) => []);

        article.senderType = senderTypes && senderTypes.length ? senderTypes[0] : null;

        this.prepareReceiverLists(article);
        if (!article.bodyAttachment) {
            this.prepareAttachments(article);
        }
    }

    private prepareReceiverLists(article: Article): void {
        let toStringList = [];
        if (!Array.isArray(article.To)) {
            toStringList = article.To ? article.To.split(/,\s*/) : [];
        }

        let ccStringList = [];
        if (!Array.isArray(article.Cc)) {
            ccStringList = article.Cc ? article.Cc.split(/,\s*/) : [];
        }

        let bccStringList = [];
        if (!Array.isArray(article.Bcc)) {
            bccStringList = article.Bcc ? article.Bcc.split(/,\s*/) : [];
        }


        let toRealNameStringList = [];
        if (!Array.isArray(article.ToRealname)) {
            toRealNameStringList = article.ToRealname ? article.ToRealname.split(/,\s*/) : [];
        }

        let ccRealNameStringList = [];
        if (!Array.isArray(article.CcRealname)) {
            ccRealNameStringList = article.CcRealname ? article.CcRealname.split(/,\s*/) : [];
        }

        let bccRealNameStringList = [];
        if (!Array.isArray(article.BccRealname)) {
            bccRealNameStringList = article.BccRealname ? article.BccRealname.split(/,\s*/) : [];
        }

        article.toList = toStringList.map((t, index) => new ArticleReceiver(t, toRealNameStringList[index]));
        article.ccList = ccStringList.map(
            (cc, index) => new ArticleReceiver(cc, ccRealNameStringList[index], ArticleProperty.CC)
        );
        article.bccList = bccStringList.map(
            (bcc, index) => new ArticleReceiver(bcc, bccRealNameStringList[index], ArticleProperty.BCC)
        );
    }

    private prepareAttachments(article: Article): void {
        if (article.Attachments) {
            const bodyAttachmentIndex = article.Attachments.findIndex(
                (a) => a.Disposition === 'inline' && a.Filename === 'file-2'
            );
            if (bodyAttachmentIndex > -1) {
                article.bodyAttachment = article.Attachments[bodyAttachmentIndex];
                article.Attachments.splice(bodyAttachmentIndex, 1);
            }
        }
    }

}
