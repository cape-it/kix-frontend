/**
 * Copyright (C) 2006-2021 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

export enum KIXObjectEvent {

    LOAD_OBJECTS = 'LOAD_OBJECTS',
    LOAD_OBJECTS_FINISHED = 'LOAD_OBJECTS_FINISHED',
    LOAD_OBJECTS_ERROR = 'LOAD_OBJECTS_ERROR',

    CREATE_OBJECT = 'CREATE_OBJECT',
    CREATE_OBJECT_FINISHED = 'CREATE_OBJECT_FINISHED',
    CREATE_OBJECT_ERROR = 'CREATE_OBJECT_ERROR',

    UPDATE_OBJECT = 'UPDATE_OBJECT',
    UPDATE_OBJECT_FINISHED = 'UPDATE_OBJECT_FINISHED',
    UPDATE_OBJECT_ERROR = 'UPDATE_OBJECT_ERROR',

    DELETE_OBJECT = 'DELETE_OBJECT',
    DELETE_OBJECT_FINISHED = 'DELETE_OBJECT_FINISHED',
    DELETE_OBJECT_ERROR = 'DELETE_OBJECT_ERROR'

}
