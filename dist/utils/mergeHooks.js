// Helper to merge hooks safely
export const mergeHooks = (newHooks, existingHooks)=>{
    return [
        ...existingHooks || [],
        ...newHooks
    ];
};

//# sourceMappingURL=mergeHooks.js.map