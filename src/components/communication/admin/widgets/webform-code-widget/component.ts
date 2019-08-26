/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { AbstractMarkoComponent, ContextService } from '../../../../../core/browser';
import { ComponentState } from './ComponentState';
import { KIXObjectType } from '../../../../../core/model';
import { IEventSubscriber } from '../../../../../core/browser/event';
import { WebformDetailsContext } from '../../../../../core/browser/webform/context/WebformDetailsContext';
import { Webform } from '../../../../../core/model/webform';

class Component extends AbstractMarkoComponent<ComponentState> {

    private subscriber: IEventSubscriber;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        const context = await ContextService.getInstance().getContext<WebformDetailsContext>(
            WebformDetailsContext.CONTEXT_ID
        );

        context.registerListener('webform-code-widget', {
            sidebarToggled: () => { return; },
            explorerBarToggled: () => { return; },
            objectListChanged: () => { return; },
            filteredObjectListChanged: () => { return; },
            scrollInformationChanged: () => { return; },
            objectChanged: async (webformId: string, webform: Webform, type: KIXObjectType) => {
                if (type === KIXObjectType.WEBFORM) {
                    this.initWidget(webform);
                }
            }
        });
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        await this.initWidget(await context.getObject<Webform>());
    }

    private async initWidget(webform: Webform): Promise<void> {
        this.state.title = this.state.widgetConfiguration ? this.state.widgetConfiguration.title : 'Translatable#Code';
    }

    public async onDestroy(): Promise<void> {
        const context = await ContextService.getInstance().getContext<WebformDetailsContext>(
            WebformDetailsContext.CONTEXT_ID
        );
        context.unregisterListener('webform-code-widget');
    }

}

module.exports = Component;