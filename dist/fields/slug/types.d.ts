export type SlugifyOptions = {
    locale?: string;
    lower?: boolean;
    remove?: RegExp;
    replacement?: string;
    strict?: boolean;
    trim?: boolean;
};
export type SlugFieldConfig = {
    fieldName: string;
    lockFieldName: string;
    useFields: string[];
    autoIncrementSlug: boolean;
    sourceField?: string;
    slugifyOptions: SlugifyOptions;
};
