"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { LOCALE_COOKIE, Locale, SUPPORTED_LOCALES } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selectedLocale, setSelectedLocale] = useState(locale)
  const segmentWidth = 100 / SUPPORTED_LOCALES.length
  const activeIndex = Math.max(SUPPORTED_LOCALES.indexOf(selectedLocale), 0)

  useEffect(() => {
    setSelectedLocale(locale)
  }, [locale])

  const handleChange = (nextLocale: Locale) => {
    if (nextLocale === selectedLocale) {
      return
    }

    setSelectedLocale(nextLocale)
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; max-age=31536000; path=/`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="relative flex rounded-full border border-border/60 bg-background/80 p-0.5 shadow-sm shadow-primary/5 backdrop-blur">
      <span
        aria-hidden
        className="pointer-events-none absolute top-0.5 bottom-0.5 rounded-full bg-primary shadow transition-all duration-300 ease-out"
        style={{
          width: `${segmentWidth}%`,
          transform: `translate3d(${activeIndex * 90}%, 0, 0)`,
          opacity: 1,
        }}
      />
      {SUPPORTED_LOCALES.map((code) => {
        const isActive = code === selectedLocale
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => handleChange(code)}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold uppercase tracking-[0.25em] transition-colors duration-200",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={isActive}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
