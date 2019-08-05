/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectFormService } from "../kix/KIXObjectFormService";
import { KIXObjectType, MailFilter, MailFilterProperty, MailFilterMatch } from "../../model";

export class MailFilterFormService extends KIXObjectFormService<MailFilter> {

    private static INSTANCE: MailFilterFormService = null;

    public static getInstance(): MailFilterFormService {
        if (!MailFilterFormService.INSTANCE) {
            MailFilterFormService.INSTANCE = new MailFilterFormService();
        }

        return MailFilterFormService.INSTANCE;
    }

    private constructor() {
        super();
    }

    public isServiceFor(kixObjectType: KIXObjectType) {
        return kixObjectType === KIXObjectType.MAIL_FILTER;
    }

    protected async getValue(property: string, value: any, mailFilter: MailFilter): Promise<any> {
        switch (property) {
            case MailFilterProperty.MATCH:
                if (Array.isArray(value)) {
                    (value as MailFilterMatch[]).forEach((m) => {
                        m.Not = Boolean(m.Not);
                    });
                }
                break;
            default:
        }
        return value;
    }
}
