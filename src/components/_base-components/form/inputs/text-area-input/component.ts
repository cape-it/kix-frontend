import { ComponentState } from './ComponentState';
import { FormInputComponent } from '../../../../../core/model';
import { type } from 'os';

class Component extends FormInputComponent<string, ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onInput(input: any): Promise<void> {
        await super.onInput(input);
        if (this.state.field.placeholder) {
            this.state.placeholder = this.state.field.placeholder;
        } else if (this.state.field.required) {
            this.state.placeholder = this.state.field.label;
        }

        this.state.currentValue = typeof input.currentValue !== 'undefined' ?
            input.currentValue : this.state.currentValue;
    }

    public async onMount(): Promise<void> {
        await super.onMount();
        this.setCurrentValue();
    }

    public setCurrentValue(): void {
        if (this.state.defaultValue && this.state.defaultValue.value) {
            this.state.currentValue = this.state.defaultValue.value;
            (this as any).emit('valueChanged', this.state.currentValue);
            super.provideValue(this.state.currentValue);
        }
    }

    private valueChanged(event: any): void {
        if (event) {
            this.state.currentValue = event.target && event.target.value !== '' ? event.target.value : null;
            (this as any).emit('valueChanged', this.state.currentValue);
            super.provideValue(this.state.currentValue);
        }
    }

    public keyDown(event: any): void {
        setTimeout(() => {
            this.valueChanged(event);
        }, 100);
    }

    public async focusLost(event: any): Promise<void> {
        await super.focusLost();
    }

}

module.exports = Component;
