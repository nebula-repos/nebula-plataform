"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface ResearchLineFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    title: string
    slug: string
    description: string | null
    is_active: boolean
  }
}

export function ResearchLineForm({ mode, initialData }: ResearchLineFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState<boolean>(mode === "edit")

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (mode === "create" && !isSlugEdited) {
      setSlug(slugify(title))
    }
  }, [title, mode, isSlugEdited])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!slug.trim()) {
      setError("Slug is required")
      return
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
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        is_active: isActive,
      }

      if (mode === "create") {
        const { data, error: createError } = await supabase
          .from("research_lines")
          .insert(payload)
          .select()
          .single()

        if (createError) throw createError

        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "create_research_line",
          entity_type: "research_line",
          entity_id: data.id,
          details: payload,
        })

        setSuccess("Research line created successfully")
      } else if (initialData) {
        const { error: updateError } = await supabase.from("research_lines").update(payload).eq("id", initialData.id)

        if (updateError) throw updateError

        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "update_research_line",
          entity_type: "research_line",
          entity_id: initialData.id,
          details: payload,
        })

        setSuccess("Changes saved successfully")
      }

      setTimeout(() => {
        router.push("/admin/research-lines")
        router.refresh()
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Applied AI for the healthcare sector"
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
          placeholder="e.g. ai-healthcare-sector"
        />
        <p className="text-sm text-muted-foreground">
          Used to generate the public URL. You can modify it before saving.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the scope, objectives, and expected outcomes."
          className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 rounded border border-input"
        />
        <Label htmlFor="isActive" className="text-sm font-normal">
          Active line visible on the platform
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : mode === "create" ? "Create line" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/research-lines")} disabled={isLoading}>
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
