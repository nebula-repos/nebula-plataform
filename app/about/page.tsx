import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Lightbulb, ShieldCheck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">About the platform</h1>
            <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg text-muted-foreground">
              Nebula is a research platform built to connect frontier discoveries with teams that need to turn ideas into
              impact. We curate knowledge, organize it into clear research lines, and provide tools that keep everything
              current.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
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

              <Card>
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

              <Card>
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

              <Card>
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

        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold">How we work</h2>
                <p className="mt-4 text-muted-foreground">
                  The Nebula team blends research, product, and operations backgrounds. We rely on collaborative
                  workflows to ensure every launch has editorial quality, methodological rigor, and actionable guidance.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Our roadmap is built with the community: we prioritize emerging areas, study needs, and keep recurring
                  update cycles.
                </p>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Impact pillars</h3>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    <li>Enable informed strategic decisions.</li>
                    <li>Shorten technology adoption timelines.</li>
                    <li>Strengthen academia–industry partnerships.</li>
                    <li>Measure outcomes and share learnings.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Want to collaborate?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We partner with researchers, organizations, and teams willing to share projects, data, or use cases.
                    Reach out at <a className="underline" href="mailto:hola@nebula.ai">hola@nebula.ai</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
