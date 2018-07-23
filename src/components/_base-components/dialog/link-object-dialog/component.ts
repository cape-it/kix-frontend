import {
    KIXObjectSearchService, DialogService, OverlayService,
    WidgetService, KIXObjectServiceRegistry, StandardTableFactoryService,
    TableConfiguration, TableRowHeight, TableHeaderHeight, TablePreventSelectionLayer, TableHighlightLayer,
    TableColumn, ObjectLinkDescriptionLabelLayer, StandardTable, ITableHighlightLayer, ITablePreventSelectionLayer
} from "@kix/core/dist/browser";
import { ContextService } from "@kix/core/dist/browser/context";
import { FormService } from "@kix/core/dist/browser/form";
import {
    FormContext, KIXObject, KIXObjectType, WidgetType, CreateLinkDescription, LinkTypeDescription,
    OverlayType, ComponentContent, TreeNode, DataType
} from "@kix/core/dist/model";
import { ComponentState } from './ComponentState';

class LinkTicketDialogComponent {

    private state: ComponentState;
    private linkTypeDescriptions: LinkTypeDescription[] = [];
    private objectLinkLayer: ObjectLinkDescriptionLabelLayer;
    private highlightLayer: ITableHighlightLayer;
    private preventSelectionLayer: ITablePreventSelectionLayer;
    private resultListenerId: string;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.linkDescriptions = input.linkDescriptions || [];
        this.state.objectType = input.objectType;
        this.resultListenerId = input.resultListenerId;
    }

    public onMount(): void {
        this.setLinkableObjects();
        this.setDefaultLinkableObject();

        WidgetService.getInstance().setWidgetType('link-object-dialog-form-widget', WidgetType.GROUP);
        this.setLinkTypes();
        this.prepareResultTable([]);

        this.highlightLayer.setHighlightedObjects([]);

        document.addEventListener('keydown', (event: any) => {
            if (event.key === 'Enter' && this.state.canSearch) {
                this.executeSearch();
            }
        });
    }

    private setLinkableObjects(): void {
        const objectData = ContextService.getInstance().getObjectData();
        if (objectData && objectData.linkTypes) {
            const service = KIXObjectServiceRegistry.getInstance().getServiceInstance(this.state.objectType);
            const linkObjectType = service.getLinkObjectName();
            objectData.linkTypes.forEach((lt) => {
                let linkableObject = null;

                if (lt.Source === linkObjectType) {
                    linkableObject = lt.Target;
                } else if (lt.Target === linkObjectType) {
                    linkableObject = lt.Source;
                }

                if (linkableObject && !this.state.linkableObjectNodes.some((lo) => lo.label === linkableObject)) {
                    const formId = FormService.getInstance().getFormIdByContext(FormContext.LINK, linkableObject);
                    if (formId) {
                        this.state.linkableObjectNodes.push(new TreeNode(formId, linkableObject));
                    }
                }
            });
            if (this.state.linkableObjectNodes.length) {
                (this as any).setStateDirty('linkableObjectNodes');
            }
        }
    }

    private setDefaultLinkableObject(): void {
        if (this.state.linkableObjectNodes.length) {
            const ticketNode = this.state.linkableObjectNodes.find((lo) => lo.label === KIXObjectType.TICKET);
            if (ticketNode) {
                this.state.currentLinkableObjectNode = ticketNode;
            } else {
                this.state.currentLinkableObjectNode = this.state.linkableObjectNodes[0];
            }

            const formInstance = FormService.getInstance().getFormInstance(
                this.state.currentLinkableObjectNode.id.toString()
            );
            formInstance.reset();

            formInstance.registerListener({
                formValueChanged: () => {
                    this.state.canSearch = formInstance.hasValues();
                },
                updateForm: () => { return; }
            });
        }
    }

    public linkableObjectChanged(nodes: TreeNode[]): void {
        this.state.currentLinkableObjectNode = nodes && nodes.length ? nodes[0] : null;
        this.state.selectedObjects = [];

        if (!this.state.currentLinkableObjectNode) {
            this.state.standardTable = null;
            this.state.resultCount = null;
        } else {
            this.prepareResultTable([]);
        }
        this.setLinkTypes();
    }

    private async executeSearch(): Promise<void> {
        if (this.state.currentLinkableObjectNode) {
            this.state.canSearch = false;
            this.state.standardTable = null;
            const objects = await KIXObjectSearchService.getInstance().executeSearch(
                this.state.currentLinkableObjectNode.id
            );

            this.prepareResultTable(objects);
            this.state.resultCount = objects.length > 0 ? objects.length : null;
            this.state.canSearch = true;
        }
    }

    private prepareResultTable(objects: KIXObject[]): void {
        const formInstance = FormService.getInstance().getFormInstance(this.state.currentLinkableObjectNode.id);
        const objectType = formInstance.getObjectType();

        const tableConfiguration = new TableConfiguration(
            null, 5, null, null, true, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
        );
        const table = StandardTableFactoryService.getInstance().createStandardTable(
            objectType, tableConfiguration, null, null, true
        );

        table.listenerConfiguration.selectionListener.addListener(
            this.objectSelectionChanged.bind(this)
        );

        this.highlightLayer = new TableHighlightLayer();
        table.addAdditionalLayerOnTop(this.highlightLayer);
        this.preventSelectionLayer = new TablePreventSelectionLayer();
        table.addAdditionalLayerOnTop(this.preventSelectionLayer);
        this.objectLinkLayer = new ObjectLinkDescriptionLabelLayer();
        table.addAdditionalLayerOnTop(this.objectLinkLayer);

        table.setColumns([
            new TableColumn('LinkedAs', DataType.STRING, '', null, true, true, 100, true, false, null)
        ]);

        this.setLinkedObjectsToTableLayer(table);

        table.layerConfiguration.contentLayer.setPreloadedObjects(objects);
        table.loadRows();

        this.state.standardTable = table;
    }

    private setLinkedObjectsToTableLayer(table: StandardTable = this.state.standardTable): void {
        this.objectLinkLayer.setLinkDescriptions(this.state.linkDescriptions);
        const linkedObjects = this.state.linkDescriptions.map((ld) => ld.linkableObject);
        this.preventSelectionLayer.setPreventSelectionFilter(linkedObjects);
    }

    private objectSelectionChanged(objects: KIXObject[]): void {
        this.state.selectedObjects = objects;
    }

    private canSubmit(): boolean {
        return this.state.selectedObjects.length > 0 && this.state.currentLinkTypeDescription !== null;
    }

    public submitClicked(): void {
        if (this.canSubmit()) {
            const newLinks = this.state.selectedObjects.map(
                (so) => new CreateLinkDescription(so, this.state.currentLinkTypeDescription)
            );
            this.state.linkDescriptions = [...this.state.linkDescriptions, ...newLinks];
            DialogService.getInstance().publishDialogResult(this.resultListenerId, this.state.linkDescriptions);
            this.showSuccessHint(newLinks.length);
            this.state.standardTable.listenerConfiguration.selectionListener.selectNone();
            this.highlightLayer.setHighlightedObjects(newLinks.map((ld) => ld.linkableObject));
            this.setLinkedObjectsToTableLayer();
            this.state.standardTable.loadRows();
        }
    }

    private showSuccessHint(count: number): void {
        this.state.successHint = `${count} Verknüpfung(en) erfolgreich zugeordnet `;
        const content = new ComponentContent('list-with-title', {
            title: 'Erfolgreich ausgeführt',
            list: [this.state.successHint],
            icon: 'kix-icon-check'
        });

        OverlayService.getInstance().openOverlay(OverlayType.TOAST, null, content, '');
    }

    private setLinkTypes(): void {
        this.linkTypeDescriptions = [];
        const objectData = ContextService.getInstance().getObjectData();
        if (objectData && objectData.linkTypes) {
            if (this.state.currentLinkableObjectNode) {
                const service = KIXObjectServiceRegistry.getInstance().getServiceInstance(this.state.objectType);
                const linkObjectType = service.getLinkObjectName();
                objectData.linkTypes.forEach((lt) => {
                    if (
                        (
                            lt.Source === linkObjectType &&
                            lt.Target === this.state.currentLinkableObjectNode.label
                        ) ||
                        (
                            lt.Target === linkObjectType &&
                            lt.Source === this.state.currentLinkableObjectNode.label
                        )
                    ) {
                        if (!this.state.linkTypeNodes.some((lo) => lo.label === lt.SourceName)) {
                            const id = this.linkTypeDescriptions.length;
                            this.linkTypeDescriptions.push(new LinkTypeDescription(lt, true));
                            const node = new TreeNode(id, lt.SourceName);
                            this.state.linkTypeNodes.push(node);
                        }
                        if (lt.Pointed !== 0 && !this.state.linkTypeNodes.some((lo) => lo.label === lt.TargetName)) {
                            const id = this.linkTypeDescriptions.length;
                            this.linkTypeDescriptions.push(new LinkTypeDescription(lt, false));
                            const node = new TreeNode(id, lt.TargetName);
                            this.state.linkTypeNodes.push(node);
                        }
                    }
                });
            } else {
                this.state.linkTypeNodes = [];
                this.state.currentLinkTypeDescription = null;
            }
            (this as any).setStateDirty('linkTypeNodes');
        }
    }

    public linkTypeChanged(nodes: TreeNode[]): void {
        this.state.currentLinkTypeNode = nodes && nodes.length ? nodes[0] : null;
        this.state.currentLinkTypeDescription = this.state.currentLinkTypeNode ?
            this.linkTypeDescriptions[this.state.currentLinkTypeNode.id] : null;
    }
}

module.exports = LinkTicketDialogComponent;
