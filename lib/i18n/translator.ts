import { Locale } from "./config"

export type LocaleMap<T> = Record<Locale, T>

export function createTranslator(locale: Locale) {
  return function translate<T>(values: LocaleMap<T>): T {
    return values[locale]
  }
}
