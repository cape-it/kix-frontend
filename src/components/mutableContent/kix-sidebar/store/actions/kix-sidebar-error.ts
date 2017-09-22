import { StateAction } from '@kix/core/dist/model/client';
import { KixSidebarAction } from './';

export default (error: string) => {
    const payload = new Promise((resolve, reject) => {
        resolve({ error });
    });
    return new StateAction(KixSidebarAction.KIX_SIDEBAR_ERROR, payload);
};
