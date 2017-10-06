import { StateAction } from '@kix/core/dist/model/client';
import { UserListAction } from './';

export default (error: string) => {
    const payload = new Promise((resolve, reject) => {
        resolve({ error });
    });
    return new StateAction(UserListAction.USER_LIST_ERROR, payload);
};
