// Utility type to extract keys that are strings from a union type
/**
 * Creates an object where each key maps to its own name as a string.
 * @param keys - Array of keys to create the object from.
 * @returns An object where each key is assigned its own name as the value.
 */ export const createObjectKeys = (keys)=>{
    return keys.reduce((acc, key)=>{
        acc[key] = key; // Assign the key to itself as the value
        return acc;
    }, {});
};

//# sourceMappingURL=createObjectKeys.js.map