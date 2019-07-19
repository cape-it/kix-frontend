/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IConfigurationExtension } from '../../core/extensions';
import {
    WidgetConfiguration, ConfiguredWidget, ContextConfiguration, ObjectinformationWidgetSettings,
    KIXObjectType, MailAccountProperty, KIXObjectProperty
} from '../../core/model';
import { MailAccountDetailsContext } from '../../core/browser/mail-account/context';
import { TabWidgetSettings } from '../../core/model/components/TabWidgetSettings';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return MailAccountDetailsContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {

        const tabLane = new ConfiguredWidget('mail-account-details-tab-widget',
            new WidgetConfiguration('tab-widget', '', [], new TabWidgetSettings(['mail-account-information-lane']))
        );

        const mailAccountInfoLane =
            new ConfiguredWidget('mail-account-information-lane', new WidgetConfiguration(
                'mail-account-info-widget', 'Translatable#Account Information',
                [],
                new ObjectinformationWidgetSettings(KIXObjectType.MAIL_ACCOUNT, [
                    MailAccountProperty.LOGIN,
                    MailAccountProperty.HOST,
                    MailAccountProperty.TYPE,
                    MailAccountProperty.IMAP_FOLDER,
                    MailAccountProperty.TRUSTED,
                    MailAccountProperty.DISPATCHING_BY,
                    MailAccountProperty.COMMENT,
                    KIXObjectProperty.VALID_ID,
                    KIXObjectProperty.CREATE_BY,
                    KIXObjectProperty.CREATE_TIME,
                    KIXObjectProperty.CHANGE_BY,
                    KIXObjectProperty.CHANGE_TIME
                ]),
                false, true)
            );

        return new ContextConfiguration(
            MailAccountDetailsContext.CONTEXT_ID,
            [], [],
            [], [],
            ['mail-account-details-tab-widget'], [tabLane, mailAccountInfoLane],
            [], [],
            ['mail-account-create'],
            ['mail-account-edit', 'print-action']
        );
    }

    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        return;
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
