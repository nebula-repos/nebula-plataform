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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">
              {pricingCopy.hero.eyebrow}
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {pricingCopy.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-muted-foreground">
              {pricingCopy.hero.description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  {pricingCopy.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <a href={`mailto:${pricingCopy.contact.email}`}>
                <Button variant="ghost" size="lg" className="text-primary">
                  {pricingCopy.hero.secondaryCta}
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/40 py-20">
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
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-primary/15 ${plan.highlightLabel ? "ring-2 ring-primary/60" : ""}`}
                >
                  {plan.tag && (
                    <span className="absolute left-6 top-6 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                      {plan.tag}
                    </span>
                  )}
                  {plan.highlightLabel && (
                    <span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground">
                      {plan.highlightLabel}
                    </span>
                  )}
                  <CardHeader className="space-y-4 pt-12">
                    <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-3xl font-bold text-foreground">{plan.price}</p>
                      {plan.originalPrice && (
                        <span className="text-sm font-semibold text-muted-foreground/80 line-through">{plan.originalPrice}</span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup">
                      <Button className="w-full">{plan.cta}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">{pricingCopy.overview.note}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-8 shadow-lg shadow-primary/5 backdrop-blur">
                <h3 className="text-2xl font-semibold text-foreground">{pricingCopy.included.title}</h3>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {pricingCopy.included.items.map((item: string) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-8 shadow-lg shadow-primary/5 backdrop-blur">
                <h3 className="text-2xl font-semibold text-foreground">{pricingCopy.contact.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{pricingCopy.contact.description}</p>
                <a href={`mailto:${pricingCopy.contact.email}`} className="mt-6 inline-flex">
                  <Button>{pricingCopy.contact.cta}</Button>
                </a>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">{pricingCopy.contact.email}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
