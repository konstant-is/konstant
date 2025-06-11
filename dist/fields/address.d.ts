declare const fields: Record<"addressLine1" | "addressLine2" | "city" | "location" | "postalCode" | "state" | "country", string>;
type FieldKeys = keyof typeof fields;
export declare const addressField: (props?: import("../lib/field.js").FieldCreateType<{
    hideFields?: FieldKeys[];
}>) => import("payload").Field;
export {};
