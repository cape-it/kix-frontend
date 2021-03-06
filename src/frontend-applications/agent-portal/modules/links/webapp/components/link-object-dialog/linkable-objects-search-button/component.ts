/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { TranslationService } from '../../../../../../modules/translation/webapp/core/TranslationService';
import { IEventSubscriber } from '../../../../../base-components/webapp/core/IEventSubscriber';
import { EventService } from '../../../../../base-components/webapp/core/EventService';
import { FormEvent } from '../../../../../base-components/webapp/core/FormEvent';
import { FormValuesChangedEventData } from '../../../../../base-components/webapp/core/FormValuesChangedEventData';

class Component {

    private state: ComponentState;
    private formSubscriber: IEventSubscriber;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        this.state.translations = await TranslationService.createTranslationObject(['Translatable#Start search']);
        this.formSubscriber = {
            eventSubscriberId: 'LinkableObjectSearchButton',
            eventPublished: (data: FormValuesChangedEventData, eventId: string) => {
                this.state.canSearch = data.formInstance.hasValues();
            }
        };
        EventService.getInstance().subscribe(FormEvent.VALUES_CHANGED, this.formSubscriber);
    }

    public onDestroy(): void {
        EventService.getInstance().unsubscribe(FormEvent.VALUES_CHANGED, this.formSubscriber);
    }

    public executeSearch(): void {
        if (this.state.canSearch) {
            (this as any).emit('executeSearch');
        }
    }
}

module.exports = Component;
