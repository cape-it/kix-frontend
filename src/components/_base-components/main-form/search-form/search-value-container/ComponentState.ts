import { KIXObjectType, TreeNode } from "@kix/core/dist/model";
import { FormSearchValue } from "./FormSearchValue";

export class ComponentState {

    public constructor(
        public formId: string = null,
        public objectType: KIXObjectType = null,
        public propertyNodes: TreeNode[] = [],
        public searchValues: FormSearchValue[] = [new FormSearchValue()],
        public defaultProperties: string[] = []
    ) { }

}
