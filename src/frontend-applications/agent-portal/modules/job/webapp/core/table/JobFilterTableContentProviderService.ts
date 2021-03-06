/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { Job } from '../../../model/Job';
import { LabelService } from '../../../../../modules/base-components/webapp/core/LabelService';
import { KIXObjectProperty } from '../../../../../model/kix/KIXObjectProperty';
import { ObjectIcon } from '../../../../icon/model/ObjectIcon';
import { DynamicFieldValue } from '../../../../dynamic-fields/model/DynamicFieldValue';
import { KIXObjectService } from '../../../../base-components/webapp/core/KIXObjectService';
import { ArticleProperty } from '../../../../ticket/model/ArticleProperty';
import { JobTypes } from '../../../model/JobTypes';
import { ExtendedJobFilterContentProvider } from './ExtendedJobFilterContentProvider';

export class JobFilterTableContentProviderService {

    private static INSTANCE: JobFilterTableContentProviderService;
    private extendedContentProvider: ExtendedJobFilterContentProvider[] = [];

    public static getInstance(): JobFilterTableContentProviderService {
        if (!JobFilterTableContentProviderService.INSTANCE) {
            JobFilterTableContentProviderService.INSTANCE = new JobFilterTableContentProviderService();
        }
        return JobFilterTableContentProviderService.INSTANCE;
    }

    private constructor() { }

    public addExtendedContentProvider(extentedProvider: ExtendedJobFilterContentProvider): void {
        this.extendedContentProvider.push(extentedProvider);
    }

    public async getValues(displayKey: string, criterion: any, job: Job, criteria: any[]):
        Promise<[string, any, Array<string | ObjectIcon>, string]> {
        let result: [string, any, Array<string | ObjectIcon>, string] = [displayKey, criterion.value, null, ''];

        const extendedContentProvider = this.extendedContentProvider.find((cp) => cp.jobType === job.Type);
        if (extendedContentProvider) {
            const preparedKey = await extendedContentProvider.getKey(
                displayKey, criterion, job, criteria
            );
            const preparedValues = await extendedContentProvider.getValues(
                displayKey, criterion, job, criteria
            );
            const preparedIcons = await extendedContentProvider.getIcons(
                displayKey, criterion, job, criteria
            );
            result = [
                preparedKey,
                preparedValues[0],
                preparedIcons,
                preparedValues[1]
            ];
        } else {
            result = await this.getDefaultDisplayValues(displayKey, criterion, job);
        }

        if (!result[3]) {
            result[3] = Array.isArray(result[1])
                ? result[1].join(', ')
                : '';
        }
        return result;
    }


    private async getDefaultDisplayValues(
        displayKey: string, criterion: any, job: Job
    ): Promise<[string, any, Array<string | ObjectIcon>, string]> {
        if (KIXObjectService.getDynamicFieldName(displayKey)) {
            const dfValues = await this.getDFValues(
                displayKey, criterion.Value, job.Type as any
            );
            displayKey = await LabelService.getInstance().getPropertyText(
                displayKey, KIXObjectType.TICKET
            );
            return [displayKey, dfValues[0], null, dfValues[1]];
        }

        const isArticleProperty = job.Type === JobTypes.TICKET ? this.isArticleProperty(displayKey) : false;
        const displayValuesAndIcons = await this.getValue(
            displayKey, criterion.Value,
            isArticleProperty ? KIXObjectType.ARTICLE : KIXObjectType.TICKET
        );
        displayKey = await LabelService.getInstance().getPropertyText(
            displayKey, isArticleProperty ? KIXObjectType.ARTICLE : KIXObjectType.TICKET
        );
        return [displayKey, displayValuesAndIcons[0], displayValuesAndIcons[1], null];
    }

    private async getValue(
        property: string, value: string | number | string[] | number[], objectType: KIXObjectType | string
    ): Promise<[string[], Array<string | ObjectIcon>]> {
        const displayValues: string[] = [];
        const displayIcons: Array<string | ObjectIcon> = [];
        if (Array.isArray(value)) {
            for (const v of value) {
                const string = await LabelService.getInstance().getPropertyValueDisplayText(objectType, property, v);
                if (string) {
                    displayValues.push(string);
                    const icons = await LabelService.getInstance().getIconsForType(objectType, null, property, v);
                    if (icons && !!icons.length) {
                        displayIcons.push(icons[0]);
                    } else {
                        displayIcons.push(null);
                    }
                }
            }
        } else {
            displayValues.push(
                await LabelService.getInstance().getPropertyValueDisplayText(
                    objectType, property, isNaN(Number(value)) ? value : Number(value)
                )
            );
            const icons = await LabelService.getInstance().getIconsForType(objectType, null, property, value);
            if (icons && !!icons.length) {
                displayIcons.push(icons[0]);
            } else {
                displayIcons.push(null);
            }
        }
        return [displayValues, displayIcons];
    }

    private async getDFValues(
        key: string, value: any, objectType: KIXObjectType
    ): Promise<[string[], string]> {
        const dfName = key.replace(new RegExp(`${KIXObjectProperty.DYNAMIC_FIELDS}?\.(.+)`), '$1');
        let displayValues: string[] = [];
        let displayString: string = '';
        if (dfName && value) {
            const preparedValue = await LabelService.getInstance().getDFDisplayValues(
                objectType,
                new DynamicFieldValue({
                    Name: dfName,
                    Value: Array.isArray(value) ? value : [value]
                } as DynamicFieldValue)
            );
            displayValues = preparedValue ? preparedValue[0] : Array.isArray(value) ? value : [value];
            displayString = preparedValue ? preparedValue[1] : '';
        }
        return [displayValues, displayString];
    }

    private isArticleProperty(property: string): boolean {
        const articleProperty = Object.keys(ArticleProperty).map((p) => ArticleProperty[p]);
        return property === 'ID' || articleProperty.some((p) => p === property);
    }
}
