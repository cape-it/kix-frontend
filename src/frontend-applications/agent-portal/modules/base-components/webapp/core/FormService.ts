/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXModulesSocketClient } from './KIXModulesSocketClient';
import { FormInstance } from './FormInstance';
import { FormConfiguration } from '../../../../model/configuration/FormConfiguration';
import { FormContext } from '../../../../model/configuration/FormContext';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { FormFieldValueHandler } from './FormFieldValueHandler';

export class FormService {

    private static INSTANCE: FormService;

    public static getInstance(): FormService {
        if (!FormService.INSTANCE) {
            FormService.INSTANCE = new FormService();
        }
        return FormService.INSTANCE;
    }

    private formInstances: Map<string, Promise<FormInstance>> = new Map();

    private formFieldValueHandler: Map<KIXObjectType | string, FormFieldValueHandler[]> = new Map();

    private forms: FormConfiguration[] = [];
    private formIDsWithContext: Array<[FormContext, KIXObjectType | string, string]> = null;

    private constructor() { }

    public addFormFieldValueHandler(objectType: KIXObjectType | string, handler: FormFieldValueHandler): void {
        if (!this.formFieldValueHandler.has(objectType)) {
            this.formFieldValueHandler.set(objectType, []);
        }
        this.formFieldValueHandler.get(objectType).push(handler);
    }

    public getFormFieldValueHandler(objectType: KIXObjectType | string): FormFieldValueHandler[] {
        return this.formFieldValueHandler.get(objectType);
    }

    public async loadFormConfigurations(): Promise<void> {
        const formConfigurations = await KIXModulesSocketClient.getInstance().loadFormConfigurations();
        this.formIDsWithContext = formConfigurations;
    }

    public async addForm(form: FormConfiguration): Promise<void> {
        const formIndex = this.forms.findIndex((f) => f.id === form.id);
        if (formIndex !== -1) {
            this.forms.splice(formIndex, 1, form);
        } else {
            this.forms.push(form);
        }
    }

    public async getFormInstance(
        formId: string, cache: boolean = true, form?: FormConfiguration
    ): Promise<FormInstance> {
        if (formId) {
            if (!this.formInstances.has(formId) || !cache) {
                const formInstance = this.getNewFormInstance(formId, form);
                this.formInstances.set(formId, formInstance);
            }
            return await this.formInstances.get(formId);
        }
        return;
    }

    private getNewFormInstance(formId: string, form?: FormConfiguration): Promise<FormInstance> {
        return new Promise<FormInstance>(async (resolve, reject) => {
            this.deleteFormInstance(formId);
            const formInstance = new FormInstance();
            await formInstance.initFormInstance(formId);
            resolve(formInstance);
        });
    }

    public async getForm(formId: string): Promise<FormConfiguration> {
        let form = this.forms.find((f) => f.id === formId);
        if (!form) {
            form = await KIXModulesSocketClient.getInstance().loadFormConfiguration(formId);
        }
        return { ...form };
    }

    public deleteFormInstance(formId: string): void {
        if (formId && this.formInstances.has(formId)) {
            this.formInstances.delete(formId);
        }
    }

    public async getFormIdByContext(formContext: FormContext, formObject: KIXObjectType | string): Promise<string> {
        let formId;
        if (!this.formIDsWithContext) {
            await this.loadFormConfigurations();
        }

        const formIdByContext = this.formIDsWithContext.find(
            (fidwc) => fidwc[0] === formContext && fidwc[1] === formObject
        );
        if (formIdByContext && formIdByContext[2]) {
            formId = formIdByContext[2];
        }
        return formId;
    }

}
