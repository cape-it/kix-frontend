/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { RefreshToastSettings } from '../../../../../../modules/base-components/webapp/core/RefreshToastSettings';
import { ContextHistory } from '../../../../../../modules/base-components/webapp/core/ContextHistory';
import { ApplicationEvent } from '../../../../../../modules/base-components/webapp/core/ApplicationEvent';
import { EventService } from '../../../../../../modules/base-components/webapp/core/EventService';

class Component {

    private state: ComponentState;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: RefreshToastSettings) {
        this.state.message = input.message;
    }

    public refreshClicked(event: any): void {
        event.stopPropagation();
        event.preventDefault();
        ContextHistory.getInstance().removeBrowserListener();
        location.reload();
    }

    public close(): void {
        EventService.getInstance().publish(ApplicationEvent.CLOSE_OVERLAY);
    }

}

module.exports = Component;
