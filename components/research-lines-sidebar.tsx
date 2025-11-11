"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { Menu, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ResearchLine = {
  id: string
  title: string
  slug: string
}

type ResearchLinesSidebarProps = {
  researchLines: ResearchLine[]
  copy: {
    heading: string
    toggle: string
    close: string
  }
}

export function ResearchLinesSidebar({ researchLines, copy }: ResearchLinesSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)
  const pathname = usePathname()
  const hasResearchLines = researchLines.length > 0

  useEffect(() => {
    setPortalElement(document.body)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (!hasResearchLines) {
    return null
  }

  const toggleSidebar = () => setIsOpen((previous) => !previous)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className={cn(
          "group inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground/90 shadow-inner shadow-white/5 backdrop-blur transition-all duration-200",
          isOpen ? "ring-1 ring-primary/50" : "hover:-translate-y-0.5 hover:border-primary/50",
        )}
        aria-expanded={isOpen}
        aria-controls="research-lines-sidebar"
        aria-label={copy.toggle}
      >
        <Menu className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </button>

      {portalElement &&
        createPortal(
          <>
            <div
              className={cn(
                "fixed inset-0 z-[90] bg-background/70 backdrop-blur-sm transition-opacity duration-200",
                isOpen ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              onClick={closeSidebar}
              aria-hidden={!isOpen}
            />

            <aside
              id="research-lines-sidebar"
              role="dialog"
              aria-modal="true"
              className={cn(
                "fixed inset-y-0 left-0 z-[95] flex w-full max-w-xs flex-col border-r border-white/10 bg-gradient-to-b from-background/95 via-background/90 to-background/80 px-5 pb-8 pt-6 shadow-[0_30px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl transition-transform duration-200",
                isOpen ? "translate-x-0" : "-translate-x-full",
              )}
              aria-hidden={!isOpen}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.45em] text-muted-foreground/90">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{copy.heading}</span>
                </div>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={copy.close}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <nav className="mt-6 flex-1 overflow-y-auto pr-1">
                <ul className="space-y-3">
                  {researchLines.map((line) => (
                    <li key={line.id}>
                      <Link
                        href={`/research-lines/${line.slug}`}
                        className="group ml-1 mr-2 block rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground/90 shadow-inner shadow-white/5 transition-all duration-200 hover:-translate-x-1 hover:border-primary/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                        onClick={closeSidebar}
                      >
                        <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground/80">
                          <span>{copy.heading}</span>
                          <span aria-hidden="true">&rarr;</span>
                        </div>
                        <p className="mt-2 text-base font-semibold leading-snug text-foreground">{line.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </>,
          portalElement,
        )}
    </>
  )
}
