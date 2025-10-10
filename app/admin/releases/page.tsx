import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import Link from "next/link"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { RevalidateButton } from "@/components/admin/revalidate-button"

export default async function AdminReleasesPage() {
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

  const { data: releases } = await supabase
    .from("releases")
    .select("*, research_lines(title, slug)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">Releases</h1>
                <p className="text-lg text-muted-foreground">Manage releases</p>
              </div>
              <Link href="/admin/releases/new">
                <Button>New Release</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>All Releases</CardTitle>
                <CardDescription>Complete list of releases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {releases && releases.length > 0 ? (
                    releases.map((release: any) => (
                      <div
                        key={release.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{release.title}</p>
                            <Badge variant={release.is_published ? "default" : "secondary"}>
                              {release.is_published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Line: {release.research_lines?.title || "No line"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {release.published_at
                              ? format(new Date(release.published_at), "MMMM d, yyyy", { locale: enUS })
                              : "No publish date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RevalidateButton
                            type="release"
                            researchLineSlug={release.research_lines?.slug}
                            releaseSlug={release.slug}
                          />
                          <Link
                            href={`/research-lines/${release.research_lines?.slug}/${release.slug}`}
                            target="_blank"
                          >
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No releases</p>
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
