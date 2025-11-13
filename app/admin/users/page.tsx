import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { format } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import { UserActions } from "@/components/admin/user-actions"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

export default async function AdminUsersPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.users")
  const dateLocale = locale === "es" ? esLocale : enUS
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

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  const totalUsers = users?.length ?? 0
  const adminCount = users?.filter((u) => u.role === "admin").length ?? 0
  const memberCount = users?.filter((u) => u.membership_tier === "member").length ?? 0

  const statCards = [
    { label: copy.stats.total, value: totalUsers },
    { label: copy.stats.admins, value: adminCount },
    { label: copy.stats.members, value: memberCount },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sky-500/12 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -right-10 bottom-10 size-[360px] rounded-full bg-emerald-300/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {copy.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {copy.hero.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/10 hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      {copy.hero.back}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((stat, index) => (
                  <MouseGlowCard
                    key={`${stat.label}-${index}`}
                    className="h-full rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 p-6 shadow-[0_35px_80px_-55px_rgba(15,15,15,0.75)]"
                  >
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-primary/80">
                      {stat.label}
                    </p>
                    <p className="mt-4 text-4xl font-semibold text-foreground">{stat.value}</p>
                  </MouseGlowCard>
                ))}
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
            <Card className="relative overflow-hidden rounded-[32px] border border-white/10 bg-background/90 shadow-[0_60px_140px_-80px_rgba(15,15,15,0.85)] backdrop-blur">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400" />
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {copy.hero.badge}
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">{copy.list.title}</CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">{copy.list.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map((u) => {
                      const roleLabel = u.role === "admin" ? copy.list.role.admin : copy.list.role.member
                      const tierLabel = u.membership_tier === "member" ? copy.list.tier.premium : copy.list.tier.free
                      return (
                        <div
                          key={u.id}
                          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-background/95 via-primary/5 to-background/75 p-6 shadow-[0_45px_100px_-75px_rgba(15,15,15,0.95)] backdrop-blur transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-sky-500/10 to-emerald-400/10 blur-3xl" />
                          </div>
                          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-foreground">
                                  {u.full_name || copy.list.noName}
                                </p>
                                <Badge
                                  variant={u.role === "admin" ? "default" : "secondary"}
                                  className="rounded-full uppercase tracking-wide"
                                >
                                  {roleLabel}
                                </Badge>
                                <Badge
                                  variant={u.membership_tier === "member" ? "default" : "outline"}
                                  className="rounded-full uppercase tracking-wide"
                                >
                                  {tierLabel}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
                                {copy.list.registered}{" "}
                                {format(new Date(u.created_at), "MMMM d, yyyy", { locale: dateLocale })}
                              </p>
                            </div>
                            <UserActions
                              userId={u.id}
                              currentRole={u.role}
                              currentTier={u.membership_tier}
                              copy={copy.actions}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.list.empty}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
