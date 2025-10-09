import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateResearchLine(slug: string) {
  revalidatePath(`/research-lines/${slug}`)
  revalidatePath("/research-lines")
  revalidatePath("/")
}

export async function revalidateRelease(researchLineSlug: string, releaseSlug: string) {
  revalidatePath(`/research-lines/${researchLineSlug}/${releaseSlug}`)
  revalidatePath(`/research-lines/${researchLineSlug}`)
  revalidatePath("/research-lines")
  revalidatePath("/")
}

export async function revalidateAllPublicPages() {
  revalidatePath("/")
  revalidatePath("/research-lines")
  revalidateTag("research-lines")
  revalidateTag("releases")
}
