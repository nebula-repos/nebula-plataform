import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

type AuditLog = {
  id: string
  action: string
  entity_type: string
  created_at: string
  details: Record<string, unknown> | null
  users: {
    email: string | null
    full_name: string | null
  } | null
}

export default async function AdminAuditLogsPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.audit")
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

  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*, users(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<AuditLog[]>()

  const totalLogs = auditLogs?.length ?? 0
  const timestampFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "medium" })
  const stats = [{ label: copy.stats.records, value: totalLogs }]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-800/15 via-cyan-600/10 to-transparent blur-3xl" />
            <div className="absolute -right-12 top-1/3 size-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-0 size-[320px] rounded-full bg-primary/10 blur-[240px]" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:items-center">
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
              <div className="grid gap-4">
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/15 via-transparent to-emerald-300/10 blur-[240px]" />
            <div className="absolute right-1/4 top-0 size-[360px] rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/90 shadow-[0_35px_80px_-55px_rgba(15,15,15,0.75)] backdrop-blur transition-all duration-300 hover:border-primary/40">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 opacity-60" />
              <CardHeader className="relative space-y-4 pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{copy.hero.eyebrow}</p>
                <CardTitle className="text-2xl text-foreground">{copy.list.title}</CardTitle>
                <CardDescription className="text-pretty text-muted-foreground">{copy.list.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="group/log space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-muted-foreground shadow-inner shadow-white/5 backdrop-blur transition-all duration-300 hover:border-primary/40"
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em]">
                            <Badge className="rounded-full border-none bg-primary/15 text-primary">{log.action}</Badge>
                            <Badge variant="outline" className="rounded-full border-primary/30 bg-transparent text-primary/80">
                              {log.entity_type}
                            </Badge>
                          </div>
                          <p className="text-base text-foreground">
                            <span className="font-semibold">{log.users?.full_name || log.users?.email}</span>
                          </p>
                          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary/80">
                            {timestampFormatter.format(new Date(log.created_at))}
                          </p>
                        </div>
                        {log.details && (
                          <pre className="overflow-auto rounded-xl border border-white/10 bg-background/75 p-4 text-xs text-muted-foreground shadow-inner shadow-white/5">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
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
