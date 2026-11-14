// src/lib/canUseDom.ts
const canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
// src/lib/createObjectKeys.ts
/**
* Creates an object where each key maps to its own name as a string.
* @param keys - Array of keys to create the object from.
* @returns An object where each key is assigned its own name as the value.
*/
const createObjectKeys = (keys) => {
	return keys.reduce((acc, key) => {
		acc[key] = key;
		return acc;
	}, {});
};
// src/lib/format.ts
/**
* Capitalizes the first letter
* @param str
* @returns
*/
const toCapitalized = (str = "") => {
	if (!str.length) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
const toKebabCase = (string) => string.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/\s+/g, "-").toLowerCase();
/**
* Transforms a camelCase or PascalCase string into a readable label.
* E.g., "camelCase" → "Camel Case", "PascalCase" → "Pascal Case".
*/
const toReadable = (str) => {
	return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
// src/lib/mapAsync.ts
async function mapAsync(arr, callbackfn) {
	return Promise.all(arr.map(callbackfn));
}
// src/lib/getClientSideUrl.ts
const getClientSideURL = () => {
	if (canUseDOM) {
		const protocol = window.location.protocol;
		const domain = window.location.hostname;
		const port = window.location.port;
		return `${protocol}//${domain}${port ? `:${port}` : ""}`;
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	return process.env.NEXT_PUBLIC_SERVER_URL || "";
};
// src/lib/getNestedProperty.ts
/**
* Get a deeply nested property of an object based on a dot-separated path.
* @param obj - The object to traverse.
* @param path - Dot-separated string representing the path to the property.
* @returns The value at the specified path or undefined if the path does not exist.
*/
const getNestedProperty = (obj, path) => {
	return path.split(".").reduce((acc, key) => acc && typeof acc === "object" && key in acc ? acc[key] : void 0, obj);
};
// src/lib/getServerSideUrl.ts
const getServerSideURL = () => {
	let url = process.env.NEXT_PUBLIC_SERVER_URL;
	if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	if (!url) url = "http://localhost:3000";
	return url;
};
// src/lib/deepMerge.ts
/**
* Simple object check.
* @param item
* @returns {boolean}
*/
function isObject(item) {
	return Boolean(item && typeof item === "object" && !Array.isArray(item));
}
/**
* Deep merge two objects.
* @param target
* @param ...sources
*/
function deepMerge(obj1, obj2) {
	const output = { ...obj1 };
	for (const key in obj2) if (Object.prototype.hasOwnProperty.call(obj2, key)) {
		if (typeof obj2[key] === "object" && !Array.isArray(obj2[key]) && obj1[key]) output[key] = deepMerge(obj1[key], obj2[key]);
		else output[key] = obj2[key];
	}
	return output;
}
export { canUseDOM, createObjectKeys, deepMerge, getClientSideURL, getNestedProperty, getServerSideURL, isObject, mapAsync, toCapitalized, toKebabCase, toReadable };

//# sourceMappingURL=index.js.map