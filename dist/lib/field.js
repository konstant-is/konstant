import { merge } from "lodash";
export const field = (props)=>{
    return {
        ...props
    };
};
export function createField(fieldFn) {
    return (props = {})=>{
        const field = fieldFn(props);
        return merge(field, props.overrides || {});
    };
}

//# sourceMappingURL=field.js.map