class ConfigurationOverlayComponent {

    public state: any;

    public onCreate(input: any): void {
        this.state = {
            showOverlay: false,
            widget: input.widget,
            configuration: null,
            template: null
        };
    }

    public onInput(input: any): void {
        this.state.showOverlay = input.showOverlay;
        this.state.configuration = input.configuration;
    }

    public onMount(): void {
        this.state.template = require(this.state.widget.configurationTemplate);
    }

    public saveClicked(): void {
        (this as any).emit('saveConfigurationOverlay', this.state.configuration);
    }

    public cancelClicked(): void {
        (this as any).emit('cancelConfigurationOverlay');
    }

}

module.exports = ConfigurationOverlayComponent;
