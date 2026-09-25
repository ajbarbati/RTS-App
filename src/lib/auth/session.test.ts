import { expect, test, vi, type Mock } from "vitest";
import type { Session } from "next-auth";

vi.mock("@/src/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { auth } from "@/src/lib/auth/auth";
import { redirect } from "next/navigation";
import { requireUser } from "@/src/lib/auth/session";

const authMock = auth as unknown as Mock<() => Promise<Session | null>>;

test("redirects to /login when there is no session", async () => {
  authMock.mockResolvedValue(null);

  await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/login");
});

test("returns the signed-in user when a session exists", async () => {
  const user = { id: "u1", email: "t@example.com" };
  authMock.mockResolvedValue({
    user,
    expires: new Date(Date.now() + 60_000).toISOString(),
  });

  await expect(requireUser()).resolves.toEqual(user);
});
