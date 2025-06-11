import { toCapitalized } from "@konstant/utils";

import { arrayRowLabelField } from "./arrayRowLabelField.js";
import { field } from "../lib/field.js";
import { timeField } from "./timeField.js";

export const weekdaysMap: Record<string, string> = {
  1: "Mondays",
  2: "Tuesdays",
  3: "Wednesdays",
  4: "Thursdays",
  5: "Fridays",
  6: "Saturdays",
  7: "Sundays",
};

const dayOptions = Object.keys(weekdaysMap).map((key) => ({
  label: weekdaysMap[key] || "",
  value: key,
}));

export const openingHoursField = () => {
  const items = field({
    name: "items",
    type: "array",
    admin: {
      components: {
        RowLabel: arrayRowLabelField({
          fieldName: "label",
          prefix: "",
        }),
      },
    },
    fields: [
      field({
        name: "days",
        type: "select",
        defaultValue: [],
        hasMany: true,
        localized: false,
        options: dayOptions,
        required: true,
      }),
      field({ name: "label", type: "text", localized: true, required: true }),
      ...timeFields(),
    ],
    label: "Opening Hours",
  });

  const customOpeningHours = field({
    name: "custom",
    type: "array",
    fields: [
      field({ name: "label", type: "text", localized: true, required: true }),
      field({
        name: "date",
        type: "date",
        admin: {
          date: {
            displayFormat: "d MMM yyy",
            pickerAppearance: "dayOnly",
          },
        },
        label: "Date",
        localized: false,
        required: true,
      }),
      ...timeFields(),
    ],
    label: "Custom Opening Hours",
  });

  return field({
    name: "openingHours",
    type: "group",
    fields: [items, customOpeningHours],
    interfaceName: "OpeningHours",
    label: "",
  });
};

const timeFields = () => {
  return [
    field({
      type: "row",
      admin: {
        condition: (_, siblingData) => !siblingData.isClosed,
      },
      fields: ["openingTime", "closingTime"].map((name) =>
        timeField({ name, label: toCapitalized(name) })
      ),
    }),
    field({ name: "isClosed", type: "checkbox", label: "Closed whole day" }),
    field({
      name: "closedLabel",
      type: "text",
      admin: { condition: (_, siblingData) => siblingData.isClosed },
    }),
  ];
};
