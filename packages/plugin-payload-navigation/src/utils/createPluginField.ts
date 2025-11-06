import { PluginContext } from './createPluginContext.js'

export type CreatePluginField<T, R> = (params: { context: PluginContext; fieldConfig: T }) => R

export function createPluginField<T, R>(fn: CreatePluginField<T, R>): CreatePluginField<T, R> {
  return fn
}
