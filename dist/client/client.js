'use client';
"use client";
import { Button, FieldLabel, TextInput, useConfig, useDocumentInfo, useField, useForm, useFormFields } from "@payloadcms/ui";
import React, { useCallback, useMemo } from "react";
import s from "slugify";
import { jsx, jsxs } from "react/jsx-runtime";
// src/utils/cx.ts
function cx(...args) {
	return args.flat().filter((x) => typeof x === "string").join(" ").trim();
}
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
// src/client/SlugField.module.css
var SlugField_module_default = {
	"ctr": "NVCC5W_ctr",
	"label_wrapper": "NVCC5W_label_wrapper",
	"lock_button": "NVCC5W_lock_button"
};
// src/client/SlugFieldClient.tsx
const SlugFieldClient = ({ custom, field, path, readOnly: readOnlyFromProps }) => {
	const { label } = field;
	const { autoIncrementSlug, checkboxFieldPath: checkboxFieldPathFromProps, slugifyOptions, watchFields } = custom;
	const checkboxFieldPath = path?.includes(".") ? `${path}.${checkboxFieldPathFromProps}` : checkboxFieldPathFromProps;
	const { setValue, value } = useField({ path: path || field.name });
	const { dispatchFields } = useForm();
	const checkboxValue = useFormFields(([fields]) => {
		return fields[checkboxFieldPath]?.value;
	});
	const fields = useFormFields(([fields]) => {
		return watchFields.map((watch) => fields[watch]);
	});
	const processedValue = useMemo(() => {
		const slug = generateSlug(fields, slugifyOptions);
		if (value !== slug && autoIncrementSlug) return value;
		return slug;
	}, [
		fields,
		slugifyOptions,
		value,
		autoIncrementSlug
	]);
	React.useEffect(() => {
		if (checkboxValue) {
			if (processedValue !== value) setValue(processedValue);
		}
	}, [
		setValue,
		checkboxValue,
		processedValue,
		value
	]);
	const handleLock = useCallback((e) => {
		e.preventDefault();
		dispatchFields({
			type: "UPDATE",
			path: checkboxFieldPath,
			value: !checkboxValue
		});
	}, [
		checkboxValue,
		checkboxFieldPath,
		dispatchFields
	]);
	const readOnly = readOnlyFromProps || checkboxValue;
	return /* @__PURE__ */ jsxs("div", {
		className: cx("field-type", SlugField_module_default.ctr),
		children: [/* @__PURE__ */ jsxs("div", {
			className: cx(SlugField_module_default.label_wrapper),
			children: [/* @__PURE__ */ jsx(FieldLabel, {
				hideLocale: false,
				htmlFor: `field-${path}`,
				label,
				localized: true,
				required: field.required
			}), /* @__PURE__ */ jsx(Button, {
				buttonStyle: "none",
				className: cx(SlugField_module_default.lock_button),
				onClick: handleLock,
				children: checkboxValue ? "Unlock" : "Lock"
			})]
		}), /* @__PURE__ */ jsx(TextInput, {
			onChange: setValue,
			path: path || field.name,
			readOnly: Boolean(readOnly),
			value
		})]
	});
};
// src/client/UrlCell.tsx
const UrlCell = (props) => {
	const { collectionSlug, rowData } = props;
	const breadcrumbs = (rowData.breadcrumbs || []).filter((c) => Boolean(c.id && c.doc)).map((c) => c).reverse();
	return /* @__PURE__ */ jsx("div", { children: breadcrumbs.map((b, index) => {
		const label = b.url.split("/").reverse()[0] || "<No Label>";
		const href = `/admin/collections/${collectionSlug}/${b.doc}`;
		return /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("a", {
			href,
			children: label
		}), index < breadcrumbs.length - 1 && /* @__PURE__ */ jsx("span", { children: " / " })] }, index);
	}) });
};
// src/client/PermalinkFieldClient.tsx
const PermalinkFieldClient = ({ custom }) => {
	const { config: { serverURL } } = useConfig();
	const url = serverURL ?? (typeof window !== "undefined" ? window.location.origin : "");
	const { id } = useDocumentInfo();
	const targetFieldValue = useFormFields(([fields]) => {
		return fields[custom.sourceField]?.value;
	});
	const processedValue = useMemo(() => {
		if (!targetFieldValue) return "";
		return `${url}${targetFieldValue}`;
	}, [url, targetFieldValue]);
	if (!id || !processedValue) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "field-type permalinksField",
		children: [
			/* @__PURE__ */ jsx("strong", { children: "Permalink:" }),
			" ",
			/* @__PURE__ */ jsx("a", {
				href: processedValue,
				rel: "noopener noreferrer",
				target: "_blank",
				children: processedValue
			})
		]
	});
};
export { PermalinkFieldClient, SlugFieldClient, UrlCell };

//# sourceMappingURL=client.js.map