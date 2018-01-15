import { TicketInfoComponentState } from './model/TicketInfoComponentState';
import { TicketService } from "@kix/core/dist/browser/ticket";

class TicketInfoWidgetComponent {

    private state: TicketInfoComponentState;

    public onCreate(input: any): void {
        this.state = new TicketInfoComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
        this.state.ticketId = input.ticketId;
        this.getTicket();
    }

    public onMount(): void {
        TicketService.getInstance().addStateListener(this.ticketStateChanged.bind(this));
        this.getTicket();
    }

    private ticketStateChanged(): void {
        this.getTicket();
        console.log('contact.................');
        console.log(this.state.contact);
        console.log('customer.................');
        console.log(this.state.customer);
    }

    private getTicket(): void {
        if (this.state.ticketId) {
            const ticketDetails = TicketService.getInstance().getTicketDetails(this.state.ticketId);
            if (ticketDetails) {
                this.state.ticket = ticketDetails.ticket;
                this.state.contact = ticketDetails.contact;
                this.state.customer = ticketDetails.customer;
            }
        }
    }
}

module.exports = TicketInfoWidgetComponent;
