import { IFormInstance, KIXObjectType } from "@kix/core/dist/model";

export class FormComponentState {

    public constructor(
        public formId: string = null,
        public objectType: KIXObjectType = null,
        public formInstance: IFormInstance = null,
        public isSearchContext: boolean = false
    ) { }

}
