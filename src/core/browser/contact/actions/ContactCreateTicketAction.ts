import { AbstractAction } from '../../../model/components/action/AbstractAction';
import { ContextMode, KIXObjectType } from '../../../model';
import { ContextService } from '../../context';

export class ContactCreateTicketAction extends AbstractAction {

    public initAction(): void {
        this.text = "Neues Ticket";
        this.icon = "kix-icon-new-ticket";
    }

    public run(): void {
        ContextService.getInstance().setDialogContext(null, KIXObjectType.TICKET, ContextMode.CREATE);
    }

}
