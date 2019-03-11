import { ILabelProvider } from '..';
import { TicketHistory, DateTimeUtil, ObjectIcon, KIXObjectType, TicketHistoryProperty } from '../../model';
import { TranslationService } from '../i18n/TranslationService';
import { ObjectDataService } from '../ObjectDataService';

export class TicketHistoryLabelProvider implements ILabelProvider<TicketHistory> {

    public kixObjectType: KIXObjectType = KIXObjectType.TICKET_HISTORY;

    public async getPropertyValueDisplayText(property: string, value: string | number): Promise<string> {
        return value.toString();
    }

    public async getPropertyText(property: string, translatable: boolean = true): Promise<string> {
        let displayValue = property;
        switch (property) {
            case TicketHistoryProperty.HISTORY_TYPE:
                displayValue = 'Translatable#Action';
                break;
            case TicketHistoryProperty.NAME:
                displayValue = 'Translatable#Comment';
                break;
            case TicketHistoryProperty.ARTICLE_ID:
                displayValue = 'Translatable#to Article';
                break;
            case TicketHistoryProperty.CREATE_BY:
                displayValue = 'Translatable#User';
                break;
            case TicketHistoryProperty.CREATE_TIME:
                displayValue = 'Translatable#Created at';
                break;
            default:
                displayValue = property;
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public async getPropertyIcon(property: string): Promise<string | ObjectIcon> {
        return;
    }

    public async getDisplayText(
        historyEntry: TicketHistory, property: string, value?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = property.toString();

        const objectData = ObjectDataService.getInstance().getObjectData();

        switch (property) {
            case TicketHistoryProperty.ARTICLE_ID:
                displayValue = historyEntry[property] === 0 ?
                    ''
                    : await TranslationService.translate('Translatable#to Article');
                break;
            case TicketHistoryProperty.CREATE_BY:
                const user = objectData.users.find((u) => u.UserID === historyEntry[property]);
                if (user) {
                    displayValue = user.UserFullname;
                }
                break;
            case TicketHistoryProperty.CREATE_TIME:
                displayValue = DateTimeUtil.getLocalDateTimeString(historyEntry[property]);
                break;
            default:
                displayValue = historyEntry[property];
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public getDisplayTextClasses(object: TicketHistory, property: string): string[] {
        return [];
    }

    public getObjectClasses(object: TicketHistory): string[] {
        return [];
    }

    public isLabelProviderFor(object: TicketHistory): boolean {
        return object instanceof TicketHistory;
    }

    public async getObjectText(object: TicketHistory): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public getObjectAdditionalText(object: TicketHistory): string {
        throw new Error('Method not implemented.');
    }

    public getObjectIcon(object: TicketHistory): string | ObjectIcon {
        throw new Error('Method not implemented.');
    }

    public getObjectTooltip(object: TicketHistory): string {
        throw new Error('Method not implemented.');
    }

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        let displayValue = 'Translatable#Ticket History';
        if (translatable) {
            displayValue = await TranslationService.translate(displayValue);
        }

        return displayValue;
    }

    public async getIcons(object: TicketHistory, property: string): Promise<Array<string | ObjectIcon>> {
        const icons = [];
        if (property === TicketHistoryProperty.ARTICLE_ID && object.ArticleID) {
            icons.push('kix-icon-open-right');
        }
        return icons;
    }

}
