import { getPluginPath } from '../utils/getPluginPath.js';
export const createPermalinkField = ({ fieldConfig })=>{
    return {
        name: fieldConfig.fieldName,
        type: 'ui',
        admin: {
            components: {
                Field: {
                    clientProps: {
                        custom: {
                            sourceField: fieldConfig.sourceField
                        }
                    },
                    path: getPluginPath('client', '#PermalinkField')
                }
            }
        }
    };
};

//# sourceMappingURL=permalinkField.js.map