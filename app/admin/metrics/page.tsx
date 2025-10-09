import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { BarChart3 } from "lucide-react"

export default async function AdminMetricsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get event type counts
  const { data: eventCounts } = await supabase.rpc("get_event_counts" as any).limit(10)

  // Get user growth
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: freeUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "free")

  const { count: memberUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("membership_tier", "member")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Métricas y Análisis</h1>
            <p className="text-lg text-muted-foreground">Estadísticas de uso de la plataforma</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Usuarios</CardTitle>
                  <CardDescription>Usuarios por tipo de membresía</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total de usuarios</span>
                      <span className="text-2xl font-bold">{totalUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Usuarios gratuitos</span>
                      <span className="text-lg font-semibold">{freeUsers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Miembros premium</span>
                      <span className="text-lg font-semibold">{memberUsers || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Actividad de Eventos
                  </CardTitle>
                  <CardDescription>Tipos de eventos más frecuentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {eventCounts && eventCounts.length > 0 ? (
                      eventCounts.map((event: any) => (
                        <div key={event.event_type} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{event.event_type}</span>
                          <span className="font-medium">{event.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay datos de eventos disponibles</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
