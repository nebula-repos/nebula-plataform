"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type ReportType = "actualidad" | "industria" | "academico"
const REPORT_TYPES: ReportType[] = ["actualidad", "industria", "academico"]

const STORAGE_BUCKET = "research-release-assets"

interface ResearchLineOption {
  id: string
  title: string
  slug: string
}

interface ReleaseFormCopy {
  fields: {
    researchLine: {
      label: string
      noLines: string
      helper: string
    }
    title: {
      label: string
      placeholder: string
    }
    slug: {
      label: string
      placeholder: string
      helperPrefix: string
      helperSuffix: string
      fallback: string
    }
    releaseDate: {
      label: string
      helper: string
    }
    published: {
      label: string
    }
  }
  reports: {
    heading: string
    description: string
    descriptionSuffix: string
    attached: string
    definitions: Record<
      ReportType,
      {
        label: string
        helper: string
      }
    >
  }
  messages: {
    selectLine: string
    lineMissing: string
    titleRequired: string
    slugRequired: string
    dateRequired: string
    missingReport: string
    session: string
    uploadFailed: string
    registerFailed: string
    unexpected: string
    success: string
  }
  buttons: {
    saving: string
    submit: string
    cancel: string
  }
}

interface ReleaseFormProps {
  researchLines: ResearchLineOption[]
  copy: ReleaseFormCopy
}

type ReportFileState = Record<ReportType, File | null>

const DEFAULT_REPORT_STATE: ReportFileState = {
  actualidad: null,
  industria: null,
  academico: null,
}

export function ReleaseForm({ researchLines, copy }: ReleaseFormProps) {
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
  const reportDefinitions = REPORT_TYPES.map((key) => ({
    key,
    ...copy.reports.definitions[key],
  }))

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
      setError(copy.messages.selectLine)
      return
    }

    const researchLine = researchLines.find((line) => line.id === researchLineId)
    if (!researchLine) {
      setError(copy.messages.lineMissing)
      return
    }

    if (!title.trim()) {
      setError(copy.messages.titleRequired)
      return
    }

    if (!slug.trim()) {
      setError(copy.messages.slugRequired)
      return
    }

    if (!publishedAt) {
      setError(copy.messages.dateRequired)
      return
    }

    for (const definition of reportDefinitions) {
      if (!reports[definition.key]) {
        const reportName = definition.label.toLowerCase()
        setError(copy.messages.missingReport.replace("{report}", reportName))
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
        throw new Error(copy.messages.session)
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

      for (const definition of reportDefinitions) {
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
          const reportName = definition.label.toLowerCase()
          throw new Error(
            copy.messages.uploadFailed
              .replace("{report}", reportName)
              .replace("{error}", uploadError.message),
          )
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
          const reportName = definition.label.toLowerCase()
          throw new Error(
            copy.messages.registerFailed
              .replace("{report}", reportName)
              .replace("{error}", documentError.message),
          )
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
          reports: REPORT_TYPES,
        },
      })

      setSuccess(copy.messages.success)
      setTimeout(() => {
        router.push("/admin/releases")
        router.refresh()
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : copy.messages.unexpected
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
        <Label htmlFor="researchLine">{copy.fields.researchLine.label}</Label>
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
            <option value="">{copy.fields.researchLine.noLines}</option>
          ) : (
            researchLines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.title}
              </option>
            ))
          )}
        </select>
        <p className="text-sm text-muted-foreground">{copy.fields.researchLine.helper}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{copy.fields.title.label}</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={copy.fields.title.placeholder}
          disabled={isDisabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">{copy.fields.slug.label}</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value)
            setIsSlugEdited(true)
          }}
          placeholder={copy.fields.slug.placeholder}
          disabled={isDisabled}
        />
        <p className="text-sm text-muted-foreground">
          {copy.fields.slug.helperPrefix}{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            /research-lines/&lt;line&gt;/{slug || copy.fields.slug.fallback}
          </code>
          {copy.fields.slug.helperSuffix}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="publishedAt">{copy.fields.releaseDate.label}</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            disabled={isDisabled}
          />
          <p className="text-sm text-muted-foreground">{copy.fields.releaseDate.helper}</p>
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
            {copy.fields.published.label}
          </Label>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold">{copy.reports.heading}</h3>
        <p className="text-sm text-muted-foreground">
          {copy.reports.description}{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {STORAGE_BUCKET}/
            {researchLines.find((line) => line.id === researchLineId)?.slug ?? "line"}/
            {publishedAt ? normaliseDateFolder(publishedAt) : "YYYY-MM-DD"}
          </code>
          {copy.reports.descriptionSuffix}
        </p>

        {reportDefinitions.map((definition) => {
          const inputId = `report-${definition.key}`
          const file = reports[definition.key]
          return (
            <div
              key={definition.key}
              className="space-y-3 rounded-2xl border border-white/10 bg-background/85 p-4 shadow-sm shadow-primary/5 backdrop-blur"
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor={inputId}>{definition.label}</Label>
                <span className="text-sm text-muted-foreground">{definition.helper}</span>
              </div>
              <input
                id={inputId}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={(event) => handleReportChange(definition.key, event.target.files)}
                className="sr-only"
                disabled={isDisabled}
              />
              <label
                htmlFor={inputId}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/20 bg-background/90 px-4 py-3 text-sm transition-all duration-200 hover:border-primary/60"
              >
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground">{file?.name ?? definition.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {file
                      ? `${copy.reports.attached}: ${formatFileSize(file.size ?? 0)}`
                      : definition.helper}
                  </span>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-primary/80">
                  {definition.key}
                </span>
              </label>
            </div>
          )
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isLoading || isDisabled}>
          {isLoading ? copy.buttons.saving : copy.buttons.submit}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/releases")} disabled={isLoading}>
          {copy.buttons.cancel}
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
