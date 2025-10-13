"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

function getRequiredString(formData: FormData, field: string): string {
  const value = formData.get(field)

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required field: ${field}`)
  }

  return value
}

export async function subscribeToResearchLine(formData: FormData) {
  const researchLineId = getRequiredString(formData, "researchLineId")
  const slug = getRequiredString(formData, "slug")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/research-lines/${slug}`)
  }

  const { error } = await supabase
    .from("research_line_subscriptions")
    .upsert(
      {
        user_id: user.id,
        research_line_id: researchLineId,
        is_active: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: "user_id,research_line_id" },
    )

  if (error) {
    throw new Error(`Failed to subscribe to research line: ${error.message}`)
  }

  revalidatePath(`/research-lines/${slug}`)
  redirect(`/research-lines/${slug}`)
}

export async function unsubscribeFromResearchLine(formData: FormData) {
  const researchLineId = getRequiredString(formData, "researchLineId")
  const slug = getRequiredString(formData, "slug")
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=/research-lines/${slug}`)
  }

  const { error } = await supabase
    .from("research_line_subscriptions")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("research_line_id", researchLineId)

  if (error) {
    throw new Error(`Failed to unsubscribe from research line: ${error.message}`)
  }

  revalidatePath(`/research-lines/${slug}`)
  redirect(`/research-lines/${slug}`)
}
