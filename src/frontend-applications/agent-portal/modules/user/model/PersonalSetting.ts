/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { FormFieldValue } from '../../../model/configuration/FormFieldValue';
import { FormFieldOption } from '../../../model/configuration/FormFieldOption';

export class PersonalSetting {

    public constructor(
        public group: string,
        public property: string,
        public label: string,
        public hint: string,
        public inputComponent?: string,
        public required: boolean = false,
        public defaultValue: FormFieldValue = null,
        public options?: FormFieldOption[]
    ) { }
}
