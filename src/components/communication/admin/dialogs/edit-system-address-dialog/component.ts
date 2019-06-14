import { KIXObjectType } from '../../../../../core/model';
import { ComponentState } from './ComponentState';
import { AbstractEditDialog } from '../../../../../core/browser/components/dialog';
import { SystemAddressDetailsContext } from '../../../../../core/browser/system-address';

class Component extends AbstractEditDialog {

    public onCreate(): void {
        this.state = new ComponentState();
        super.init(
            'Translatable#Update Email Address',
            undefined,
            KIXObjectType.SYSTEM_ADDRESS,
            SystemAddressDetailsContext.CONTEXT_ID
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