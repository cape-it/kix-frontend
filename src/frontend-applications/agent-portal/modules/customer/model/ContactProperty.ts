/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

export enum ContactProperty {

    ID = 'ID',

    FIRSTNAME = 'Firstname',

    LASTNAME = 'Lastname',

    LOGIN = 'Login',

    CITY = 'City',

    STREET = 'Street',

    COMMENT = 'Comment',

    COUNTRY = 'Country',

    EMAIL = 'Email',

    FAX = 'Fax',

    MOBILE = 'Mobile',

    PHONE = 'Phone',

    PRIMARY_ORGANISATION_ID = 'PrimaryOrganisationID',

    ORGANISATION_IDS = 'OrganisationIDs',

    TITLE = 'Title',

    ZIP = 'Zip',

    TICKET_STATS = 'TicketStats',

    OPEN_TICKETS_COUNT = 'OPEN_TICKETS_COUNT',

    ESCALATED_TICKETS_COUNT = 'ESCALATED_TICKETS_COUNT',

    REMINDER_TICKETS_COUNT = 'REMINDER_TICKETS_COUNT',

    CREATE_NEW_TICKET = 'CREATE_NEW_TICKET',

    PASSWORD = 'Password',

    // UI properties
    VALID = 'Valid',
    PRIMARY_ORGANISATION = 'PrimaryOrganisation',
    PRIMARY_ORGANISATION_NUMBER = 'PrimaryOrganisationNumber',
    ORGANISATIONS = 'Organisations',

    // search property
    FULLTEXT = 'Fulltext'

}