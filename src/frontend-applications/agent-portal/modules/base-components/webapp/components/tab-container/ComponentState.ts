/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractComponentState } from "../../../../../modules/base-components/webapp/core/AbstractComponentState";
import { WidgetConfiguration } from "../../../../../model/configuration/WidgetConfiguration";
import { ContextType } from "../../../../../model/ContextType";
import { IAction } from "../../../../../modules/base-components/webapp/core/IAction";

export class ComponentState extends AbstractComponentState {

    public constructor(
        public tabWidgets: WidgetConfiguration[] = [],
        public tabId: string = null,
        public activeTab: WidgetConfiguration = null,
        public activeTabTitle: string = '',
        public minimizable: boolean = true,
        public hasSidebars: boolean = false,
        public contextType: ContextType = null,
        public showSidebar: boolean = false,
        public contentActions: IAction[] = [],
        public prepared: boolean = false
    ) {
        super();
    }

}