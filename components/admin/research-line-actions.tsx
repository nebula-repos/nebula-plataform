"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface ResearchLineActionsProps {
  lineId: string
  isActive: boolean
  slug: string
}

export function ResearchLineActions({ lineId, isActive, slug }: ResearchLineActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleActive = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("research_lines").update({ is_active: !isActive }).eq("id", lineId)

      if (error) throw error

      // Log audit action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: isActive ? "deactivate_research_line" : "activate_research_line",
          entity_type: "research_line",
          entity_id: lineId,
          details: { is_active: !isActive },
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error toggling research line:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteLine = async () => {
    if (!confirm("Are you sure you want to delete this research line?")) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("research_lines").delete().eq("id", lineId)

      if (error) throw error

      // Log audit action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "delete_research_line",
          entity_type: "research_line",
          entity_id: lineId,
          details: {},
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error deleting research line:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/research-lines/${slug}/edit`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggleActive}>{isActive ? "Deactivate" : "Activate"}</DropdownMenuItem>
          <DropdownMenuItem onClick={deleteLine} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
