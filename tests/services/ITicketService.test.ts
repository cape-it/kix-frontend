/* tslint:disable*/
import { container } from './../../src/Container';

import {
    ITicketService,
    IConfigurationService,
    HttpError,
    SortOrder,
    Ticket,
    TicketResponse,
    CreateTicketRequest,
    CreateTicketResponse,
    UpdateTicketRequest,
    UpdateTicketResponse,
    Article
} from '@kix/core';

import chaiAsPromised = require('chai-as-promised');
import chai = require('chai');

chai.use(chaiAsPromised);
const expect = chai.expect;

const resourcePath = "/tickets";

describe('Ticket Service', () => {
    let nockScope;
    let ticketService: ITicketService;
    let configurationService: IConfigurationService;
    let apiURL: string;

    before(async () => {
        await container.initialize();
        const nock = require('nock');
        ticketService = container.getDIContainer().get<ITicketService>("ITicketService");
        configurationService = container.getDIContainer().get<IConfigurationService>("IConfigurationService");
        apiURL = configurationService.getServerConfiguration().BACKEND_API_URL;
        nockScope = nock(apiURL);
    });

    it('service instance is registered in container.', () => {
        expect(ticketService).not.undefined;
    });

    describe('Create a valid request to retrieve a ticket.', () => {

        before(() => {
            nockScope
                .get(resourcePath + '/12345')
                .reply(200, buildTicketResponse(12345));
        });

        it('should return a ticket type object.', async () => {
            const ticketType: Ticket = await ticketService.getTicket('', 12345)
            expect(ticketType).not.undefined;
            expect(ticketType.TicketID).equal(12345);
        });
    });

    describe('Create Ticket', () => {
        describe('Create a valid request to create a new ticket.', () => {

            before(() => {
                nockScope
                    .post(resourcePath, new CreateTicketRequest('', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], []))
                    .reply(200, buildCreateTicketResponse(123456));
            });

            it('should return a the id of the new users.', async () => {
                const userId = await ticketService.createTicket('', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], []);
                expect(userId).equal(123456);
            });

        });

        describe('Create a invalid create request.', () => {

            before(() => {
                nockScope
                    .post(resourcePath, new CreateTicketRequest('', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], []))
                    .reply(400, {});
            });

            it('should throw an error if request is invalid.', async () => {
                const userId = await ticketService.createTicket('', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [], [])
                    .then((result) => {
                        expect(true).false;
                    }).catch((error: HttpError) => {
                        expect(error).instanceof(HttpError);
                        expect(error.status).equals(400);
                    });
            });

        });
    });

    describe('Update Ticket', () => {
        describe('Create a valid request to update an existing ticket.', () => {

            before(() => {
                nockScope
                    .patch(resourcePath + '/123456',
                    new UpdateTicketRequest('', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, []))
                    .reply(200, buildUpdateTicketResponse(123456));
            });

            it('should return the id of the ticket type.', async () => {
                const ticketId = await ticketService.updateTicket('', 123456, '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, []);
                expect(ticketId).equal(123456);
            });

        });

        describe('Create a invalid request to update an existing ticket type.', () => {
            before(() => {
                nockScope
                    .patch(resourcePath + '/123456',
                    new UpdateTicketRequest('', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, []))
                    .reply(400, {});
            });

            it('should throw a error.', async () => {
                const ticketId = await ticketService.updateTicket('', 123456, '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, [])
                    .then((result) => {
                        expect(true).false;
                    }).catch((error: HttpError) => {
                        expect(error).instanceof(HttpError);
                        expect(error.status).equals(400);
                    });
            });

        });
    });

    describe('Delete Ticket', () => {

        describe('Create a valid request to delete a ticket', () => {

            before(() => {
                nockScope
                    .delete(resourcePath + '/123456')
                    .reply(200, {});
            });

            it('Should resolve without any error', async () => {
                await ticketService.deleteTicket('', 123456).then(() => {
                    expect(true).true;
                }).catch((error) => {
                    expect(true).false;
                })
            });

        });

        describe('Create a invalid reqeust to delete a ticket.', () => {

            before(() => {
                nockScope
                    .delete(resourcePath + '/123456')
                    .reply(400, {});
            });

            it('should throw a error.', async () => {
                await ticketService.deleteTicket('', 123456)
                    .then((result) => {
                        expect(true).false;
                    }).catch((error: HttpError) => {
                        expect(error).instanceof(HttpError);
                        expect(error.status).equals(400);
                    });
            });

        });

    });

    describe("Ticket Articles", () => {

        describe("Create a valid request to recieve articles.", () => {
            before(() => {
                nockScope
                    .get(resourcePath + '/12345/articles')
                    .reply(200, {
                        Article: [{ ArticleID: 0 }, { ArticleID: 0 }, { ArticleID: 0 }, { ArticleID: 0 }]
                    });
            });

            it('should return articles from ticket.', async () => {
                const articles: Article[] = await ticketService.getArticles('', 12345)
                expect(articles).not.undefined;
                expect(articles).an('array');
                expect(articles).not.empty;
            });
        });

    });
});

function buildTicketResponse(id: number): TicketResponse {
    const response = new TicketResponse();
    response.Ticket = new Ticket();
    response.Ticket.TicketID = id;
    return response;
}

function buildCreateTicketResponse(id: number): CreateTicketResponse {
    const response = new CreateTicketResponse();
    response.TicketID = id;
    return response;
}

function buildUpdateTicketResponse(id: number): UpdateTicketResponse {
    const response = new UpdateTicketResponse();
    response.TicketID = id;
    return response;
}