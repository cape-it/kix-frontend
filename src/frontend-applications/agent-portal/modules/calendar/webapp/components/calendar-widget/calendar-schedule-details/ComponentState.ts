/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { Ticket } from '../../../../../ticket/model/Ticket';
import { TicketLabelProvider } from '../../../../../ticket/webapp/core';
import { ObjectIcon } from '../../../../../icon/model/ObjectIcon';
import { RoutingConfiguration } from '../../../../../../model/configuration/RoutingConfiguration';

export class ComponentState {

    public constructor(
        public routingConfiguration: RoutingConfiguration = null,
        public properties: string[] = [],
        public ticket: Ticket = null,
        public prepared: boolean = false,
        public labelProvider: TicketLabelProvider = new TicketLabelProvider(),
        public title: string = '',
        public organisation: string = '',
        public ticketNumber: string = '',
        public icon: string | ObjectIcon = null,
        public avatar: ObjectIcon | string = null,
        public initials: string = '',
        public contactTooltip: string = '',
        public userColor: string = ''
    ) { }

}
