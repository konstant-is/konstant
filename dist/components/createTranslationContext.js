'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createTranslation } from '../lib/utils.js';
// ---- helpers shared by all instances ----
function useMounted() {
    const isMounted = useRef(false);
    useEffect(()=>{
        isMounted.current = true;
        return ()=>{
            isMounted.current = false;
        };
    }, []);
    return useCallback(()=>isMounted.current, []);
}
export function createTranslationContext() {
    return /*#__PURE__*/ createContext(undefined);
}
export function createTranslationProvider(TranslationContext) {
    return function TranslationProvider({ children, config, locale: initialLocale }) {
        const isMounted = useMounted();
        const [currentLocale, setLocale] = useState(initialLocale);
        const [attributes, setAttributes] = useState({
            locale: initialLocale
        });
        useEffect(()=>{
            setLocale(initialLocale);
        }, [
            initialLocale
        ]);
        const updateAttributes = useCallback((values)=>{
            setAttributes({
                locale: currentLocale,
                ...values
            });
        }, [
            currentLocale
        ]);
        const renderAttributes = ()=>Object.entries(attributes).reduce((acc, [key, value])=>{
                acc[`data-${key}`] = value;
                return acc;
            }, {});
        const t = createTranslation(currentLocale, config);
        const value = {
            attributes,
            currentLocale,
            defaultLocale: config.defaultLocale,
            isMounted,
            locales: Object.entries(config.locales).map(([code, label])=>({
                    code,
                    label: label
                })),
            setAttributes: updateAttributes,
            setLocale,
            t
        };
        return /*#__PURE__*/ _jsxs(TranslationContext.Provider, {
            value: value,
            children: [
                children,
                /*#__PURE__*/ _jsx("div", {
                    id: "lang",
                    ...renderAttributes()
                })
            ]
        });
    };
}
export function createUseTranslation(TranslationContext) {
    return function useTranslation() {
        const ctx = useContext(TranslationContext);
        if (!ctx) {
            throw new Error('useTranslation must be used within a TranslationProvider');
        }
        return ctx;
    };
}
export function typedEntries(obj) {
    return Object.entries(obj);
}

//# sourceMappingURL=createTranslationContext.js.map