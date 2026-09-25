import { Card } from "@/app/_components/Card";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Log in
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to look up a stock&apos;s opening price.
          </p>
        </div>
        <LoginForm registered={params.registered === "1"} />
      </Card>
    </main>
  );
}
