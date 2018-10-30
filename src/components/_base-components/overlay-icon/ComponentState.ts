import { OverlayWidgetData, ComponentContent, StringContent } from '@kix/core/dist/model';

export class ComponentState {

    public constructor(
        public show: boolean = false,
        public isHintOverlay: boolean = false,
        public content: StringContent<any> | ComponentContent<any> = null,
        public instanceId: string = null,
        public title: string = null,
        public large: boolean = true
    ) { }

}
