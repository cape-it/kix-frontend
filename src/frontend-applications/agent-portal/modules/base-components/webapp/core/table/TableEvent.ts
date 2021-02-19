/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

export enum TableEvent {

    TABLE_INITIALIZED = 'TABLE_INITIALIZED',

    TABLE_READY = 'TABLE_READY',

    REFRESH = 'REFRESH',

    RERENDER_TABLE = 'RERENDER_TABLE',

    TABLE_FILTERED = 'TABLE_FILTERED',

    SORTED = 'SORTED',

    SCROLL_TO_AND_TOGGLE_ROW = 'SCROLL_TO_AND_TOGGLE_ROW',

    COLUMN_FILTERED = 'COLUMN_FILTERED',

    COLUMN_RESIZED = 'COLUMN_RESIZED',

    ROW_SELECTION_CHANGED = 'ROW_SELECTION_CHANGED',

    ROW_SELECTABLE_CHANGED = 'ROW_SELECTABLE_CHANGED',

    ROW_TOGGLED = 'ROW_TOGGLED',

    ROW_VALUE_STATE_CHANGED = 'ROW_VALUE_STATE_CHANGED',

    ROW_VALUE_CHANGED = 'ROW_VALUE_CHANGED',

    ROW_CLICKED = 'ROW_CLICKED',

    RELOAD = 'RELOAD',

    RELOADED = 'RELOADED',

    TOGGLE_ROWS = 'TOGGLE_ROWS',

    DISPLAY_VALUE_CHANGED = 'DISPLAY_VALUE_CHANGED'

}
