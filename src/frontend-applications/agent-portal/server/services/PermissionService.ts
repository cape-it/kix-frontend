/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { UIComponentPermission } from '../../model/UIComponentPermission';
import { HttpService } from './HttpService';

export class PermissionService {

    private static INSTANCE: PermissionService;

    public static getInstance(): PermissionService {
        if (!PermissionService.INSTANCE) {
            PermissionService.INSTANCE = new PermissionService();
        }
        return PermissionService.INSTANCE;
    }

    private constructor() { }

    public async checkPermissions(
        token: string, permissions: UIComponentPermission[] = [], object?: any
    ): Promise<boolean> {
        if (permissions && permissions.length) {
            const andPermissionChecks: Array<Promise<boolean>> = [];
            const orPermissionChecks: Array<Promise<boolean>> = [];
            permissions.filter((p) => p.OR).forEach((p) => {
                orPermissionChecks.push(this.methodAllowed(token, p, object));
            });
            permissions.filter((p) => !p.OR).forEach((p) => {
                andPermissionChecks.push(this.methodAllowed(token, p, object));
            });

            const andChecks = await Promise.all(andPermissionChecks);
            const andCheck = andChecks.every((c) => c);

            const orChecks = await Promise.all(orPermissionChecks);
            const orCheck = orChecks.some((c) => c);

            return andChecks.length === 0 && orChecks.length > 0
                ? orCheck
                : andCheck || orCheck;
        }
        return true;
    }

    private async methodAllowed(token: string, permission: UIComponentPermission, object: any): Promise<boolean> {
        if (permission.permissions && permission.permissions.length) {
            if (permission.target.startsWith('/')) {
                permission.target = permission.target.substr(1, permission.target.length);
            }

            const response = await HttpService.getInstance().options(
                token, permission.target, object
            ).catch((error) => {
                console.error(error);
                return null;
            });

            if (response !== null && permission.value) {
                const permissionValue = Number(permission.value);
                const accessPermission = response.headers.AllowPermissionValue & permissionValue;
                return accessPermission === permissionValue;
            } else {
                return false;
            }
        }

        return true;
    }

}
