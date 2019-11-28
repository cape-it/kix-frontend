/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ISocketResponse } from "../../socket";
import { FormConfiguration } from "../../components/form/configuration";

export class LoadFormConfigurationResponse implements ISocketResponse {

    public constructor(
        public requestId: string,
        public form: FormConfiguration
    ) { }

}