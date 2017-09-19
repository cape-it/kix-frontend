import { IWidgetFactoryExtension, IWidget } from '@kix/core';
import { StatisticWidget } from './StatisticsWidget';

export class StatisticsWidgetFactoryExtension implements IWidgetFactoryExtension {

    public createWidget(): IWidget {
        return new StatisticWidget(this.getWidgetId());
    }

    public getWidgetId(): string {
        return "statistics-widget";
    }

    public getDefaultConfiguration(): any {
        return {};
    }

}

module.exports = (data, host, options) => {
    return new StatisticsWidgetFactoryExtension();
};
