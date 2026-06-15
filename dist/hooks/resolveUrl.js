import { generateLocalizedUrl } from '../utils/generateUrl.js';
export const resolveUrl = (context)=>({ data, req })=>{
        const { urlFieldConfig } = context.fieldConfigs;
        // Resolve the final URL by appending locale if needed
        const url = generateLocalizedUrl({
            context,
            data,
            req
        });
        return {
            ...data,
            [urlFieldConfig.fieldName]: url
        };
    };

//# sourceMappingURL=resolveUrl.js.map