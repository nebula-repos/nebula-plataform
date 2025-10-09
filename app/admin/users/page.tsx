import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { UserActions } from "@/components/admin/user-actions"

export default async function AdminUsersPage() {
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

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-2 text-4xl font-bold">Gestión de Usuarios</h1>
            <p className="text-lg text-muted-foreground">Administra usuarios y sus permisos</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Usuarios</CardTitle>
                <CardDescription>Lista completa de usuarios registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users && users.length > 0 ? (
                    users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{u.full_name || "Sin nombre"}</p>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                            <Badge variant={u.membership_tier === "member" ? "default" : "outline"}>
                              {u.membership_tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Registrado: {format(new Date(u.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </p>
                        </div>
                        <UserActions userId={u.id} currentRole={u.role} currentTier={u.membership_tier} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay usuarios registrados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
