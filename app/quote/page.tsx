import { requireUser } from "@/src/lib/auth/session";
import { QuoteForm } from "./quote-form";

export default async function QuotePage() {
  await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stock quote</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter a ticker to see today&apos;s opening price.
        </p>
      </div>

      <QuoteForm />
    </main>
  );
}
