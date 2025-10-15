import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import Link from "next/link"
import { trackReleaseView } from "@/lib/analytics"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { Button } from "@/components/ui/button"
import { getAdminClient } from "@/lib/supabase/admin"
import { subscribeToResearchLine, unsubscribeFromResearchLine } from "../actions"
import { ArrowDownToLine, ArrowLeft, ArrowRight, BellRing, ShieldCheck, Sparkles } from "lucide-react"

type ReleaseStaticParamsRow = {
  slug: string
  research_lines: {
    slug: string
  }
}

type ResearchLineRow = {
  id: string
  title: string
  slug: string
}

type PublishedRelease = {
  id: string
  slug: string
  title: string
  published_at: string | null
}

type ReleaseSectionRow = {
  id: string
  section_type: "actualidad" | "industria" | "academico"
  content_full: string
}

type ReleaseDocumentRow = {
  id: string
  display_name: string
  bucket_id: string
  object_path: string
  file_size: number | null
  content_type: string | null
}

type ReleaseDocumentWithUrl = ReleaseDocumentRow & {
  publicUrl: string | null
}

const sectionTitleMap: Record<ReleaseSectionRow["section_type"], string> = {
  actualidad: "Current Landscape",
  industria: "Industry Applications",
  academico: "Academic Foundations",
}

type ReportType = "actualidad" | "industria" | "academico"

const reportMeta: Record<ReportType, { label: string; description: string }> = {
  actualidad: {
    label: "Current Landscape Report",
    description: "Download the macro brief covering signals, shifts, and why this release matters today.",
  },
  industria: {
    label: "Industry Applications Report",
    description: "Operational guidance and implementation blueprints to activate the release in the field.",
  },
  academico: {
    label: "Academic Foundations Report",
    description: "Source studies, references, and theoretical framing that underpin the release.",
  },
}

const reportKeywords: Record<ReportType, string[]> = {
  actualidad: ["actualidad", "current"],
  industria: ["industria", "industry"],
  academico: ["academico", "academic"],
}

const reportOrder: ReportType[] = ["actualidad", "industria", "academico"]

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = getAdminClient()
  const { data: releases } = await supabase
    .from("releases")
    .select("slug, research_lines!inner(slug)")
    .eq("is_published", true)

  const releaseRows: ReleaseStaticParamsRow[] = (releases ?? []) as ReleaseStaticParamsRow[]

  return releaseRows.map((release) => ({
    slug: release.research_lines.slug,
    releaseSlug: release.slug,
  }))
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
  const userProfile = user ? await resolveUserProfile(supabase, user) : null
  const isAdmin = userProfile?.role === "admin"

  const { data: researchLine } = await supabase
    .from("research_lines")
    .select("id, title, slug")
    .eq("slug", slug)
    .single<ResearchLineRow>()

  if (!researchLine) {
    notFound()
  }

  let isSubscribed = false

  if (user && !isAdmin) {
    const { data: subscription } = await supabase
      .from("research_line_subscriptions")
      .select("is_active")
      .eq("user_id", user.id)
      .eq("research_line_id", researchLine.id)
      .maybeSingle()

    isSubscribed = Boolean(subscription?.is_active)
  }

  if (!user && !isAdmin) {
    isSubscribed = false
  }

  if (!isAdmin && !isSubscribed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden border-b border-border bg-background py-20">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sky-500/10 to-transparent blur-3xl" />
              <div className="absolute left-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
            </div>
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <Link
                  href={`/research-lines/${slug}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to {researchLine.title}
                </Link>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">Access required</p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Unlock this SOTA release to stay aligned with the art.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Subscribing to <span className="font-semibold text-foreground">{researchLine.title}</span> grants the full
                release stream, future drops, and activation playbooks for your team.
              </p>
              <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <div className="flex items-start gap-4">
                    <Sparkles className="mt-1 h-8 w-8 text-primary" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">SOTA advantage</p>
                      <p className="mt-2 text-base text-muted-foreground">
                        Access curated intelligence, annotated frameworks, and the SOTA release vault for this line.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Live Signals</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Fresh drops and commentary whenever the frontier shifts.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">Activation Ready</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Implementation notes and rollout checklists to apply instantly.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/85 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-6 w-6 text-primary" aria-hidden />
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">Subscribe now</p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Activate your SOTA pass to see the full release content and download resources.
                  </p>
                  <div className="mt-6">
                    {user ? (
                      <form action={subscribeToResearchLine} className="w-full">
                        <input type="hidden" name="researchLineId" value={researchLine.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <Button size="lg" className="w-full gap-2">
                          Subscribe to the line
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      </form>
                    ) : (
                      <Link href={`/auth/login?next=/research-lines/${slug}/${releaseSlug}`}>
                        <Button size="lg" className="w-full gap-2">
                          Log in to subscribe
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  const { data: release } = await supabase
    .from("releases")
    .select("id, slug, title, published_at")
    .eq("research_line_id", researchLine.id)
    .eq("slug", releaseSlug)
    .eq("is_published", true)
    .single<PublishedRelease>()

  if (!release) {
    notFound()
  }

  await trackReleaseView(release.id, release.slug, researchLine.slug)

  const { data: sections } = await supabase
    .from("release_sections")
    .select("id, section_type, content_full")
    .eq("release_id", release.id)
    .order("section_type")
  const releaseSections: ReleaseSectionRow[] = (sections ?? []) as ReleaseSectionRow[]

  const { data: documents } = await supabase
    .from("release_documents")
    .select("id, display_name, bucket_id, object_path, file_size, content_type")
    .eq("release_id", release.id)
    .order("display_name")
  const releaseDocuments: ReleaseDocumentRow[] = (documents ?? []) as ReleaseDocumentRow[]

  const documentsWithUrls: ReleaseDocumentWithUrl[] = releaseDocuments.map((document) => {
    const { data } = supabase.storage.from(document.bucket_id).getPublicUrl(document.object_path)
    return {
      ...document,
      publicUrl: data.publicUrl ?? null,
    }
  })

  const typedDocuments: Partial<Record<ReportType, ReleaseDocumentWithUrl>> = {}
  const extraDocuments: ReleaseDocumentWithUrl[] = []

  for (const document of documentsWithUrls) {
    const resolvedType = resolveReportType(document)
    if (resolvedType && !typedDocuments[resolvedType]) {
      typedDocuments[resolvedType] = document
    } else {
      extraDocuments.push(document)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/18 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Link
                href={`/research-lines/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to {researchLine.title}
              </Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">
                  SOTA Release · {researchLine.title}
                </p>
                <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {release.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">
                    {release.published_at
                      ? format(new Date(release.published_at), "MMMM d, yyyy", { locale: enUS })
                      : "Unpublished"}
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    Release stream access granted
                  </Badge>
                </div>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Download the three focus reports below to access the brief, implementation notes, and source material
                  packaged for rapid activation.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/85 p-6 shadow-lg shadow-primary/5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
                    {isAdmin ? "Admin access" : "Active subscription"}
                  </p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {isAdmin
                    ? "You are viewing this release with full admin privileges."
                    : "This line stays unlocked while your subscription remains active."}
                </p>
                {!isAdmin && (
                  <form action={unsubscribeFromResearchLine} className="mt-6">
                    <input type="hidden" name="researchLineId" value={researchLine.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <Button variant="outline" className="w-full border-primary/40 gap-2">
                      Unsubscribe from line
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="space-y-16">
              <div>
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Report vault</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    Download the focus reports
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    Each release ships with three curated artifacts. Save them for your team or route them into your
                    intelligence stack.
                  </p>
                </div>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {reportOrder.map((type) => {
                    const document = typedDocuments[type]
                    const meta = reportMeta[type]
                    const publicUrl = document?.publicUrl ?? null
                    const sizeLabel = document ? formatFileSize(document.file_size) : null
                    const fileName = document?.object_path ? document.object_path.split("/").pop() : null

                    return (
                      <div
                        key={type}
                        className="flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-background/85 p-5 shadow-md shadow-primary/5 backdrop-blur"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                            {meta.label}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-3">
                          {publicUrl ? (
                            <Button asChild size="sm" className="gap-2">
                              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="border border-dashed border-primary/50 text-muted-foreground">
                              Upload pending
                            </Badge>
                          )}
                          {fileName && <span className="truncate text-xs text-muted-foreground">{fileName}</span>}
                        </div>
                        {document && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {(sizeLabel ?? "—")} · {document.content_type ?? "application/octet-stream"}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {releaseSections.length > 0 ? (
                <div className="space-y-10">
                  {releaseSections.map((section) => (
                    <Card
                      key={section.id}
                      className="relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur"
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {sectionTitleMap[section.section_type]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          <div dangerouslySetInnerHTML={{ __html: section.content_full }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-12 text-center backdrop-blur">
                  <p className="text-sm text-muted-foreground">
                    Narrative notes are not available for this drop yet. The downloadable reports contain the full brief.
                  </p>
                </div>
              )}

              {extraDocuments.length > 0 && (
                <Card className="relative overflow-hidden border border-border/60 bg-background/90 shadow-lg shadow-primary/5 backdrop-blur">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Additional downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {extraDocuments.map((document) => {
                        const sizeLabel = formatFileSize(document.file_size)
                        return (
                          <li
                            key={document.id}
                            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/80 p-4 transition hover:border-primary/50"
                          >
                            {document.publicUrl ? (
                              <a
                                href={document.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                              >
                                {document.display_name}
                                <ArrowRight className="h-4 w-4" aria-hidden />
                              </a>
                            ) : (
                              <span className="text-sm font-semibold text-muted-foreground">{document.display_name}</span>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {sizeLabel ? `${sizeLabel} · ` : ""}
                              {document.content_type ?? "application/pdf"}
                              {!document.publicUrl && " · File access requires a signed link"}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function formatFileSize(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) {
    return null
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const precision = unitIndex === 0 ? 0 : 1
  return `${size.toFixed(precision)} ${units[unitIndex]}`
}

function resolveReportType(document: Pick<ReleaseDocumentWithUrl, "display_name" | "object_path">): ReportType | null {
  const haystack = `${document.object_path} ${document.display_name}`.toLowerCase()

  for (const type of reportOrder) {
    const matches = reportKeywords[type].some((keyword) => haystack.includes(keyword))
    if (matches) {
      return type
    }
  }

  return null
}
