import type { CollectionConfig, GlobalConfig } from "payload";

export const createCollectionConfig = (
  config: CollectionConfig
): CollectionConfig => {
  return {
    access: {
      read: () => true,
      ...config.access,
    },
    ...config,
  };
};

export const createGlobalConfig = (config: GlobalConfig): GlobalConfig => {
  return {
    access: {
      read: () => true,
      ...config.access,
    },
    ...config,
  };
};
