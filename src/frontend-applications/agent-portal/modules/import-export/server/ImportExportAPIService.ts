/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectAPIService } from "../../../server/services/KIXObjectAPIService";
import { KIXObjectType } from "../../../model/kix/KIXObjectType";
import { KIXObjectServiceRegistry } from "../../../server/services/KIXObjectServiceRegistry";
import { KIXObjectLoadingOptions } from "../../../model/KIXObjectLoadingOptions";
import { KIXObjectSpecificLoadingOptions } from "../../../model/KIXObjectSpecificLoadingOptions";
import { ImportExportTemplate } from "../model/ImportExportTemplate";
import { KIXObjectSpecificCreateOptions } from "../../../model/KIXObjectSpecificCreateOptions";
import { LoggingService } from "../../../../../server/services/LoggingService";
import { ImportExportTemplateProperty } from "../model/ImportExportTemplateProperty";
import { ImportExportTemplateFactory } from "./ImportExportTemplateFactory";
import { Error } from "../../../../../server/model/Error";

export class ImportExportAPIService extends KIXObjectAPIService {

    private static INSTANCE: ImportExportAPIService;

    public static getInstance(): ImportExportAPIService {
        if (!ImportExportAPIService.INSTANCE) {
            ImportExportAPIService.INSTANCE = new ImportExportAPIService();
        }
        return ImportExportAPIService.INSTANCE;
    }

    protected RESOURCE_URI: string = 'system/importexport/templates';

    public objectType: KIXObjectType = KIXObjectType.IMPORT_EXPORT_TEMPLATE;

    private constructor() {
        super([new ImportExportTemplateFactory()]);
        KIXObjectServiceRegistry.registerServiceInstance(this);
    }

    public isServiceFor(kixObjectType: KIXObjectType): boolean {
        return kixObjectType === this.objectType;
    }

    public async loadObjects<T>(
        token: string, clientRequestId: string, objectType: KIXObjectType, objectIds: Array<number | string>,
        loadingOptions: KIXObjectLoadingOptions, objectLoadingOptions: KIXObjectSpecificLoadingOptions
    ): Promise<T[]> {

        let objects = [];
        if (objectType === KIXObjectType.IMPORT_EXPORT_TEMPLATE) {
            objects = await super.load<ImportExportTemplate>(
                token, KIXObjectType.IMPORT_EXPORT_TEMPLATE, this.RESOURCE_URI, loadingOptions, objectIds,
                'ImportExportTemplate'
            );
        }

        return objects;
    }
}
