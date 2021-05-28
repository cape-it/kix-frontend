/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IUIModule } from '../../../../model/IUIModule';
import { ContextDescriptor } from '../../../../model/ContextDescriptor';
import { ReportingContext } from './context/ReportingContext';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { ContextType } from '../../../../model/ContextType';
import { ContextMode } from '../../../../model/ContextMode';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { UIComponentPermission } from '../../../../model/UIComponentPermission';
import { CRUD } from '../../../../../../server/model/rest/CRUD';
import { TableFactoryService } from '../../../base-components/webapp/core/table';
import { ReportDefinitionTableFactory, ReportTableFactory } from './table';
import { ServiceRegistry } from '../../../base-components/webapp/core/ServiceRegistry';
import { ReportService } from './ReportService';
import { ReportDefinitionService } from './ReportDefinitionService';
import { ReportResultService } from './ReportResultService';
import { LabelService } from '../../../base-components/webapp/core/LabelService';
import { ReportDefinitionLabelProvider } from './ReportDefinitionLabelProvider';
import { ReportLabelProvider } from './ReportLabelProvider';
import { NewReportDefinitionDialogContext } from './context/NewReportDefinitionDialogContext';
import { ActionFactory } from '../../../base-components/webapp/core/ActionFactory';
import { ReportDeleteAction, ReportDefinitionDeleteAction, ReportDefinitionCreateAction } from './actions';
import { FormService } from '../../../base-components/webapp/core/FormService';
import { ReportDefinitionFormValueHandler } from './form/ReportDefinitionFormValueHandler';
import { ReportDefinitionFormService } from './form/ReportDefinitionFormService';
import { EditReportDefinitionContext as EditReportDefinitionDialogContext } from './context/EditReportDefinitionDialogContext';
import { NewReportDialogContext } from './context/NewReportDialogContext';
import { ReportFormService } from './form/ReportFormService';
import { JobTypes } from '../../../job/model/JobTypes';
import { JobFormService } from '../../../job/webapp/core';
import { CreateReportActionJobFormManager } from './form/CreateReportActionJobFormManager';
import { ReportingJobFormManager } from './form/ReportingJobFormManager';

export class UIModule implements IUIModule {

    public priority: number = 900;

    public name: string = 'ReportingUIModule';

    public async unRegister(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async register(): Promise<void> {
        ServiceRegistry.registerServiceInstance(ReportDefinitionService.getInstance());
        ServiceRegistry.registerServiceInstance(ReportService.getInstance());
        ServiceRegistry.registerServiceInstance(ReportResultService.getInstance());

        TableFactoryService.getInstance().registerFactory(new ReportDefinitionTableFactory());
        TableFactoryService.getInstance().registerFactory(new ReportTableFactory());

        LabelService.getInstance().registerLabelProvider(new ReportDefinitionLabelProvider());
        LabelService.getInstance().registerLabelProvider(new ReportLabelProvider());

        ActionFactory.getInstance().registerAction('reportdefinition-create-action', ReportDefinitionCreateAction);
        ActionFactory.getInstance().registerAction('reportdefinition-delete-action', ReportDefinitionDeleteAction);
        ActionFactory.getInstance().registerAction('report-delete-action', ReportDeleteAction);

        const reportingListContext = new ContextDescriptor(
            ReportingContext.CONTEXT_ID,
            [KIXObjectType.REPORT_DEFINITION, KIXObjectType.REPORT, KIXObjectType.REPORT_RESULT],
            ContextType.MAIN, ContextMode.DASHBOARD,
            false, 'reporting-module', ['reporting'], ReportingContext,
            [
                new UIComponentPermission('reporting/reportdefinitions', [CRUD.READ], true),
            ]
        );
        ContextService.getInstance().registerContext(reportingListContext);

        const newReportDefintionContext = new ContextDescriptor(
            NewReportDefinitionDialogContext.CONTEXT_ID, [KIXObjectType.REPORT_DEFINITION], ContextType.DIALOG,
            ContextMode.CREATE, false, 'new-report-definition-dialog', [], NewReportDefinitionDialogContext,
            [
                new UIComponentPermission('reporting/reportdefinitions', [CRUD.CREATE], true)
            ]
        );
        ContextService.getInstance().registerContext(newReportDefintionContext);

        const editReportContext = new ContextDescriptor(
            EditReportDefinitionDialogContext.CONTEXT_ID, [KIXObjectType.REPORT_DEFINITION], ContextType.DIALOG,
            ContextMode.EDIT, false, 'edit-report-definition-dialog', [], EditReportDefinitionDialogContext,
            [
                new UIComponentPermission('reporting/reportdefinitions', [CRUD.CREATE], true)
            ]
        );
        ContextService.getInstance().registerContext(editReportContext);

        ServiceRegistry.registerServiceInstance(ReportDefinitionFormService.getInstance());
        FormService.getInstance().addFormFieldValueHandler(new ReportDefinitionFormValueHandler());

        const newReportContext = new ContextDescriptor(
            NewReportDialogContext.CONTEXT_ID, [KIXObjectType.REPORT], ContextType.DIALOG,
            ContextMode.CREATE_SUB, false, 'new-report-dialog', [], NewReportDialogContext, []
        );
        ContextService.getInstance().registerContext(newReportContext);
        ServiceRegistry.registerServiceInstance(ReportFormService.getInstance());

        JobFormService.getInstance().registerJobFormManager(JobTypes.REPORTING, new ReportingJobFormManager());

        const manager = JobFormService.getInstance().getAllJobFormManager();
        manager.forEach((m) => m.addExtendedJobFormManager(new CreateReportActionJobFormManager()));
    }

}
