/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { ComponentInput } from './ComponentInput';
import { TranslationService } from '../../../../../modules/translation/webapp/core/TranslationService';
import { KIXObjectPropertyFilter } from '../../../../../model/KIXObjectPropertyFilter';
import { TreeHandler, TreeService, TreeNode } from '../../core/tree';

class Component {

    private state: ComponentState;

    private predefinedFilter: KIXObjectPropertyFilter[];

    private treeHandler: TreeHandler;

    private currentFilterId: string;

    public onCreate(): void {
        this.state = new ComponentState();
        this.treeHandler = new TreeHandler([]);
        TreeService.getInstance().registerTreeHandler(this.state.treeId, this.treeHandler);
    }

    public async onInput(input: ComponentInput): Promise<void> {
        if (input.predefinedFilter) {
            this.predefinedFilter = input.predefinedFilter;
            const selectedNodes = this.treeHandler.getSelectedNodes();
            const names = await TranslationService.createTranslationObject(this.predefinedFilter.map((pf) => pf.name));
            const nodes = this.predefinedFilter.map(
                (pf: KIXObjectPropertyFilter, index) => new TreeNode(
                    index,
                    names[pf.name] ? names[pf.name] : pf.name,
                    pf.icon ? pf.icon : null, undefined, undefined, undefined, undefined, undefined,
                    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                    selectedNodes.some((n) => n.id === index)
                )
            );
            this.treeHandler.setTree(nodes);
        } else {
            this.predefinedFilter = [];
        }

        this.state.hasFilterList = this.predefinedFilter && this.predefinedFilter.length > 0;

        this.state.disabled = typeof input.disabled !== 'undefined' ? input.disabled : false;

        this.state.icon = typeof input.icon !== 'undefined' ? input.icon : 'kix-icon-filter';
        this.state.showFilterCount = typeof input.showFilterCount !== 'undefined' ? input.showFilterCount : true;
        this.setFilterCount(input.filterCount);

        const nds = this.treeHandler.getTree();
        nds.forEach(async (n) => {
            n.tooltip = await TranslationService.translate(n.tooltip);
        });
        this.treeHandler.setTree(nds);

        if (input.filterValue && input.filterValue !== this.state.textFilterValue) {
            this.state.textFilterValue = input.filterValue;
        }

        this.update(input);
    }

    private async update(input: any): Promise<void> {
        this.state.predefinedFilterPlaceholder = typeof input.predefinedFilterPlaceholder !== 'undefined'
            ? await TranslationService.translate(input.predefinedFilterPlaceholder)
            : await TranslationService.translate('Translatable#All Objects');

        this.state.placeholder = typeof input.placeholder !== 'undefined'
            ? await TranslationService.translate(input.placeholder)
            : await TranslationService.translate('Translatable#Filter in list');
    }

    public textFilterValueChanged(event: any, externalFilterText?: string): void {
        this.state.textFilterValue = event ? event.target.value : externalFilterText;
    }

    public predefinedFilterChanged(nodes: TreeNode[]): void {
        this.currentFilterId = nodes && nodes.length ? nodes[0].id : null;
        (this as any).setStateDirty('currentFilter');
        this.filter();
    }

    public keyDown(event: any): void {
        if (event.keyCode === 13 || event.key === 'Enter') {
            this.textFilterValueChanged(event);
            this.filter();
        }
    }

    public filter(): void {
        if (!this.state.disabled) {
            const filter = this.predefinedFilter[this.currentFilterId];
            (this as any).emit('filter', this.state.textFilterValue, filter);
        }
    }

    public reset(): void {
        this.state.textFilterValue = null;
        this.currentFilterId = null;
        this.treeHandler.setSelection(this.treeHandler.getSelectedNodes(), false);
    }

    private setFilterCount(filterCount: number = null) {
        if (typeof filterCount === 'number') {
            this.state.filterCountString = `(${filterCount})`;
        } else {
            this.state.filterCountString = '';
        }
    }
}

module.exports = Component;
