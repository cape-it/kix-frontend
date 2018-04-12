import { FormField, FormDropDownItem } from "@kix/core/dist/model";

export class TicketInputOwnerComponentState {

    public constructor(
        public items: FormDropDownItem[] = [],
        public field: FormField = null
    ) { }

}
