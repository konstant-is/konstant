type ExtractKeys<T> = T extends string ? T : never;
/**
 * Creates an object where each key maps to its own name as a string.
 * @param keys - Array of keys to create the object from.
 * @returns An object where each key is assigned its own name as the value.
 */
export declare const createObjectKeys: <T extends string>(keys: ExtractKeys<T>[]) => Record<T, string>;
export {};
