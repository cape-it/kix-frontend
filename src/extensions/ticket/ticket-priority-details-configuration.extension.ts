import { IConfigurationExtension } from '../../core/extensions';
import {
    WidgetConfiguration, ConfiguredWidget, WidgetSize, ContextConfiguration, TabWidgetSettings
} from '../../core/model';
import { TicketPriorityDetailsContext } from '../../core/browser/ticket';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return 'ticket-priority-details';
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {

        const tabLane = new ConfiguredWidget('ticket-priority-details-tab-widget',
            new WidgetConfiguration('tab-widget', '', [], new TabWidgetSettings(['ticket-priority-details-widget']))
        );

        const priorityDetailsWidget = new ConfiguredWidget('ticket-priority-details-widget', new WidgetConfiguration(
            'ticket-priority-info-widget', 'Translatable#Priority Information', ['ticket-admin-priority-edit'], null,
            false, true, null, false
        ));

        return new ContextConfiguration(
            TicketPriorityDetailsContext.CONTEXT_ID, [], [], [], [],
            ['ticket-priority-details-tab-widget'], [tabLane, priorityDetailsWidget],
            [], [],
            ['ticket-admin-priority-create'],
            ['ticket-admin-priority-duplication', 'ticket-admin-priority-edit', 'ticket-admin-priority-delete']
        );
    }

    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        return;
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};