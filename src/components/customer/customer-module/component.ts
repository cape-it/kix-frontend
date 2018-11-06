import { ComponentState } from "./ComponentState";
import { ContextService } from "@kix/core/dist/browser";
import { CustomerContext } from "@kix/core/dist/browser/customer";
import { ConfiguredWidget } from "@kix/core/dist/model";
import { ComponentsService } from "@kix/core/dist/browser/components";

class Component {

    public state: ComponentState;

    public onCreate(input: any): void {
        this.state = new ComponentState();
    }

    public async onMount(): Promise<void> {
        const context = (await ContextService.getInstance().getContext(CustomerContext.CONTEXT_ID) as CustomerContext);
        this.state.contentWidgets = context.getContent();
    }

    public getTemplate(widget: ConfiguredWidget): any {
        return ComponentsService.getInstance().getComponentTemplate(widget.configuration.widgetId);
    }
}

module.exports = Component;
