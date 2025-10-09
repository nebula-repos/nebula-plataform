import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { Users, BookOpen, FileText, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
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

  // Get statistics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalResearchLines } = await supabase
    .from("research_lines")
    .select("*", { count: "exact", head: true })

  const { count: totalReleases } = await supabase.from("releases").select("*", { count: "exact", head: true })

  const { count: totalEvents } = await supabase.from("events").select("*", { count: "exact", head: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Panel de Administración</h1>
            <p className="text-lg text-muted-foreground">Gestiona usuarios, contenido y métricas</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Statistics */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Líneas de Investigación</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalResearchLines || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publicaciones</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReleases || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eventos Totales</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Ver y administrar usuarios de la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/users">
                    <Button className="w-full">Ver Usuarios</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Líneas de Investigación</CardTitle>
                  <CardDescription>Crear y gestionar líneas de investigación</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/research-lines">
                    <Button className="w-full">Gestionar Líneas</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publicaciones</CardTitle>
                  <CardDescription>Crear y editar publicaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/releases">
                    <Button className="w-full">Gestionar Publicaciones</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registro de Auditoría</CardTitle>
                  <CardDescription>Ver historial de acciones administrativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/audit-logs">
                    <Button className="w-full">Ver Registro</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas y Eventos</CardTitle>
                  <CardDescription>Analizar actividad de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/metrics">
                    <Button className="w-full">Ver Métricas</Button>
                  </Link>
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
