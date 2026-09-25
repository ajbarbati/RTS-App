"use client";

import { useActionState } from "react";
import { quoteAction, type QuoteState } from "./actions";

const initialState: QuoteState = {};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function QuoteForm() {
  const [state, formAction, isPending] = useActionState(
    quoteAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Symbol
          <input
            type="text"
            name="symbol"
            required
            placeholder="AAPL"
            autoComplete="off"
            spellCheck={false}
            className="rounded border border-zinc-300 px-3 py-2 text-base font-normal uppercase outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {isPending ? "Looking up…" : "Get opening price"}
        </button>
      </form>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      {state.symbol && typeof state.price === "number" ? (
        <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.symbol} opened at {currency.format(state.price)} today
        </p>
      ) : null}
    </div>
  );
}
