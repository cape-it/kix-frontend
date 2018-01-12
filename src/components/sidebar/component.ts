import { SidebarComponentState } from './model/SidebarComponentState';
import { DashboardStore } from '@kix/core/dist/browser/dashboard/DashboardStore';
import { ConfiguredWidget, DashboardConfiguration, WidgetType } from '@kix/core/dist/model';
import { ApplicationStore } from '@kix/core/dist/browser/application/ApplicationStore';
import { ContextService } from '@kix/core/dist/browser/context/ContextService';
import { ClientStorageHandler } from '@kix/core/dist/browser/ClientStorageHandler';

class SidebarComponent {

    private state: SidebarComponentState;

    public onCreate(input: any): void {
        this.state = new SidebarComponentState();
    }

    public onInput(input: any): void {
        if (input.hasOwnProperty('showIconBar') && input.showIconBar === false) {
            this.state.showIconBar = false;
        }

        this.state.context = input.context;
    }

    public onMount(): void {
        ApplicationStore.getInstance().addStateListener(this.applicationStateChanged.bind(this));
        ContextService.getInstance().addContextListener(this.contextStateChanged.bind(this));
    }

    private applicationStateChanged(): void {
        //
    }

    private contextStateChanged(): void {
        const context = ContextService.getInstance().getActiveContext();
        this.state.configuredWidgets = context ? context.getWidgets(WidgetType.SIDEBAR) : [];
        if (context && context.dashboardConfiguration) {
            this.state.rows = context.dashboardConfiguration.sidebarRows[0];
        }
    }

    private toggleSidebarWidget(instanceId: string): void {
        if (this.state.configuredWidgets) {

            const configuredWidget = this.state.configuredWidgets.find((cw) => cw.instanceId === instanceId);

            if (configuredWidget) {
                configuredWidget.configuration.show = !configuredWidget.configuration.show;

                DashboardStore.getInstance().saveWidgetConfiguration(
                    configuredWidget.instanceId,
                    configuredWidget.configuration,
                );

                (this as any).setStateDirty('configuredWidgets');
            }
        }
    }

    private sidebarAvailable(instanceId: string): boolean {
        return this.state.rows ? this.state.rows.some((r) => r === instanceId) : false;
    }

    private showSidebar(widget: ConfiguredWidget): boolean {
        return (
            (
                this.isConfigMode() ||
                widget.configuration.show
            ) &&
            this.sidebarAvailable(widget.instanceId)
        );
    }

    private getWidgetTemplate(instanceId: string): any {
        const context = ContextService.getInstance().getActiveContext();
        return context ? context.getWidgetTemplate(instanceId) : undefined;
    }

    private isConfigMode(): boolean {
        return ApplicationStore.getInstance().isConfigurationMode();
    }

    private isConfigDialogShown(): boolean {
        return ApplicationStore.getInstance().isShowDialog();
    }

    private hasSidebarsToShow(): boolean {
        return this.state.configuredWidgets.some((w) => w.configuration.show);
    }
}

module.exports = SidebarComponent;
