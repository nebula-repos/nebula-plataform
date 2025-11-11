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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {copy.hero.eyebrow}
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  {copy.hero.subtitle}
                </p>
              </div>
              <Link href="/admin">
                <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {copy.hero.back}
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.totalUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalUsers || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.freeUsers}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{freeUsers || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.members}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{memberUsers || 0}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.eventTypes}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{eventTypeCount}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Statistics */}
              <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <CardTitle>{copy.distribution.title}</CardTitle>
                  <CardDescription>{copy.distribution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{copy.distribution.total}</span>
                      <span className="text-2xl font-bold">{totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{copy.distribution.free}</span>
                      <span className="text-lg font-semibold">{freeUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{copy.distribution.members}</span>
                      <span className="text-lg font-semibold">{memberUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Activity */}
              <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {copy.activity.title}
                  </CardTitle>
                  <CardDescription>{copy.activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {eventCounts && eventCounts.length > 0 ? (
                      eventCounts.map((event) => (
                        <div
                          key={event.event_type}
                          className="flex items-center justify-between rounded-xl border border-border/50 bg-background/80 p-3 text-sm shadow-sm shadow-primary/5"
                        >
                          <span className="text-muted-foreground">{event.event_type}</span>
                          <span className="font-medium text-foreground">{event.count}</span>
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
