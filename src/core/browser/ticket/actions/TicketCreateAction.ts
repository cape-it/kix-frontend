/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction } from '../../../model/components/action/AbstractAction';
import { CRUD } from '../../../model';
import { UIComponentPermission } from '../../../model/UIComponentPermission';
import { TicketDialogUtil } from '../TicketDialogUtil';

export class TicketCreateAction extends AbstractAction {

    public hasLink: boolean = true;

    public permissions = [
        new UIComponentPermission('tickets', [CRUD.CREATE])
    ];

    public async initAction(): Promise<void> {
        this.text = 'Translatable#New Ticket';
        this.icon = 'kix-icon-new-ticket';
    }

    public async run(): Promise<void> {
        TicketDialogUtil.createTicket();
    }

}
