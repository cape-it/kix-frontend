import { ComponentState } from './ComponentState';
import { ContextMode, KIXObjectType, ContactProperty } from '../../../../core/model';
import { ContactDetailsContext } from '../../../../core/browser/contact';
import { RoutingConfiguration } from '../../../../core/browser/router';
import { AbstractNewDialog } from '../../../../core/browser/components/dialog';

class Component extends AbstractNewDialog {

    public onCreate(): void {
        this.state = new ComponentState();
        super.init(
            'Translatable#Create Contact',
            'Translatable#Contact successfully created.',
            KIXObjectType.CONTACT,
            new RoutingConfiguration(
                ContactDetailsContext.CONTEXT_ID, KIXObjectType.CONTACT,
                ContextMode.DETAILS, ContactProperty.ID, true
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
