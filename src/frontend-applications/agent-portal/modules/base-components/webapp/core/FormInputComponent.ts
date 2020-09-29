/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { FormInputComponentState } from './FormInputComponentState';
import { FormService } from './FormService';
import { EventService } from './EventService';
import { FormEvent } from './FormEvent';
import { IEventSubscriber } from './IEventSubscriber';
import { FormValuesChangedEventData } from './FormValuesChangedEventData';

export abstract class FormInputComponent<T, C extends FormInputComponentState<T>> {

    protected state: C;

    private subscriber: IEventSubscriber;

    public onInput(input: FormInputComponentState<T>): any {
        this.state.field = input.field;
        this.state.fieldId = input.fieldId;
        this.state.formId = input.formId;

        if (!this.state.fieldId) {
            this.state.fieldId = this.state.field ? this.state.field.property : null;
        }

        FormInputComponent.prototype.doUpdate.call(this);

        return input;
    }

    private async doUpdate(): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        this.state.formContext = formInstance.getFormContext();

        if (!this.state.field) {
            this.state.field = await formInstance.getFormField(this.state.field.instanceId);
        }
    }

    public async onMount(): Promise<void> {
        this.subscriber = {
            eventSubscriberId: this.state.field.instanceId,
            eventPublished: async (data: FormValuesChangedEventData, eventId: string) => {
                if (eventId === FormEvent.VALUES_CHANGED && this.state.field && data) {
                    if (data.originInstanceId !== this.state.field.instanceId) {
                        const ownValue = data.changedValues.find(
                            (cv) => cv[0] && cv[0].instanceId === this.state.field.instanceId
                        );
                        if (ownValue) {
                            this.state.prepared = false;
                            this.setCurrentValue();
                            this.state.field = data.formInstance.getFormField(this.state.field.instanceId);
                            FormInputComponent.prototype.setInvalidState.call(this);
                            setTimeout(() => this.state.prepared = true, 10);
                        }
                    } else {
                        FormInputComponent.prototype.setInvalidState.call(this);
                    }
                }
            }
        };
        EventService.getInstance().subscribe(FormEvent.VALUES_CHANGED, this.subscriber);

        FormInputComponent.prototype.setInvalidState.call(this);
        await this.setCurrentValue();
        this.state.prepared = true;
    }

    public async onDestroy(): Promise<void> {
        EventService.getInstance().unsubscribe(this.state.field.instanceId, this.subscriber);
    }

    public abstract async setCurrentValue(): Promise<void>;

    protected async provideValue(value: T, silent?: boolean): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        formInstance.provideFormFieldValues<any>(
            [[this.state.field.instanceId, value]], this.state.field.instanceId, silent
        );
    }

    protected async setInvalidState(): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        if (formInstance) {
            const value = formInstance.getFormFieldValue(this.state.field.instanceId);
            if (value) {
                this.state.invalid = !value.valid;
            }
        }
    }

    public async focusLost(event?: any): Promise<void> {
        const formInstance = await FormService.getInstance().getFormInstance(this.state.formId);
        if (formInstance && formInstance.getForm().validation) {
            await formInstance.validateField(this.state.field);
            FormInputComponent.prototype.setInvalidState.call(this);
        }
    }
}
