/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { AbstractMarkoComponent } from '../../../../base-components/webapp/core/AbstractMarkoComponent';
import { Cell } from '../../../../base-components/webapp/core/table';
import { KIXObject } from '../../../../../model/kix/KIXObject';
import { KIXObjectService } from '../../../../base-components/webapp/core/KIXObjectService';
import { KIXObjectLoadingOptions } from '../../../../../model/KIXObjectLoadingOptions';
import { KIXObjectProperty } from '../../../../../model/kix/KIXObjectProperty';

class Component extends AbstractMarkoComponent<ComponentState> {

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        const cell: Cell = input.cell;
        if (cell) {
            this.update(cell);
        }
    }

    private async update(cell: Cell): Promise<void> {
        const rowObject: KIXObject = cell.getRow().getRowObject().getObject();
        const property = cell.getColumnConfiguration().property;
        const dfName = KIXObjectService.getDynamicFieldName(property);
        if (dfName) {
            const objects = await KIXObjectService.loadObjects(
                rowObject.KIXObjectType, [rowObject.ObjectId],
                new KIXObjectLoadingOptions(null, null, null, [KIXObjectProperty.DYNAMIC_FIELDS])
            );

            if (Array.isArray(objects) && objects.length) {
                const dfValue = objects[0].DynamicFields.find((df) => df.Name === dfName);
                if (dfValue && dfValue.Value && Array.isArray(dfValue.Value) && dfValue.Value.length) {
                    this.state.checklist = JSON.parse(dfValue.Value[0]);
                }
            }
        }
    }

}

module.exports = Component;
