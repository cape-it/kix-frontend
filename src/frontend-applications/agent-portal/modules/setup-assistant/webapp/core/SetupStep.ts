/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ObjectIcon } from '../../../icon/model/ObjectIcon';
import { UIComponentPermission } from '../../../../model/UIComponentPermission';

export class SetupStep {

    public constructor(
        public id: string,
        public name: string,
        public componentId: string,
        public permissions: UIComponentPermission[] = [],
        public subtitle?: string,
        public text?: string,
        public icon?: ObjectIcon | string,
        public priority: number = 100,
        public completed: boolean = false,
        public skipped: boolean = false,
        public result: any = null
    ) { }

}
