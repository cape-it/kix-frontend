import { AbstractAction } from '../../../../../model';

export class TicketStateImportAction extends AbstractAction {

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Import';
        this.icon = 'kix-icon-import';
    }

}
