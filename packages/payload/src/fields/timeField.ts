import { createField, field } from "../lib/field.js";

export const timeField = createField((props) =>
  field({
    name: props.name || "time",
    type: "date",
    label: props.label || "Time",
    localized: props.localized || false,

    // defaultValue: name === "open" ? "09:00" : "16:00",
    admin: {
      condition: props.condition,
      date: {
        displayFormat: "HH:mm",
        pickerAppearance: "timeOnly",
        timeFormat: "HH:mm",
      },
      hidden: props.hidden,
    },
  })
);
