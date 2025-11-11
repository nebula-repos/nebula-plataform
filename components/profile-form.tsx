"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { trackEventClient } from "@/lib/analytics-client"

interface ProfileFormCopy {
  missingUser: string
  genericError: string
  emailLabel: string
  emailHelp: string
  fullNameLabel: string
  fullNamePlaceholder: string
  success: string
  saving: string
  save: string
  cancel: string
}

interface ProfileFormProps {
  user: {
    id: string
    email: string
    full_name: string | null
  } | null
  copy: ProfileFormCopy
}

export function ProfileForm({ user, copy }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user?.full_name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      if (!user?.id) {
        throw new Error(copy.missingUser)
      }

      const normalizedFullName = fullName.trim()
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: normalizedFullName || null },
      })
      if (authError) throw authError

      const { error: profileError } = await supabase
        .from("users")
        .update({ full_name: normalizedFullName || null })
        .eq("id", user.id)
      if (profileError) throw profileError

      await trackEventClient("profile_update", { full_name: normalizedFullName })

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : copy.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{copy.emailLabel}</Label>
        <Input id="email" type="email" value={user?.email} disabled />
        <p className="text-sm text-muted-foreground">{copy.emailHelp}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">{copy.fullNameLabel}</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={copy.fullNamePlaceholder}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{copy.success}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? copy.saving : copy.save}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
          {copy.cancel}
        </Button>
      </div>
    </form>
  )
}
