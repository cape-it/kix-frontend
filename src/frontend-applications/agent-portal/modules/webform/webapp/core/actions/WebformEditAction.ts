/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { EditWebformDialogContext } from '../context/EditWebformDialogContext';
import { AbstractAction } from '../../../../../modules/base-components/webapp/core/AbstractAction';
import { ContextService } from '../../../../../modules/base-components/webapp/core/ContextService';

export class WebformEditAction extends AbstractAction {

    public hasLink: boolean = true;

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Edit';
        this.icon = 'kix-icon-edit';
    }

    public async run(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext();
        ContextService.getInstance().setActiveContext(EditWebformDialogContext.CONTEXT_ID, context?.getObjectId());
    }

}
