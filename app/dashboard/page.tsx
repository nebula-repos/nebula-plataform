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
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {dashboard.hero.badge}
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {dashboard.hero.greeting} {displayName}.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  {dashboard.hero.description}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/research-lines">
                    <Button size="lg" className="gap-2">
                      {dashboard.hero.primaryCta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="lg" className="border-primary/40 bg-background/70 backdrop-blur">
                      {dashboard.hero.secondaryCta}
                    </Button>
                  </Link>
                </div>
              </div>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
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
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                      {dashboard.membership.memberSince}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
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

        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" aria-hidden />
                    {dashboard.profileCard.title}
                  </CardTitle>
                  <CardDescription>
                    {dashboard.profileCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                        {dashboard.profileCard.fields.fullName}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {userProfile?.full_name || dashboard.profileCard.fields.missing}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                        {dashboard.profileCard.fields.email}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                      {dashboard.profileCard.fields.lastUpdated}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {userProfile?.updated_at
                        ? format(new Date(userProfile.updated_at), "MMMM d, yyyy", { locale: dateLocale })
                        : dashboard.profileCard.fields.notAvailable}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="gap-2 border-primary/40">
                      {dashboard.profileCard.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" aria-hidden />
                    {dashboard.activityCard.title}
                  </CardTitle>
                  <CardDescription>
                    {dashboard.activityCard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentEvents && recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-sm shadow-primary/5"
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
