/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */


import { RoleTableContentProvider } from './RoleTableContentProvider';
import { TableFactory } from '../../../../../../base-components/webapp/core/table/TableFactory';
import { KIXObjectType } from '../../../../../../../model/kix/KIXObjectType';
import { TableConfiguration } from '../../../../../../../model/configuration/TableConfiguration';
import { Table } from '../../../../../../base-components/webapp/core/table';
import { DefaultColumnConfiguration } from '../../../../../../../model/configuration/DefaultColumnConfiguration';
import { RoleProperty } from '../../../../../model/RoleProperty';
import { DataType } from '../../../../../../../model/DataType';
import { TableHeaderHeight } from '../../../../../../../model/configuration/TableHeaderHeight';
import { TableRowHeight } from '../../../../../../../model/configuration/TableRowHeight';
import { RoutingConfiguration } from '../../../../../../../model/configuration/RoutingConfiguration';
import { ContextMode } from '../../../../../../../model/ContextMode';
import { RoleDetailsContext } from '../../context/RoleDetailsContext';

export class RoleTableFactory extends TableFactory {

    public objectType: KIXObjectType | string = KIXObjectType.ROLE;

    public async createTable(
        tableKey: string, tableConfiguration?: TableConfiguration, objectIds?: Array<number | string>,
        contextId?: string, defaultRouting?: boolean, defaultToggle?: boolean
    ): Promise<Table> {

        tableConfiguration = this.setDefaultTableConfiguration(tableConfiguration, defaultRouting, defaultToggle);
        const table = new Table(tableKey, tableConfiguration);

        table.setContentProvider(new RoleTableContentProvider(table, objectIds, null, contextId));
        table.setColumnConfiguration(tableConfiguration.tableColumns);

        return table;
    }

    private setDefaultTableConfiguration(
        tableConfiguration: TableConfiguration, defaultRouting?: boolean, defaultToggle?: boolean
    ): TableConfiguration {
        const tableColumns = [
            new DefaultColumnConfiguration(null, null, null,
                RoleProperty.NAME, true, false, true, false, 300, true, true, false,
                DataType.STRING, true, null, null, false
            ),
            new DefaultColumnConfiguration(null, null, null,
                RoleProperty.COMMENT, true, false, true, false, 400, true, true, false,
                DataType.STRING, true, null, null, false
            ),
            new DefaultColumnConfiguration(
                null, null, null, RoleProperty.VALID_ID, true, false, true, false, 150, true, true, true),
            new DefaultColumnConfiguration(null, null, null,
                RoleProperty.CREATE_TIME, true, false, true, false, 150, true, true, false, DataType.DATE_TIME
            ),
            new DefaultColumnConfiguration(
                null, null, null, RoleProperty.CREATE_BY, true, false, true, false, 150, true, true),
            new DefaultColumnConfiguration(null, null, null,
                RoleProperty.CHANGE_TIME, true, false, true, false, 150, true, true, false, DataType.DATE_TIME
            ),
            new DefaultColumnConfiguration(
                null, null, null, RoleProperty.CHANGE_BY, true, false, true, false, 150, true, true)
        ];

        if (!tableConfiguration) {
            tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.ROLE, null, null, tableColumns, [], true, false, null, null,
                TableHeaderHeight.LARGE, TableRowHeight.LARGE
            );
            defaultRouting = true;
        } else if (!tableConfiguration.tableColumns) {
            tableConfiguration.tableColumns = tableColumns;
        }

        if (defaultRouting) {
            tableConfiguration.routingConfiguration = new RoutingConfiguration(
                RoleDetailsContext.CONTEXT_ID, KIXObjectType.ROLE,
                ContextMode.DETAILS, RoleProperty.ID
            );
        }

        return tableConfiguration;
    }
}
