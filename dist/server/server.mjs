import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import s from "slugify";
// src/hooks/resolveLocalizedSlugs.ts
const resolveLocalizedSlugs = (context) => ({ data, operation, req }) => {
	const { locale, payload } = req;
	const { defaultLocale = context.fallbackLocale } = payload.config.localization || {};
	const currentLocale = locale || defaultLocale;
	const { localizedSlugFieldConfig } = context.fieldConfigs;
	if (operation === "create") return data;
	const sourceField = localizedSlugFieldConfig.sourceField ? data[localizedSlugFieldConfig.sourceField] : void 0;
	if (!sourceField) {
		payload.logger.error(`Error: Missing source field "${localizedSlugFieldConfig.sourceField}" while populating localized slugs.`);
		return data;
	}
	const localizedSlugField = data[localizedSlugFieldConfig.fieldName] || {};
	if (typeof localizedSlugField !== "object") {
		payload.logger.error(`Error: Localized slugs field "${localizedSlugFieldConfig.fieldName}" is not an object.`);
		return data;
	}
	const updatedLocalizedField = {
		...localizedSlugField,
		[currentLocale]: sourceField
	};
	return {
		...data,
		[localizedSlugFieldConfig.fieldName]: updatedLocalizedField
	};
};
// src/hooks/resolveLocalizedUrls.ts
const resolveLocalizedUrl = (context) => ({ data, operation, req }) => {
	const { locale, payload } = req;
	const { defaultLocale = context.fallbackLocale } = payload.config.localization || {};
	const currentLocale = locale || defaultLocale;
	const { localizedUrlFieldConfig } = context.fieldConfigs;
	if (operation === "create") return data;
	const sourceField = localizedUrlFieldConfig.sourceField ? data[localizedUrlFieldConfig.sourceField] : void 0;
	if (!sourceField) {
		payload.logger.error(`Error: Missing source field "${localizedUrlFieldConfig.sourceField}" while resolving localized url.`);
		return data;
	}
	const field = data[localizedUrlFieldConfig.fieldName] || {};
	if (typeof field !== "object") {
		payload.logger.error(`Error: Localized url field "${localizedUrlFieldConfig.fieldName}" is not an object.`);
		return data;
	}
	const updated = {
		...field,
		[currentLocale]: sourceField
	};
	return {
		...data,
		[localizedUrlFieldConfig.fieldName]: updated
	};
};
// src/utils/generateUrl.ts
const generateUrl = (context, data) => {
	const { urlFieldConfig } = context.fieldConfigs;
	const generatedUrl = typeof urlFieldConfig.generateUrl === "function" ? urlFieldConfig.generateUrl(data) : "";
	if (context.nestedDocsEnabled && data) return (Array.isArray(data.breadcrumbs) ? data.breadcrumbs : []).reverse()[0]?.url || generatedUrl;
	return generatedUrl;
};
const generateLocalizedUrl = ({ context, data, req }) => {
	const { locale, payload } = req;
	const { defaultLocale = context.fallbackLocale } = payload.config.localization || {};
	const url = generateUrl(context, data);
	switch (context.appendLocaleToUrl) {
		case "all": return `/${locale}${url}`;
		case "exclude-default": return locale === defaultLocale ? url : `/${locale}${url}`;
		default: return url;
	}
};
// src/hooks/resolveUrl.ts
const resolveUrl = (context) => ({ data, req }) => {
	const { urlFieldConfig } = context.fieldConfigs;
	const url = generateLocalizedUrl({
		context,
		data,
		req
	});
	return {
		...data,
		[urlFieldConfig.fieldName]: url
	};
};
const defaultValues = {
	appendLocaleToUrl: "exclude-default",
	fallbackLocale: "en",
	fields: {
		slug: {
			fieldName: "slug",
			lockFieldName: "slugLock",
			useFields: ["title"]
		},
		localizedSlug: {
			fieldName: "slugs",
			sourceField: "slug"
		},
		localizedUrl: {
			fieldName: "urls",
			sourceField: "url"
		},
		permalink: {
			fieldName: "permalink",
			sourceField: "url"
		},
		url: { fieldName: "url" }
	},
	permalinkEnabled: true,
	slugifyOptions: {
		locale: "en",
		lower: true,
		remove: /[*+~.()'"!:@]/g,
		replacement: "-",
		strict: true,
		trim: true
	}
};
// src/utils/createPluginContext.ts
const createPluginContext = (pluginConfig, locales) => {
	const fields = pluginConfig.fields || {};
	const slugFieldConfig = createFieldConfig("slug", fields.slug);
	const localizedSlugFieldConfig = createFieldConfig("localizedSlug", fields.localizedSlug, { sourceField: slugFieldConfig.fieldName });
	const urlFieldConfig = createFieldConfig("url", fields.url);
	const localizedUrlFieldConfig = createFieldConfig("localizedUrl", fields.localizedUrl, { sourceField: urlFieldConfig.fieldName });
	const permalinkFieldConfig = createFieldConfig("permalink", fields.permalink, { sourceField: urlFieldConfig.fieldName });
	return {
		appendLocaleToUrl: pluginConfig.appendLocaleToUrl || defaultValues.appendLocaleToUrl,
		collections: pluginConfig.collections,
		fallbackLocale: pluginConfig.appendLocaleToUrl || defaultValues.fallbackLocale,
		fieldConfigs: {
			localizedSlugFieldConfig,
			localizedUrlFieldConfig,
			permalinkFieldConfig,
			slugFieldConfig,
			urlFieldConfig
		},
		locales,
		nestedDocsEnabled: Boolean(pluginConfig.nestedDocsPlugin),
		permalinkEnabled: pluginConfig.permalinkEnabled ?? defaultValues.permalinkEnabled,
		slugifyOptions: {
			...defaultValues.slugifyOptions,
			...pluginConfig.slugifyOptions || {}
		}
	};
};
const createFieldConfig = (fieldKey, config, injected) => {
	const defaultConfig = defaultValues.fields[fieldKey];
	if (!defaultConfig) throw new Error(`Invalid field key: ${fieldKey}`);
	return {
		...defaultConfig,
		...injected,
		...config
	};
};
// src/utils/createPluginField.ts
function createPluginField(fn) {
	return fn;
}
// src/fields/localizedSlugField.ts
const createLocalizedSlugsField = createPluginField(({ context, fieldConfig }) => ({
	name: fieldConfig.fieldName,
	type: "group",
	admin: {
		description: "Automatically generated localized slugs.",
		readOnly: true
	},
	fields: context.locales.map((locale) => ({
		name: locale,
		type: "text",
		defaultValue: "",
		localized: false
	})),
	localized: false
}));
// src/fields/localizedUrlField.ts
const createLocalizedUrlField = createPluginField(({ context, fieldConfig }) => {
	return {
		name: fieldConfig.fieldName,
		type: "group",
		admin: {
			description: "Automatically generated localized urls.",
			readOnly: true
		},
		fields: context.locales.map((locale) => ({
			name: locale,
			type: "text",
			defaultValue: "",
			localized: false
		})),
		localized: false
	};
});
// src/utils/getPluginPath.ts
const PLUGIN_PATH = "@konstant/plugin-payload-navigation";
const getPluginPath = (type, path) => {
	return `${PLUGIN_PATH}/${type}${path}`;
};
// src/fields/permalinkField.ts
const createPermalinkField = createPluginField(({ fieldConfig }) => {
	return {
		name: fieldConfig.fieldName,
		type: "ui",
		admin: { components: { Field: {
			clientProps: { custom: { sourceField: fieldConfig.sourceField } },
			path: getPluginPath("client", "#PermalinkFieldClient")
		} } }
	};
});
// src/utils/slugify.ts
/**
* Hack to make 'slugify' import work with "type": "module".
*/
const slugify = s.default || s;
slugify.extend({
	á: "a",
	Á: "a",
	é: "e",
	É: "e",
	í: "i",
	Í: "i",
	ó: "o",
	Ó: "o",
	ú: "u",
	Ú: "u",
	ý: "y",
	Ý: "y",
	ö: "o",
	Ö: "o",
	æ: "ae",
	Æ: "ae",
	ð: "d",
	Ð: "d",
	þ: "th",
	Þ: "th"
});
/**
* Convert a string representation of a RegExp (e.g., `/pattern/flags`) into a RegExp object.
* @param regexString - The string representation of a RegExp.
* @returns The RegExp object.
*/
const stringToRegex = (regexString) => {
	const pattern = regexString.replace(/^\/|\/[gimsuy]*$/g, "");
	const flags = regexString.match(/\/([gimsuy]*)$/)?.[1] || "";
	return new RegExp(pattern, flags);
};
/**
* Merge user-provided slugify options with default values.
* @param opts - The user-provided slugify options.
* @returns The merged options.
*/
const getOptions = (opts) => {
	const remove = typeof opts.remove === "string" ? stringToRegex(opts.remove) : opts.remove;
	return {
		...defaultValues.slugifyOptions,
		...opts,
		remove: remove || defaultValues.slugifyOptions.remove
	};
};
/**
* Generate a slug from an array of fields.
* @param fields - The fields to generate the slug from.
* @param slugifyOptions - Options for customizing slug generation.
* @returns The generated slug.
*/
const generateSlug = (fields, slugifyOptions) => {
	const options = getOptions(slugifyOptions);
	return fields.filter((item) => Boolean(item && (typeof item === "string" || item?.value))).map((item) => slugify(typeof item === "string" ? item : String(item?.value), { ...options })).join(options.replacement);
};
/**
* Normalize slugify options by converting `remove` to a string representation.
* @param options - The slugify options to normalize.
* @returns The normalized options.
*/
const normalizeSlugOptions = (options) => {
	const { remove, ...rest } = options;
	return {
		...rest,
		remove: `${remove}`
	};
};
// src/fields/slugField.ts
const validateSlug = (pluginContext) => ({ data, req, siblingData, value }) => {
	const { slugFieldConfig } = pluginContext.fieldConfigs;
	if (!siblingData[slugFieldConfig.lockFieldName]) return value;
	const missingFields = [];
	const fields = slugFieldConfig.useFields.map((field) => {
		const fieldValue = data?.[field] || null;
		if (!fieldValue) missingFields.push(field);
		return fieldValue;
	});
	if (missingFields.length > 0) {
		req.payload.logger.warn(`Missing fields for slug generation: ${missingFields.map((f) => f).join(", ")}`);
		return value;
	}
	return generateSlug(fields, pluginContext.slugifyOptions);
};
const uniqueSlug = (pluginContext) => async ({ collection, data, req, value }) => {
	const { slugFieldConfig } = pluginContext.fieldConfigs;
	const currentDocId = req.routeParams?.id || data?.id;
	let slug = value;
	let suffix = 1;
	if (slugFieldConfig.autoIncrementSlug == false || !collection?.slug || !slug) return value;
	while (true) {
		if ((await req.payload.find({
			collection: collection.slug,
			where: { slug: { equals: slug } }
		}).then((result) => result.docs.filter((doc) => doc.id !== currentDocId))).length === 0) return slug;
		slug = `${value}-${suffix}`;
		suffix++;
	}
};
const createSlugField = createPluginField(({ context, fieldConfig }) => {
	const { autoIncrementSlug, useFields = ["title"] } = fieldConfig;
	const checkBoxField = {
		name: "slugLock",
		type: "checkbox",
		defaultValue: true,
		admin: {
			hidden: true,
			position: "sidebar"
		}
	};
	return [{
		name: "slug",
		type: "text",
		admin: {
			components: { Field: {
				clientProps: { custom: {
					autoIncrementSlug,
					checkboxFieldPath: checkBoxField.name,
					slugifyOptions: normalizeSlugOptions(context.slugifyOptions),
					watchFields: useFields
				} },
				path: getPluginPath("client", "#SlugFieldClient")
			} },
			position: "sidebar"
		},
		hooks: {
			beforeChange: [uniqueSlug(context)],
			beforeValidate: [validateSlug(context)]
		},
		index: true,
		localized: true,
		required: true,
		unique: true
	}, checkBoxField];
});
// src/fields/urlField.ts
const validateUrlField = (context) => ({ data }) => {
	return generateUrl(context, data);
};
const createUrlField = createPluginField(({ context, fieldConfig }) => {
	return {
		name: fieldConfig.fieldName,
		type: "text",
		admin: {
			components: { Cell: getPluginPath("client", "#UrlCell") },
			description: "Automatically generated url",
			position: "sidebar",
			readOnly: true
		},
		defaultValue: "",
		hooks: { beforeValidate: [validateUrlField(context)] },
		index: false,
		localized: true,
		required: true
	};
});
// src/utils/enhanceFields.ts
const enhanceFields = ({ context, fields }) => {
	let updatedFields = [...fields];
	const indexedFields = fields.reduce((index, field) => {
		if ("name" in field && typeof field.name === "string") index[field.name] = field;
		return index;
	}, {});
	const addFields = (newFields) => {
		newFields.forEach((field) => {
			if ("name" in field && typeof field.name === "string") {
				if (!indexedFields[field.name]) {
					updatedFields.push(field);
					indexedFields[field.name] = field;
				}
			} else console.warn("Field without a name encountered. Skipping:", field);
		});
	};
	const { localizedSlugFieldConfig, localizedUrlFieldConfig, permalinkFieldConfig, slugFieldConfig, urlFieldConfig } = context.fieldConfigs;
	if (!indexedFields[slugFieldConfig.fieldName]) addFields(createSlugField({
		context,
		fieldConfig: slugFieldConfig
	}));
	if (!indexedFields[localizedSlugFieldConfig.fieldName]) addFields([createLocalizedSlugsField({
		context,
		fieldConfig: localizedSlugFieldConfig
	})]);
	if (!indexedFields[urlFieldConfig.fieldName]) addFields([createUrlField({
		context,
		fieldConfig: urlFieldConfig
	})]);
	if (!indexedFields[localizedUrlFieldConfig.fieldName]) addFields([createLocalizedUrlField({
		context,
		fieldConfig: localizedUrlFieldConfig
	})]);
	if (context.permalinkEnabled && !indexedFields[permalinkFieldConfig.fieldName]) updatedFields = [createPermalinkField({
		context,
		fieldConfig: permalinkFieldConfig
	}), ...updatedFields];
	return updatedFields;
};
// src/utils/getLocals.ts
const getLocales = (config) => {
	const { locales } = config.localization || {};
	if (!locales || locales.length === 0) throw new Error("Localization is required but not enabled. Please configure 'localization.locales' in Payload CMS.");
	return locales.map((locale) => {
		return typeof locale === "string" ? locale : locale.code;
	});
};
// src/utils/mergeHooks.ts
const mergeHooks = (newHooks, existingHooks) => {
	return [...existingHooks || [], ...newHooks];
};
// src/plugin.ts
const navigationPlugin = (navigationConfig) => async (config) => {
	if (navigationConfig.disabled) return config;
	const locales = getLocales(config);
	let enhancedConfig = config;
	if (navigationConfig.nestedDocsPlugin) enhancedConfig = await nestedDocsPlugin({
		collections: navigationConfig.collections,
		...navigationConfig.nestedDocsPlugin
	})(enhancedConfig);
	const pluginConfig = createPluginContext(navigationConfig, locales);
	return {
		...config,
		collections: (enhancedConfig.collections || []).map((c) => createCollection(pluginConfig, c))
	};
};
const createCollection = (context, collection) => {
	if (!context.collections.includes(collection.slug)) return collection;
	const fields = enhanceFields({
		context,
		fields: collection.fields
	});
	return {
		...collection,
		fields,
		hooks: {
			...collection.hooks || {},
			beforeChange: mergeHooks([
				resolveUrl(context),
				resolveLocalizedUrl(context),
				resolveLocalizedSlugs(context)
			], collection.hooks?.beforeChange)
		}
	};
};
export { navigationPlugin };

//# sourceMappingURL=server.mjs.map