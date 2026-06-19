"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Tier {
  name: string;
  monthly: number | null; // null => custom
  credits: string;
  highlight?: boolean;
  cta: string;
  href: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    credits: "100 credits / month",
    cta: "Start free",
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
    credits: "1,000 credits / month",
    cta: "Get started",
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
    credits: "4,000 credits / month",
    highlight: true,
    cta: "Get started",
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
    credits: "Custom volume",
    cta: "Contact us",
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
  const [yearly, setYearly] = useState(false);

  const price = (monthly: number) =>
    yearly ? Math.round(monthly * 0.8) : monthly;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pricing</h1>
      <p className="mt-3 text-muted-foreground">
        Start free. Upgrade when you are ready to produce.
      </p>

      {/* Billing toggle */}
      <div className="mt-8 inline-flex items-center rounded-full border p-1 text-sm">
        <button
          onClick={() => setYearly(false)}
          className={`rounded-full px-4 py-1.5 transition ${
            !yearly ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setYearly(true)}
          className={`rounded-full px-4 py-1.5 transition ${
            yearly ? "bg-foreground text-background" : "text-muted-foreground"
          }`}
        >
          Yearly <span className="text-xs opacity-70">−20%</span>
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
                  Popular
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              {tier.monthly === null ? (
                <span className="text-3xl font-semibold">Custom</span>
              ) : (
                <>
                  <span className="text-3xl font-semibold">${price(tier.monthly)}</span>
                  <span className="text-sm text-muted-foreground">/ mo</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{tier.credits}</p>

            <Button
              asChild
              variant={tier.highlight ? "default" : "outline"}
              className="mt-6"
            >
              <Link href={tier.href}>{tier.cta}</Link>
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

      <p className="mt-10 text-xs text-muted-foreground">
        Prices shown for planning. Checkout is coming soon.
      </p>
    </main>
  );
}
