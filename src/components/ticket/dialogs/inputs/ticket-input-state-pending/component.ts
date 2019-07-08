import { ComponentState } from "./ComponentState";
import { DateTimeUtil } from "../../../../../core/model";
import { FormInputComponent } from '../../../../../core/model/components/form/FormInputComponent';

class Component extends FormInputComponent<Date, ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        super.onInput(input);
    }

    public async onMount(): Promise<void> {
        await super.onMount();

        this.setCurrentValues();
    }

    protected setCurrentValues(): void {
        if (this.state.defaultValue && this.state.defaultValue.value) {
            const pendingDate = new Date(this.state.defaultValue.value);
            this.state.selectedDate = DateTimeUtil.getKIXDateString(pendingDate);
            this.state.selectedTime = DateTimeUtil.getKIXTimeString(pendingDate);
            this.setValue();
        }
    }

    public dateChanged(event: any): void {
        this.state.selectedDate = event.target.value;
        this.setValue();
    }

    public timeChanged(event: any): void {
        this.state.selectedTime = event.target.value;
        this.setValue();
    }

    private setValue(): void {
        const pendingDate = new Date(`${this.state.selectedDate} ${this.state.selectedTime}`);
        super.provideValue(pendingDate);
    }

    public async focusLost(event: any): Promise<void> {
        await super.focusLost();
    }
}

module.exports = Component;