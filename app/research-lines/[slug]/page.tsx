import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { trackResearchLineView } from "@/lib/analytics"

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: researchLines } = await supabase.from("research_lines").select("slug").eq("is_active", true)

  return researchLines?.map((line) => ({ slug: line.slug })) || []
}

export default async function ResearchLinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: researchLine } = await supabase.from("research_lines").select("*").eq("slug", slug).single()

  if (!researchLine) {
    notFound()
  }

  await trackResearchLineView(researchLine.id, researchLine.slug)

  const { data: releases } = await supabase
    .from("releases")
    .select("*")
    .eq("research_line_id", researchLine.id)
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold">{researchLine.title}</h1>
            <p className="text-lg text-muted-foreground">{researchLine.description}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-2xl font-bold">Releases</h2>
            {releases && releases.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {releases.map((release) => (
                  <Card key={release.id}>
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary">
                          {release.published_at
                            ? formatDistanceToNow(new Date(release.published_at), { addSuffix: true, locale: enUS })
                            : "No date"}
                        </Badge>
                      </div>
                      <CardTitle>{release.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/research-lines/${slug}/${release.slug}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read release →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No releases available for this research line.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
