import { ComponentState } from './ComponentState';
import { TicketLabelProvider, TicketService } from "@kix/core/dist/browser/ticket";
import { ContextService } from '@kix/core/dist/browser/context';
import { ObjectIcon, KIXObjectType, Ticket, SysconfigUtil } from '@kix/core/dist/model';
import { ActionFactory, IdService } from '@kix/core/dist/browser';

class Component {

    private state: ComponentState;
    private contextListernerId: string;

    public onCreate(input: any): void {
        this.state = new ComponentState();
        this.contextListernerId = IdService.generateDateBasedId('ticket-info-');
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        this.state.labelProvider = new TicketLabelProvider();
        const context = ContextService.getInstance().getActiveContext();
        context.registerListener(this.contextListernerId, {
            sidebarToggled: () => { (this as any).setStateDirty('ticket'); },
            explorerBarToggled: () => { (this as any).setStateDirty('ticket'); },
            objectListChanged: () => { return; },
            filteredObjectListChanged: () => { return; },
            objectChanged: async (ticketId: string, ticket: Ticket, type: KIXObjectType) => {
                if (type === KIXObjectType.TICKET) {
                    this.initWidget(ticket);
                }
            }
        });
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        const customerInfoOverlayConfig = context ? context.getWidgetConfiguration('customer-info-overlay') : undefined;
        if (customerInfoOverlayConfig && customerInfoOverlayConfig.settings) {
            this.state.customerInfoGroups = customerInfoOverlayConfig.settings.groups;
        }

        const contactInfoOverlayConfig = context ? context.getWidgetConfiguration('contact-info-overlay') : undefined;
        if (contactInfoOverlayConfig && contactInfoOverlayConfig.settings) {
            this.state.contactInfoGroups = contactInfoOverlayConfig.settings.groups;
        }

        await this.initWidget(await context.getObject<Ticket>());
    }

    private async initWidget(ticket: Ticket): Promise<void> {
        this.state.ticket = ticket;
        if (this.state.ticket) {
            this.state.isPending = await TicketService.getInstance().hasPendingState(this.state.ticket);
            this.state.isAccountTimeEnabled = await SysconfigUtil.isTimeAccountingEnabled();
        }

        this.setActions();
    }

    private setActions(): void {
        if (this.state.widgetConfiguration && this.state.ticket) {
            this.state.actions = ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, false, [this.state.ticket]
            );
        }
    }

    public print(): void {
        alert('Drucken ...');
    }

    public edit(): void {
        alert('Bearbeiten ...');
    }

    public getIncidentStateId(): number {
        const serviceId = this.state.ticket.ServiceID;
        let incidentStateId = 0;
        const objectData = ContextService.getInstance().getObjectData();
        if (objectData) {
            const service = objectData.services.find((s) => s.ServiceID === serviceId);
            if (service) {
                incidentStateId = service.IncidentState.CurInciStateID;
            }
        }

        return incidentStateId;
    }

    public getIcon(object: string, objectId: string): ObjectIcon {
        return new ObjectIcon(object, objectId);
    }

}

module.exports = Component;
