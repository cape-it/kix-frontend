/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { FormConfiguration } from '../../../../model/configuration/FormConfiguration';
import { FormInstance } from './FormInstance';
import { KIXObject } from '../../../../model/kix/KIXObject';
import { KIXObjectSpecificCreateOptions } from '../../../../model/KIXObjectSpecificCreateOptions';
import { FormContext } from '../../../../model/configuration/FormContext';
import { FormFieldConfiguration } from '../../../../model/configuration/FormFieldConfiguration';

export class ExtendedKIXObjectFormService {

    public async postInitValues(
        form: FormConfiguration, formInstance: FormInstance, kixObject?: KIXObject
    ): Promise<void> {
        return null;
    }

    public async postPrepareValues(
        parameter: Array<[string, any]>, createOptions?: KIXObjectSpecificCreateOptions,
        formContext?: FormContext
    ): Promise<Array<[string, any]>> {
        return parameter;
    }

    public async createFormFieldConfigurations(
        formFields: FormFieldConfiguration[]
    ): Promise<FormFieldConfiguration[]> {
        return null;
    }

}
