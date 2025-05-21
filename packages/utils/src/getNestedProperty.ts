// @ts-nocheck

/**
 * Get a deeply nested property of an object based on a dot-separated path.
 * @param obj - The object to traverse.
 * @param path - Dot-separated string representing the path to the property.
 * @returns The value at the specified path or undefined if the path does not exist.
 */
export const getNestedProperty = (
  obj: Record<string, unknown>,
  path: string
): any => {
  return path
    .split(".") // Split the path into individual keys
    .reduce(
      (acc, key) =>
        acc && typeof acc === "object" && key in acc ? acc[key] : undefined,
      obj
    ); // Traverse the object based on the keys
};
