import { getPluginPath } from "../utils/getPluginPath.js";
import { generateSlug, normalizeSlugOptions } from "../utils/slugify.js";
export const validateSlug = (pluginContext)=>({ data, req, siblingData, value })=>{
        const { slugFieldConfig } = pluginContext.fieldConfigs;
        // If the slug is locked, return the existing value
        if (!siblingData[slugFieldConfig.lockFieldName]) {
            return value;
        }
        const missingFields = [];
        // Collect values of the fields used for slug generation
        const fields = slugFieldConfig.useFields.map((field)=>{
            const fieldValue = data?.[field] || null;
            if (!fieldValue) {
                missingFields.push(field); // Track missing fields
            }
            return fieldValue;
        });
        // If any required fields are missing, log and return the original value
        if (missingFields.length > 0) {
            req.payload.logger.warn("Missing fields for slug generation:", missingFields);
            return value;
        }
        // Generate the slug using slugify
        const processedSlug = generateSlug(fields, pluginContext.slugifyOptions);
        return processedSlug;
    };
const uniqueSlug = (pluginContext)=>async ({ collection, data, req, value })=>{
        const { slugFieldConfig } = pluginContext.fieldConfigs;
        // Try to get the ID of the current document
        const currentDocId = req.routeParams?.id || data?.id; // From URL params (usually for update) // From the data being passed (useful for beforeChange hooks)
        let slug = value;
        let suffix = 1;
        // Skip if autoIncrementSlug is disabled or there's no collection or slug is empty
        if (slugFieldConfig.autoIncrementSlug == false || !collection?.slug || !slug) {
            return value;
        }
        while(true){
            const conflictingDocs = await req.payload.find({
                collection: collection.slug,
                where: {
                    slug: {
                        equals: slug
                    }
                }
            }).then((result)=>result.docs.filter((doc)=>doc.id !== currentDocId));
            if (conflictingDocs.length === 0) {
                return slug; // If unique, return the slug
            }
            // Append suffix and increment if conflicts exist
            slug = `${value}-${suffix}`;
            suffix++;
        }
    };
export const createSlugField = ({ context, fieldConfig })=>{
    const { autoIncrementSlug, useFields = [
        "title"
    ] } = fieldConfig;
    const checkBoxField = {
        name: "slugLock",
        type: "checkbox",
        defaultValue: true,
        admin: {
            hidden: true,
            position: "sidebar"
        }
    };
    const slugField = {
        name: "slug",
        type: "text",
        admin: {
            components: {
                Field: {
                    clientProps: {
                        custom: {
                            autoIncrementSlug,
                            checkboxFieldPath: checkBoxField.name,
                            slugifyOptions: normalizeSlugOptions(context.slugifyOptions),
                            watchFields: useFields
                        }
                    },
                    path: getPluginPath("client", "#SlugFieldClient")
                }
            },
            position: "sidebar"
        },
        hooks: {
            beforeChange: [
                uniqueSlug(context)
            ],
            beforeValidate: [
                validateSlug(context)
            ]
        },
        index: true,
        localized: true,
        required: true,
        unique: true
    };
    return [
        slugField,
        checkBoxField
    ];
};

//# sourceMappingURL=slugField.js.map