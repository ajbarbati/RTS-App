import { expect, test } from "vitest";
import { prisma } from "@/src/lib/prisma";
import { login } from "@/src/lib/auth/login";
import { signup } from "@/src/lib/auth/signup";

test("logs in with the right password and rejects the wrong one", async () => {
  const uniqueEmail = `user-login-${crypto.randomUUID()}@example.com`;

  try {
    await signup(uniqueEmail, "password123");

    const sessionUser = await login(uniqueEmail, "password123");
    expect(sessionUser).not.toBeNull();
    expect(sessionUser?.email).toBe(uniqueEmail);

    const rejected = await login(uniqueEmail, "wrong-password");
    expect(rejected).toBeNull();
  } finally {
    await prisma.user.deleteMany({
      where: { email: uniqueEmail },
    });
  }
});
