/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractJobFormManager } from './AbstractJobFormManager';
import { FormPageConfiguration } from '../../../../model/configuration/FormPageConfiguration';
import { ExecPlanTypes } from '../../model/ExecPlanTypes';
import { FormContext } from '../../../../model/configuration/FormContext';
import { Job } from '../../model/Job';
import { FormInstance } from '../../../base-components/webapp/core/FormInstance';

export class SyncJobFormManager extends AbstractJobFormManager {

    public supportFilter(): boolean {
        return false;
    }

    public supportPlan(planType: ExecPlanTypes): boolean {
        return planType === ExecPlanTypes.TIME_BASED;
    }

    public async getPages(job: Job, formInstance: FormInstance): Promise<FormPageConfiguration[]> {
        const execPlanPage = await this.getExecPlanPage(formInstance);
        const actionPage = await this.getMacroPage(job, formInstance);
        return [execPlanPage, actionPage];
    }

    protected async getExecPlanPage(formInstance: FormInstance): Promise<FormPageConfiguration> {
        const timeGroup = await this.getTimeGroup(formInstance.getFormContext());
        return new FormPageConfiguration(
            this.execPageId, 'Translatable#Execution Plan',
            undefined, undefined, undefined, [timeGroup]
        );
    }

}
