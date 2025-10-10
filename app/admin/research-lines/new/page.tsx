import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ResearchLineForm } from "@/components/admin/research-line-form"

export default async function AdminResearchLineNewPage() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">New research line</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">Define the primary details of the line. You can add releases and updates after saving.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Key details</CardTitle>
                <CardDescription>Complete the title, slug, and description shown to users.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResearchLineForm mode="create" />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
