import { createObjectKeys, toCapitalized, toReadable } from "@konstant/utils";
import merge from "lodash/merge.js";
import s from "slugify";
// src/lib/createConfigs.ts
const createCollectionConfig = (config) => {
	return {
		access: {
			read: () => true,
			...config.access
		},
		...config
	};
};
const createGlobalConfig = (config) => {
	return {
		access: {
			read: () => true,
			...config.access
		},
		...config
	};
};
// src/lib/createFieldOptions.ts
const createFieldOptions = (inputs) => {
	const options = [];
	const values = {};
	for (const input of inputs) {
		const option = typeof input === "string" ? {
			label: toReadable(input),
			value: input
		} : input;
		options.push(option);
		values[option.value] = option.value;
	}
	return {
		options,
		values
	};
};
// src/lib/field.ts
const field = (props) => {
	return { ...props };
};
function createField(fieldFn) {
	return (props = {}) => {
		const field = fieldFn(props);
		return merge(field, props.overrides || {});
	};
}
// src/lib/getLocale.ts
/**
* Checks if a given locale is valid based on the available locale codes.
* @param locale - The locale string to validate.
* @param localeCodes - The list of valid locale codes.
* @returns True if the locale is valid, otherwise false.
*/
const isLocale = (locale, localeCodes) => {
	return !!locale && localeCodes.includes(locale);
};
/**
* Validates and returns the locale.
* @param config - The Payload config object.
* @param locale - The locale string to validate.
* @returns The validated locale.
*/
const getLocale = (config, locale) => {
	const { localization } = config;
	if (!localization) throw new Error(`Localization is not supported by Payload`);
	const { defaultLocale, localeCodes } = localization;
	if (isLocale(locale, localeCodes)) return locale;
	return defaultLocale;
};
// src/lib/getReference.ts
function getReference(value) {
	return typeof value !== "string" ? value : null;
}
// src/lib/getRelation.ts
const getRelation = (props) => {
	const { relationTo, value } = props;
	const getValue = () => getReference(value);
	const getOrFetchValue = async (queryCb) => {
		const resolvedValue = getValue();
		if (resolvedValue !== null) return resolvedValue;
		try {
			return await queryCb({
				id: value,
				collection: relationTo
			});
		} catch (e) {
			console.error(e);
			return null;
		}
	};
	return {
		getOrFetchValue,
		getValue,
		relationTo
	};
};
// src/fields/socials.ts
const socials = createFieldOptions([
	"facebook",
	"instagram",
	"twitter",
	"strava",
	{
		label: "TikTok",
		value: "tikTok"
	},
	{
		label: "LinkedIn",
		value: "linkedIn"
	}
]);
const socialMediaField = () => {
	return field({
		type: "group",
		name: "socialMedia",
		fields: [field({
			type: "select",
			name: "selected",
			label: "Select social media",
			hasMany: true,
			options: socials.options
		}), ...socials.options.map((s) => {
			const { label, value } = s;
			return field({
				name: value,
				label: `${label} URL`,
				type: "text",
				admin: { condition: (_, siblingData) => Array.isArray(siblingData.selected) && siblingData.selected.includes(value) },
				hooks: { beforeValidate: [({ value }) => {
					if (!value) return value;
					if (!/^https?:\/\//i.test(value)) return `https://${value}`;
					return value;
				}] },
				validate: (val) => {
					try {
						new URL(val);
						return true;
					} catch (err) {
						return "Invalid URL";
					}
				}
			});
		})]
	});
};
// src/fields/address.ts
createObjectKeys([
	"addressLine1",
	"addressLine2",
	"city",
	"location",
	"postalCode",
	"state",
	"country"
]);
const addressField = createField((props) => {
	const fieldCondition = (fieldName) => {
		if (!props.hideFields?.length) return true;
		return props.hideFields.includes(fieldName) ? false : true;
	};
	return field({
		name: props.name ?? "address",
		type: "group",
		admin: {
			condition: props.condition,
			description: props.description,
			hideGutter: props.hideGutter
		},
		fields: [
			field({
				type: "row",
				fields: [field({
					name: "addressLine1",
					type: "text",
					label: "Address",
					localized: false,
					required: false
				}), field({
					name: "addressLine2",
					type: "text",
					admin: { condition: (_) => fieldCondition("addressLine2") },
					label: "Address extra",
					localized: false,
					required: false
				})]
			}),
			field({
				type: "row",
				fields: [
					field({
						name: "state",
						type: "text",
						admin: { condition: (_) => fieldCondition("state") },
						label: "State",
						localized: false,
						required: false
					}),
					field({
						name: "city",
						type: "text",
						admin: { condition: (_) => fieldCondition("city") },
						label: "City",
						localized: false,
						required: false
					}),
					field({
						name: "postalCode",
						type: "text",
						admin: { condition: (_) => fieldCondition("postalCode") },
						label: "Postal Code",
						localized: false,
						required: false
					})
				]
			}),
			field({
				name: "country",
				type: "text",
				admin: { condition: (_) => fieldCondition("country") },
				label: "Country",
				localized: true,
				required: false
			}),
			field({
				name: "location",
				type: "point",
				admin: { condition: (_) => fieldCondition("location") },
				localized: false,
				required: false
			})
		],
		interfaceName: "Address",
		label: props?.label,
		localized: false
	});
});
// src/fields/arrayRowLabelField.ts
const arrayRowLabelField = (props) => {
	return {
		clientProps: props,
		path: "@konstant/payload/client#ArrayRowLabel"
	};
};
// src/fields/timeField.ts
const timeField = createField((props) => field({
	name: props.name || "time",
	type: "date",
	label: props.label || "Time",
	localized: props.localized || false,
	admin: {
		condition: props.condition,
		date: {
			displayFormat: "HH:mm",
			pickerAppearance: "timeOnly",
			timeFormat: "HH:mm"
		},
		hidden: props.hidden
	}
}));
// src/fields/openingHours.ts
const weekdaysMap = {
	1: "Mondays",
	2: "Tuesdays",
	3: "Wednesdays",
	4: "Thursdays",
	5: "Fridays",
	6: "Saturdays",
	7: "Sundays"
};
const dayOptions = Object.keys(weekdaysMap).map((key) => ({
	label: weekdaysMap[key] || "",
	value: key
}));
const openingHoursField = () => {
	const items = field({
		name: "items",
		type: "array",
		admin: { components: { RowLabel: arrayRowLabelField({
			fieldName: "label",
			prefix: ""
		}) } },
		fields: [
			field({
				name: "days",
				type: "select",
				defaultValue: [],
				hasMany: true,
				localized: false,
				options: dayOptions,
				required: true
			}),
			field({
				name: "label",
				type: "text",
				localized: true,
				required: true
			}),
			...timeFields()
		],
		label: "Opening Hours"
	});
	const customOpeningHours = field({
		name: "custom",
		type: "array",
		fields: [
			field({
				name: "label",
				type: "text",
				localized: true,
				required: true
			}),
			field({
				name: "date",
				type: "date",
				admin: { date: {
					displayFormat: "d MMM yyy",
					pickerAppearance: "dayOnly"
				} },
				label: "Date",
				localized: false,
				required: true
			}),
			...timeFields()
		],
		label: "Custom Opening Hours"
	});
	return field({
		name: "openingHours",
		type: "group",
		fields: [items, customOpeningHours],
		interfaceName: "OpeningHours",
		label: ""
	});
};
const timeFields = () => {
	return [
		field({
			type: "row",
			admin: { condition: (_, siblingData) => !siblingData.isClosed },
			fields: ["openingTime", "closingTime"].map((name) => timeField({
				name,
				label: toCapitalized(name)
			}))
		}),
		field({
			name: "isClosed",
			type: "checkbox",
			label: "Closed whole day"
		}),
		field({
			name: "closedLabel",
			type: "text",
			admin: { condition: (_, siblingData) => siblingData.isClosed }
		})
	];
};
// src/fields/slug/helpers.ts
/**
* Hack to make 'slugify' import work with "type": "module".
*/
const slugify = s.default || s;
const defaultSlugify = {
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
*/
const generateSlug = (fields, slugifyOptions = defaultSlugify) => {
	const options = getOptions(slugifyOptions);
	return fields.filter((item) => Boolean(item && (typeof item === "string" || item?.value))).map((item) => slugify(typeof item === "string" ? item : String(item?.value), options)).join(options.replacement);
};
/**
* Normalize slugify options by converting `remove` to a string representation.
* @param options - The slugify options to normalize.
* @returns The normalized options.
*/
const normalizeSlugOptions = (options = defaultSlugify) => {
	const { remove, ...rest } = options;
	return {
		...rest,
		remove: `${remove}`
	};
};
// src/lib/getLibPath.ts
const PLUGIN_PATH = "@konstant/payload";
const getLibPath = (type, path) => {
	return `${PLUGIN_PATH}/${type}${path}`;
};
// src/fields/slug/slugField.ts
const validateSlug = (config) => ({ data, req, siblingData, value }) => {
	if (!siblingData[config.lockFieldName]) return value;
	const missingFields = [];
	const fields = config.useFields.map((field) => {
		const fieldValue = data?.[field] || null;
		if (!fieldValue) missingFields.push(field);
		return fieldValue;
	});
	if (missingFields.length > 0) {
		req.payload.logger.warn(`Missing fields for slug generation: ${missingFields.map((f) => f).join(", ")}`);
		return value;
	}
	return generateSlug(fields, config.slugifyOptions);
};
const uniqueSlug = (config) => async ({ collection, data, req, value }) => {
	const currentDocId = req.routeParams?.id || data?.id;
	let slug = value;
	let suffix = 1;
	if (config.autoIncrementSlug == false || !collection?.slug || !slug) return value;
	while (true) {
		if ((await req.payload.find({
			collection: collection.slug,
			where: { slug: { equals: slug } }
		}).then((result) => result.docs.filter((doc) => doc.id !== currentDocId))).length === 0) return slug;
		slug = `${value}-${suffix}`;
		suffix++;
	}
};
const slugField = (props) => {
	const config = {
		fieldName: "slug",
		lockFieldName: "slugLock",
		slugifyOptions: defaultSlugify,
		autoIncrementSlug: true,
		...props
	};
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
					autoIncrementSlug: config.autoIncrementSlug,
					checkboxFieldPath: checkBoxField.name,
					slugifyOptions: normalizeSlugOptions(config.slugifyOptions),
					watchFields: config.useFields
				} },
				path: getLibPath("client", "#SlugFieldClient")
			} },
			position: "sidebar"
		},
		hooks: {
			beforeChange: [uniqueSlug(config)],
			beforeValidate: [validateSlug(config)]
		},
		index: true,
		localized: true,
		required: true,
		unique: true
	}, checkBoxField];
};
export { addressField, arrayRowLabelField, createCollectionConfig, createField, createFieldOptions, createGlobalConfig, field, getLocale, getReference, getRelation, openingHoursField, slugField, socialMediaField, timeField, weekdaysMap };

//# sourceMappingURL=server.mjs.map