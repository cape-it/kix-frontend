/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectFactory } from '../../../../modules/base-components/webapp/core/KIXObjectFactory';
import { MailAccount } from '../../model/MailAccount';

export class MailAccountBrowserFactory extends KIXObjectFactory<MailAccount> {

    private static INSTANCE: MailAccountBrowserFactory;

    public static getInstance(): MailAccountBrowserFactory {
        if (!MailAccountBrowserFactory.INSTANCE) {
            MailAccountBrowserFactory.INSTANCE = new MailAccountBrowserFactory();
        }
        return MailAccountBrowserFactory.INSTANCE;
    }

    private constructor() {
        super();
    }

    public async create(mailAccount: MailAccount): Promise<MailAccount> {
        const newMailAccount = new MailAccount(mailAccount);
        return newMailAccount;
    }

}
