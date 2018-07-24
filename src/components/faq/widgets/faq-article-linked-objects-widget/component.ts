import { ComponentState } from './ComponentState';
import {
    ContextService, ActionFactory, KIXObjectServiceRegistry, StandardTableFactoryService,
    TableConfiguration, TableHeaderHeight, TableRowHeight, ObjectLinkDescriptionLabelLayer, TableColumn
} from '@kix/core/dist/browser';
import { KIXObjectType, Link, KIXObject, DataType } from '@kix/core/dist/model';
import { FAQArticle } from '@kix/core/dist/model/kix/faq';

class Component {

    private state: ComponentState;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;

        const faqs = await ContextService.getInstance().loadObjects<FAQArticle>(
            KIXObjectType.FAQ_ARTICLE, [context.objectId]
        );

        if (faqs && faqs.length) {
            this.state.faqArticle = faqs[0];

            this.setActions();
            this.setLinkedObjectsGroups();

            let totalCount = 0;
            this.state.linkedObjectGroups.forEach((log) => totalCount += log[1].getTableRows(true).length);
            this.state.widgetTitle = `${this.state.widgetConfiguration.title} (${totalCount})`;
        }

        this.state.loading = false;
    }

    private setActions(): void {
        if (this.state.widgetConfiguration && this.state.faqArticle) {
            this.state.actions = ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, false, [this.state.faqArticle]
            );
        }
    }

    private async setLinkedObjectsGroups(): Promise<void> {
        const linkedObjectTypes: Array<[string, KIXObjectType]> = this.state.widgetConfiguration.settings;
        const faqArticleId = this.state.faqArticle.ID.toString();

        for (const lot of linkedObjectTypes) {
            const objectLinks = this.state.faqArticle.Links.filter((link) => this.checkLink(link, lot[1]));
            const objectIds = objectLinks.map((ol) => ol.SourceKey === faqArticleId ? ol.TargetKey : ol.SourceKey);

            const service = KIXObjectServiceRegistry.getInstance().getServiceInstance(lot[1]);
            const objects = await service.loadObjects(lot[1], objectIds, null);

            const tableConfiguration = new TableConfiguration(
                null, null, null, null, false, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
            );

            const table = StandardTableFactoryService.getInstance().createStandardTable<KIXObject>(
                lot[1], tableConfiguration, null, null, true
            );

            table.setColumns([
                new TableColumn('LinkedAs', DataType.STRING, '', null, true, true, 100, true, false, null)
            ]);
            table.addAdditionalLayerOnTop(new ObjectLinkDescriptionLabelLayer());
            table.layerConfiguration.contentLayer.setPreloadedObjects(objects);
            table.loadRows();

            const title = `${lot[0]} (${objects.length})`;
            this.state.linkedObjectGroups.push([title, table]);
        }

    }

    private checkLink(link: Link, objectType: KIXObjectType): boolean {
        const faqArticleId = this.state.faqArticle.ID.toString();
        return (link.SourceObject === objectType && link.SourceKey !== faqArticleId) ||
            (link.TargetObject === objectType && link.TargetKey !== faqArticleId);
    }

}

module.exports = Component;
