import { IMarkoDependencyExtension } from '@kix/core';

export class TicketListWidgetMarkoDependencyExtension implements IMarkoDependencyExtension {

    public getDependencies(): string[] {
        return [
            "widgets/ticket-list",
            "widgets/ticket-list/configuration"
        ];
    }

    public isExternal(): boolean {
        return false;
    }

}

module.exports = (data, host, options) => {
    return new TicketListWidgetMarkoDependencyExtension();
};
