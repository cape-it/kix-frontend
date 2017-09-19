import { StateAction } from '@kix/core';
import { UserListAction } from './';

declare var io: any;

export default (error: string) => {
    const payload = new Promise((resolve, reject) => {
        resolve({ error });
    });
    return new StateAction(UserListAction.USER_LIST_ERROR, payload);
};
