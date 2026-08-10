export const createCollectionConfig = (config)=>{
    return {
        access: {
            read: ()=>true,
            ...config.access
        },
        ...config
    };
};
export const createGlobalConfig = (config)=>{
    return {
        access: {
            read: ()=>true,
            ...config.access
        },
        ...config
    };
};

//# sourceMappingURL=createConfigs.js.map