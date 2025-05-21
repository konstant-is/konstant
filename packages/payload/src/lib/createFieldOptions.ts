import { toReadable } from "@konstant/utils";

type FieldOption<T extends string = string> = {
  label: string;
  value: T;
};

type FieldInput<T extends string = string> = T | FieldOption<T>;

export const createFieldOptions = <T extends string>(
  inputs: FieldInput<T>[]
) => {
  const options: FieldOption<T>[] = [];
  const values: Record<T, T> = {} as Record<T, T>;

  for (const input of inputs) {
    const option =
      typeof input === "string"
        ? { label: toReadable(input), value: input }
        : input;

    options.push(option);
    values[option.value] = option.value;
  }

  return { options, values };
};
