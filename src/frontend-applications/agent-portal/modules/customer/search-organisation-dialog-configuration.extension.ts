/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { OrganisationSearchContext } from './webapp/core';
import { SearchExtension } from '../search/SearchExtension';

export class Extension extends SearchExtension {

    public getModuleId(): string {
        return OrganisationSearchContext.CONTEXT_ID;
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
