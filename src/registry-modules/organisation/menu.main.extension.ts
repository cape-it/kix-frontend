import { IMainMenuExtension } from '../../core/extensions';
import { ContactDetailsContext } from '../../core/browser/contact';
import { OrganisationContext, OrganisationDetailsContext } from '../../core/browser/organisation';

export class Extension implements IMainMenuExtension {

    public mainContextId: string = OrganisationContext.CONTEXT_ID;

    public contextIds: string[] = [
        OrganisationContext.CONTEXT_ID, OrganisationDetailsContext.CONTEXT_ID, ContactDetailsContext.CONTEXT_ID
    ];

    public primaryMenu: boolean = true;

    public icon: string = "kix-icon-organisation";

    public text: string = "Translatable#Organisations";


}

module.exports = (data, host, options) => {
    return new Extension();
};