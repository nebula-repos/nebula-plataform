import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { SignupClient } from "./signup-client"

export default async function SignupPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "auth.signup")
  return <SignupClient copy={copy} />
}
