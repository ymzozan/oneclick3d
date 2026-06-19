"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/LanguageProvider";

const STEPS = [
  {
    title: "Describe or upload",
    body: "Start from a text prompt or a reference image — a sketch, a photo, an idea.",
  },
  {
    title: "Approve or regenerate",
    body: "Review each result. Keep what you like, regenerate what you don't, one step at a time.",
  },
  {
    title: "Export for production",
    body: "Take the finished piece into ZBrush, MatrixGold or casting as GLB, STL or OBJ.",
  },
];

const FEATURES = [
  ["Image & text to 3D", "Turn a reference image or a description into a 3D model."],
  ["Stone seat mapping", "Locate gemstone seats for flush and pavé setting work."],
  ["Production-ready exports", "GLB, STL and OBJ for every tool in your bench."],
  ["Eight languages", "A studio that speaks your makers' language."],
];

export default function Landing() {
  const { t } = useI18n();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          For jewelers & digital artists
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          From a single idea to casting-ready jewelry
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
          <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
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
          {FEATURES.map(([title, body]) => (
            <div key={title} className="bg-background p-8">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Start with 100 free credits</h2>
        <p className="mt-3 text-muted-foreground">No card required.</p>
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
