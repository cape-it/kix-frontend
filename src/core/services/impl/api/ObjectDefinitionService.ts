import { KIXObjectService } from "./KIXObjectService";
import { KIXObjectType, Error } from "../../../model";
import { KIXObjectServiceRegistry } from "../../KIXObjectServiceRegistry";
import { ObjectDefinition } from "../../../model/kix/object-definition/ObjectDefinition";
import { ObjectDefinitionsResponse } from "../../../api/object-definition";

export class ObjectDefinitionService extends KIXObjectService {

    protected RESOURCE_URI: string = this.buildUri('system', 'objectdefinitions');

    protected objectType: KIXObjectType = KIXObjectType.OBJECT_DEFINITION;

    private static INSTANCE: ObjectDefinitionService;

    public static getInstance(): ObjectDefinitionService {
        if (!ObjectDefinitionService.INSTANCE) {
            ObjectDefinitionService.INSTANCE = new ObjectDefinitionService();
        }
        return ObjectDefinitionService.INSTANCE;
    }

    private constructor() {
        super();
        KIXObjectServiceRegistry.registerServiceInstance(this);
    }

    public isServiceFor(type: KIXObjectType): boolean {
        return type === KIXObjectType.OBJECT_DEFINITION;
    }

    public async getObjectDefinitions(token: string): Promise<ObjectDefinition[]> {
        const response = await this.getObjects<ObjectDefinitionsResponse>(token);
        return response.ObjectDefinition;
    }

    public createObject(
        token: string, clientRequestId: string, objectType: KIXObjectType, parameter: Array<[string, string]>
    ): Promise<string | number> {
        throw new Error('', "Method not implemented.");
    }

    public async updateObject(
        token: string, clientRequestId: string, objectType: KIXObjectType,
        parameter: Array<[string, any]>, objectId: number | string
    ): Promise<string | number> {
        throw new Error('', "Method not implemented.");
    }
}
