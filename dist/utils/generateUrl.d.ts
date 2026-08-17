import type { PayloadRequest } from 'payload';
import type { PluginContext } from './createPluginContext.js';
export declare const generateUrl: (context: PluginContext, data: Partial<any> | undefined) => any;
export declare const generateLocalizedUrl: ({ context, data, req, }: {
    context: PluginContext;
    data: Partial<any> | undefined;
    req: PayloadRequest;
}) => string;
