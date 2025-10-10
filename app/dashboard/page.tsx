import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { User, Crown, Calendar } from "lucide-react"
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">My Account</h1>
            <p className="text-lg text-muted-foreground">Manage your profile and preferences</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full name</label>
                    <p className="text-lg">{userProfile?.full_name || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email address</label>
                    <p className="text-lg">{userProfile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member since</label>
                    <p className="text-lg">
                      {userProfile?.created_at
                        ? format(new Date(userProfile.created_at), "MMMM d, yyyy", { locale: enUS })
                        : "Unknown"}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline">Edit profile</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Membership Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Membership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant={userProfile?.membership_tier === "member" ? "default" : "secondary"} className="mb-2">
                      {userProfile?.membership_tier === "member" ? "Premium member" : "Free account"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {userProfile?.membership_tier === "member"
                        ? "You have full access to all content"
                        : "Upgrade to unlock exclusive content"}
                    </p>
                  </div>
                  {userProfile?.membership_tier === "free" && <Button className="w-full">Upgrade to Premium</Button>}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest interactions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvents && recentEvents.length > 0 ? (
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{event.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.created_at), "MMMM d, yyyy 'at' HH:mm", { locale: enUS })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
