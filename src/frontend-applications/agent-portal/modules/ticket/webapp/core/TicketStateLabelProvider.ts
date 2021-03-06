/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { LabelProvider } from '../../../../modules/base-components/webapp/core/LabelProvider';
import { TicketState } from '../../model/TicketState';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { TicketStateProperty } from '../../model/TicketStateProperty';
import { TranslationService } from '../../../../modules/translation/webapp/core/TranslationService';
import { ObjectIcon } from '../../../icon/model/ObjectIcon';

export class TicketStateLabelProvider extends LabelProvider<TicketState> {

    public kixObjectType: KIXObjectType = KIXObjectType.TICKET_STATE;

    public isLabelProviderFor(ticketState: TicketState): boolean {
        return ticketState instanceof TicketState;
    }

    public async getPropertyText(property: string, short?: boolean, translatable: boolean = true): Promise<string> {
        let displayValue = property;
        switch (property) {
            case TicketStateProperty.NAME:
                displayValue = 'Translatable#Name';
                break;
            case TicketStateProperty.TYPE_NAME:
            case TicketStateProperty.TYPE_ID:
                displayValue = 'Translatable#State Type';
                break;
            case TicketStateProperty.ID:
                displayValue = 'Translatable#Icon';
                break;
            default:
                displayValue = await super.getPropertyText(property, short, translatable);
        }

        if (displayValue) {
            displayValue = await TranslationService.translate(
                displayValue.toString(), undefined, undefined, !translatable
            );
        }

        return displayValue;
    }

    public async getDisplayText(
        ticketState: TicketState, property: string, value?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = ticketState[property];

        switch (property) {
            case TicketStateProperty.TYPE_ID:
                displayValue = ticketState.TypeName;
                break;
            case TicketStateProperty.ID:
            case 'ICON':
                displayValue = ticketState.Name;
                break;
            default:
                displayValue = await this.getPropertyValueDisplayText(property, displayValue, translatable);
        }

        if (displayValue) {
            displayValue = await TranslationService.translate(
                displayValue.toString(), undefined, undefined, !translatable
            );
        }

        return displayValue ? displayValue.toString() : '';
    }

    public async getObjectText(
        ticketState: TicketState, id?: boolean, title?: boolean, translatable: boolean = true): Promise<string> {
        return translatable ? await TranslationService.translate(ticketState.Name) : ticketState.Name;
    }

    public getObjectIcon(ticketState?: TicketState): string | ObjectIcon {
        return new ObjectIcon(null, 'TicketState', ticketState.ID);
    }

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        if (translatable) {
            return await TranslationService.translate(
                plural ? 'Translatable#States' : 'Translatable#State'
            );
        }
        return plural ? 'States' : 'State';
    }

    public async getObjectTooltip(ticketState: TicketState, translatable: boolean = true): Promise<string> {
        if (translatable) {
            return await TranslationService.translate(ticketState.Name);
        }
        return ticketState.Name;
    }

    public async getIcons(
        ticketState: TicketState, property: string, value?: string | number
    ): Promise<Array<string | ObjectIcon>> {
        if (property === TicketStateProperty.ID || property === 'ICON') {
            return [new ObjectIcon(null, 'TicketState', ticketState.ID)];
        }
        return null;
    }

}
