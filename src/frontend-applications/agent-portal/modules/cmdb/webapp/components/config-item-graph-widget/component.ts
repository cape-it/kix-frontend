/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { IdService } from '../../../../../model/IdService';
import { TranslationService } from '../../../../../modules/translation/webapp/core/TranslationService';
import { ContextService } from '../../../../../modules/base-components/webapp/core/ContextService';
import { ConfigItem } from '../../../model/ConfigItem';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { ActionFactory } from '../../../../../modules/base-components/webapp/core/ActionFactory';
import { Context } from '../../../../../model/Context';
import { EventService } from '../../../../base-components/webapp/core/EventService';
import { ImageViewerEvent } from '../../../../agent-portal/model/ImageViewerEvent';
import { ImageViewerEventData } from '../../../../agent-portal/model/ImageViewerEventData';

class Component {

    private state: ComponentState;
    private contextListenerId: string;

    public onCreate(): void {
        this.state = new ComponentState();
        this.contextListenerId = IdService.generateDateBasedId('config-item-graph-widget');
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {

        this.state.translations = await TranslationService.createTranslationObject([
            'Translatable#Large View'
        ]);

        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context
            ? await context.getWidgetConfiguration(this.state.instanceId)
            : undefined;

        context.registerListener(this.contextListenerId, {
            objectChanged: (id: string | number, object: ConfigItem, type: KIXObjectType) => {
                if (type === KIXObjectType.CONFIG_ITEM) {
                    this.initWidget(context, object);
                }
            },
            sidebarRightToggled: () => { return; },
            sidebarLeftToggled: () => { return; },
            objectListChanged: () => { return; },
            scrollInformationChanged: () => { return; },
            filteredObjectListChanged: () => { return; },
            additionalInformationChanged: () => { return; }
        });

        await this.initWidget(context, await context.getObject<ConfigItem>());
    }

    private async initWidget(context: Context, configItem?: ConfigItem): Promise<void> {
        this.state.loading = true;
        this.state.configItem = configItem;
        this.state.widgetTitle = `${this.state.widgetConfiguration.title}`;
        this.prepareActions();

        setTimeout(() => {
            this.state.loading = false;
        }, 100);
    }

    private async prepareActions(): Promise<void> {
        if (this.state.widgetConfiguration && this.state.configItem) {
            this.state.actions = await ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, [this.state.configItem]
            );
        }
    }

    public openImageDialog(): void {
        EventService.getInstance().publish(
            ImageViewerEvent.OPEN_VIEWER,
            new ImageViewerEventData([this.state.fakeGraphLarge])
        );
    }
}

module.exports = Component;
