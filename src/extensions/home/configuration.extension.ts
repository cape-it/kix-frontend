/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IConfigurationExtension } from '../../core/extensions';
import {
    WidgetConfiguration, ConfiguredWidget, WidgetSize, DataType,
    FilterCriteria, FilterDataType, FilterType, KIXObjectPropertyFilter,
    TableFilterCriteria, KIXObjectType, SortOrder, ContextConfiguration, CRUD,
    TableWidgetConfiguration, KIXObjectLoadingOptions, ChartComponentConfiguration
} from '../../core/model';
import {
    SearchOperator, ToggleOptions, TableConfiguration, DefaultColumnConfiguration
} from '../../core/browser';
import { HomeContext } from '../../core/browser/home';
import { TicketProperty } from '../../core/model/';
import { UIComponentPermission } from '../../core/model/UIComponentPermission';
import { SysConfigService } from '../../core/browser/sysconfig';
import { ConfigurationType, ConfigurationDefinition } from '../../core/model/configuration';
import { TicketChartWidgetConfiguration } from '../../core/browser/ticket';
import { ModuleConfigurationService } from '../../services';

export class DashboardModuleFactoryExtension implements IConfigurationExtension {

    public getModuleId(): string {
        return HomeContext.CONTEXT_ID;
    }

    public async createDefaultConfiguration(): Promise<ContextConfiguration> {

        const stateTypes = await SysConfigService.getInstance().getTicketViewableStateTypes();

        const stateTypeFilterCriteria = new FilterCriteria(
            TicketProperty.STATE_TYPE, SearchOperator.IN, FilterDataType.STRING, FilterType.AND, stateTypes
        );

        const chartConfig1 = new ChartComponentConfiguration(
            'home-dashboard-ticket-chart-widget-priorities-config', 'Priority Chart', ConfigurationType.Chart,
            {
                type: 'bar',
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: 6
                            }
                        }]
                    }
                },
                data: {
                    datasets: [
                        {
                            backgroundColor: [
                                "rgb(91, 91, 91)",
                                "rgb(4, 83, 125)",
                                "rgb(0, 141, 210)",
                                "rgb(129, 189, 223)",
                                "rgb(160, 230, 200)",
                                "rgb(130, 200, 38)",
                                "rgb(0, 152, 70)",
                                "rgb(227, 30, 36)",
                                "rgb(239, 127, 26)",
                                "rgb(254, 204, 0)"
                            ]
                        }
                    ]
                }
            }
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartConfig1);

        const chartWidgetConfig1 = new TicketChartWidgetConfiguration(
            'home-dashboard-ticket-chart-widget-priorities', 'Priority Chart', ConfigurationType.ChartWidget,
            TicketProperty.PRIORITY_ID,
            new ConfigurationDefinition(
                'home-dashboard-ticket-chart-widget-priorities-config', ConfigurationType.Chart
            ),
            null, new KIXObjectLoadingOptions([stateTypeFilterCriteria])
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartWidgetConfig1);

        const chart1 = new WidgetConfiguration(
            'home-dashboard-ticket-chart-widget-priorities', 'Priority Chart Widget', ConfigurationType.Widget,
            'ticket-chart-widget', 'Overview Ticket Priorities', [],
            new ConfigurationDefinition('home-dashboard-ticket-chart-widget-priorities', ConfigurationType.ChartWidget),
            null, false, true, null, false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chart1);


        const chartConfig2 = new ChartComponentConfiguration(
            'home-dashboard-ticket-chart-widget-states-config', 'States Chart', ConfigurationType.Chart,
            {
                type: 'pie',
                options: {
                    legend: {
                        display: true,
                        position: 'right'
                    }
                },
                data: {
                    datasets: [
                        {
                            fill: true,
                            backgroundColor: [
                                "rgb(91, 91, 91)",
                                "rgb(4, 83, 125)",
                                "rgb(0, 141, 210)",
                                "rgb(129, 189, 223)",
                                "rgb(160, 230, 200)",
                                "rgb(130, 200, 38)",
                                "rgb(0, 152, 70)",
                                "rgb(227, 30, 36)",
                                "rgb(239, 127, 26)",
                                "rgb(254, 204, 0)"
                            ]
                        }
                    ]
                }
            }
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartConfig2);

        const chartWidgetConfig2 = new TicketChartWidgetConfiguration(
            'home-dashboard-ticket-chart-widget-states', 'States Chart', ConfigurationType.ChartWidget,
            TicketProperty.STATE_ID,
            new ConfigurationDefinition('home-dashboard-ticket-chart-widget-states-config', ConfigurationType.Chart),
            null, new KIXObjectLoadingOptions([stateTypeFilterCriteria])
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartWidgetConfig2);

        const chart2 = new WidgetConfiguration(
            'home-dashboard-ticket-chart-widget-states', 'Priority Chart Widget', ConfigurationType.Widget,
            'ticket-chart-widget', 'Overview Ticket States', [],
            new ConfigurationDefinition('home-dashboard-ticket-chart-widget-states', ConfigurationType.ChartWidget),
            null, false, true, null, false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chart2);

        const chartConfig3 = new ChartComponentConfiguration(
            'home-dashboard-ticket-chart-widget-new-config', 'New Tickets Chart', ConfigurationType.Chart,
            {
                type: 'line',
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: 6
                            }
                        }]
                    }
                },
                data: {
                    datasets: [{
                        backgroundColor: [
                            "rgb(91, 91, 91)",
                            "rgb(4, 83, 125)",
                            "rgb(0, 141, 210)",
                            "rgb(129, 189, 223)",
                            "rgb(160, 230, 200)",
                            "rgb(130, 200, 38)",
                            "rgb(0, 152, 70)",
                            "rgb(227, 30, 36)",
                            "rgb(239, 127, 26)",
                            "rgb(254, 204, 0)"
                        ]
                    }]
                },
            }
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartConfig3);

        const chartWidgetConfig3 = new TicketChartWidgetConfiguration(
            'home-dashboard-ticket-chart-widget-new', 'States Chart', ConfigurationType.ChartWidget,
            TicketProperty.CREATED,
            new ConfigurationDefinition('home-dashboard-ticket-chart-widget-new-config', ConfigurationType.Chart),
            null, new KIXObjectLoadingOptions([stateTypeFilterCriteria])
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chartWidgetConfig3);

        const chart3 = new WidgetConfiguration(
            'home-dashboard-ticket-chart-widget-new', 'New Tickets Chart Widget', ConfigurationType.Widget,
            'ticket-chart-widget', 'Translatable#New Tickets (recent 7 days)', [],
            new ConfigurationDefinition('home-dashboard-ticket-chart-widget-new', ConfigurationType.ChartWidget),
            null, false, true, null, false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(chart3);

        const predefinedToDoTableFilter = [
            new KIXObjectPropertyFilter('Translatable#Responsible Tickets', [
                new TableFilterCriteria(
                    TicketProperty.RESPONSIBLE_ID, SearchOperator.EQUALS, KIXObjectType.CURRENT_USER
                )
            ]),
            new KIXObjectPropertyFilter('Translatable#Owner', [
                new TableFilterCriteria(TicketProperty.OWNER_ID, SearchOperator.EQUALS, KIXObjectType.CURRENT_USER)
            ]),
            new KIXObjectPropertyFilter('Translatable#Watched Tickets', [
                new TableFilterCriteria(
                    TicketProperty.WATCHERS, SearchOperator.EQUALS, KIXObjectType.CURRENT_USER, true
                )
            ]),
        ];

        const tableTodoConfiguration = new TableConfiguration(
            'home-dashboard-ticket-table-todo', 'Todo Table', ConfigurationType.Table,
            KIXObjectType.TICKET,
            new KIXObjectLoadingOptions(
                [
                    new FilterCriteria(
                        TicketProperty.OWNER_ID, SearchOperator.EQUALS,
                        FilterDataType.STRING, FilterType.OR, KIXObjectType.CURRENT_USER
                    ),
                    new FilterCriteria(
                        TicketProperty.RESPONSIBLE_ID, SearchOperator.EQUALS,
                        FilterDataType.STRING, FilterType.OR, KIXObjectType.CURRENT_USER
                    ),
                    new FilterCriteria(
                        TicketProperty.LOCK_ID, SearchOperator.EQUALS,
                        FilterDataType.NUMERIC, FilterType.AND, 2
                    ),
                    stateTypeFilterCriteria
                ], 'Ticket.Age:numeric', 500, [TicketProperty.WATCHERS]
            ), null, null, null, true, true, new ToggleOptions('ticket-article-details', 'article', [], true)
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(tableTodoConfiguration);

        const tableTodoWidgetConfiguration = new TableWidgetConfiguration(
            'home-dashboard-ticket-table-todo-widget', 'Todo Table Widget', ConfigurationType.TableWidget,
            KIXObjectType.TICKET, [TicketProperty.AGE, SortOrder.UP],
            new ConfigurationDefinition('home-dashboard-ticket-table-todo', ConfigurationType.Table),
            null, null, true, null, predefinedToDoTableFilter
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(tableTodoWidgetConfiguration);

        const todoWidget = new WidgetConfiguration(
            'home-dashboard-todo-widget', 'Todo Widget', ConfigurationType.Widget,
            'table-widget', 'Translatable#ToDo / Processing required', ['bulk-action', 'csv-export-action'],
            new ConfigurationDefinition('home-dashboard-ticket-table-todo-widget', ConfigurationType.TableWidget),
            null, false, true, 'kix-icon-ticket', false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(todoWidget);

        const newTicketsTableConfig = new TableConfiguration(
            'home-dashboard-ticket-table-new', 'New Tickets Table', ConfigurationType.Table,
            KIXObjectType.TICKET,
            new KIXObjectLoadingOptions(
                [
                    new FilterCriteria(
                        TicketProperty.STATE_ID, SearchOperator.EQUALS,
                        FilterDataType.NUMERIC, FilterType.OR, 1
                    )
                ], 'Ticket.-Age:numeric', 500, [TicketProperty.WATCHERS]
            ),
            null,
            [
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.PRIORITY_ID, false, true, true, false, 65, true, true, true
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.TICKET_NUMBER, true, false, true, true, 135, true, true
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.TITLE, true, false, true, true, 463, true, true
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.QUEUE_ID, true, false, true, true, 175, true, true, true
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.ORGANISATION_ID, true, false, true, true, 225, true, true
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.CREATED, true, false, true, true, 155,
                    true, true, false, DataType.DATE_TIME
                ),
                new DefaultColumnConfiguration(null, null, null,
                    TicketProperty.AGE, true, false, true, true, 90,
                    true, true, false, DataType.DATE_TIME
                ),
            ], null,
            true, true, new ToggleOptions('ticket-article-details', 'article', [], true)
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(newTicketsTableConfig);

        const newTicketsTableWidget = new TableWidgetConfiguration(
            'home-dashboard-ticket-new-table-widget', 'New Tickets Table Widget', ConfigurationType.TableWidget,
            KIXObjectType.TICKET, [TicketProperty.AGE, SortOrder.DOWN],
            new ConfigurationDefinition('home-dashboard-ticket-table-new', ConfigurationType.Table),
            null, null, true
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(newTicketsTableWidget);

        const newTicketsWidget = new WidgetConfiguration(
            'home-dashboard-new-tickets-widget', 'New Tickets Widget', ConfigurationType.Widget,
            'table-widget', 'New Tickets', ['bulk-action', 'csv-export-action'],
            new ConfigurationDefinition('home-dashboard-ticket-new-table-widget', ConfigurationType.TableWidget),
            null, false, true, 'kix-icon-ticket', false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(newTicketsWidget);

        // sidebars
        const notesSidebar = new WidgetConfiguration(
            'home-dashboard-notes-widget', 'Notes', ConfigurationType.Widget,
            'notes-widget', 'Translatable#Notes', [], null, null,
            false, false, 'kix-icon-note', false
        );
        await ModuleConfigurationService.getInstance().saveConfiguration(notesSidebar);

        return new ContextConfiguration(
            this.getModuleId(), this.getModuleId(), ConfigurationType.Context,
            this.getModuleId(),
            [
                new ConfiguredWidget('home-dashboard-notes-widget', 'home-dashboard-notes-widget')
            ],
            [], [],
            [
                new ConfiguredWidget(
                    'home-dashboard-ticket-chart-widget-priorities', 'home-dashboard-ticket-chart-widget-priorities',
                    null, [new UIComponentPermission('tickets', [CRUD.READ])], WidgetSize.SMALL
                ),
                new ConfiguredWidget(
                    'home-dashboard-ticket-chart-widget-states', 'home-dashboard-ticket-chart-widget-states', null,
                    [new UIComponentPermission('tickets', [CRUD.READ])], WidgetSize.SMALL
                ),
                new ConfiguredWidget(
                    'home-dashboard-ticket-chart-widget-new', 'home-dashboard-ticket-chart-widget-new', null,
                    [new UIComponentPermission('tickets', [CRUD.READ])], WidgetSize.SMALL
                ),
                new ConfiguredWidget(
                    'home-dashboard-todo-widget', 'home-dashboard-todo-widget', null,
                    [new UIComponentPermission('tickets', [CRUD.READ])]
                ),
                new ConfiguredWidget(
                    'home-dashboard-new-tickets-widget', 'home-dashboard-new-tickets-widget', null,
                    [new UIComponentPermission('tickets', [CRUD.READ])]
                )
            ]
        );
    }

    public async createFormConfigurations(overwrite: boolean): Promise<void> {
        // do nothing
    }

}

module.exports = (data, host, options) => {
    return new DashboardModuleFactoryExtension();
};
