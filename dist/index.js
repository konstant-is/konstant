export const translationPlugin = (pluginOptions)=>(incomingConfig)=>{
        // create copy of incoming config
        const config = {
            ...incomingConfig
        };
        if (!incomingConfig.localization) {
            return config;
        }
        config.globals = [
            ...config.globals || [],
            ...translationGlobal(pluginOptions, incomingConfig)
        ];
        return config;
    };
const translationGlobal = (opts, config)=>{
    const localizations = getLocalization(config.localization);
    if (!localizations) {
        return [];
    }
    return [
        {
            slug: 'translations',
            admin: opts.admin,
            fields: [
                {
                    name: 'locales',
                    type: 'group',
                    fields: getLocales(localizations).map((value)=>{
                        return {
                            name: value,
                            type: 'text',
                            defaultValue: value,
                            required: true
                        };
                    })
                },
                {
                    name: 'defaultLocale',
                    type: 'select',
                    defaultValue: localizations.defaultLocale,
                    options: getLocales(localizations),
                    required: true
                },
                {
                    name: 'translations',
                    type: 'group',
                    fields: Object.keys(opts.translations ?? {}).map((key)=>({
                            type: 'collapsible',
                            admin: {
                                initCollapsed: true
                            },
                            fields: [
                                {
                                    name: key,
                                    type: 'group',
                                    admin: {
                                        hideGutter: true
                                    },
                                    fields: translationField(key, opts.translations ?? {}),
                                    label: key.charAt(0).toUpperCase() + key.slice(1)
                                }
                            ],
                            label: key.charAt(0).toUpperCase() + key.slice(1)
                        }))
                }
            ],
            hooks: opts.hooks
        }
    ];
};
const getLocalization = (localization)=>{
    return !localization ? null : localization;
};
const getLocales = (localization)=>{
    return localization.locales.map((locale)=>{
        return typeof locale === 'string' ? locale : locale.code;
    });
};
const translationField = (key, translations)=>{
    const translation = translations[key];
    if (!translation) {
        throw new Error(`Translation key "${key}" does not exist in translations.`);
    }
    const fields = [
        {
            name: 'key',
            type: 'text',
            admin: {
                readOnly: true
            },
            defaultValue: key,
            hooks: {
                beforeChange: [
                    ({ value })=>{
                        // Always enforce the original key value
                        return key;
                    }
                ]
            },
            label: 'Translation Key',
            required: true
        },
        ...Object.keys(translation).map((locale)=>{
            const value = translation[locale];
            const field = {
                name: locale,
                type: 'textarea',
                defaultValue: value ?? undefined,
                hooks: {
                    beforeValidate: [
                        (data)=>{
                            return data.value || value;
                        }
                    ]
                },
                label: `${locale.toUpperCase()}`
            };
            return field;
        })
    ];
    return fields;
};

//# sourceMappingURL=index.js.map