export class NewCustomerDialogComponentState {

    public constructor(
        public loading: boolean = false,
        public formId: string = 'new-customer-form',
        public objectType: KIXObjectType = KIXObjectType.CUSTOMER
    ) { }

}
