import { IConfigurationService, ILoggingService } from '@kix/core/dist/services';
import { Environment, IServerConfiguration } from '@kix/core/dist/common';
import { TranslationConfiguration } from '@kix/core/dist/model';

import { injectable, inject } from 'inversify';

import jsonfile = require('jsonfile');
import fs = require('fs');

@injectable()
export class ConfigurationService implements IConfigurationService {

    private serverConfiguration: IServerConfiguration;
    private lassoConfiguration: any;
    private translationConfiguration: TranslationConfiguration;
    private preDefinedWidgetConfiguration: any;

    private CONFIG_DIR: string = '../../config/';
    private CONFIG_COMPONENTS_DIR: string = '../../config/components/';
    private CONFIG_EXTENSION: string = '.config.json';

    public constructor() {
        let lassoConfig = this.getConfigurationFilePath('lasso.dev');

        const serverConfig = this.getConfigurationFilePath('server');

        if (this.isProductionMode()) {
            lassoConfig = this.getConfigurationFilePath('lasso.prod');
        }

        this.serverConfiguration = this.loadServerConfig(serverConfig);

        this.clearRequireCache(lassoConfig);
        this.lassoConfiguration = require(lassoConfig);

        const translationConfig = this.getConfigurationFilePath("translation");
        this.clearRequireCache(translationConfig);
        this.translationConfiguration = require(translationConfig);

        this.preDefinedWidgetConfiguration = require(this.getConfigurationFilePath("pre-defined-widgets"));
    }

    public getServerConfiguration(): IServerConfiguration {
        return this.serverConfiguration;
    }

    public getLassoConfiguration(): any {
        return this.lassoConfiguration;
    }

    public getTranslationConfiguration(): TranslationConfiguration {
        return this.translationConfiguration;
    }

    public getPreDefinedWidgetConfiguration(): any {
        return this.preDefinedWidgetConfiguration || {};
    }

    public getModuleConfiguration(contextId: string, userId: number): any {

        const configurationFileName = this.buildConfigurationFileName(contextId, userId);
        const filePath = this.getComponentConfigurationFilePath(configurationFileName);
        const moduleConfiguration = this.getConfigurationFile(filePath);

        return moduleConfiguration;
    }

    public async saveModuleConfiguration(
        contextId: string, userId: number, configuration: any): Promise<void> {

        const configurationFileName = this.buildConfigurationFileName(contextId, userId);
        const filePath = this.getComponentConfigurationFilePath(configurationFileName);

        return this.saveConfigurationFile(__dirname + '/' + filePath, configuration);
    }

    public getComponentConfiguration(
        contextId: string, componentId: string, userId: number): any {

        const moduleConfiguration = this.getModuleConfiguration(contextId, userId);

        if (componentId === null) {
            componentId = contextId;
        }

        return moduleConfiguration ? moduleConfiguration[componentId] : undefined;
    }

    public async saveComponentConfiguration(
        contextId: string, componentId: string, userId: number, configuration: any): Promise<void> {

        if (componentId === null) {
            componentId = contextId;
        }

        const configurationFileName = this.buildConfigurationFileName(contextId, userId);
        const filePath = this.getComponentConfigurationFilePath(configurationFileName);
        const moduleConfiguration = this.getConfigurationFile(filePath) || {};
        moduleConfiguration[componentId] = configuration;

        return this.saveConfigurationFile(__dirname + '/' + filePath, moduleConfiguration);
    }

    public isProductionMode(): boolean {
        const environment = this.getEnvironment();
        return environment === Environment.PRODUCTION ||
            (environment !== Environment.DEVELOPMENT && environment !== Environment.TEST);
    }

    public isDevelopmentMode(): boolean {
        return this.getEnvironment() === Environment.DEVELOPMENT;
    }

    public isTestMode(): boolean {
        return this.getEnvironment() === Environment.TEST;
    }

    private getEnvironment(): string {
        let nodeEnv = process.env.NODE_ENV;
        if (!nodeEnv) {
            nodeEnv = Environment.PRODUCTION;
        }

        return nodeEnv.toLocaleLowerCase();
    }

    private saveConfigurationFile(filePath: string, configurationContent: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            jsonfile.writeFile(filePath, configurationContent,
                (fileError: Error) => {
                    if (fileError) {
                        reject(fileError);
                    }

                    resolve();
                });
        });
    }

    private loadServerConfig(serverConfig: string): IServerConfiguration {
        this.clearRequireCache(serverConfig);
        const config: IServerConfiguration = require(serverConfig);

        // check if config option has been overridden by environment
        for (const key in config) {
            if (process.env[key]) {
                switch (typeof config[key]) {
                    case "number": {
                        config[key] = Number(process.env[key]);
                        break;
                    }
                    case "boolean": {
                        config[key] = Boolean(process.env[key]);
                        break;
                    }
                    case "object": {
                        config[key] = Object(process.env[key].split(/\s+/));
                        break;
                    }
                    default: {
                        config[key] = process.env[key];
                    }
                }
            }
        }
        return config;
    }

    private getConfigurationFilePath(fileName: string): string {
        return this.CONFIG_DIR + fileName + this.CONFIG_EXTENSION;
    }

    private getComponentConfigurationFilePath(fileName: string): string {
        return this.CONFIG_COMPONENTS_DIR + fileName + this.CONFIG_EXTENSION;
    }

    private buildConfigurationFileName(contextId: string, userId: number): string {
        let configurationFileName = contextId;

        if (userId) {
            configurationFileName = userId + '_' + configurationFileName;
        }

        return configurationFileName;
    }

    private getConfigurationFile(filePath: string): any {
        let configurationFile = null;
        if (fs.existsSync(__dirname + "/" + filePath)) {
            this.clearRequireCache(filePath);
            try {
                configurationFile = require(filePath);
            } catch (error) {
                // do nothing
            }
        }

        return configurationFile;
    }

    private clearRequireCache(configPath: string): void {
        try {
            const config = require.resolve(configPath);
            if (require.cache[config]) {
                delete require.cache[config];
            }
        } catch (error) {
            return;
        }
    }

}
