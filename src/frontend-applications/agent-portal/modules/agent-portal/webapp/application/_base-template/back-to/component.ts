/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { IContextServiceListener } from '../../../../../../modules/base-components/webapp/core/IContextServiceListener';
import { IdService } from '../../../../../../model/IdService';
import { ContextService } from '../../../../../../modules/base-components/webapp/core/ContextService';
import { ContextHistoryEntry } from '../../../../../../modules/base-components/webapp/core/ContextHistoryEntry';
import { Context } from '../../../../../../model/Context';
import { ContextType } from '../../../../../../model/ContextType';
import { ContextDescriptor } from '../../../../../../model/ContextDescriptor';
import { RoutingConfiguration } from '../../../../../../model/configuration/RoutingConfiguration';

class Component implements IContextServiceListener {

    public state: ComponentState;
    public constexServiceListenerId: string;

    public onCreate(): void {
        this.state = new ComponentState();
        this.constexServiceListenerId = IdService.generateDateBasedId('back-to-');
    }

    public onMount(): void {
        ContextService.getInstance().registerListener(this);

        document.addEventListener('click', (event: any) => {
            if (!this.state.minimized) {
                if (this.state.keepShow) {
                    this.state.keepShow = false;
                } else {
                    this.toggleList();
                }
            }
        }, false);
    }

    public onDestroy(): void {
        ContextService.getInstance().unregisterListener(this.constexServiceListenerId);
    }

    public listClicked(): void {
        this.state.keepShow = true;
    }

    private toggleList(): void {
        this.state.keepShow = true;
        this.state.minimized = !this.state.minimized;
    }

    public navigate(entry: ContextHistoryEntry): void {
        this.toggleList();
    }

    public contextChanged(contextId: string, context: Context, type: ContextType): void {
        this.state.history = ContextService.getInstance().getHistory();
    }

    public contextRegistered(descriptor: ContextDescriptor): void {
        return;
    }

    public getRoutingConfiguration(entry: ContextHistoryEntry): RoutingConfiguration {
        return new RoutingConfiguration(entry.contextId, null, entry.descriptor.contextMode, null, true);
    }

}

module.exports = Component;