"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type ReportType = "actualidad" | "industria" | "academico"

const STORAGE_BUCKET = "research-release-assets"

const REPORT_DEFINITIONS: Array<{
  key: ReportType
  label: string
  helper: string
}> = [
  {
    key: "actualidad",
    label: "Current Landscape Report",
    helper: "Signals, market moves, and why this drop matters right now.",
  },
  {
    key: "industria",
    label: "Industry Applications Report",
    helper: "Deployment tactics, implementation notes, and field-tested patterns.",
  },
  {
    key: "academico",
    label: "Academic Foundations Report",
    helper: "Key studies, references, and theoretical grounding for the release.",
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

type ReportFileState = Record<ReportType, File | null>

const DEFAULT_REPORT_STATE: ReportFileState = {
  actualidad: null,
  industria: null,
  academico: null,
}

export function ReleaseForm({ researchLines }: ReleaseFormProps) {
  const router = useRouter()
  const [researchLineId, setResearchLineId] = useState(researchLines[0]?.id ?? "")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [reports, setReports] = useState<ReportFileState>(DEFAULT_REPORT_STATE)
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

  const handleReportChange = (type: ReportType, fileList: FileList | null) => {
    const file = fileList?.[0] ?? null
    setReports((prev) => ({
      ...prev,
      [type]: file,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!researchLineId) {
      setError("Select a research line.")
      return
    }

    const researchLine = researchLines.find((line) => line.id === researchLineId)
    if (!researchLine) {
      setError("The selected research line could not be found.")
      return
    }

    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    if (!slug.trim()) {
      setError("Slug is required.")
      return
    }

    if (!publishedAt) {
      setError("Choose the release date to build the storage path.")
      return
    }

    for (const definition of REPORT_DEFINITIONS) {
      if (!reports[definition.key]) {
        setError(`Upload the ${definition.label.toLowerCase()}.`)
        return
      }
    }

    setIsLoading(true)

    const dateFolder = normaliseDateFolder(publishedAt)
    const uploadedObjectPaths: string[] = []
    let createdReleaseId: string | null = null

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
        published_at: new Date(publishedAt).toISOString(),
      }

      const { data: release, error: createError } = await supabase
        .from("releases")
        .insert(payload)
        .select("id, slug")
        .single()

      if (createError) throw createError
      createdReleaseId = release.id

      for (const definition of REPORT_DEFINITIONS) {
        const file = reports[definition.key]
        if (!file) continue

        const extension = resolveFileExtension(file)
        const fileName = `${release.slug}-${definition.key}.${extension}`
        const objectPath = `${researchLine.slug}/${dateFolder}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(objectPath, file, {
            upsert: true,
            cacheControl: "3600",
            contentType: file.type || "application/octet-stream",
          })

        if (uploadError) {
          throw new Error(`Failed to upload ${definition.label.toLowerCase()}: ${uploadError.message}`)
        }

        uploadedObjectPaths.push(objectPath)

        const { error: documentError } = await supabase.from("release_documents").insert({
          release_id: release.id,
          bucket_id: STORAGE_BUCKET,
          object_path: objectPath,
          display_name: definition.label,
          file_size: file.size,
          content_type: file.type || "application/octet-stream",
        })

        if (documentError) {
          throw new Error(`Failed to register ${definition.label.toLowerCase()}: ${documentError.message}`)
        }
      }

      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "create_release",
        entity_type: "release",
        entity_id: release.id,
        details: {
          ...payload,
          storage_bucket: STORAGE_BUCKET,
          reports: REPORT_DEFINITIONS.map((definition) => definition.key),
        },
      })

      setSuccess("Release created and reports uploaded.")
      setTimeout(() => {
        router.push("/admin/releases")
        router.refresh()
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(message)

      if (uploadedObjectPaths.length > 0) {
        await supabase.storage.from(STORAGE_BUCKET).remove(uploadedObjectPaths)
      }

      if (createdReleaseId) {
        await supabase.from("releases").delete().eq("id", createdReleaseId)
      }
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
          onChange={(event) => {
            setResearchLineId(event.target.value)
          }}
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
          Choose where these reports will land. One release per line per date folder.
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
        <p className="text-sm text-muted-foreground">
          This slug determines the public URL: `/research-lines/&lt;line&gt;/{slug || "your-slug"}`.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Release date</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            disabled={isDisabled}
          />
          <p className="text-sm text-muted-foreground">
            The date is used for scheduling and for the storage folder name.
          </p>
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
            Mark as published and visible to members immediately
          </Label>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold">Upload the reports</h3>
        <p className="text-sm text-muted-foreground">
          Each focus area expects a single archive (PDF, docx, or similar). Files are stored under{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {STORAGE_BUCKET}/
            {researchLines.find((line) => line.id === researchLineId)?.slug ?? "line"}/
            {publishedAt ? normaliseDateFolder(publishedAt) : "YYYY-MM-DD"}
          </code>
          .
        </p>

        {REPORT_DEFINITIONS.map((definition) => (
          <div
            key={definition.key}
            className="space-y-3 rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm shadow-primary/5 backdrop-blur"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor={`report-${definition.key}`}>{definition.label}</Label>
              <span className="text-sm text-muted-foreground">{definition.helper}</span>
            </div>
            <input
              id={`report-${definition.key}`}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(event) => handleReportChange(definition.key, event.target.files)}
              className="w-full cursor-pointer rounded-md border border-dashed border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={isDisabled}
            />
            {reports[definition.key] && (
              <p className="text-xs text-muted-foreground">
                Attached: {reports[definition.key]?.name} · {formatFileSize(reports[definition.key]?.size ?? 0)}
              </p>
            )}
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

function normaliseDateFolder(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }
  return parsed.toISOString().slice(0, 10)
}

function resolveFileExtension(file: File): string {
  const nameParts = file.name.split(".")
  if (nameParts.length > 1) {
    const candidate = nameParts.pop()?.toLowerCase()
    if (candidate) return candidate
  }
  const typeParts = file.type.split("/")
  const fallback = typeParts[typeParts.length - 1]
  return fallback ? fallback.toLowerCase() : "bin"
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index += 1
  }
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
