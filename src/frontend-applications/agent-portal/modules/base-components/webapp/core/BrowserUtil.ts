/**
 * Copyright (C) 2006-2020 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { OverlayService } from './OverlayService';
import { OverlayType } from './OverlayType';
import { StringContent } from './StringContent';
import { ComponentContent } from './ComponentContent';
import { ToastContent } from './ToastContent';
import { ConfirmOverlayContent } from './ConfirmOverlayContent';
import { RefreshToastSettings } from './RefreshToastSettings';
import { DateTimeUtil } from './DateTimeUtil';
import { KIXObjectType } from '../../../../model/kix/KIXObjectType';
import { ValidationResult } from './ValidationResult';
import { ValidationSeverity } from './ValidationSeverity';
import { EventService } from './EventService';
import { ApplicationEvent } from './ApplicationEvent';
import { LoadingShieldEventData } from './LoadingShieldEventData';
import { ContextHistory } from './ContextHistory';


export class BrowserUtil {

    public static openErrorOverlay(error: string): void {
        OverlayService.getInstance().openOverlay(
            OverlayType.WARNING, null, new StringContent(error), 'Translatable#Error!', null, true
        );
    }

    public static async openSuccessOverlay(message: string): Promise<void> {
        setTimeout(() => {
            const content = new ComponentContent('toast', new ToastContent('kix-icon-check', message));
            OverlayService.getInstance().openOverlay(OverlayType.SUCCESS_TOAST, null, content, 'Translatable#Success!');
        }, 500);
    }

    public static openConfirmOverlay(
        title: string = 'Sure?', confirmText: string = 'Are you sure?',
        confirmCallback: () => void = null, cancelCallback: () => void = null,
        labels: [string, string] = ['Yes', 'No'], closeButton?: boolean
    ): void {
        const content = new ComponentContent(
            'confirm-overlay', new ConfirmOverlayContent(confirmText, confirmCallback, cancelCallback, labels)
        );
        OverlayService.getInstance().openOverlay(OverlayType.CONFIRM, null, content, title, null, closeButton);
    }

    public static openAppRefreshOverlay(
        message: string, objectType: KIXObjectType | string, reloadApp?: boolean
    ): void {
        const settings = new RefreshToastSettings(message, reloadApp, objectType);
        const componentContent = new ComponentContent('refresh-app-toast', settings);
        OverlayService.getInstance().openOverlay(
            OverlayType.HINT_TOAST, null, componentContent, '', null, false, null, null, null, null, true
        );
    }

    public static async openAccessDeniedOverlay(): Promise<void> {
        const content = new ComponentContent(
            'toast',
            new ToastContent(
                'kix-icon-close', 'Translatable#No permission for this object.', 'Translatable#Access denied'
            )
        );
        OverlayService.getInstance().openOverlay(OverlayType.ERROR_TOAST, null, content, 'Translatable#Access denied');
    }

    public static startBrowserDownload(fileName: string, content: string, contentType: string): void {
        content = content.replace(/\r?\n|\r/, '\n');

        const FileSaver = require('file-saver');
        if (window.navigator.msSaveOrOpenBlob) {
            const blob = this.b64toBlob(content, contentType);
            FileSaver.saveAs(blob, fileName);
        } else {
            const blob = this.b64toBlob(content, contentType);
            const file = new File([blob], fileName, { type: contentType });
            FileSaver.saveAs(file);
        }
    }

    public static readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (file instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                    let content = reader.result.toString();
                    content = content.split(',')[1];
                    resolve(content);
                };

                // get base64 string
                reader.readAsDataURL(file);
            }
        });
    }

    public static readFileAsText(file: File, encoding: string = 'UTF-8'): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result.toString();
                resolve(content);
            };
            reader.readAsText(file, encoding);
        });
    }

    public static parseCSV(csvString: string, textSeparator: string = '"', valueSeparator: string = ';'): string[][] {
        const list = [];
        let quote = false;

        for (let row = 0, column = 0, character = 0; character < csvString.length; character++) {
            const currentCharacter = csvString[character];
            const nextCharacter = csvString[character + 1];
            list[row] = list[row] || [];
            list[row][column] = list[row][column] || '';

            if (
                currentCharacter.match(new RegExp(textSeparator))
                && quote && nextCharacter && nextCharacter.match(new RegExp(textSeparator))
            ) {
                list[row][column] += currentCharacter; ++character; continue;
            }

            if (currentCharacter.match(new RegExp(textSeparator))) { quote = !quote; continue; }

            if (currentCharacter.match(new RegExp(valueSeparator)) && !quote) { ++column; continue; }

            if (
                currentCharacter === '\r' && nextCharacter === '\n' && !quote
            ) { ++row; column = 0; ++character; continue; }

            if (currentCharacter === '\n' && !quote) { ++row; column = 0; continue; }
            if (currentCharacter === '\r' && !quote) { ++row; column = 0; continue; }

            list[row][column] += currentCharacter;
        }

        return list;
    }

    public static calculateAverage(values: number[]): number {
        if (values && values.length) {
            let sum = 0;
            values.forEach((v) => sum += v);
            return BrowserUtil.round(sum / values.length);
        }
        return 0;
    }

    public static getBrowserFontsize(): number {
        const browserFontSizeSetting = getComputedStyle(document.getElementsByTagName('body')[0])
            .getPropertyValue('font-size');
        return Number(browserFontSizeSetting.replace('px', ''));
    }

    private static round(value: number, step: number = 0.5): number {
        const inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }

    private static b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    public static scrollIntoViewIfNeeded(element: any) {
        const scrollIntoView = require('scroll-into-view-if-needed');
        scrollIntoView(element, { behavior: 'smooth', scrollMode: 'if-needed' });
    }

    public static encodeHTMLString(value: string): string {
        value = value.toLocaleLowerCase()
            .replace(/ä/g, '&auml;')
            .replace(/ö/g, '&ouml;')
            .replace(/ü/g, '&uuml;');

        return value;
    }

    public static async downloadCSVFile(csvString: string, filename: string, withDate: boolean = true): Promise<void> {
        const now = DateTimeUtil.getTimestampNumbersOnly(new Date(Date.now()));
        const fileName = `${filename}${withDate ? '_' + now : ''}.csv`;
        if (window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([csvString], { type: 'text/csv' });
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            const element = document.createElement('a');
            element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
            element.download = fileName;
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }

    public static showValidationError(result: ValidationResult[]): void {
        const errorMessages = result.filter((r) => r.severity === ValidationSeverity.ERROR).map((r) => r.message);
        const content = new ComponentContent('list-with-title',
            {
                title: 'Translatable#Error on form validation:',
                list: errorMessages
            }
        );

        OverlayService.getInstance().openOverlay(
            OverlayType.WARNING, null, content, 'Translatable#Validation error', null, true
        );
    }

    public static toggleLoadingShield(
        loading: boolean, hint?: string, time?: number, cancelCallback?: () => void, cancelButtonText?: string
    ): void {
        EventService.getInstance().publish(
            ApplicationEvent.TOGGLE_LOADING_SHIELD,
            new LoadingShieldEventData(loading, hint, time, cancelCallback, cancelButtonText)
        );
    }

    public static logout(): void {
        ContextHistory.getInstance().removeBrowserListener();
        window.location.replace('/auth/logout');
    }

}
