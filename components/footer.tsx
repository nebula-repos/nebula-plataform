import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold">Research Platform</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma de investigación académica e industrial de alta calidad.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research-lines" className="text-muted-foreground hover:text-foreground">
                  Líneas de Investigación
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Research Platform. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
