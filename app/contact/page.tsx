import Link from "next/link"
import { ArrowRight, Clock, Instagram, Linkedin, Mail, Twitter } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocale } from "@/lib/i18n/server"
import { getDictionary } from "@/lib/i18n/get-dictionary"

export default async function ContactPage() {
  const locale = await getLocale()
  const contact = await getDictionary(locale, "contact")
  const common = await getDictionary(locale, "common")
  const socialLinks = (common.footer.socials.items ?? []) as Array<{ label: string; handle: string; url: string }>

  const resolveSocialIcon = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes("instagram")) return Instagram
    if (lower.includes("linkedin")) return Linkedin
    return Twitter
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background/80 to-primary/5 py-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-sky-500/10 to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
              {contact.hero.eyebrow}
            </span>
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {contact.hero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{contact.hero.description}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`mailto:${contact.hero.email}`} className="group">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-sky-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:-translate-y-0.5">
                  <Mail className="h-4 w-4" aria-hidden />
                  {contact.hero.emailLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden />
                {contact.hero.meta}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_0.85fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-60px_rgba(15,15,15,0.9)]">
                <ContactForm copy={contact.form} />
              </div>
              <div className="space-y-6">
                <Card className="border-white/10 bg-gradient-to-b from-background/90 via-background/60 to-background/40">
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl text-foreground">{contact.details.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">{contact.details.note}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                      <Clock className="h-4 w-4" aria-hidden />
                      {contact.details.response}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  {contact.details.items.map((item: { label: string; description: string; value: string }) => (
                    <Card key={item.value} className="border-white/10 bg-white/5">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.label}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={`mailto:${item.value}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          <Mail className="h-4 w-4" aria-hidden />
                          {item.value}
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {socialLinks.length > 0 && (
                  <Card className="border-white/10 bg-gradient-to-b from-background via-background/60 to-background/40">
                    <CardHeader>
                      <CardTitle className="text-xl text-foreground">{contact.socials.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {contact.socials.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {socialLinks.map((link) => {
                          const Icon = resolveSocialIcon(link.label)
                          return (
                            <li key={link.url}>
                              <Link
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40"
                              >
                                <Icon className="h-4 w-4 text-primary" aria-hidden />
                                <div className="flex flex-col leading-tight">
                                  <span className="text-xs uppercase text-muted-foreground/80">{link.label}</span>
                                  <span className="font-semibold">{link.handle}</span>
                                </div>
                                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
