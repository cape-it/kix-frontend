/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction } from "../../../../../modules/base-components/webapp/core/AbstractAction";
import { UIComponentPermission } from "../../../../../model/UIComponentPermission";
import { CRUD } from "../../../../../../../server/model/rest/CRUD";
import { ContextService } from "../../../../../modules/base-components/webapp/core/ContextService";
import { MailAccountDetailsContext } from "..";
import { EventService } from "../../../../../modules/base-components/webapp/core/EventService";
import { ApplicationEvent } from "../../../../../modules/base-components/webapp/core/ApplicationEvent";
import { KIXObjectService } from "../../../../../modules/base-components/webapp/core/KIXObjectService";
import { KIXObjectType } from "../../../../../model/kix/KIXObjectType";
import { MailAccountProperty } from "../../../model/MailAccountProperty";
import { TranslationService } from "../../../../../modules/translation/webapp/core/TranslationService";
import { BrowserUtil } from "../../../../../modules/base-components/webapp/core/BrowserUtil";
import { Error } from "../../../../../../../server/model/Error";

export class MailAccountFetchAction extends AbstractAction {

    public permissions: UIComponentPermission[] = [
        new UIComponentPermission('system/communication/mailaccounts/*', [CRUD.UPDATE])
    ];

    public async initAction(): Promise<void> {
        this.text = 'Translatable#Fetch now';
        this.icon = 'kix-icon-arrow-refresh';
    }

    public async run(): Promise<void> {
        const context = await ContextService.getInstance().getContext<MailAccountDetailsContext>(
            MailAccountDetailsContext.CONTEXT_ID
        );

        if (context) {
            const id = context.getObjectId();

            if (id) {
                EventService.getInstance().publish(
                    ApplicationEvent.APP_LOADING, { loading: true, hint: 'Translatable#Fetching Mail Account' }
                );

                await KIXObjectService.updateObject(
                    KIXObjectType.MAIL_ACCOUNT, [[MailAccountProperty.EXEC_FETCH, 1]], id, false
                ).then(async () => {
                    EventService.getInstance().publish(ApplicationEvent.APP_LOADING, { loading: false });
                    const toast = await TranslationService.translate(
                        'Translatable#Mail Account successfully fetched.'
                    );
                    BrowserUtil.openSuccessOverlay(toast);
                }).catch((error: Error) => {
                    EventService.getInstance().publish(ApplicationEvent.APP_LOADING, { loading: false });
                    BrowserUtil.openErrorOverlay(`${error.Code}: ${error.Message}`);
                });
            }
        }
    }
}