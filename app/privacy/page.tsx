import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

const sectionOrder = ["collect", "use", "share", "security", "rights", "changes"] as const

export default async function PrivacyPage() {
  const locale = await getLocale()
  const copy = await getDictionary(locale, "privacy")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-sky-500/10 to-transparent blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{copy.hero.title}</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">{copy.hero.subtitle}</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm uppercase tracking-[0.25em] text-primary/80">{copy.hero.reviewed}</p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 space-y-12">
            {sectionOrder.map((key) => {
              const section = copy.sections[key]
              return (
                <article
                  key={section.title}
                  className="space-y-4 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur"
                >
                  <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                  {"body" in section && section.body && (
                    <p className="text-muted-foreground">
                      {section.body}
                      {"email" in section && section.email ? (
                        <>
                          {" "}
                          <a className="underline" href={`mailto:${section.email}`}>
                            {section.email}
                          </a>
                          .
                        </>
                      ) : null}
                    </p>
                  )}
                  {"items" in section && section.items && (
                    <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {"note" in section && section.note && <p className="text-sm text-muted-foreground">{section.note}</p>}
                  {"effective" in section && section.effective && (
                    <p className="text-sm text-muted-foreground">{section.effective}</p>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className="relative overflow-hidden py-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-sky-500/8 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.cta.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              {copy.cta.prefix}{" "}
              <a className="underline" href={`mailto:${copy.cta.email}`}>
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
