/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IMainMenuExtension } from '../../server/extensions/IMainMenuExtension';
import { CMDBContext, ConfigItemDetailsContext } from './webapp/core';
import { UIComponentPermission } from '../../model/UIComponentPermission';
import { CRUD } from '../../../../server/model/rest/CRUD';

import { KIXExtension } from '../../../../server/model/KIXExtension';

class Extension extends KIXExtension implements IMainMenuExtension {

    public mainContextId: string = CMDBContext.CONTEXT_ID;

    public contextIds: string[] = [CMDBContext.CONTEXT_ID, ConfigItemDetailsContext.CONTEXT_ID];

    public primaryMenu: boolean = true;

    public icon: string = 'kix-icon-cmdb';

    public text: string = 'Translatable#CMDB';

    public permissions: UIComponentPermission[] = [
        new UIComponentPermission('cmdb/configitems', [CRUD.READ])
    ];

    public orderRang: number = 200;
}

module.exports = (data, host, options) => {
    return new Extension();
};
