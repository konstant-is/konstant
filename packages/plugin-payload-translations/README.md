# @konstant/plugin-payload-translations

A fully-typed translation framework for Payload CMS and Next.js.

This plugin lets you define translations directly in your Payload config, generates a typed translation global, and provides a fully typed React translation provider + hook for your frontend.  
The Payload global becomes the **single source of truth**, and your app gets **full TypeScript autocompletion** for both locale codes and translation keys.

---

## ✨ Features

- 🚀 Add translations via a simple plugin in your Payload config
- 🔄 Generates a `Translation` global in Payload
- 🧠 Fully typed: locales + keys inferred from your Payload global
- 💡 `useTranslation()` hook with autocompletion
- 🧰 Lightweight + framework-agnostic provider
- ⚡ Perfect for Next.js App Router (`use client`)
- 📚 No extra build steps needed

---

## 📦 Installation

Add to your `package.json`:

```json
{
  "dependencies": {
    "@konstant/plugin-payload-translations": "github:konstant-is/konstant#v0.0.0-plugin-payload-translations"
  }
}
```

Or install manually:

```bash
pnpm add @konstant/plugin-payload-translations
```

---

## 🔌 Add the plugin to Payload config

Inside your `payload.config.ts`:

```ts
import { translationPlugin } from '@konstant/plugin-payload-translations'

export default buildConfig({
  // ...
  plugins: [
    translationPlugin({
      translations: {
        home: {
          en: 'Home',
          is: 'Heim',
        },
        about: {
          en: 'About us',
          is: 'Um okkur',
        },
      },
    }),
  ],
})
```

This will:

- create/update the `Translation` global
- generate a strongly typed `Translation` type inside `payload-types.ts`
- allow your frontend to use the typed provider and hook

---

## 🧩 Frontend Integration (Next.js)

Create a file:  
`app/translation.ts`

```ts
'use client'

import {
  createTranslationContext,
  createTranslationProvider,
  createUseTranslation,
} from '@konstant/plugin-payload-translations/client'

import type { Translation } from './payload-types'

// Typed instances:
export const TranslationContext = createTranslationContext<Translation>()
export const TranslationProvider = createTranslationProvider<Translation>(TranslationContext)
export const useTranslation = createUseTranslation<Translation>(TranslationContext)
```

Your frontend now automatically infers:

- locale union (`"en" | "is"`)
- translation key union (`"home" | "about"`)
- typed `t()` function
- typed `setLocale()`

---

## 🎯 Usage in Next.js Layout

Example: `app/[locale]/layout.tsx`

```tsx
import { TranslationProvider } from '@/translation'
import { getPayload } from 'payload'
import type { Translation } from '@/payload-types'

export default async function RootLayout({ params, children }) {
  const payload = await getPayload()
  const translation = (await payload.findGlobal({ slug: 'translation' })) as Translation

  return (
    <TranslationProvider config={translation} locale={params.locale}>
      {children}
    </TranslationProvider>
  )
}
```

---

## 🎙 Using the translation hook

```tsx
'use client'

import { useTranslation } from '@/translation'

export default function Button() {
  const { t, currentLocale, setLocale } = useTranslation()

  return <button onClick={() => setLocale('is')}>{t('home')}</button>
}
```

### ✔ Autocomplete works:

- `t('home')` → OK
- `t('homeeee')` → ❌ Type error
- `setLocale('is')` → OK
- `setLocale('something')` → ❌ Type error

---

## 🛠 How it works

- The plugin registers a `Translation` global in Payload
- The global stores locales + translations
- Generated `payload-types.ts` includes the exact type shape
- Factories infer `Locales` and `Keys` directly from that type
- Provider + hook become fully typed automatically

No manual configuration needed.

---

## 📁 Example structure

```
app/
  translation.ts
  [locale]/
    layout.tsx
payload.config.ts
payload-types.ts
```

---

## 🧪 Example plugin config

```ts
translationPlugin({
  translations: {
    home: { en: 'Home', is: 'Heim' },
    about: { en: 'About us', is: 'Um okkur' },
    contact: { en: 'Contact', is: 'Hafa samband' },
  },
})
```

---

## 📄 License

MIT © Konstant
