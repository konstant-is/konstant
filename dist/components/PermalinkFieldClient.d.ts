import type { UIFieldClientProps } from "payload";
type Props = {
    custom: {
        serverURL: string;
        sourceField: string;
    };
} & UIFieldClientProps;
export declare const PermalinkFieldClient: React.FC<Props>;
export {};
