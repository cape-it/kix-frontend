/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { TableContentProvider } from "../../../../base-components/webapp/core/table/TableContentProvider";
import { TicketHistory } from "../../../model/TicketHistory";
import { ITable, IRowObject, TableValue, RowObject } from "../../../../base-components/webapp/core/table";
import { KIXObjectLoadingOptions } from "../../../../../model/KIXObjectLoadingOptions";
import { KIXObjectType } from "../../../../../model/kix/KIXObjectType";
import { ContextService } from "../../../../../modules/base-components/webapp/core/ContextService";
import { Ticket } from "../../../model/Ticket";

export class TicketHistoryContentProvider extends TableContentProvider<TicketHistory> {

    public constructor(
        table: ITable,
        objectIds: number[],
        loadingOptions: KIXObjectLoadingOptions,
        contextId?: string
    ) {
        super(KIXObjectType.TICKET_HISTORY, table, objectIds, loadingOptions, contextId);
    }

    public async loadData(): Promise<Array<IRowObject<TicketHistory>>> {
        let rowObjects = [];
        if (this.contextId) {
            const context = await ContextService.getInstance().getContext(this.contextId);
            const ticket = await context.getObject<Ticket>();
            if (ticket) {
                rowObjects = ticket.History
                    .sort((a, b) => b.HistoryID - a.HistoryID)
                    .map((th) => {
                        const values: TableValue[] = [];

                        for (const property in th) {
                            if (th.hasOwnProperty(property)) {
                                values.push(new TableValue(property, th[property]));
                            }
                        }

                        return new RowObject<TicketHistory>(values, th);
                    });
            }
        }

        return rowObjects;
    }
}