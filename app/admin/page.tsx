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
import { MouseGlowCard } from "@/components/mouse-glow-card"
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

  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalResearchLines } = await supabase
    .from("research_lines")
    .select("*", { count: "exact", head: true })

  const { count: totalReleases } = await supabase.from("releases").select("*", { count: "exact", head: true })

  const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true })

  const displayName = userProfile.full_name || userProfile.email || adminCopy.hero.fallbackName

  const statsCards = [
    {
      label: adminCopy.stats.users,
      value: totalUsers || 0,
      icon: Users,
    },
    {
      label: adminCopy.stats.lines,
      value: totalResearchLines || 0,
      icon: BookOpen,
    },
    {
      label: adminCopy.stats.releases,
      value: totalReleases || 0,
      icon: FileText,
    },
    {
      label: adminCopy.stats.events,
      value: totalEvents || 0,
      icon: Activity,
    },
  ]

  const managementSections = [
    {
      icon: Users,
      title: adminCopy.sections.users.title,
      description: adminCopy.sections.users.description,
      cta: adminCopy.sections.users.cta,
      href: "/admin/users",
    },
    {
      icon: BookOpen,
      title: adminCopy.sections.lines.title,
      description: adminCopy.sections.lines.description,
      cta: adminCopy.sections.lines.cta,
      href: "/admin/research-lines",
    },
    {
      icon: FileText,
      title: adminCopy.sections.releases.title,
      description: adminCopy.sections.releases.description,
      cta: adminCopy.sections.releases.cta,
      href: "/admin/releases",
    },
    {
      icon: Activity,
      title: adminCopy.sections.audit.title,
      description: adminCopy.sections.audit.description,
      cta: adminCopy.sections.audit.cta,
      href: "/admin/audit-logs",
    },
    {
      icon: Sparkles,
      title: adminCopy.sections.metrics.title,
      description: adminCopy.sections.metrics.description,
      cta: adminCopy.sections.metrics.cta,
      href: "/admin/metrics",
    },
  ]

  const managementEyebrow = adminCopy.hero.badge

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute -right-10 top-1/3 size-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute left-1/4 bottom-0 size-[360px] rounded-full bg-primary/10 blur-[220px]" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>{adminCopy.hero.badge}</span>
                </div>
                <h1 className="mt-8 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {displayName}, {adminCopy.hero.titleSuffix}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {adminCopy.hero.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/research-lines">
                    <Button
                      size="lg"
                      className="group relative gap-3 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {adminCopy.hero.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {statsCards.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <MouseGlowCard
                      key={stat.label}
                      className="h-full border border-white/15 bg-gradient-to-b from-background/90 via-primary/5 to-background/70"
                    >
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-primary/80">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-semibold text-foreground">{stat.value}</p>
                    </MouseGlowCard>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-300/10 blur-[240px]" />
            <div className="absolute right-1/3 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {managementSections.map((section) => {
                const Icon = section.icon
                return (
                  <Card
                    key={section.title}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/90 shadow-[0_35px_80px_-55px_rgba(15,15,15,0.75)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_55px_130px_-65px_rgba(15,15,15,0.9)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="relative space-y-4">
                      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/70">
                        <span className="inline-flex items-center gap-3 text-muted-foreground">
                          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          {managementEyebrow}
                        </span>
                        <span className="text-primary/80">{section.cta}</span>
                      </div>
                      <CardTitle className="text-2xl text-foreground">{section.title}</CardTitle>
                      <CardDescription className="text-pretty text-muted-foreground">{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Link href={section.href}>
                        <Button
                          variant="outline"
                          className="group/btn w-full rounded-full border-primary/50 bg-white/5 text-primary shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary hover:bg-white/10 hover:shadow-primary/25"
                        >
                          {section.cta}
                          <ArrowRight
                            className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                            aria-hidden
                          />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
