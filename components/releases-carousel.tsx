'use client'

import { Children, type ReactNode, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ScrollDirection = "left" | "right"

interface ReleasesCarouselProps {
  children: ReactNode
  className?: string
  itemClassName?: string
}

export function ReleasesCarousel({ children, className, itemClassName }: ReleasesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const updateScrollState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }

    updateScrollState()

    container.addEventListener("scroll", updateScrollState)
    window.addEventListener("resize", updateScrollState)

    return () => {
      container.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  const handleScroll = (direction: ScrollDirection) => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const preferredDelta = container.clientWidth * 0.8
    const delta = direction === "left" ? -preferredDelta : preferredDelta

    container.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className={cn(
          "flex gap-6 overflow-x-auto scroll-smooth py-2",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        {Children.toArray(children).map((child, index) => (
          <div key={index} className={cn("flex-shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          className="pointer-events-auto rounded-full bg-background shadow"
          aria-label="Scroll releases left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          className="pointer-events-auto rounded-full bg-background shadow"
          aria-label="Scroll releases right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
