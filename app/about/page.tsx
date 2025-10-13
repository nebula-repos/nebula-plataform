import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, Users, Lightbulb, ShieldCheck } from "lucide-react"

export default function AboutPage() {
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
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">Inside SOTA</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Nebula turns frontier research into State of the Art operating leverage.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-muted-foreground">
              We map the signals, curate the art, and ship activation-ready releases so teams can deploy what is next —
              not what was relevant last quarter.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/research-lines">
                <Button size="lg" className="gap-2">
                  Explore SOTA lines
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/research-lines#releases">
                <Button variant="ghost" size="lg" className="text-primary">
                  View recent releases
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                <CardHeader>
                  <Target className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Our mission</CardTitle>
                  <CardDescription>
                    We close the gap between academic research and real implementation across organizations, teams, and
                    communities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We select research with high transformational potential, structure it into understandable journeys,
                    and highlight the concrete steps needed to put it into practice.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                <CardHeader>
                  <Users className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Expert community</CardTitle>
                  <CardDescription>
                    We collaborate with researchers, industry specialists, and mentors to validate every line.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The platform evolves alongside the community. Every release blends feedback, usage metrics, and
                    outcomes from real teams.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                <CardHeader>
                  <Lightbulb className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Methodology</CardTitle>
                  <CardDescription>
                    Each release combines current context, implementation guidance, and academic foundations in one place.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    <li>Current landscape: what is happening and why it matters.</li>
                    <li>Implementation: tactical guides, tools, and real cases.</li>
                    <li>Academic foundations: theoretical frameworks and references to go deeper.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                <CardHeader>
                  <ShieldCheck className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Commitment</CardTitle>
                  <CardDescription>
                    Transparency, security, and content quality are the pillars of our operation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We invest in robust editorial processes, ongoing audits, and metrics that let us measure the real
                    impact of every release.
                  </p>
                </CardContent>
              </Card>
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
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">How we work</h2>
                <p className="mt-4 text-pretty text-muted-foreground">
                  The Nebula collective blends research, product, and operations expertise. Every SOTA release moves
                  through an editorial pipeline that pairs qualitative insights with measurable outcomes.
                </p>
                <p className="mt-4 text-pretty text-muted-foreground">
                  Our roadmap is community-built: we surface emerging art, co-design lines with partners, and sustain
                  recurring update cycles so the intelligence never goes stale.
                </p>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <h3 className="text-lg font-semibold text-foreground">Impact pillars</h3>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    <li>Enable informed strategic decisions across teams.</li>
                    <li>Shorten adoption timelines for emergent technologies.</li>
                    <li>Strengthen academia–industry knowledge exchange.</li>
                    <li>Measure outcomes and circulate learnings back to the network.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <h3 className="text-lg font-semibold text-foreground">Want to collaborate?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We partner with researchers, operators, and organisations willing to share projects, data, or use
                    cases. Reach out at <a className="underline" href="mailto:hola@nebula.ai">hola@nebula.ai</a>.
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
              Ready to build with the art?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Join the SOTA platform, explore active lines, and collaborate with us on future releases.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Create a free account
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/research-lines">
                <Button variant="outline" size="lg" className="border-primary/40">
                  Browse SOTA lines
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
