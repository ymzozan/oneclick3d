"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/LanguageProvider";
import { format } from "@/lib/i18n";
import { MARKETING } from "@/lib/i18nMarketing";

interface Tier {
  name: string;
  monthly: number | null; // null => custom
  credits: number | null; // null => custom volume
  highlight?: boolean;
  cta: "free" | "start" | "contact";
  href: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    credits: 100,
    cta: "free",
    href: "/studio",
    features: [
      "Text & image to 3D",
      "Parametric generation",
      "Standard queue",
      "Assets under CC BY 4.0",
    ],
  },
  {
    name: "Pro",
    monthly: 20,
    credits: 1000,
    cta: "start",
    href: "/studio",
    features: [
      "Everything in Free",
      "Faster generation",
      "Private asset ownership",
      "GLB / STL / OBJ exports",
      "10 concurrent tasks",
    ],
  },
  {
    name: "Studio",
    monthly: 60,
    credits: 4000,
    highlight: true,
    cta: "start",
    href: "/studio",
    features: [
      "Everything in Pro",
      "Priority queue",
      "API access",
      "Team seats",
      "Credit top-ups",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    credits: null,
    cta: "contact",
    href: "mailto:ozan@codeimo.com",
    features: [
      "Everything in Studio",
      "SSO & access control",
      "Dedicated support",
      "Invoicing & wire transfer",
    ],
  },
];

export default function Pricing() {
  const { locale } = useI18n();
  const m = MARKETING[locale];
  const [yearly, setYearly] = useState(false);

  const price = (monthly: number) => (yearly ? Math.round(monthly * 0.8) : monthly);
  const ctaLabel = (cta: Tier["cta"]) =>
    cta === "free" ? m.ctaStartFree : cta === "contact" ? m.ctaContact : m.ctaGetStarted;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{m.pricingTitle}</h1>
      <p className="mt-3 text-muted-foreground">{m.pricingSubtitle}</p>

      {/* Billing toggle */}
      <div className="mt-8 inline-flex items-center rounded-full border p-1 text-sm">
        <button
          onClick={() => setYearly(false)}
          className={`rounded-full px-4 py-1.5 transition ${
            !yearly ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          {m.monthly}
        </button>
        <button
          onClick={() => setYearly(true)}
          className={`rounded-full px-4 py-1.5 transition ${
            yearly ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          {m.yearly} <span className="text-xs opacity-70">−20%</span>
        </button>
      </div>

      <div className="mt-12 grid w-full max-w-6xl gap-6 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-xl border p-6 ${
              tier.highlight ? "border-foreground shadow-sm" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{tier.name}</h2>
              {tier.highlight && (
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                  {m.popular}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              {tier.monthly === null ? (
                <span className="text-3xl font-semibold">{m.custom}</span>
              ) : (
                <>
                  <span className="text-3xl font-semibold">${price(tier.monthly)}</span>
                  <span className="text-sm text-muted-foreground">{m.perMonth}</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {tier.credits === null ? m.customVolume : format(m.creditsPerMonth, { n: tier.credits.toLocaleString() })}
            </p>

            <Button asChild variant={tier.highlight ? "default" : "outline"} className="mt-6">
              <Link href={tier.href}>{ctaLabel(tier.cta)}</Link>
            </Button>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-foreground">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">{m.billingNote}</p>
    </main>
  );
}
