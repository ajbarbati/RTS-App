"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Field } from "@/app/_components/Field";
import { SubmitButton } from "@/app/_components/SubmitButton";
import { signUpAction, type SignUpState } from "./actions";

const initialState: SignUpState = { error: null };

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <div className="flex flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-3">
        <Field
          label="Email"
          type="email"
          name="email"
          required
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <p
          role={state.error ? "alert" : undefined}
          className="min-h-5 text-sm text-red-600"
        >
          {state.error ?? "\u00A0"}
        </p>

        <SubmitButton pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <p className="text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-teal-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-800 focus-visible:ring-offset-2"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
