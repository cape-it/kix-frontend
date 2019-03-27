import { OverlayType, ComponentContent, StringContent } from '../../../core/model';
import { ComponentState } from './ComponentState';
import { OverlayService, IdService, BrowserUtil } from '../../../core/browser';

class Component {

    private state: ComponentState;
    private listenerId: string = null;

    public onCreate(input: any): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.isHintOverlay = input.isHint || false;
        this.state.large = typeof input.large !== 'undefined' ? input.large : false;
        if (this.state.isHintOverlay) {
            this.state.content = new StringContent(input.content);
        } else {
            this.state.content = new ComponentContent(input.content, input.data);
        }

        this.state.instanceId = input.instanceId;
        this.state.title = input.title;
    }

    public onMount(): void {
        this.listenerId = IdService.generateDateBasedId('icon-');
        OverlayService.getInstance().registerOverlayListener(this.listenerId, this);
    }

    public onDestroy(): void {
        OverlayService.getInstance().unregisterOverlayListener(this.listenerId);
    }

    public showOverlay(event: any) {
        if (!this.state.show) {
            OverlayService.getInstance().openOverlay(
                this.state.isHintOverlay ? OverlayType.HINT : OverlayType.INFO,
                this.state.instanceId,
                this.state.content,
                this.state.title,
                false,
                [
                    event.target.getBoundingClientRect().left + BrowserUtil.getBrowserFontsize(),
                    event.target.getBoundingClientRect().top
                ],
                this.listenerId,
                this.state.large
            );
        }
    }

    public getOverlayClasses(): string {
        let classes = 'kix-icon-icircle';
        if (this.state.isHintOverlay) {
            classes = 'kix-icon-question hint-icon';
        }
        return classes;
    }

    public overlayOpened(): void {
        this.state.show = true;
    }

    public overlayClosed(): void {
        this.state.show = false;
    }

}

module.exports = Component;
