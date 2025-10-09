import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userData = null
  if (user) {
    const { data } = await supabase.from("users").select("role, membership_tier").eq("id", user.id).single()
    userData = data
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold">
          Research Platform
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/research-lines" className="text-sm hover:text-primary">
            Líneas de Investigación
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary">
                Mi Cuenta
              </Link>
              {userData?.role === "admin" && (
                <Link href="/admin" className="text-sm hover:text-primary">
                  Admin
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Cerrar sesión
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
