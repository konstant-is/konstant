import { CheckboxField, Field, TextField } from "payload";
import { FieldHook } from "payload";
import { SlugFieldConfig } from "./types.js";
import {
  defaultSlugify,
  generateSlug,
  normalizeSlugOptions,
} from "./helpers.js";
import { getLibPath } from "../../lib/getLibPath.js";

const validateSlug =
  (config: SlugFieldConfig): FieldHook =>
  ({ data, req, siblingData, value }) => {
    // If the slug is locked, return the existing value
    if (!siblingData[config.lockFieldName]) {
      return value;
    }

    const missingFields: string[] = [];

    // Collect values of the fields used for slug generation
    const fields = config.useFields.map((field) => {
      const fieldValue = data?.[field] || null;

      if (!fieldValue) {
        missingFields.push(field); // Track missing fields
      }

      return fieldValue;
    });

    // If any required fields are missing, log and return the original value
    if (missingFields.length > 0) {
      req.payload.logger.warn(
        "Missing fields for slug generation:",
        missingFields
      );
      return value;
    }

    // Generate the slug using slugify
    const processedSlug = generateSlug(fields, config.slugifyOptions);
    return processedSlug;
  };

const uniqueSlug =
  (config: SlugFieldConfig): FieldHook =>
  async ({ collection, data, req, value }) => {
    // Try to get the ID of the current document
    const currentDocId = req.routeParams?.id || data?.id; // From URL params (usually for update) // From the data being passed (useful for beforeChange hooks)

    let slug = value;
    let suffix = 1;

    // Skip if autoIncrementSlug is disabled or there's no collection or slug is empty
    if (config.autoIncrementSlug == false || !collection?.slug || !slug) {
      return value;
    }

    while (true) {
      const conflictingDocs = await req.payload
        .find({
          collection: collection.slug,
          where: {
            slug: { equals: slug },
          },
        })
        .then((result) => result.docs.filter((doc) => doc.id !== currentDocId));

      if (conflictingDocs.length === 0) {
        return slug; // If unique, return the slug
      }

      // Append suffix and increment if conflicts exist
      slug = `${value}-${suffix}`;
      suffix++;
    }
  };

type SlugFieldProps = Partial<SlugFieldConfig> & {
  useFields: string[];
};

export const slugField = (props: SlugFieldProps): Field[] => {
  const config: SlugFieldConfig = {
    fieldName: "slug",
    lockFieldName: "slugLock",
    slugifyOptions: defaultSlugify,
    autoIncrementSlug: true,
    ...props,
  };

  const checkBoxField: CheckboxField = {
    name: "slugLock",
    type: "checkbox",
    defaultValue: true,

    admin: {
      hidden: true,
      position: "sidebar",
    },
  };

  const slugField: TextField = {
    name: "slug",
    type: "text",
    admin: {
      components: {
        Field: {
          clientProps: {
            custom: {
              autoIncrementSlug: config.autoIncrementSlug,
              checkboxFieldPath: checkBoxField.name,
              slugifyOptions: normalizeSlugOptions(config.slugifyOptions),
              watchFields: config.useFields,
            },
          },
          path: getLibPath("client", "#SlugFieldClient"),
        },
      },
      position: "sidebar",
    },
    hooks: {
      beforeChange: [uniqueSlug(config)],
      beforeValidate: [validateSlug(config)],
    },
    index: true,
    localized: true,
    required: true,
    unique: true,
  };

  return [slugField, checkBoxField];
};
