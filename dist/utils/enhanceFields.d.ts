import type { Field } from 'payload';
import type { PluginContext } from './createPluginContext.js';
export declare const enhanceFields: ({ context, fields }: {
    context: PluginContext;
    fields: Field[];
}) => Field[];
