import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { User, Crown, Calendar, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function DashboardPage() {
  const locale = await getLocale()
  const dashboard = await getDictionary(locale, "dashboard")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)
  // Get user's recent activity
  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const dateLocale = locale === "es" ? esLocale : enUS
  const displayName = userProfile?.full_name || userProfile?.email || dashboard.hero.fallbackName
  const membershipLabel =
    userProfile?.membership_tier === "member" ? dashboard.membership.premiumLabel : dashboard.membership.freeLabel
  const membershipDescription =
    userProfile?.membership_tier === "member"
      ? dashboard.membership.premiumDescription
      : dashboard.membership.freeDescription

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -right-16 top-1/4 size-[360px] rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {dashboard.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                  {dashboard.hero.greeting} {displayName}.
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {dashboard.hero.description}
                </p>
                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <Link href="/research-lines" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative w-full gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {dashboard.hero.primaryCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:text-primary sm:w-auto"
                    >
                      {dashboard.hero.secondaryCta}
                    </Button>
                  </Link>
                </div>
              </div>
              <Card className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.7)] backdrop-blur">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-300/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                    <Crown className="h-4 w-4" aria-hidden />
                    {dashboard.membership.title}
                  </CardTitle>
                  <div>
                    <Badge variant={userProfile?.membership_tier === "member" ? "default" : "secondary"} className="mb-2">
                      {membershipLabel}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{membershipDescription}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground shadow-inner shadow-white/5">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/70">
                      {dashboard.membership.memberSince}
                    </p>
                    <p className="mt-2 text-base text-foreground">
                      {userProfile?.created_at
                        ? format(new Date(userProfile.created_at), "MMMM d, yyyy", { locale: dateLocale })
                        : dashboard.membership.unknown}
                    </p>
                  </div>
                  {userProfile?.membership_tier === "free" && (
                    <Button className="w-full gap-2">
                      {dashboard.membership.upgradeCta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-300/10 blur-[260px]" />
            <div className="absolute left-1/3 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.6)] backdrop-blur">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <User className="h-5 w-5" aria-hidden />
                    {dashboard.profileCard.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">
                    {dashboard.profileCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/5">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                        {dashboard.profileCard.fields.fullName}
                      </p>
                      <p className="mt-2 text-sm text-foreground">
                        {userProfile?.full_name || dashboard.profileCard.fields.missing}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/5">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                        {dashboard.profileCard.fields.email}
                      </p>
                      <p className="mt-2 text-sm text-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-white/5">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                      {dashboard.profileCard.fields.lastUpdated}
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      {userProfile?.updated_at
                        ? format(new Date(userProfile.updated_at), "MMMM d, yyyy", { locale: dateLocale })
                        : dashboard.profileCard.fields.notAvailable}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="gap-2 rounded-full border-white/30 text-foreground hover:border-primary/50 hover:text-primary">
                      {dashboard.profileCard.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.6)] backdrop-blur">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Calendar className="h-5 w-5" aria-hidden />
                    {dashboard.activityCard.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">
                    {dashboard.activityCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentEvents && recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground shadow-inner shadow-white/5"
                        >
                          <p className="text-sm font-semibold text-foreground">{event.event_type}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-primary/70">
                            {format(new Date(event.created_at), "MMMM d, yyyy '·' HH:mm", { locale: dateLocale })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{dashboard.activityCard.empty}</p>
                  )}
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
