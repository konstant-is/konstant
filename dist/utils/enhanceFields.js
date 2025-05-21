import { createLocalizedSlugsField, createLocalizedUrlField, createPermalinkField, createSlugField, createUrlField } from '../fields/index.js';
export const enhanceFields = ({ context, fields })=>{
    let updatedFields = [
        ...fields
    ] // Start with a copy of the existing fields
    ;
    // Create index for fast lookups
    const indexedFields = fields.reduce((index, field)=>{
        if ('name' in field && typeof field.name === 'string') {
            index[field.name] = field;
        }
        return index;
    }, {});
    const addFields = (newFields)=>{
        newFields.forEach((field)=>{
            if ('name' in field && typeof field.name === 'string') {
                if (!indexedFields[field.name]) {
                    updatedFields.push(field);
                    indexedFields[field.name] = field;
                }
            } else {
                console.warn('Field without a name encountered. Skipping:', field);
            }
        });
    };
    const { localizedSlugFieldConfig, localizedUrlFieldConfig, permalinkFieldConfig, slugFieldConfig, urlFieldConfig } = context.fieldConfigs;
    // Add slug fields
    if (!indexedFields[slugFieldConfig.fieldName]) {
        const slugFields = createSlugField({
            context,
            fieldConfig: slugFieldConfig
        });
        addFields(slugFields) // Handles multiple slug-related fields
        ;
    }
    // Add localized slug fields
    if (!indexedFields[localizedSlugFieldConfig.fieldName]) {
        const localizedField = createLocalizedSlugsField({
            context,
            fieldConfig: localizedSlugFieldConfig
        });
        addFields([
            localizedField
        ]);
    }
    // Add URL fields
    if (!indexedFields[urlFieldConfig.fieldName]) {
        const field = createUrlField({
            context,
            fieldConfig: urlFieldConfig
        });
        addFields([
            field
        ]);
    }
    // Add Localized URL field
    if (!indexedFields[localizedUrlFieldConfig.fieldName]) {
        const field = createLocalizedUrlField({
            context,
            fieldConfig: localizedUrlFieldConfig
        });
        addFields([
            field
        ]);
    }
    if (context.permalinkEnabled && !indexedFields[permalinkFieldConfig.fieldName]) {
        const field = createPermalinkField({
            context,
            fieldConfig: permalinkFieldConfig
        });
        updatedFields = [
            field,
            ...updatedFields
        ];
    }
    return updatedFields;
};

//# sourceMappingURL=enhanceFields.js.map