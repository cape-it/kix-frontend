import { KIXObjectType, RoleProperty, ContextMode } from "../../../../../core/model";
import { ComponentState } from "./ComponentState";
import { AbstractNewDialog } from "../../../../../core/browser/components/dialog";
import { RoutingConfiguration } from "../../../../../core/browser/router";
import { RoleDetailsContext } from "../../../../../core/browser/user";

class Component extends AbstractNewDialog {

    public onCreate(): void {
        this.state = new ComponentState();
        super.init(
            'Translatable#Create Role',
            'Translatable#Role successfully created.',
            KIXObjectType.ROLE,
            new RoutingConfiguration(
                RoleDetailsContext.CONTEXT_ID, KIXObjectType.ROLE,
                ContextMode.DETAILS, RoleProperty.ID, true
            )
        );
    }

    public async onMount(): Promise<void> {
        await super.onMount();
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
