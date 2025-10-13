import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold">SotA</h3>
            <p className="text-sm text-muted-foreground">
              High-quality academic and industry research platform.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research-lines" className="text-muted-foreground hover:text-foreground">
                  Research Lines
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SotA. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
