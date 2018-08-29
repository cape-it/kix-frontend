import { FormField } from "@kix/core/dist/model";
import { ComponentState } from './ComponentState';
import { FormService } from "@kix/core/dist/browser";

class FieldContainerComponent {

    private state: ComponentState;
    private formId: string;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.level = typeof input.level !== 'undefined' ? input.level : 0;
        this.state.fields = input.fields;
        this.formId = input.formId;
    }

    public showSeparator(field: FormField): boolean {
        return field.children && field.children.length > 0 && this.state.level === 0;
    }

    public canRemove(field: FormField): boolean {
        const propertyFields = this.state.fields.filter((ff) => ff.property === field.property);
        if (propertyFields.length === 1 && field.empty) {
            return false;
        }
        return field.countMin !== null && field.countMin < propertyFields.length;
    }

    public removeField(field: FormField): void {
        const propertyFields = this.state.fields.filter((ff) => ff.property === field.property);
        if (propertyFields.length === 1) {
            this.setFieldsEmpty(field, true);
        } else {
            const index = this.state.fields.findIndex((f) => f.instanceId === field.instanceId);
            this.state.fields.splice(index, 1);

            const formInstance = FormService.getInstance().getFormInstance(this.formId);
            formInstance.provideFormFieldValue(field.instanceId, null);
        }
        this.state.fields = [...this.state.fields];
    }

    public canAdd(field: FormField): boolean {
        const propertyFields = this.state.fields.filter((ff) => ff.property === field.property);
        if (propertyFields.length === 1 && field.empty) {
            return true;
        }
        return field.countMax !== null && field.countMax > propertyFields.length;
    }

    public addField(field: FormField): void {
        if (field.empty) {
            this.setFieldsEmpty(field, false);
        } else {
            const newField = field.clone();
            const index = this.state.fields.findIndex((f) => f.instanceId === field.instanceId);
            this.state.fields.splice(index + 1, 0, newField);

            const formInstance = FormService.getInstance().getFormInstance(this.formId);
            formInstance.provideFormField(newField);
        }

        this.state.fields = [...this.state.fields];
    }

    private setFieldsEmpty(field: FormField, empty: boolean): void {
        field.empty = empty;
        if (field.children) {
            field.children.forEach((f) => this.setFieldsEmpty(f, empty));
        }
    }

}

module.exports = FieldContainerComponent;
