import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ReleaseForm } from "@/components/admin/release-form"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default async function AdminReleasesNewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)

  if (userProfile.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("id, title, slug")
    .order("title", { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  New Release
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Publish the next art drop.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Connect the drop to its line, schedule the date, and upload the three focus reports in one flow.
                </p>
              </div>
              <Link href="/admin/releases">
                <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to releases
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle>Release upload</CardTitle>
                <CardDescription>Select the line, define the slug, and upload the three bundled reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReleaseForm researchLines={researchLines ?? []} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
