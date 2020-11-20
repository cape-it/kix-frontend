/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ContextMode } from './ContextMode';
import { ContextType } from './ContextType';
import { Context } from './Context';
import { KIXObjectType } from './kix/KIXObjectType';
import { ContextConfiguration } from './configuration/ContextConfiguration';
import { UIComponentPermission } from './UIComponentPermission';

export class ContextDescriptor {

    public constructor(
        public contextId: string,
        public kixObjectTypes: Array<KIXObjectType | string>,
        public contextType: ContextType,
        public contextMode: ContextMode,
        public objectSpecific: boolean,
        public componentId: string,
        public urlPaths: string[],
        public contextClass: new (
            descriptor: ContextDescriptor, objectId: string | number, configuration: ContextConfiguration
        ) => Context,
        public permissions: UIComponentPermission[] = []
    ) { }

    public isContextFor(kixObjectType: KIXObjectType | string): boolean {
        return this.kixObjectTypes.some((t) => t === kixObjectType);
    }

}
