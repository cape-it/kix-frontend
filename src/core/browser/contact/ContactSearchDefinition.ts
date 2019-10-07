/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectType, FilterCriteria, KIXObjectLoadingOptions } from "../../model";
import { SearchDefinition, SearchResultCategory } from "../kix";
import { SearchProperty } from "../SearchProperty";
import { ContactService } from "./ContactService";
import { ContactSearchFormManager } from "./ContactSearchFormManager";

export class ContactSearchDefinition extends SearchDefinition {

    public constructor() {
        super(KIXObjectType.CONTACT);
        this.formManager = new ContactSearchFormManager();
    }

    public getLoadingOptions(criteria: FilterCriteria[]): KIXObjectLoadingOptions {
        return new KIXObjectLoadingOptions(criteria, null, null, ['Tickets'], null);
    }

    public async getSearchResultCategories(): Promise<SearchResultCategory> {
        const categories: SearchResultCategory[] = [];

        if (await this.checkReadPermissions('organisations')) {
            categories.push(
                new SearchResultCategory('Translatable#Organisations', KIXObjectType.ORGANISATION)
            );
        }
        if (await this.checkReadPermissions('tickets')) {
            categories.push(
                new SearchResultCategory('Translatable#Tickets', KIXObjectType.TICKET)
            );
        }
        return new SearchResultCategory('Translatable#Contacts', KIXObjectType.CONTACT, categories);
    }

    public async prepareFormFilterCriteria(criteria: FilterCriteria[]): Promise<FilterCriteria[]> {
        criteria = await super.prepareFormFilterCriteria(criteria);
        const fulltextCriteriaIndex = criteria.findIndex((c) => c.property === SearchProperty.FULLTEXT);
        if (fulltextCriteriaIndex !== -1) {
            const value = criteria[fulltextCriteriaIndex].value;
            criteria.splice(fulltextCriteriaIndex, 1);
            const filter = await ContactService.getInstance().prepareFullTextFilter(value.toString());
            criteria = [...criteria, ...filter];
        }
        return criteria;
    }

}
