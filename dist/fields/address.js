import { createObjectKeys } from "@konstant/utils";
import { createField, field } from "../lib/field.js";
const fields = createObjectKeys([
    "addressLine1",
    "addressLine2",
    "city",
    "location",
    "postalCode",
    "state",
    "country"
]);
export const addressField = createField((props)=>{
    const fieldCondition = (fieldName)=>{
        if (!props.hideFields?.length) {
            return true;
        }
        return props.hideFields.includes(fieldName) ? false : true;
    };
    return field({
        name: props.name ?? "address",
        type: "group",
        admin: {
            condition: props.condition,
            description: props.description,
            hideGutter: props.hideGutter
        },
        fields: [
            field({
                type: "row",
                fields: [
                    field({
                        name: "addressLine1",
                        type: "text",
                        label: "Address",
                        localized: false,
                        required: false
                    }),
                    field({
                        name: "addressLine2",
                        type: "text",
                        admin: {
                            condition: (_)=>fieldCondition("addressLine2")
                        },
                        label: "Address extra",
                        localized: false,
                        required: false
                    })
                ]
            }),
            field({
                type: "row",
                fields: [
                    field({
                        name: "state",
                        type: "text",
                        admin: {
                            condition: (_)=>fieldCondition("state")
                        },
                        label: "State",
                        localized: false,
                        required: false
                    }),
                    field({
                        name: "city",
                        type: "text",
                        admin: {
                            condition: (_)=>fieldCondition("city")
                        },
                        label: "City",
                        localized: false,
                        required: false
                    }),
                    field({
                        name: "postalCode",
                        type: "text",
                        admin: {
                            condition: (_)=>fieldCondition("postalCode")
                        },
                        label: "Postal Code",
                        localized: false,
                        required: false
                    })
                ]
            }),
            field({
                name: "country",
                type: "text",
                admin: {
                    condition: (_)=>fieldCondition("country")
                },
                label: "Country",
                localized: true,
                required: false
            }),
            field({
                name: "location",
                type: "point",
                admin: {
                    condition: (_)=>fieldCondition("location")
                },
                localized: false,
                required: false
            })
        ],
        interfaceName: "Address",
        label: props?.label,
        localized: false
    });
});

//# sourceMappingURL=address.js.map