import {
    ObjectIcon, KIXObjectType, MailFilter, MailFilterProperty, User, DateTimeUtil,
    KIXObjectProperty, MailFilterMatch, MailFilterSet, ValidObject
} from '../../model';
import { TranslationService } from '../i18n/TranslationService';
import { KIXObjectService } from "../kix";
import { LabelProvider } from '../LabelProvider';

export class MailFilterLabelProvider extends LabelProvider<MailFilter> {

    public kixObjectType: KIXObjectType = KIXObjectType.MAIL_FILTER;

    public isLabelProviderForType(objectType: KIXObjectType): boolean {
        return objectType === this.kixObjectType;
    }

    public isLabelProviderFor(object: MailFilter): boolean {
        return object instanceof MailFilter;
    }

    public async getPropertyText(property: string, translatable: boolean = true): Promise<string> {
        let displayValue = property;
        switch (property) {
            case MailFilterProperty.NAME:
                displayValue = 'Translatable#Name';
                break;
            case MailFilterProperty.STOP_AFTER_MATCH:
                displayValue = 'Translatable#Stop after Match';
                break;
            case MailFilterProperty.MATCH:
                displayValue = 'Translatable#Filter Conditions';
                break;
            case MailFilterProperty.SET:
                displayValue = 'Translatable#Email Header';
                break;
            case KIXObjectProperty.COMMENT:
                displayValue = 'Translatable#Comment';
                break;
            case KIXObjectProperty.VALID_ID:
                displayValue = 'Translatable#Validity';
                break;
            case KIXObjectProperty.CREATE_BY:
                displayValue = 'Translatable#Created by';
                break;
            case KIXObjectProperty.CREATE_TIME:
                displayValue = 'Translatable#Created at';
                break;
            case KIXObjectProperty.CHANGE_BY:
                displayValue = 'Translatable#Changed by';
                break;
            case KIXObjectProperty.CHANGE_TIME:
                displayValue = 'Translatable#Changed at';
                break;
            case MailFilterProperty.ID:
                displayValue = 'Translatable#Id';
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
        mailFilter: MailFilter, property: string, value?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = mailFilter[property];

        switch (property) {
            case MailFilterProperty.ID:
                displayValue = mailFilter.Name;
                break;
            default:
                displayValue = await this.getPropertyValueDisplayText(property, displayValue);
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public async getPropertyValueDisplayText(
        property: string, value: string | number, translatable: boolean = true
    ): Promise<string> {
        let displayValue = value;
        switch (property) {
            case KIXObjectProperty.VALID_ID:
                const validObjects = await KIXObjectService.loadObjects<ValidObject>(KIXObjectType.VALID_OBJECT);
                const valid = validObjects.find((v) => v.ID === value);
                displayValue = valid ? valid.Name : value;
                break;
            case KIXObjectProperty.CREATE_BY:
            case KIXObjectProperty.CHANGE_BY:
                if (value) {
                    const users = await KIXObjectService.loadObjects<User>(
                        KIXObjectType.USER, [value], null, null, true
                    ).catch((error) => [] as User[]);
                    displayValue = users && !!users.length ? users[0].UserFullname : value;
                }
                break;
            case KIXObjectProperty.CREATE_TIME:
            case KIXObjectProperty.CHANGE_TIME:
                displayValue = await DateTimeUtil.getLocalDateTimeString(displayValue);
                break;
            case MailFilterProperty.STOP_AFTER_MATCH:
                displayValue = Boolean(value) ? 'Translatable#Yes' : 'Translatable#No';
                break;
            case MailFilterProperty.MATCH:
                if (Array.isArray(value)) {
                    displayValue = (value as MailFilterMatch[]).map(
                        (v) => `${v.Key} ${Boolean(v.Not) ? '!~' : '=~'} ${v.Value}`
                    ).join(', ');
                }
                break;
            case MailFilterProperty.SET:
                if (Array.isArray(value)) {
                    displayValue = (value as MailFilterSet[]).map(
                        (v) => `${v.Key} := ${v.Value}`
                    ).join(', ');
                }
                break;
            default:
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue ? displayValue.toString() : '';
    }

    public getDisplayTextClasses(object: MailFilter, property: string): string[] {
        return [];
    }

    public getObjectClasses(object: MailFilter): string[] {
        return [];
    }

    public async getObjectText(
        object: MailFilter, id?: boolean, title?: boolean, translatable?: boolean
    ): Promise<string> {
        return `${object.Name}`;
    }

    public getObjectAdditionalText(object: MailFilter, translatable: boolean = true): string {
        return '';
    }

    public getObjectIcon(object: MailFilter): string | ObjectIcon {
        return new ObjectIcon('MailFilter', object.ID);
    }

    public getObjectTooltip(object: MailFilter): string {
        return object.Name;
    }

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        if (translatable) {
            return await TranslationService.translate(
                plural ? 'Translatable#Email Filters' : 'Translatable#Email Filter'
            );
        }
        return plural ? 'Email Filters' : 'Email Filter';
    }


    public async getIcons(object: MailFilter, property: string): Promise<Array<string | ObjectIcon>> {
        const icons = [];
        switch (property) {
            case MailFilterProperty.STOP_AFTER_MATCH:
                if (Boolean(object.StopAfterMatch)) {
                    icons.push('kix-icon-check');
                }
                break;
            default:
        }
        return icons;
    }

}
