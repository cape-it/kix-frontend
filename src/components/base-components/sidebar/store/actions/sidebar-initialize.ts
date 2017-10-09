import { StateAction } from '@kix/core/dist/model/client';
import { SidebarSocketListener } from '../../socket/SidebarSocketListener';
import { SidebarAction } from './';

export default (sidebarId: string, instanceId: string, store: any) => {
    const payload = new Promise((resolve, reject) => {
        const socketListener = new SidebarSocketListener(sidebarId, instanceId, store);
        resolve({ socketListener });
    });
    return new StateAction(SidebarAction.SIDEBAR_INITIALIZE, payload);
};
