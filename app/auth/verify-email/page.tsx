import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verifica tu correo</CardTitle>
            <CardDescription>Revisa tu bandeja de entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Te hemos enviado un correo electrónico con un enlace de verificación. Por favor, revisa tu bandeja de
              entrada y haz clic en el enlace para activar tu cuenta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
