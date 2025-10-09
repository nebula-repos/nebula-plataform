"use client"

import { createClient } from "@/lib/supabase/client"

export type EventType =
  | "page_view"
  | "release_view"
  | "research_line_view"
  | "signup"
  | "login"
  | "profile_update"
  | "upgrade_prompt_shown"
  | "upgrade_clicked"

interface EventData {
  [key: string]: any
}

export async function trackEventClient(eventType: EventType, eventData?: EventData) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("events").insert({
      user_id: user?.id || null,
      event_type: eventType,
      event_data: eventData || {},
    })
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}
