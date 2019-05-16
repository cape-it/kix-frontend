import { KIXObjectType } from "../kix";
import { RoutingConfiguration } from "../../browser/router";

export class ObjectinformationWidgetSettings {

    public constructor(
        public objectType: KIXObjectType,
        public properties: string[] = [],
        public displayFlatList: boolean = false,
        public routingConfiguration: RoutingConfiguration = null,
        public navigationProperties: string[] = []
    ) { }

}