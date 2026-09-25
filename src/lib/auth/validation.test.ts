import { expect, test } from "vitest";
import { parseCredentials, ValidationError } from "./validation";

test("normalizes email to lowercase and trims whitespace", () => {
  const result = parseCredentials("  A@Example.com ", "password123");
  expect(result.email).toBe("a@example.com");
  expect(result.password).toBe("password123");
});

test("rejects passwords shorter than 8 characters", () => {
  expect(() => parseCredentials("user@example.com", "short")).toThrow(
    ValidationError,
  );
});

test("rejects emails without an @", () => {
  expect(() => parseCredentials("not-an-email", "password123")).toThrow(
    ValidationError,
  );
});
