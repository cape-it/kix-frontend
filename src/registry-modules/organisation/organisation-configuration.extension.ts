import { IConfigurationExtension } from '../../core/extensions';
import {
    ContextConfiguration, ConfiguredWidget, WidgetConfiguration, WidgetSize, KIXObjectType
} from '../../core/model';
import { TableConfiguration } from '../../core/browser';
import { OrganisationContext } from '../../core/browser/organisation';

export class DashboardModuleFactoryExtension implements IConfigurationExtension {

    public getModuleId(): string {
        return OrganisationContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {
        const organisationListWidget =
            new ConfiguredWidget('20180529102830', new WidgetConfiguration(
                'table-widget', 'Translatable#Overview Organisations', [
                    'organisation-search-action',
                    'organisation-create-action',
                    'import-action',
                    'csv-export-action'
                ], {
                    objectType: KIXObjectType.ORGANISATION,
                    tableConfiguration: new TableConfiguration(KIXObjectType.ORGANISATION,
                        null, null, null, null, true
                    )
                },
                false, true, WidgetSize.LARGE, 'kix-icon-man-house', false)
            );

        const contactListWidget =
            new ConfiguredWidget('20180529144530', new WidgetConfiguration(
                'table-widget', 'Translatable#Overview Contacts', [
                    'contact-search-action',
                    'contact-create-action',
                    'import-action',
                    'csv-export-action'
                ], {
                    objectType: KIXObjectType.CONTACT,
                    tableConfiguration: new TableConfiguration(KIXObjectType.CONTACT,
                        null, null, null, null, true
                    )
                },
                false, true, WidgetSize.LARGE, 'kix-icon-man-bubble', false)
            );

        const content: string[] = ['20180529102830', '20180529144530'];
        const contentWidgets = [organisationListWidget, contactListWidget];

        const notesSidebar =
            new ConfiguredWidget('20181010-organisation-notes', new WidgetConfiguration(
                'notes-widget', 'Translatable#Notes', [], {},
                false, false, WidgetSize.BOTH, 'kix-icon-note', false)
            );

        const sidebars = ['20181010-organisation-notes'];
        const sidebarWidgets: Array<ConfiguredWidget<any>> = [notesSidebar];

        return new ContextConfiguration(
            this.getModuleId(),
            sidebars, sidebarWidgets,
            [], [],
            [], [],
            [], [],
            content, contentWidgets
        );
    }

    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        // do nothing
    }

}

module.exports = (data, host, options) => {
    return new DashboardModuleFactoryExtension();
};