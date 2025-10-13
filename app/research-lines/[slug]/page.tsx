import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { createStaticClient } from "@/lib/supabase/static"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { trackResearchLineView } from "@/lib/analytics"
import { ReleasesCarousel } from "@/components/releases-carousel"
import { Button } from "@/components/ui/button"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { subscribeToResearchLine, unsubscribeFromResearchLine } from "./actions"
import { ArrowRight, BellRing, ShieldCheck, Sparkles } from "lucide-react"

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: researchLines } = await supabase.from("research_lines").select("slug").eq("is_active", true)

  return researchLines?.map((line) => ({ slug: line.slug })) || []
}

export default async function ResearchLinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: researchLine } = await supabase.from("research_lines").select("*").eq("slug", slug).single()

  if (!researchLine) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userProfile = user ? await resolveUserProfile(supabase, user) : null
  const isAdmin = userProfile?.role === "admin"

  let isSubscribed = false

  if (user && !isAdmin) {
    const { data: subscription } = await supabase
      .from("research_line_subscriptions")
      .select("is_active")
      .eq("user_id", user.id)
      .eq("research_line_id", researchLine.id)
      .maybeSingle()

    isSubscribed = Boolean(subscription?.is_active)
  }

  const canViewReleases = Boolean(isAdmin || isSubscribed)

  await trackResearchLineView(researchLine.id, researchLine.slug)

  let releases: any[] = []

  if (canViewReleases) {
    const { data } = await supabase
      .from("releases")
      .select("*")
      .eq("research_line_id", researchLine.id)
      .eq("is_published", true)
      .order("published_at", { ascending: false })

    releases = data ?? []
  }

  const lastUpdatedLabel = researchLine.updated_at
    ? new Date(researchLine.updated_at).toLocaleDateString()
    : "Recently updated"
  const createdAtLabel = researchLine.created_at
    ? new Date(researchLine.created_at).toLocaleDateString()
    : "Inception pending"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">SOTA Line</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {researchLine.title}
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-lg text-muted-foreground">{researchLine.description}</p>
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-md shadow-primary/5 backdrop-blur">
                  <Sparkles className="mb-3 h-8 w-8 text-primary" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Signal density</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Curated drops and applied insights engineered for the {researchLine.title} domain.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-md shadow-primary/5 backdrop-blur">
                  <ShieldCheck className="mb-3 h-8 w-8 text-primary" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Last refreshed</p>
                  <p className="mt-2 text-sm text-muted-foreground">{lastUpdatedLabel}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">Line launched {createdAtLabel}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-md shadow-primary/5 backdrop-blur sm:col-span-2">
                  <BellRing className="mb-3 h-8 w-8 text-primary" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Drops cadence</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    SOTA editors push new releases as signals emerge — expect movement multiple times a month.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/85 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Badge variant={canViewReleases ? "default" : "secondary"}>
                    {isAdmin ? "Admin Access" : canViewReleases ? "Subscribed" : "Locked"}
                  </Badge>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground/80">Release stream</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {canViewReleases
                    ? "You have full access to every release and activation note in this SOTA line."
                    : "Subscribe to unlock releases, frameworks, and ongoing intelligence for this line."}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {user ? (
                    canViewReleases ? (
                      !isAdmin && (
                        <form action={unsubscribeFromResearchLine}>
                          <input type="hidden" name="researchLineId" value={researchLine.id} />
                          <input type="hidden" name="slug" value={slug} />
                          <Button variant="outline" className="w-full border-primary/40 gap-2">
                            Unsubscribe from line
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </form>
                      )
                    ) : (
                      <form action={subscribeToResearchLine}>
                        <input type="hidden" name="researchLineId" value={researchLine.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <Button className="w-full gap-2">
                          Subscribe to unlock
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      </form>
                    )
                  ) : (
                    <Link href={`/auth/login?next=/research-lines/${slug}`}>
                      <Button className="w-full gap-2">
                        Log in to subscribe
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </Link>
                  )}
                  <Link href="/research-lines">
                    <Button variant="ghost" className="w-full text-primary">
                      Back to all lines
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="releases" className="border-t border-border bg-muted/40 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/90">Release vault</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Latest drops inside {researchLine.title}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                Access the full art stream: every release is packaged with briefs, implementation notes, and signal
                callouts.
              </p>
            </div>
            {canViewReleases ? (
              releases.length > 0 ? (
                <div className="mt-12">
                  <ReleasesCarousel itemClassName="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px]">
                    {releases.map((releaseItem) => {
                      const publishedLabel = releaseItem.published_at
                        ? formatDistanceToNow(new Date(releaseItem.published_at), { addSuffix: true, locale: enUS })
                        : "Unpublished"

                      return (
                        <Card
                          key={releaseItem.id}
                          className="group relative flex h-full flex-col justify-between overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur"
                        >
                          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                          <CardHeader className="space-y-3">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                              <Badge variant="secondary" className="border-none bg-primary/15 text-primary">
                                {publishedLabel}
                              </Badge>
                              <span>SOTA Release</span>
                            </div>
                            <CardTitle className="text-lg font-semibold leading-snug text-foreground">
                              {releaseItem.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Link href={`/research-lines/${slug}/${releaseItem.slug}`}>
                              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                                View release
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </ReleasesCarousel>
                </div>
              ) : (
                <div className="mt-12 rounded-2xl border border-border/60 bg-background/80 p-12 text-center backdrop-blur">
                  <p className="text-sm text-muted-foreground">No releases available for this research line yet.</p>
                </div>
              )
            ) : (
              <div className="mt-12 rounded-2xl border border-border/60 bg-background/85 p-10 text-center shadow-lg shadow-primary/5 backdrop-blur">
                <p className="text-sm text-muted-foreground">
                  Subscribe to unlock every SOTA release in this line and receive alerts when new drops land.
                </p>
                {!user && (
                  <div className="mt-6 flex justify-center">
                    <Link href={`/auth/login?next=/research-lines/${slug}`}>
                      <Button className="gap-2">
                        Log in to subscribe
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
