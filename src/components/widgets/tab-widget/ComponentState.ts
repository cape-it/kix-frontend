import { WidgetComponentState, ConfiguredWidget } from "../../../core/model";

export class ComponentState extends WidgetComponentState {

    public constructor(
        public widgets: ConfiguredWidget[] = [],
        public show: boolean = false
    ) {
        super();
    }

}
