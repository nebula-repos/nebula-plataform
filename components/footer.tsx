import Link from "next/link"
import { Instagram, Linkedin, Twitter } from "lucide-react"

import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export async function Footer() {
  const locale = await getLocale()
  const common = await getDictionary(locale, "common")
  const footerCopy = common.footer

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
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
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {footerCopy.links.contact}
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
          <div>
            <h3 className="mb-4 font-semibold">{footerCopy.socials.title}</h3>
            <ul className="space-y-3 text-sm">
              {footerCopy.socials.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label === "Instagram" && <Instagram className="h-4 w-4" aria-hidden />}
                    {item.label.startsWith("X") && <Twitter className="h-4 w-4" aria-hidden />}
                    {item.label === "LinkedIn" && <Linkedin className="h-4 w-4" aria-hidden />}
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs uppercase text-muted-foreground/80">{item.label}</span>
                      <span className="font-medium text-foreground">{item.handle}</span>
                    </div>
                  </Link>
                </li>
              ))}
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
