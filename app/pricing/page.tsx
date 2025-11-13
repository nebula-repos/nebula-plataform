import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function PricingPage() {
  const locale = await getLocale()
  const pricingCopy = await getDictionary(locale, "pricing")
  const plans = pricingCopy.plans as Array<{
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_60%)]" />
            <div className="absolute inset-y-0 left-1/2 h-full w-[55rem] -translate-x-1/2 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-20 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
              <span>{pricingCopy.hero.eyebrow}</span>
            </div>
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {pricingCopy.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-muted-foreground md:text-xl">
              {pricingCopy.hero.description}
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group relative gap-2 overflow-hidden rounded-full !bg-gradient-to-r !from-primary !via-sky-500 !to-emerald-500 !text-primary-foreground px-8 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {pricingCopy.hero.primaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Button>
              </Link>
              <a href={`mailto:${pricingCopy.contact.email}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:shadow-primary/25"
                >
                  {pricingCopy.hero.secondaryCta}
                </Button>
              </a>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              {pricingCopy.overview.note}
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-60 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          </div>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">
                {pricingCopy.overview.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {pricingCopy.overview.title}
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">{pricingCopy.overview.description}</p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/90 via-background/60 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.7)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_55px_130px_-60px_rgba(15,15,15,0.9)] ${
                    plan.highlightLabel ? "ring-2 ring-primary/70" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/5 opacity-60" />
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
                    <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup">
                      <Button className="w-full rounded-full">{plan.cta}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-80 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-background/95 via-primary/5 to-background/80 p-8 shadow-xl shadow-primary/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_60%)]" />
                <CardHeader className="relative space-y-4">
                  <CardTitle className="text-2xl text-foreground">{pricingCopy.included.title}</CardTitle>
                  <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {pricingCopy.included.items.map((item: string) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-muted/50 via-background/80 to-background/60 p-8 shadow-xl shadow-primary/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_55%)]" />
                <CardHeader className="relative space-y-4">
                  <CardTitle className="text-2xl text-foreground">{pricingCopy.contact.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{pricingCopy.contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <a href={`mailto:${pricingCopy.contact.email}`} className="inline-flex">
                    <Button className="rounded-full px-8">{pricingCopy.contact.cta}</Button>
                  </a>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    {pricingCopy.contact.email}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
