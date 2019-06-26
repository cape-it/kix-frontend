import {
    KIXObjectType, KIXObjectLoadingOptions, FilterCriteria, FilterType, FilterDataType
} from "../../../model";
import { Context } from '../../../model/components/context/Context';
import { FAQCategory, FAQArticleProperty } from "../../../model/kix/faq";
import { EventService } from "../../event";
import { KIXObjectService } from "../../kix";
import { SearchOperator } from "../../SearchOperator";
import { ApplicationEvent } from "../../application";

export class FAQContext extends Context {

    public static CONTEXT_ID: string = 'faq';

    public faqCategory: FAQCategory;

    public getIcon(): string {
        return 'kix-icon-faq';
    }

    public async getDisplayText(): Promise<string> {
        return 'FAQ Dashboard';
    }

    public async setFAQCategory(faqCategory: FAQCategory): Promise<void> {
        this.faqCategory = faqCategory;
        await this.loadFAQArticles();
        this.listeners.forEach(
            (l) => l.objectChanged(
                this.faqCategory ? this.faqCategory.ID : null,
                this.faqCategory,
                KIXObjectType.FAQ_CATEGORY)
        );
    }

    private async loadFAQArticles(): Promise<void> {
        const loadingOptions = new KIXObjectLoadingOptions(null, null, 1000, ['Votes'], ['Votes']);
        if (this.faqCategory) {
            loadingOptions.filter = [new FilterCriteria(
                FAQArticleProperty.CATEGORY_ID, SearchOperator.EQUALS, FilterDataType.NUMERIC,
                FilterType.AND, this.faqCategory.ID
            )];
        }

        const timeout = window.setTimeout(() => {
            EventService.getInstance().publish(ApplicationEvent.APP_LOADING, {
                loading: true, hint: `Translatable#Load FAQ Articles ...`
            });
        }, 500);


        const faqArticles = await KIXObjectService.loadObjects(
            KIXObjectType.FAQ_ARTICLE, null, loadingOptions, null, false
        ).catch((error) => []);
        window.clearTimeout(timeout);
        this.setObjectList(faqArticles);

        EventService.getInstance().publish(ApplicationEvent.APP_LOADING, { loading: false });
    }

    public reset(): void {
        super.reset();
        this.faqCategory = null;
    }

}
