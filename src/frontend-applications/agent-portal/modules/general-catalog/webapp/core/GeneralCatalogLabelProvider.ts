/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { LabelProvider } from '../../../../modules/base-components/webapp/core/LabelProvider';
import { GeneralCatalogItem } from '../../model/GeneralCatalogItem';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { GeneralCatalogItemProperty } from '../../model/GeneralCatalogItemProperty';
import { TranslationService } from '../../../../modules/translation/webapp/core/TranslationService';
import { KIXObjectProperty } from '../../../../model/kix/KIXObjectProperty';
import { ObjectIcon } from '../../../icon/model/ObjectIcon';

export class GeneralCatalogLabelProvider extends LabelProvider<GeneralCatalogItem> {

    public kixObjectType: KIXObjectType = KIXObjectType.GENERAL_CATALOG_ITEM;

    public async getPropertyText(
        property: string, short: boolean = false, translatable: boolean = true
    ): Promise<string> {
        let displayValue = property;
        switch (property) {
            case GeneralCatalogItemProperty.CLASS:
                displayValue = 'Translatable#Class';
                break;
            case GeneralCatalogItemProperty.NAME:
                displayValue = 'Translatable#Name';
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

    public isLabelProviderFor(object: GeneralCatalogItem): boolean {
        return object instanceof GeneralCatalogItem;
    }

    public async getDisplayText(
        generalCatalogItem: GeneralCatalogItem, property: string, defaultValue?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = generalCatalogItem[property];

        switch (property) {
            case KIXObjectProperty.VALID_ID:
                displayValue = await this.getPropertyValueDisplayText(
                    KIXObjectProperty.VALID_ID, generalCatalogItem.ValidID, translatable
                );
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

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        if (translatable) {
            return await TranslationService.translate(
                plural ? 'Translatable#General Catalog Items' : 'Translatable#General Catalog Item'
            );
        }
        return plural ? 'General Catalog Items' : 'General Catalog Item';
    }

    public async getObjectText(
        generalCatalog: GeneralCatalogItem, id?: boolean, title?: boolean, translatable: boolean = true
    ): Promise<string> {
        let text = generalCatalog.Name;

        if (translatable) {
            text = await TranslationService.translate(generalCatalog.Name);
        }

        return text;
    }

    public getObjectIcon(catlogItem?: GeneralCatalogItem): string | ObjectIcon {
        return new ObjectIcon(null, KIXObjectType.GENERAL_CATALOG_ITEM, catlogItem.ItemID);
    }
}
