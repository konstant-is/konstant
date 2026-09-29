import { NextResponse } from 'next/server.js';
const bypass = [
    '/admin',
    '/api',
    '/_next',
    '/static',
    '/favicon.ico',
    '/sitemap.xml',
    '/robots.txt',
    '/.well-known',
    '/static'
];
export function createLocalizationMiddleware(opts) {
    const { config, log: logEnabled = false } = opts;
    const log = (...params)=>{
        if (logEnabled) {
            console.log(`[Localization middleware] `, ...params);
        }
    };
    return function middleware(request) {
        const { pathname } = request.nextUrl;
        if (shouldBypass(pathname) || pathname === undefined) {
            log(`bypassing ${pathname}`);
            return NextResponse.next();
        }
        // 1. Split into parts
        const parts = pathname.split('/').filter(Boolean) // e.g. /about → ["about"], /is/about → ["is","about"]
        ;
        // 2. If no locale in path, rewrite to default locale
        if (!parts.length || !config.locales.includes(parts[0])) {
            log(` No locale in path, rewrite to default locale ${config.defaultLocale}`);
            const newUrl = new URL(`/${config.defaultLocale}${pathname}`, request.url);
            newUrl.search = request.nextUrl.search; // ✅ Preserve query params
            return NextResponse.rewrite(newUrl);
        }
        const locale = parts[0];
        // 3. If default locale is in path → rewrite to drop it in the browser
        if (locale === config.defaultLocale) {
            log(`default locale is in path → rewrite to drop it in the browser`);
            const newUrl = new URL('/' + parts.slice(1).join('/'), request.url);
            newUrl.search = request.nextUrl.search; // ✅ Preserve query params
            return NextResponse.redirect(newUrl);
        }
        // 4. Non-default locales → keep as-is
        return NextResponse.next();
    };
}
// ---------- Helpers ----------
const shouldBypass = (pathname)=>bypass.some((path)=>pathname.startsWith(path));

//# sourceMappingURL=middleware.js.map