import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Privacy policy</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Learn how we collect, use, and protect your information when you use Nebula.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 space-y-12">
            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Information we collect</h2>
              <p className="text-muted-foreground">We collect the data needed to operate the platform and improve the experience:</p>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Account data: name, email address, and membership preference.</li>
                <li>Platform activity: lines visited, releases viewed, and administrative actions.</li>
                <li>Technical information: IP address, device settings, and access logs.</li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">2. How we use information</h2>
              <p className="text-muted-foreground">We use your data to operate and improve our services, including:</p>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Authenticating users and providing the right access levels.</li>
                <li>Personalizing recommendations and measuring content relevance.</li>
                <li>Monitoring platform usage, detecting abuse, and maintaining security.</li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Sharing with third parties</h2>
              <p className="text-muted-foreground">We do not sell personal information. We only share data when strictly necessary to:</p>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Process authentication and secure storage through our cloud providers.</li>
                <li>Comply with legal requirements or respond to lawful requests.</li>
                <li>Integrate aggregated analytics tools to understand platform performance.</li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Security and retention</h2>
              <p className="text-muted-foreground">
                We implement technical and organizational controls to protect your data. Administrative access is audited
                and sensitive records are stored encrypted. We retain information while you have an active account or as
                long as required for legal obligations.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Your rights</h2>
              <p className="text-muted-foreground">
                You can access, update, or delete your information from the platform or by emailing{" "}
                <a className="underline" href="mailto:privacidad@nebula.ai">
                  privacidad@nebula.ai
                </a>
                . We respond within 30 days.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Changes to this policy</h2>
              <p className="text-muted-foreground">
                We publish updates with their effective date. If we make significant changes, we&apos;ll email registered
                users in advance.
              </p>
              <p className="text-sm text-muted-foreground">Last updated: October 10, 2025.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
