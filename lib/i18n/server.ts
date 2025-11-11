import { cookies } from "next/headers"

import { DEFAULT_LOCALE, LOCALE_COOKIE, Locale, isLocale } from "./config"

export function resolveLocale(value?: string | null): Locale {
  if (isLocale(value)) {
    return value
  }
  return DEFAULT_LOCALE
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeFromCookie = cookieStore.get(LOCALE_COOKIE)?.value
  return resolveLocale(localeFromCookie)
}
