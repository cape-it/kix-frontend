/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { AbstractMarkoComponent } from '../../../../base-components/webapp/core/AbstractMarkoComponent';
import { TranslationService } from '../../../../translation/webapp/core/TranslationService';
import { FormService } from '../../../../base-components/webapp/core/FormService';
import { FormContext } from '../../../../../model/configuration/FormContext';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { FormFieldConfiguration } from '../../../../../model/configuration/FormFieldConfiguration';
import { ContactProperty } from '../../../../customer/model/ContactProperty';
import { FormValidationService } from '../../../../base-components/webapp/core/FormValidationService';
import { UserProperty } from '../../../model/UserProperty';
import { FormFieldOption } from '../../../../../model/configuration/FormFieldOption';
import { FormFieldOptions } from '../../../../../model/configuration/FormFieldOptions';
import { InputFieldTypes } from '../../../../base-components/webapp/core/InputFieldTypes';
import { FormConfiguration } from '../../../../../model/configuration/FormConfiguration';
import { FormPageConfiguration } from '../../../../../model/configuration/FormPageConfiguration';
import { FormGroupConfiguration } from '../../../../../model/configuration/FormGroupConfiguration';
import { ValidationSeverity } from '../../../../base-components/webapp/core/ValidationSeverity';
import { KIXObjectService } from '../../../../base-components/webapp/core/KIXObjectService';
import { BrowserUtil } from '../../../../base-components/webapp/core/BrowserUtil';
import { Error } from '../../../../../../../server/model/Error';
import { FormFieldValue } from '../../../../../model/configuration/FormFieldValue';
import { Role } from '../../../model/Role';
import { KIXObjectLoadingOptions } from '../../../../../model/KIXObjectLoadingOptions';
import { FilterCriteria } from '../../../../../model/FilterCriteria';
import { RoleProperty } from '../../../model/RoleProperty';
import { SearchOperator } from '../../../../search/model/SearchOperator';
import { FilterDataType } from '../../../../../model/FilterDataType';
import { FilterType } from '../../../../../model/FilterType';
import { EventService } from '../../../../base-components/webapp/core/EventService';
import { SetupStep } from '../../../../setup-assistant/webapp/core/SetupStep';
import { SetupEvent } from '../../../../setup-assistant/webapp/core/SetupEvent';
import { Contact } from '../../../../customer/model/Contact';
import { SetupStepCompletedEventData } from '../../../../setup-assistant/webapp/core/SetupStepCompletedEventData';
import { ObjectIcon } from '../../../../icon/model/ObjectIcon';
import { SetupService } from '../../../../setup-assistant/webapp/core/SetupService';

class Component extends AbstractMarkoComponent<ComponentState> {

    private step: SetupStep;
    private update: boolean;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        this.state.translations = await TranslationService.createTranslationObject([
            'Translatable#Save & Continue', 'Translatable#Save & Logout', 'Translatable#Skip & Continue'
        ]);

        await this.prepareForm();
        this.state.prepared = true;
    }

    public onInput(input: any) {
        this.step = input.step;
        this.update = this.step && this.step.result && this.step.result.contactId && this.step.result.userId;
        this.state.completed = this.step ? this.step.completed : false;
    }

    public onDestroy(): void {
        FormService.getInstance().deleteFormInstance(this.state.formId);
    }

    private async prepareForm(): Promise<void> {

        const formFields = [
            new FormFieldConfiguration(
                'create-superuser-firstname',
                'Translatable#First Name', ContactProperty.FIRSTNAME, null, true,
                'Translatable#Helptext_Customers_ContactCreate_Firstname'
            ),
            new FormFieldConfiguration(
                'create-superuser-lastname',
                'Translatable#Last Name', ContactProperty.LASTNAME, null, true,
                'Translatable#Helptext_Customers_ContactCreate_Lastname'
            ),
            new FormFieldConfiguration(
                'create-superuser-email',
                'Translatable#Email', ContactProperty.EMAIL, null, true,
                'Translatable#Helptext_Customers_ContactCreate_Email',
                null, null, null, null, null, null, null, null, null,
                FormValidationService.EMAIL_REGEX, FormValidationService.EMAIL_REGEX_ERROR_MESSAGE
            ),
            new FormFieldConfiguration(
                'create-superuser-icon',
                'Translatable#Avatar', 'ICON', 'icon-input', false,
                'Translatable#Helptext_Customers_ContactCreate_Avatar.'
            ),
            new FormFieldConfiguration(
                'create-superuser-login',
                'Translatable#Login Name', UserProperty.USER_LOGIN, null, true,
                'Translatable#Helptext_User_UserCreateEdit_Login'
            ),
            new FormFieldConfiguration(
                'create-superuser-password',
                'Translatable#Password', UserProperty.USER_PASSWORD, null, true,
                'Translatable#Helptext_User_UserCreateEdit_Password',
                [
                    new FormFieldOption(FormFieldOptions.INPUT_FIELD_TYPE, InputFieldTypes.PASSWORD)
                ]
            )
        ];

        const form = new FormConfiguration(
            'create-superuser-account-form', 'Create Superuser Account', null, KIXObjectType.USER,
            true, FormContext.NEW, null,
            [
                new FormPageConfiguration(
                    'create-superuser-form-page', null, null, true, false,
                    [
                        new FormGroupConfiguration('create-superuser-form-group', null, null, null, formFields)
                    ]
                )
            ]
        );

        FormService.getInstance().addForm(form);
        this.state.formId = form.id;

        if (this.update) {
            setTimeout(() => this.initFormValues(form.id), 500);
        }
    }

    private async initFormValues(formId: string): Promise<void> {
        const contacts = await KIXObjectService.loadObjects<Contact>(
            KIXObjectType.CONTACT, [this.step.result.contactId],
            new KIXObjectLoadingOptions(null, null, null, [ContactProperty.USER])
        ).catch((): Contact[] => []);

        if (contacts && contacts.length) {
            const formInstance = await FormService.getInstance().getFormInstance(formId);

            formInstance.provideFormFieldValuesForProperties([
                [ContactProperty.LASTNAME, contacts[0].Lastname],
                [ContactProperty.FIRSTNAME, contacts[0].Firstname],
                [ContactProperty.EMAIL, contacts[0].Email],
                [UserProperty.USER_LOGIN, contacts[0].User.UserLogin],
                ['ICON', new ObjectIcon(null, KIXObjectType.CONTACT, this.step.result.contactId)]
            ], null);
        }
    }

    public async submit(logout: boolean): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);

        const roles = await KIXObjectService.loadObjects<Role>(
            KIXObjectType.ROLE, null,
            new KIXObjectLoadingOptions([
                new FilterCriteria(RoleProperty.NAME, SearchOperator.EQUALS, FilterDataType.STRING, FilterType.AND, 'Superuser')
            ])
        ).catch((error): Role[] => []);

        if (roles && roles.length) {
            formInstance.provideFixedValue(UserProperty.ROLE_IDS, new FormFieldValue([roles[0].ID]));
        }

        formInstance.provideFixedValue(UserProperty.IS_AGENT, new FormFieldValue(true));

        const result = await formInstance.validateForm();
        const validationError = result.some((r) => r && r.severity === ValidationSeverity.ERROR);
        if (validationError) {
            BrowserUtil.showValidationError(result);
        } else {

            BrowserUtil.toggleLoadingShield(true, 'Translatable#Create Superuser Account');

            if (this.update) {
                formInstance.provideFixedValue(
                    ContactProperty.ASSIGNED_USER_ID, new FormFieldValue(this.step.result.userId)
                );
                await this.updateUser();
            } else {
                await this.createUser();
            }

            BrowserUtil.toggleLoadingShield(false);

            if (logout) {
                BrowserUtil.logout();
            }
        }
    }

    private async updateUser(): Promise<void> {
        const contactId = await KIXObjectService.updateObjectByForm(
            KIXObjectType.CONTACT, this.state.formId, this.step.result.contactId
        ).catch((error: Error) => {
            BrowserUtil.openErrorOverlay(
                error.Message ? `${error.Code}: ${error.Message}` : error.toString()
            );
            return null;
        });

        if (contactId) {
            BrowserUtil.openSuccessOverlay('Translatable#Please logout and login again with the new user.');
            await SetupService.getInstance().stepCompleted(this.step.id, {
                contactId: this.step.result.contactId,
                userId: this.step.result.userId
            });
        }
    }

    private async createUser(): Promise<void> {
        const contactId = await KIXObjectService.createObjectByForm(
            KIXObjectType.CONTACT, this.state.formId, null
        ).catch((error: Error) => {
            BrowserUtil.openErrorOverlay(
                error.Message ? `${error.Code}: ${error.Message}` : error.toString()
            );
            return null;
        });

        if (contactId) {
            const userId = await this.getUserId(contactId);

            BrowserUtil.openSuccessOverlay('Translatable#Please logout and login again with the new user.');
            await SetupService.getInstance().stepCompleted(this.step.id, { contactId, userId });
        }
    }

    private async getUserId(contactId: number): Promise<number> {
        let userId;
        const contacts = await KIXObjectService.loadObjects<Contact>(KIXObjectType.CONTACT, [contactId])
            .catch((): Contact[] => []);
        if (contacts && contacts.length) {
            userId = contacts[0].AssignedUserID;
        }
        return userId;
    }

    public skip(): void {
        SetupService.getInstance().stepSkipped(this.step.id);
    }
}

module.exports = Component;
