import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { Users, BookOpen, FileText, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
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

  // Get statistics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalResearchLines } = await supabase
    .from("research_lines")
    .select("*", { count: "exact", head: true })

  const { count: totalReleases } = await supabase.from("releases").select("*", { count: "exact", head: true })

  const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage users, content, and metrics</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Statistics */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Research Lines</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalResearchLines || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Releases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReleases || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Review and manage platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users">
                    <Button className="w-full">View Users</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Lines</CardTitle>
                  <CardDescription>Create and manage research lines</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/research-lines">
                    <Button className="w-full">Manage Lines</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Releases</CardTitle>
                  <CardDescription>Create and edit releases</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/releases">
                    <Button className="w-full">Manage Releases</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>View administrative action history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/audit-logs">
                    <Button className="w-full">View Log</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metrics and Events</CardTitle>
                  <CardDescription>Analyze user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/metrics">
                    <Button className="w-full">View Metrics</Button>
                  </Link>
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
