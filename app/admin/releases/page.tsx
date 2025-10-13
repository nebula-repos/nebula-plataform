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
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react"

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

  const totalReleasesCount = releases?.length ?? 0
  const publishedCount = releases?.filter((release: any) => release.is_published).length ?? 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Release Ops
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Curate and ship SOTA releases.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Publish new art drops, monitor their status, and force revalidation when changes land.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/admin">
                  <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to admin
                  </Button>
                </Link>
                <Link href="/admin/releases/new">
                  <Button className="gap-2">
                    New release
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    Total releases
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalReleasesCount}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    Published
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{publishedCount}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">All releases</CardTitle>
                <CardDescription>Complete list of releases.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {releases && releases.length > 0 ? (
                    releases.map((release: any) => (
                      <div
                        key={release.id}
                        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm shadow-primary/5 backdrop-blur md:flex-row md:items-center md:justify-between"
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
                          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
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
