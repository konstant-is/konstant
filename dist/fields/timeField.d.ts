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
