import { IWidgetFactoryExtension } from '@kix/core/dist/extensions';
import { WidgetType, IWidget, WidgetConfiguration, WidgetSize, DataType } from '@kix/core/dist/model';
import { TableColumnConfiguration } from '@kix/core/dist/browser';
import { ArticleListSettings } from '../../../components/ticket/widgets/article-list-widget/ArticleListSettings';

export class ArticleListWidgetFactoryExtension implements IWidgetFactoryExtension {

    public widgetId: string = "article-list-widget";

    public type: WidgetType = WidgetType.CONTENT;

    public getDefaultConfiguration(): any {
        const settings: ArticleListSettings = {
            generalActions: [
                'article-bulk-action', 'article-new-email-action', 'article-new-note-action',
                'article-call-outgoing-action', 'article-call-incoming-action'
            ],
            tableColumns: [
                new TableColumnConfiguration(
                    'Number', true, false, false, true, 50, DataType.NUMBER
                ),
                new TableColumnConfiguration('ArticleInformation', false, true, false, false, 50),
                new TableColumnConfiguration('SenderTypeID', true, false, true, true, 100),
                new TableColumnConfiguration('ArticleTypeID', false, true, false, true, 50),
                new TableColumnConfiguration('ArticleTag', false, true, true, false, 50),
                new TableColumnConfiguration('From', true, false, true, true, 225),
                new TableColumnConfiguration('Subject', true, false, true, true, 500),
                new TableColumnConfiguration(
                    'IncomingTime', true, false, true, true, 150, DataType.DATE_TIME
                ),
                new TableColumnConfiguration('Attachment', true, false, true, false, 50),
            ]
        };
        const articleActions = [
            'article-print-action',
            'article-edit-action',
            'article-communication-action',
            'article-tag-action',
            'article-maximize-action'
        ];
        return new WidgetConfiguration(
            this.widgetId, 'Artikelübersicht', articleActions,
            settings, false, true, WidgetSize.LARGE, null
        );
    }

}

module.exports = (data, host, options) => {
    return new ArticleListWidgetFactoryExtension();
};
