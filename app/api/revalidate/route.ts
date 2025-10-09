import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { type, slug, researchLineSlug, releaseSlug } = body

    switch (type) {
      case "research-line":
        if (slug) {
          revalidatePath(`/research-lines/${slug}`)
          revalidatePath("/research-lines")
          revalidatePath("/")
        }
        break

      case "release":
        if (researchLineSlug && releaseSlug) {
          revalidatePath(`/research-lines/${researchLineSlug}/${releaseSlug}`)
          revalidatePath(`/research-lines/${researchLineSlug}`)
          revalidatePath("/research-lines")
          revalidatePath("/")
        }
        break

      case "all":
        revalidatePath("/")
        revalidatePath("/research-lines")
        // Revalidate all research lines
        const { data: lines } = await supabase.from("research_lines").select("slug")
        if (lines) {
          for (const line of lines) {
            revalidatePath(`/research-lines/${line.slug}`)
          }
        }
        break

      default:
        return NextResponse.json({ error: "Invalid revalidation type" }, { status: 400 })
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error("Revalidation error:", error)
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 })
  }
}
