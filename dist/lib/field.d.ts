import type { Field } from "payload";
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
export {};
