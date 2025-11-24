import { getReference } from "./getReference.js";
export const getRelation = (props)=>{
    const { relationTo, value } = props;
    const getValue = ()=>getReference(value);
    const getOrFetchValue = async (queryCb)=>{
        const resolvedValue = getValue();
        if (resolvedValue !== null) {
            return resolvedValue;
        }
        try {
            const result = await queryCb({
                id: value,
                collection: relationTo
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
        relationTo
    };
};

//# sourceMappingURL=getRelation.js.map