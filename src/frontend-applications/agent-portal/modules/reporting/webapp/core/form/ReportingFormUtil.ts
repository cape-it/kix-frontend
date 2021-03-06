/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { DefaultSelectInputFormOption } from '../../../../../model/configuration/DefaultSelectInputFormOption';
import { FormFieldConfiguration } from '../../../../../model/configuration/FormFieldConfiguration';
import { FormFieldOption } from '../../../../../model/configuration/FormFieldOption';
import { FormFieldOptions } from '../../../../../model/configuration/FormFieldOptions';
import { FormFieldValue } from '../../../../../model/configuration/FormFieldValue';
import { KIXObjectProperty } from '../../../../../model/kix/KIXObjectProperty';
import { DynamicFieldFormUtil } from '../../../../base-components/webapp/core/DynamicFieldFormUtil';
import { ObjectReferenceOptions } from '../../../../base-components/webapp/core/ObjectReferenceOptions';
import { TreeNode } from '../../../../base-components/webapp/core/tree';
import { DynamicFormFieldOption } from '../../../../dynamic-fields/webapp/core';
import { ReportParameter } from '../../../model/ReportParamater';
import { ReportParameterProperty } from '../../../model/ReportParameterProperty';

export class ReportingFormUtil {

    /**
     *
     * @param field
     * @param references References schould be a string with object and property,
     * e.g. 'Ticket.ID', 'TicketType.ID', 'DynamicField.<NAME>'
     */
    public static async setInputComponent(
        field: FormFieldConfiguration, parameter: ReportParameter, filterPossibleValues: boolean = true,
        multiple?: boolean
    ): Promise<void> {
        if (!field) {
            return;
        }

        if (parameter && parameter.References) {
            const parts = parameter.References.split('.');
            if (parts.length >= 2) {
                const object = parts[0];

                if (object === 'DynamicField') {
                    this.prepareDynamicFieldInput(
                        field, parts[1], Boolean(parameter.Multiple), parameter.PossibleValues
                    );
                } else {
                    field.options = [];
                    field.inputComponent = 'object-reference-input';
                    field.options.push(new FormFieldOption(ObjectReferenceOptions.OBJECT, object));
                    field.options.push(new FormFieldOption(
                        ObjectReferenceOptions.MULTISELECT,
                        multiple ? multiple : Boolean(parameter.Multiple))
                    );
                    field.options.push(new FormFieldOption(FormFieldOptions.SHOW_INVALID, false));

                    if (filterPossibleValues) {
                        field.options.push(
                            new FormFieldOption(ObjectReferenceOptions.OBJECT_IDS, parameter.PossibleValues)
                        );
                    }
                }
            }
        } else if (field.property === ReportParameterProperty.POSSIBLE_VALUES) {
            this.createPossibleValueInput(field, parameter);
        } else if (field.property === ReportParameterProperty.DEFAULT) {
            this.createDefaultValueInput(field, parameter);
        }
    }

    public static createPossibleValueInput(
        field: FormFieldConfiguration, parameter: ReportParameter
    ): void {
        field.inputComponent = null;
        if (parameter && Array.isArray(parameter.PossibleValues) && parameter.PossibleValues.length) {
            field.defaultValue = new FormFieldValue(parameter.PossibleValues.join(','));
        }
    }

    public static createDefaultValueInput(
        field: FormFieldConfiguration, parameter: ReportParameter
    ): void {
        if (parameter && Array.isArray(parameter.PossibleValues) && parameter.PossibleValues.length) {
            const nodes = parameter.PossibleValues.map((v) => new TreeNode(v, v));
            field.inputComponent = 'default-select-input';
            field.options = [
                new FormFieldOption(DefaultSelectInputFormOption.NODES, nodes),
                new FormFieldOption(DefaultSelectInputFormOption.MULTI, Boolean(parameter.Multiple)),
            ];
        } else {

            field.inputComponent = null;
        }
    }

    private static async prepareDynamicFieldInput(
        field: FormFieldConfiguration, dfName: string, multiple: boolean, possibleValues?: string[] | number[]
    ): Promise<void> {
        field.property = `${KIXObjectProperty.DYNAMIC_FIELDS}.${dfName}`;
        field.options.push(new FormFieldOption(DynamicFormFieldOption.FIELD_NAME, dfName));
        await DynamicFieldFormUtil.getInstance().createDynamicFormField(field);
        if (field.inputComponent === 'object-reference-input') {
            const multiSelectIndex = field.options.findIndex((o) => o.option === ObjectReferenceOptions.MULTISELECT);
            if (multiSelectIndex !== -1) {
                field.options.splice(multiSelectIndex, 1);
            }
            field.options.push(new FormFieldOption(ObjectReferenceOptions.MULTISELECT, multiple));

            const showInvalidIndex = field.options.findIndex((o) => o.option === FormFieldOptions.SHOW_INVALID);
            if (showInvalidIndex !== -1) {
                field.options.splice(showInvalidIndex, 1);
            }
            field.options.push(new FormFieldOption(FormFieldOptions.SHOW_INVALID, false));

            if (possibleValues) {
                field.options.push(
                    new FormFieldOption(ObjectReferenceOptions.OBJECT_IDS, possibleValues)
                );
            }
        }
    }

}