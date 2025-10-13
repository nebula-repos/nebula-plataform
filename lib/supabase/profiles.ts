import "server-only"

import { type PostgrestError, type SupabaseClient, type User } from "@supabase/supabase-js"
import { getAdminClient } from "@/lib/supabase/admin"

type UserProfileRole = "user" | "admin"
type UserMembershipTier = "free" | "member"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserProfileRole
  membership_tier: UserMembershipTier
  created_at: string
  updated_at: string
}

type EnsureProfileArgs = {
  id: string
  email?: string | null
  fullName?: string | null
}

export async function fetchUserProfile(id: string): Promise<UserProfile | null> {
  const supabaseAdmin = getAdminClient()

  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).maybeSingle()

  if (error) {
    throw new Error(formatError("fetch user profile", error))
  }

  return data as UserProfile | null
}

export async function ensureUserProfile({ id, email, fullName }: EnsureProfileArgs): Promise<UserProfile> {
  if (!id) {
    throw new Error("Cannot ensure user profile without an id.")
  }

  const supabaseAdmin = getAdminClient()

  const existingProfile = await fetchUserProfile(id)

  if (existingProfile) {
    const updates: Partial<Pick<UserProfile, "email" | "full_name">> = {}

    if (email && email !== existingProfile.email) {
      updates.email = email
    }

    if (fullName !== undefined && fullName !== existingProfile.full_name) {
      const existingFullName = existingProfile.full_name?.trim() || null
      const metadataFullName =
        typeof fullName === "string" ? (fullName.trim().length > 0 ? fullName.trim() : null) : fullName

      if (!existingFullName && metadataFullName) {
        updates.full_name = metadataFullName
      }
    }

    if (Object.keys(updates).length === 0) {
      return existingProfile
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle()

    if (error) {
      throw new Error(formatError("update user profile", error))
    }

    return data as UserProfile
  }

  if (!email) {
    throw new Error("Cannot create user profile without an email.")
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      id,
      email,
      full_name: fullName ?? null,
    })
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      const retryProfile = await fetchUserProfile(id)
      if (retryProfile) {
        return retryProfile
      }
    }
    throw new Error(formatError("create user profile", error))
  }

  return data as UserProfile
}

export async function resolveUserProfile(
  supabaseClient: SupabaseClient,
  user: User,
): Promise<UserProfile | null> {
  try {
    return await ensureUserProfile({
      id: user.id,
      email: user.email,
      fullName: extractFullName(user),
    })
  } catch {
    const { data, error: fallbackError } = await supabaseClient.from("users").select("*").eq("id", user.id).maybeSingle()

    if (fallbackError) {
      console.error("Failed to load user profile using fallback query:", fallbackError)
      return null
    }

    return data as UserProfile | null
  }
}

export function buildProfileFallback(user: User): UserProfile {
  const timestamp = user.created_at ?? new Date().toISOString()

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: extractFullName(user),
    role: "user",
    membership_tier: "free",
    created_at: timestamp,
    updated_at: timestamp,
  }
}

function formatError(action: string, error: PostgrestError) {
  const parts = [error.message]
  if (error.details) {
    parts.push(error.details)
  }
  if (error.hint) {
    parts.push(error.hint)
  }
  return `Failed to ${action}: ${parts.join(" - ")}`
}

function extractFullName(user: User) {
  const fullName = user.user_metadata?.full_name
  return typeof fullName === "string" ? fullName : null
}
