import type { Config, GlobalConfig } from 'payload';
type TranslationPluginConfig = {
    admin?: GlobalConfig['admin'];
    hooks?: GlobalConfig['hooks'];
    slug?: string;
    translations?: Record<string, Record<string, string>>;
};
export declare const translationPlugin: (pluginOptions: TranslationPluginConfig) => (incomingConfig: Config) => Config;
export {};
