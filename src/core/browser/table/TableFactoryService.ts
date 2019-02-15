import { ITableFactory } from "./ITableFactory";
import { KIXObjectType, KIXObjectLoadingOptions } from "../../model";
import { ITable } from "../table";
import { TableConfiguration } from "./TableConfiguration";

export class TableFactoryService {

    private static INSTANCE: TableFactoryService;

    public static getInstance(): TableFactoryService {
        if (!TableFactoryService.INSTANCE) {
            TableFactoryService.INSTANCE = new TableFactoryService();
        }

        return TableFactoryService.INSTANCE;
    }

    private constructor() { }

    private factories: ITableFactory[] = [];

    public registerFactory(factory: ITableFactory): void {
        if (this.factories.some((f) => f.objectType === factory.objectType)) {
            console.warn(`Redudant TableFactory for type ${factory.objectType}`);
        }

        this.factories.push(factory);
    }

    public createTable(
        objectType: KIXObjectType, tableConfiguration?: TableConfiguration, objectIds?: Array<number | string>,
        contextId?: string, defaultRouting?: boolean, defaultToggle?: boolean, short: boolean = false
    ): ITable {
        const factory = this.factories.find((f) => f.objectType === objectType);
        const table = factory
            ? factory.createTable(tableConfiguration, objectIds, contextId, defaultRouting, defaultToggle, short)
            : null;
        return table;
    }
}
