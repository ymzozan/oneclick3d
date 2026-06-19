"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "oneclick3d.credits";
const FREE_CREDITS = 100;

/** Credit cost of generating a new piece. Regenerating a take is free. */
export const GENERATION_COST = 10;

interface CreditsContextValue {
  credits: number;
  /** Spend credits if the balance allows; returns whether it succeeded. */
  spend: (amount: number) => boolean;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(FREE_CREDITS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const n = parseInt(stored, 10);
      if (!Number.isNaN(n)) setCredits(n);
    }
  }, []);

  const spend = (amount: number) => {
    if (credits < amount) return false;
    const next = credits - amount;
    setCredits(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    return true;
  };

  return (
    <CreditsContext.Provider value={{ credits, spend }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits(): CreditsContextValue {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}
