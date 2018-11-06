import { ContextConfiguration } from "@kix/core/dist/model";
import { IModuleFactoryExtension } from "@kix/core/dist/extensions";
import { ServiceContainer } from "@kix/core/dist/common";
import { IConfigurationService, ICMDBService } from "@kix/core/dist/services";
import {
    NewConfigItemDialogContext, NewConfigItemDialogContextConfiguration, ConfigItemFormFactory
} from "@kix/core/dist/browser/cmdb";

export class Extension implements IModuleFactoryExtension {

    public getModuleId(): string {
        return NewConfigItemDialogContext.CONTEXT_ID;
    }

    public getDefaultConfiguration(): ContextConfiguration {
        return new NewConfigItemDialogContextConfiguration();
    }

    public async createFormDefinitions(): Promise<void> {
        const configurationService =
            ServiceContainer.getInstance().getClass<IConfigurationService>("IConfigurationService");
        const token = configurationService.getServerConfiguration().BACKEND_API_TOKEN;

        const cmdbService =
            ServiceContainer.getInstance().getClass<ICMDBService>("ICmdbService");

        const ciClasses = await cmdbService.loadConfigItemClassWithDefinitions(token);

        for (const ciClass of ciClasses) {
            const formId = `CMDB_CI_${ciClass.Name}_${ciClass.ID}`;
            const existingForm = configurationService.getModuleConfiguration(formId, null);
            if (!existingForm) {
                const form = ConfigItemFormFactory.getInstance().createCIForm(ciClass, formId);
                await configurationService.saveModuleConfiguration(formId, null, form);
            }
            configurationService.registerFormId(formId);
        }
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
