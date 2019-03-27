import { FAQDetailsContextConfiguration } from "./FAQDetailsContextConfiguration";
import {
    Context, KIXObjectType, ConfiguredWidget, WidgetConfiguration,
    WidgetType, BreadcrumbInformation, KIXObject, KIXObjectLoadingOptions
} from "../../../model";
import { FAQArticle } from "../../../model/kix/faq";
import { FAQContext } from "./FAQContext";
import { KIXObjectService } from "../../kix";
import { EventService } from "../../event";
import { LabelService } from "../../LabelService";
import { ApplicationEvent } from "../../application";

export class FAQDetailsContext extends Context<FAQDetailsContextConfiguration> {

    public static CONTEXT_ID = 'faq-details';

    public getIcon(): string {
        return 'kix-icon-faq';
    }

    public async getDisplayText(short?: boolean): Promise<string> {
        return await LabelService.getInstance().getText(await this.getObject<FAQArticle>(), true, !short);
    }

    public getLanes(show: boolean = false): ConfiguredWidget[] {
        let lanes = this.configuration.laneWidgets;

        if (show) {
            lanes = lanes.filter(
                (l) => this.configuration.lanes.findIndex((lid) => l.instanceId === lid) !== -1
            );
        }

        return lanes;
    }

    public getLaneTabs(show: boolean = false): ConfiguredWidget[] {
        let laneTabs = this.configuration.laneTabWidgets;

        if (show) {
            laneTabs = laneTabs.filter(
                (lt) => this.configuration.laneTabs.findIndex((ltId) => lt.instanceId === ltId) !== -1
            );
        }

        return laneTabs;
    }

    public getContent(show: boolean = false): ConfiguredWidget[] {
        let content = this.configuration.contentWidgets;

        if (show && content) {
            content = content.filter(
                (l) => this.configuration.content.findIndex((cid) => l.instanceId === cid) !== -1
            );
        }

        return content;
    }

    protected getSpecificWidgetConfiguration<WS = any>(instanceId: string): WidgetConfiguration<WS> {
        let configuration: WidgetConfiguration<WS>;

        const laneWidget = this.configuration.laneWidgets.find((lw) => lw.instanceId === instanceId);
        configuration = laneWidget ? laneWidget.configuration : undefined;

        if (!configuration) {
            const laneTabWidget = this.configuration.laneTabWidgets.find((ltw) => ltw.instanceId === instanceId);
            configuration = laneTabWidget ? laneTabWidget.configuration : undefined;
        }

        if (!configuration) {
            const contentWidget = this.configuration.contentWidgets.find((cw) => cw.instanceId === instanceId);
            configuration = contentWidget ? contentWidget.configuration : undefined;
        }

        return configuration;
    }

    protected getSpecificWidgetType(instanceId: string): WidgetType {
        let widgetType: WidgetType;

        const laneWidget = this.configuration.laneWidgets.find((lw) => lw.instanceId === instanceId);
        widgetType = laneWidget ? WidgetType.LANE : undefined;

        if (!widgetType) {
            const laneTabWidget = this.configuration.laneTabWidgets.find((ltw) => ltw.instanceId === instanceId);
            widgetType = laneTabWidget ? WidgetType.LANE_TAB : undefined;
        }

        return widgetType;
    }

    public async getBreadcrumbInformation(): Promise<BreadcrumbInformation> {
        const object = await this.getObject<FAQArticle>();
        const text = await LabelService.getInstance().getText(object);
        return new BreadcrumbInformation(this.getIcon(), [FAQContext.CONTEXT_ID], text);
    }

    public async getObject<O extends KIXObject>(
        objectType: KIXObjectType = KIXObjectType.FAQ_ARTICLE, reload: boolean = false
    ): Promise<O> {
        const object = await this.loadFAQArticle() as any;

        if (reload) {
            this.listeners.forEach(
                (l) => l.objectChanged(Number(this.objectId), object, KIXObjectType.FAQ_ARTICLE)
            );
        }

        return object;
    }

    private async loadFAQArticle(): Promise<FAQArticle> {
        EventService.getInstance().publish(
            ApplicationEvent.APP_LOADING, { loading: true, hint: 'Translatable#Load FAQ Article ...' }
        );

        const loadingOptions = new KIXObjectLoadingOptions(
            null, null, null, null, null,
            ['Attachments', 'Votes', 'Links', 'History'],
            ['Links', 'Votes']
        );

        const faqArticleId = Number(this.objectId);
        const faqArticles = await KIXObjectService.loadObjects<FAQArticle>(
            KIXObjectType.FAQ_ARTICLE, [faqArticleId], loadingOptions, null, true
        ).catch((error) => {
            console.error(error);
            return null;
        });

        let faqArticle: FAQArticle;
        if (faqArticles && faqArticles.length) {
            faqArticle = faqArticles[0];
        }

        EventService.getInstance().publish(ApplicationEvent.APP_LOADING, { loading: false });
        return faqArticle;
    }
}
