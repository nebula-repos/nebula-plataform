import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Cpu, Gauge, Radar, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { MouseGlowCard } from "@/components/mouse-glow-card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export const revalidate = 3600 // Revalidate every hour

const iconMap = {
  sparkles: Sparkles,
  radar: Radar,
  gauge: Gauge,
  cpu: Cpu,
  workflow: Workflow,
  shield: ShieldCheck,
} as const

export default async function HomePage() {
  const supabase = await createClient()
  const locale = await getLocale()
  const home = await getDictionary(locale, "home")
  const dateFormatter = locale === "es" ? "es-ES" : "en-US"

  // Fetch latest research lines
  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{home.hero.eyebrow}</p>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">{home.hero.subtitle}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/research-lines">
                <Button size="lg" className="group gap-2">
                  {home.hero.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-primary/40 bg-background/70 backdrop-blur">
                  {home.hero.secondaryCta}
                </Button>
              </Link>
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {home.highlights.map((highlight, index) => {
                const Icon = iconMap[highlight.icon as keyof typeof iconMap] ?? Sparkles
                return (
                  <MouseGlowCard key={`${highlight.label}-${index}`} className={highlight.className ?? undefined}>
                    <Icon className="mb-4 h-10 w-10 text-primary" aria-hidden />
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">{highlight.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{highlight.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
                  </MouseGlowCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{home.features.title}</h2>
              <p className="mt-4 text-pretty text-muted-foreground">{home.features.subtitle}</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {home.features.cards.map((pillar, index) => {
                const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Sparkles
                return (
                  <Card
                    key={`${pillar.title}-${index}`}
                    className="group relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-foreground to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CardHeader>
                      <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <CardTitle>{pillar.title}</CardTitle>
                      <CardDescription>{pillar.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Latest Research Lines */}
        {researchLines && researchLines.length > 0 && (
          <section className="border-y border-border bg-muted/40 py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{home.latest.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{home.latest.title}</h2>
                <p className="mt-4 text-pretty text-muted-foreground">{home.latest.description}</p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {researchLines.map((line) => {
                  const releaseDate = line.created_at
                    ? new Date(line.created_at).toLocaleDateString(dateFormatter)
                    : home.latest.newLabel

                  return (
                    <Card
                      key={line.id}
                      className="group relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                          <span>{home.latest.cardEyebrow}</span>
                          <span>{releaseDate}</span>
                        </div>
                        <CardTitle className="text-2xl font-semibold leading-tight text-foreground">{line.title}</CardTitle>
                        <CardDescription className="text-pretty text-muted-foreground">{line.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-primary/80">
                          {home.releaseTags.map((label) => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>
                        <Link href={`/research-lines/${line.slug}`}>
                          <Button variant="outline" className="group/btn w-full border-primary/50 bg-background/50">
                            {home.latest.cta}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <div className="mt-8 text-center">
                <Link href="/research-lines">
                  <Button variant="outline" className="border-primary/40">
                    {home.latest.button}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Workflow Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{home.workflow.title}</h2>
                <p className="mt-4 text-pretty text-muted-foreground">{home.workflow.description}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-6 backdrop-blur">
                <ol className="space-y-6">
                  {home.workflow.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-sky-500/15 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {home.cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{home.cta.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  {home.cta.primary}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="text-primary">
                  {home.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
