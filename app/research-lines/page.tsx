import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600 // Revalidate every hour

export default async function ResearchLinesPage() {
  const supabase = await createClient()

  const { data: researchLines } = await supabase
    .from("research_lines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold">Líneas de Investigación</h1>
            <p className="text-lg text-muted-foreground">
              Explora nuestras líneas de investigación activas y sus publicaciones más recientes.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {researchLines && researchLines.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {researchLines.map((line) => (
                  <Card key={line.id}>
                    <CardHeader>
                      <CardTitle>{line.title}</CardTitle>
                      <CardDescription>{line.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/research-lines/${line.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver publicaciones →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No hay líneas de investigación disponibles en este momento.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
