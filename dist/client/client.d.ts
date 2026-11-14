
import React$1 from "react";
import { TextFieldClientProps } from "payload";
type Props$1 = {
  fallback?: string;
  fieldName: string;
  prefix?: string;
};
export declare const ArrayRowLabel: React.FC<Props$1>;
type SlugifyOptions = {
  locale?: string;
  lower?: boolean;
  remove?: RegExp;
  replacement?: string;
  strict?: boolean;
  trim?: boolean;
};
type Props = {
  custom: {
    autoIncrementSlug: boolean;
    checkboxFieldPath: string;
    slugifyOptions: {
      remove: string;
    } & Omit<SlugifyOptions, "remove">;
    watchFields: string[];
  };
} & TextFieldClientProps;
export declare const SlugFieldClient: React$1.FC<Props>;
export {};
//# sourceMappingURL=client.d.ts.map