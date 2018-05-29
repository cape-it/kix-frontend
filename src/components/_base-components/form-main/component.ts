import { ContextService } from '@kix/core/dist/browser/context';
import { FormComponentState } from './FormComponentState';
import { WidgetType, IFormEvent, UpdateFormEvent } from '@kix/core/dist/model';
import { FormService } from '@kix/core/dist/browser/form';
import { WidgetService } from '@kix/core/dist/browser';

class FormComponent {

    private state: FormComponentState;

    public onCreate(input: any): void {
        this.state = new FormComponentState(input.formId, input.objectType);
    }

    public onMount(): void {
        this.state.formInstance = FormService.getInstance().getOrCreateFormInstance(this.state.formId);
        WidgetService.getInstance().setWidgetType('form-group', WidgetType.GROUP);
    }

}

module.exports = FormComponent;
