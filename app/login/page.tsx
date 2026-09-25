import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Sign in to look up a stock&apos;s opening price.
        </p>
      </div>

      <LoginForm registered={params.registered === "1"} />
    </main>
  );
}
