/**
 * Capitalizes the first letter
 * @param str
 * @returns
 */
export const toCapitalized = (str: string = ""): string => {
  if (!str.length) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toKebabCase = (string: string): string =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

/**
 * Transforms a camelCase or PascalCase string into a readable label.
 * E.g., "camelCase" → "Camel Case", "PascalCase" → "Pascal Case".
 */
export const toReadable = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle consecutive uppercase letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
