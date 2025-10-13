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

export default async function ProfilePage() {
  const supabase = await createClient()

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
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Profile Sync
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Tune your SOTA identity.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Keep your details sharp so we can tailor releases, alerts, and collaboration invites to your operating
                  context.
                </p>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2 border-primary/40 bg-background/70 backdrop-blur">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-md shadow-primary/5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Current name</p>
                <p className="mt-2 text-sm text-muted-foreground">{userProfile.full_name || "Not specified"}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-md shadow-primary/5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Email</p>
                <p className="mt-2 text-sm text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-2xl px-4">
            <Card className="border border-border/60 bg-background/85 shadow-lg shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Personal information</CardTitle>
                <CardDescription>
                  Update your profile details. Changes take effect immediately across SOTA surfaces.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={userProfile} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
