/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ObjectIcon } from '../../kix';
import { IConfiguration, ConfigurationType, ConfigurationDefinition } from '../../configuration';

export class WidgetConfiguration implements IConfiguration {

    public instanceId: string;

    public constructor(
        public id: string,
        public name: string,
        public type: string | ConfigurationType,
        public widgetId: string,
        public title: string,
        public actions: string[],
        public subConfigurationDefinition?: ConfigurationDefinition,
        public configuration?: any,
        public minimized: boolean = false,
        public minimizable: boolean = true,
        public icon: string | ObjectIcon = '',
        public contextDependent: boolean = false
    ) { }

}
