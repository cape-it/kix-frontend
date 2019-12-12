/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction } from "../../../../../modules/base-components/webapp/core/AbstractAction";
import { SearchService } from "..";
import { CacheState } from "../../../model/CacheState";
import { ContextService } from "../../../../../modules/base-components/webapp/core/ContextService";
import { ContextMode } from "../../../../../model/ContextMode";

export class EditSearchAction extends AbstractAction {

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Edit Search';
        this.icon = 'kix-icon-edit';
    }

    public canRun(): boolean {
        const cache = SearchService.getInstance().getSearchCache();
        return typeof cache !== 'undefined' && cache !== null;
    }

    public async run(event: any): Promise<void> {
        const cache = SearchService.getInstance().getSearchCache();
        if (cache) {
            cache.status = CacheState.VALID;
            ContextService.getInstance().setDialogContext(null, cache.objectType, ContextMode.SEARCH);
        }
    }

}