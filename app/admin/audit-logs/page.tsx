import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default async function AdminAuditLogsPage() {
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

  const totalLogs = auditLogs?.length ?? 0

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
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Audit Trail
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Monitor every SOTA admin move.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Inspect the latest administrative actions, revalidations, and state changes to keep the art protected.
                </p>
              </div>
              <Link href="/admin">
                <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to admin
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    Records reviewed
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalLogs}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Last 100 actions</CardTitle>
                <CardDescription>Complete administrative activity log.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm shadow-primary/5 backdrop-blur"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge>{log.action}</Badge>
                            <Badge variant="outline">{log.entity_type}</Badge>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">{log.users?.full_name || log.users?.email}</span>
                          </p>
                          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
                            {format(new Date(log.created_at), "MMMM d, yyyy 'at' HH:mm:ss", { locale: enUS })}
                          </p>
                        </div>
                        {log.details && (
                          <pre className="overflow-auto rounded-xl border border-border/60 bg-background/70 p-3 text-xs text-muted-foreground">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No audit records yet.</p>
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
