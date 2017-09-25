import { IHttpService } from '@kix/core/';
import { injectable, inject } from 'inversify';
import {
    CreateArticle,
    DynamicField,
    ITicketService,
    History,
    Ticket,
    Article,
    Attachment,
    TicketResponse,
    CreateTicketRequest,
    CreateTicketResponse
} from '@kix/core';

@injectable()
export class TicketService implements ITicketService {

    private httpService: IHttpService;

    private TICKETS_RESOURCE_URI: string = "tickets";

    public constructor( @inject("IHttpService") httpService: IHttpService) {
        this.httpService = httpService;
    }

    public async getTicket(token: string, id: number): Promise<Ticket> {
        const response = await this.httpService.get<TicketResponse>(this.TICKETS_RESOURCE_URI + '/' + id, null, token);
        return response.Ticket;
    }

    public async createTicket(
        token: string, title: string, customerUser: string, stateId: number,
        priorityId: number, queueId: number, lockId: number, typeId: number,
        ServiceId: number, slaId: number, ownerId: number, responsibleId: number,
        pendingTime: number, dynamicFields: DynamicField[], articles: CreateArticle[]
    ): Promise<number> {

        const createTicketRequest = new CreateTicketRequest(
            title, customerUser, stateId, priorityId, queueId, lockId, typeId, ServiceId,
            slaId, ownerId, responsibleId, pendingTime, dynamicFields, articles
        );

        const response = await this.httpService.post<CreateTicketResponse>(
            this.TICKETS_RESOURCE_URI, createTicketRequest, token
        );

        return response.TicketID;
    }

    public updateTicket(
        token: string, ticketId: number, title: string, customerUser: string, stateId: number,
        priorityId: number, queueId: number, lockId: number, typeId: number, serviceId: number,
        slaId: number, ownerId: number, responsibleId: number, pendingTime: number, dynamicFields: DynamicField[]
    ): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public deleteTicket(token: string, ticketId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public getArticles(token: string, ticketId: number): Promise<Article[]> {
        throw new Error("Method not implemented.");
    }

    public getArticle(token: string, ticketId: number, articleId: number): Promise<Article> {
        throw new Error("Method not implemented.");
    }

    public getArticleAttachments(token: string, ticketId: number, articleId: number): Promise<Attachment[]> {
        throw new Error("Method not implemented.");
    }

    public getArticleAttachment(
        token: string, ticketId: number, articleId: number, attachmentId: number
    ): Promise<Attachment> {
        throw new Error("Method not implemented.");
    }

    public createArticleAttachment(
        token: string, ticketId: number, articleId: number, content: string, contentType: string, filename: string
    ): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public getTicketHistory(token: string, ticketId: number): Promise<History[]> {
        throw new Error("Method not implemented.");
    }

    public getTicketHistoryEntry(token: string, ticketId: number, historyId: number): Promise<History[]> {
        throw new Error("Method not implemented.");
    }

}
