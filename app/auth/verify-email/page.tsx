import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-sky-500/12 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur">
          <CardHeader className="items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>Check your inbox</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you an email with a verification link. Please check your inbox and click the link to
              activate your account.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
              Didn&apos;t receive it? Resend from the login screen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
