"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackEventClient } from "@/lib/analytics-client"
interface LoginCopy {
  badge: string
  headline: string
  subhead: string
  badgeFooter: string
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  submitLoading: string
  submit: string
  signupPrompt: string
  signupCta: string
  genericError: string
}

interface LoginClientProps {
  copy: LoginCopy
}

export function LoginClient({ copy }: LoginClientProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      await trackEventClient("login", { email })

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : copy.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/15 via-cyan-600/12 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative z-10 grid w-full max-w-5xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:px-12">
        <div className="hidden flex-col justify-between rounded-3xl border border-border/60 bg-background/80 p-8 shadow-lg shadow-primary/5 backdrop-blur md:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              <Sparkles className="h-4 w-4" aria-hidden />
              {copy.badge}
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">{copy.headline}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{copy.subhead}</p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">{copy.badgeFooter}</p>
        </div>
        <Card className="border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">{copy.cardTitle}</CardTitle>
            <CardDescription>{copy.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{copy.emailLabel}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{copy.passwordLabel}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? copy.submitLoading : copy.submit}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {copy.signupPrompt}{" "}
                <Link href="/auth/signup" className="underline underline-offset-4">
                  {copy.signupCta}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
