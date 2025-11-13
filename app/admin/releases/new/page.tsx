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
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function AdminReleasesNewPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "admin.releases")
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
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/22 via-sky-500/12 to-transparent blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -right-10 bottom-12 size-[360px] rounded-full bg-emerald-300/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-center">
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {copy.newPage.eyebrow}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {copy.newPage.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {copy.newPage.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <Link href="/admin/releases">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    {copy.newPage.back}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-300/10 blur-[240px]" />
            <div className="absolute right-1/3 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <Card className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-background/90 shadow-[0_60px_140px_-80px_rgba(15,15,15,0.85)] backdrop-blur">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-500 to-emerald-400" />
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {copy.newPage.eyebrow}
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">{copy.newPage.cardTitle}</CardTitle>
                  <CardDescription className="text-pretty text-muted-foreground">{copy.newPage.cardDescription}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ReleaseForm researchLines={researchLines ?? []} copy={copy.form} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
