type FieldOption<T extends string = string> = {
    label: string;
    value: T;
};
type FieldInput<T extends string = string> = T | FieldOption<T>;
export declare const createFieldOptions: <T extends string>(inputs: FieldInput<T>[]) => {
    options: FieldOption<T>[];
    values: Record<T, T>;
};
export {};
