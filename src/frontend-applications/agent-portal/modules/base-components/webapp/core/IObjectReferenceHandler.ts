/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObject } from "../../../../model/kix/KIXObject";
import { KIXObjectType } from "../../../../model/kix/KIXObjectType";
import { KIXObjectLoadingOptions } from "../../../../model/KIXObjectLoadingOptions";

export interface IObjectReferenceHandler {

    objectType: KIXObjectType;

    determineObjects(object: KIXObject, config: any): Promise<KIXObject[]>;

    determineObjectsByForm(formId: string, object: KIXObject, config: any): Promise<KIXObject[]>;

    getLoadingOptions(): KIXObjectLoadingOptions;

}
