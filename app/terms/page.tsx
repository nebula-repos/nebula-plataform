import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Terms and conditions</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              These terms govern access to and use of Nebula. By creating an account or using the site you agree to these conditions.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 space-y-12">
            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Service</h2>
              <p className="text-muted-foreground">
                Nebula provides access to curated research lines, releases, and analysis tools. We reserve the right to modify features,
                suspend access for maintenance, or update content without prior notice.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Accounts and eligibility</h2>
              <p className="text-muted-foreground">
                You must provide accurate information and keep your credentials confidential. You are responsible for all actions taken from your account.
                We may suspend accounts that violate these terms or pose a risk to the community.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Acceptable use</h2>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Do not interfere with the security or availability of the platform.</li>
                <li>Do not redistribute exclusive content without prior authorization.</li>
                <li>Do not use Nebula for illegal activities or those that infringe third-party rights.</li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Intellectual property</h2>
              <p className="text-muted-foreground">
                Original content, trademarks, and materials on the platform belong to Nebula or its contributors.
                You grant Nebula a license to use feedback, suggestions, or content you submit in order to improve the service.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Memberships and payments</h2>
              <p className="text-muted-foreground">
                We offer free and paid plans. Paid subscriptions renew automatically, but you can cancel before the next billing period.
                Fees are non-refundable unless required by law.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Limitation of liability</h2>
              <p className="text-muted-foreground">
                The information provided is for educational and strategic purposes. Nebula does not guarantee specific results and is not liable for indirect,
                incidental, or consequential losses arising from use of the platform.
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Changes to these terms</h2>
              <p className="text-muted-foreground">
                We may update these terms when needed. If the changes are significant, we&apos;ll notify registered users with reasonable advance notice.
                Continuing to use the service means you accept the new terms.
              </p>
              <p className="text-sm text-muted-foreground">Effective October 10, 2025.</p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Contact</h2>
              <p className="text-muted-foreground">
                For questions or concerns, contact us at{" "}
                <a className="underline" href="mailto:legal@nebula.ai">
                  legal@nebula.ai
                </a>
                .
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
