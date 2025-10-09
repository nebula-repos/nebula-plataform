import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { User, Crown, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get user's recent activity
  const { data: recentEvents } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Mi Cuenta</h1>
            <p className="text-lg text-muted-foreground">Gestiona tu perfil y preferencias</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre completo</label>
                    <p className="text-lg">{userData?.full_name || "No especificado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Correo electrónico</label>
                    <p className="text-lg">{userData?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Miembro desde</label>
                    <p className="text-lg">
                      {userData?.created_at
                        ? format(new Date(userData.created_at), "d 'de' MMMM, yyyy", { locale: es })
                        : "Desconocido"}
                    </p>
                  </div>
                  <Link href="/dashboard/profile">
                    <Button variant="outline">Editar perfil</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Membership Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Membresía
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant={userData?.membership_tier === "member" ? "default" : "secondary"} className="mb-2">
                      {userData?.membership_tier === "member" ? "Miembro Premium" : "Cuenta Gratuita"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {userData?.membership_tier === "member"
                        ? "Tienes acceso completo a todo el contenido"
                        : "Actualiza para acceder a contenido exclusivo"}
                    </p>
                  </div>
                  {userData?.membership_tier === "free" && <Button className="w-full">Actualizar a Premium</Button>}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>Tus últimas interacciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvents && recentEvents.length > 0 ? (
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{event.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
