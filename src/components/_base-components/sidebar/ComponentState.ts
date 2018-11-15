import { ConfiguredWidget, ContextType } from '@kix/core/dist/model';

export class ComponentState {

    public sidebars: ConfiguredWidget[] = [];
    public showIconBar: boolean = true;
    public rows: string[] = [];
    public context: string = "dashboard";
    public sidebarBarExpanded: boolean = false;
    public showSidebar: boolean = false;
    public contextType: ContextType = null;
    public loading: boolean = false;

}
