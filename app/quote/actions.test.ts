import { expect, test, vi } from "vitest";
import { QuoteError } from "@/src/lib/stocks/errors";

vi.mock("@/src/lib/auth/session", () => ({
  requireUser: vi.fn().mockResolvedValue({ id: "u1", email: "t@example.com" }),
}));

vi.mock("@/src/lib/stocks/getOpeningPrice", () => ({
  getOpeningPrice: vi.fn(),
}));

import { getOpeningPrice } from "@/src/lib/stocks/getOpeningPrice";
import { quoteAction } from "@/app/quote/actions";

test("returns the opening price for a signed-in user", async () => {
  vi.mocked(getOpeningPrice).mockResolvedValue(150.25);

  const form = new FormData();
  form.set("symbol", "AAPL");

  await expect(quoteAction({}, form)).resolves.toEqual({
    symbol: "AAPL",
    price: 150.25,
  });
});

test("returns a friendly error when the symbol is not found", async () => {
  vi.mocked(getOpeningPrice).mockRejectedValue(
    new QuoteError("NOT_FOUND", "No quote found for ZZZZ"),
  );

  const form = new FormData();
  form.set("symbol", "ZZZZ");

  await expect(quoteAction({}, form)).resolves.toEqual({
    error: "No quote found for ZZZZ",
  });
});
