import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LoginClient } from "./login-client"

export default async function LoginPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "auth.login")
  return <LoginClient copy={copy} />
}
