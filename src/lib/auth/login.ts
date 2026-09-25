import bcrypt from "bcryptjs";
import type { User } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import { parseCredentials, ValidationError } from "@/src/lib/auth/validation";

export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  let credentials: { email: string; password: string };

  try {
    credentials = parseCredentials(email, password);
  } catch (error) {
    if (error instanceof ValidationError) {
      return null;
    }
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
  return isValid ? user : null;
}
