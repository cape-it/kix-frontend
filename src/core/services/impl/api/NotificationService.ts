/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import {
    KIXObjectType, KIXObjectLoadingOptions, KIXObjectSpecificLoadingOptions,
    KIXObjectSpecificCreateOptions, Error, Notification, NotificationProperty, KIXObjectProperty, NotificationMessage
} from '../../../model';
import { KIXObjectService } from './KIXObjectService';
import { KIXObjectServiceRegistry } from '../../KIXObjectServiceRegistry';
import { LoggingService } from '../LoggingService';
import { NotificationFactory } from '../../object-factories/NotificationFactory';

export class NotificationService extends KIXObjectService {

    private static INSTANCE: NotificationService;

    public static getInstance(): NotificationService {
        if (!NotificationService.INSTANCE) {
            NotificationService.INSTANCE = new NotificationService();
        }
        return NotificationService.INSTANCE;
    }

    protected RESOURCE_URI: string = this.buildUri('system', 'communication', 'notifications');

    public objectType: KIXObjectType = KIXObjectType.NOTIFICATION;

    private constructor() {
        super([new NotificationFactory()]);
        KIXObjectServiceRegistry.registerServiceInstance(this);
    }

    public isServiceFor(kixObjectType: KIXObjectType): boolean {
        return kixObjectType === KIXObjectType.NOTIFICATION;
    }

    public async loadObjects<T>(
        token: string, clientRequestId: string, objectType: KIXObjectType, objectIds: Array<number | string>,
        loadingOptions: KIXObjectLoadingOptions, objectLoadingOptions: KIXObjectSpecificLoadingOptions
    ): Promise<T[]> {

        let objects = [];
        if (objectType === KIXObjectType.NOTIFICATION) {
            objects = await super.load<Notification>(
                token, KIXObjectType.NOTIFICATION, this.RESOURCE_URI, loadingOptions, objectIds, 'Notification'
            );
        }

        return objects;
    }

    public async createObject(
        token: string, clientRequestId: string, objectType: KIXObjectType, parameter: Array<[string, any]>,
        createOptions?: KIXObjectSpecificCreateOptions
    ): Promise<number> {
        const createParameter = this.prepareParameter(parameter);
        const id = super.executeUpdateOrCreateRequest(
            token, clientRequestId, createParameter, this.RESOURCE_URI, KIXObjectType.NOTIFICATION,
            'NotificationID', true
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        return id;
    }

    public async updateObject(
        token: string, clientRequestId: string, objectType: KIXObjectType,
        parameter: Array<[string, any]>, objectId: number | string
    ): Promise<string | number> {
        const uri = this.buildUri(this.RESOURCE_URI, objectId);
        const updateParameter = this.prepareParameter(parameter);
        const id = super.executeUpdateOrCreateRequest(
            token, clientRequestId, updateParameter, uri, KIXObjectType.NOTIFICATION, 'NotificationID'
        ).catch((error: Error) => {
            LoggingService.getInstance().error(`${error.Code}: ${error.Message}`, error);
            throw new Error(error.Code, error.Message);
        });

        return id;
    }

    private prepareParameter(parameter: Array<[string, any]>): Array<[string, any]> {
        const newParameter: Array<[string, any]> = [];
        const dataProperties = {};
        const messageProperties = {};

        const messageRegEx = new RegExp(
            `^(${NotificationProperty.MESSAGE_BODY}|${NotificationProperty.MESSAGE_SUBJECT})###(.+)$`
        );
        parameter.forEach((p) => {
            if (p[0] === NotificationProperty.NAME ||
                p[0] === KIXObjectProperty.VALID_ID ||
                p[0] === KIXObjectProperty.COMMENT
            ) {
                newParameter.push(p);
            } else if (p[0].match(messageRegEx)) {
                const property = p[0].replace(messageRegEx, '$1');
                const language = p[0].replace(messageRegEx, '$2');
                if (!messageProperties[language]) {
                    messageProperties[language] = new NotificationMessage();
                }
                messageProperties[language][property] = p[1];
            } else if (p[0] === NotificationProperty.DATA_FILTER) {
                if (Array.isArray(p[1])) {
                    p[1].forEach((df) => {
                        if (Array.isArray(df[1])) {
                            dataProperties[df[0]] = df[1];
                        } else if (typeof df[1] !== 'undefined' && df[1] !== null) {
                            dataProperties[df[0]] = [df[1]];
                        }
                    });
                }
            } else {
                // handle Data properties
                if (Array.isArray(p[1])) {
                    dataProperties[p[0]] = p[1].filter((v) => v !== null);
                } else if (typeof p[1] !== 'undefined' && p[1] !== null) {
                    dataProperties[p[0]] = [p[1]];
                }
            }
        });

        newParameter.push([NotificationProperty.DATA, dataProperties]);
        newParameter.push([NotificationProperty.MESSAGE, messageProperties]);
        return newParameter;
    }
}
