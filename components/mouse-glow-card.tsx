"use client"

import { useCallback, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type MouseGlowCardProps = {
  children: ReactNode
  className?: string
}

export function MouseGlowCard({ children, className }: MouseGlowCardProps) {
  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)

    const rotateRange = 10
    const relativeX = (x - rect.width / 2) / (rect.width / 2)
    const relativeY = (y - rect.height / 2) / (rect.height / 2)

    const rotateX = Math.max(Math.min(relativeY * -rotateRange, rotateRange), -rotateRange)
    const rotateY = Math.max(Math.min(relativeX * rotateRange, rotateRange), -rotateRange)
    const translateZ = Math.min(18, Math.hypot(rotateX, rotateY) * 1.2)

    card.style.setProperty("--mouse-rotate-x", `${rotateX}deg`)
    card.style.setProperty("--mouse-rotate-y", `${rotateY}deg`)
    card.style.setProperty("--mouse-translate-z", `${translateZ}px`)
  }, [])

  const handleMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()

    card.style.setProperty("--mouse-x", `${rect.width / 2}px`)
    card.style.setProperty("--mouse-y", `${rect.height / 2}px`)
    card.style.setProperty("--mouse-rotate-x", "0deg")
    card.style.setProperty("--mouse-rotate-y", "0deg")
    card.style.setProperty("--mouse-translate-z", "0px")
  }, [])

  const handleMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    card.style.removeProperty("--mouse-x")
    card.style.removeProperty("--mouse-y")
    card.style.removeProperty("--mouse-rotate-x")
    card.style.removeProperty("--mouse-rotate-y")
    card.style.removeProperty("--mouse-translate-z")
  }, [])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative will-change-transform overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background via-primary/10 to-background/80 p-6 shadow-[0_30px_80px_-45px_rgba(10,10,10,0.55)] backdrop-blur transition-[transform,shadow] duration-200 ease-out hover:shadow-[0_40px_120px_-55px_rgba(10,10,10,0.68)]",
        className,
      )}
      style={{
        transform:
          "perspective(1300px) rotateX(var(--mouse-rotate-x, 0deg)) rotateY(var(--mouse-rotate-y, 0deg)) translateZ(var(--mouse-translate-z, 0px))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px at var(--mouse-x) var(--mouse-y), rgba(115, 115, 115, 0.26), transparent 72%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
