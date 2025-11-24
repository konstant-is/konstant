'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import type { ProviderProps, TranslationContextValue } from '../types.js'

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

// ---- FACTORIES ----

export function createTranslationContext<TLocales extends string, TKeys extends string>() {
  return createContext<TranslationContextValue<TLocales, TKeys> | undefined>(undefined)
}

export function createTranslationProvider<TLocales extends string, TKeys extends string>(
  TranslationContext: React.Context<TranslationContextValue<TLocales, TKeys> | undefined>,
) {
  function TranslationProvider({
    children,
    config,
    locale: initialLocale,
  }: ProviderProps<TLocales, TKeys>): React.ReactElement {
    const isMounted = useMounted()

    const [currentLocale, setLocale] = useState<TLocales>(initialLocale)
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

    const value: TranslationContextValue<TLocales, TKeys> = {
      attributes,
      currentLocale,
      defaultLocale: config.defaultLocale,
      isMounted,
      locales: entriesOf(config.locales).map(([code, label]) => ({
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

  return TranslationProvider
}

export function createUseTranslation<TLocales extends string, TKeys extends string>(
  TranslationContext: React.Context<TranslationContextValue<TLocales, TKeys> | undefined>,
) {
  return function useTranslation() {
    const ctx = useContext(TranslationContext)
    if (!ctx) {
      throw new Error('useTranslation must be used within a TranslationProvider')
    }
    return ctx
  }
}
