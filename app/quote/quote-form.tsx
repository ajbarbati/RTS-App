"use client";

import { useActionState } from "react";
import { Field } from "@/app/_components/Field";
import { SubmitButton } from "@/app/_components/SubmitButton";
import { quoteAction, type QuoteState } from "./actions";

const initialState: QuoteState = {};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function QuoteForm() {
  const [state, formAction] = useActionState(quoteAction, initialState);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-3">
        <Field
          label="Symbol"
          type="text"
          name="symbol"
          required
          placeholder="AAPL"
          autoComplete="off"
          spellCheck={false}
          className="uppercase"
        />

        <p
          role={state.error ? "alert" : undefined}
          className="min-h-5 text-sm text-red-600"
        >
          {state.error ?? "\u00A0"}
        </p>

        <SubmitButton pendingLabel="Looking up…">Get opening price</SubmitButton>
      </form>

      <div className="min-h-14">
        {state.symbol && typeof state.price === "number" ? (
          <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-3 text-sm text-teal-950">
            <span className="font-semibold">{state.symbol}</span> opened at{" "}
            <span className="font-semibold">
              {currency.format(state.price)}
            </span>{" "}
            today
          </p>
        ) : null}
      </div>
    </div>
  );
}
