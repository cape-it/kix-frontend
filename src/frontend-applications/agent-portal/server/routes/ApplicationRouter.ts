/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { Request, Response } from 'express';
import { KIXRouter } from './KIXRouter';
import { ConfigurationService } from '../../../../server/services/ConfigurationService';
import { AuthenticationService } from '../services/AuthenticationService';

import path = require('path');

export class ApplicationRouter extends KIXRouter {

    private static INSTANCE: ApplicationRouter;

    private update: boolean = false;

    public static getInstance(): ApplicationRouter {
        if (!ApplicationRouter.INSTANCE) {
            ApplicationRouter.INSTANCE = new ApplicationRouter();
        }
        return ApplicationRouter.INSTANCE;
    }

    private constructor() {
        super();
    }

    public getBaseRoute(): string {
        return "/";
    }

    public async getDefaultModule(req: Request, res: Response, next: () => void): Promise<void> {
        const moduleId = ConfigurationService.getInstance().getServerConfiguration().DEFAULT_MODULE_ID;
        await this.handleRoute(moduleId, null, req, res);
    }

    public async getModule(req: Request, res: Response, next: () => void): Promise<void> {
        const moduleId = req.params.moduleId;
        const objectId = req.params.objectId;

        if (moduleId === 'socket.io') {
            next();
            return;
        }

        await this.handleRoute(moduleId, objectId, req, res);
    }


    public getRoot(req: Request, res: Response): void {
        const defaultRoute = ConfigurationService.getInstance().getServerConfiguration().DEFAULT_MODULE_ID;
        res.redirect(defaultRoute);
    }

    protected initialize(): void {
        this.router.get(
            "/",
            AuthenticationService.getInstance().isAuthenticated.bind(AuthenticationService.getInstance()),
            this.getDefaultModule.bind(this)
        );

        this.router.get(
            "/:moduleId",
            AuthenticationService.getInstance().isAuthenticated.bind(AuthenticationService.getInstance()),
            this.getModule.bind(this)
        );

        this.router.get(
            "/:moduleId/:objectId",
            AuthenticationService.getInstance().isAuthenticated.bind(AuthenticationService.getInstance()),
            this.getModule.bind(this)
        );

        this.router.get(
            "/:moduleId/:objectId/*",
            AuthenticationService.getInstance().isAuthenticated.bind(AuthenticationService.getInstance()),
            this.getModule.bind(this)
        );
    }

    private async handleRoute(moduleId: string, objectId: string, req: Request, res: Response): Promise<void> {
        if (this.update) {
            res.redirect('/static/html/update-info/index.html');
        } else {
            this.setFrontendSocketUrl(res);
            this.clearRequireCache('../applications/_app');
            const template = require('../../modules/agent-portal/webapp/application');
            res.marko(template);
        }
    }

    private clearRequireCache(configPath: string): void {
        try {
            const config = require.resolve(configPath);
            if (require.cache[config]) {
                delete require.cache[config];
            }
        } catch (error) {
            return;
        }
    }

    public setUpdate(update: boolean): void {
        this.update = update;
    }
}