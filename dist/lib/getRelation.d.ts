import { CollectionSlug, DefaultDocumentIDType } from "payload";
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
export {};
