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
  const shouldShowSidebar = activeResearchLines.length > 0

  const navLinkClass =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground/90 transition-colors duration-200 hover:bg-white/10 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
  const subtleAuthButtonClass =
    "rounded-full px-5 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-white/10 hover:text-primary"

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-background/80 via-background/70 to-background/90 shadow-[0_18px_80px_-40px_rgba(56,189,248,0.8)] backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {shouldShowSidebar && <ResearchLinesSidebar researchLines={activeResearchLines} copy={common.sidebar} />}
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-semibold tracking-tight text-foreground shadow-inner shadow-white/5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="bg-gradient-to-r from-primary via-sky-400 to-emerald-400 bg-clip-text text-transparent">SotA</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end gap-3">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1 py-1 shadow-inner shadow-white/5 backdrop-blur">
            <Link href="/research-lines" className={navLinkClass}>
              {common.header.nav.researchLines}
            </Link>
            {user && (
              <Link href="/dashboard" className={navLinkClass}>
                {common.header.nav.myAccount}
              </Link>
            )}
            {userProfile?.role === "admin" && (
              <Link href="/admin" className={navLinkClass}>
                {common.header.nav.admin}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm shadow-primary/5 backdrop-blur">
            {user ? (
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit" className={subtleAuthButtonClass}>
                  {common.header.auth.signout}
                </Button>
              </form>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className={subtleAuthButtonClass}>
                    {common.header.auth.login}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="rounded-full px-6 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary via-sky-500 to-emerald-500 shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
                  >
                    {common.header.auth.signup}
                  </Button>
                </Link>
              </>
            )}
          </div>
          <LanguageToggle locale={locale} />
        </nav>
      </div>
    </header>
  )
}
