import { WidgetComponentState, Customer, Contact, AbstractAction } from "@kix/core/dist/model";
import { StandardTable } from "@kix/core/dist/browser";

export class ComponentState extends WidgetComponentState {

    public constructor(
        public customer: Customer = null,
        public contactTable: StandardTable<Contact> = null,
        public filterValue: string = '',
        public title: string = '',
        public actions: AbstractAction[] = []
    ) {
        super();
    }

}
