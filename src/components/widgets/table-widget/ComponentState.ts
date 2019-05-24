import { WidgetComponentState, KIXObjectPropertyFilter, IAction, ObjectIcon } from "../../../core/model";
import { ITable } from "../../../core/browser";

export class ComponentState extends WidgetComponentState {

    public constructor(
        public table: ITable = null,
        public predefinedTableFilter: KIXObjectPropertyFilter[] = [],
        public actions: IAction[] = [],
        public title: string = null,
        public icon: string | ObjectIcon = null,
        public filterCount: number = null,
        public headerTitleComponents: string[] = [],
        public filterPlaceHolder: string = 'Translatable#All Objects',
        public showFilter: boolean = true,
        public isFiltering: boolean = false,
        public loading: boolean = true
    ) {
        super();
    }

}
