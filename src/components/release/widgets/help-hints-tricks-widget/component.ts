/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractMarkoComponent, KIXObjectService } from "../../../../core/browser";
import { ComponentState } from './ComponentState';
import { TranslationService } from "../../../../core/browser/i18n/TranslationService";
import { AuthenticationSocketClient } from "../../../../core/browser/application/AuthenticationSocketClient";
import { UIComponentPermission } from "../../../../core/model/UIComponentPermission";
import { CRUD, KIXObjectType, SysConfigKey, SysConfigOption } from "../../../../core/model";

class Component extends AbstractMarkoComponent<ComponentState> {

    public onCreate(input: any): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        this.state.translations = await TranslationService.createTranslationObject([
            'Translatable#Help, hints & tricks'
        ]);
        this.state.hasFAQAccess = await this.checkFAQReadPermissions();
        this.state.hasConfigAccess = await this.checkConfigReadPermissions();
        if (this.state.hasConfigAccess) {
            const userManualConfigs = await KIXObjectService.loadObjects<SysConfigOption>(
                KIXObjectType.SYS_CONFIG_OPTION, [SysConfigKey.USER_MANUAL]
            );
            this.state.userManualLink = userManualConfigs && !!userManualConfigs.length ?
                userManualConfigs[0].Value : null;
            const adminManualConfigs = await KIXObjectService.loadObjects<SysConfigOption>(
                KIXObjectType.SYS_CONFIG_OPTION, [SysConfigKey.ADMIN_MANUAL]
            );
            this.state.adminManualLink = adminManualConfigs && !!adminManualConfigs.length ?
                adminManualConfigs[0].Value : null;
        }
    }

    private async checkFAQReadPermissions(): Promise<boolean> {
        return await AuthenticationSocketClient.getInstance().checkPermissions(
            [new UIComponentPermission('faq/articles', [CRUD.READ])]
        );
    }

    private async checkConfigReadPermissions(): Promise<boolean> {
        return await AuthenticationSocketClient.getInstance().checkPermissions(
            [new UIComponentPermission('system/config', [CRUD.READ])]
        );
    }
}

module.exports = Component;