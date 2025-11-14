import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { MouseGlowCard } from "@/components/mouse-glow-card"

export default async function TermsPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "terms")

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-28">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-cyan-600/12 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-primary/90 shadow-lg shadow-primary/20 backdrop-blur">
              {copy.hero.effective}
            </div>
            <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {copy.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">{copy.hero.subtitle}</p>
          </div>
        </section>

        <section className="border-b border-border/60 bg-gradient-to-b from-background via-muted/30 to-background py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">{copy.hero.title}</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {copy.sections.map((section) => (
                <MouseGlowCard
                  key={section.title}
                  className="h-full space-y-4 rounded-3xl border border-white/15 bg-gradient-to-b from-background/95 via-primary/5 to-background/70 p-8 text-left shadow-lg shadow-primary/10 backdrop-blur"
                >
                  <div className="space-y-3">
                    <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                    {section.body?.map((paragraph, index) => (
                      <p key={`${section.title}-body-${index}`} className="text-base text-muted-foreground">
                        {paragraph}
                        {section.email && section.body && index === section.body.length - 1 ? (
                          <>
                            {" "}
                            <a className="underline" href={`mailto:${section.email}`}>
                              {section.email}
                            </a>
                            .
                          </>
                        ) : null}
                      </p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground shadow-inner shadow-primary/5">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && <p className="text-sm text-muted-foreground">{section.note}</p>}
                </MouseGlowCard>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-background/70 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/18 via-cyan-600/12 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {copy.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              {copy.cta.prefix}{" "}
              <a className="underline decoration-dotted underline-offset-4" href={`mailto:${copy.cta.email}`}>
                {copy.cta.email}
              </a>{" "}
              {copy.cta.suffix}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
