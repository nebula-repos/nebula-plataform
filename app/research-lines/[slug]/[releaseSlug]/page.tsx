import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { Lock } from "lucide-react"
import { trackReleaseView, trackEvent } from "@/lib/analytics"

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data: releases } = await supabase
    .from("releases")
    .select("slug, research_lines!inner(slug)")
    .eq("is_published", true)

  return (
    releases?.map((release: any) => ({
      slug: release.research_lines.slug,
      releaseSlug: release.slug,
    })) || []
  )
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string; releaseSlug: string }>
}) {
  const { slug, releaseSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  let membershipTier = "free"

  if (user) {
    const { data: userData } = await supabase.from("users").select("membership_tier").eq("id", user.id).single()
    membershipTier = userData?.membership_tier || "free"
  }

  const { data: researchLine } = await supabase.from("research_lines").select("*").eq("slug", slug).single()

  if (!researchLine) {
    notFound()
  }

  const { data: release } = await supabase
    .from("releases")
    .select("*")
    .eq("research_line_id", researchLine.id)
    .eq("slug", releaseSlug)
    .eq("is_published", true)
    .single()

  if (!release) {
    notFound()
  }

  await trackReleaseView(release.id, release.slug, researchLine.slug)

  const { data: sections } = await supabase
    .from("release_sections")
    .select("*")
    .eq("release_id", release.id)
    .order("section_type")

  const isMember = membershipTier === "member"

  if (!isMember && sections && sections.length > 0) {
    await trackEvent("upgrade_prompt_shown", {
      release_id: release.id,
      release_slug: release.slug,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <Link href={`/research-lines/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">
                ← Volver a {researchLine.title}
              </Link>
            </div>
            <h1 className="mb-4 text-4xl font-bold">{release.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {release.published_at
                  ? format(new Date(release.published_at), "d 'de' MMMM, yyyy", { locale: es })
                  : "Sin fecha"}
              </Badge>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            {sections && sections.length > 0 ? (
              <div className="space-y-8">
                {sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {section.section_type === "actualidad"
                            ? "Actualidad"
                            : section.section_type === "implementacion"
                              ? "Implementación"
                              : "Académico"}
                        </span>
                        {!isMember && <Lock className="h-5 w-5 text-muted-foreground" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {isMember ? (
                          <div dangerouslySetInnerHTML={{ __html: section.content_full }} />
                        ) : (
                          <>
                            <div dangerouslySetInnerHTML={{ __html: section.content_teaser }} />
                            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-6 text-center">
                              <p className="mb-4 text-sm text-muted-foreground">
                                Hazte miembro para acceder al contenido completo
                              </p>
                              <Link href="/auth/signup">
                                <Button>Actualizar a Miembro</Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No hay contenido disponible para esta publicación.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
