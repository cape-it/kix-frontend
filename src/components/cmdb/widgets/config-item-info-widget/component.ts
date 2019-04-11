import { ComponentState } from "./ComponentState";
import { ContextService, ActionFactory, IdService } from "../../../../core/browser";
import { KIXObjectType, Context, ConfigItem, ConfigItemProperty, ObjectIcon } from "../../../../core/model";
import { ConfigItemLabelProvider } from "../../../../core/browser/cmdb";

class Component {

    private state: ComponentState;
    private contextListenerId: string = null;

    public labelProvider: ConfigItemLabelProvider = new ConfigItemLabelProvider();
    public properties;

    public onCreate(input: any): void {
        this.state = new ComponentState();
        this.contextListenerId = IdService.generateDateBasedId('config-item-info-widget');
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        this.labelProvider = new ConfigItemLabelProvider();
        this.properties = ConfigItemProperty;

        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        context.registerListener(this.contextListenerId, {
            objectChanged: (id: string | number, configItem: ConfigItem, type: KIXObjectType) => {
                if (type === KIXObjectType.CONFIG_ITEM) {
                    this.initWidget(context, configItem);
                }
            },
            sidebarToggled: () => { return; },
            explorerBarToggled: () => { return; },
            objectListChanged: () => { return; },
            filteredObjectListChanged: () => { return; },
            scrollInformationChanged: () => { return; }
        });

        await this.initWidget(context, await context.getObject<ConfigItem>());
    }

    private async initWidget(context: Context, configItem?: ConfigItem): Promise<void> {
        this.state.loading = true;

        this.state.configItem = configItem ? configItem : await context.getObject<ConfigItem>();
        await this.prepareActions();

        setTimeout(() => {
            this.state.loading = false;
        }, 50);
    }

    private async prepareActions(): Promise<void> {
        if (this.state.widgetConfiguration && this.state.configItem) {
            this.state.actions = await ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, [this.state.configItem]
            );
        }
    }

    public getIcon(object: string, objectId: string): ObjectIcon {
        return new ObjectIcon(object, objectId);
    }
}

module.exports = Component;
