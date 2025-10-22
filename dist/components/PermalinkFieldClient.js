"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useMemo } from "react";
export const PermalinkFieldClient = ({ custom })=>{
    const { serverURL } = custom;
    const { id } = useDocumentInfo();
    // Listen to the field value
    const targetFieldValue = useFormFields(([fields])=>{
        return fields[custom.sourceField]?.value;
    });
    // Compute permalink only when necessary
    const processedValue = useMemo(()=>{
        if (!targetFieldValue) {
            return "";
        }
        return `${serverURL}${targetFieldValue}`;
    }, [
        serverURL,
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
            " ",
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