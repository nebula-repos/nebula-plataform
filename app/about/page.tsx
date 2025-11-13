import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Lightbulb, ShieldCheck } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

const principleIcons = {
  target: Target,
  users: Users,
  lightbulb: Lightbulb,
  shield: ShieldCheck,
} as const

export default async function AboutPage() {
  const locale = await getLocale()
  const about = await getDictionary(locale, "about")

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-sky-500/15 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
              {about.hero.eyebrow}
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {about.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-muted-foreground md:text-xl">
              {about.hero.description}
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/research-lines">
                <Button
                  size="lg"
                  className="group relative gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {about.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/research-lines#releases">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:shadow-primary/25"
                >
                  {about.hero.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">{about.hero.eyebrow}</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {about.principles.map((principle, index) => {
                const Icon = principleIcons[principle.icon as keyof typeof principleIcons] ?? Target
                return (
                  <MouseGlowCard
                    key={`${principle.title}-${index}`}
                    className="h-full rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/75 p-8"
                  >
                    <div className="flex h-full flex-col gap-6 text-left">
                      <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-primary">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold tracking-tight">{principle.title}</h3>
                        <p className="text-base text-muted-foreground">{principle.description}</p>
                      </div>
                      {principle.body && <p className="text-sm text-muted-foreground">{principle.body}</p>}
                      {Array.isArray(principle.bullets) && (
                        <ul className="space-y-2 text-sm text-muted-foreground/90">
                          {principle.bullets.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </MouseGlowCard>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-primary/5 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-sky-500/12 to-transparent blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/50 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.7)] backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                <CardHeader className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">{about.hero.eyebrow}</p>
                  <CardTitle className="text-3xl font-semibold">{about.how.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{about.how.intro}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-pretty text-muted-foreground">
                  <p>{about.how.body}</p>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/90 via-primary/5 to-background/70 shadow-[0_30px_70px_-45px_rgba(15,15,15,0.65)]">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg font-semibold">{about.how.pillars.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {about.how.pillars.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/90 via-background/70 to-background/60 shadow-[0_30px_70px_-45px_rgba(15,15,15,0.6)]">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg font-semibold">{about.how.collaboration.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {about.how.collaboration.description}{" "}
                      <a className="underline decoration-dotted underline-offset-4" href="mailto:hola@nebula.ai">
                        hola@nebula.ai
                      </a>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/18 via-sky-500/12 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">{about.cta.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group relative gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {about.cta.primary}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <Link href="/research-lines">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:shadow-primary/25"
                >
                  {about.cta.secondary}
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
