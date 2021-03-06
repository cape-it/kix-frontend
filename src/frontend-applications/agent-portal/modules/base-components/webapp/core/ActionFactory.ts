/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractAction } from './AbstractAction';
import { IAction } from './IAction';
import { AuthenticationSocketClient } from './AuthenticationSocketClient';


export class ActionFactory<T extends AbstractAction> {

    private actions: Map<string, new () => T> = new Map();
    private actionInstances: Map<string, T> = new Map();
    private blacklist: string[] = [];

    private static INSTANCE: ActionFactory<AbstractAction> = null;

    public static getInstance(): ActionFactory<AbstractAction> {
        if (!ActionFactory.INSTANCE) {
            ActionFactory.INSTANCE = new ActionFactory();
        }

        return ActionFactory.INSTANCE;
    }

    public registerAction(actionId: string, action: new () => T): void {
        if (this.actions.has(actionId)) {
            console.warn('Duplicate action registered: ' + actionId);
        }
        this.actions.set(actionId, action);
    }

    public blacklistActions(actionsIds: string[]): void {
        actionsIds.forEach((a) => this.blacklist.push(a));
    }

    public hasAction(actionId: string): boolean {
        return this.actions.has(actionId) && !this.blacklist.some((a) => a === actionId);
    }

    public async generateActions(actionIds: string[] = [], data?: any): Promise<AbstractAction[]> {
        const actions = [];
        for (const actionId of actionIds) {
            if (this.actionInstances.has(actionId)) {
                actions.push(this.actionInstances.get(actionId));
            } else if (this.actions.has(actionId) && !this.blacklist.some((a) => a === actionId)) {
                const actionPrototype = this.actions.get(actionId);
                let action: IAction = new actionPrototype();
                action.id = actionId;

                let allowed = true;
                if (action.permissions && action.permissions.length) {
                    allowed = await AuthenticationSocketClient.getInstance().checkPermissions(action.permissions);
                }

                if (allowed) {
                    await action.initAction();
                    await action.setData(data);
                    actions.push(action);
                } else {
                    action = undefined;
                }

            }
        }

        return actions;
    }

    public registerActionInstance(actionId: string, action: T): void {
        this.actionInstances.set(actionId, action);
    }

}
