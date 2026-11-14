export declare const canUseDOM: boolean;
type ExtractKeys<T> = T extends string ? T : never;
/**
 * Creates an object where each key maps to its own name as a string.
 * @param keys - Array of keys to create the object from.
 * @returns An object where each key is assigned its own name as the value.
 */
export declare const createObjectKeys: <T extends string>(keys: ExtractKeys<T>[]) => Record<T, string>;
/**
 * Capitalizes the first letter
 * @param str
 * @returns
 */
export declare const toCapitalized: (str?: string) => string;
export declare const toKebabCase: (string: string) => string;
/**
 * Transforms a camelCase or PascalCase string into a readable label.
 * E.g., "camelCase" → "Camel Case", "PascalCase" → "Pascal Case".
 */
export declare const toReadable: (str: string) => string;
export declare function mapAsync<T, U>(arr: T[], callbackfn: (item: T, index: number, array: T[]) => Promise<U>): Promise<U[]>;
export declare const getClientSideURL: () => string;
/**
 * Get a deeply nested property of an object based on a dot-separated path.
 * @param obj - The object to traverse.
 * @param path - Dot-separated string representing the path to the property.
 * @returns The value at the specified path or undefined if the path does not exist.
 */
export declare const getNestedProperty: (obj: Record<string, unknown>, path: string) => any;
export declare const getServerSideURL: () => string;
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export declare function isObject(item: unknown): boolean;
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export declare function deepMerge(obj1: any, obj2: any): any;
export {};