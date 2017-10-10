import { IWidget, WidgetType } from '@kix/core';

export class TicketInfoSidebar implements IWidget {

    public id: string;
    public instanceId: string = Date.now().toString();

    public type: WidgetType = 'sidebar';
    public icon: string = 'dummy';

    public constructor(id: string) {
        this.id = id;
    }
}
