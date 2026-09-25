import { requireUser } from "@/src/lib/auth/session";

export default async function QuotePage() {
  await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Stock quote</h1>
      <p className="text-sm text-zinc-600">
       
      </p>
    </main>
  );
}
