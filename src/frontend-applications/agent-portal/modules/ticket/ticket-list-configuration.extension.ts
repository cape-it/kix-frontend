/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IConfigurationExtension } from "../../server/extensions/IConfigurationExtension";
import { TicketListContext } from "./webapp/core";
import { IConfiguration } from "../../model/configuration/IConfiguration";
import { WidgetConfiguration } from "../../model/configuration/WidgetConfiguration";
import { ConfigurationType } from "../../model/configuration/ConfigurationType";
import { TableConfiguration } from "../../model/configuration/TableConfiguration";
import { KIXObjectType } from "../../model/kix/KIXObjectType";
import { KIXObjectLoadingOptions } from "../../model/KIXObjectLoadingOptions";
import { FilterCriteria } from "../../model/FilterCriteria";
import { SearchOperator } from "../search/model/SearchOperator";
import { FilterDataType } from "../../model/FilterDataType";
import { FilterType } from "../../model/FilterType";
import { TableHeaderHeight } from "../../model/configuration/TableHeaderHeight";
import { TableRowHeight } from "../../model/configuration/TableRowHeight";
import { TableWidgetConfiguration } from "../../model/configuration/TableWidgetConfiguration";
import { ConfigurationDefinition } from "../../model/configuration/ConfigurationDefinition";
import { ContextConfiguration } from "../../model/configuration/ContextConfiguration";
import { ConfiguredWidget } from "../../model/configuration/ConfiguredWidget";
import { ToggleOptions } from "../base-components/webapp/core/table";

export class TicketModuleFactoryExtension implements IConfigurationExtension {

    public getModuleId(): string {
        return TicketListContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<IConfiguration[]> {
        const configurations = [];

        const notesSidebar = new WidgetConfiguration(
            'user-ticket-list-notes-widget', 'User Ticket List Notes Widget', ConfigurationType.Widget,
            'notes-widget', 'Translatable#Notes', [], null, null, false, false, 'kix-icon-note', false
        );
        configurations.push(notesSidebar);

        const tableConfig = new TableConfiguration(
            'user-ticket-list-table', 'User Ticket List Table', ConfigurationType.Table,
            KIXObjectType.TICKET, new KIXObjectLoadingOptions([
                new FilterCriteria(
                    'StateType', SearchOperator.EQUALS, FilterDataType.STRING, FilterType.AND, 'Open'
                )
            ]),
            null, null, null, true, true, new ToggleOptions('ticket-article-details', 'article', [], true),
            null, TableHeaderHeight.LARGE, TableRowHeight.LARGE
        );
        configurations.push(tableConfig);

        const tableWidgetConfig = new TableWidgetConfiguration(
            'user-ticket-list-table-widget-config', 'User Ticket List Widget Config', ConfigurationType.TableWidget,
            KIXObjectType.TICKET, null,
            new ConfigurationDefinition('user-ticket-list-table', ConfigurationType.Table)
        );
        configurations.push(tableWidgetConfig);

        const tableWidget = new WidgetConfiguration(
            'user-ticket-list-table-widget', 'User Ticket List Table Widget', ConfigurationType.Widget,
            'table-widget', 'Translatable#Tickets',
            [
                'bulk-action', 'ticket-create-action', 'ticket-search-action', 'csv-export-action'
            ],
            new ConfigurationDefinition('user-ticket-list-table-widget-config', ConfigurationType.TableWidget),
            null, false, false, null, true
        );
        configurations.push(tableWidget);

        configurations.push(
            new ContextConfiguration(
                this.getModuleId(), 'User Ticket List', ConfigurationType.Context,
                this.getModuleId(),
                [
                    new ConfiguredWidget('user-ticket-list-notes-widget', 'user-ticket-list-notes-widget')
                ],
                [], [],
                [
                    new ConfiguredWidget('user-ticket-list-table-widget', 'user-ticket-list-table-widget')
                ]
            )
        );

        return configurations;
    }

    public async getFormConfigurations(): Promise<IConfiguration[]> {
        return [];
    }

}

module.exports = (data, host, options) => {
    return new TicketModuleFactoryExtension();
};