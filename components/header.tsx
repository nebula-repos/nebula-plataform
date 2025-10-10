import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { resolveUserProfile } from "@/lib/supabase/profiles"

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userProfile = user ? await resolveUserProfile(supabase, user) : null

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-semibold">
          Research Platform
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/research-lines" className="text-sm hover:text-primary">
            Research Lines
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary">
                My Account
              </Link>
              {userProfile?.role === "admin" && (
                <Link href="/admin" className="text-sm hover:text-primary">
                  Admin
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
