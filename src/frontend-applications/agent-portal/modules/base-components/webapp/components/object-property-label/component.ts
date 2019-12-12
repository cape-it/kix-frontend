/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ComponentState } from './ComponentState';
import { ComponentInput } from './ComponentInput';
import { ILabelProvider } from '../../../../../modules/base-components/webapp/core/ILabelProvider';
import { ObjectIcon } from '../../../../icon/model/ObjectIcon';

export class ObjectPropertyLabelComponent<T> {

    private state: ComponentState<T>;

    private object: any;
    private property: string;
    private labelProvider: ILabelProvider<any>;

    public onCreate(): void {
        this.state = new ComponentState();
    }

    public onInput(input: ComponentInput<T>): void {
        this.property = input.property;
        this.labelProvider = input.labelProvider;
        this.state.hasText = typeof input.showText !== 'undefined' ? input.showText : true;
        if (this.object !== input.object) {
            this.object = input.object;
            this.prepareDisplayText();
        }
    }

    public onMount(): void {
        this.prepareDisplayText();
        this.preparePropertyName();
    }

    private async prepareDisplayText(): Promise<void> {
        this.state.propertyDisplayText = await this.getPropertyDisplayText();
        this.state.propertyIcon = await this.getIcon();
    }

    private async preparePropertyName(): Promise<void> {
        let name = this.property;
        if (this.labelProvider) {
            name = await this.labelProvider.getPropertyText(this.property);
        }
        this.state.propertyName = name;
    }

    private async getIcon(): Promise<string | ObjectIcon> {
        let icon;
        if (this.labelProvider) {
            const icons = await this.labelProvider.getIcons(this.object, this.property);
            if (icons && icons.length) {
                icon = icons[0];
            }
        }
        return icon;
    }

    private async getPropertyDisplayText(): Promise<string> {
        let value = this.object ? this.object[this.property] : '';
        if (this.labelProvider && this.object) {
            value = await this.labelProvider.getDisplayText(this.object, this.property);
        }
        return value;
    }

    public getValueClasses(): string {
        let classes = [];
        if (this.labelProvider && this.object) {
            classes = this.labelProvider.getDisplayTextClasses(this.object, this.property);
        }
        return classes.join(',');
    }

}

module.exports = ObjectPropertyLabelComponent;