"use client";

import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header";
import Studio from "@/components/Studio";

export default function AppShell() {
  return (
    <LanguageProvider>
      <main className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <Studio />
      </main>
    </LanguageProvider>
  );
}
