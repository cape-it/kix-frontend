/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { IEventSubscriber } from '../../../../../modules/base-components/webapp/core/IEventSubscriber';
import { WidgetConfiguration } from '../../../../../model/configuration/WidgetConfiguration';
import { WidgetService } from '../../../../../modules/base-components/webapp/core/WidgetService';
import { WidgetType } from '../../../../../model/configuration/WidgetType';
import { ContextService } from '../../../../../modules/base-components/webapp/core/ContextService';
import { TranslationService } from '../../../../../modules/translation/webapp/core/TranslationService';
import { Contact } from '../../../model/Contact';
import { KIXObjectType } from '../../../../../model/kix/KIXObjectType';
import { EventService } from '../../../../../modules/base-components/webapp/core/EventService';
import { TableEvent, TableFactoryService, TableEventData, Table } from '../../../../base-components/webapp/core/table';
import { ActionFactory } from '../../../../../modules/base-components/webapp/core/ActionFactory';
import { FilterCriteria } from '../../../../../model/FilterCriteria';
import { TicketProperty } from '../../../../ticket/model/TicketProperty';
import { SearchOperator } from '../../../../search/model/SearchOperator';
import { FilterDataType } from '../../../../../model/FilterDataType';
import { FilterType } from '../../../../../model/FilterType';
import { DateTimeUtil } from '../../../../../modules/base-components/webapp/core/DateTimeUtil';
import { TableConfiguration } from '../../../../../model/configuration/TableConfiguration';
import { KIXObjectLoadingOptions } from '../../../../../model/KIXObjectLoadingOptions';
import { DefaultColumnConfiguration } from '../../../../../model/configuration/DefaultColumnConfiguration';
import { DataType } from '../../../../../model/DataType';
import { TableHeaderHeight } from '../../../../../model/configuration/TableHeaderHeight';
import { TableRowHeight } from '../../../../../model/configuration/TableRowHeight';
import { KIXObjectService } from '../../../../../modules/base-components/webapp/core/KIXObjectService';
import { StateType } from '../../../../ticket/model/StateType';
import { TicketState } from '../../../../ticket/model/TicketState';
import { KIXObjectProperty } from '../../../../../model/kix/KIXObjectProperty';

class Component {

    private state: ComponentState;

    private tableReminderTicketsSubscriber: IEventSubscriber;
    private tableNewTicketsSubscriber: IEventSubscriber;
    private tableOpenTicketsSubscriber: IEventSubscriber;
    private tablePendingTicketsSubscriber: IEventSubscriber;

    public reminderTicketsConfig: WidgetConfiguration;
    public newTicketsConfig: WidgetConfiguration;
    public openTicketsConfig: WidgetConfiguration;
    public pendingTicketsConfig: WidgetConfiguration;

    public onCreate(): void {
        this.state = new ComponentState();
        WidgetService.getInstance().setWidgetType('contact-reminder-tickets-group', WidgetType.GROUP);
        WidgetService.getInstance().setWidgetType('contact-new-tickets-group', WidgetType.GROUP);
        WidgetService.getInstance().setWidgetType('contact-open-tickets-group', WidgetType.GROUP);
        WidgetService.getInstance().setWidgetType('contact-pending-tickets-group', WidgetType.GROUP);
    }

    public onInput(input: any): void {
        this.state.instanceId = input.instanceId;
    }

    public async onMount(): Promise<void> {
        const context = ContextService.getInstance().getActiveContext();
        this.state.widgetConfiguration = context
            ? await context.getWidgetConfiguration(this.state.instanceId)
            : undefined;

        this.state.widgetTitle = await TranslationService.translate('Translatable#Overview Tickets');

        this.state.openTicketsTitle = await TranslationService.translate('Translatable#Open Tickets');
        this.openTicketsConfig = new WidgetConfiguration(null, null, null,
            'contact-open-tickets-group', this.state.openTicketsTitle, [], null
        );

        this.state.reminderTicketsTitle = await TranslationService.translate('Translatable#Reminder Tickets');
        this.reminderTicketsConfig = new WidgetConfiguration(null, null, null,
            'contact-reminder-tickets-group', this.state.reminderTicketsTitle, [], null
        );

        this.state.newTicketsTitle = await TranslationService.translate('Translatable#New Tickets');
        this.newTicketsConfig = new WidgetConfiguration(null, null, null,
            'contact-new-tickets-group', this.state.newTicketsTitle, [], null
        );

        this.state.pendingTicketsTitle = await TranslationService.translate('Translatable#Pending Tickets');
        this.pendingTicketsConfig = new WidgetConfiguration(null, null, null,
            'contact-pending-tickets-group', this.state.pendingTicketsTitle, [], null
        );

        context.registerListener('contact-assigned-tickets-component', {
            sidebarLeftToggled: () => { return; },
            filteredObjectListChanged: () => { return; },
            objectListChanged: () => { return; },
            sidebarRightToggled: () => { return; },
            scrollInformationChanged: () => { return; },
            objectChanged: (contactId: string, contact: Contact, type: KIXObjectType) => {
                if (type === KIXObjectType.CONTACT) {
                    this.initWidget(contact);
                }
            },
            additionalInformationChanged: () => { return; }
        });

        this.initWidget(await context.getObject<Contact>());

        this.state.widgetConfiguration = context
            ? await context.getWidgetConfiguration(this.state.instanceId)
            : undefined;
    }

    public onDestroy(): void {
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableReminderTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableNewTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tableOpenTicketsSubscriber);
        EventService.getInstance().unsubscribe(TableEvent.TABLE_READY, this.tablePendingTicketsSubscriber);
        TableFactoryService.getInstance().destroyTable('contact-assigned-tickets-reminder');
        TableFactoryService.getInstance().destroyTable('contact-assigned-tickets-new');
        TableFactoryService.getInstance().destroyTable('contact-assigned-tickets-open');
        TableFactoryService.getInstance().destroyTable('contact-assigned-tickets-pending');
    }

    private async initWidget(contact?: Contact): Promise<void> {
        this.state.contact = contact;
        await this.prepareActions();
        await this.createTables();
    }

    private async prepareActions(): Promise<void> {
        if (this.state.widgetConfiguration && this.state.contact) {
            this.state.actions = await ActionFactory.getInstance().generateActions(
                this.state.widgetConfiguration.actions, [this.state.contact]
            );
        }
    }

    private async createTables(): Promise<void> {
        if (this.state.contact) {
            await this.configureReminderTicketsTable();
            await this.configureNewTicketsTable();
            await this.configureOpenTicketsTable();
            await this.configurePendingTicketsTable();
        }
    }

    private async configureReminderTicketsTable(): Promise<void> {
        if (this.reminderTicketsConfig) {
            this.tableReminderTicketsSubscriber = {
                eventSubscriberId: 'contact-reminder-tickets-table',
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

            const filter = [
                new FilterCriteria(
                    TicketProperty.CONTACT_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.contact.ID
                ),
                new FilterCriteria(
                    TicketProperty.PENDING_TIME, SearchOperator.LESS_THAN, FilterDataType.DATETIME, FilterType.AND,
                    DateTimeUtil.getKIXDateTimeString(new Date())
                )
            ];

            const tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.TICKET,
                new KIXObjectLoadingOptions(filter), null,
                [
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PRIORITY_ID, false, true, true, true, 65, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.TICKET_NUMBER, true, false, true, true, 135, true, true
                    ),
                    new DefaultColumnConfiguration(
                        null, null, null, TicketProperty.TITLE, true, false, true, true, 260, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.STATE_ID, true, true, true, true, 150, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.QUEUE_ID, true, false, true, true, 100, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        'DynamicFields.AffectedAsset', true, false, true, false, 200, true, true, true, undefined, true,
                        'label-list-cell-content'
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.ORGANISATION_ID, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PENDING_TIME, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.CHANGED, true, false, true, true, 125, true, true, false, DataType.DATE_TIME
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.AGE, true, false, true, true, 75, true, true, false, DataType.NUMBER
                    )
                ], [], false, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
            );

            const table = await TableFactoryService.getInstance().createTable(
                'contact-assigned-tickets-reminder', KIXObjectType.TICKET, tableConfiguration, null, null, true
            );

            await table.initialize();

            this.closeGroup('contact-reminder-tickets-group');

            this.state.reminderTicketsTable = table;
            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableReminderTicketsSubscriber);
        }
    }

    private async configureNewTicketsTable(): Promise<void> {
        if (this.newTicketsConfig) {
            this.tableNewTicketsSubscriber = {
                eventSubscriberId: 'contact-new-tickets-group',
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

            const filter = [
                new FilterCriteria(
                    TicketProperty.CONTACT_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.contact.ID
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

            const tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.TICKET,
                new KIXObjectLoadingOptions(filter), null,
                [
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PRIORITY_ID, false, true, true, true, 65, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.TICKET_NUMBER, true, false, true, true, 135, true, true
                    ),
                    new DefaultColumnConfiguration(
                        null, null, null, TicketProperty.TITLE, true, false, true, true, 260, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.STATE_ID, true, true, true, true, 150, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.QUEUE_ID, true, false, true, true, 100, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        'DynamicFields.AffectedAsset', true, false, true, false, 200, true, true, true, undefined, true,
                        'label-list-cell-content'
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.ORGANISATION_ID, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.CHANGED, true, false, true, true, 125, true, true, false, DataType.DATE_TIME
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.AGE, true, false, true, true, 75, true, true, false, DataType.NUMBER
                    )
                ], [], false, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
            );

            const table = await TableFactoryService.getInstance().createTable(
                'contact-assigned-tickets-new', KIXObjectType.TICKET,
                tableConfiguration, null, null, true
            );

            await table.initialize();

            this.closeGroup('contact-new-tickets-group');

            this.state.newTicketsTable = table;
            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableNewTicketsSubscriber);
        }
    }

    private async configureOpenTicketsTable(): Promise<void> {
        if (this.openTicketsConfig) {
            this.tableOpenTicketsSubscriber = {
                eventSubscriberId: 'contact-open-tickets-group',
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

            const filter = [new FilterCriteria(
                TicketProperty.CONTACT_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                FilterType.AND, this.state.contact.ID
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

            const tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.TICKET,
                new KIXObjectLoadingOptions(filter), null,
                [
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PRIORITY_ID, false, true, true, true, 65, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.TICKET_NUMBER, true, false, true, true, 135, true, true
                    ),
                    new DefaultColumnConfiguration(
                        null, null, null, TicketProperty.TITLE, true, false, true, true, 260, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.STATE_ID, true, true, true, true, 150, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.QUEUE_ID, true, false, true, true, 100, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        'DynamicFields.AffectedAsset', true, false, true, false, 200, true, true, true, undefined, true,
                        'label-list-cell-content'
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.ORGANISATION_ID, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.CHANGED, true, false, true, true, 125, true, true, false, DataType.DATE_TIME
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.AGE, true, false, true, true, 75, true, true, false, DataType.NUMBER

                    )
                ], [], false, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
            );

            const table = await TableFactoryService.getInstance().createTable(
                'contact-assigned-tickets-open', KIXObjectType.TICKET,
                tableConfiguration, null, null, true
            );

            await table.initialize();

            this.closeGroup('contact-open-tickets-group');

            this.state.openTicketsTable = table;
            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tableOpenTicketsSubscriber);
        }
    }

    private async configurePendingTicketsTable(): Promise<void> {
        if (this.pendingTicketsConfig) {
            this.tablePendingTicketsSubscriber = {
                eventSubscriberId: 'contact-pending-tickets-group',
                eventPublished: (data: TableEventData, eventId: string) => {
                    if (
                        eventId === TableEvent.TABLE_READY && data
                        && data.tableId === this.state.openTicketsTable.getTableId()
                    ) {
                        this.state.pendingTicketsCount = this.state.pendingTicketsTable.getRows().length;
                        this.state.pendingTicketsFilterCount = this.state.pendingTicketsTable.isFiltered()
                            ? this.state.pendingTicketsTable.getRows().length
                            : null;
                    }
                }
            };

            const filter = [
                new FilterCriteria(
                    TicketProperty.CONTACT_ID, SearchOperator.EQUALS, FilterDataType.STRING,
                    FilterType.AND, this.state.contact.ID
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

            const tableConfiguration = new TableConfiguration(null, null, null,
                KIXObjectType.TICKET,
                new KIXObjectLoadingOptions(filter), null,
                [
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PRIORITY_ID, false, true, true, true, 65, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.TICKET_NUMBER, true, false, true, true, 135, true, true
                    ),
                    new DefaultColumnConfiguration(
                        null, null, null, TicketProperty.TITLE, true, false, true, true, 260, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.STATE_ID, true, true, true, true, 150, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.QUEUE_ID, true, false, true, true, 100, true, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        'DynamicFields.AffectedAsset', true, false, true, false, 200, true, true, true, undefined, true,
                        'label-list-cell-content'
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.ORGANISATION_ID, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.PENDING_TIME, true, false, true, true, 150, true, true
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.CHANGED, true, false, true, true, 125, true, true, false, DataType.DATE_TIME
                    ),
                    new DefaultColumnConfiguration(null, null, null,
                        TicketProperty.AGE, true, false, true, true, 75, true, true, false, DataType.NUMBER

                    )
                ], [], false, false, null, null, TableHeaderHeight.SMALL, TableRowHeight.SMALL
            );

            const table = await TableFactoryService.getInstance().createTable(
                'contact-assigned-tickets-pending', KIXObjectType.TICKET, tableConfiguration, null, null, true
            );

            await table.initialize();

            this.closeGroup('contact-pending-tickets-group');

            this.state.pendingTicketsTable = table;
            EventService.getInstance().subscribe(TableEvent.TABLE_READY, this.tablePendingTicketsSubscriber);
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
        const title = this.state.widgetTitle;
        return `${title} (${this.getTicketCount()})`;
    }

    private getTicketCount(): number {
        const ids = [];

        let allIds = [];
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

    private getTicketIds(table: Table): number[] {
        if (table) {
            return table.getRows(true)
                .filter((r) => r.getRowObject() !== null && typeof r.getRowObject() !== 'undefined')
                .map((r) => r.getRowObject().getObject().TicketID);
        }
        return [];

    }

    public getReminderTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.reminderTicketsTable ? this.state.reminderTicketsTable.getRows(true).length : 0,
            this.state.reminderTicketsTitle
        );
    }

    public getNewTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.newTicketsTable ? this.state.newTicketsTable.getRows(true).length : 0,
            this.state.newTicketsTitle
        );
    }

    public getOpenTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.openTicketsTable ? this.state.openTicketsTable.getRows(true).length : 0,
            this.state.openTicketsTitle
        );
    }

    public getPendingTicketsTitle(): string {
        return this.getTicketTableTitle(
            this.state.pendingTicketsTable ? this.state.pendingTicketsTable.getRows(true).length : 0,
            this.state.pendingTicketsTitle
        );

    }

    private getTicketTableTitle(
        count: number = 0, title: string = 'Tickets'
    ): string {
        return `${title} (${count})`;
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

    private filter(table: Table, filterValue: string) {
        table.setFilter(filterValue);
        table.filter();
    }
}

module.exports = Component;
