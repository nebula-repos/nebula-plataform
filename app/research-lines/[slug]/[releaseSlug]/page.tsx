import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { enUS, es as esLocale } from "date-fns/locale"
import Link from "next/link"
import { trackReleaseView } from "@/lib/analytics"
import { resolveUserProfile } from "@/lib/supabase/profiles"
import { Button } from "@/components/ui/button"
import { getAdminClient } from "@/lib/supabase/admin"
import { subscribeToResearchLine, unsubscribeFromResearchLine } from "../actions"
import { ArrowDownToLine, ArrowLeft, ArrowRight, BellRing, ShieldCheck, Sparkles } from "lucide-react"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

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

type ReportType = "actualidad" | "industria" | "academico"

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
  const locale = await getLocale()
  const releaseCopy = await getDictionary(locale, "researchLineRelease")
  const supabase = await createClient()
  const dateLocale = locale === "es" ? esLocale : enUS

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

  const gateBackLabel = releaseCopy.gate.back.replace("{lineTitle}", researchLine.title)
  const [gateDescriptionStart, gateDescriptionEnd = ""] = releaseCopy.gate.description.split("{lineTitle}")

  if (!isAdmin && !isSubscribed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/25 via-sky-500/10 to-transparent blur-3xl" />
              <div className="absolute left-1/4 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute right-0 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
            </div>
            <div className="container mx-auto px-4">
              <div className="mb-10">
                <Link
                  href={`/research-lines/${slug}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {gateBackLabel}
                </Link>
              </div>
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    <span>{releaseCopy.gate.eyebrow}</span>
                  </div>
                  <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                    {releaseCopy.gate.title}
                  </h1>
                  <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                    {gateDescriptionStart}
                    <span className="font-semibold text-primary">{researchLine.title}</span>
                    {gateDescriptionEnd}
                  </p>
                  <div className="mt-12 space-y-6">
                    <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-background/95 via-primary/10 to-background/70 p-8 shadow-2xl shadow-primary/10 backdrop-blur">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                          <Sparkles className="h-6 w-6" aria-hidden />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                            {releaseCopy.gate.advantage.title}
                          </p>
                          <p className="mt-3 text-base text-muted-foreground">{releaseCopy.gate.advantage.body}</p>
                        </div>
                      </div>
                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                            {releaseCopy.gate.advantage.live.title}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{releaseCopy.gate.advantage.live.description}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
                            {releaseCopy.gate.advantage.activation.title}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {releaseCopy.gate.advantage.activation.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-background/95 via-primary/10 to-background/70 p-8 shadow-2xl shadow-primary/20 backdrop-blur">
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-primary">
                    <BellRing className="h-5 w-5" aria-hidden />
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                      {releaseCopy.gate.subscribe.title}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{releaseCopy.gate.subscribe.description}</p>
                  <div className="mt-8">
                    {user ? (
                      <form action={subscribeToResearchLine} className="w-full space-y-4">
                        <input type="hidden" name="researchLineId" value={researchLine.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <Button
                          size="lg"
                          className="group relative w-full gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition duration-300 hover:scale-[1.01]"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {releaseCopy.gate.subscribe.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                          </span>
                        </Button>
                      </form>
                    ) : (
                      <Link href={`/auth/login?next=/research-lines/${slug}/${releaseSlug}`}>
                        <Button
                          size="lg"
                          className="group relative w-full gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition duration-300 hover:scale-[1.01]"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {releaseCopy.gate.subscribe.login}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                          </span>
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

  const releaseBackLabel = releaseCopy.release.back.replace("{lineTitle}", researchLine.title)
  const releaseEyebrow = releaseCopy.release.eyebrow.replace("{lineTitle}", researchLine.title)
  const statusLabel = isAdmin ? releaseCopy.release.status.admin : releaseCopy.release.status.member
  const statusDescription = isAdmin ? releaseCopy.release.status.adminNote : releaseCopy.release.status.memberNote
  const publishedLabel = release.published_at
    ? format(new Date(release.published_at), "MMMM d, yyyy", { locale: dateLocale })
    : releaseCopy.release.status.unpublished
  const sectionTitleMap = releaseCopy.release.sections.titles as Record<ReleaseSectionRow["section_type"], string>
  const reportMeta = releaseCopy.reportsMeta as Record<ReportType, { label: string; description: string }>

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/20 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -left-24 bottom-0 size-[360px] rounded-full bg-emerald-400/10 blur-[120px]" />
          </div>
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <Link
                href={`/research-lines/${slug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {releaseBackLabel}
              </Link>
            </div>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>{releaseEyebrow}</span>
                </div>
                <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                  {release.title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  {releaseCopy.release.body}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Badge className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground shadow-inner shadow-primary/20">
                    {publishedLabel}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-primary/40 px-4 py-2 text-sm font-semibold text-primary">
                    {releaseCopy.release.status.accessGranted}
                  </Badge>
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-background/95 via-primary/10 to-background/70 p-8 shadow-2xl shadow-primary/20 backdrop-blur">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-primary">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{statusLabel}</p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{statusDescription}</p>
                {!isAdmin && (
                  <form action={unsubscribeFromResearchLine} className="mt-8">
                    <input type="hidden" name="researchLineId" value={researchLine.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <Button
                      variant="outline"
                      className="w-full gap-2 rounded-full border-primary/50 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary"
                    >
                      {releaseCopy.release.actions.unsubscribe}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-muted/25 to-background py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/15 via-sky-500/5 to-transparent blur-3xl" />
            <div className="absolute left-0 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="container mx-auto max-w-5xl px-4">
            <div className="space-y-16">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 p-10 shadow-xl shadow-primary/10 backdrop-blur">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                    {releaseCopy.release.reports.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {releaseCopy.release.reports.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">{releaseCopy.release.reports.description}</p>
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
                        className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 p-6 shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-1 hover:border-primary/50"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">{meta.label}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{meta.description}</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-3">
                          {publicUrl ? (
                            <Button
                              asChild
                              size="sm"
                              className="gap-2 rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 text-primary-foreground shadow-md shadow-primary/30"
                            >
                              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                                {releaseCopy.release.reports.download}
                              </a>
                            </Button>
                          ) : (
                            <Badge className="rounded-full border border-dashed border-white/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                              {releaseCopy.release.reports.pending}
                            </Badge>
                          )}
                          {fileName && <span className="truncate text-xs text-muted-foreground">{fileName}</span>}
                        </div>
                        {document && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {(sizeLabel ?? "—")} · {document.content_type ?? releaseCopy.release.reports.fileFallback}
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
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 shadow-2xl shadow-primary/10 backdrop-blur"
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                      <CardHeader className="pt-10">
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {sectionTitleMap[section.section_type] ?? section.section_type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-10">
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          <div dangerouslySetInnerHTML={{ __html: section.content_full }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/20 bg-muted/30 p-12 text-center text-sm text-muted-foreground shadow-inner shadow-primary/5 backdrop-blur">
                  {releaseCopy.release.sections.empty}
                </div>
              )}

              {extraDocuments.length > 0 && (
                <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 shadow-2xl shadow-primary/10 backdrop-blur">
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-sky-500 to-emerald-400 opacity-80" />
                  <CardHeader className="pt-10">
                    <CardTitle className="text-xl font-semibold text-foreground">{releaseCopy.release.documents.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-10">
                    <ul className="space-y-4">
                      {extraDocuments.map((document) => {
                        const sizeLabel = formatFileSize(document.file_size)
                        return (
                          <li
                            key={document.id}
                            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground transition hover:border-primary/40"
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
                              <span className="text-sm font-semibold text-foreground">{document.display_name}</span>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {sizeLabel ? `${sizeLabel} · ` : ""}
                              {document.content_type ?? releaseCopy.release.documents.contentFallback}
                              {!document.publicUrl && ` · ${releaseCopy.release.documents.secureNote}`}
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
