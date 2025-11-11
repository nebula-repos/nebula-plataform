export const SUPPORTED_LOCALES = ["en", "es"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "locale"

export function isLocale(value?: string | null): value is Locale {
  return Boolean(value && SUPPORTED_LOCALES.includes(value as Locale))
}
