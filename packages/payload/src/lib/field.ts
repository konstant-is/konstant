import type { Field } from "payload";

export const field = (props: Field): Field => {
  return {
    ...props,
  } as Field;
};
