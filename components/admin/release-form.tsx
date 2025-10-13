"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type SectionKey = "actualidad" | "industria" | "academico"

const SECTION_DEFINITIONS: Array<{ key: SectionKey; label: string; helper: string }> = [
  {
    key: "actualidad",
    label: "Current Landscape",
    helper: "Context, trends, and why this release matters right now.",
  },
  {
    key: "industria",
    label: "Industry Applications",
    helper: "Real-world use cases, case studies, and industry insights.",
  },
  {
    key: "academico",
    label: "Academic Foundations",
    helper: "Key theory, studies, and references.",
  },
]

interface ResearchLineOption {
  id: string
  title: string
  slug: string
}

interface ReleaseFormProps {
  researchLines: ResearchLineOption[]
}

interface SectionState {
  title: string
  teaser: string
  full: string
}

const DEFAULT_SECTION_STATE: Record<SectionKey, SectionState> = {
  actualidad: { title: "", teaser: "", full: "" },
  industria: { title: "", teaser: "", full: "" },
  academico: { title: "", teaser: "", full: "" },
}

export function ReleaseForm({ researchLines }: ReleaseFormProps) {
  const router = useRouter()
  const [researchLineId, setResearchLineId] = useState(researchLines[0]?.id ?? "")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [sections, setSections] = useState(DEFAULT_SECTION_STATE)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!isSlugEdited) {
      setSlug(slugify(title))
    }
  }, [title, isSlugEdited])

  useEffect(() => {
    if (researchLines.length > 0 && !researchLineId) {
      setResearchLineId(researchLines[0].id)
    }
  }, [researchLines, researchLineId])

  const handleSectionChange = (key: SectionKey, field: keyof SectionState, value: string) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!researchLineId) {
      setError("Select a research line")
      return
    }

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!slug.trim()) {
      setError("Slug is required")
      return
    }

    const sectionsToInsert: Array<{
      section_type: SectionKey
      title: string
      content_teaser: string
      content_full: string
    }> = []
    for (const definition of SECTION_DEFINITIONS) {
      const current = sections[definition.key]
      const hasContent = current.title.trim() || current.teaser.trim() || current.full.trim()
      const isComplete = current.title.trim() && current.teaser.trim() && current.full.trim()

      if (hasContent && !isComplete) {
        setError(`Complete every field in the ${definition.label} section or leave it empty.`)
        return
      }

      if (isComplete) {
        sectionsToInsert.push({
          section_type: definition.key,
          title: current.title.trim(),
          content_teaser: current.teaser.trim(),
          content_full: current.full.trim(),
        })
      }
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Could not validate the user session.")
      }

      const payload = {
        research_line_id: researchLineId,
        title: title.trim(),
        slug: slug.trim(),
        is_published: isPublished,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      }

      const { data: release, error: createError } = await supabase
        .from("releases")
        .insert(payload)
        .select()
        .single()

      if (createError) throw createError

      if (sectionsToInsert.length > 0) {
        const sectionsPayload = sectionsToInsert.map((section) => ({
          ...section,
          release_id: release.id,
        }))

        const { error: sectionError } = await supabase.from("release_sections").insert(sectionsPayload)
        if (sectionError) throw sectionError
      }

      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "create_release",
        entity_type: "release",
        entity_id: release.id,
        details: {
          ...payload,
          sections: sectionsToInsert.map((section) => section.section_type),
        },
      })

      setSuccess("Release created successfully")
      setTimeout(() => {
        router.push("/admin/releases")
        router.refresh()
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = researchLines.length === 0

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="researchLine">Research line</Label>
        <select
          id="researchLine"
          value={researchLineId}
          onChange={(event) => setResearchLineId(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={isDisabled}
        >
          {researchLines.length === 0 ? (
            <option value="">No lines available</option>
          ) : (
            researchLines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.title}
              </option>
            ))
          )}
        </select>
        <p className="text-sm text-muted-foreground">
          You need at least one active line to create a release.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. AI trends in healthcare systems 2025"
          disabled={isDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value)
            setIsSlugEdited(true)
          }}
          placeholder="e.g. ai-trends-healthcare-2025"
          disabled={isDisabled}
        />
        <p className="text-sm text-muted-foreground">Used for the URL within the selected line.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Publish date</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            disabled={isDisabled}
          />
        </div>
        <div className="flex items-center gap-2 pt-6 md:pt-10">
          <input
            id="isPublished"
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="h-4 w-4 rounded border border-input"
            disabled={isDisabled}
          />
          <Label htmlFor="isPublished" className="text-sm font-normal">
            Mark as published and visible to users
          </Label>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Content sections</h3>
        <p className="text-sm text-muted-foreground">Complete sections now or save as draft and edit later.</p>

        {SECTION_DEFINITIONS.map((definition) => (
          <div key={definition.key} className="space-y-4 rounded-lg border border-border bg-background p-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h4 className="text-base font-semibold">{definition.label}</h4>
              <span className="text-sm text-muted-foreground">{definition.helper}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${definition.key}-title`}>Section title</Label>
              <Input
                id={`${definition.key}-title`}
                value={sections[definition.key].title}
                onChange={(event) => handleSectionChange(definition.key, "title", event.target.value)}
                placeholder="Descriptive heading"
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${definition.key}-teaser`}>Visible summary (free users)</Label>
              <textarea
                id={`${definition.key}-teaser`}
                value={sections[definition.key].teaser}
                onChange={(event) => handleSectionChange(definition.key, "teaser", event.target.value)}
                placeholder="Short overview with the main findings."
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${definition.key}-full`}>Full content (members)</Label>
              <textarea
                id={`${definition.key}-full`}
                value={sections[definition.key].full}
                onChange={(event) => handleSectionChange(definition.key, "full", event.target.value)}
                placeholder="Detailed content, references, and next steps."
                className="min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isDisabled}
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isLoading || isDisabled}>
          {isLoading ? "Saving..." : "Create release"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/releases")} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}
