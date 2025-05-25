import { field } from "src/lib/field.js";
import { createFieldOptions } from "../lib/createFieldOptions.js";
const socials = createFieldOptions([
    "facebook",
    "instagram",
    "twitter",
    "strava",
    {
        label: "TikTok",
        value: "tikTok"
    },
    {
        label: "LinkedIn",
        value: "linkedIn"
    }
]);
export const socialMediaField = ()=>{
    return field({
        type: "group",
        name: "socialMedia",
        fields: [
            field({
                type: "select",
                name: "selected",
                label: "Select social media",
                hasMany: true,
                options: socials.options
            }),
            ...socials.options.map((s)=>{
                const { label, value } = s;
                return field({
                    name: value,
                    label: `${label} URL`,
                    type: "text",
                    admin: {
                        condition: (_, siblingData)=>Array.isArray(siblingData.selected) && siblingData.selected.includes(value)
                    },
                    hooks: {
                        beforeValidate: [
                            ({ value })=>{
                                if (!value) return value;
                                // If the value does not start with http or https, prepend https://
                                if (!/^https?:\/\//i.test(value)) {
                                    return `https://${value}`;
                                }
                                return value;
                            }
                        ]
                    },
                    validate: (val)=>{
                        // if (!required && !val) {
                        //   return true
                        // }
                        try {
                            new URL(val);
                            return true;
                        } catch (err) {
                            return "Invalid URL";
                        }
                    }
                });
            })
        ]
    });
};

//# sourceMappingURL=socials.js.map