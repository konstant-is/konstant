/**
 * Hack to make 'slugify' import work with "type": "module".
 */ import s from "slugify";
// Fallback for CommonJS or ESM default export
export const slugify = s.default || s;
export const defaultSlugify = {
    locale: "en",
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: "-",
    strict: true,
    trim: true
};
/**
 * Convert a string representation of a RegExp (e.g., `/pattern/flags`) into a RegExp object.
 * @param regexString - The string representation of a RegExp.
 * @returns The RegExp object.
 */ const stringToRegex = (regexString)=>{
    const pattern = regexString.replace(/^\/|\/[gimsuy]*$/g, ""); // Strip leading/trailing slashes and flags
    const flags = regexString.match(/\/([gimsuy]*)$/)?.[1] || ""; // Extract flags (if any)
    return new RegExp(pattern, flags);
};
/**
 * Merge user-provided slugify options with default values.
 * @param opts - The user-provided slugify options.
 * @returns The merged options.
 */ const getOptions = (opts)=>{
    const remove = typeof opts.remove === "string" ? stringToRegex(opts.remove) : opts.remove;
    return {
        ...defaultSlugify,
        ...opts,
        remove: remove || defaultSlugify.remove
    };
};
/**
 * Generate a slug from an array of fields.
 * @param fields - The fields to generate the slug from.
 * @param slugifyOptions - Options for customizing slug generation.
 * @returns The generated slug.
 */ export const generateSlug = (fields, slugifyOptions = defaultSlugify)=>{
    const options = getOptions(slugifyOptions);
    return fields.filter((item)=>Boolean(item && (typeof item === "string" || item?.value))) // Filter null/undefined
    .map((item)=>slugify(typeof item === "string" ? item : String(item?.value), options)).join(options.replacement); // Join the slugified parts
};
/**
 * Normalize slugify options by converting `remove` to a string representation.
 * @param options - The slugify options to normalize.
 * @returns The normalized options.
 */ export const normalizeSlugOptions = (options = defaultSlugify)=>{
    const { remove, ...rest } = options;
    return {
        ...rest,
        remove: `${remove}`
    };
};

//# sourceMappingURL=helpers.js.map