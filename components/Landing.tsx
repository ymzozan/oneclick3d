"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/LanguageProvider";
import { MARKETING } from "@/lib/i18nMarketing";

export default function Landing() {
  const { t, locale } = useI18n();
  const m = MARKETING[locale];

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          {m.badge}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {m.heroTitle}
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">{t.heroSubtitle}</p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link href="/studio">{t.startCreating}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">{t.navPricing}</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">{m.howTitle}</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {m.steps.map((s, i) => (
              <div key={s.title}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          {m.features.map((f) => (
            <div key={f.title} className="bg-background p-8">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{m.ctaTitle}</h2>
        <p className="mt-3 text-muted-foreground">{m.ctaSubtitle}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/studio">{t.startCreating}</Link>
        </Button>
      </section>

      <footer className="border-t px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OneClick3D
      </footer>
    </main>
  );
}
