export const defaultSlugify = {
    locale: 'en',
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-',
    strict: false,
    trim: true
};
export const defaultValues = {
    appendLocaleToUrl: 'exclude-default',
    fallbackLocale: 'en',
    fields: {
        slug: {
            fieldName: 'slug',
            lockFieldName: 'slugLock',
            useFields: [
                'title'
            ]
        },
        localizedSlug: {
            fieldName: 'slugs',
            sourceField: 'slug'
        },
        localizedUrl: {
            fieldName: 'urls',
            sourceField: 'url'
        },
        permalink: {
            fieldName: 'permalink',
            sourceField: 'url'
        },
        url: {
            fieldName: 'url'
        }
    },
    permalinkEnabled: true,
    slugifyOptions: defaultSlugify
};

//# sourceMappingURL=constants.js.map