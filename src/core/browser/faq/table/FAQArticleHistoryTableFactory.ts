import { KIXObjectType, DataType } from "../../../model";
import { FAQArticleHistoryProperty } from "../../../model/kix/faq";
import {
    TableConfiguration, ITable, Table, DefaultColumnConfiguration,
    TableHeaderHeight, IColumnConfiguration
} from "../../table";
import { FAQArticleHistoryContentProvider } from "./FAQArticleHistoryContentProvider";
import { TableFactory } from "../../table/TableFactory";

export class FAQArticleHistoryTableFactory extends TableFactory {

    public objectType: KIXObjectType = KIXObjectType.FAQ_ARTICLE_HISTORY;

    public createTable(
        tableKey: string, tableConfiguration?: TableConfiguration, objectIds?: Array<number | string>,
        contextId?: string, defaultRouting?: boolean, defaultToggle?: boolean
    ): ITable {

        tableConfiguration = this.setDefaultTableConfiguration(tableConfiguration, defaultRouting, defaultToggle);
        const table = new Table(tableKey, tableConfiguration);

        table.setContentProvider(new FAQArticleHistoryContentProvider(table, null, null, contextId));
        table.setColumnConfiguration(tableConfiguration.tableColumns);

        return table;
    }

    private setDefaultTableConfiguration(
        tableConfiguration: TableConfiguration, defaultRouting?: boolean, defaultToggle?: boolean
    ): TableConfiguration {
        const tableColumns = [
            new DefaultColumnConfiguration(FAQArticleHistoryProperty.NAME, true, false, true, true, 200),
            new DefaultColumnConfiguration(FAQArticleHistoryProperty.CREATED_BY, true, false, true, true, 300),
            new DefaultColumnConfiguration(
                FAQArticleHistoryProperty.CREATED, true, false, true, true, 150, true, false, false, DataType.DATE_TIME
            )
        ];

        if (!tableConfiguration) {
            tableConfiguration = new TableConfiguration(
                KIXObjectType.FAQ_ARTICLE_HISTORY, null, null, tableColumns,  null, null, null, null,
                TableHeaderHeight.SMALL
            );
        } else if (!tableConfiguration.tableColumns) {
            tableConfiguration.tableColumns = tableColumns;
        }

        return tableConfiguration;
    }

    // TODO: implementieren
    public getDefaultColumnConfiguration(property: string): IColumnConfiguration {
        return;
    }

}
