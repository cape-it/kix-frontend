import { Context, ContextType, ContextDescriptor, KIXObjectType, ContextMode } from '@kix/core/dist/model';
import { ClientStorageService } from '@kix/core/dist/browser/ClientStorageService';
import { ComponentState } from './ComponentState';
import { ContextService } from '@kix/core/dist/browser/context';
import { ComponentsService } from '@kix/core/dist/browser/components';
import { CustomerService } from '@kix/core/dist/browser/customer';
import { TicketService } from '@kix/core/dist/browser/ticket';
import { CMDBService } from '@kix/core/dist/browser/cmdb';
import { ContactService } from '@kix/core/dist/browser/contact';
import { SearchService } from '@kix/core/dist/browser/search';
import { FAQService } from '@kix/core/dist/browser/faq';
import { LinkService } from '@kix/core/dist/browser/link';
import { IdService, StandardTableFactoryService } from '@kix/core/dist/browser';
import { RoutingService } from '@kix/core/dist/browser/router';
import { HomeContext } from '@kix/core/dist/browser/home';
import { GeneralCatalogService } from '@kix/core/dist/browser/general-catalog';
import { TextModuleService } from '@kix/core/dist/browser/text-modules';
import { EventService } from '@kix/core/dist/browser/event';
import { SysConfigService } from '@kix/core/dist/browser/sysconfig';
import { DynamicFieldService } from '@kix/core/dist/browser/dynamic-fields';
import { SlaService } from '@kix/core/dist/browser/sla';
import { ReleaseContext } from '@kix/core/dist/browser/release';

declare var io: any;

class Component {

    public state: ComponentState;
    private contextListernerId: string;

    public onCreate(input: any): void {
        this.state = new ComponentState(
            input.contextId, input.objectData, input.objectId
        );
        this.contextListernerId = IdService.generateDateBasedId('base-template-');
    }

    public async onMount(): Promise<void> {
        this.state.loading = true;
        this.state.loadingHint = 'Lade KIX ...';

        await ComponentsService.getInstance().init();

        const token = ClientStorageService.getToken();
        const socketUrl = ClientStorageService.getFrontendSocketUrl();

        const configurationSocket = io.connect(socketUrl + "/configuration", {
            query: "Token=" + token
        });

        configurationSocket.on('error', (error) => {
            window.location.replace('/auth');
        });

        ContextService.getInstance().registerListener({
            contextChanged: (contextId: string, context: Context<any>, type: ContextType) => {
                if (type === ContextType.MAIN) {
                    this.setContext(context);
                }
            }
        });

        ContextService.getInstance().setObjectData(this.state.objectData);
        this.bootstrapServices();
        this.setContext();

        EventService.getInstance().subscribe('APP_LOADING', {
            eventSubscriberId: 'BASE-TEMPLATE',
            eventPublished: (data: any, eventId: string) => {
                if (eventId === 'APP_LOADING') {
                    this.state.loading = data.loading;
                    this.state.loadingHint = data.hint;
                }
            }
        });

        this.state.initialized = true;
        this.state.loading = false;
    }

    private bootstrapServices(): void {
        TicketService.getInstance();
        CMDBService.getInstance();
        CustomerService.getInstance();
        ContactService.getInstance();
        FAQService.getInstance();
        SearchService.getInstance();
        LinkService.getInstance();
        GeneralCatalogService.getInstance();
        TextModuleService.getInstance();
        SysConfigService.getInstance();
        DynamicFieldService.getInstance();
        SlaService.getInstance();

        const homeContext = new ContextDescriptor(
            HomeContext.CONTEXT_ID, [KIXObjectType.ANY], ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'home', ['home'], HomeContext
        );
        ContextService.getInstance().registerContext(homeContext);
        const releaseContext = new ContextDescriptor(
            ReleaseContext.CONTEXT_ID, [KIXObjectType.ANY], ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'release', ['release'], ReleaseContext
        );
        ContextService.getInstance().registerContext(releaseContext);

        RoutingService.getInstance().routeToInitialContext();
    }

    private setContext(context: Context<any> = ContextService.getInstance().getActiveContext()): void {
        if (context) {
            this.state.hasExplorer = context.isExplorerBarShown();
            context.registerListener(this.contextListernerId, {
                sidebarToggled: () => {
                    this.setGridColumns();
                },
                explorerBarToggled: () => {
                    this.state.hasExplorer = context.isExplorerBarShown();
                    this.setGridColumns();
                },
                objectChanged: () => { return; },
                objectListChanged: () => { return; },
                filteredObjectListChanged: () => { return; }
            });
        }
        this.setGridColumns();
    }

    private setGridColumns(): void {
        let gridColumns = '[main-menu-wrapper] 4.5rem';

        if (this.state.hasExplorer) {
            gridColumns += ' [explorer-bar] min-content';
        }

        gridColumns += ' [content] minmax(40rem, auto)';

        const context = ContextService.getInstance().getActiveContext();
        if ((context && context.isSidebarShown())) {
            gridColumns += ' [sidebar-area] min-content';
        }

        gridColumns += ' [sidebar-menu-wrapper] min-content';

        this.state.gridColumns = gridColumns;
    }
}

module.exports = Component;
