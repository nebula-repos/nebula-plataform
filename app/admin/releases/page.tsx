import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { RevalidateButton } from "@/components/admin/revalidate-button"

export default async function AdminReleasesPage() {
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

  const { data: releases } = await supabase
    .from("releases")
    .select("*, research_lines(title, slug)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">Publicaciones</h1>
                <p className="text-lg text-muted-foreground">Gestiona las publicaciones</p>
              </div>
              <Link href="/admin/releases/new">
                <Button>Nueva Publicación</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Todas las Publicaciones</CardTitle>
                <CardDescription>Lista completa de publicaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {releases && releases.length > 0 ? (
                    releases.map((release: any) => (
                      <div
                        key={release.id}
                        className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{release.title}</p>
                            <Badge variant={release.is_published ? "default" : "secondary"}>
                              {release.is_published ? "Publicada" : "Borrador"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Línea: {release.research_lines?.title || "Sin línea"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {release.published_at
                              ? format(new Date(release.published_at), "d 'de' MMMM, yyyy", { locale: es })
                              : "Sin fecha de publicación"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RevalidateButton
                            type="release"
                            researchLineSlug={release.research_lines?.slug}
                            releaseSlug={release.slug}
                          />
                          <Link
                            href={`/research-lines/${release.research_lines?.slug}/${release.slug}`}
                            target="_blank"
                          >
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay publicaciones</p>
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
