export type QuoteErrorCode = "INVALID_SYMBOL" | "NOT_FOUND" | "UPSTREAM";

export class QuoteError extends Error {
  constructor(
    public code: QuoteErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "QuoteError";
  }
}
