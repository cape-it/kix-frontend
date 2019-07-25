/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction, OverlayType, ComponentContent, ConfirmOverlayContent } from "../../../model";
import { SearchService } from "../../kix/search/SearchService";
import { OverlayService } from "../../OverlayService";

export class SaveSearchAction extends AbstractAction {

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Save Search';
        this.icon = 'kix-icon-save';
    }

    public canRun(): boolean {
        const cache = SearchService.getInstance().getSearchCache();
        return typeof cache !== 'undefined' && cache !== null;
    }

    public async run(event: any): Promise<void> {
        if (this.canRun()) {
            const content = new ComponentContent('save-search-template-overlay', null);
            OverlayService.getInstance().openOverlay(
                OverlayType.CONTENT_OVERLAY, 'save-search-template', content, 'Translatable#Save Search',
                false, null, null, true
            );
        }
    }

}