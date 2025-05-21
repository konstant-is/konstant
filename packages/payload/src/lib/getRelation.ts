import { CollectionSlug, DefaultDocumentIDType } from "payload";
import { getReference } from "./getReference.js";

type RelationProps<T> = {
  relationTo: string;
  value: T | DefaultDocumentIDType;
};

type FetchDocArgs = { id: DefaultDocumentIDType; collection: CollectionSlug };

export const getRelation = <T>(props: RelationProps<T>) => {
  const { relationTo, value } = props;

  const getValue = (): null | T => getReference(value);

  const getOrFetchValue = async (
    queryCb: (args: FetchDocArgs) => Promise<T | null>
  ): Promise<T | null> => {
    const resolvedValue = getValue();
    if (resolvedValue !== null) {
      return resolvedValue;
    }

    try {
      const result = await queryCb({
        id: value as DefaultDocumentIDType,
        collection: relationTo,
      });

      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return {
    getOrFetchValue,
    getValue,
    relationTo,
  };
};
