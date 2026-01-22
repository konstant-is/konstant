/**
 * Hack to make 'slugify' import work with "type": "module".
 */
import s from "slugify";
import type { SlugifyOptions } from "./types.js";
export declare const slugify: typeof s.default;
type SlugifyOptionsWithRemove = {
    remove?: RegExp | string;
} & Omit<SlugifyOptions, "remove">;
export declare const defaultSlugify: Required<SlugifyOptions>;
/**
 * Generate a slug from an array of fields.
 * @param fields - The fields to generate the slug from.
 * @param slugifyOptions - Options for customizing slug generation.
 * @returns The generated slug.
 */
export declare const generateSlug: (fields: Array<{
    value?: unknown;
} | null | string | undefined>, slugifyOptions?: SlugifyOptionsWithRemove) => string;
/**
 * Normalize slugify options by converting `remove` to a string representation.
 * @param options - The slugify options to normalize.
 * @returns The normalized options.
 */
export declare const normalizeSlugOptions: (options?: SlugifyOptions) => SlugifyOptionsWithRemove;
export {};
