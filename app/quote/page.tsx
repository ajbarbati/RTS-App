import { Card } from "@/app/_components/Card";
import { requireUser } from "@/src/lib/auth/session";
import { QuoteForm } from "./quote-form";

export default async function QuotePage() {
  await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Stock quote
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Enter a ticker to see today&apos;s opening price.
          </p>
        </div>
        <QuoteForm />
      </Card>
    </main>
  );
}
