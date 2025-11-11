import Link from "next/link"

import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function Footer() {
  const locale = await getLocale()
  const common = await getDictionary(locale, "common")
  const footerCopy = common.footer

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold">SotA</h3>
            <p className="text-sm text-muted-foreground">{footerCopy.tagline}</p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">
              {footerCopy.sections.links}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research-lines" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.researchLines}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.pricing}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.about}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">
              {footerCopy.sections.legal}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SotA. {footerCopy.rights}
        </div>
      </div>
    </footer>
  )
}
