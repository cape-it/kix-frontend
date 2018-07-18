import {
    ContextConfiguration, FormField, FormContext, KIXObjectType, Form, FormFieldValue
} from "@kix/core/dist/model";
import { IModuleFactoryExtension } from "@kix/core/dist/extensions";
import { NewContactDialogContextConfiguration, NewContactDialogContext } from "@kix/core/dist/browser/contact";
import { ServiceContainer } from "@kix/core/dist/common";
import { IConfigurationService } from "@kix/core/dist/services";
import { FormGroup } from "@kix/core/dist/model/components/form/FormGroup";
import { FAQArticleProperty } from "@kix/core/dist/model/kix/faq";
import { NewFAQArticleDialogContext } from "@kix/core/dist/browser/faq";

export class Extension implements IModuleFactoryExtension {

    public getModuleId(): string {
        return NewFAQArticleDialogContext.CONTEXT_ID;
    }

    public getDefaultConfiguration(): ContextConfiguration {
        return new NewContactDialogContextConfiguration();
    }

    public async createFormDefinitions(): Promise<void> {
        const configurationService =
            ServiceContainer.getInstance().getClass<IConfigurationService>("IConfigurationService");

        const formId = 'new-faq-article-form';
        const existingForm = configurationService.getModuleConfiguration(formId, null);
        if (!existingForm) {
            const fields: FormField[] = [];
            fields.push(new FormField("Titel", FAQArticleProperty.TITLE, true, "Titel"));
            fields.push(new FormField("Kategorie", FAQArticleProperty.CATEGORY_ID, false, "Kategorie"));
            fields.push(new FormField(
                "Sprache", FAQArticleProperty.LANGUAGE, true, "Sprache", null, new FormFieldValue('de')
            ));
            fields.push(new FormField("Keywords", FAQArticleProperty.KEYWORDS, false, "Keywords"));
            fields.push(new FormField("Sichtbarkeit", FAQArticleProperty.VISIBILITY, true, "Sichtbarkeit"));
            fields.push(new FormField("Anlagen", FAQArticleProperty.ATTACHMENTS, false, "Anlagen"));
            fields.push(new FormField("FAQ verknüpfen", FAQArticleProperty.LINK, false, "FAQ verknüpfen"));
            fields.push(new FormField("Symptom", FAQArticleProperty.FIELD_1, false, "Symptom"));
            fields.push(new FormField("Ursache", FAQArticleProperty.FIELD_2, false, "Ursache"));
            fields.push(new FormField("Lösung", FAQArticleProperty.FIELD_3, false, "Lösung"));
            fields.push(new FormField("Gültigkeit", FAQArticleProperty.VALID_ID, true, "Gültigkeit"));

            const group = new FormGroup('FAQ Daten', fields);

            const form = new Form(formId, 'Neue FAQ', [group], KIXObjectType.FAQ_ARTICLE);
            await configurationService.saveModuleConfiguration(form.id, null, form);
        }
        configurationService.registerForm([FormContext.NEW], KIXObjectType.FAQ_ARTICLE, formId);
    }

}

module.exports = (data, host, options) => {
    return new Extension();
};
