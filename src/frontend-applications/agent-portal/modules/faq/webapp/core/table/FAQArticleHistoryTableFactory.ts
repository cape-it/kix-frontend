/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { TableFactory } from '../../../../base-components/webapp/core/table/TableFactory';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { TableConfiguration } from '../../../../../model/configuration/TableConfiguration';
import { Table } from '../../../../base-components/webapp/core/table';
import { FAQArticleHistoryContentProvider } from '.';
import { DefaultColumnConfiguration } from '../../../../../model/configuration/DefaultColumnConfiguration';
import { FAQArticleHistoryProperty } from '../../../model/FAQArticleHistoryProperty';
import { DataType } from '../../../../../model/DataType';
import { TableHeaderHeight } from '../../../../../model/configuration/TableHeaderHeight';

export class FAQArticleHistoryTableFactory extends TableFactory {

    public objectType: KIXObjectType | string = KIXObjectType.FAQ_ARTICLE_HISTORY;

    public async createTable(
        tableKey: string, tableConfiguration?: TableConfiguration, objectIds?: Array<number | string>,
        contextId?: string, defaultRouting?: boolean, defaultToggle?: boolean
    ): Promise<Table> {

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
            new DefaultColumnConfiguration(
                null, null, null, FAQArticleHistoryProperty.NAME, true, false, true, true, 200),
            new DefaultColumnConfiguration(null, null, null,
                FAQArticleHistoryProperty.CREATED, true, false, true, true, 150, true, false, false, DataType.DATE_TIME
            ),
            new DefaultColumnConfiguration(
                null, null, null, FAQArticleHistoryProperty.CREATED_BY, true, false, true, true, 300)
        ];

        if (!tableConfiguration) {
            tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.FAQ_ARTICLE_HISTORY, null, null, tableColumns, [], null, null, null, null,
                TableHeaderHeight.SMALL
            );
        } else if (!tableConfiguration.tableColumns) {
            tableConfiguration.tableColumns = tableColumns;
        }

        return tableConfiguration;
    }

}
