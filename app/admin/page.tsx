import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { Users, BookOpen, FileText, Activity, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function AdminPage() {
  const locale = await getLocale()
  const adminCopy = await getDictionary(locale, "admin")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)

  if (userProfile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get statistics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalResearchLines } = await supabase
    .from("research_lines")
    .select("*", { count: "exact", head: true })

  const { count: totalReleases } = await supabase.from("releases").select("*", { count: "exact", head: true })

  const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true })

  const displayName = userProfile.full_name || userProfile.email || adminCopy.hero.fallbackName

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {adminCopy.hero.badge}
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {displayName}, {adminCopy.hero.titleSuffix}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  {adminCopy.hero.description}
                </p>
              </div>
              <Link href="/research-lines">
                <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                  {adminCopy.hero.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {adminCopy.stats.users}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalUsers || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {adminCopy.stats.lines}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalResearchLines || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {adminCopy.stats.releases}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalReleases || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {adminCopy.stats.events}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalEvents || 0}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group relative overflow-hidden border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" aria-hidden />
                    {adminCopy.sections.users.title}
                  </CardTitle>
                  <CardDescription>{adminCopy.sections.users.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users">
                    <Button className="w-full gap-2">
                      {adminCopy.sections.users.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" aria-hidden />
                    {adminCopy.sections.lines.title}
                  </CardTitle>
                  <CardDescription>{adminCopy.sections.lines.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/research-lines">
                    <Button className="w-full gap-2">
                      {adminCopy.sections.lines.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" aria-hidden />
                    {adminCopy.sections.releases.title}
                  </CardTitle>
                  <CardDescription>{adminCopy.sections.releases.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/releases">
                    <Button className="w-full gap-2">
                      {adminCopy.sections.releases.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" aria-hidden />
                    {adminCopy.sections.audit.title}
                  </CardTitle>
                  <CardDescription>{adminCopy.sections.audit.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/audit-logs">
                    <Button className="w-full gap-2">
                      {adminCopy.sections.audit.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" aria-hidden />
                    {adminCopy.sections.metrics.title}
                  </CardTitle>
                  <CardDescription>{adminCopy.sections.metrics.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/metrics">
                    <Button className="w-full gap-2">
                      {adminCopy.sections.metrics.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
