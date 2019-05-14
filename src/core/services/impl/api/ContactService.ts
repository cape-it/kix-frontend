import { KIXObjectService } from './KIXObjectService';
import {
    ContactProperty, KIXObjectType, KIXObjectLoadingOptions, Error, ContactFactory
} from "../../../model";
import {
    CreateContact, CreateContactResponse, CreateContactRequest, UpdateContactResponse,
    UpdateContactRequest, UpdateContact
} from "../../../api";
import { KIXObjectServiceRegistry } from '../../KIXObjectServiceRegistry';
import { LoggingService } from '../LoggingService';

export class ContactService extends KIXObjectService {

    private static INSTANCE: ContactService;

    public static getInstance(): ContactService {
        if (!ContactService.INSTANCE) {
            ContactService.INSTANCE = new ContactService();
        }
        return ContactService.INSTANCE;
    }

    protected RESOURCE_URI: string = "contacts";

    public objectType: KIXObjectType = KIXObjectType.CONTACT;

    private constructor() {
        super([new ContactFactory()]);
        KIXObjectServiceRegistry.registerServiceInstance(this);
    }

    public isServiceFor(kixObjectType: KIXObjectType): boolean {
        return kixObjectType === KIXObjectType.CONTACT;
    }

    public async loadObjects<T>(
        token: string, clientRequestId: string, objectType: KIXObjectType,
        objectIds: string[], loadingOptions: KIXObjectLoadingOptions
    ): Promise<T[]> {
        const objects = await super.load(
            token, KIXObjectType.CONTACT, this.RESOURCE_URI, loadingOptions, objectIds, KIXObjectType.CONTACT
        );

        return objects;
    }

    public async createObject(
        token: string, clientRequestId: string, objectType: KIXObjectType, parameter: Array<[string, any]>
    ): Promise<string> {
        this.prepareOrganisationIdsParameter(parameter);

        const createContact = new CreateContact(parameter);
        const response = await this.sendCreateRequest<CreateContactResponse, CreateContactRequest>(
            token, clientRequestId, this.RESOURCE_URI, new CreateContactRequest(createContact),
            this.objectType
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        return response.ContactID;
    }

    public async updateObject(
        token: string, clientRequestId: string, objectType: KIXObjectType,
        parameter: Array<[string, any]>, objectId: number | string
    ): Promise<string | number> {

        this.prepareOrganisationIdsParameter(parameter);

        const updateContact = new UpdateContact(parameter);

        const response = await this.sendUpdateRequest<UpdateContactResponse, UpdateContactRequest>(
            token, clientRequestId, this.buildUri(this.RESOURCE_URI, objectId), new UpdateContactRequest(updateContact),
            this.objectType
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        return response.ContactID;
    }

    private prepareOrganisationIdsParameter(parameter: Array<[string, any]>): void {
        const orgIdParamIndex = parameter.findIndex((v) => v[0] === ContactProperty.PRIMARY_ORGANISATION_ID);
        const orgIdsParamIndex = parameter.findIndex((v) => v[0] === ContactProperty.ORGANISATION_IDS);

        if (orgIdParamIndex !== -1 && parameter[orgIdParamIndex][1]) {
            const orgId = parameter[orgIdParamIndex][1];
            if (orgIdsParamIndex !== -1) {
                if (Array.isArray(parameter[orgIdsParamIndex][1])) {
                    if (!parameter[orgIdsParamIndex][1].some((id) => id === orgId)) {
                        parameter[orgIdsParamIndex][1].push(orgId);
                    }
                } else {
                    parameter[orgIdsParamIndex][1] = [orgId];
                }
            } else {
                parameter.push([ContactProperty.ORGANISATION_IDS, [orgId]]);
            }
        }
    }

}
