import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { UserActions } from "@/components/admin/user-actions"

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">User Management</h1>
            <p className="text-lg text-muted-foreground">Manage users and permissions</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{u.full_name || "No name"}</p>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                            <Badge variant={u.membership_tier === "member" ? "default" : "outline"}>
                              {u.membership_tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Registered: {format(new Date(u.created_at), "MMMM d, yyyy", { locale: enUS })}
                          </p>
                        </div>
                        <UserActions userId={u.id} currentRole={u.role} currentTier={u.membership_tier} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No registered users</p>
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
