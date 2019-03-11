import { AbstractAction } from '../../../model';

export class ConfigItemPrintAction extends AbstractAction {

    public initAction(): void {
        this.text = 'Translatable#Print';
        this.icon = 'kix-icon-print';
    }

}
