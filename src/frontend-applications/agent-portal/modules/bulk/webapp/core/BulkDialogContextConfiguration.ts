/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ContextConfiguration } from '../../../../model/configuration/ContextConfiguration';
import { BulkDialogContext } from '.';
import { ConfigurationType } from '../../../../model/configuration/ConfigurationType';

export class BulkDialogContextConfiguration extends ContextConfiguration {

    public constructor() {
        super(
            BulkDialogContext.CONTEXT_ID, BulkDialogContext.CONTEXT_ID, ConfigurationType.Context,
            BulkDialogContext.CONTEXT_ID,
            [], [], [], [], []
        );
    }

}
