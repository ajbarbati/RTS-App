"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/src/lib/auth/auth";

export type LoginState = { error: string | null };

const INVALID_CREDENTIALS = "Invalid email or password";

function isCredentialsFailure(destination: string): boolean {
  return /[?&]error=CredentialsSignin(?:&|$)/.test(destination);
}

function isAuthApiUrl(destination: string): boolean {
  try {
    const url = new URL(destination, "http://localhost");
    return url.pathname.startsWith("/api/auth/");
  } catch {
    return destination.includes("/api/auth/");
  }
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const destination = await signIn("credentials", {
      email,
      password,
      redirectTo: "/quote",
      redirect: false,
    });

    if (typeof destination !== "string") {
      throw new Error("Sign-in is unavailable");
    }

    if (isCredentialsFailure(destination)) {
      return { error: INVALID_CREDENTIALS };
    }

    // Auth.js returns the callback URL with no Location header when the
    // server is misconfigured. That response is the raw JSON page, so
    // surface it on the error page instead of navigating there.
    if (isAuthApiUrl(destination) || /[?&]error=/.test(destination)) {
      throw new Error("Sign-in is unavailable");
    }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: INVALID_CREDENTIALS };
    }
    if (error instanceof AuthError) {
      throw new Error("Sign-in is unavailable", { cause: error });
    }
    throw error;
  }

  redirect("/quote");
}
