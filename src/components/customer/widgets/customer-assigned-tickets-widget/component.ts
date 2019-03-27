import { ComponentState } from "./ComponentState";
import {
    ContextService, ActionFactory, TableFactoryService, SearchOperator, KIXObjectService,
    TableEvent, ITable, TableEventData
} from "../../../../core/browser";
import {
    WidgetConfiguration, Customer, KIXObjectType, FilterCriteria, TicketProperty, FilterDataType,
    FilterType, StateType, TicketState, DateTimeUtil
} from "../../../../core/model";
import { IEventSubscriber, EventService } from "../../../../core/browser/event";

class Component {

    private state: ComponentState;

    private tableEscalatedTicketsSubscriber: IEventSubscriber;
    private tableReminderTicketsSubscriber: IEventSubscriber;
    private tableNewTicketsSubscriber: IEventSubscriber;
    private tableOpenTicketsSubscriber: IEventSubscriber;
    private tablePendingTicketsSubscriber: IEventSubscriber;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context
            ? context.getWidgetConfiguration(this.state.instanceId)
            : undefined;

        this.state.openTicketsConfig = context
            ? context.getWidgetConfiguration('customer-open-tickets-group')
            : undefined;

        this.state.escalatedTicketsConfig = context
            ? context.getWidgetConfiguration('customer-escalated-tickets-group')
            : undefined;

        this.state.reminderTicketsConfig = context
            ? context.getWidgetConfiguration('customer-reminder-tickets-group')
            : undefined;

        this.state.newTicketsConfig = context
            ? context.getWidgetConfiguration('customer-new-tickets-group')
            : undefined;

        this.state.pendingTicketsConfig = context
            ? context.getWidgetConfiguration('customer-pending-tickets-group')
            : undefined;

        context.registerListener('customer-assigned-tickets-component', {
            explorerBarToggled: () => { return; },
            filteredObjectListChanged: () => { return; },
            objectListChanged: () => { return; },
            sidebarToggled: () => { return; },
            scrollInformationChanged: () => { return; },
            objectChanged: (customerId: string, customer: Customer, type: KIXObjectType) => {
                if (type === KIXObjectType.CUSTOMER) {
                    this.initWidget(customer);
                }
            }
        });

        this.initWidget(await context.getObject<Customer>());

        this.state.widgetConfiguration = context ? context.getWidgetConfiguration(this.state.instanceId) : undefined;
    }

    public onDestroy(): void {
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableEscalatedTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableReminderTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableNewTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableOpenTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tablePendingTicketsSubscriber);
    }

    private async initWidget(customer?: Customer): Promise<void> {
        this.state.customer = customer;
        this.setActions();
        await this.createTables();
    }

    private setActions(): void {
        if (this.state.widgetConfiguration && this.state.customer) {
            this.state.actions = ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, [this.state.customer]
            );
        }
    }

    private async createTables(): Promise<void> {
        if (this.state.customer) {
            await this.configureEscalatedTicketsTable();
            await this.configureReminderTicketsTable();
            await this.configureNewTicketsTable();
            await this.configureOpenTicketsTable();
            await this.configurePendingTicketsTable();
        }
    }

    private async configureEscalatedTicketsTable(): Promise<void> {
        if (this.state.escalatedTicketsConfig) {
            const filter = [
                new FilterCriteria(
                    TicketProperty.CUSTOMER_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.customer.CustomerID
                ),
                new FilterCriteria(
                    TicketProperty.ESCALATION_TIME, SearchOperator.LESS_THAN, FilterDataType.NUMERIC, FilterType.AND, 0
                )
            ];

            this.state.escalatedTicketsConfig.settings.filter = filter;

            this.tableEscalatedTicketsSubscriber = {
                eventSubscriberId: 'customer-escalated-tickets-table',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.escalatedTicketsTable.getTableId()
                    ) {
                        this.state.escalatedTicketsCount = this.state.escalatedTicketsTable.getRows().length;
                        this.state.escalatedTicketsFilterCount = this.state.escalatedTicketsTable.isFiltered()
                            ? this.state.escalatedTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableEscalatedTicketsSubscriber);

            const table = TableFactoryService.getInstance().createTable(
                'customer-assigned-tickets-escalated', KIXObjectType.TICKET,
                this.state.escalatedTicketsConfig.settings, null, null, true
            );

            await table.initialize();

            if (table.getRows(true).length === 0) {
                this.closeGroup('customer-escalated-tickets-group');
            }

            this.state.escalatedTicketsTable = table;
        }
    }

    private async configureReminderTicketsTable(): Promise<void> {
        if (this.state.reminderTicketsConfig) {
            const filter = [
                new FilterCriteria(
                    TicketProperty.CUSTOMER_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.customer.CustomerID
                ),
                new FilterCriteria(
                    TicketProperty.PENDING_TIME, SearchOperator.LESS_THAN, FilterDataType.DATETIME, FilterType.AND,
                    DateTimeUtil.getKIXDateTimeString(new Date())
                )
            ];

            this.state.reminderTicketsConfig.settings.filter = filter;

            this.tableReminderTicketsSubscriber = {
                eventSubscriberId: 'customer-reminder-tickets-table',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.reminderTicketsTable.getTableId()
                    ) {
                        this.state.reminderTicketsCount = this.state.reminderTicketsTable.getRows().length;
                        this.state.reminderTicketsFilterCount = this.state.reminderTicketsTable.isFiltered()
                            ? this.state.reminderTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableReminderTicketsSubscriber);

            const table = TableFactoryService.getInstance().createTable(
                'customer-assigned-tickets-reminder', KIXObjectType.TICKET,
                this.state.reminderTicketsConfig.settings, null, null, true
            );

            await table.initialize();

            if (table.getRows(true).length === 0) {
                this.closeGroup('customer-reminder-tickets-group');
            }

            this.state.reminderTicketsTable = table;
        }
    }

    private async configureNewTicketsTable(): Promise<void> {
        if (this.state.newTicketsConfig) {
            const filter = [
                new FilterCriteria(
                    TicketProperty.CUSTOMER_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.customer.CustomerID
                )
            ];

            const stateTypes = await KIXObjectService.loadObjects<StateType>(
                KIXObjectType.TICKET_STATE_TYPE, null
            );

            const states = await KIXObjectService.loadObjects<TicketState>(
                KIXObjectType.TICKET_STATE, null
            );

            const newStateType = stateTypes.find((st) => st.Name === 'new');
            const stateIds = states.filter((s) => s.TypeID === newStateType.ID).map((t) => t.ID);

            filter.push(new FilterCriteria(
                TicketProperty.STATE_ID, SearchOperator.IN, FilterDataType.NUMERIC, FilterType.AND, stateIds
            ));

            this.state.newTicketsConfig.settings.filter = filter;

            this.tableNewTicketsSubscriber = {
                eventSubscriberId: 'customer-new-tickets-group',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.newTicketsTable.getTableId()
                    ) {
                        this.state.newTicketsCount = this.state.newTicketsTable.getRows().length;
                        this.state.newTicketsFilterCount = this.state.newTicketsTable.isFiltered()
                            ? this.state.newTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableNewTicketsSubscriber);

            const table = TableFactoryService.getInstance().createTable(
                'customer-assigned-tickets-new', KIXObjectType.TICKET,
                this.state.newTicketsConfig.settings, null, null, true
            );

            await table.initialize();

            if (table.getRows(true).length === 0) {
                this.closeGroup('customer-new-tickets-group');
            }

            this.state.newTicketsTable = table;
        }
    }

    private async configureOpenTicketsTable(): Promise<void> {
        if (this.state.openTicketsConfig) {
            const filter = [new FilterCriteria(
                TicketProperty.CUSTOMER_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                FilterType.AND, this.state.customer.CustomerID
            )];

            const stateTypes = await KIXObjectService.loadObjects<StateType>(
                KIXObjectType.TICKET_STATE_TYPE, null
            );

            const states = await KIXObjectService.loadObjects<TicketState>(
                KIXObjectType.TICKET_STATE, null
            );

            const openStateType = stateTypes.find((st) => st.Name === 'open');
            const stateIds = states.filter((s) => s.TypeID === openStateType.ID).map((t) => t.ID);

            filter.push(new FilterCriteria(
                TicketProperty.STATE_ID, SearchOperator.IN, FilterDataType.NUMERIC, FilterType.AND, stateIds
            ));

            this.state.openTicketsConfig.settings.filter = filter;

            this.tableOpenTicketsSubscriber = {
                eventSubscriberId: 'customer-open-tickets-group',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.openTicketsTable.getTableId()
                    ) {
                        this.state.openTicketsCount = this.state.openTicketsTable.getRows().length;
                        this.state.openTicketsFilterCount = this.state.openTicketsTable.isFiltered()
                            ? this.state.openTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableOpenTicketsSubscriber);

            const table = TableFactoryService.getInstance().createTable(
                'customer-assigned-tickets-open', KIXObjectType.TICKET,
                this.state.openTicketsConfig.settings, null, null, true
            );

            await table.initialize();

            if (table.getRows(true).length === 0) {
                this.closeGroup('customer-open-tickets-group');
            }

            this.state.openTicketsTable = table;
        }
    }

    private async configurePendingTicketsTable(): Promise<void> {
        if (this.state.pendingTicketsConfig) {
            const filter = [
                new FilterCriteria(
                    TicketProperty.CUSTOMER_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.customer.CustomerID
                )
            ];

            const stateTypes = await KIXObjectService.loadObjects<StateType>(
                KIXObjectType.TICKET_STATE_TYPE, null
            );

            const states = await KIXObjectService.loadObjects<TicketState>(
                KIXObjectType.TICKET_STATE, null
            );

            const pendingStateTypes = stateTypes.filter((st) => st.Name.indexOf('pending') !== -1);
            let stateIds = [];
            pendingStateTypes.forEach(
                (pst) => stateIds = [
                    ...stateIds,
                    ...states.filter((s) => s.TypeID === pst.ID).map((t) => t.ID)]
            );
            filter.push(new FilterCriteria(
                TicketProperty.STATE_ID, SearchOperator.IN, FilterDataType.NUMERIC, FilterType.AND, stateIds
            ));

            this.state.pendingTicketsConfig.settings.filter = filter;

            this.tablePendingTicketsSubscriber = {
                eventSubscriberId: 'customer-pending-tickets-group',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.pendingTicketsTable.getTableId()
                    ) {
                        this.state.pendingTicketsCount = this.state.pendingTicketsTable.getRows().length;
                        this.state.pendingTicketsFilterCount = this.state.pendingTicketsTable.isFiltered()
                            ? this.state.pendingTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tablePendingTicketsSubscriber);

            const table = TableFactoryService.getInstance().createTable(
                'customer-assigned-tickets-pending', KIXObjectType.TICKET,
                this.state.pendingTicketsConfig.settings, null, null, true
            );

            await table.initialize();

            if (table.getRows(true).length === 0) {
                this.closeGroup('customer-pending-tickets-group');
            }

            this.state.pendingTicketsTable = table;
        }
    }

    private closeGroup(componentKey: string): void {
        if (componentKey) {
            const groupComponent = (this as any).getComponent(componentKey);
            if (groupComponent) {
                groupComponent.setMinizedState(true);
            }
        }
    }

    public getTitle(): string {
        const title = this.state.widgetConfiguration
            ? this.state.widgetConfiguration.title
            : "";

        return `${title} (${this.getTicketCount()})`;
    }

    private getTicketCount(): number {
        const ids = [];

        let allIds = [];
        allIds = [...allIds, ...this.getTicketIds(this.state.escalatedTicketsTable)];
        allIds = [...allIds, ...this.getTicketIds(this.state.reminderTicketsTable)];
        allIds = [...allIds, ...this.getTicketIds(this.state.newTicketsTable)];
        allIds = [...allIds, ...this.getTicketIds(this.state.openTicketsTable)];
        allIds = [...allIds, ...this.getTicketIds(this.state.pendingTicketsTable)];

        allIds.forEach((id) => {
            if (!ids.some((existingId) => existingId === id)) {
                ids.push(id);
            }
        });

        return ids.length;
    }

    private getTicketIds(table: ITable): number[] {
        if (table) {
            return table.getRows(true)
                .filter((r) => r.getRowObject() !== null && typeof r.getRowObject() !== 'undefined')
                .map((r) => r.getRowObject().getObject().TicketID);
        }
        return [];

    }

    public getEscalatedTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.escalatedTicketsConfig,
            this.state.escalatedTicketsTable ? this.state.escalatedTicketsTable.getRows(true).length : 0,
            'Escalated Tickets'
        );
    }

    public getReminderTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.reminderTicketsConfig,
            this.state.reminderTicketsTable ? this.state.reminderTicketsTable.getRows(true).length : 0,
            'Reminder Tickets'
        );
    }

    public getNewTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.newTicketsConfig,
            this.state.newTicketsTable ? this.state.newTicketsTable.getRows(true).length : 0,
            'New Tickets'
        );
    }

    public getOpenTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.openTicketsConfig,
            this.state.openTicketsTable ? this.state.openTicketsTable.getRows(true).length : 0,
            'Reminder Tickets'
        );
    }

    public getPendingTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.pendingTicketsConfig,
            this.state.pendingTicketsTable ? this.state.pendingTicketsTable.getRows(true).length : 0,
            'Pending Tickets'
        );

    }

    private getTicketTableTitle(
        config: WidgetConfiguration,
        count: number = 0,
        defaultTitle: string = 'Tickets'
    ): string {
        const title = config ? config.title : defaultTitle;
        return `${title} (${count})`;
    }

    public filterEscalated(filterValue: string): void {
        this.state.escalatedFilterValue = filterValue;
        this.filter(this.state.escalatedTicketsTable, filterValue);
    }

    public filterReminder(filterValue: string): void {
        this.state.reminderFilterValue = filterValue;
        this.filter(this.state.reminderTicketsTable, filterValue);
    }

    public filterNew(filterValue: string): void {
        this.state.newFilterValue = filterValue;
        this.filter(this.state.newTicketsTable, filterValue);
    }

    public filterOpen(filterValue: string): void {
        this.state.openFilterValue = filterValue;
        this.filter(this.state.openTicketsTable, filterValue);
    }

    public filterPending(filterValue: string): void {
        this.state.pendingFilterValue = filterValue;
        this.filter(this.state.pendingTicketsTable, filterValue);
    }

    private filter(table: ITable, filterValue: string) {
        table.setFilter(filterValue);
        table.filter();
    }
}

module.exports = Component;
