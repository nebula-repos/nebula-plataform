"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ResearchLine = {
  id: string
  title: string
  slug: string
}

type ResearchLinesSidebarProps = {
  researchLines: ResearchLine[]
}

export function ResearchLinesSidebar({ researchLines }: ResearchLinesSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (researchLines.length === 0) {
    return null
  }

  const toggleSidebar = () => setIsOpen((previous) => !previous)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls="research-lines-sidebar"
        aria-label="Toggle research lines sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeSidebar}
        aria-hidden={!isOpen}
      />

      <aside
        id="research-lines-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 translate-x-0 transform border-r border-border bg-background shadow-lg transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Research Lines</p>
          <button
            type="button"
            onClick={closeSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Close research lines sidebar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {researchLines.map((line) => (
              <li key={line.id}>
                <Link
                  href={`/research-lines/${line.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={closeSidebar}
                >
                  {line.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
