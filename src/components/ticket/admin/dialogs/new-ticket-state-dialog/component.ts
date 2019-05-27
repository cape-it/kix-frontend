import { KIXObjectType, ContextMode, TicketStateProperty } from "../../../../../core/model";
import { ComponentState } from "./ComponentState";
import { TicketStateDetailsContext } from "../../../../../core/browser/ticket";
import { RoutingConfiguration } from "../../../../../core/browser/router";
import { AbstractNewDialog } from "../../../../../core/browser/components/dialog";
import { TranslationService } from "../../../../../core/browser/i18n/TranslationService";

class Component extends AbstractNewDialog {

    public onCreate(): void {
        this.state = new ComponentState();
        super.init(
            'Translatable#Create State',
            'Translatable#State successfully created.',
            KIXObjectType.TICKET_STATE,
            new RoutingConfiguration(
                TicketStateDetailsContext.CONTEXT_ID, KIXObjectType.TICKET_STATE,
                ContextMode.DETAILS, TicketStateProperty.ID, true
            )
        );
    }

    public async onMount(): Promise<void> {
        await super.onMount();

        this.state.translations = await TranslationService.createTranslationObject([
            "Translatable#Cancel", "Translatable#Save"
        ]);
    }

    public async onDestroy(): Promise<void> {
        await super.onDestroy();
    }

    public async cancel(): Promise<void> {
        await super.cancel();
    }

    public async submit(): Promise<void> {
        await super.submit();
    }

}

module.exports = Component;
