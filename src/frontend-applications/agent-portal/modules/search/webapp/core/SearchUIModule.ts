/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IUIModule } from '../../../../model/IUIModule';
import { ContextMode } from '../../../../model/ContextMode';
import { ContextDescriptor } from '../../../../model/ContextDescriptor';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { ContextType } from '../../../../model/ContextType';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { ActionFactory } from '../../../../modules/base-components/webapp/core/ActionFactory';
import { SearchContext } from './SearchContext';
import { NewSearchAction, EditSearchAction, SaveSearchAction, DeleteSearchAction, LoadSearchAction } from './actions';
import { SearchService } from './SearchService';

export class UIModule implements IUIModule {

    public priority: number = 9999;

    public name: string = 'SearchUIModule';

    public async unRegister(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async register(): Promise<void> {

        const searchContext = new ContextDescriptor(
            SearchContext.CONTEXT_ID, [KIXObjectType.ANY], ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'search', ['search'], SearchContext, [],
            'Translatable#Search', 'kix-icon-search'
        );
        ContextService.getInstance().registerContext(searchContext);

        const dialogs = await ContextService.getInstance().getContextDescriptors(ContextMode.SEARCH);
        if (dialogs && dialogs.length) {
            ActionFactory.getInstance().registerAction('new-search-action', NewSearchAction);
            ActionFactory.getInstance().registerAction('edit-search-action', EditSearchAction);
            ActionFactory.getInstance().registerAction('save-search-action', SaveSearchAction);
            ActionFactory.getInstance().registerAction('delete-search-action', DeleteSearchAction);
            ActionFactory.getInstance().registerAction('load-search-action', LoadSearchAction);
        }

        this.registerBookmarks();
    }

    private async registerBookmarks(): Promise<void> {
        await SearchService.getInstance().getSearchBookmarks(true);
    }

}
