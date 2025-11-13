import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { BarChart3, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

type EventCount = {
  event_type: string
  count: number
}

export default async function AdminMetricsPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.metrics")
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

  // Get event type counts
  const { data: eventCounts } = await supabase.rpc<EventCount>("get_event_counts").limit(10)

  // Get user growth
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: freeUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "free")

  const { count: memberUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "member")

  const eventTypeCount = eventCounts?.length ?? 0

  const stats = [
    { label: copy.stats.totalUsers, value: totalUsers || 0 },
    { label: copy.stats.freeUsers, value: freeUsers || 0 },
    { label: copy.stats.members, value: memberUsers || 0 },
    { label: copy.stats.eventTypes, value: eventTypeCount },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute -left-12 top-1/3 size-[380px] rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute right-1/3 bottom-0 size-[320px] rounded-full bg-primary/10 blur-[260px]" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>{copy.hero.eyebrow}</span>
                </div>
                <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">{copy.hero.subtitle}</p>
                <div className="mt-10">
                  <Link href="/admin">
                    <Button
                      size="lg"
                      variant="outline"
                      className="group gap-2 rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:text-primary"
                    >
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                      {copy.hero.back}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <MouseGlowCard
                    key={stat.label}
                    className="h-full border border-white/15 bg-gradient-to-b from-background/85 via-primary/5 to-background/70"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.45em] text-primary/80">{stat.label}</p>
                    <p className="mt-4 text-4xl font-semibold text-foreground">{stat.value}</p>
                  </MouseGlowCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/25 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-300/10 blur-[240px]" />
            <div className="absolute left-1/2 top-0 size-[360px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {/* User Statistics */}
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/90 shadow-[0_35px_80px_-55px_rgba(15,15,15,0.75)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-4 pt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{copy.hero.eyebrow}</p>
                  <CardTitle className="text-2xl text-foreground">{copy.distribution.title}</CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">{copy.distribution.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm shadow-inner shadow-white/5">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{copy.distribution.total}</span>
                      <span className="text-2xl font-semibold text-foreground">{totalUsers || 0}</span>
                    </div>
                    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
                      <div className="flex items-center justify-between text-sm">
                        <span>{copy.distribution.free}</span>
                        <span className="font-medium text-foreground">{freeUsers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{copy.distribution.members}</span>
                        <span className="font-medium text-foreground">{memberUsers || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Activity */}
              <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/90 shadow-[0_35px_80px_-55px_rgba(15,15,15,0.75)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-4 pt-10">
                  <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                      <BarChart3 className="h-5 w-5" aria-hidden />
                    </span>
                    {copy.activity.title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">{copy.activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3">
                    {eventCounts && eventCounts.length > 0 ? (
                      eventCounts.map((event) => (
                        <div
                          key={event.event_type}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground shadow-inner shadow-white/5 backdrop-blur"
                        >
                          <span className="uppercase tracking-[0.2em]">{event.event_type}</span>
                          <span className="text-base font-semibold text-foreground">{event.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">{copy.activity.empty}</p>
                    )}
                  </div>
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
