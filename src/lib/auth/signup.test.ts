import { expect, test } from "vitest";
import { prisma } from "@/src/lib/prisma";
import { signup } from "@/src/lib/auth/signup";

test("creates a user with a hashed password", async () => {
  const uniqueEmail = `user-signup-${crypto.randomUUID()}@example.com`;

  try {
    await signup(uniqueEmail, "password123");

    const user = await prisma.user.findUnique({
      where: { email: uniqueEmail },
    });

    expect(user).toBeDefined();
    expect(user?.email).toBe(uniqueEmail);
    expect(user?.passwordHash).toBeDefined();
    expect(user?.passwordHash).not.toBe("password123");
    expect(user?.createdAt).toBeDefined();
  } finally {
    await prisma.user.deleteMany({
      where: { email: uniqueEmail },
    });
  }
});
