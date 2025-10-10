import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { BarChart3 } from "lucide-react"

export default async function AdminMetricsPage() {
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
  const { data: eventCounts } = await supabase.rpc("get_event_counts" as any).limit(10)

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Metrics and Analysis</h1>
            <p className="text-lg text-muted-foreground">Platform usage statistics</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Users by membership tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total users</span>
                      <span className="text-2xl font-bold">{totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Free users</span>
                      <span className="text-lg font-semibold">{freeUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Premium members</span>
                      <span className="text-lg font-semibold">{memberUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Event Activity
                  </CardTitle>
                  <CardDescription>Most frequent event types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {eventCounts && eventCounts.length > 0 ? (
                      eventCounts.map((event: any) => (
                        <div key={event.event_type} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{event.event_type}</span>
                          <span className="font-medium">{event.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No event data available</p>
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
