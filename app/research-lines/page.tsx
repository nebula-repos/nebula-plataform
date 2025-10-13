import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarDays, Compass, Layers, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ResearchLinesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">SOTA Atlas</p>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Research lines engineered to deliver State of the Art velocity.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Explore the living catalogue of SOTA research lines. Each track curates the signals, releases, and
                playbooks that keep your teams aligned with the frontier.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link href="#lines">
                <Button size="lg" className="group gap-2">
                  Browse active lines
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Button>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-primary/40 bg-background/70 backdrop-blur">
                    Go to my dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="border-primary/40 bg-background/70 backdrop-blur">
                    Request SOTA access
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-lg shadow-primary/5 backdrop-blur">
                <Sparkles className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Signals mapped</p>
                <p className="text-base text-muted-foreground">
                  Curators distill the noise into intel drops, refreshed weekly.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-lg shadow-primary/5 backdrop-blur">
                <Layers className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Structured releases</p>
                <p className="text-base text-muted-foreground">
                  Each line ships with staged releases and activation notes.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-lg shadow-primary/5 backdrop-blur">
                <Compass className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Sector coverage</p>
                <p className="text-base text-muted-foreground">
                  From AI infrastructure to policy shifts, we track the frontier.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-lg shadow-primary/5 backdrop-blur">
                <CalendarDays className="mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">Fresh every week</p>
                <p className="text-base text-muted-foreground">
                  Release cadence keeps the art aligned with present reality.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="lines" className="py-20">
          <div className="container mx-auto px-4">
            {researchLines && researchLines.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {researchLines.map((line) => {
                  const createdLabel = line.created_at
                    ? new Date(line.created_at).toLocaleDateString()
                    : "Fresh drop"

                  return (
                    <Card
                      key={line.id}
                      className="group relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                          <span>SOTA Line</span>
                          <span>{createdLabel}</span>
                        </div>
                        <CardTitle className="text-2xl font-semibold leading-snug text-foreground">{line.title}</CardTitle>
                        <CardDescription className="text-pretty text-muted-foreground">{line.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.25em] text-primary/80">Releases live</span>
                        <Link href={`/research-lines/${line.slug}`}>
                          <Button variant="ghost" size="sm" className="gap-1 text-primary">
                            View releases
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No research lines available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
