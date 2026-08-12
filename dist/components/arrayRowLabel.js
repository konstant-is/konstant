"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { getNestedProperty } from "@konstant/utils";
import { useRowLabel } from "@payloadcms/ui";
export const ArrayRowLabel = (props)=>{
    const { label } = useArrayRowLabel(props);
    return /*#__PURE__*/ _jsx("div", {
        children: label
    });
};
const useArrayRowLabel = (props)=>{
    const { fallback, fieldName, prefix } = props;
    const { data, rowNumber } = useRowLabel();
    const rowNr = `${(rowNumber || 0) + 1}`;
    const getLabel = ()=>{
        const field = getNestedProperty(data, fieldName);
        return field || fallback || "New row";
    };
    const getFullLabel = ()=>{
        const label = getLabel();
        return `${prefix || ""} ${rowNr}: ${label}`;
    };
    return {
        label: getFullLabel(),
        rowNr: `${(rowNumber || 0) + 1}`
    };
};

//# sourceMappingURL=arrayRowLabel.js.map