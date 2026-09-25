import { expect, test, vi } from "vitest";

vi.mock("next-auth", () => {
  class AuthError extends Error {
    constructor(message?: string) {
      super(message);
      this.name = "AuthError";
    }
  }

  class CredentialsSignin extends AuthError {
    constructor() {
      super("CredentialsSignin");
      this.name = "CredentialsSignin";
    }
  }

  return { AuthError, CredentialsSignin };
});

vi.mock("@/src/lib/auth/auth", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/src/lib/auth/auth";
import { redirect } from "next/navigation";
import { loginAction } from "./actions";

function form() {
  const data = new FormData();
  data.set("email", "ada@example.com");
  data.set("password", "password1");
  return data;
}

test("shows an inline error for a wrong password", async () => {
  vi.mocked(signIn).mockRejectedValue(new CredentialsSignin());

  await expect(loginAction({ error: null }, form())).resolves.toEqual({
    error: "Invalid email or password",
  });
  expect(redirect).not.toHaveBeenCalled();
});

test("shows an inline error when the callback URL is a credentials failure", async () => {
  vi.mocked(signIn).mockResolvedValue(
    "https://example.com/login?error=CredentialsSignin",
  );

  await expect(loginAction({ error: null }, form())).resolves.toEqual({
    error: "Invalid email or password",
  });
  expect(redirect).not.toHaveBeenCalled();
});

test("throws when sign-in would land on the auth callback JSON page", async () => {
  vi.mocked(signIn).mockResolvedValue(
    "https://rts-app-mu.vercel.app/api/auth/callback/credentials",
  );

  await expect(loginAction({ error: null }, form())).rejects.toThrow(
    "Sign-in is unavailable",
  );
  expect(redirect).not.toHaveBeenCalled();
});

test("throws configuration failures so the error page can handle them", async () => {
  vi.mocked(signIn).mockRejectedValue(new AuthError("Configuration"));

  await expect(loginAction({ error: null }, form())).rejects.toThrow(
    "Sign-in is unavailable",
  );
  expect(redirect).not.toHaveBeenCalled();
});

test("redirects to /quote after a successful sign-in", async () => {
  vi.mocked(signIn).mockResolvedValue("https://example.com/quote");

  await expect(loginAction({ error: null }, form())).rejects.toThrow(
    "NEXT_REDIRECT",
  );
  expect(redirect).toHaveBeenCalledWith("/quote");
});
