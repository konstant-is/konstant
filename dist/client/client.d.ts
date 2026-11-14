
import React$1 from "react";
import { DefaultCellComponentProps, TextFieldClientProps, UIFieldClientProps } from "payload";
import "@payloadcms/plugin-nested-docs/types";
type SlugifyOptions = {
  locale?: string;
  lower?: boolean;
  remove?: RegExp;
  replacement?: string;
  strict?: boolean;
  trim?: boolean;
};
type Props$1 = {
  custom: {
    autoIncrementSlug: boolean;
    checkboxFieldPath: string;
    slugifyOptions: {
      remove: string;
    } & Omit<SlugifyOptions, 'remove'>;
    watchFields: string[];
  };
} & TextFieldClientProps;
export declare const SlugFieldClient: React$1.FC<Props$1>;
export declare const UrlCell: React.FC<DefaultCellComponentProps>;
type Props = {
  custom: {
    sourceField: string;
  };
} & UIFieldClientProps;
export declare const PermalinkFieldClient: React.FC<Props>;
export {};
//# sourceMappingURL=client.d.ts.map