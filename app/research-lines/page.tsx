import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarDays, Compass, Layers, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"
import { ResearchLineCard } from "@/components/research-line-card"

export const dynamic = "force-dynamic"

const statIcons = {
  sparkles: Sparkles,
  layers: Layers,
  compass: Compass,
  calendar: CalendarDays,
} as const

export default async function ResearchLinesPage() {
  const supabase = await createClient()
  const locale = await getLocale()
  const researchLinesCopy = await getDictionary(locale, "researchLines")
  const homeCopy = await getDictionary(locale, "home")
  const dateFormatter = locale === "es" ? "es-ES" : "en-US"

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
  const totalActiveLines = researchLines?.length ?? 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-800/15 via-cyan-600/10 to-transparent blur-3xl" />
            <div className="absolute -right-16 top-1/4 size-[360px] rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>{researchLinesCopy.hero.eyebrow}</span>
                </div>
                <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                  {researchLinesCopy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {researchLinesCopy.hero.description}
                </p>
                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <Link href="#lines" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="group relative w-full gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-blue-800 !via-cyan-600 !to-emerald-400 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {researchLinesCopy.hero.primaryCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Button>
                  </Link>
                  {user ? (
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:text-primary sm:w-auto"
                      >
                        {researchLinesCopy.hero.authCta}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/signup" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:text-primary sm:w-auto"
                      >
                        {researchLinesCopy.hero.guestCta}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80">
                  <div className="inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 shadow-inner shadow-white/5">
                    <div>
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground/70">
                        {researchLinesCopy.list.badge}
                      </p>
                      <p className="text-3xl font-semibold text-foreground">{totalActiveLines}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-primary/80">{researchLinesCopy.list.releasesLabel}</p>
                  </div>
                  <p className="max-w-sm text-pretty">{researchLinesCopy.list.subheading}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {researchLinesCopy.stats.map((card, index) => {
                  const Icon = statIcons[card.icon as keyof typeof statIcons] ?? Sparkles
                  return (
                    <MouseGlowCard key={`${card.title}-${index}`} className="h-full border border-white/10 bg-gradient-to-b from-background/90 via-primary/5 to-background/80">
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{card.title}</p>
                      <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
                    </MouseGlowCard>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="lines" className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-emerald-300/10 blur-[260px]" />
            <div className="absolute left-1/3 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">{researchLinesCopy.list.badge}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {researchLinesCopy.list.heading}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">{researchLinesCopy.list.subheading}</p>
            </div>

            <div className="mt-12">
              {researchLines && researchLines.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {researchLines.map((line) => (
                    <ResearchLineCard
                      key={line.id}
                      line={line}
                      eyebrowLabel={researchLinesCopy.list.badge}
                      dateFormatter={dateFormatter}
                      dateFallbackLabel={researchLinesCopy.list.freshFallback}
                      tags={homeCopy.releaseTags}
                      ctaLabel={researchLinesCopy.list.viewReleases}
                      descriptionFallback={researchLinesCopy.list.subheading}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 px-8 py-16 text-center shadow-inner shadow-white/5 backdrop-blur">
                  <p className="text-base text-muted-foreground">{researchLinesCopy.list.empty}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
