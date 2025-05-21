import type { Field, FieldHook } from 'payload';
import type { CreatePluginField, SlugFieldConfig } from '../types.js';
import type { PluginContext } from '../utils/createPluginContext.js';
export declare const validateSlug: (pluginContext: PluginContext) => FieldHook;
export declare const createSlugField: CreatePluginField<SlugFieldConfig, Field[]>;
