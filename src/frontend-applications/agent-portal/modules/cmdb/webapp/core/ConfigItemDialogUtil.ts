/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { EditConfigItemDialogContext, NewConfigItemDialogContext } from './context';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { ConfigItem } from '../../model/ConfigItem';
import { ConfigItemProperty } from '../../model/ConfigItemProperty';

export class ConfigItemDialogUtil {

    public static async create(): Promise<void> {
        ContextService.getInstance().setActiveContext(NewConfigItemDialogContext.CONTEXT_ID);
    }

    public static async edit(configItemId?: string | number): Promise<void> {
        if (!configItemId) {
            configItemId = await this.getConfigItemId();
        }

        if (configItemId) {
            ContextService.getInstance().setActiveContext(EditConfigItemDialogContext.CONTEXT_ID, configItemId);
        }
    }

    public static async duplicate(configItem: ConfigItem): Promise<void> {
        ContextService.getInstance().setActiveContext(
            NewConfigItemDialogContext.CONTEXT_ID, configItem.ConfigItemID, null,
            [
                [ConfigItemProperty.CLASS_ID, configItem.ClassID],
                ['DUPLICATE', true]
            ]
        );
    }

    private static async getConfigItemId(): Promise<number> {
        let configItemId: number;

        const context = ContextService.getInstance().getActiveContext();

        if (context) {
            configItemId = Number(context.getObjectId());
        }

        return configItemId;
    }

}
