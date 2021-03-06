/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { Article } from '../../../model/Article';
import { Attachment } from '../../../../../model/kix/Attachment';
import { ObjectIcon } from '../../../../icon/model/ObjectIcon';

export class ComponentState {

    public constructor(
        public article: Article = null,
        public attachment: Attachment = null,
        public progress: boolean = false,
        public extension: string = null,
        public icon: ObjectIcon = null
    ) { }

}
