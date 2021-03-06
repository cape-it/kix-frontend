/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectService } from '../../../../modules/base-components/webapp/core/KIXObjectService';
import { Contact } from '../../model/Contact';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { TreeNode } from '../../../base-components/webapp/core/tree';
import { KIXObject } from '../../../../model/kix/KIXObject';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { ContactDetailsContext } from '.';
import { FilterCriteria } from '../../../../model/FilterCriteria';
import { SearchOperator } from '../../../search/model/SearchOperator';
import { FilterDataType } from '../../../../model/FilterDataType';
import { FilterType } from '../../../../model/FilterType';
import { SearchProperty } from '../../../search/model/SearchProperty';
import { KIXObjectSpecificCreateOptions } from '../../../../model/KIXObjectSpecificCreateOptions';
import { NewContactDialogContext } from './context';

export class ContactService extends KIXObjectService<Contact> {

    private static INSTANCE: ContactService = null;

    public static getInstance(): ContactService {
        if (!ContactService.INSTANCE) {
            ContactService.INSTANCE = new ContactService();
        }

        return ContactService.INSTANCE;
    }

    private constructor() {
        super(KIXObjectType.CONTACT);
        this.objectConstructors.set(KIXObjectType.CONTACT, [Contact]);
    }

    public isServiceFor(kixObjectType: KIXObjectType) {
        return kixObjectType === KIXObjectType.CONTACT;
    }

    public getLinkObjectName(): string {
        return 'Person';
    }

    public determineDependendObjects(contacts: Contact[], targetObjectType: KIXObjectType): string[] | number[] {
        let ids = [];

        if (targetObjectType === KIXObjectType.ORGANISATION) {
            contacts.forEach((contact) => {
                contact.OrganisationIDs.forEach((organisationId) => {
                    if (!ids.some((id) => id === organisationId)) {
                        ids.push(organisationId);
                    }
                });
            });
        } else if (targetObjectType === KIXObjectType.TICKET) {
            contacts.forEach((contact) => {
                const ticketIds = contact.Tickets.map(
                    (t) => (typeof t === 'number' || typeof t === 'string') ? t : t.TicketID
                );

                if (ticketIds.length) {
                    ids = [...ids, ...ticketIds];
                }
            });
        }

        return ids;
    }

    public async getTreeNodes(
        property: string, showInvalid?: boolean, invalidClickable?: boolean, filterIds?: Array<string | number>
    ): Promise<TreeNode[]> {
        let nodes: TreeNode[] = [];

        switch (property) {
            default:
                nodes = await super.getTreeNodes(property, showInvalid, invalidClickable, filterIds);
        }

        return nodes;
    }

    public async getObjectUrl(object?: KIXObject, objectId?: string | number): Promise<string> {
        const id = object ? object.ObjectId : objectId;
        const context = ContextService.getInstance().getActiveContext();
        return context.descriptor.urlPaths[0] + '/' + id;
    }

    public async prepareFullTextFilter(searchValue): Promise<FilterCriteria[]> {
        return [
            new FilterCriteria(
                SearchProperty.FULLTEXT, SearchOperator.LIKE, FilterDataType.STRING, FilterType.AND, searchValue
            )
        ];
    }

    public async updateObjectByForm(
        objectType: KIXObjectType | string, formId: string, objectId: number | string,
        cacheKeyPrefix: string = objectType
    ): Promise<string | number> {
        if (objectId) {
            return super.updateObjectByForm(objectType, formId, objectId, cacheKeyPrefix);
        } else {
            return super.createObjectByForm(objectType, formId, null, cacheKeyPrefix);
        }
    }

    public async createObjectByForm(
        objectType: KIXObjectType | string, formId: string, createOptions?: KIXObjectSpecificCreateOptions,
        cacheKeyPrefix: string = objectType
    ): Promise<string | number> {
        const contactId = await super.createObjectByForm(objectType, formId, createOptions, cacheKeyPrefix);

        const context = ContextService.getInstance().getActiveContext<NewContactDialogContext>();
        context?.setAdditionalInformation('NEW_CONTACT_ID', contactId);

        return contactId;
    }
}
