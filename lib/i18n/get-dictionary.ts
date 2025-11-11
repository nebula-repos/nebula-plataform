import { Locale } from "./config"

const dictionaries = {
  en: {
    common: () => import("@/messages/en/common.json").then((module) => module.default),
    home: () => import("@/messages/en/home.json").then((module) => module.default),
    about: () => import("@/messages/en/about.json").then((module) => module.default),
    privacy: () => import("@/messages/en/privacy.json").then((module) => module.default),
    terms: () => import("@/messages/en/terms.json").then((module) => module.default),
    researchLines: () => import("@/messages/en/researchLines.json").then((module) => module.default),
    researchLineDetail: () => import("@/messages/en/researchLineDetail.json").then((module) => module.default),
    researchLineRelease: () => import("@/messages/en/researchLineRelease.json").then((module) => module.default),
    "auth.login": () => import("@/messages/en/auth.login.json").then((module) => module.default),
    "auth.signup": () => import("@/messages/en/auth.signup.json").then((module) => module.default),
    "auth.verify": () => import("@/messages/en/auth.verify.json").then((module) => module.default),
    dashboard: () => import("@/messages/en/dashboard.json").then((module) => module.default),
    "dashboard.profile": () => import("@/messages/en/dashboard.profile.json").then((module) => module.default),
    admin: () => import("@/messages/en/admin.json").then((module) => module.default),
    "admin.users": () => import("@/messages/en/admin.users.json").then((module) => module.default),
    "admin.researchLines": () => import("@/messages/en/admin.researchLines.json").then((module) => module.default),
    "admin.releases": () => import("@/messages/en/admin.releases.json").then((module) => module.default),
    "admin.metrics": () => import("@/messages/en/admin.metrics.json").then((module) => module.default),
    "admin.audit": () => import("@/messages/en/admin.audit.json").then((module) => module.default),
  },
  es: {
    common: () => import("@/messages/es/common.json").then((module) => module.default),
    home: () => import("@/messages/es/home.json").then((module) => module.default),
    about: () => import("@/messages/es/about.json").then((module) => module.default),
    privacy: () => import("@/messages/es/privacy.json").then((module) => module.default),
    terms: () => import("@/messages/es/terms.json").then((module) => module.default),
    researchLines: () => import("@/messages/es/researchLines.json").then((module) => module.default),
    researchLineDetail: () => import("@/messages/es/researchLineDetail.json").then((module) => module.default),
    researchLineRelease: () => import("@/messages/es/researchLineRelease.json").then((module) => module.default),
    "auth.login": () => import("@/messages/es/auth.login.json").then((module) => module.default),
    "auth.signup": () => import("@/messages/es/auth.signup.json").then((module) => module.default),
    "auth.verify": () => import("@/messages/es/auth.verify.json").then((module) => module.default),
    dashboard: () => import("@/messages/es/dashboard.json").then((module) => module.default),
    "dashboard.profile": () => import("@/messages/es/dashboard.profile.json").then((module) => module.default),
    admin: () => import("@/messages/es/admin.json").then((module) => module.default),
    "admin.users": () => import("@/messages/es/admin.users.json").then((module) => module.default),
    "admin.researchLines": () => import("@/messages/es/admin.researchLines.json").then((module) => module.default),
    "admin.releases": () => import("@/messages/es/admin.releases.json").then((module) => module.default),
    "admin.metrics": () => import("@/messages/es/admin.metrics.json").then((module) => module.default),
    "admin.audit": () => import("@/messages/es/admin.audit.json").then((module) => module.default),
  },
} as const

type Dictionaries = typeof dictionaries

export type DictionaryNamespace = {
  [L in Locale]: keyof Dictionaries[L]
}[Locale]

type DictionaryResult<L extends Locale, N extends keyof Dictionaries[L]> = Awaited<ReturnType<Dictionaries[L][N]>>

export async function getDictionary<L extends Locale, N extends keyof Dictionaries[L]>(
  locale: L,
  namespace: N,
): Promise<DictionaryResult<L, N>> {
  const loader = dictionaries[locale]?.[namespace]

  if (!loader) {
    throw new Error(`Missing dictionary for locale "${locale}" and namespace "${namespace}"`)
  }

  return loader()
}
