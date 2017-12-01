import { KIXRouterStore } from '@kix/core/dist/browser/router/KIXRouterStore';
import { ClientStorageHandler } from '../../../../../core/dist/browser/ClientStorageHandler';
import { ComponentId } from '../../dialogs/ticket-creation/model/ComponentId';
import { KIXRouter } from '../../../../../core/dist/routes/KIXRouter';

export class RouterOutletComponent {

    private state: any;

    public onCreate(input: any): void {
        this.state = {
            componentId: null,
            template: null,
            routerId: null,
            data: null
        };
    }

    public onInput(input: any): void {
        this.state.routerId = input.id;
    }

    public onMount(): void {
        KIXRouterStore.getInstance().addStateListener(this.routerStateChanged.bind(this));
    }

    private routerStateChanged(): void {
        const tagLib = ClientStorageHandler.getTagLib();

        const componentId = KIXRouterStore.getInstance().getCurrentComponent(this.state.routerId);
        this.state.componentId = componentId;

        const data = KIXRouterStore.getInstance().getCurrentComponentData(this.state.routerId);
        this.state.data = data;

        const tag = tagLib.find((t) => t[0] === componentId);
        if (tag) {
            const template = require(tag[1]);
            this.state.template = template;
        } else {
            this.state.template = null;
        }
    }

}

module.exports = RouterOutletComponent;
