import type { Field } from "payload";
import merge from "lodash/merge.js";

export const field = (props: Field): Field => {
  return {
    ...props,
  } as Field;
};

export type FieldCreateType<P = unknown> = {
  condition?: (data: any, siblingData: any) => boolean;
  description?: string;
  fields?: Field[];
  hidden?: boolean;
  hideGutter?: boolean;
  label?: string;
  localized?: boolean;
  name?: string;
  overrides?: Record<string, unknown>;
  required?: boolean;
} & P;

type FieldCreationFunction<P = unknown> = (props: FieldCreateType<P>) => Field;

export function createField<P>(fieldFn: FieldCreationFunction<P>) {
  return (props: FieldCreateType<P> = {} as FieldCreateType<P>): Field => {
    const field = fieldFn(props);

    return merge<Field, any>(field, props.overrides || {});
  };
}
