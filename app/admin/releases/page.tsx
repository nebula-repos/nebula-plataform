import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import Link from "next/link"
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

type ReleaseRow = {
  id: string
  title: string
  slug: string
  is_published: boolean
  published_at: string | null
  research_lines: {
    title: string | null
    slug: string | null
  } | null
}

export default async function AdminReleasesPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.releases")
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
    .returns<ReleaseRow[]>()

  const totalReleasesCount = releases?.length ?? 0
  const publishedCount = releases?.filter((release) => release.is_published).length ?? 0

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

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
                  {copy.hero.eyebrow}
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  {copy.hero.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/admin">
                  <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    {copy.hero.back}
                  </Button>
                </Link>
                <Link href="/admin/releases/new">
                  <Button className="gap-2">
                    {copy.hero.new}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.total}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-semibold text-foreground">{totalReleasesCount}</CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                    {copy.stats.published}
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
                <CardTitle className="text-lg">{copy.list.title}</CardTitle>
                <CardDescription>{copy.list.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {releases && releases.length > 0 ? (
                    releases.map((release) => (
                      <div
                        key={release.id}
                        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm shadow-primary/5 backdrop-blur md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{release.title}</p>
                            <Badge variant={release.is_published ? "default" : "secondary"}>
                              {release.is_published ? copy.status.published : copy.status.draft}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {copy.list.lineLabel}: {release.research_lines?.title || copy.list.noLine}
                          </p>
                          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
                            {release.published_at
                              ? dateFormatter.format(new Date(release.published_at))
                              : copy.list.noDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/research-lines/${release.research_lines?.slug}/${release.slug}`}
                            target="_blank"
                          >
                            <Button variant="outline" size="sm">
                              {copy.list.viewAction}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.empty}</p>
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
