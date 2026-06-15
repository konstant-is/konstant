import type { TextFieldClientProps } from "payload";
import React from "react";
import type { SlugifyOptions } from "../fields/slug/types.js";
type Props = {
    custom: {
        autoIncrementSlug?: boolean;
        checkboxFieldPath: string;
        slugifyOptions: {
            remove: string;
        } & Omit<SlugifyOptions, "remove">;
        watchFields: string[];
    };
} & TextFieldClientProps;
export declare const SlugFieldClient: React.FC<Props>;
export {};
