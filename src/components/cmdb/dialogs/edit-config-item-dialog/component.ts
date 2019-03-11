import {
    FormService, ContextService, OverlayService, ServiceRegistry, BrowserUtil
} from '../../../../core/browser';
import {
    ValidationSeverity, ContextType, ValidationResult, ComponentContent,
    OverlayType, KIXObjectType, StringContent, ConfigItem, ConfigItemProperty
} from '../../../../core/model';
import { ComponentState } from './ComponentState';
import { CMDBService } from '../../../../core/browser/cmdb';
import { TranslationService } from '../../../../core/browser/i18n/TranslationService';
import { DialogService } from '../../../../core/browser/components/dialog';

class Component {

    private state: ComponentState;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        DialogService.getInstance().setMainDialogHint('Translatable#All form fields marked by * are required fields.');
        this.setFormId();
    }

    public async onDestroy(): Promise<void> {
        FormService.getInstance().deleteFormInstance(this.state.formId);
    }

    public async cancel(): Promise<void> {
        FormService.getInstance().deleteFormInstance(this.state.formId);
        DialogService.getInstance().closeMainDialog();
    }

    public async setFormId(): Promise<void> {
        DialogService.getInstance().setMainDialogLoading(true);
        let formId = null;
        const dialogContext = await ContextService.getInstance().getActiveContext(ContextType.DIALOG);
        if (dialogContext) {
            const info = dialogContext.getAdditionalInformation();
            formId = info.length ? info[0] : null;
        }
        setTimeout(() => {
            this.state.formId = formId;
            DialogService.getInstance().setMainDialogLoading(false);
        }, 10);
    }

    public async submit(): Promise<void> {
        setTimeout(async () => {
            const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
            if (formInstance) {
                const result = await formInstance.validateForm();
                const validationError = result.some((r) => r.severity === ValidationSeverity.ERROR);
                if (validationError) {
                    this.showValidationError(result);
                } else {
                    DialogService.getInstance().setMainDialogLoading(true, 'Config Item wird aktualisiert');
                    const cmdbService
                        = ServiceRegistry.getServiceInstance<CMDBService>(KIXObjectType.CONFIG_ITEM);
                    const context = ContextService.getInstance().getActiveContext(ContextType.MAIN);
                    if (cmdbService && context) {
                        const configItem = await context.getObject<ConfigItem>(KIXObjectType.CONFIG_ITEM, true);
                        const versionId = await cmdbService.createConfigItemVersion(
                            this.state.formId, Number(context.getObjectId())
                        );
                        DialogService.getInstance().setMainDialogLoading(false);
                        if (versionId) {
                            const updatedConfigItem = await context.getObject<ConfigItem>(
                                KIXObjectType.CONFIG_ITEM, true,
                                [ConfigItemProperty.VERSIONS, ConfigItemProperty.CURRENT_VERSION]
                            );

                            const toast = await TranslationService.translate('Translatable#Changes saved.');

                            const hint = configItem.CurrentVersion
                                && configItem.CurrentVersion.equals(updatedConfigItem.CurrentVersion)
                                ? toast : 'Neue Version wurde erstellt';
                            BrowserUtil.openSuccessOverlay(hint);

                            DialogService.getInstance().submitMainDialog();
                        }
                    }
                }
            }
        }, 300);
    }

    public showValidationError(result: ValidationResult[]): void {
        const errorMessages = result.filter((r) => r.severity === ValidationSeverity.ERROR).map((r) => r.message);
        const content = new ComponentContent('list-with-title',
            {
                title: 'Fehler beim Validieren des Formulars:',
                list: errorMessages
            }
        );

        OverlayService.getInstance().openOverlay(
            OverlayType.WARNING, null, content, 'Validierungsfehler', true
        );
    }

    public showError(error: any): void {
        OverlayService.getInstance().openOverlay(
            OverlayType.WARNING, null, new StringContent(error), 'Translatable#Error!', true
        );
    }

}

module.exports = Component;
