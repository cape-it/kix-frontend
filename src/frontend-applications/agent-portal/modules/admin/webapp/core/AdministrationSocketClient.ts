/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { SocketClient } from '../../../../modules/base-components/webapp/core/SocketClient';
import { AdminModuleCategory } from '../../model/AdminModuleCategory';
import { IdService } from '../../../../model/IdService';
import { AdministrationEvent } from '../../model/AdministrationEvent';
import { AdminCategoriesResponse } from '../../model/AdminCategoriesResponse';
import { SocketEvent } from '../../../../modules/base-components/webapp/core/SocketEvent';
import { SocketErrorResponse } from '../../../../modules/base-components/webapp/core/SocketErrorResponse';
import { ISocketRequest } from '../../../../modules/base-components/webapp/core/ISocketRequest';
import { ClientStorageService } from '../../../../modules/base-components/webapp/core/ClientStorageService';
import { AdminModule } from '../../model/AdminModule';

export class AdministrationSocketClient extends SocketClient {

    private static INSTANCE: AdministrationSocketClient;

    public static getInstance(): AdministrationSocketClient {
        if (!AdministrationSocketClient.INSTANCE) {
            AdministrationSocketClient.INSTANCE = new AdministrationSocketClient();
        }

        return AdministrationSocketClient.INSTANCE;
    }

    private constructor() {
        super();
        this.socket = this.createSocket('administration', true);
    }

    private categories: AdminModuleCategory[];

    public async loadAdminCategories(): Promise<Array<AdminModuleCategory | AdminModule>> {
        if (this.categories) {
            return this.categories;
        }

        return new Promise<AdminModuleCategory[]>((resolve, reject) => {
            const requestId = IdService.generateDateBasedId();

            this.socket.on(
                AdministrationEvent.ADMIN_CATEGORIES_LOADED,
                (result: AdminCategoriesResponse) => {
                    if (result.requestId === requestId) {
                        const categories = result.modules.map((m) => {
                            if (m['modules']) {
                                return new AdminModuleCategory(m);
                            }
                            else {
                                return new AdminModule(m as AdminModule);
                            }
                        });
                        this.categories = categories;
                        resolve(categories);
                    }
                }
            );

            this.socket.on(SocketEvent.ERROR, (error: SocketErrorResponse) => {
                if (error.requestId === requestId) {
                    console.error(error.error);
                    reject(error.error);
                }
            });

            const request: ISocketRequest = {
                requestId,
                clientRequestId: ClientStorageService.getClientRequestId()
            };

            this.socket.emit(AdministrationEvent.LOAD_ADMIN_CATEGORIES, request);
        });
    }

}
