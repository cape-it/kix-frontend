import {
    AbstractMarkoComponent, StandardTableFactoryService, LabelService, ServiceRegistry,
    FactoryService, ContextService, DialogService, ActionFactory, KIXObjectSearchService
} from '@kix/core/dist/browser';
import { ComponentState } from './ComponentState';
import {
    KIXObjectType, ContextDescriptor, ContextType, ContextMode, WidgetConfiguration,
    ConfiguredDialogWidget, WidgetSize, KIXObjectCache, ContactCacheHandler
} from '@kix/core/dist/model';
import {
    ContactTableFactory, ContactLabelProvider, ContactService, ContactBrowserFactory, ContactDetailsContext,
    NewContactDialogContext, ContactSearchContext, ContactSearchAction, ContactCreateAction,
    ContactEditAction, ContactCreateCustomerAction, ContactPrintAction, ContactCreateTicketAction,
    ContactCreateCIAction, ContactSearchDefinition
} from '@kix/core/dist/browser/contact';

class Component extends AbstractMarkoComponent {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {

        StandardTableFactoryService.getInstance().registerFactory(new ContactTableFactory());
        LabelService.getInstance().registerLabelProvider(new ContactLabelProvider());
        ServiceRegistry.getInstance().registerServiceInstance(ContactService.getInstance());
        FactoryService.getInstance().registerFactory(KIXObjectType.CONTACT, ContactBrowserFactory.getInstance());
        KIXObjectCache.registerCacheHandler(new ContactCacheHandler());
        KIXObjectSearchService.getInstance().registerSearchDefinition(new ContactSearchDefinition());

        this.registerContexts();
        this.registerDialogs();
        this.registerActions();
    }

    private registerContexts(): void {
        const customerDetailsContext = new ContextDescriptor(
            ContactDetailsContext.CONTEXT_ID, [KIXObjectType.CONTACT], ContextType.MAIN, ContextMode.DETAILS,
            true, 'contact-details', ['contacts'], ContactDetailsContext
        );
        ContextService.getInstance().registerContext(customerDetailsContext);

        const newContactContext = new ContextDescriptor(
            NewContactDialogContext.CONTEXT_ID, [KIXObjectType.CONTACT], ContextType.DIALOG, ContextMode.CREATE,
            false, 'new-contact-dialog', ['contacts'], NewContactDialogContext
        );
        ContextService.getInstance().registerContext(newContactContext);

        const searchContactContext = new ContextDescriptor(
            ContactSearchContext.CONTEXT_ID, [KIXObjectType.CONTACT], ContextType.DIALOG, ContextMode.SEARCH,
            false, 'search-contact-dialog', ['contacts'], ContactSearchContext
        );
        ContextService.getInstance().registerContext(searchContactContext);
    }

    private registerDialogs(): void {
        DialogService.getInstance().registerDialog(new ConfiguredDialogWidget(
            'new-contact-dialog',
            new WidgetConfiguration(
                'new-contact-dialog', 'Neuer Ansprechpartner', [], {}, false, false, null, 'kix-icon-man-bubble-new'
            ),
            KIXObjectType.CONTACT,
            ContextMode.CREATE
        ));

        DialogService.getInstance().registerDialog(new ConfiguredDialogWidget(
            'search-contact-dialog',
            new WidgetConfiguration(
                'search-contact-dialog',
                'Ansprechpartnersuche',
                [],
                {},
                false,
                false,
                WidgetSize.BOTH,
                'kix-icon-search-man-bubble'
            ),
            KIXObjectType.CONTACT,
            ContextMode.SEARCH
        ));
    }

    private registerActions(): void {
        ActionFactory.getInstance().registerAction('contact-search-action', ContactSearchAction);
        ActionFactory.getInstance().registerAction('contact-create-action', ContactCreateAction);
        ActionFactory.getInstance().registerAction('contact-edit-action', ContactEditAction);
        ActionFactory.getInstance().registerAction('contact-create-contact-action', ContactCreateCustomerAction);
        ActionFactory.getInstance().registerAction('contact-print-action', ContactPrintAction);
        ActionFactory.getInstance().registerAction('contact-create-ci-action', ContactCreateCIAction);
        ActionFactory.getInstance().registerAction('contact-create-ticket-action', ContactCreateTicketAction);
        ActionFactory.getInstance().registerAction('contact-create-customer-action', ContactCreateCustomerAction);
    }

}

module.exports = Component;
