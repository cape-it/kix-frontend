import {
    AbstractMarkoComponent, StandardTableFactoryService, LabelService, ServiceRegistry,
    FactoryService, ContextService, DialogService, ActionFactory, KIXObjectSearchService
} from '@kix/core/dist/browser';
import { ComponentState } from './ComponentState';
import {
    CustomerLabelProvider, CustomerBrowserFactory, CustomerContext, CustomerDetailsContext,
    NewCustomerDialogContext, CustomerSearchContext, CustomerSearchAction, CustomerCreateAction,
    CustomerEditAction, CustomerCreateContactAction, CustomerPrintAction, CustomerCreateCIAction,
    CustomerCreateTicketAction, CustomerService, CustomerTableFactory, CustomerSearchDefinition
} from '@kix/core/dist/browser/customer';
import {
    KIXObjectType, ContextDescriptor, ContextType, ContextMode, WidgetConfiguration,
    ConfiguredDialogWidget, WidgetSize
} from '@kix/core/dist/model';

class Component extends AbstractMarkoComponent {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        StandardTableFactoryService.getInstance().registerFactory(new CustomerTableFactory());
        LabelService.getInstance().registerLabelProvider(new CustomerLabelProvider());
        ServiceRegistry.getInstance().registerServiceInstance(CustomerService.getInstance());
        FactoryService.getInstance().registerFactory(KIXObjectType.CUSTOMER, CustomerBrowserFactory.getInstance());
        KIXObjectSearchService.getInstance().registerSearchDefinition(new CustomerSearchDefinition());

        this.registerContexts();
        this.registerDialogs();
        this.registerActions();
    }

    private registerContexts(): void {
        const customerListContext = new ContextDescriptor(
            CustomerContext.CONTEXT_ID, [KIXObjectType.CUSTOMER], ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'customers', ['customers', 'contacts'], CustomerContext
        );
        ContextService.getInstance().registerContext(customerListContext);

        const customerDetailsContext = new ContextDescriptor(
            CustomerDetailsContext.CONTEXT_ID, [KIXObjectType.CUSTOMER], ContextType.MAIN, ContextMode.DETAILS,
            true, 'customer-details', ['customers'], CustomerDetailsContext
        );
        ContextService.getInstance().registerContext(customerDetailsContext);

        const newCustomerContext = new ContextDescriptor(
            NewCustomerDialogContext.CONTEXT_ID, [KIXObjectType.CUSTOMER], ContextType.DIALOG, ContextMode.CREATE,
            false, 'new-customer-dialog', ['customers'], NewCustomerDialogContext
        );
        ContextService.getInstance().registerContext(newCustomerContext);

        const searchContactContext = new ContextDescriptor(
            CustomerSearchContext.CONTEXT_ID, [KIXObjectType.CUSTOMER], ContextType.DIALOG, ContextMode.SEARCH,
            false, 'search-customer-dialog', ['customers'], CustomerSearchContext
        );
        ContextService.getInstance().registerContext(searchContactContext);
    }

    private registerDialogs(): void {
        DialogService.getInstance().registerDialog(new ConfiguredDialogWidget(
            'new-customer-dialog',
            new WidgetConfiguration(
                'new-customer-dialog', 'Neuer Kunde', [], {}, false, false, null, 'kix-icon-man-house-new'
            ),
            KIXObjectType.CUSTOMER,
            ContextMode.CREATE
        ));

        DialogService.getInstance().registerDialog(new ConfiguredDialogWidget(
            'search-customer-dialog',
            new WidgetConfiguration(
                'search-customer-dialog', 'Kundensuche', [], {},
                false, false, WidgetSize.BOTH, 'kix-icon-search-man-house'
            ),
            KIXObjectType.CUSTOMER,
            ContextMode.SEARCH
        ));

    }

    private registerActions(): void {
        ActionFactory.getInstance().registerAction('customer-search-action', CustomerSearchAction);
        ActionFactory.getInstance().registerAction('customer-create-action', CustomerCreateAction);
        ActionFactory.getInstance().registerAction('customer-edit-action', CustomerEditAction);
        ActionFactory.getInstance().registerAction('customer-create-contact-action', CustomerCreateContactAction);
        ActionFactory.getInstance().registerAction('customer-print-action', CustomerPrintAction);
        ActionFactory.getInstance().registerAction('customer-create-ci-action', CustomerCreateCIAction);
        ActionFactory.getInstance().registerAction('customer-create-ticket-action', CustomerCreateTicketAction);
    }

}

module.exports = Component;
