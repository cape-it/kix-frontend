import { IModuleFactoryExtension } from '@kix/core/dist/extensions';

export class CustomerModuleFactoryExtension implements IModuleFactoryExtension {

    public getTemplate(): string {
        const packageJson = require('../../../package.json');
        const version = packageJson.version;
        return '/@kix/frontend$' + version + '/dist/components/modules/customers/';
    }

    public getModuleId(): string {
        return "customers";
    }

    public getDefaultConfiguration(): any {
        const content = {};
        return content;
    }

}

module.exports = (data, host, options) => {
    return new CustomerModuleFactoryExtension();
};
