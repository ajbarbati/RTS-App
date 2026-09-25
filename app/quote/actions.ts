"use server";

import { requireUser } from "@/src/lib/auth/session";
import { QuoteError } from "@/src/lib/stocks/errors";
import { getOpeningPrice } from "@/src/lib/stocks/getOpeningPrice";

export type QuoteState = {
  symbol?: string;
  price?: number;
  error?: string;
};

function messageForQuoteError(error: QuoteError, symbol: string): string {
  switch (error.code) {
    case "INVALID_SYMBOL":
      return "Enter a ticker like AAPL";
    case "NOT_FOUND":
      return `No quote found for ${symbol || "that symbol"}`;
    case "UPSTREAM":
      return "Quote service unavailable, try again";
    default:
      return error.message;
  }
}

export async function quoteAction(
  _prevState: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  await requireUser();

  const rawSymbol = String(formData.get("symbol") ?? "");
  const symbol = rawSymbol.trim().toUpperCase();

  try {
    const price = await getOpeningPrice(rawSymbol);
    return { symbol, price };
  } catch (error) {
    if (error instanceof QuoteError) {
      return { error: messageForQuoteError(error, symbol) };
    }
    throw error;
  }
}
