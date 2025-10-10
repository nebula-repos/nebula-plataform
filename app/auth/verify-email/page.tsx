import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>Check your inbox</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you an email with a verification link. Please check your inbox and click the link to
              activate your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
