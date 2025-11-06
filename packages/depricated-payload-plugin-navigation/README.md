# Payload Plugin Navigation

The `payload-plugin-navigation` is a powerful and flexible plugin for [Payload CMS](https://payloadcms.com/) that enables easy creation and management of structured, localized, and SEO-friendly navigation structures. Designed for multilingual and complex websites, this plugin simplifies the handling of dynamic navigation elements.

### Features

- Automatically generate and manage localized slugs and URLs with customizable options, including advanced slugify settings.
- Integrate with the [Nested Docs Plugin](https://github.com/payloadcms/plugin-nested-docs) for hierarchical navigation structures.
- Automatically resolve and display permalinks for referenced documents.

## Installation

Install the plugin via npm:

```bash
npm install payload-plugin-navigation
```

## Basic Usage

```typescript
import { navigationPlugin } from "payload-plugin-navigation";

import { buildConfig } from "payload";

const config = buildConfig({
  collections: [
    {
      slug: "pages",
      fields: [
        {
          name: "title",
          type: "text",
        },
      ],
    },
  ],
  plugins: [
    navigationPlugin({
      collections: ["pages"],
      nestedDocsPlugin: {
        generateLabel: (_, doc) => doc.title,
        generateURL: (docs) => {
          return docs.reduce((url, doc) => `${url}/${doc.slug}`, "");
        },
      },
    }),
  ],
});

export default config;
```

# Options

The `NavigationPlugin` provides a variety of configuration options to customize how navigation, slugs, and URLs are handled in your Payload CMS project. Below is a detailed breakdown of each field, including descriptions, available options, and default values.

---

## `appendLocaleToUrl`

Determines how locales are appended to generated URLs. This is useful for building multilingual navigation.

| Option            | Description                                                        | Default |
| ----------------- | ------------------------------------------------------------------ | ------- |
| `all`             | Append the locale to all URLs.                                     |         |
| `exclude-default` | Append the locale to all URLs except those for the default locale. | **✓**   |
| `none`            | Do not append the locale to any URLs.                              |         |

## `fallbackLocale`

Defines the default locale used when no locale is explicitly provided, ensuring consistent behavior in multilingual setups.

| **Type** | **Example**            | **Default** |
| -------- | ---------------------- | ----------- |
| string   | `'en'`, `'fr'`, `'es'` | `'en'`      |

### `permalinkEnabled`

Controls whether permalinks are generated for collections.

| **Option** | **Description**              | **Default** |
| ---------- | ---------------------------- | ----------- |
| `true`     | Enable permalink generation  | `true`      |
| `false`    | Disable permalink generation |             |

## `nestedDocsPlugin`

Enables support for hierarchical document structures using the [Nested Docs Plugin](https://github.com/payloadcms/plugin-nested-docs). Useful for creating nested navigation like page hierarchies.

#### Example Usage

```typescript
navigationPlugin({
  collections: ["pages"],
  nestedDocsPlugin: {
    generateLabel: (_, doc) => doc.title,
    generateURL: (breadcrumbs) =>
      breadcrumbs.reduce((url, breadcrumb) => `${url}/${breadcrumb.slug}`, ""),
  },
});
```

### `slugifyOptions`

Defines how slugs are generated from input text, using the [slugify](https://www.npmjs.com/package/slugify) package. This setting customizes character replacements, case sensitivity, and trimming behavior to produce clean, SEO-friendly slugs.

| **Option**    | **Description**                                          | **Default**        |
| ------------- | -------------------------------------------------------- | ------------------ |
| `locale`      | Locale used for slug generation.                         | `'en'`             |
| `lower`       | Converts text to lowercase.                              | `true`             |
| `remove`      | Regex pattern for characters to remove.                  | `/[*+~.()'"!:@]/g` |
| `replacement` | Replacement character for spaces and removed characters. | `'-'`              |
| `strict`      | Removes non-alphanumeric characters if set to `true`.    | `false`            |
| `trim`        | Trims leading and trailing separators.                   | `true`             |

## `fields`

The `fields` configuration allows you to define the behavior and properties of fields added by the plugin. These fields handle slugs, URLs, and other navigation-related properties.

#### `slug`

The `slug` field stores a URL-friendly string derived from other fields.

| Field         | Type     | Default    | Description                                              |
| ------------- | -------- | ---------- | -------------------------------------------------------- |
| fieldName     | string   | "slug"     | Name of the field where the slug is stored.              |
| lockFieldName | string   | "slugLock" | Name of the field to lock the slug from further updates. |
| useFields     | string[] | ["title"]  | Array of field names to use for generating the slug.     |

### `url`

The `url` field stores the generated URL for the document and can optionally include locale prefixes based on the `appendLocaleToUrl` configuration.

| **Field**     | **Type**   | **Default** | **Description**                                            |
| ------------- | ---------- | ----------- | ---------------------------------------------------------- |
| `fieldName`   | `string`   | `"url"`     | The name of the field where the URL is stored.             |
| `sourceField` | `string`   | `"slug"`    | Field name used as the source for generating the URL.      |
| `generateUrl` | `function` | `undefined` | A custom function to generate URLs based on document data. |

### `localizedSlug`

The `localizedSlug` field stores localized versions of the slug for different locales. It is useful for multilingual websites to ensure the slugs are language-specific and easy to access.

| Field       | Type   | Default | Description                              |
| ----------- | ------ | ------- | ---------------------------------------- |
| fieldName   | string | "slugs" | The name of the field                    |
| sourceField | string | "slug"  | Field name to use for the localized slug |

### `localizedUrl`

The localizedUrl field stores localized versions of the URL for different locales. This allows the URLs to adapt to the language and structure of the respective locale.

| Field       | Type   | Default | Description                             |
| ----------- | ------ | ------- | --------------------------------------- |
| fieldName   | string | "urls"  | The name of the field                   |
| sourceField | string | "url"   | Field name to use for the localized url |
