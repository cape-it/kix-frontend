import { IMainMenuExtension } from '@kix/core';

export class CustomerMainMenuExtension implements IMainMenuExtension {

    public getLink(): string {
        return "/customer-dashboard";
    }

    public getIcon(): string {
        return "";
    }

    public getText(): string {
        return "Customer";
    }

    public getContextId(): string {
        return "customer-dashboard";
    }

}

module.exports = (data, host, options) => {
    return new CustomerMainMenuExtension();
};
