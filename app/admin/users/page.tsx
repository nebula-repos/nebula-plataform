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
import { UserActions } from "@/components/admin/user-actions"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default async function AdminUsersPage() {
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
                  Access Control
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Manage operators and membership tiers.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Audit roles, upgrade membership, and ensure every workspace has the right privileges to deploy the
                  art.
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
                    Total users
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalUsers}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    Admins
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{adminCount}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    Premium members
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{memberCount}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">All users</CardTitle>
                <CardDescription>Complete list of registered operators and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map((u) => (
                      <div
                        key={u.id}
                        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm shadow-primary/5 backdrop-blur md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-foreground">{u.full_name || "No name"}</p>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                            <Badge variant={u.membership_tier === "member" ? "default" : "outline"}>
                              {u.membership_tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
                            Registered {format(new Date(u.created_at), "MMMM d, yyyy", { locale: enUS })}
                          </p>
                        </div>
                        <UserActions userId={u.id} currentRole={u.role} currentTier={u.membership_tier} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No registered users yet. Onboard a team to populate this list.
                    </p>
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
