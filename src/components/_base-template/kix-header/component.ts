import { ClientStorageService } from "../../../core/browser/ClientStorageService";
import { ContextService, OverlayService } from "../../../core/browser";
import { ContextMode, ComponentContent, ToastContent, OverlayType, KIXObjectType } from "../../../core/model";
import { RoutingConfiguration } from "../../../core/browser/router";
import { ReleaseContext } from "../../../core/browser/release";
import { PersonalSettingsDialogContext } from "../../../core/browser";

class KIXHeaderComponent {

    public openDialog(): void {
        ContextService.getInstance().setDialogContext(null, null, ContextMode.CREATE, null, true);
    }

    public showTemporaryComingSoon(): void {
        const content = new ComponentContent('toast', new ToastContent(
            'kix-icon-magicwand', 'Diese Funktionalität ist in Arbeit.', 'Coming Soon'
        ));
        OverlayService.getInstance().openOverlay(OverlayType.HINT_TOAST, null, content, '');
    }

    public showPersonalSettings(): void {
        ContextService.getInstance().setDialogContext(
            PersonalSettingsDialogContext.CONTEXT_ID, KIXObjectType.PERSONAL_SETTINGS,
            ContextMode.PERSONAL_SETTINGS, null, true
        );
    }

    public getReleaseRoutingConfig(): RoutingConfiguration {
        return new RoutingConfiguration(
            null, ReleaseContext.CONTEXT_ID, null, ContextMode.DASHBOARD, null
        );
    }

    public logout(): void {
        ClientStorageService.destroyToken();
    }

}

module.exports = KIXHeaderComponent;
