import { IConfigurationExtension } from '../../core/extensions';
import {
    WidgetConfiguration, ConfiguredWidget, WidgetSize, ContextConfiguration
} from '../../core/model';
import { SystemAddressDetailsContext } from '../../core/browser/system-address/context/system-address';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return SystemAddressDetailsContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {

        const systemAddressInfoWidget = new ConfiguredWidget('system-address-info-widget',
            new WidgetConfiguration(
                'system-address-info-widget', 'Email Information', [], null,
                false, true, WidgetSize.BOTH, null, false
            )
        );

        const systemAddressAssignedQueuesWidget = new ConfiguredWidget('system-address-assigned-queues-widget',
            new WidgetConfiguration(
                'system-address-assigned-queues-widget', 'Assigned Queues', [], null,
                false, true, WidgetSize.BOTH, null, false
            )
        );

        return new ContextConfiguration(
            SystemAddressDetailsContext.CONTEXT_ID,
            [], [],
            [], [],
            [], [systemAddressAssignedQueuesWidget],
            ['system-address-info-widget'], [systemAddressInfoWidget],
            [], [],
            ['system-address-create'],
            ['system-address-edit']
        );
    }

    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        return;
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
