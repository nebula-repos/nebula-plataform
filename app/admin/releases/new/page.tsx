import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ReleaseForm } from "@/components/admin/release-form"

export default async function AdminReleasesNewPage() {
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

  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("id, title, slug")
    .order("title", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">New release</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Publish updates within a research line and share exclusive content with the community.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Release details</CardTitle>
                <CardDescription>Connect the release to a line, set visibility, and add optional section content.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReleaseForm researchLines={researchLines ?? []} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
