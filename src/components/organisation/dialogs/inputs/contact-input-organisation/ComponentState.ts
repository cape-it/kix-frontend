import { AutoCompleteConfiguration, FormInputComponentState, TreeNode } from "../../../../../core/model";

export class ComponentState extends FormInputComponentState<number> {

    public constructor(
        public autoCompleteConfiguration: AutoCompleteConfiguration = null,
        public isLoading: boolean = false,
        public nodes: TreeNode[] = [],
        public searchCallback: (limit: number, searchValue: string) => Promise<TreeNode[]> = null,
        public currentNode: TreeNode = null,
        public placeholder: string = ''
    ) {
        super();
    }

}