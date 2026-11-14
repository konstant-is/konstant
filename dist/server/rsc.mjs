import { NextResponse } from "next/server.js";
// src/lib/middleware.ts
const bypass = [
	"/admin",
	"/api",
	"/_next",
	"/static",
	"/favicon.ico",
	"/sitemap.xml",
	"/robots.txt",
	"/.well-known",
	"/static"
];
function createLocalizationMiddleware(opts) {
	const { config, log: logEnabled = false } = opts;
	const log = (...params) => {
		if (logEnabled) console.log(`[Localization middleware] `, ...params);
	};
	return function middleware(request) {
		const { pathname } = request.nextUrl;
		if (shouldBypass(pathname) || pathname === void 0) {
			log(`bypassing ${pathname}`);
			return NextResponse.next();
		}
		const parts = pathname.split("/").filter(Boolean);
		if (!parts.length || !config.locales.includes(parts[0])) {
			log(` No locale in path, rewrite to default locale ${config.defaultLocale}`);
			const newUrl = new URL(`/${config.defaultLocale}${pathname}`, request.url);
			newUrl.search = request.nextUrl.search;
			return NextResponse.rewrite(newUrl);
		}
		if (parts[0] === config.defaultLocale) {
			log(`default locale is in path → rewrite to drop it in the browser`);
			const newUrl = new URL("/" + parts.slice(1).join("/"), request.url);
			newUrl.search = request.nextUrl.search;
			return NextResponse.redirect(newUrl);
		}
		return NextResponse.next();
	};
}
const shouldBypass = (pathname) => bypass.some((path) => pathname.startsWith(path));
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
export { createLocalizationMiddleware, createTranslation };

//# sourceMappingURL=rsc.mjs.map