import { createClient } from "@/lib/supabase/server"

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

export async function trackEvent(eventType: EventType, eventData?: EventData) {
  try {
    const supabase = await createClient()
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

export async function trackPageView(path: string, metadata?: EventData) {
  await trackEvent("page_view", { path, ...metadata })
}

export async function trackReleaseView(releaseId: string, releaseSlug: string, researchLineSlug: string) {
  await trackEvent("release_view", {
    release_id: releaseId,
    release_slug: releaseSlug,
    research_line_slug: researchLineSlug,
  })
}

export async function trackResearchLineView(lineId: string, lineSlug: string) {
  await trackEvent("research_line_view", {
    research_line_id: lineId,
    research_line_slug: lineSlug,
  })
}
