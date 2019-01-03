import { IConfigurationExtension } from '../../../core/extensions';
import { NewTicketTypeDialogContext, NewTicketTypeDialogContextConfiguration } from '../../../core/browser/ticket';
import {
    ConfiguredWidget, FormField, KIXObjectType, Form,
    FormContext, FormFieldValue, TicketTypeProperty
} from '../../../core/model';
import { FormGroup } from '../../../core/model/components/form/FormGroup';
import { ConfigurationService } from '../../../core/services';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return NewTicketTypeDialogContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<NewTicketTypeDialogContextConfiguration> {

        const sidebars = [];
        const sidebarWidgets: Array<ConfiguredWidget<any>> = [];

        return new NewTicketTypeDialogContextConfiguration(this.getModuleId(), sidebars, sidebarWidgets);
    }

    public async createFormDefinitions(): Promise<void> {
        const configurationService = ConfigurationService.getInstance();

        const formId = 'new-ticket-type-form';
        const existing = configurationService.getModuleConfiguration(formId, null);
        if (!existing) {
            const fields: FormField[] = [];
            fields.push(new FormField(
                "Name", TicketTypeProperty.NAME, null, true, "Geben Sie einen Namen für den Typ ein."
            ));
            fields.push(new FormField(
                "Icon", 'ICON', 'icon-input', false,
                "Wählen Sie ein Icon für den Status aus."
            ));
            fields.push(new FormField(
                "Kommentar", TicketTypeProperty.COMMENT, 'text-area-input', false,
                "Geben Sie einen Kommentar für den Typ ein.", null, null, null, null, null, null, null, 250
            ));
            fields.push(new FormField(
                "Gültigkeit", TicketTypeProperty.VALID_ID, 'valid-input', true,
                "Legen Sie fest, ob der Type „gültig“, „ungültig“ oder „temporär ungültig“ ist.",
                null, new FormFieldValue(1)
            ));

            const group = new FormGroup('Typdaten', fields);

            const form = new Form(formId, 'Typ hinzufügen', [group], KIXObjectType.TICKET_TYPE);
            await configurationService.saveModuleConfiguration(form.id, null, form);
        }
        configurationService.registerForm([FormContext.NEW], KIXObjectType.TICKET_TYPE, formId);
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
