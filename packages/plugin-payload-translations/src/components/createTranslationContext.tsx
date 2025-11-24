'use client'

import type { PropsWithChildren } from 'react'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import type {
  InferTranslationKeys,
  InferTranslationLocales,
  TranslationContextValue,
} from '../types.js'

import { createTranslation, entriesOf } from '../lib/utils.js'

// ---- helpers shared by all instances ----

function useMounted(): () => boolean {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}

export function createTranslationContext<T>() {
  return createContext<
    TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined
  >(undefined)
}

export type ProviderProps<T> = React.PropsWithChildren<{
  config: T
  locale: string
}>

export function createTranslationProvider<T>(
  TranslationContext: React.Context<
    TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined
  >,
) {
  type L = InferTranslationLocales<T>
  type K = InferTranslationKeys<T>

  return function TranslationProvider({
    children,
    config,
    locale: initialLocale,
  }: PropsWithChildren<{
    config: T
    locale: string
  }>) {
    const isMounted = useMounted()

    const [currentLocale, setLocale] = useState<string>(initialLocale)
    const [attributes, setAttributes] = useState<Record<string, string>>({
      locale: initialLocale,
    })

    useEffect(() => {
      setLocale(initialLocale)
    }, [initialLocale])

    const updateAttributes = useCallback(
      (values: Record<string, string>) => {
        setAttributes({
          locale: currentLocale,
          ...values,
        })
      },
      [currentLocale],
    )

    const renderAttributes = () =>
      Object.entries(attributes).reduce(
        (acc, [key, value]) => {
          acc[`data-${key}`] = value
          return acc
        },
        {} as Record<string, string>,
      )

    const t = createTranslation(currentLocale, config)

    const value: TranslationContextValue<L, K> = {
      attributes,
      currentLocale,
      defaultLocale: (config as any).defaultLocale,
      isMounted,
      locales: Object.entries((config as any).locales).map(([code, label]) => ({
        code,
        label: label as string,
      })),
      setAttributes: updateAttributes,
      setLocale,
      t,
    }

    return (
      <TranslationContext.Provider value={value}>
        {children}
        <div id="lang" {...renderAttributes()} />
      </TranslationContext.Provider>
    )
  }
}

export function createUseTranslation<T>(
  TranslationContext: React.Context<
    TranslationContextValue<InferTranslationLocales<T>, InferTranslationKeys<T>> | undefined
  >,
) {
  return function useTranslation() {
    const ctx = useContext(TranslationContext)
    if (!ctx) {
      throw new Error('useTranslation must be used within a TranslationProvider')
    }
    return ctx
  }
}

export function typedEntries<T extends Record<string, string>>(obj: T) {
  return Object.entries(obj) as [keyof T & string, string][]
}
