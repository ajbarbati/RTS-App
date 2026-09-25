export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function parseCredentials(
  email: unknown,
  password: unknown,
): { email: string; password: string } {
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const normalizedPassword = String(password ?? "");

  if (!normalizedEmail.includes("@")) {
    throw new ValidationError("Enter a valid email address");
  }

  if (normalizedPassword.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }

  return { email: normalizedEmail, password: normalizedPassword };
}
