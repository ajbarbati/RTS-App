import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export function Field({
  label,
  error,
  id,
  name,
  className = "",
  ...props
}: FieldProps) {
  const inputId = id ?? name;
  const showErrorSlot = error !== undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-zinc-800">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 ${className}`}
        {...props}
      />
      {showErrorSlot ? (
        <p
          role={error ? "alert" : undefined}
          className="min-h-5 text-sm text-red-600"
        >
          {error ?? "\u00A0"}
        </p>
      ) : null}
    </div>
  );
}
