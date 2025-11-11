import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Lightbulb, ShieldCheck } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">{about.hero.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {about.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-muted-foreground">{about.hero.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/research-lines">
                <Button size="lg" className="gap-2">
                  {about.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/research-lines#releases">
                <Button variant="ghost" size="lg" className="text-primary">
                  {about.hero.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {about.principles.map((principle, index) => {
                const Icon = principleIcons[principle.icon as keyof typeof principleIcons] ?? Target
                return (
                  <Card
                    key={`${principle.title}-${index}`}
                    className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                    <CardHeader>
                      <Icon className="mb-4 h-10 w-10 text-primary" aria-hidden />
                      <CardTitle>{principle.title}</CardTitle>
                      <CardDescription>{principle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {principle.body && <p className="text-sm text-muted-foreground">{principle.body}</p>}
                      {Array.isArray(principle.bullets) && (
                        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                          {principle.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border bg-muted/40 py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-sky-500/12 to-transparent blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-8 shadow-lg shadow-primary/5 backdrop-blur">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">{about.how.title}</h2>
                <p className="mt-4 text-pretty text-muted-foreground">{about.how.intro}</p>
                <p className="mt-4 text-pretty text-muted-foreground">{about.how.body}</p>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <h3 className="text-lg font-semibold text-foreground">{about.how.pillars.title}</h3>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    {about.how.pillars.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <h3 className="text-lg font-semibold text-foreground">{about.how.collaboration.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {about.how.collaboration.description}{" "}
                    <a className="underline" href="mailto:hola@nebula.ai">
                      hola@nebula.ai
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/12 via-sky-500/10 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">{about.cta.description}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  {about.cta.primary}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/research-lines">
                <Button variant="outline" size="lg" className="border-primary/40">
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
