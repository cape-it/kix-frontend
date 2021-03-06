/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { Context } from '../../../../../model/Context';
import { KIXObject } from '../../../../../model/kix/KIXObject';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { KIXObjectLoadingOptions } from '../../../../../model/KIXObjectLoadingOptions';
import { KIXObjectProperty } from '../../../../../model/kix/KIXObjectProperty';
import { KIXObjectService } from '../../../../base-components/webapp/core/KIXObjectService';

export class EditOrganisationDialogContext extends Context {

    public static CONTEXT_ID: string = 'edit-organisation-dialog-context';

    public async getObject<O extends KIXObject>(
        objectType: KIXObjectType | string = KIXObjectType.ORGANISATION,
        reload: boolean = false, changedProperties?: string[]
    ): Promise<O> {
        let object;
        const objectId = this.getObjectId();
        if (objectId) {
            const loadingOptions = new KIXObjectLoadingOptions(
                null, null, null,
                [KIXObjectProperty.DYNAMIC_FIELDS]
            );
            const objects = await KIXObjectService.loadObjects(objectType, [objectId], loadingOptions);
            object = objects && objects.length ? objects[0] : null;
        }
        return object;
    }
}
