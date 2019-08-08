/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ObjectIcon, KIXObjectType } from "../model";

export interface ILabelProvider<T> {

    kixObjectType: KIXObjectType;

    isLabelProviderFor(object: T): boolean;

    isLabelProviderForType(objectType: KIXObjectType): boolean;

    getObjectText(object: T, id?: boolean, title?: boolean, translatable?: boolean): Promise<string>;

    getObjectName(plural?: boolean, translatable?: boolean): Promise<string>;

    getPropertyText(property: string, short?: boolean, translatable?: boolean): Promise<string>;

    getExportPropertyText(property: string, useDisplayText?: boolean): Promise<string>;

    getDisplayText(
        object: T, property: string, defaultValue?: string, translatable?: boolean, short?: boolean
    ): Promise<string>;

    getObjectAdditionalText(object: T, translatable?: boolean): string;

    getPropertyValueDisplayText(property: string, value: string | number, translatable?: boolean): Promise<string>;

    getObjectTooltip(object: T, translatable?: boolean): string;

    getPropertyIcon(property: string): Promise<string | ObjectIcon>;

    getDisplayTextClasses(object: T, property: string): string[];

    getObjectClasses(object: T): string[];

    getObjectIcon(object?: T): string | ObjectIcon;

    getObjectTypeIcon(): string | ObjectIcon;

    getIcons(object: T, property: string, value?: string | number): Promise<Array<string | ObjectIcon>>;

    canShow(property: string, object: T): boolean;

}
