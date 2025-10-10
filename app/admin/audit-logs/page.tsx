import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Audit Log</h1>
            <p className="text-lg text-muted-foreground">Administrative action history</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Last 100 actions</CardTitle>
                <CardDescription>Complete administrative activity log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs && auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge>{log.action}</Badge>
                            <Badge variant="outline">{log.entity_type}</Badge>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">{log.users?.full_name || log.users?.email}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "MMMM d, yyyy 'at' HH:mm:ss", { locale: enUS })}
                          </p>
                          {log.details && (
                            <pre className="mt-2 rounded bg-muted p-2 text-xs">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No audit records</p>
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
