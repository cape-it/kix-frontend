import { Version, ObjectIcon, KIXObjectType } from '../../model';
import { TranslationService } from '../i18n/TranslationService';
import { LabelProvider } from '../LabelProvider';

export class ConfigItemVersionCompareLabelProvider extends LabelProvider<Version> {

    public kixObjectType: KIXObjectType = KIXObjectType.CONFIG_ITEM_VERSION_COMPARE;

    public async getPropertyValueDisplayText(
        property: string, value: string | number, translatable: boolean = true
    ): Promise<string> {
        let displayValue = value ? value.toString() : '';
        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }
        return displayValue;
    }

    public async getPropertyText(property: string, translatable: boolean = true): Promise<string> {
        let displayValue = property;
        switch (property) {
            case 'CONFIG_ITEM_ATTRIBUTE':
                displayValue = 'Translatable#Attributes';
                break;
            default:
                displayValue = property;
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public async getDisplayText(
        version: Version, property: string, value?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = property.toString();

        switch (property) {
            case 'CONFIG_ITEM_ATTRIBUTE':
                displayValue = displayValue;
                break;
            default:
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public isLabelProviderFor(object: Version): boolean {
        return object instanceof Version;
    }

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        let displayValue = 'Translatable#Config Item Version Compare';
        if (translatable) {
            displayValue = await TranslationService.translate(displayValue, []);
        }
        return displayValue;
    }
}
