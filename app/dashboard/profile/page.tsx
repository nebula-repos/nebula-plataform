import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile, buildProfileFallback } from "@/lib/supabase/profiles"
import { ProfileForm } from "@/components/profile-form"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function ProfilePage() {
  const supabase = await createClient()
  const locale = await getLocale()
  const profileCopy = await getDictionary(locale, "dashboard.profile")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userProfile = (await resolveUserProfile(supabase, user)) ?? buildProfileFallback(user)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-blue-800/15 via-cyan-600/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {profileCopy.hero.badge}
                </div>
                <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {profileCopy.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {profileCopy.hero.description}
                </p>
              </div>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="gap-2 rounded-full border-white/30 bg-white/5 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/10 hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {profileCopy.hero.backCta}
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-foreground shadow-inner shadow-white/5 backdrop-blur">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {profileCopy.details.currentName}
                </p>
                <p className="mt-2 text-base">
                  {userProfile.full_name || profileCopy.details.missing}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-foreground shadow-inner shadow-white/5 backdrop-blur">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {profileCopy.details.email}
                </p>
                <p className="mt-2 text-base">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-muted/20 to-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-emerald-300/10 blur-[260px]" />
            <div className="absolute left-1/3 top-1/3 size-[360px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container mx-auto max-w-2xl px-4">
            <Card className="group relative overflow-hidden border border-white/10 bg-gradient-to-b from-background/95 via-background/70 to-background/40 shadow-[0_35px_80px_-50px_rgba(15,15,15,0.6)] backdrop-blur">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-800/10 via-transparent to-emerald-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{profileCopy.form.cardTitle}</CardTitle>
                <CardDescription className="text-muted-foreground">{profileCopy.form.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={userProfile} copy={profileCopy.form} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
