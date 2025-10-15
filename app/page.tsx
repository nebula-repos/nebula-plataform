import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Cpu, Gauge, Radar, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { MouseGlowCard } from "@/components/mouse-glow-card"

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const supabase = await createClient()

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
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">SOTA · State of the Art</p>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Signal-first intelligence for State of the Art operators.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              We distill the noise into the SOTA briefings you need: structured releases, applied frameworks, and ready
              to activate plays that keep your team ahead of the curve.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link href="/research-lines">
                <Button size="lg" className="group gap-2">
                  Explore SOTA Releases
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-primary/40 bg-background/70 backdrop-blur">
                  Start for Free
                </Button>
              </Link>
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MouseGlowCard>
                <Sparkles className="mb-4 h-10 w-10 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Curated Signals Each Week</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">400+</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Primary research, benchmarks, and release-ready distillations.
                </p>
              </MouseGlowCard>
              <MouseGlowCard>
                <Radar className="mb-4 h-10 w-10 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Latency to Market</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">&lt; 72 hrs</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fresh drops whenever the frontier shifts — no stale PDFs.
                </p>
              </MouseGlowCard>
              <MouseGlowCard className="sm:col-span-2 lg:col-span-1">
                <Gauge className="mb-4 h-10 w-10 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Practitioner-first</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">Actionable Playbooks</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every release includes implementation notes, metrics, and rollout plans.
                </p>
              </MouseGlowCard>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                SOTA pillars to translate frontier research into leverage.
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                The SOTA layer blends academic rigor with applied context so your org can deploy what is next — not what
                was relevant last quarter.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-foreground to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Cpu className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle>Frontier Intelligence</CardTitle>
                  <CardDescription>
                    Rapid synthesis of bleeding-edge research with the context that matters for product, policy, and
                    growth teams.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-foreground to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Workflow className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle>SOTA Playbooks</CardTitle>
                  <CardDescription>
                    Opinionated frameworks, reference architectures, and implementation notes engineered for velocity.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="group relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-foreground to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <ShieldCheck className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle>Signal Guardrails</CardTitle>
                  <CardDescription>
                    Curation, validation, and expert review that filters hype and surfaces only the durable moves.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Latest Research Lines */}
        {researchLines && researchLines.length > 0 && (
          <section className="border-y border-border bg-muted/40 py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Latest SOTA drops</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Releases landing now inside the platform.
                </h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                  Your fast lane to the art: we surface the newest lines, ready to plug into your roadmap.
                </p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {researchLines.map((line) => {
                  const releaseDate = line.created_at ? new Date(line.created_at).toLocaleDateString() : "New"

                  return (
                    <Card
                      key={line.id}
                      className="group relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 group-hover:opacity-100" />
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground/70">
                          <span>SOTA Release</span>
                          <span>{releaseDate}</span>
                        </div>
                        <CardTitle className="text-2xl font-semibold leading-tight text-foreground">{line.title}</CardTitle>
                        <CardDescription className="text-pretty text-muted-foreground">
                          {line.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-primary/80">
                          <span>Brief</span>
                          <span>Implementation</span>
                          <span>Signals</span>
                        </div>
                        <Link href={`/research-lines/${line.slug}`}>
                          <Button variant="outline" className="group/btn w-full border-primary/50 bg-background/50">
                            Dive into the Art
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
                    View all releases
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
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  A workflow engineered for SOTA decision-making.
                </h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                  From signal detection to rollout, SOTA keeps your organisation aligned on the art that matters. Each
                  release travels through our live pipeline so you can trust the output.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-6 backdrop-blur">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      1
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">Capture &amp; context</p>
                      <p className="text-sm text-muted-foreground">
                        Blend academic breakouts, community intelligence, and market telemetry into a single signal map.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      2
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">Art distillation</p>
                      <p className="text-sm text-muted-foreground">
                        Editorial sprints transform research lines into concise briefs, annotated diagrams, and applied
                        frameworks.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      3
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">Activation ready</p>
                      <p className="text-sm text-muted-foreground">
                        Playbooks ship with success metrics, rollout checklists, and integration notes so teams can move
                        instantly.
                      </p>
                    </div>
                  </li>
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
              Ready to operate at the state of the art?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Join the SOTA platform and transform how your team senses, understands, and deploys what is next.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Create a free account
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="text-primary">
                  Learn about the mission
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
