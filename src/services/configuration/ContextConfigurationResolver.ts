/**
 * Copyright (C) 2006-2019 c.a.p.e. IT GmbH, https://www.cape-it.de
 * --
 * This software comes with ABSOLUTELY NO WARRANTY. For details, see
 * the enclosed file LICENSE for license information (GPL3). If you
 * did not receive this file, see https://www.gnu.org/licenses/gpl-3.0.txt.
 * --
 */

import { ContextConfiguration, ConfiguredWidget, WidgetConfiguration } from "../../core/model";
import { ModuleConfigurationService } from "./ModuleConfigurationService";
import { ConfigurationType } from "../../core/model/configuration";
import { TableWidgetConfigurationResolver } from "./TableWidgetConfigurationResolver";
import { ChartWidgetConfigurationResolver } from "./ChartWidgetConfigurationResolver";
import { TableConfigurationResolver } from "./TableConfigurationResolver";
import { IConfigurationResolver } from "./IConfigurationResolver";

export class ContextConfigurationResolver {

    private static INSTANCE: ContextConfigurationResolver;

    public static getInstance(): ContextConfigurationResolver {
        if (!ContextConfigurationResolver.INSTANCE) {
            ContextConfigurationResolver.INSTANCE = new ContextConfigurationResolver();
        }
        return ContextConfigurationResolver.INSTANCE;
    }

    private constructor() { }

    public async resolve(configuration: ContextConfiguration): Promise<ContextConfiguration> {

        await this.resolveWidgetConfigurations(configuration.content);
        await this.resolveWidgetConfigurations(configuration.lanes);
        await this.resolveWidgetConfigurations(configuration.sidebars);
        await this.resolveWidgetConfigurations(configuration.explorer);
        await this.resolveWidgetConfigurations(configuration.overlays);
        await this.resolveWidgetConfigurations(configuration.others);
        await this.resolveWidgetConfigurations(configuration.dialogs);

        return configuration;
    }

    private async resolveWidgetConfigurations(widgets: ConfiguredWidget[]): Promise<void> {
        for (const w of widgets) {
            const config = await ModuleConfigurationService.getInstance().loadConfiguration<WidgetConfiguration>(
                ConfigurationType.Widget, w.configurationId
            );

            if (config) {
                w.configuration = config;
                w.configuration.instanceId = w.instanceId;

                await this.resolveSubConfig(w.configuration);
            }
        }
    }

    private async resolveSubConfig(config: WidgetConfiguration): Promise<void> {
        const subconfig = config.subConfigurationDefinition;

        if (subconfig && subconfig.configurationId && subconfig.configurationType) {
            const subConfiguration = await ModuleConfigurationService.getInstance().loadConfiguration(
                subconfig.configurationType, subconfig.configurationId
            );
            config.configuration = subConfiguration;

            if (subConfiguration) {
                let resolver: IConfigurationResolver;
                switch (subconfig.configurationType) {
                    case ConfigurationType.TableWidget:
                        resolver = TableWidgetConfigurationResolver.getInstance();
                        break;
                    case ConfigurationType.ChartWidget:
                        resolver = ChartWidgetConfigurationResolver.getInstance();
                        break;
                    case ConfigurationType.Table:
                        resolver = TableConfigurationResolver.getInstance();
                        break;
                    default:
                }

                if (resolver) {
                    await resolver.resolve(subConfiguration);
                }
            }
        }
    }

}
