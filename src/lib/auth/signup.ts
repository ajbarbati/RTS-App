import bcrypt from "bcryptjs";
import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import { parseCredentials } from "@/src/lib/auth/validation";

export class EmailTakenError extends Error {
  constructor(message = "Email already registered") {
    super(message);
    this.name = "EmailTakenError";
  }
}

export async function signup(email: unknown, password: unknown): Promise<void> {
  const credentials = parseCredentials(email, password);
  const passwordHash = await bcrypt.hash(credentials.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: credentials.email,
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EmailTakenError();
    }
    throw error;
  }
}
