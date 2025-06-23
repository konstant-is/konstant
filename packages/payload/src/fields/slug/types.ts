// Provides additional options for the slugify function
export type SlugifyOptions = {
  locale?: string;
  lower?: boolean;
  remove?: RegExp;
  replacement?: string;
  strict?: boolean;
  trim?: boolean;
};

export type SlugFieldConfig = {
  fieldName: string; // Name of the field
  lockFieldName: string; // Field to store the lock status
  useFields: string[]; // Fields to generate the slug from
  autoIncrementSlug: boolean;
  sourceField?: string; // Optional source field for some configurations
  slugifyOptions: SlugifyOptions;
};
