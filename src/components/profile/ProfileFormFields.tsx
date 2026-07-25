"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface ChipInputProps {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: readonly string[];
  placeholder?: string;
}

export function ChipInput({
  label,
  description,
  values,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter",
}: ChipInputProps) {
  const [input, setInput] = useState("");

  function addValue(value: string) {
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  }

  function removeValue(value: string) {
    onChange(values.filter((item) => item !== value));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addValue(input);
    }
  }

  const availableSuggestions = suggestions.filter(
    (item) => !values.includes(item)
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-bold text-slate-900">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 px-3 py-1 text-sm font-medium text-blue-900"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="text-blue-700 hover:text-blue-900 font-bold"
                aria-label={`Remove ${value}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-900 placeholder-slate-500 transition"
      />

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addValue(item)}
              className="rounded-full border-2 border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 bg-white"
            >
              + {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormField({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <label className="block text-sm font-bold text-slate-900">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-2xl border-2 border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-900 placeholder-slate-500 transition";

export const selectClassName =
  "w-full rounded-2xl border-2 border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-900 transition";

export const primaryButtonClassName =
  "rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 shadow-md";

export const secondaryButtonClassName =
  "rounded-2xl border-2 border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 bg-white";
