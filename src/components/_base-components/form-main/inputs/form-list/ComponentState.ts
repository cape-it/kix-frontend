import { TreeNode, AutoCompleteConfiguration } from '@kix/core/dist/model';
import { IdService } from '@kix/core/dist/browser/IdService';

export class ComponentState {

    public constructor(
        public nodes: TreeNode[] = [],
        public selectedNodes: TreeNode[] = [],
        public expanded: boolean = false,
        public listId: string = IdService.generateDateBasedId('form-list-'),
        public filterValue: string = null,
        public treeId: string = IdService.generateDateBasedId('form-list-tree-'),
        public enabled: boolean = true,
        public invalid: boolean = false,
        public treeStyle: string = null,
        public asAutocomplete: boolean = false,
        public isLoading: boolean = false,
        public autoCompleteConfiguration: AutoCompleteConfiguration = null,
        public searchCallback: (limit: number, searchValue: string) => Promise<TreeNode[]> = null,
        public asMultiselect: boolean = false
    ) { }

}
