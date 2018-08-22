import { TicketDescriptionComponentState } from './TicketDescriptionComponentState';
import { ContextService } from '@kix/core/dist/browser/context';
import { WidgetType, Ticket, KIXObjectType, Context } from '@kix/core/dist/model/';
import { ActionFactory, WidgetService } from '@kix/core/dist/browser';

class TicketDescriptionWidgetComponent {

    private state: TicketDescriptionComponentState;

    public onCreate(input: any): void {
        this.state = new TicketDescriptionComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
        this.state.ticketId = Number(input.ticketId);
    }

    public async onMount(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        WidgetService.getInstance().setWidgetType('ticket-description-widget', WidgetType.GROUP);
        WidgetService.getInstance().setWidgetType('ticket-description-notes', WidgetType.GROUP);

        context.registerListener('ticket-description-widget', {
            explorerBarToggled: () => { return; },
            filteredObjectListChanged: () => { return; },
            objectListChanged: () => { return; },
            sidebarToggled: () => { return; },
            objectChanged: (ticketId: string, ticket: Ticket, type: KIXObjectType) => {
                if (type === KIXObjectType.TICKET) {
                    this.initWidget(context, ticket);
                }
            }
        });

        await this.initWidget(context);
    }

    private async initWidget(context: Context, ticket?: Ticket): Promise<void> {
        this.state.ticket = ticket ? ticket : await context.getObject<Ticket>();
        this.getFirstArticle();
        this.setActions();
        this.getTicketNotes();
    }

    private async getFirstArticle(): Promise<void> {
        if (this.state.ticket && this.state.ticket.Articles && this.state.ticket.Articles.length) {
            const articles = new Array(...this.state.ticket.Articles);
            articles.sort((a, b) => a.IncomingTime - b.IncomingTime);
            this.state.firstArticle = articles[0];
        }
    }

    private setActions(): void {
        if (this.state.widgetConfiguration && this.state.firstArticle) {
            this.state.actions = ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, false, [this.state.firstArticle]
            );
        }
    }

    private getTicketNotes(): void {
        const objectData = ContextService.getInstance().getObjectData();
        if (objectData) {
            if (this.state.ticket) {
                const ticketNotesDF = this.state.ticket.DynamicFields.find(
                    (df) => df.ID === objectData.ticketNotesDFId
                );
                if (ticketNotesDF) {
                    this.state.ticketNotes = ticketNotesDF.DisplayValue;
                }
            }
        }
    }
}

module.exports = TicketDescriptionWidgetComponent;
