import {
    ICreationDialogExtension,
    CreationDialog
} from '@kix/core';

export class TicketCreationDialogExtension implements ICreationDialogExtension {
    public getDialog(): CreationDialog {
        return new CreationDialog(
            "ticket-creation-dialog",
            "Ticket erstellen",
            "Erstellen eines neuen Tickets",
            "",
            this.getTemplatePath()
        );
    }

    private getTemplatePath(): string {
        const packageJson = require('../../../../package.json');
        const version = packageJson.version;
        return '/@kix/frontend$' + version + '/dist/components/dialogs/ticket-creation/';
    }
}

module.exports = (data, host, options) => {
    return new TicketCreationDialogExtension();
};
