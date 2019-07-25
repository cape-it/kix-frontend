/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { AbstractMarkoComponent, BrowserUtil } from '../../../core/browser';
import { SearchService } from '../../../core/browser/kix/search/SearchService';
import { TranslationService } from '../../../core/browser/i18n/TranslationService';
import { TreeNode } from '../../../core/model';

class Component extends AbstractMarkoComponent<ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        this.state.translations = await TranslationService.createTranslationObject([
            'Translatable#Title', 'Translatable#Search', 'Translatable#Cancel', 'Translatable#Save',
            'Translatable#Search Title'
        ]);

        const bookmarks = await SearchService.getInstance().getSearchBookmarks();
        this.state.nodes = bookmarks.map((b) => new TreeNode(b.title, b.title, b.icon));

        const cache = SearchService.getInstance().getSearchCache();
        if (cache) {
            const currentNodes = this.state.nodes.filter((n) => n.label === cache.name);
            this.searchChanged(currentNodes);
        }

    }

    public searchChanged(nodes: TreeNode[]): void {
        if (nodes && nodes.length) {
            this.state.currentNodes = nodes;
            this.state.name = this.state.currentNodes[0].label;
        } else {
            this.state.currentNodes = [];
        }
    }

    public nameChanged(event: any): void {
        this.state.name = event && event.target && event.target.value !== '' ? event.target.value : null;
    }

    public async keyPressed(event: any): Promise<void> {
        if (event.key === 'Enter') {
            this.closeOverlay(true);
        }
    }

    public async closeOverlay(save: boolean = false): Promise<void> {
        if (save) {
            if (!this.state.name) {
                this.state.nameInvalid = true;
            } else {
                this.state.nameInvalid = false;

                const existingName = this.state.currentNodes && this.state.currentNodes.length
                    ? this.state.currentNodes[0].label
                    : null;

                await SearchService.getInstance().saveCache(this.state.name, existingName);
                BrowserUtil.openSuccessOverlay('Translatable#Search successfully saved.');

                (this as any).emit('closeOverlay');
            }
        } else {
            (this as any).emit('closeOverlay');
        }
    }

}

module.exports = Component;