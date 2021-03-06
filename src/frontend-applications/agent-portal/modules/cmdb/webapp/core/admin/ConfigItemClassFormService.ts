/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectFormService } from '../../../../../modules/base-components/webapp/core/KIXObjectFormService';
import { ConfigItemClass } from '../../../model/ConfigItemClass';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { ConfigItemClassProperty } from '../../../model/ConfigItemClassProperty';

export class ConfigItemClassFormService extends KIXObjectFormService {

    private static INSTANCE: ConfigItemClassFormService = null;

    public static getInstance(): ConfigItemClassFormService {
        if (!ConfigItemClassFormService.INSTANCE) {
            ConfigItemClassFormService.INSTANCE = new ConfigItemClassFormService();
        }

        return ConfigItemClassFormService.INSTANCE;
    }

    private constructor() {
        super();
    }

    public isServiceFor(kixObjectType: KIXObjectType) {
        return kixObjectType === KIXObjectType.CONFIG_ITEM_CLASS;
    }

    protected async getValue(property: string, value: any, ciClass: ConfigItemClass): Promise<any> {
        if (property === ConfigItemClassProperty.DEFINITION_STRING && ciClass && ciClass.CurrentDefinition) {
            value = ciClass.CurrentDefinition.DefinitionString;
        }
        return value;
    }
}
