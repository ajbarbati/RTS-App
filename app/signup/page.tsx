import { Card } from "@/app/_components/Card";
import { SignUpForm } from "./signup-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Sign up
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create an account to look up stock opening prices.
          </p>
        </div>
        <SignUpForm />
      </Card>
    </main>
  );
}
