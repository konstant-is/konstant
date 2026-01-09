'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui';
import { useMemo } from 'react';
export const PermalinkFieldClient = ({ custom })=>{
    const { config: { serverURL } } = useConfig();
    // or fallback:
    const url = serverURL ?? (typeof window !== 'undefined' ? window.location.origin : '');
    const { id } = useDocumentInfo();
    // Listen to the field value
    const targetFieldValue = useFormFields(([fields])=>{
        return fields[custom.sourceField]?.value;
    });
    // Compute permalink only when necessary
    const processedValue = useMemo(()=>{
        if (!targetFieldValue) {
            return '';
        }
        return `${url}${targetFieldValue}`;
    }, [
        url,
        targetFieldValue
    ]);
    if (!id || !processedValue) {
        return null;
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "field-type permalinksField",
        children: [
            /*#__PURE__*/ _jsx("strong", {
                children: "Permalink:"
            }),
            ' ',
            /*#__PURE__*/ _jsx("a", {
                href: processedValue,
                rel: "noopener noreferrer",
                target: "_blank",
                children: processedValue
            })
        ]
    });
};

//# sourceMappingURL=PermalinkFieldClient.js.map