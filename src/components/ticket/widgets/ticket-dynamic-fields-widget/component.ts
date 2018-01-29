import { ContextService, ContextNotification } from '@kix/core/dist/browser/context';
import { TicketService } from '@kix/core/dist/browser/ticket';
import { ApplicationStore } from '@kix/core/dist/browser/application/ApplicationStore';
import { DynamicFieldsSettings } from './DynamicFieldsSettings';
import { DynamicFieldWidgetComponentState } from './DynamicFieldWidgetComponentState';

class TicketDescriptionWIdgetComponent {

    private state: DynamicFieldWidgetComponentState;

    public onCreate(input: any): void {
        this.state = new DynamicFieldWidgetComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
        this.state.ticketId = Number(input.ticketId);
    }

    public onMount(): void {
        ContextService.getInstance().addStateListener(this.contextNotified.bind(this));
        const context = ContextService.getInstance().getContext();

        this.state.widgetConfiguration = context
            ? context.getWidgetConfiguration<DynamicFieldsSettings>(this.state.instanceId)
            : undefined;

        this.state.configuredDynamicFields = this.state.widgetConfiguration.settings.dynamicFields;
        this.setDynamicFields();
    }

    private contextNotified(id: string | number, type: ContextNotification, ...args): void {
        if (id === this.state.ticketId && type === ContextNotification.OBJECT_UPDATED) {
            this.setDynamicFields();
        }
    }

    private setDynamicFields(): void {
        if (this.state.ticketId) {
            const ticketDetails = TicketService.getInstance().getTicketDetails(this.state.ticketId);
            if (ticketDetails && ticketDetails.ticket) {
                this.state.dynamicFields = ticketDetails.ticket.DynamicFields;
                this.state.filteredDynamicFields = this.state.dynamicFields
                    .filter((df) => this.state.configuredDynamicFields.some((cd) => cd === df.Name));
            }
        }
    }

    private expandWidget(): void {
        ApplicationStore.getInstance().toggleDialog(
            'ticket-dynamic-fields-container', {
                dynamicFields: this.state.dynamicFields,
                ticketId: this.state.ticketId
            }
        );
    }

    private print(): void {
        alert('Drucken ...');
    }

    private edit(): void {
        alert('Bearbeiten ...');
    }
}

module.exports = TicketDescriptionWIdgetComponent;
