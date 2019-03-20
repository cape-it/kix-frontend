import { ILabelProvider } from "../ILabelProvider";
import { Permission, KIXObjectType, PermissionProperty, ObjectIcon, User, DateTimeUtil } from "../../model";
import { TranslationService } from "../i18n/TranslationService";
import { KIXObjectService } from "../kix";

export class PermissionLabelProvider implements ILabelProvider<Permission> {

    public kixObjectType: KIXObjectType = KIXObjectType.PERMISSION;

    public isLabelProviderFor(object: Permission): boolean {
        return object instanceof Permission;
    }

    public async getPropertyText(property: string, short?: boolean, translatable: boolean = true): Promise<string> {
        let displayValue = property;
        switch (property) {
            case PermissionProperty.TYPE_ID:
                displayValue = 'Translatable#Type';
                break;
            case PermissionProperty.COMMENT:
                displayValue = 'Translatable#Comment';
                break;
            case PermissionProperty.CREATE_BY:
                displayValue = 'Translatable#Created by';
                break;
            case PermissionProperty.CREATE_TIME:
                displayValue = 'Translatable#Created at';
                break;
            case PermissionProperty.CHANGE_BY:
                displayValue = 'Translatable#Changed by';
                break;
            case PermissionProperty.CHANGE_TIME:
                displayValue = 'Translatable#Changed at';
                break;
            case PermissionProperty.IS_REQUIRED:
                displayValue = 'Translatable#Required';
                break;
            case PermissionProperty.TARGET:
                displayValue = 'Translatable#Path';
                break;
            case PermissionProperty.ID:
                displayValue = 'Translatable#Icon';
                break;
            default:
                displayValue = property;
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public async getPropertyIcon(property: string): Promise<string | ObjectIcon> {
        return;
    }

    public async getDisplayText(
        object: Permission, property: string, value?: string, translatable: boolean = true
    ): Promise<string> {
        let displayValue = object[property];

        switch (property) {
            default:
                displayValue = await this.getPropertyValueDisplayText(property, displayValue);
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue;
    }

    public async getPropertyValueDisplayText(
        property: string, value: string | number, translatable: boolean = true
    ): Promise<string> {
        let displayValue = value;
        switch (property) {
            case PermissionProperty.CREATE_BY:
            case PermissionProperty.CHANGE_BY:
                const users = await KIXObjectService.loadObjects<User>(
                    KIXObjectType.USER, [value], null, null, true, true
                ).catch((error) => [] as User[]);
                displayValue = users && !!users.length ? users[0].UserFullname : value;
                break;
            case PermissionProperty.CREATE_TIME:
            case PermissionProperty.CHANGE_TIME:
                displayValue = DateTimeUtil.getLocalDateTimeString(displayValue);
                break;
            default:
        }

        if (translatable && displayValue) {
            displayValue = await TranslationService.translate(displayValue.toString());
        }

        return displayValue.toString();
    }

    public getDisplayTextClasses(object: Permission, property: string): string[] {
        return [];
    }

    public getObjectClasses(object: Permission): string[] {
        return [];
    }

    public async getObjectText(
        object: Permission, id?: boolean, title?: boolean, translatable?: boolean
    ): Promise<string> {
        return await this.getObjectName(false, translatable);
    }

    public getObjectAdditionalText(object: Permission): string {
        return null;
    }

    public getObjectIcon(object?: Permission): string | ObjectIcon {
        return new ObjectIcon('Permission', object.ID);
    }

    public async getObjectName(plural?: boolean, translatable: boolean = true): Promise<string> {
        if (translatable) {
            return await TranslationService.translate(
                plural ? 'Translatable#Permissions' : 'Translatable#Permission'
            );
        }
        return plural ? 'Permissions' : 'Permission';
    }

    public getObjectTooltip(object: Permission): string {
        return object.ID.toString();
    }

    public async getIcons(
        object: Permission, property: string, value?: string | number
    ): Promise<Array<string | ObjectIcon>> {
        if (property === PermissionProperty.ID) {
            return [new ObjectIcon('Permission', object.ID)];
        }
        return null;
    }

}
