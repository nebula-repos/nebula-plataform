import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { createStaticClient } from "@/lib/supabase/static"
import { formatDistanceToNow } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import { trackResearchLineView } from "@/lib/analytics"
import { ReleasesCarousel } from "@/components/releases-carousel"
import { Button } from "@/components/ui/button"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { subscribeToResearchLine, unsubscribeFromResearchLine } from "./actions"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { cn } from "@/lib/utils"

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: researchLines } = await supabase.from("research_lines").select("slug").eq("is_active", true)

  return researchLines?.map((line) => ({ slug: line.slug })) || []
}

export default async function ResearchLinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const detailCopy = await getDictionary(locale, "researchLineDetail")
  const common = await getDictionary(locale, "common")
  const dateLocale = locale === "es" ? esLocale : enUS
  const dateFormatter = locale === "es" ? "es-ES" : "en-US"
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

  const hasMultipleReleases = releases.length > 1

  const accessStatusLabel = isAdmin
    ? detailCopy.hero.access.status.admin
    : canViewReleases
      ? detailCopy.hero.access.status.subscribed
      : detailCopy.hero.access.status.locked

  const lastUpdatedLabel = researchLine.updated_at
    ? new Date(researchLine.updated_at).toLocaleDateString(dateFormatter)
    : detailCopy.labels.recentlyUpdated
  const createdAtLabel = researchLine.created_at
    ? new Date(researchLine.created_at).toLocaleDateString(dateFormatter)
    : detailCopy.labels.inceptionPending
  const signalDescription = detailCopy.hero.cards.signal.description.replace("{lineTitle}", researchLine.title)
  const releasesTitle = detailCopy.releases.title.replace("{lineTitle}", researchLine.title)
  const launchCopy = detailCopy.hero.cards.refresh.launch.replace("{date}", createdAtLabel)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-800/15 via-cyan-600/10 to-transparent blur-3xl" />
            <div className="absolute left-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -right-20 top-1/4 size-[360px] rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>{detailCopy.hero.badge}</span>
            </div>
            <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {researchLine.title}
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">{researchLine.description}</p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5 backdrop-blur">
                <Sparkles className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {detailCopy.hero.cards.signal.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{signalDescription}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5 backdrop-blur">
                <ShieldCheck className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {detailCopy.hero.cards.refresh.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{lastUpdatedLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{launchCopy}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-white/5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Badge variant={canViewReleases ? "default" : "secondary"}>{accessStatusLabel}</Badge>
                  <span className="text-[0.6rem] uppercase tracking-[0.35em] text-muted-foreground/80">
                    {detailCopy.hero.access.streamLabel}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {canViewReleases ? detailCopy.hero.access.granted : detailCopy.hero.access.locked}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {user ? (
                    canViewReleases ? (
                      !isAdmin && (
                        <form action={unsubscribeFromResearchLine}>
                          <input type="hidden" name="researchLineId" value={researchLine.id} />
                          <input type="hidden" name="slug" value={slug} />
                          <Button className="w-full gap-2 rounded-full border border-white/30 bg-white/5 text-foreground shadow-inner shadow-white/5 transition-colors hover:border-primary/50 hover:bg-white/10 hover:text-primary">
                            {detailCopy.hero.access.actions.unsubscribe}
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </form>
                      )
                    ) : (
                      <form action={subscribeToResearchLine}>
                        <input type="hidden" name="researchLineId" value={researchLine.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 text-primary-foreground shadow-lg shadow-primary/20 transition-transform transition-colors hover:scale-[1.01] hover:text-primary-foreground hover:brightness-110">
                          {detailCopy.hero.access.actions.subscribe}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      </form>
                    )
                  ) : (
                    <Link href={`/auth/login?next=/research-lines/${slug}`}>
                      <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 text-primary-foreground shadow-lg shadow-primary/20 transition-transform transition-colors hover:scale-[1.01] hover:text-primary-foreground hover:brightness-110">
                        {detailCopy.hero.access.actions.login}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </Link>
                  )}
                  <Link href="/research-lines">
                    <Button variant="ghost" className="w-full text-primary">
                      {detailCopy.hero.access.actions.back}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="releases" className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-emerald-300/10 blur-[260px]" />
            <div className="absolute left-1/3 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/90">{detailCopy.releases.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{releasesTitle}</h2>
              <p className="mt-4 text-pretty text-muted-foreground">{detailCopy.releases.description}</p>
            </div>
            {canViewReleases ? (
              releases.length > 0 ? (
                <div className="mt-12 overflow-visible pb-12">
                  <ReleasesCarousel copy={common.carousel} wrapItems={false}>
                    {releases.map((releaseItem) => {
                      const isPublished = Boolean(releaseItem.published_at)
                      const publishedLabel = isPublished
                        ? formatDistanceToNow(new Date(releaseItem.published_at), {
                            addSuffix: true,
                            locale: dateLocale,
                          })
                        : detailCopy.releases.unpublished
                      const publishedDateLabel = isPublished
                        ? new Date(releaseItem.published_at).toLocaleDateString(dateFormatter, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : detailCopy.releases.unpublished

                      return (
                        <div
                          key={releaseItem.id}
                          className={cn(
                            "group relative flex min-w-[260px] flex-shrink-0 flex-col items-center pt-16 pb-12 text-center sm:min-w-[320px]",
                            hasMultipleReleases &&
                              "before:pointer-events-none before:absolute before:-left-6 before:top-8 before:h-px before:w-[calc(100%+3rem)] before:bg-gradient-to-r before:from-blue-800/40 before:via-border before:to-primary/40 before:opacity-80 before:content-[''] before:-z-10 first:before:left-0 first:before:w-[calc(100%+1.5rem)] last:before:-left-6 last:before:w-[calc(100%+1.5rem)] only:before:hidden",
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none absolute top-8 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-background/95 shadow-[0_10px_30px_rgba(14,165,233,0.25)] transition-all duration-300",
                              isPublished ? "border-primary/40" : "border-border/60 shadow-none",
                            )}
                            aria-hidden
                          >
                            <span
                              className={cn(
                                "inline-flex h-3 w-3 rounded-full",
                                isPublished ? "bg-primary" : "bg-muted-foreground/40",
                              )}
                            />
                          </span>
                          <div className="mt-10 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                              {detailCopy.releases.cardBadge}
                            </p>
                            <p className="text-sm font-medium text-foreground">{publishedDateLabel}</p>
                            <p className="text-xs text-muted-foreground">{publishedLabel}</p>
                          </div>
                          <span
                            className="mt-5 block h-16 w-px bg-gradient-to-b from-blue-800/70 via-primary/20 to-transparent"
                            aria-hidden
                          />
                          <Card className="mt-6 w-full max-w-sm border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/40 text-left shadow-[0_25px_60px_-40px_rgba(15,15,15,0.7)] backdrop-blur">
                            <CardHeader className="space-y-3">
                              <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
                                {releaseItem.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                                <Badge variant="secondary" className="border-none bg-primary/15 text-primary">
                                  {detailCopy.releases.cardBadge}
                                </Badge>
                                <span className="tracking-normal text-muted-foreground">{publishedLabel}</span>
                              </div>
                              <Link href={`/research-lines/${slug}/${releaseItem.slug}`}>
                                <Button variant="ghost" className="group/link w-full justify-between gap-2 px-0 text-primary">
                                  <span>{detailCopy.releases.viewRelease}</span>
                                  <ArrowRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                                    aria-hidden
                                  />
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}
                  </ReleasesCarousel>
                </div>
              ) : (
                <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-inner shadow-white/5 backdrop-blur">
                  <p className="text-sm text-muted-foreground">{detailCopy.releases.empty}</p>
                </div>
              )
            ) : (
              <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_35px_80px_-50px_rgba(15,15,15,0.6)] backdrop-blur">
                <p className="text-sm text-muted-foreground">{detailCopy.releases.locked}</p>
                {!user && (
                  <div className="mt-6 flex justify-center">
                    <Link href={`/auth/login?next=/research-lines/${slug}`}>
                      <Button className="gap-2 rounded-full bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 text-primary-foreground shadow-lg shadow-primary/20 transition-transform transition-colors hover:scale-[1.01] hover:text-primary-foreground hover:brightness-110">
                        {detailCopy.releases.login}
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
