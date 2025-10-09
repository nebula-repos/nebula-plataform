import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { BookOpen, Users, TrendingUp } from "lucide-react"

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest research lines
  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Investigación de Alta Calidad
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Accede a investigaciones académicas e industriales de vanguardia. Contenido actualizado, implementaciones
              prácticas y análisis profundos.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/research-lines">
                <Button size="lg">Explorar Investigaciones</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">¿Por qué elegirnos?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <BookOpen className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Contenido Estructurado</CardTitle>
                  <CardDescription>
                    Cada publicación incluye actualidad, implementación práctica y análisis académico profundo.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Siempre Actualizado</CardTitle>
                  <CardDescription>
                    Investigaciones actualizadas regularmente con los últimos avances y tendencias del sector.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="mb-4 h-10 w-10 text-primary" />
                  <CardTitle>Comunidad Experta</CardTitle>
                  <CardDescription>
                    Únete a una comunidad de profesionales e investigadores comprometidos con la excelencia.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Latest Research Lines */}
        {researchLines && researchLines.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">Últimas Líneas de Investigación</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {researchLines.map((line) => (
                  <Card key={line.id}>
                    <CardHeader>
                      <CardTitle>{line.title}</CardTitle>
                      <CardDescription>{line.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/research-lines/${line.slug}`}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Ver más
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/research-lines">
                  <Button variant="outline">Ver todas las líneas</Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">¿Listo para comenzar?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Regístrate gratis y accede a contenido exclusivo de investigación de alta calidad.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Crear cuenta gratuita</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
