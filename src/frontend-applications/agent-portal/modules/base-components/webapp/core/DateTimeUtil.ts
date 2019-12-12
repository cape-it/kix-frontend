/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { TranslationService } from "../../../translation/webapp/core";

export class DateTimeUtil {

    public static async getLocalDateString(value: any, language?: string): Promise<string> {
        let string = '';
        if (value) {
            const date = new Date(value);
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };

            if (!language) {
                language = await TranslationService.getUserLanguage();
            }
            string = language ? date.toLocaleDateString(language, options) : value;
        }
        return string;
    }

    public static async getLocalDateTimeString(value: any, language?: string): Promise<string> {
        let string = '';
        if (value) {
            const date = new Date(value);
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            if (!language) {
                language = await TranslationService.getUserLanguage();
            }
            string = language ? date.toLocaleString(language, options) : value;
        }
        return string;
    }

    public static calculateTimeInterval(ageInMilliseconds: number): string {
        let isNegative = false;
        if (ageInMilliseconds < 0) {
            isNegative = true;
            ageInMilliseconds = ageInMilliseconds * -1;
        }
        let ageResult = ageInMilliseconds + 'ms';

        const hoursInSeconds = 60 * 60;
        const daysInSeconds = 24 * hoursInSeconds;

        const days = Math.floor(ageInMilliseconds / daysInSeconds);
        const hours = Math.floor((ageInMilliseconds - (days * daysInSeconds)) / hoursInSeconds);
        const minutes = Math.round((ageInMilliseconds - (days * daysInSeconds) - (hours * hoursInSeconds)) / 60);

        if (days === 0) {
            ageResult = hours + 'h ' + minutes + 'm';
        } else {
            ageResult = days + 'd ' + hours + 'h';
        }

        return isNegative ? '- ' + ageResult : ageResult;
    }

    public static getKIXDateTimeString(date: Date): string {
        return `${DateTimeUtil.getKIXDateString(date)} ${DateTimeUtil.getKIXTimeString(date, false)}`;
    }

    public static getKIXDateString(date: Date): string {
        const year = date.getFullYear();
        const month = DateTimeUtil.padZero(date.getMonth() + 1);
        const day = DateTimeUtil.padZero(date.getDate());
        const kixDateString = `${year}-${month}-${day}`;
        return kixDateString;
    }

    public static getKIXTimeString(date: Date, short: boolean = true): string {
        const hours = DateTimeUtil.padZero(date.getHours());
        const minutes = DateTimeUtil.padZero(date.getMinutes());
        const seconds = DateTimeUtil.padZero(date.getSeconds());
        let kixTimeString = `${hours}:${minutes}`;
        if (!short) {
            kixTimeString += `:${seconds}`;
        }
        return kixTimeString;
    }

    public static getTimestampNumbersOnly(date: Date): string {
        const year = date.getFullYear();
        const month = DateTimeUtil.padZero(date.getMonth() + 1);
        const day = DateTimeUtil.padZero(date.getDate());
        const hours = DateTimeUtil.padZero(date.getHours());
        const minutes = DateTimeUtil.padZero(date.getMinutes());
        const seconds = DateTimeUtil.padZero(date.getSeconds());
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    public static sameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    public static getTimeByMillisec(millisec: number): string {

        let seconds: string = (millisec / 1000).toFixed(0);
        let minutes: string = DateTimeUtil.padZero(Math.floor(Number(seconds) / 60));
        let hours: string = '';

        if (Number(minutes) > 59) {
            hours = DateTimeUtil.padZero(Math.floor(Number(minutes) / 60));
            minutes = DateTimeUtil.padZero((Number(minutes) - (Number(hours) * 60)));
        }
        seconds = DateTimeUtil.padZero(Math.floor(Number(seconds) % 60));

        if (hours === '') {
            hours = '00';
        }

        return `${hours}:${minutes}:${seconds}`;
    }

    public static getDayString(key: string): string {
        switch (key) {
            case 'Mon':
                return 'Translatable#Monday';
            case 'Tue':
                return 'Translatable#Tuesday';
            case 'Wed':
                return 'Translatable#Wednesday';
            case 'Thu':
                return 'Translatable#Thursday';
            case 'Fri':
                return 'Translatable#Friday';
            case 'Sat':
                return 'Translatable#Saturday';
            case 'Sun':
                return 'Translatable#Sunday';
            default:
                return key;
        }
    }

    private static padZero(value: number): string {
        return (value < 10 ? '0' + value : value).toString();
    }

}