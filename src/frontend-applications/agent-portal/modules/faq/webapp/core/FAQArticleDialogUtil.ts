/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { EditFAQArticleDialogContext, NewFAQArticleDialogContext } from './context';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';

export class FAQArticleDialogUtil {

    public static async create(): Promise<void> {
        ContextService.getInstance().setActiveContext(NewFAQArticleDialogContext.CONTEXT_ID);
    }

    public static async edit(faqArticleId?: string | number): Promise<void> {
        if (!faqArticleId) {
            const context = ContextService.getInstance().getActiveContext();

            if (context) {
                faqArticleId = context.getObjectId();
            }
        }

        if (faqArticleId) {
            ContextService.getInstance().setActiveContext(EditFAQArticleDialogContext.CONTEXT_ID, faqArticleId);
        }
    }

}
