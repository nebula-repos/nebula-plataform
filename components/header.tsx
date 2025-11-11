import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { ResearchLinesSidebar } from "@/components/research-lines-sidebar"
import { LanguageToggle } from "@/components/language-toggle"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function Header() {
  const locale = await getLocale()
  const common = await getDictionary(locale, "common")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userProfile = user ? await resolveUserProfile(supabase, user) : null
  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("id, title, slug")
    .eq("is_active", true)
    .order("title", { ascending: true })
  const activeResearchLines = researchLines ?? []
  const shouldShowSidebar = Boolean(user && userProfile?.role !== "admin" && activeResearchLines.length > 0)

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {shouldShowSidebar && <ResearchLinesSidebar researchLines={activeResearchLines} copy={common.sidebar} />}
          <Link href="/" className="text-xl font-semibold">
            SotA
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/research-lines" className="text-sm hover:text-primary">
            {common.header.nav.researchLines}
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary">
                {common.header.nav.myAccount}
              </Link>
              {userProfile?.role === "admin" && (
                <Link href="/admin" className="text-sm hover:text-primary">
                  {common.header.nav.admin}
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  {common.header.auth.signout}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  {common.header.auth.login}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  {common.header.auth.signup}
                </Button>
              </Link>
            </>
          )}
          <LanguageToggle locale={locale} />
        </nav>
      </div>
    </header>
  )
}
