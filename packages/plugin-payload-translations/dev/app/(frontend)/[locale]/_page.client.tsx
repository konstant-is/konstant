'use client'

import { useTranslation } from '../../../translations.js'

export const PageClient: React.FC = () => {
  const { currentLocale, defaultLocale, locales, setLocale, t } = useTranslation()
  return (
    <div>
      <h3>Client</h3>

      <p>
        Locales:
        {locales.map((l, index) => (
          <span key={index}> {l.code}</span>
        ))}
      </p>
      <p>current locale: {currentLocale}</p>
      <p>default locale: {defaultLocale}</p>

      <button
        onClick={() => {
          const nextLocale = currentLocale === 'en' ? 'is' : 'en'
          setLocale(nextLocale)
        }}
      >
        Change locale
      </button>

      <div>{t('home')}</div>
    </div>
  )
}
