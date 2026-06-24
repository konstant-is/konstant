import { Field } from "payload";
import { SlugFieldConfig } from "./types.js";
type SlugFieldProps = Partial<SlugFieldConfig> & {
    useFields: string[];
};
export declare const slugField: (props: SlugFieldProps) => Field[];
export {};
