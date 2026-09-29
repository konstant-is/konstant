import { toReadable } from "@konstant/utils";
export const createFieldOptions = (inputs)=>{
    const options = [];
    const values = {};
    for (const input of inputs){
        const option = typeof input === "string" ? {
            label: toReadable(input),
            value: input
        } : input;
        options.push(option);
        values[option.value] = option.value;
    }
    return {
        options,
        values
    };
};

//# sourceMappingURL=createFieldOptions.js.map