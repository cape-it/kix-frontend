import {
    ICreationDialogExtension,
    CreationDialog
} from '@kix/core';

export class FAQCreationDialogExtension implements ICreationDialogExtension {
    public getDialog(): CreationDialog {
        return new CreationDialog(
            "faq-creation-dialog",
            "FAQ erstellen",
            "Erstellen eines neuen FAQ Eintrages",
            "",
            this.getTemplatePath()
        );
    }

    private getTemplatePath(): string {
        const packageJson = require('../../../package.json');
        const version = packageJson.version;
        return '/@kix/frontend$' + version + '/dist/components/dialogs/faq-creation/';
    }
}

module.exports = (data, host, options) => {
    return new FAQCreationDialogExtension();
};
