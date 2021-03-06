/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractComponentState } from '../../../../../../modules/base-components/webapp/core/AbstractComponentState';
import { AutoCompleteConfiguration } from '../../../../../../model/configuration/AutoCompleteConfiguration';
import { TreeNode } from '../../../core/tree';

export class ComponentState extends AbstractComponentState {

    public constructor(
        public autocompleteConfiguration: AutoCompleteConfiguration = null,
        public searchCallback: (limit: number, searchValue: string) => Promise<TreeNode[]> = null,
        public filterValue: string = null,
        public placeholder: string = '',
        public autocompleteNotFoundText: string = '',
        public freeText: boolean = false,
        public loading: boolean = false,
        public tree: TreeNode[] = []
    ) {
        super();
    }

}
