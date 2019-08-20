/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { TableFactory } from "../table/TableFactory";
import { KIXObjectType, KIXObjectProperty, DataType } from "../../model";
import {
    TableConfiguration, ITable, Table, TableHeaderHeight, TableRowHeight,
    IColumnConfiguration, DefaultColumnConfiguration
} from "../table";
import { WebformTableContentProvider } from "./WebformTableContentProvider";
import { WebformProperty } from "../../model/webform";

export class WebformTableFactory extends TableFactory {

    public objectType: KIXObjectType = KIXObjectType.WEBFORM;

    public createTable(
        tableKey: string, tableConfiguration?: TableConfiguration, objectIds?: number[], contextId?: string,
        defaultRouting?: boolean, defaultToggle?: boolean
    ): ITable {

        tableConfiguration = this.setDefaultTableConfiguration(tableConfiguration, defaultRouting, defaultToggle);

        const table = new Table(tableKey, tableConfiguration);
        table.setContentProvider(new WebformTableContentProvider(table, objectIds, null, contextId));
        table.setColumnConfiguration(tableConfiguration.tableColumns);

        return table;
    }

    private setDefaultTableConfiguration(
        tableConfiguration: TableConfiguration, defaultRouting?: boolean, defaultToggle?: boolean
    ): TableConfiguration {
        const tableColumns = [
            this.getDefaultColumnConfiguration(WebformProperty.TITLE),
            this.getDefaultColumnConfiguration(WebformProperty.QUEUE_ID),
            this.getDefaultColumnConfiguration(WebformProperty.PRIORITY_ID),
            this.getDefaultColumnConfiguration(WebformProperty.TYPE_ID),
            this.getDefaultColumnConfiguration(WebformProperty.STATE_ID),
            this.getDefaultColumnConfiguration(KIXObjectProperty.VALID_ID),
            this.getDefaultColumnConfiguration(KIXObjectProperty.CREATE_TIME),
            this.getDefaultColumnConfiguration(KIXObjectProperty.CREATE_BY),
            this.getDefaultColumnConfiguration(KIXObjectProperty.CHANGE_TIME),
            this.getDefaultColumnConfiguration(KIXObjectProperty.CHANGE_BY)
        ];

        if (!tableConfiguration) {
            tableConfiguration = new TableConfiguration(
                KIXObjectType.WEBFORM, null, null, tableColumns, true, false, null, null,
                TableHeaderHeight.LARGE, TableRowHeight.LARGE
            );
            defaultRouting = true;
        } else if (!tableConfiguration.tableColumns) {
            tableConfiguration.tableColumns = tableColumns;
        }

        if (defaultRouting) {
            // tableConfiguration.routingConfiguration = new RoutingConfiguration(
            //     WebformDetailsContext.CONTEXT_ID, KIXObjectType.TICKET_STATE,
            //     ContextMode.DETAILS, WebformProperty.ID
            // );
        }

        return tableConfiguration;
    }

    public getDefaultColumnConfiguration(property: string): IColumnConfiguration {
        let config = new DefaultColumnConfiguration(
            property, true, false, true, false, 150, true, true, false, DataType.STRING, true
        );

        if (property === WebformProperty.PRIORITY_ID) {
            config = new DefaultColumnConfiguration(
                property, false, true, true, false, 80, true, true, true, DataType.STRING, false
            );
        } else if (property === WebformProperty.STATE_ID) {
            config = new DefaultColumnConfiguration(
                property, true, true, true, false, 120, true, true, true, DataType.STRING, true
            );
        } else if (property === KIXObjectProperty.VALID_ID) {
            config = new DefaultColumnConfiguration(
                property, true, false, true, false, 150, true, true, true, DataType.STRING, true
            );
        }

        return config;
    }
}
