/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { FormInputComponentState } from '../../../../../modules/base-components/webapp/core/FormInputComponentState';
import { CreateLinkDescription } from '../../../server/api/CreateLinkDescription';
import { Label } from '../../../../../modules/base-components/webapp/core/Label';


export class ComponentState extends FormInputComponentState<CreateLinkDescription[]> {

    public constructor(
        public linkDescriptions: CreateLinkDescription[] = [],
        public minimized: boolean = false,
        public labels: Label[] = [],
        public loading: boolean = false,
        public allowCreate: boolean = false
    ) {
        super();
    }

}
