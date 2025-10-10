import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ResearchLineForm } from "@/components/admin/research-line-form"

interface AdminResearchLineEditPageProps {
  params: {
    slug: string
  }
}

export default async function AdminResearchLineEditPage({ params }: AdminResearchLineEditPageProps) {
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

  const { data: researchLine } = await supabase.from("research_lines").select("*").eq("slug", params.slug).single()

  if (!researchLine) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">Edit line: {researchLine.title}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Update the public information and control the line&apos;s availability across the platform.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>General information</CardTitle>
                <CardDescription>Changes appear automatically on the public site and in admin listings.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResearchLineForm
                  mode="edit"
                  initialData={{
                    id: researchLine.id,
                    title: researchLine.title,
                    slug: researchLine.slug,
                    description: researchLine.description,
                    is_active: researchLine.is_active,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
