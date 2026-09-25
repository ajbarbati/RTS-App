import Link from "next/link";
import { auth } from "@/src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-teal-800">
        RTS Stock Lookup
      </p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Look up a stock&apos;s opening price
      </h1>
      <p className="mt-3 max-w-xl text-base text-zinc-600">
        Create an account, sign in, and search a ticker like AAPL.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {session?.user ? (
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800 focus-visible:ring-offset-2"
          >
            Go to quote
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800 focus-visible:ring-offset-2"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800 focus-visible:ring-offset-2"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
