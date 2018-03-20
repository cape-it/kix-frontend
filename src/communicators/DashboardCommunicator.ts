import { KIXCommunicator } from './KIXCommunicator';
import {
    IWidget,
    ConfiguredWidget,
    DashboardEvent,
    DashboardConfiguration,
    LoadDashboardRequest,
    LoadDashboardResponse,
    SaveDashboardRequest,
    SaveWidgetRequest,
    SocketEvent,
    User,
    WidgetConfiguration,
    WidgetTemplate
} from '@kix/core/dist/model';

import { IWidgetFactoryExtension } from '@kix/core/dist/extensions/';

export class DashboardCommunicator extends KIXCommunicator {

    private client: SocketIO.Socket;

    public getNamespace(): string {
        return 'dashboard';
    }

    protected registerEvents(client: SocketIO.Socket): void {
        this.client = client;
        client.on(DashboardEvent.LOAD_DASHBOARD, this.loadDashboard.bind(this));
        client.on(DashboardEvent.SAVE_DASHBOARD, this.saveDashboard.bind(this));
        client.on(DashboardEvent.SAVE_WIDGET_CONFIGURATION, this.saveWidgetConfiguration.bind(this));
    }

    protected async loadDashboard(data: LoadDashboardRequest): Promise<void> {
        const user = await this.userService.getUserByToken(data.token);
        const userId = user.UserID;

        let configuration: DashboardConfiguration = await this.configurationService
            .getModuleConfiguration(data.contextId, userId);

        if (!configuration) {
            const moduleFactory = await this.pluginService.getModuleFactory(data.contextId);
            const moduleDefaultConfiguration = moduleFactory.getDefaultConfiguration();
            await this.configurationService.saveModuleConfiguration(
                data.contextId, userId, moduleDefaultConfiguration);

            configuration = moduleDefaultConfiguration;
        }

        const availableWidgets = await this.widgetRepositoryService.getAvailableWidgets(data.contextId);

        configuration.contextId = data.contextId;
        configuration.availableWidgets = availableWidgets;

        const response = new LoadDashboardResponse(configuration);
        this.client.emit(DashboardEvent.DASHBOARD_LOADED, response);
    }

    private async saveDashboard(data: SaveDashboardRequest): Promise<void> {
        const user = await this.userService.getUserByToken(data.token);
        const userId = user && user.UserID;

        await this.configurationService
            .saveModuleConfiguration(data.contextId, userId, data.configuration);

        this.client.emit(DashboardEvent.DASHBOARD_SAVED);
    }

    private async saveWidgetConfiguration(data: SaveWidgetRequest): Promise<void> {
        const user = await this.userService.getUserByToken(data.token);
        const userId = user && user.UserID;

        const moduleConfiguration: DashboardConfiguration = await this.configurationService.getModuleConfiguration(
            data.contextId,
            userId
        );
        if (moduleConfiguration) {
            let index = moduleConfiguration.contentConfiguredWidgets.findIndex(
                (cw) => cw.instanceId === data.instanceId
            );
            if (index > -1) {
                moduleConfiguration.contentConfiguredWidgets[index].configuration = data.widgetConfiguration;
            } else {
                index = moduleConfiguration.sidebarConfiguredWidgets.findIndex(
                    (cw) => cw.instanceId === data.instanceId
                );
                moduleConfiguration.sidebarConfiguredWidgets[index].configuration = data.widgetConfiguration;
            }

            await this.configurationService.saveModuleConfiguration(
                data.contextId, userId, moduleConfiguration
            );
            this.client.emit(DashboardEvent.WIDGET_CONFIGURATION_SAVED);
        }
    }
}
