'use client';
"use client";
import { Button, FieldLabel, TextInput, useField, useForm, useFormFields, useRowLabel } from "@payloadcms/ui";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { useCallback, useMemo } from "react";
import s from "slugify";
typeof window !== "undefined" && window.document && window.document.createElement;
/**
* Get a deeply nested property of an object based on a dot-separated path.
* @param obj - The object to traverse.
* @param path - Dot-separated string representing the path to the property.
* @returns The value at the specified path or undefined if the path does not exist.
*/
const getNestedProperty = (obj, path) => {
	return path.split(".").reduce((acc, key) => acc && typeof acc === "object" && key in acc ? acc[key] : void 0, obj);
};
// src/components/arrayRowLabel.tsx
const ArrayRowLabel = (props) => {
	const { label } = useArrayRowLabel(props);
	return /* @__PURE__ */ jsx("div", { children: label });
};
const useArrayRowLabel = (props) => {
	const { fallback, fieldName, prefix } = props;
	const { data, rowNumber } = useRowLabel();
	const rowNr = `${(rowNumber || 0) + 1}`;
	const getLabel = () => {
		return getNestedProperty(data, fieldName) || fallback || "New row";
	};
	const getFullLabel = () => {
		const label = getLabel();
		return `${prefix || ""} ${rowNr}: ${label}`;
	};
	return {
		label: getFullLabel(),
		rowNr: `${(rowNumber || 0) + 1}`
	};
};
// src/lib/cx.ts
function cx(...args) {
	return args.flat().filter((x) => typeof x === "string").join(" ").trim();
}
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
// src/fields/slug/slugField.module.css
var slugField_module_default = {
	"ctr": "IQoxmW_ctr",
	"label_wrapper": "IQoxmW_label_wrapper",
	"lock_button": "IQoxmW_lock_button"
};
// src/fields/slug/slugFieldClient.tsx
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
		className: cx("field-type", slugField_module_default.ctr),
		children: [/* @__PURE__ */ jsxs("div", {
			className: cx(slugField_module_default.label_wrapper),
			children: [/* @__PURE__ */ jsx(FieldLabel, {
				hideLocale: false,
				htmlFor: `field-${path}`,
				label,
				localized: true,
				required: field.required
			}), /* @__PURE__ */ jsx(Button, {
				buttonStyle: "none",
				className: cx(slugField_module_default.lock_button),
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
export { ArrayRowLabel, SlugFieldClient };

//# sourceMappingURL=client.js.map