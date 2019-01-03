import { IMainMenuExtension } from '../../core/extensions';
import { SearchContext } from '../../core/browser/search';
import { TicketListContext } from '../../core/browser/ticket';

export class Extension implements IMainMenuExtension {

    public mainContextId: string = SearchContext.CONTEXT_ID;

    public contextIds: string[] = [SearchContext.CONTEXT_ID, TicketListContext.CONTEXT_ID];

    public primaryMenu: boolean = true;

    public icon: string = "kix-icon-search";

    public text: string = "Suche";

}

module.exports = (data, host, options) => {
    return new Extension();
};
