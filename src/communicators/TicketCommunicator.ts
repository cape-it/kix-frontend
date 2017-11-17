import {
    SocketEvent,
    CreateArticle,
    CreateTicket,
} from '@kix/core/';

import {
    SearchTicketsRequest,
    SearchTicketsResponse,
    TicketCreationEvent,
    TicketCreationRequest,
    TicketEvent,
    TicketCreationResponse,
    TicketCreationError,
    TicketLoadDataRequest,
    TicketLoadDataResponse
} from '@kix/core/dist/model/client/ticket/socket';

import { Ticket } from '@kix/core/dist/model/client/ticket/model';

import { KIXCommunicator } from './KIXCommunicator';

export class TicketCommunicator extends KIXCommunicator {

    public registerNamespace(socketIO: SocketIO.Server): void {
        const nsp = socketIO.of('/tickets');
        nsp.on(SocketEvent.CONNECTION, (client: SocketIO.Socket) => {
            this.registerEvents(client);
        });
    }

    private registerEvents(client: SocketIO.Socket): void {
        client.on(TicketEvent.LOAD_TICKETS, async (data: SearchTicketsRequest) => {
            const tickets = await this.ticketService.getTickets(data.token, data.properties, data.limit);
            client.emit(TicketEvent.TICKETS_LOADED, new SearchTicketsResponse((tickets as Ticket[])));
        });

        client.on(TicketCreationEvent.CREATE_TICKET, async (data: TicketCreationRequest) => {

            const article = new CreateArticle(data.subject, data.description, null, 'text/html', 'utf8');

            const ticket = new CreateTicket(
                data.subject, data.customerUser, data.customerId, data.stateId, data.priorityId,
                data.queueId, null, data.typeId, data.serviceId, data.slaId, data.ownerId,
                data.responsibleId, data.pendingTime, data.dynamicFields, [article]
            );

            this.ticketService.createTicket(data.token, ticket)
                .then((ticketId: number) => {
                    client.emit(TicketCreationEvent.TICKET_CREATED, new TicketCreationResponse(ticketId));
                })
                .catch((error) => {
                    const creationError = new TicketCreationError(error.errorMessage.body);
                    client.emit(TicketCreationEvent.CREATE_TICKET_FAILED, creationError);
                });
        });

        client.on(TicketCreationEvent.LOAD_TICKET_DATA, async (data: TicketLoadDataRequest) => {
            const ticketStates = await this.ticketStateService.getTicketStates(data.token, null, null, null, {
                fields: 'TicketState.ID,TicketState.Name'
            });

            const ticketTypes = await this.ticketTypeService.getTicketTypes(data.token, null, null, null, {
                fields: 'TicketType.ID,TicketType.Name'
            });

            const ticketPriorities =
                await this.ticketPriorityService.getTicketPriorities(data.token, null, null, null, {
                    fields: 'Priority.ID,Priority.Name'
                });

            const users = await this.userService.getUsers(data.token, {
                fields: 'User.UserLogin,User.UserID'
            });

            const queues = await this.queueService.getQueues(data.token, null, null, null, {
                fields: 'Queue.QueueID,Queue.Name'
            });

            const response = new TicketLoadDataResponse(
                [], ticketStates, ticketTypes, ticketPriorities, queues, [], [], users
            );

            client.emit(TicketCreationEvent.TICKET_DATA_LOADED, response);
        });
    }

}
