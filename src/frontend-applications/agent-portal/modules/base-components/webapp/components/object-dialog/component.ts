/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractMarkoComponent } from '../../../../base-components/webapp/core/AbstractMarkoComponent';
import { ComponentState } from './ComponentState';
import { ContextService } from '../../../../base-components/webapp/core/ContextService';
import { TranslationService } from '../../../../translation/webapp/core/TranslationService';
import { ObjectDialogUtil } from '../../core/ObjectDialogUtil';
import { BrowserUtil } from '../../core/BrowserUtil';

class Component extends AbstractMarkoComponent<ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        this.state.translations = await TranslationService.createTranslationObject([
            'Translatable#Cancel', 'Translatable#Save'
        ]);

        const context = ContextService.getInstance().getActiveContext();
        if (context) {
            this.state.widgets = await context.getContent();
        }
    }

    public async submit(): Promise<void> {
        BrowserUtil.toggleLoadingShield(true, this.state.translations['Translatable#Save']);
        setTimeout(async () => {
            this.state.processing = true;
            const context = ContextService.getInstance().getActiveContext();
            const formInstance = await context?.getFormManager()?.getFormInstance();
            formInstance?.setFormReadonly(true);
            await ObjectDialogUtil.submit().catch(() => null);
            formInstance?.setFormReadonly(false);
            this.state.processing = false;
            BrowserUtil.toggleLoadingShield(false, '');
        }, 100);
    }

    public cancel(): void {
        ContextService.getInstance().toggleActiveContext();
    }

}

module.exports = Component;
