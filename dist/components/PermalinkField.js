import { jsx as _jsx } from "react/jsx-runtime";
import { getServerSideURL } from '../utils/getUrl.js';
import { PermalinkFieldClient } from './PermalinkFieldClient.js';
export const PermalinkField = (props)=>{
    const serverURL = getServerSideURL();
    return /*#__PURE__*/ _jsx(PermalinkFieldClient, {
        custom: {
            ...props.custom,
            serverURL
        },
        field: props.field,
        path: props.path
    });
};

//# sourceMappingURL=PermalinkField.js.map