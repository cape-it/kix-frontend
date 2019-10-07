/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import {
    ContextConfiguration, FormField, FormContext, KIXObjectType,
    Form, FormFieldValue, KIXObjectProperty, ObjectReferenceOptions,
    FormFieldOption, KIXObjectLoadingOptions, FilterCriteria, FilterType, FilterDataType
} from '../../core/model';
import { IConfigurationExtension } from '../../core/extensions';
import { FormGroup } from '../../core/model/components/form/FormGroup';
import { FAQArticleProperty, FAQCategoryProperty } from '../../core/model/kix/faq';
import { NewFAQArticleDialogContext } from '../../core/browser/faq';
import { ConfigurationService } from '../../core/services';
import { SearchOperator } from '../../core/browser';

export class Extension implements IConfigurationExtension {

    public getModuleId(): string {
        return NewFAQArticleDialogContext.CONTEXT_ID;
    }

    public async getDefaultConfiguration(): Promise<ContextConfiguration> {
        return new ContextConfiguration(this.getModuleId());
    }

    // tslint:disable:max-line-length
    public async createFormDefinitions(overwrite: boolean): Promise<void> {
        const configurationService = ConfigurationService.getInstance();

        const formId = 'new-faq-article-form';
        const existingForm = configurationService.getConfiguration(formId);
        if (!existingForm || overwrite) {
            const fields: FormField[] = [];
            fields.push(new FormField('Translatable#Title', FAQArticleProperty.TITLE, null, true, 'Translatable#Helptext_FAQ_ArticleCreate_Title'));
            fields.push(new FormField(
                'Translatable#Category', FAQArticleProperty.CATEGORY_ID, 'object-reference-input', true, 'Translatable#Helptext_FAQ_ArticleCreate_Category',
                [
                    new FormFieldOption(ObjectReferenceOptions.OBJECT, KIXObjectType.FAQ_CATEGORY),
                    new FormFieldOption(ObjectReferenceOptions.AS_STRUCTURE, true),
                    new FormFieldOption(ObjectReferenceOptions.LOADINGOPTIONS,
                        new KIXObjectLoadingOptions(
                            [
                                new FilterCriteria(
                                    FAQCategoryProperty.PARENT_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                                    FilterType.AND, null
                                )
                            ],
                            null, null,
                            [FAQCategoryProperty.SUB_CATEGORIES],
                            [FAQCategoryProperty.SUB_CATEGORIES]
                        )
                    )
                ]
            ));
            fields.push(new FormField(
                'Translatable#Language', FAQArticleProperty.LANGUAGE, 'language-input', true, 'Translatable#Helptext_FAQ_ArticleCreate_Language',
                null, new FormFieldValue('de')
            ));
            fields.push(new FormField('Translatable#Tags', FAQArticleProperty.KEYWORDS, null, false, 'Translatable#Helptext_FAQ_ArticleCreate_Tags'));
            fields.push(new FormField('Translatable#Attachments', FAQArticleProperty.ATTACHMENTS, 'attachment-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Attachments'));
            fields.push(new FormField(
                'Link FAQ with', FAQArticleProperty.LINK, 'link-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Links')
            );
            fields.push(new FormField('Translatable#Symptom', FAQArticleProperty.FIELD_1, 'rich-text-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Symptom'));
            fields.push(new FormField('Translatable#Cause', FAQArticleProperty.FIELD_2, 'rich-text-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Cause'));
            fields.push(new FormField('Translatable#Solution', FAQArticleProperty.FIELD_3, 'rich-text-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Solution'));
            fields.push(new FormField('Translatable#Comment', FAQArticleProperty.FIELD_6, 'rich-text-input', false, 'Translatable#Helptext_FAQ_ArticleCreate_Comment'));
            fields.push(
                new FormField(
                    'Translatable#Validity', KIXObjectProperty.VALID_ID,
                    'object-reference-input', true, 'Translatable#Helptext_FAQ_ArticleCreate_Valid', [
                        new FormFieldOption(ObjectReferenceOptions.OBJECT, KIXObjectType.VALID_OBJECT)
                    ], new FormFieldValue(1)
                )
            );

            const group = new FormGroup('Translatable#FAQ Data', fields);

            const form = new Form(formId, 'Translatable#New FAQ', [group], KIXObjectType.FAQ_ARTICLE);
            await configurationService.saveConfiguration(form.id, form);
        }
        configurationService.registerForm([FormContext.NEW], KIXObjectType.FAQ_ARTICLE, formId);
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
