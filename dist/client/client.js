'use client';
"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/lib/utils.ts
/**
* Replaces placeholders (e.g., ${count}) in translation strings.
*/
const replaceParams = (template, params = {}) => Object.entries(params).reduce((result, [key, value]) => result.replace(`\${${key}}`, String(value)), template);
/**
* Creates a translation function (`t`) from a dictionary.
* This function can be used both on the server and in a client provider.
*/
function createTranslation(locale, config) {
	return (key, params) => {
		const entry = config.translations[key];
		if (!entry) return String(key);
		const raw = entry[locale] ?? entry[config.defaultLocale] ?? entry.key;
		return params ? replaceParams(raw) : raw;
	};
}
// src/components/createTranslationContext.tsx
function useMounted() {
	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);
	return useCallback(() => isMounted.current, []);
}
function createTranslationContext() {
	return createContext(void 0);
}
function createTranslationProvider(TranslationContext) {
	return function TranslationProvider({ children, config, locale: initialLocale }) {
		const isMounted = useMounted();
		const [currentLocale, setLocale] = useState(initialLocale);
		const [attributes, setAttributes] = useState({ locale: initialLocale });
		useEffect(() => {
			setLocale(initialLocale);
		}, [initialLocale]);
		const updateAttributes = useCallback((values) => {
			setAttributes({
				locale: currentLocale,
				...values
			});
		}, [currentLocale]);
		const renderAttributes = () => Object.entries(attributes).reduce((acc, [key, value]) => {
			acc[`data-${key}`] = value;
			return acc;
		}, {});
		const t = createTranslation(currentLocale, config);
		const value = {
			attributes,
			currentLocale,
			defaultLocale: config.defaultLocale,
			isMounted,
			locales: Object.entries(config.locales).map(([code, label]) => ({
				code,
				label
			})),
			setAttributes: updateAttributes,
			setLocale,
			t
		};
		return /* @__PURE__ */ jsxs(TranslationContext.Provider, {
			value,
			children: [children, /* @__PURE__ */ jsx("div", {
				id: "lang",
				...renderAttributes()
			})]
		});
	};
}
function createUseTranslation(TranslationContext) {
	return function useTranslation() {
		const ctx = useContext(TranslationContext);
		if (!ctx) throw new Error("useTranslation must be used within a TranslationProvider");
		return ctx;
	};
}
export { createTranslationContext, createTranslationProvider, createUseTranslation };

//# sourceMappingURL=client.js.map