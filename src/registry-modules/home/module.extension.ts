import { IModuleFactoryExtension } from '@kix/core/dist/extensions';
import {
    WidgetConfiguration, WidgetType, DashboardConfiguration, ConfiguredWidget, WidgetSize, DataType
} from '@kix/core/dist/model';
import { TableColumnConfiguration } from '@kix/core/dist/browser';

export class DashboardModuleFactoryExtension implements IModuleFactoryExtension {

    public getModuleId(): string {
        return "home";
    }

    public getDefaultConfiguration(): DashboardConfiguration {

        const chart1 =
            new ConfiguredWidget("20170920072542", new WidgetConfiguration(
                "chart-widget", "Chart", [], {
                    chartType: 'bar',
                    templateId: 'home-dashboard-priorities',
                    attributes: ['PriorityID'],
                    showLegend: true,
                    showAxes: true,
                    showValues: true
                },
                WidgetType.CONTENT, false, true, true, WidgetSize.SMALL, null, true)
            );
        const chart2 =
            new ConfiguredWidget("20170920084512", new WidgetConfiguration(
                "chart-widget", "Chart 2", [], {
                    chartType: 'pie',
                    templateId: 'home-dashboard-states',
                    attributes: ['StateID'],
                    showLegend: true,
                    showAxes: true,
                    showValues: true
                },
                WidgetType.CONTENT, false, true, true, WidgetSize.SMALL, null, true)
            );
        const searchTemplateWidget =
            new ConfiguredWidget("20170920113214", new WidgetConfiguration(
                "search-templates-widget", "Suchvorlagen", [], {
                    widgetId: '',
                    title: '',
                    actions: [],
                    settings: {},
                    show: true,
                    size: WidgetSize.SMALL,
                    icon: null,
                    contextDependent: false
                },
                WidgetType.CONTENT, false, true, true, WidgetSize.SMALL, null, true)
            );

        const ticketListWidget =
            new ConfiguredWidget("20170920101621", new WidgetConfiguration(
                "ticket-list-widget", "Ticket-Liste", [], {
                    limit: 500,
                    displayLimit: 15,
                    showTotalCount: true,
                    tableColumns: [
                        new TableColumnConfiguration('TicketNumber', true, false, true, true, 130),
                        new TableColumnConfiguration('PriorityID', false, true, false, false, 100),
                        new TableColumnConfiguration('StateID', false, true, true, true, 100),
                        new TableColumnConfiguration('QueueID', true, true, true, true, 200),
                        new TableColumnConfiguration('TypeID', true, true, true, true, 100),
                        new TableColumnConfiguration('Title', true, false, true, true, 200),
                        new TableColumnConfiguration(
                            'Created', true, false, true, true, 100, DataType.DATE_TIME
                        ),
                        new TableColumnConfiguration(
                            'Age', true, false, true, true, 100, DataType.DATE_TIME
                        ),
                    ]
                },
                WidgetType.CONTENT, false, true, true, WidgetSize.SMALL, null, true)
            );

        const contentRows: string[][] = [['20170920101621']];
        const contentConfiguredWidgets: Array<ConfiguredWidget<any>> =
            [chart1, chart2, searchTemplateWidget, ticketListWidget];


        const notes =
            new ConfiguredWidget("20170915101514", new WidgetConfiguration(
                "notes-widget", "Notes", [], {
                    notes: 'Test <strong style="color:red">123</strong>'
                },
                WidgetType.SIDEBAR, false, false, true, WidgetSize.SMALL, 'kix-icon-note', false)
            );
        const notes2 =
            new ConfiguredWidget("20170915094112",
                new WidgetConfiguration(
                    "notes-widget", "Notes 2", [], { notes: '' }, WidgetType.SIDEBAR,
                    false, false, true, WidgetSize.SMALL, 'kix-icon-note', false
                )
            );
        const sidebars: string[] = ['20170915101514', '20170915094112'];
        const sidebarConfiguredWidgets: Array<ConfiguredWidget<any>> = [notes, notes2];

        return new DashboardConfiguration(
            this.getModuleId(), contentRows, [], [],
            contentConfiguredWidgets, sidebarConfiguredWidgets, [], []
        );
    }

}

module.exports = (data, host, options) => {
    return new DashboardModuleFactoryExtension();
};
