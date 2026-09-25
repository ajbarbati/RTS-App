import Link from "next/link";
import { auth } from "@/src/lib/auth/auth";
import { logoutAction } from "@/app/actions";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          RTS Stock Lookup
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="hidden text-zinc-600 sm:inline">
                {session.user.email}
              </span>
              <Link
                href="/quote"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                Quote
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded border border-zinc-300 px-3 py-1.5 font-medium hover:bg-zinc-50"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
