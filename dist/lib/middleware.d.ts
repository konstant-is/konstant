import type { NextRequest } from 'next/server.js';
import { NextResponse } from 'next/server.js';
export declare function createLocalizationMiddleware(opts: {
    config: {
        defaultLocale: string;
        locales: string[];
    };
    log?: boolean;
}): (request: NextRequest) => NextResponse | undefined;
