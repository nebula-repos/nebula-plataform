"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserActionsProps {
  userId: string
  currentRole: string
  currentTier: string
}

export function UserActions({ userId, currentRole, currentTier }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateUser = async (updates: { role?: string; membership_tier?: string }) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("users").update(updates).eq("id", userId)

      if (error) throw error

      // Log audit action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("audit_logs").insert({
          user_id: user.id,
          action: "update_user",
          entity_type: "user",
          entity_id: userId,
          details: updates,
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentRole === "user" && (
          <DropdownMenuItem onClick={() => updateUser({ role: "admin" })}>Make Admin</DropdownMenuItem>
        )}
        {currentRole === "admin" && (
          <DropdownMenuItem onClick={() => updateUser({ role: "user" })}>Remove Admin</DropdownMenuItem>
        )}
        {currentTier === "free" && (
          <DropdownMenuItem onClick={() => updateUser({ membership_tier: "member" })}>
            Upgrade to Member
          </DropdownMenuItem>
        )}
        {currentTier === "member" && (
          <DropdownMenuItem onClick={() => updateUser({ membership_tier: "free" })}>
            Switch to Free
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
