/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { MenuEntry } from '../../../../../../model/MenuEntry';
import { AbstractComponentState } from '../../../../../base-components/webapp/core/AbstractComponentState';

export class ComponentState extends AbstractComponentState {

    public constructor(
        public primaryMenuEntries: MenuEntry[] = [],
        public secondaryMenuEntries: MenuEntry[] = [],
        public showText: boolean = false,
        public loading: boolean = true,
        public isMobile: boolean = false,
        public showMobile: boolean = false
    ) {
        super();
    }

}
