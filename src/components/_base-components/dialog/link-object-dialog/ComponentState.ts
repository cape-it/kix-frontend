/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { LinkTypeDescription, CreateLinkDescription, TreeNode, KIXObjectType } from '../../../../core/model';
import { ITable, IdService } from '../../../../core/browser';

export class ComponentState {

    public constructor(
        public loadNodes: () => Promise<TreeNode[]> = null,
        public table: ITable = null,
        public resultCount: number = 0,
        public currentLinkTypeDescription: LinkTypeDescription = null,
        public linkDescriptions: CreateLinkDescription[] = null,
        public formId: string = null,
        public canSubmit: boolean = false,
        public tableId: string = null,
        public filterCount: number = null,
        public loading: boolean = true,
        public translations: any = {},
        public linkTypeTreeId: string = IdService.generateDateBasedId('linkTypeTreeId')
    ) { }
}
