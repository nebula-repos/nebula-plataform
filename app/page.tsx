import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Check, Cpu, Gauge, Radar, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { MouseGlowCard } from "@/components/mouse-glow-card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { ResearchLineCard } from "@/components/research-line-card"

export const revalidate = 3600

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
  const pricingCopy = await getDictionary(locale, "pricing")
  const dateFormatter = locale === "es" ? "es-ES" : "en-US"
  const pricingPlans = pricingCopy.plans as Array<{
    id: string
    tag?: string | null
    name: string
    price: string
    originalPrice?: string | null
    highlightLabel?: string | null
    description: string
    features: string[]
    cta: string
  }>

  // Fetch latest research lines
  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>{home.hero.eyebrow}</span>
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              {home.hero.subtitle}
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/research-lines">
                <Button
                  size="lg"
                  className="group relative gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {home.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:shadow-primary/25"
                >
                  {home.hero.secondaryCta}
                </Button>
              </Link>
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {home.highlights.map((highlight, index) => {
                const Icon = iconMap[highlight.icon as keyof typeof iconMap] ?? Sparkles

                return (
                  <MouseGlowCard
                    key={`${highlight.label}-${index}`}
                    className={`relative overflow-hidden border border-white/15 bg-gradient-to-b from-background/80 via-primary/5 to-background/80 p-8 text-left shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 ${highlight.className ?? ""}`}
                  >
                    <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{highlight.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-foreground">{highlight.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
                  </MouseGlowCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative overflow-hidden py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{home.features.title}</h2>
              <p className="mt-4 text-pretty text-muted-foreground">{home.features.subtitle}</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {home.features.cards.map((pillar, index) => {
                const Icon = iconMap[pillar.icon as keyof typeof iconMap] ?? Sparkles

                return (
                  <Card
                    key={`${pillar.title}-${index}`}
                    className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/90 via-background/60 to-background/80 shadow-[0_30px_70px_-45px_rgba(15,15,15,0.65)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_45px_110px_-55px_rgba(15,15,15,0.82)]"
                  >
                    <CardHeader className="relative space-y-4">
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-sky-500/20 to-background text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle className="text-2xl text-foreground">{pillar.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{pillar.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative pt-6">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">{pricingCopy.overview.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {pricingCopy.overview.title}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">{pricingCopy.overview.description}</p>
              <div className="mt-6">
                <Link href="/pricing">
                  <Button variant="ghost" className="group text-primary">
                    <span className="flex items-center gap-2">
                      {pricingCopy.overview.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/90 via-background/60 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.7)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_55px_130px_-60px_rgba(15,15,15,0.9)] ${
                    plan.highlightLabel ? "ring-2 ring-primary/70" : ""
                  }`}
                >
                  {plan.tag && (
                    <span className="absolute left-6 top-6 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                      {plan.tag}
                    </span>
                  )}
                  {plan.highlightLabel && (
                    <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground">
                      {plan.highlightLabel}
                    </span>
                  )}
                  <CardHeader className="relative space-y-4 pt-12">
                    <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-3xl font-bold text-foreground">{plan.price}</p>
                      {plan.originalPrice && (
                        <span className="text-sm font-semibold text-muted-foreground/80 line-through">{plan.originalPrice}</span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup">
                      <Button className="w-full rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 text-primary-foreground shadow-md shadow-primary/30">
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{pricingCopy.overview.note}</p>
          </div>
        </section>

        {/* Latest Research Lines */}
        {researchLines && researchLines.length > 0 && (
          <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-br from-muted/50 via-background to-muted/30 py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{home.latest.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{home.latest.title}</h2>
                <p className="mt-4 text-pretty text-muted-foreground">{home.latest.description}</p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {researchLines.map((line) => (
                  <ResearchLineCard
                    key={line.id}
                    line={line}
                    eyebrowLabel={home.latest.cardEyebrow}
                    dateFormatter={dateFormatter}
                    dateFallbackLabel={home.latest.newLabel}
                    tags={home.releaseTags}
                    ctaLabel={home.latest.cta}
                  />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/research-lines">
                  <Button variant="outline" className="rounded-full border-primary/40 bg-white/5 shadow-md shadow-primary/10 hover:shadow-primary/20">
                    {home.latest.button}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Workflow Section */}
        <section className="relative overflow-hidden py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{home.workflow.title}</h2>
                <p className="mt-4 text-pretty text-muted-foreground">{home.workflow.description}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-background/90 to-background/60 p-8 shadow-[0_30px_80px_-55px_rgba(15,15,15,0.75)] backdrop-blur transition-shadow hover:shadow-[0_45px_130px_-65px_rgba(15,15,15,0.9)]">
                <ol className="space-y-6">
                  {home.workflow.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <div className="relative flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-sky-500/10 to-background text-sm font-semibold text-primary">
                        <span>{index + 1}</span>
                        <span className="absolute -right-4 top-1/2 hidden h-px w-12 -translate-y-1/2 bg-gradient-to-r from-primary/30 to-transparent lg:block" />
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
        <section className="relative overflow-hidden py-28">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-white/5 px-8 py-16 shadow-[0_45px_140px_-70px_rgba(15,15,15,0.9)] backdrop-blur">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{home.cta.title}</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{home.cta.description}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-8 text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-[1.02]"
                  >
                    {home.cta.primary}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full text-primary transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-primary/20"
                  >
                    {home.cta.secondary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
