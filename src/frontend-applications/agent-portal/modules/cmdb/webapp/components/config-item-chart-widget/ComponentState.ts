/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ChartConfiguration } from 'chart.js';
import { WidgetComponentState } from '../../../../../modules/base-components/webapp/core/WidgetComponentState';

export class ComponentState extends WidgetComponentState {

    public constructor(
        public title: string = '',
        public chartConfig: ChartConfiguration = null,
        public loading: boolean = true
    ) {
        super();
    }

}
