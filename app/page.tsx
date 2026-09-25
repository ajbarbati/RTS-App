import Link from "next/link";
import { auth } from "@/src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Look up a stock&apos;s opening price
        </h1>
        <p className="mt-2 max-w-xl text-zinc-600">
          Create an account, sign in, and search a ticker like AAPL.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {session?.user ? (
          <Link
            href="/quote"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Go to quote
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
