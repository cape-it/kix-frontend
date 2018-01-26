import { ObjectService } from './ObjectService';
import { ISysConfigService } from '@kix/core/dist/services';
import { SysConfigItem } from '@kix/core/dist/model';
import {
    SysConfigItemResponse
} from '@kix/core/dist/api';
import { SortOrder } from '@kix/core/dist/browser/SortOrder';

export class SysConfigService extends ObjectService<SysConfigItem> implements ISysConfigService {

    protected RESOURCE_URI: string = "sysconfig";

    public async getSysConfigItem(token: string, textModuleId: string, query?: any): Promise<SysConfigItem> {
        const response = await this.getObject<SysConfigItemResponse>(
            token, textModuleId
        );

        return response.SysConfigItem;
    }

}
