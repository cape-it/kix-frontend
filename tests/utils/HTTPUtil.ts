/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { RequestMethod } from "../../src/server/model/rest/RequestMethod";
import { OptionsResponse } from "../../src/server/model/rest/OptionsResponse";
import { ResponseHeader } from "../../src/server/model/rest/ResponseHeader";

export class HTTPUtil {

    public static createOptionsResponse(methods: RequestMethod[]): OptionsResponse {
        const headers = {};
        headers[ResponseHeader.ALLOW] = methods.join(',');
        const response = { headers };

        return new OptionsResponse(response as any);
    }

}
