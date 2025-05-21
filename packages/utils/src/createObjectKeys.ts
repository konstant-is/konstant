// Utility type to extract keys that are strings from a union type
type ExtractKeys<T> = T extends string ? T : never;

/**
 * Creates an object where each key maps to its own name as a string.
 * @param keys - Array of keys to create the object from.
 * @returns An object where each key is assigned its own name as the value.
 */
export const createObjectKeys = <T extends string>(
  keys: ExtractKeys<T>[]
): Record<T, string> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = key; // Assign the key to itself as the value
      return acc;
    },
    {} as Record<T, string>
  );
};
