"use client";

import { useState } from "react";
import { LOCALES } from "@/lib/i18n";
import { useI18n } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm transition hover:bg-accent"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="text-[10px] text-muted-foreground">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute end-0 z-20 mt-1 w-44 overflow-hidden rounded-md border bg-popover py-1 shadow-md">
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition hover:bg-accent ${
                    l.code === locale ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
