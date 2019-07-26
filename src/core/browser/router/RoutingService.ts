/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentRouter, KIXObjectType, ContextMode, Context } from '../../model';
import { IRoutingServiceListener } from './IRoutingServiceListener';
import { RoutingConfiguration } from './RoutingConfiguration';
import { ContextService } from '../context';
import { ContextFactory } from '../context/ContextFactory';
import { ClientStorageService } from '../ClientStorageService';
import { ReleaseContext } from '../release';
import { BrowserUtil } from '../BrowserUtil';
import { KIXModulesSocketClient } from '../modules/KIXModulesSocketClient';
import { ActionFactory } from '../ActionFactory';

export class RoutingService {

    private static INSTANCE: RoutingService = null;

    public static getInstance(): RoutingService {
        if (!RoutingService.INSTANCE) {
            RoutingService.INSTANCE = new RoutingService();
        }

        return RoutingService.INSTANCE;
    }

    private constructor() { }

    private componentRouters: ComponentRouter[] = [];
    private serviceListener: IRoutingServiceListener[] = [];
    private routingConfigurations: RoutingConfiguration[] = [];

    public registerServiceListener(listener: IRoutingServiceListener): void {
        this.serviceListener.push(listener);
    }

    public registerRoutingConfiguration(configuration: RoutingConfiguration): void {
        this.routingConfigurations.push(configuration);
    }

    public async routeToInitialContext(history: boolean = false): Promise<void> {
        const VISITED_KEY = 'kix-18-site-visited';
        const visitedOption = ClientStorageService.getOption(VISITED_KEY);

        const releaseInfo = await KIXModulesSocketClient.getInstance().loadReleaseConfig();
        const buildNumber = releaseInfo ? releaseInfo.buildNumber : null;
        if (!visitedOption || (buildNumber && visitedOption !== buildNumber.toString())) {
            await ContextService.getInstance().setContext(
                ReleaseContext.CONTEXT_ID, KIXObjectType.ANY, ContextMode.DASHBOARD
            );
            ClientStorageService.setOption(VISITED_KEY, buildNumber.toString());
        } else {
            const parsedUrl = new URL(window.location.href);
            const path = parsedUrl.pathname === '/' ? [] : parsedUrl.pathname.split('/');
            let contextUrl = 'home';
            if (path.length > 1) {
                contextUrl = path[1];
                const objectId = path[2];

                let context: Context;
                if (contextUrl && contextUrl !== '') {
                    context = await ContextFactory.getContextForUrl(contextUrl, objectId);
                }

                if (context) {
                    await ContextService.getInstance().setContext(
                        context.getDescriptor().contextId, null,
                        context.getDescriptor().contextMode, objectId, undefined, history, false, true
                    );
                } else {
                    BrowserUtil.openAccessDeniedOverlay();
                    await this.setHomeContext();
                }
            } else {
                await this.setHomeContext();
            }

            this.handleRequest(parsedUrl.searchParams);
        }
    }

    private async setHomeContext(): Promise<void> {
        await ContextService.getInstance().setContext(
            'home', KIXObjectType.ANY, ContextMode.DASHBOARD, null, null, null, false, true
        );
    }

    private handleRequest(params: URLSearchParams): void {
        setTimeout(async () => {
            if (params.has('new')) {
                await ContextService.getInstance().setDialogContext(null, null, ContextMode.CREATE, null, true);
            } else if (params.has('actionId')) {
                const actionId = params.get('actionId');
                const data = params.get('data');
                const actions = await ActionFactory.getInstance().generateActions([actionId], data);
                if (actions && actions.length) {
                    actions[0].run(null);
                }
            }
        }, 2500);
    }

    public async routeToContext(
        routingConfiguration: RoutingConfiguration, objectId: string | number, addHistory: boolean = true
    ): Promise<void> {
        if (routingConfiguration) {
            ContextService.getInstance().setContext(
                routingConfiguration.contextId,
                routingConfiguration.objectType,
                routingConfiguration.contextMode,
                objectId, true, routingConfiguration.history,
                addHistory
            );
        }
    }

    public async buildUrl(routingConfiguration: RoutingConfiguration, objectId: string | number): Promise<string> {
        let url = '#';
        const descriptor = await ContextFactory.getInstance().getContextDescriptor(routingConfiguration.contextId);
        if (descriptor) {
            url = descriptor.urlPaths[0];
            if (descriptor.contextMode === ContextMode.DETAILS) {
                url += '/' + objectId;
            }
        }

        return url;
    }

    public routeTo(
        routerId: string, componentId: string, data: any, parameterValue: string = null
    ): void {
        let router = this.componentRouters.find((r) => r.routerId === routerId);
        if (!router) {
            const componentRouter = new ComponentRouter(routerId, componentId, parameterValue, data);
            this.componentRouters.push(componentRouter);
            router = componentRouter;
        }

        router.componentId = componentId;
        router.data = data;
        router.parameterValue = parameterValue;
        this.notifyListener(router);
    }


    private notifyListener(router: ComponentRouter): void {
        for (const listener of this.serviceListener) {
            listener.routedTo(router);
        }
    }

}
