export const createLocalizedUrlField = ({ context, fieldConfig })=>{
    return {
        name: fieldConfig.fieldName,
        type: 'group',
        admin: {
            description: 'Automatically generated localized urls.',
            readOnly: true
        },
        fields: context.locales.map((locale)=>({
                name: locale,
                type: 'text',
                defaultValue: '',
                localized: false
            })),
        localized: false
    };
};

//# sourceMappingURL=localizedUrlField.js.map