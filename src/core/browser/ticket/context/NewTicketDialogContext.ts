import { Context } from "../../../model/components/context/Context";
import {
    KIXObject, KIXObjectType, TicketProperty, Customer, Contact,
    IFormInstanceListener, FormField, FormFieldValue, FormContext
} from "../../../model";
import { FormService } from "../../form";
import { KIXObjectService } from "../../kix";

export class NewTicketDialogContext extends Context implements IFormInstanceListener {

    public static CONTEXT_ID: string = 'new-ticket-dialog-context';
    public formListenerId: string;

    private contact: Contact;
    private customer: Customer;

    public async initContext(): Promise<void> {
        this.contact = null;
        this.customer = null;
        const formId = await FormService.getInstance().getFormIdByContext(FormContext.NEW, KIXObjectType.TICKET);
        this.formListenerId = 'NewTicketDialogContext';
        await FormService.getInstance().registerFormInstanceListener(formId, this);
    }

    public updateForm(): void {
        return;
    }

    public async formValueChanged(formField: FormField, value: FormFieldValue<any>, oldValue: any): Promise<void> {
        if (formField && formField.property === TicketProperty.CUSTOMER_ID) {
            if (value && value.value) {
                const customers = await KIXObjectService.loadObjects<Customer>(
                    KIXObjectType.CUSTOMER, [value.value]
                );
                if (customers && customers.length) {
                    this.customer = customers[0];
                    this.listeners.forEach(
                        (l) => l.objectChanged(
                            this.customer ? this.customer.CustomerID : null,
                            this.customer,
                            KIXObjectType.CUSTOMER
                        )
                    );
                }
            }
        } else if (formField && formField.property === TicketProperty.CUSTOMER_USER_ID) {
            if (value && value.value) {
                const contacts = await KIXObjectService.loadObjects<Contact>(
                    KIXObjectType.CONTACT, [value.value]
                );
                if (contacts && contacts.length) {
                    this.contact = contacts[0];
                    this.listeners.forEach(
                        (l) => l.objectChanged(
                            this.contact ? this.contact.ContactID : null,
                            this.contact,
                            KIXObjectType.CONTACT
                        )
                    );
                }
            }
        }
    }

    public async getObject<O extends KIXObject>(kixObjectType: KIXObjectType): Promise<O> {
        let object;
        if (kixObjectType === KIXObjectType.CUSTOMER) {
            object = this.customer;
        } else if (kixObjectType === KIXObjectType.CONTACT) {
            object = this.contact;
        }
        return object;
    }
}
