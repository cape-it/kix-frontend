import { IConfigurationExtension } from '../../core/extensions';
import {
    ConfiguredWidget, FormField, FormFieldValue, MailFilterProperty, Form,
    KIXObjectType, FormContext, ContextConfiguration, FormFieldOption, FormFieldOptions, InputFieldTypes,
    KIXObjectProperty
} from '../../core/model';
import { ConfigurationService } from '../../core/services';
import { FormGroup } from '../../core/model/components/form/FormGroup';
import { NewMailFilterDialogContext } from '../../core/browser/mail-filter';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return NewMailFilterDialogContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {

        const sidebars = [];
        const sidebarWidgets: Array<ConfiguredWidget<any>> = [];

        return new ContextConfiguration(this.getModuleId(), sidebars, sidebarWidgets);
    }

    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        const configurationService = ConfigurationService.getInstance();

        const formId = 'new-mail-filter-form';
        const existing = configurationService.getModuleConfiguration(formId, null);
        if (!existing) {
            const infoGroup = new FormGroup('Translatable#Email Filter Information', [
                new FormField(
                    'Translatable#Name', MailFilterProperty.NAME, null, true,
                    'Translatable#Helptext_Admin_MailFilterCreate_Name'
                ),
                new FormField(
                    'Translatable#Stop after match', MailFilterProperty.STOP_AFTER_MATCH, 'checkbox-input', true,
                    'Translatable#Helptext_Admin_MailFilterCreate_StopAfterMatch', undefined,
                    new FormFieldValue(false)
                ),
                new FormField(
                    'Translatable#Comment', KIXObjectProperty.COMMENT, 'text-area-input', false,
                    'Translatable#Helptext_Admin_MailFilterCreate_Comment', null, null, null,
                    null, null, null, null, 250
                ),
                new FormField(
                    'Translatable#Validity', KIXObjectProperty.VALID_ID, 'valid-input', true,
                    'Translatable#Helptext_Admin_MailFilterCreate_Validity',
                    null, new FormFieldValue(1)
                )
            ]);

            const matchGroup = new FormGroup('Translatable#Filter Conditions', [
                new FormField(
                    'Translatable#Filter Conditions', MailFilterProperty.MATCH, 'mail-filter-match-form-input', true,
                    'Translatable#Helptext_Admin_MailFilterCreate_FilterConditions', undefined, undefined,
                    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined, undefined, undefined, false
                )
            ]);

            const setGroup = new FormGroup('Translatable#Set Email Headers', [
                new FormField(
                    'Translatable#Set Email Headers', MailFilterProperty.SET, 'mail-filter-set-form-input', true,
                    'Translatable#Helptext_Admin_MailFilterCreate_SetEmailHeaders', undefined, undefined,
                    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined, undefined, undefined, false
                )
            ]);

            const form = new Form(formId, 'Translatable#New Filter', [
                infoGroup, matchGroup, setGroup
            ], KIXObjectType.MAIL_FILTER);
            await configurationService.saveModuleConfiguration(form.id, null, form);
        }
        configurationService.registerForm([FormContext.NEW], KIXObjectType.MAIL_FILTER, formId);
    }
}

module.exports = (data, host, options) => {
    return new Extension();
};