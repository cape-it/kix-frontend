/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { TableContentProvider } from '../../../base-components/webapp/core/table/TableContentProvider';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { Table, RowObject, TableValue } from '../../../base-components/webapp/core/table';
import { KIXObjectLoadingOptions } from '../../../../model/KIXObjectLoadingOptions';
import { KIXObject } from '../../../../model/kix/KIXObject';
import { ContextService } from '../../../../modules/base-components/webapp/core/ContextService';
import { Role } from '../../model/Role';
import { Permission } from '../../model/Permission';

export class PermissionsTableContentProvider extends TableContentProvider<Permission> {

    public constructor(
        public objectType: KIXObjectType | string,
        table: Table,
        objectIds: Array<string | number>,
        loadingOptions: KIXObjectLoadingOptions,
        contextId?: string,
    ) {
        super(KIXObjectType.PERMISSION, table, objectIds, loadingOptions, contextId);
    }
    public async loadData(): Promise<Array<RowObject<Permission>>> {
        let object: KIXObject;
        if (this.contextId) {
            const context = ContextService.getInstance().getActiveContext();
            object = await context.getObject();
        }

        const rowObjects = [];
        if (object) {
            let permissions = [];

            if (this.objectType === KIXObjectType.ROLE_PERMISSION) {
                permissions = (object as Role).Permissions;
            } else if (object.ConfiguredPermissions) {
                permissions = this.objectType === KIXObjectType.PERMISSION_DEPENDING_OBJECTS
                    ? object.ConfiguredPermissions.DependingObjects
                    : object.ConfiguredPermissions.Assigned;
            }

            for (const p of permissions) {
                const values: TableValue[] = [];

                const columns = this.table.getColumns().map((c) => c.getColumnConfiguration());
                for (const column of columns) {
                    const tableValue = new TableValue(column.property, object[column.property]);
                    values.push(tableValue);
                }

                rowObjects.push(new RowObject<Permission>(values, p));
            }
        }

        return rowObjects;
    }

    protected getContextObjectType(): KIXObjectType | string {
        return KIXObjectType.ROLE;
    }

}
