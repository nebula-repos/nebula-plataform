import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ResearchLineRecord = {
  id: string | number
  title: string
  slug: string
  description?: string | null
  created_at?: string | null
}

type ResearchLineCardProps = {
  line: ResearchLineRecord
  eyebrowLabel: string
  dateFormatter: Intl.LocalesArgument
  dateFallbackLabel: string
  tags?: string[]
  ctaLabel: string
  href?: string
  descriptionFallback?: string
}

export function ResearchLineCard({
  line,
  eyebrowLabel,
  dateFormatter,
  dateFallbackLabel,
  tags = [],
  ctaLabel,
  href,
  descriptionFallback,
}: ResearchLineCardProps) {
  const releaseDate = line.created_at ? new Date(line.created_at).toLocaleDateString(dateFormatter) : dateFallbackLabel
  const linkHref = href ?? `/research-lines/${line.slug}`
  const description = line.description ?? descriptionFallback

  return (
    <Card
      className="group relative overflow-hidden border border-white/10 bg-background/90 shadow-[0_30px_70px_-45px_rgba(15,15,15,0.65)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_50px_120px_-55px_rgba(15,15,15,0.88)]"
      data-testid="research-line-card"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-cyan-600 to-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          <span>{eyebrowLabel}</span>
          <span>{releaseDate}</span>
        </div>
        <CardTitle className="text-2xl font-semibold leading-tight text-foreground">{line.title}</CardTitle>
        <CardDescription className="text-pretty text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-primary/80">
            {tags.map((label) => (
              <span key={label} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1">
                {label}
              </span>
            ))}
          </div>
        )}
        <Link href={linkHref}>
          <Button
            variant="outline"
            className="group/btn w-full rounded-full border-primary/50 bg-white/5 text-primary shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary hover:bg-white/10 hover:shadow-primary/25"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
