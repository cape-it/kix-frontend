/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { CheckboxOption } from './CheckboxOption';
import { FormInputComponentState } from '../../../../base-components/webapp/core/FormInputComponentState';

export class ComponentState extends FormInputComponentState<any> {

    public constructor(
        public checkboxOptions: CheckboxOption[] = [],
        public titles: Map<string, string> = new Map(),
        public comment: string = '',
        public commentPlaceholder: string = 'Translatable#Comment'
    ) {
        super();
    }

}
