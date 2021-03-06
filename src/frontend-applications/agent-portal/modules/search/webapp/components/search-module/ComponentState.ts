/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { WidgetConfiguration } from '../../../../../model/configuration/WidgetConfiguration';
import { IdService } from '../../../../../model/IdService';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { AbstractComponentState } from '../../../../base-components/webapp/core/AbstractComponentState';
import { ObjectIcon } from '../../../../icon/model/ObjectIcon';

export class ComponentState extends AbstractComponentState {
    public constructor(
        public resultWidget: [KIXObjectType | string, WidgetConfiguration, string, string | ObjectIcon] = null,
        public componentKey: string = IdService.generateDateBasedId()
    ) {
        super();
    }
}
