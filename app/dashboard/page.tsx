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
import { enUS } from "date-fns/locale"

export default async function DashboardPage() {
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

  const displayName = userProfile?.full_name || userProfile?.email || "Operator"
  const membershipLabel = userProfile?.membership_tier === "member" ? "Premium member" : "Free account"
  const membershipDescription =
    userProfile?.membership_tier === "member"
      ? "You have full access to every SOTA release and activation playbook."
      : "Upgrade to unlock premium releases, advanced playbooks, and community drops."

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
                  My SOTA Control
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Welcome back, {displayName}.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Monitor your subscription status, track releases you&apos;ve touched, and keep your profile aligned
                  with the latest art drops.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/research-lines">
                    <Button size="lg" className="gap-2">
                      Explore live releases
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="lg" className="border-primary/40 bg-background/70 backdrop-blur">
                      Update profile
                    </Button>
                  </Link>
                </div>
              </div>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
                    <Crown className="h-4 w-4" aria-hidden />
                    Membership Status
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
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Member since</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {userProfile?.created_at
                        ? format(new Date(userProfile.created_at), "MMMM d, yyyy", { locale: enUS })
                        : "Unknown"}
                    </p>
                  </div>
                  {userProfile?.membership_tier === "free" && (
                    <Button className="w-full gap-2">
                      Upgrade to Premium
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
                    Profile information
                  </CardTitle>
                  <CardDescription>Keep your details aligned with your operating footprint.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Full name</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {userProfile?.full_name || "Not specified"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Email</p>
                      <p className="mt-2 text-sm text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Last updated</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {userProfile?.updated_at
                        ? format(new Date(userProfile.updated_at), "MMMM d, yyyy", { locale: enUS })
                        : "Not available"}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" className="gap-2 border-primary/40">
                      Edit profile
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" aria-hidden />
                    Recent activity
                  </CardTitle>
                  <CardDescription>Your latest interactions across SOTA</CardDescription>
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
                            {format(new Date(event.created_at), "MMMM d, yyyy '·' HH:mm", { locale: enUS })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No recent activity yet — explore a line to get started.
                    </p>
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
