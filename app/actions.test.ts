import { expect, test, vi } from "vitest";

vi.mock("@/src/lib/auth/auth", () => ({
  signOut: vi.fn(),
}));

import { signOut } from "@/src/lib/auth/auth";
import { logoutAction } from "@/app/actions";

test("logout signs the user out and sends them to /login", async () => {
  await logoutAction();
  expect(signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
});
