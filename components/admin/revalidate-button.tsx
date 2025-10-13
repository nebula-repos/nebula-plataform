"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RevalidateButtonProps {
  type: "research-line" | "release" | "all"
  slug?: string
  researchLineSlug?: string
  releaseSlug?: string
}

export function RevalidateButton({ type, slug, researchLineSlug, releaseSlug }: RevalidateButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleRevalidate = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          slug,
          researchLineSlug,
          releaseSlug,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to revalidate")
      }

      setMessage("Content refreshed successfully")
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage("Error refreshing content")
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleRevalidate} disabled={isLoading} size="sm" variant="outline">
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Refreshing..." : "Revalidate Cache"}
      </Button>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  )
}
