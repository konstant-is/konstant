import { createPluginField } from '../utils/createPluginField.js';
import { generateUrl } from '../utils/generateUrl.js';
import { getPluginPath } from '../utils/getPluginPath.js';
const validateUrlField = (context)=>({ data })=>{
        const url = generateUrl(context, data);
        return url;
    };
export const createUrlField = createPluginField(({ context, fieldConfig })=>{
    return {
        name: fieldConfig.fieldName,
        type: 'text',
        admin: {
            components: {
                Cell: getPluginPath('client', '#UrlCell')
            },
            description: 'Automatically generated url',
            position: 'sidebar',
            readOnly: true
        },
        defaultValue: '',
        hooks: {
            beforeValidate: [
                validateUrlField(context)
            ]
        },
        index: false,
        localized: true,
        required: true
    };
});

//# sourceMappingURL=urlField.js.map