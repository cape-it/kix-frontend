/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectFormService } from "../kix/KIXObjectFormService";
import {
    KIXObjectType, FormFieldValue, FormField, ConfigItem, VersionProperty, ConfigItemProperty,
    GeneralCatalogItem, KIXObjectLoadingOptions, FilterCriteria, FilterDataType,
    FilterType, ConfigItemClass, Contact, Organisation, FormFieldOptions, InputFieldTypes, FormContext
} from "../../model";
import { KIXObjectService } from '../kix/';
import { LabelService } from "../LabelService";
import { SearchOperator } from "../SearchOperator";
import { PreparedData } from "../../model/kix/cmdb/PreparedData";

export class GeneralCatalogFormService extends KIXObjectFormService<GeneralCatalogItem> {

    private static INSTANCE: GeneralCatalogFormService = null;

    public static getInstance(): GeneralCatalogFormService {
        if (!GeneralCatalogFormService.INSTANCE) {
            GeneralCatalogFormService.INSTANCE = new GeneralCatalogFormService();
        }
        return GeneralCatalogFormService.INSTANCE;
    }

    private constructor() {
        super();
    }

    public isServiceFor(kixObjectType: KIXObjectType) {
        return kixObjectType === KIXObjectType.GENERAL_CATALOG_ITEM;
    }

}
