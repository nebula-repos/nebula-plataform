import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import Link from "next/link"
import { ResearchLineActions } from "@/components/admin/research-line-actions"
import { RevalidateButton } from "@/components/admin/revalidate-button"

export default async function AdminResearchLinesPage() {
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
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">Research Lines</h1>
                <p className="text-lg text-muted-foreground">Manage research lines</p>
              </div>
              <div className="flex items-center gap-4">
                <RevalidateButton type="all" />
                <Link href="/admin/research-lines/new">
                  <Button>New Line</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>All Lines</CardTitle>
                <CardDescription>Complete list of research lines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchLines && researchLines.length > 0 ? (
                    researchLines.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{line.title}</p>
                            <Badge variant={line.is_active ? "default" : "secondary"}>
                              {line.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{line.description}</p>
                          <p className="text-xs text-muted-foreground">Slug: {line.slug}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RevalidateButton type="research-line" slug={line.slug} />
                          <ResearchLineActions lineId={line.id} isActive={line.is_active} slug={line.slug} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No research lines available</p>
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
