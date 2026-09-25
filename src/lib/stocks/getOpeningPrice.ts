import "server-only";

import { QuoteError } from "@/src/lib/stocks/errors";

const SYMBOL_PATTERN = /^[A-Z.]{1,10}$/;

type FinnhubQuote = {
  o?: number;
  c?: number;
  h?: number;
  l?: number;
  pc?: number;
};

export async function getOpeningPrice(symbol: string): Promise<number> {
  const normalized = symbol.trim().toUpperCase();

  if (!SYMBOL_PATTERN.test(normalized)) {
    throw new QuoteError(
      "INVALID_SYMBOL",
      "Enter a valid ticker symbol like AAPL",
    );
  }

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    throw new QuoteError(
      "UPSTREAM",
      "Quote service is not configured",
    );
  }

  const params = new URLSearchParams({
    symbol: normalized,
    token,
  });
  const url = `https://finnhub.io/api/v1/quote?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
  } catch {
    throw new QuoteError(
      "UPSTREAM",
      "Quote service unavailable, try again",
    );
  }

  if (!response.ok) {
    throw new QuoteError(
      "UPSTREAM",
      "Quote service unavailable, try again",
    );
  }

  let data: FinnhubQuote;
  try {
    data = (await response.json()) as FinnhubQuote;
  } catch {
    throw new QuoteError(
      "UPSTREAM",
      "Quote service unavailable, try again",
    );
  }

  if (typeof data.o !== "number" || data.o === 0) {
    throw new QuoteError(
      "NOT_FOUND",
      `No quote found for ${normalized}`,
    );
  }

  return data.o;
}
