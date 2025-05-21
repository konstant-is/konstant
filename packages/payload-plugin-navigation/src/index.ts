import type { CollectionConfig, Config } from "payload";

import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";

import type { NavigationPluginConfig } from "./types.js";
import type { PluginContext } from "./utils/createPluginContext.js";

import {
  resolveLocalizedSlugs,
  resolveLocalizedUrl,
  resolveUrl,
} from "./hooks/index.js";
import { createPluginContext } from "./utils/createPluginContext.js";
import { enhanceFields } from "./utils/enhanceFields.js";
import { getLocales } from "./utils/getLocals.js";
import { mergeHooks } from "./utils/mergeHooks.js";

export const navigationPlugin =
  (navigationConfig: NavigationPluginConfig) =>
  async (config: Config): Promise<Config> => {
    if (navigationConfig.disabled) {
      return config;
    }
    const locales = getLocales(config);
    let enhancedConfig = config;

    if (navigationConfig.nestedDocsPlugin) {
      // Integrate nestedDocsPlugin and await its result
      enhancedConfig = await nestedDocsPlugin({
        collections: navigationConfig.collections,
        ...navigationConfig.nestedDocsPlugin,
      })(enhancedConfig);
    }

    const pluginConfig = createPluginContext(navigationConfig, locales);

    return {
      ...config,
      collections: (enhancedConfig.collections || []).map((c) =>
        createCollection(pluginConfig, c)
      ),
    };
  };

const createCollection = (
  context: PluginContext,
  collection: CollectionConfig
) => {
  if (!context.collections.includes(collection.slug)) {
    return collection; // Skip collections not included in the plugin config
  }

  // Enhance fields
  const fields = enhanceFields({
    context,
    fields: collection.fields,
  });

  return {
    ...collection,
    fields,
    hooks: {
      ...(collection.hooks || {}),
      beforeChange: mergeHooks(
        [
          resolveUrl(context),
          resolveLocalizedUrl(context),
          resolveLocalizedSlugs(context),
        ],
        collection.hooks?.beforeChange
      ),
    },
  };
};
