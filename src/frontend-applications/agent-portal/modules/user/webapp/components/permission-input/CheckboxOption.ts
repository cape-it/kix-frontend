/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

export class CheckboxOption {

    public constructor(
        public id: string,
        public checked: boolean = false,
        public show: boolean = true,
        public readonly: boolean = false
    ) { }
}
