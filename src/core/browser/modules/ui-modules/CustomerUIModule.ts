import { ContextService } from '../../../../core/browser';
import { KIXObjectType, ContextDescriptor, ContextType, ContextMode } from '../../../../core/model';
import { OrganisationContext } from '../../../../core/browser/organisation';
import { IUIModule } from '../../application/IUIModule';

export class UIModule implements IUIModule {

    public priority: number = 300;

    public async unRegister(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async register(): Promise<void> {
        const organisationListContext = new ContextDescriptor(
            OrganisationContext.CONTEXT_ID, [KIXObjectType.ORGANISATION], ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'organisations', ['organisations', 'contacts'], OrganisationContext
        );
        ContextService.getInstance().registerContext(organisationListContext);
    }

}