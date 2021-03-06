/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { AbstractMarkoComponent } from '../../../../../../modules/base-components/webapp/core/AbstractMarkoComponent';
import { ConfirmOverlayContent } from '../../../../../../modules/base-components/webapp/core/ConfirmOverlayContent';
import { AgentService } from '../../../../../user/webapp/core/AgentService';

class OverlayComponent extends AbstractMarkoComponent<ComponentState> {

    private confirmCallback: () => void = null;
    private cancelCallback: () => void = null;
    private buttonLabels: [string, string];

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: ConfirmOverlayContent): void {
        this.confirmCallback = input.confirmCallback;
        this.cancelCallback = input.cancelCallback;
        this.update(input);
    }

    private async update(input: any): Promise<void> {
        this.buttonLabels = Array.isArray(input.buttonLabels) ? input.buttonLabels : null;
        this.state.hasButtons = Array.isArray(this.buttonLabels);
        this.state.text = input.text;
        if (input.decision) {
            this.state.decision = input.decision;

            const preference = await AgentService.getInstance().getUserPreference(input.decision[0]);
            this.state.decisionChecked = preference && Boolean(Number(preference.Value));
        }

        let button = (this as any).getEl('confirm-cancel-button');
        if (input.focusConfirm) {
            button = (this as any).getEl('confirm-submit-button');
        }
        if (button) {
            button.focus();
        }
    }

    public closeOverlay(confirm: boolean = false): void {
        (this as any).emit('closeOverlay');
        if (confirm) {
            if (this.confirmCallback && typeof this.confirmCallback === 'function') {
                this.confirmCallback();
            }
        } else {
            if (this.cancelCallback && typeof this.cancelCallback === 'function') {
                this.cancelCallback();
            }
        }
    }

    public getButtonLabel(confirm: boolean = false): string {
        if (this.buttonLabels) {
            if (confirm) {
                return this.buttonLabels[0] || 'Yes';
            } else {
                return this.buttonLabels[1] || 'No';
            }
        }
    }

    public toggleDecision(event: any): void {
        this.state.decisionChecked = !this.state.decisionChecked;
        AgentService.getInstance().setPreferences([[this.state.decision[0], this.state.decisionChecked]]);
    }
}

module.exports = OverlayComponent;
