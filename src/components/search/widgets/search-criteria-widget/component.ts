import { ComponentState } from './ComponentState';
import {
    IKIXObjectSearchListener, KIXObjectSearchService,
    LabelService, ContextService, SearchOperatorUtil, DialogService
} from '@kix/core/dist/browser';
import { KIXObject, ContextMode } from '@kix/core/dist/model';
class Component implements IKIXObjectSearchListener {

    public listenerId: string = 'search-criteria-widget';

    private state: ComponentState;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onMount(): void {
        KIXObjectSearchService.getInstance().registerListener(this);
    }

    public openNewSearchDialog(): void {
        KIXObjectSearchService.getInstance().clearSearchCache();
        ContextService.getInstance().setDialogContext(null, null, ContextMode.SEARCH);
    }

    public openEditSearchDialog(): void {
        const cache = KIXObjectSearchService.getInstance().getSearchCache();
        if (cache) {
            ContextService.getInstance().setDialogContext(null, cache.objectType, ContextMode.SEARCH);
        }
    }

    public searchCleared(): void {
        this.state.criterias = [];
    }

    public searchFinished(): void {
        const cache = KIXObjectSearchService.getInstance().getSearchCache();
        if (cache) {
            const labelProvider = LabelService.getInstance().getLabelProviderForType(cache.objectType);
            this.state.criterias = [];
            for (const criteria of cache.criterias) {
                let displayValue;
                if (Array.isArray(criteria.value)) {
                    const valueStrings = [];
                    for (const v of criteria.value) {
                        const value = labelProvider.getPropertyValueDisplayText(criteria.property, v);
                        valueStrings.push(value);
                    }
                    displayValue = valueStrings.join(', ');
                } else if (criteria.value instanceof KIXObject) {
                    displayValue = criteria.value.toString();
                } else {
                    displayValue = labelProvider.getPropertyValueDisplayText(criteria.property, criteria.value);
                }

                const displayProperty = labelProvider.getPropertyText(criteria.property);
                this.state.criterias.push([
                    displayProperty, SearchOperatorUtil.getText(criteria.operator), displayValue
                ]);
            }
        }

    }
}

module.exports = Component;
