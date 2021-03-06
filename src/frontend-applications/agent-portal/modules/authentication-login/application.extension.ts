/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { IMarkoApplication } from '../../server/extensions/IMarkoApplication';

import { KIXExtension } from '../../../../server/model/KIXExtension';

class Extension extends KIXExtension implements IMarkoApplication {

    public name: string = 'authentication-login';
    public path: string = 'login';
    public internal: boolean = true;

}

module.exports = (data, host, options) => {
    return new Extension();
};
