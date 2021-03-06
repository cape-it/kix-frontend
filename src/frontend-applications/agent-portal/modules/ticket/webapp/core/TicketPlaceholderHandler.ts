/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IPlaceholderHandler } from '../../../base-components/webapp/core/IPlaceholderHandler';
import { Ticket } from '../../model/Ticket';
import { PlaceholderService } from '../../../../modules/base-components/webapp/core/PlaceholderService';
import { SortUtil } from '../../../../model/SortUtil';
import { ArticleProperty } from '../../model/ArticleProperty';
import { DataType } from '../../../../model/DataType';
import { SortOrder } from '../../../../model/SortOrder';
import { ArticlePlaceholderHandler } from './ArticlePlaceholderHandler';
import { QueuePlaceholderHandler } from './QueuePlaceholderHandler';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { ContextType } from '../../../../model/ContextType';
import { KIXObjectLoadingOptions } from '../../../../model/KIXObjectLoadingOptions';
import { KIXObjectService } from '../../../../modules/base-components/webapp/core/KIXObjectService';
import { User } from '../../../user/model/User';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { UserPlaceholderHandler } from '../../../user/webapp/core/UserPlaceholderHandler';
import { LabelService } from '../../../../modules/base-components/webapp/core/LabelService';
import { TicketProperty } from '../../model/TicketProperty';
import { DateTimeUtil } from '../../../../modules/base-components/webapp/core/DateTimeUtil';
import { TranslationService } from '../../../../modules/translation/webapp/core/TranslationService';
import { KIXObjectProperty } from '../../../../model/kix/KIXObjectProperty';
import {
    AdditionalContextInformation
} from '../../../../modules/base-components/webapp/core/AdditionalContextInformation';
import { FormService } from '../../../../modules/base-components/webapp/core/FormService';
import { FormContext } from '../../../../model/configuration/FormContext';
import { OrganisationPlaceholderHandler } from '../../../customer/webapp/core/OrganisationPlaceholderHandler';
import { ContactPlaceholderHandler } from '../../../customer/webapp/core/ContactPlaceholderHandler';
import {
    DynamicFieldValuePlaceholderHandler
} from '../../../dynamic-fields/webapp/core/DynamicFieldValuePlaceholderHandler';
import { AbstractPlaceholderHandler } from '../../../../modules/base-components/webapp/core/AbstractPlaceholderHandler';
import { Article } from '../../model/Article';
import { ArticleLoadingOptions } from '../../model/ArticleLoadingOptions';
import { Contact } from '../../../customer/model/Contact';
import { Organisation } from '../../../customer/model/Organisation';

export class TicketPlaceholderHandler extends AbstractPlaceholderHandler {

    public handlerId: string = '050-TicketPlaceholderHandler';
    protected objectStrings: string[] = [
        'TICKET',
        'ARTICLE', 'FIRST', 'LAST', 'CUSTOMER', 'AGENT',
        'OWNER', 'TICKETOWNER', 'RESPONSIBLE', 'TICKETRESPONSIBLE',
        'CONTACT', 'ORG',
        'QUEUE'
    ];

    private static INSTANCE: TicketPlaceholderHandler;

    public static getInstance(): TicketPlaceholderHandler {
        if (!TicketPlaceholderHandler.INSTANCE) {
            TicketPlaceholderHandler.INSTANCE = new TicketPlaceholderHandler();
        }
        return TicketPlaceholderHandler.INSTANCE;
    }

    private extendedPlaceholderHandler: IPlaceholderHandler[] = [];

    public isHandlerForObjectType(objectType: KIXObjectType | string): boolean {
        return objectType === KIXObjectType.TICKET;
    }

    public addExtendedPlaceholderHandler(handler: IPlaceholderHandler): void {
        this.extendedPlaceholderHandler.push(handler);
    }

    public async replace(placeholder: string, ticket?: Ticket, language?: string): Promise<string> {
        let result = '';
        const objectString = PlaceholderService.getInstance().getObjectString(placeholder);
        if (!ticket) {
            ticket = await this.getTicket();
        }
        if (ticket && this.isHandlerFor(objectString)) {
            const attribute: string = PlaceholderService.getInstance().getAttributeString(placeholder);
            if (!PlaceholderService.getInstance().translatePlaceholder(placeholder)) {
                language = 'en';
            }
            if (attribute) {
                switch (objectString) {
                    case 'TICKET':
                        result = await this.getTicketValue(attribute, ticket, language, placeholder);
                        break;
                    case 'FIRST':
                    case 'LAST':
                        const flArticles = await this.getArticles(ticket);
                        if (flArticles && !!flArticles.length) {
                            const article = SortUtil.sortObjects(
                                flArticles, ArticleProperty.ARTICLE_ID, DataType.NUMBER,
                                objectString === 'FIRST' ? SortOrder.UP : SortOrder.DOWN
                            )[0];
                            if (article) {
                                result = await ArticlePlaceholderHandler.prototype.replace(
                                    placeholder, article, language
                                );
                            }
                        }
                        break;
                    case 'CUSTOMER':
                    case 'AGENT':
                        const caArticles = await this.getArticles(ticket);
                        if (caArticles && !!caArticles.length) {
                            const relevantArticles = caArticles.filter(
                                (a) => a.SenderType === (objectString === 'AGENT' ? 'agent' : 'external')
                            );
                            const lastArticle = SortUtil.sortObjects(
                                relevantArticles, ArticleProperty.ARTICLE_ID, DataType.NUMBER, SortOrder.DOWN
                            )[0];
                            if (lastArticle) {
                                result = await ArticlePlaceholderHandler.prototype.replace(
                                    placeholder, lastArticle, language
                                );
                            }
                        }
                        break;
                    case 'ARTICLE':
                        const dialogContext = ContextService.getInstance().getActiveContext();
                        if (dialogContext) {
                            const articleId = dialogContext.getAdditionalInformation('REFERENCED_ARTICLE_ID');
                            if (articleId) {
                                let referencedArticle;
                                if (ticket.Articles && !!ticket.Articles.length) {
                                    referencedArticle = ticket.Articles.find(
                                        (a) => a.ArticleID.toString() === articleId.toString()
                                    );
                                } else {
                                    const articles = await this.getArticles(ticket, articleId);
                                    if (articles && articles.length) {
                                        referencedArticle = articles[0];
                                    }
                                }
                                if (referencedArticle) {
                                    result = await ArticlePlaceholderHandler.prototype.replace(
                                        placeholder, referencedArticle, language
                                    );
                                }
                            }
                        }
                        break;
                    case 'OWNER':
                    case 'TICKETOWNER':
                        if (ticket.OwnerID && !isNaN(Number(ticket.OwnerID))) {
                            const loadingOptions = new KIXObjectLoadingOptions(
                                null, null, null, null, ['Preferences']
                            );
                            const users = await KIXObjectService.loadObjects<User>(
                                KIXObjectType.USER, [ticket.OwnerID], loadingOptions, null, true, true, true
                            ).catch((error) => [] as User[]);
                            if (users && !!users.length) {
                                result = await UserPlaceholderHandler.prototype.replace(
                                    placeholder, users[0], language
                                );
                            }
                        }
                        break;
                    case 'RESPONSIBLE':
                    case 'TICKETRESPONSIBLE':
                        if (ticket.ResponsibleID && !isNaN(Number(ticket.ResponsibleID))) {
                            const loadingOptions = new KIXObjectLoadingOptions(
                                null, null, null, null, ['Preferences']
                            );
                            const users = await KIXObjectService.loadObjects<User>(
                                KIXObjectType.USER, [ticket.ResponsibleID], loadingOptions, null, true, true, true
                            ).catch((error) => [] as User[]);
                            if (users && !!users.length) {
                                result = await UserPlaceholderHandler.prototype.replace(
                                    placeholder, users[0], language
                                );
                            }
                        }
                        break;
                    case 'CONTACT':
                        let contact: Contact;
                        if (ticket.ContactID && !isNaN(Number(ticket.ContactID))) {
                            const contacts = await KIXObjectService.loadObjects(
                                KIXObjectType.CONTACT, [ticket.ContactID], null, null, true
                            ).catch((error) => []);
                            if (contacts && !!contacts.length) {
                                contact = contacts[0];
                            }
                        } else if (ticket instanceof Contact) {
                            contact = ticket;
                        }
                        if (contact) {
                            result = await ContactPlaceholderHandler.prototype.replace(
                                placeholder, contact, language
                            );
                        }
                        break;
                    case 'ORG':
                        let organisation: Organisation;
                        if (ticket.OrganisationID && !isNaN(Number(ticket.OrganisationID))) {
                            const organisations = await KIXObjectService.loadObjects(
                                KIXObjectType.ORGANISATION, [ticket.OrganisationID], null, null, true
                            ).catch((error) => []);
                            if (organisations && !!organisations.length) {
                                organisation = organisations[0];
                            }
                        } else if (ticket instanceof Organisation) {
                            organisation = ticket;
                        }
                        if (organisation) {
                            result = await OrganisationPlaceholderHandler.prototype.replace(
                                placeholder, organisation, language
                            );
                        }
                        break;
                    case 'QUEUE':
                        if (ticket.QueueID) {
                            result = await QueuePlaceholderHandler.prototype.replace(placeholder, ticket, language);
                        }
                        break;
                    default:
                }
            }
        }
        return result;
    }

    private async getArticles(ticket: Ticket, articleId?: number) {
        let articles = ticket.Articles;
        if (!Array.isArray(articles) || !articles.length) {
            articles = await KIXObjectService.loadObjects<Article>(
                KIXObjectType.ARTICLE, articleId ? [articleId] : null,
                new KIXObjectLoadingOptions(
                    null, null, null, [ArticleProperty.ATTACHMENTS]
                ), new ArticleLoadingOptions(ticket.TicketID), true
            ).catch(() => [] as Article[]);
        }
        return articles;
    }

    private async getTicketValue(attribute: string, ticket?: Ticket, language?: string, placeholder?: string) {
        let result = '';
        let normalTicketAttribut: boolean = true;
        const optionsString: string = PlaceholderService.getInstance().getOptionsString(placeholder);

        if (
            PlaceholderService.getInstance().isDynamicFieldAttribute(attribute) && DynamicFieldValuePlaceholderHandler
        ) {
            result = await DynamicFieldValuePlaceholderHandler.getInstance().replaceDFValue(ticket, optionsString);
            normalTicketAttribut = false;
        } else if (this.extendedPlaceholderHandler.length && placeholder) {
            const handler = SortUtil.sortObjects(this.extendedPlaceholderHandler, 'handlerId').find(
                (ph) => ph.isHandlerFor(placeholder)
            );
            if (handler) {
                result = await handler.replace(placeholder, ticket, language);
                normalTicketAttribut = false;
            }
        }

        if (normalTicketAttribut && this.isKnownProperty(attribute)) {
            switch (attribute) {
                case TicketProperty.STATE_ID:
                case TicketProperty.QUEUE_ID:
                case TicketProperty.PRIORITY_ID:
                case TicketProperty.LOCK_ID:
                case TicketProperty.ORGANISATION_ID:
                case TicketProperty.CONTACT_ID:
                case TicketProperty.OWNER_ID:
                case TicketProperty.TYPE_ID:
                case TicketProperty.SERVICE_ID:
                case TicketProperty.RESPONSIBLE_ID:
                case TicketProperty.TICKET_ID:
                    result = ticket[attribute] ? ticket[attribute].toString() : '';
                    break;
                case TicketProperty.CREATED:
                case TicketProperty.CHANGED:
                case TicketProperty.PENDING_TIME:
                    result = await DateTimeUtil.getLocalDateTimeString(ticket[attribute], language);
                    break;
                case TicketProperty.CREATED_TIME_UNIX:
                    if (Number.isInteger(Number(ticket[attribute]))) {
                        result = await DateTimeUtil.getLocalDateTimeString(Number(ticket[attribute]) * 1000, language);
                    }
                    break;
                case TicketProperty.TITLE:
                    result = typeof ticket.Title !== 'undefined' ? ticket.Title : await this.getArticleSubject();
                    if (optionsString && Number.isInteger(Number(optionsString))) {
                        result = result.substr(0, Number(optionsString));
                    }
                    break;
                case TicketProperty.ARTICLES:
                case TicketProperty.ARTICLE_CREATE_TIME:
                case TicketProperty.ARTICLE_FLAG:
                case TicketProperty.ATTACHMENT_NAME:
                case KIXObjectProperty.DYNAMIC_FIELDS:
                case TicketProperty.LAST_CHANGE_TIME:
                case TicketProperty.LINK:
                case TicketProperty.LINKED_AS:
                case TicketProperty.TICKET_FLAG:
                case TicketProperty.WATCHERS:
                case ArticleProperty.FROM:
                case ArticleProperty.TO:
                case ArticleProperty.CC:
                case ArticleProperty.SUBJECT:
                case ArticleProperty.BODY:
                    break;
                default:
                    result = await LabelService.getInstance().getDisplayText(ticket, attribute, undefined, false);
                    result = typeof result !== 'undefined' && result !== null
                        ? await TranslationService.translate(result.toString(), undefined, language) : '';
            }
        }
        return result;
    }

    private isKnownProperty(property: string): boolean {
        const knownProperties = [
            ...Object.keys(TicketProperty).map((p) => TicketProperty[p]),
            ...Object.keys(KIXObjectProperty).map((p) => KIXObjectProperty[p]),
            ...Object.keys(ArticleProperty).map((p) => ArticleProperty[p])
        ];
        return knownProperties.some((p) => p === property);
    }

    public async getTicket(): Promise<Ticket> {
        let newObject = new Ticket();
        const mainContext = ContextService.getInstance().getActiveContext();
        if (mainContext) {
            this.setObject(newObject, await mainContext.getObject());
        }
        const dialogContext = ContextService.getInstance().getActiveContext();
        if (dialogContext) {
            const formId = dialogContext.getAdditionalInformation(AdditionalContextInformation.FORM_ID);
            const form = formId ? await FormService.getInstance().getForm(formId) : null;
            if (
                !newObject
                || (
                    form
                    && form.formContext === FormContext.NEW
                    && form.objectType === KIXObjectType.TICKET
                )
            ) {
                newObject = new Ticket();
                this.setObject(newObject, await dialogContext.getObject());
            }
            if (form && form.objectType === KIXObjectType.TICKET) {
                const formObject = dialogContext.getAdditionalInformation(AdditionalContextInformation.FORM_OBJECT);
                this.setObject(newObject, formObject, true);
            }
        }
        this.preparePendingTimeUnix(newObject);
        return newObject;
    }

    private setObject(newObject: Ticket, oldObject: {}, fromForm: boolean = false) {
        if (oldObject) {
            Object.getOwnPropertyNames(oldObject).forEach((property) => {
                if (
                    typeof oldObject[property] !== 'undefined'
                    && !(fromForm && this.ignoreProperty(property))
                ) {
                    if (property === KIXObjectProperty.DYNAMIC_FIELDS) {
                        this.setDynamicFields(newObject, oldObject as Ticket);
                    } else {
                        newObject[property] = oldObject[property];
                    }
                }
            });
        }
    }

    private preparePendingTimeUnix(ticket: Ticket) {
        if (ticket.PendingTime) {
            const pendingTimeUnix = Date.parse(ticket.PendingTime);
            if (!isNaN(Number(pendingTimeUnix))) {
                ticket.PendingTimeUnix = Math.floor(Number(pendingTimeUnix) / 1000);
            }
        }
    }

    private ignoreProperty(property: string): boolean {
        switch (property) {
            case TicketProperty.TICKET_ID:
            case TicketProperty.UNSEEN:
            case KIXObjectProperty.OBJECT_ID:
            case KIXObjectProperty.OBJECT_TYPE:
            case KIXObjectProperty.CREATE_BY:
            case KIXObjectProperty.CREATE_TIME:
            case KIXObjectProperty.CHANGE_BY:
            case KIXObjectProperty.CHANGE_TIME:
                return true;
            default:
                return false;
        }
    }

    private async getArticleSubject(): Promise<string> {
        let subject = '';
        const dialogContext = ContextService.getInstance().getActiveContext();
        if (dialogContext) {
            const context = ContextService.getInstance().getActiveContext();
            const formInstance = await context?.getFormManager()?.getFormInstance();
            const subjectValue = formInstance
                ? await formInstance.getFormFieldValueByProperty(ArticleProperty.SUBJECT) : null;
            subject = subjectValue && subjectValue.value ? subjectValue.value.toString() : '';
        }
        return subject;
    }

    private setDynamicFields(newObject: Ticket, oldObject: Ticket): void {
        if (!newObject.DynamicFields) {
            newObject.DynamicFields = [];
        }
        if (oldObject && Array.isArray(oldObject.DynamicFields) && oldObject.DynamicFields.length) {
            oldObject.DynamicFields.forEach((dfValue) => {
                const dfValueIndex = newObject.DynamicFields.findIndex((dfv) => dfv.Name === dfValue.Name);
                if (dfValueIndex === -1) {
                    newObject.DynamicFields.push(dfValue);
                } else {
                    newObject.DynamicFields[dfValueIndex] = dfValue;
                }
            });
        }
    }
}
