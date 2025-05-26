import type { Config } from "payload";
import type { NavigationPluginConfig } from "./types.js";
export declare const navigationPlugin: (navigationConfig: NavigationPluginConfig) => (config: Config) => Promise<Config>;
