/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { LabelProvider } from "../../../base-components/webapp/core/LabelProvider";
import { KIXObjectType } from "../../../../model/kix/KIXObjectType";
import { TranslationService } from "../../../translation/webapp/core/TranslationService";
import { JobRunLog } from "../../model/JobRunLog";
import { JobRunLogProperty } from "../../model/JobRunLogProperty";

export class JobRunLogLabelProvider extends LabelProvider {

    public kixObjectType: KIXObjectType = KIXObjectType.JOB_RUN_LOG;

    public isLabelProviderFor(jobRunLog: JobRunLog): boolean {
        return jobRunLog instanceof JobRunLog;
    }

    public async getPropertyText(property: string, short?: boolean, translatable: boolean = true): Promise<string> {
        let displayValue;
        switch (property) {
            case JobRunLogProperty.NUMBER:
                displayValue = 'Translatable#Nr.';
                break;
            case JobRunLogProperty.OBJECT_ID:
                displayValue = 'Translatable#Object ID';
                break;
            case JobRunLogProperty.PRIORITY:
                displayValue = 'Translatable#Priority';
                break;
            case JobRunLogProperty.MESSAGE:
                displayValue = 'Translatable#Message';
                break;
            default:
                displayValue = await super.getPropertyText(property, false, translatable);
        }

        if (displayValue) {
            displayValue = await TranslationService.translate(
                displayValue.toString(), undefined, undefined, !translatable
            );
        }

        return displayValue;
    }

}