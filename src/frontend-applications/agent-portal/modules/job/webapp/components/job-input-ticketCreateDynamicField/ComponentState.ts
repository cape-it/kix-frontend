/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { FormInputComponentState } from '../../../../base-components/webapp/core/FormInputComponentState';
import { IdService } from '../../../../../model/IdService';

export class ComponentState extends FormInputComponentState<string> {

    public constructor(
        public currentDFName: string = null,
        public currentDfValue: string = null,
        public dfNameLabel: string = null,
        public dfValueLabel: string = null,
        public treeId: string = IdService.generateDateBasedId('job-input-dynamicFields'),
    ) {
        super();
    }

}
