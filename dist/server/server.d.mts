import { CollectionConfig, CollectionSlug, DefaultDocumentIDType, Field, GlobalConfig, SanitizedConfig } from "payload";
export declare const createCollectionConfig: (config: CollectionConfig) => CollectionConfig;
export declare const createGlobalConfig: (config: GlobalConfig) => GlobalConfig;
type FieldOption<T extends string = string> = {
  label: string;
  value: T;
};
type FieldInput<T extends string = string> = T | FieldOption<T>;
export declare const createFieldOptions: <T extends string>(inputs: FieldInput<T>[]) => {
  options: FieldOption<T>[];
  values: Record<T, T>;
};
export declare const field: (props: Field) => Field;
export type FieldCreateType<P = unknown> = {
  condition?: (data: any, siblingData: any) => boolean;
  description?: string;
  fields?: Field[];
  hidden?: boolean;
  hideGutter?: boolean;
  label?: string;
  localized?: boolean;
  name?: string;
  overrides?: Record<string, unknown>;
  required?: boolean;
} & P;
type FieldCreationFunction<P = unknown> = (props: FieldCreateType<P>) => Field;
export declare function createField<P>(fieldFn: FieldCreationFunction<P>): (props?: FieldCreateType<P>) => Field;
/**
 * Extracts the type of locale codes dynamically from the Payload config.
 */
type ExtractLocaleCodes<T extends SanitizedConfig> = T["localization"] extends {
  localeCodes: readonly (infer L)[];
} ? L : never;
/**
 * Validates and returns the locale.
 * @param config - The Payload config object.
 * @param locale - The locale string to validate.
 * @returns The validated locale.
 */
export declare const getLocale: <T extends SanitizedConfig>(config: T, locale: null | string | undefined) => ExtractLocaleCodes<T>;
export declare function getReference<T>(value: DefaultDocumentIDType | T | null | undefined): T | null;
type RelationProps<T> = {
  relationTo: string;
  value: T | DefaultDocumentIDType;
};
type FetchDocArgs = {
  id: DefaultDocumentIDType;
  collection: CollectionSlug;
};
export declare const getRelation: <T>(props: RelationProps<T>) => {
  getOrFetchValue: (queryCb: (args: FetchDocArgs) => Promise<T | null>) => Promise<T | null>;
  getValue: () => null | T;
  relationTo: string;
};
export declare const socialMediaField: () => import("payload").Field;
declare const fields: Record<"addressLine1" | "addressLine2" | "city" | "location" | "postalCode" | "state" | "country", string>;
type FieldKeys = keyof typeof fields;
export declare const addressField: (props?: FieldCreateType<{
  hideFields?: FieldKeys[];
}>) => import("payload").Field;
export declare const arrayRowLabelField: (props: {
  fieldName: string;
  prefix: string;
}) => {
  clientProps: {
    fieldName: string;
    prefix: string;
  };
  path: string;
};
export declare const timeField: (props?: {
  condition?: (data: any, siblingData: any) => boolean;
  description?: string;
  fields?: import("payload").Field[];
  hidden?: boolean;
  hideGutter?: boolean;
  label?: string;
  localized?: boolean;
  name?: string;
  overrides?: Record<string, unknown>;
  required?: boolean;
}) => import("payload").Field;
export declare const weekdaysMap: Record<string, string>;
export declare const openingHoursField: () => import("payload").Field;
type SlugifyOptions = {
  locale?: string;
  lower?: boolean;
  remove?: RegExp;
  replacement?: string;
  strict?: boolean;
  trim?: boolean;
};
type SlugFieldConfig = {
  fieldName: string;
  lockFieldName: string;
  useFields: string[];
  autoIncrementSlug: boolean;
  sourceField?: string;
  slugifyOptions: SlugifyOptions;
};
type SlugFieldProps = Partial<SlugFieldConfig> & {
  useFields: string[];
};
export declare const slugField: (props: SlugFieldProps) => Field[];
export {};
//# sourceMappingURL=server.d.mts.map