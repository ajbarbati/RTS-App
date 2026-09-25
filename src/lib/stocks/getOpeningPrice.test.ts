import { afterEach, expect, test, vi } from "vitest";
import { QuoteError } from "./errors";
import { getOpeningPrice } from "./getOpeningPrice";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test("returns the opening price for a symbol", async () => {
  vi.stubEnv("FINNHUB_API_KEY", "test-key");
  const fetchMock = vi.fn().mockResolvedValue(
    Response.json({ c: 151.1, h: 152, l: 149.5, o: 150.25, pc: 149.8 }),
  );
  vi.stubGlobal("fetch", fetchMock);

  await expect(getOpeningPrice("aapl")).resolves.toBe(150.25);
  expect(String(fetchMock.mock.calls[0][0])).toContain("symbol=AAPL");
});

test("rejects unknown symbols when Finnhub returns o: 0", async () => {
  vi.stubEnv("FINNHUB_API_KEY", "test-key");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ o: 0, c: 0, h: 0, l: 0, pc: 0 })),
  );

  await expect(getOpeningPrice("ZZZZ")).rejects.toMatchObject({
    name: "QuoteError",
    code: "NOT_FOUND",
  } satisfies Partial<QuoteError>);
});

test("rejects upstream failures on non-2xx responses", async () => {
  vi.stubEnv("FINNHUB_API_KEY", "test-key");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("error", { status: 500 })),
  );

  await expect(getOpeningPrice("AAPL")).rejects.toMatchObject({
    name: "QuoteError",
    code: "UPSTREAM",
  } satisfies Partial<QuoteError>);
});

test("rejects empty symbols without calling fetch", async () => {
  vi.stubEnv("FINNHUB_API_KEY", "test-key");
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  await expect(getOpeningPrice("")).rejects.toMatchObject({
    name: "QuoteError",
    code: "INVALID_SYMBOL",
  } satisfies Partial<QuoteError>);
  expect(fetchMock).not.toHaveBeenCalled();
});
