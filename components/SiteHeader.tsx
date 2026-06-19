"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/LanguageProvider";
import { useCredits } from "@/components/CreditsProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SiteHeader() {
  const { t } = useI18n();
  const { credits } = useCredits();
  const pathname = usePathname();

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm transition hover:text-foreground ${
        pathname === href ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="flex items-center justify-between border-b px-6 py-3.5">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">OneClick3D</span>
        </Link>
        <nav className="hidden items-center gap-5 sm:flex">
          {link("/studio", t.navStudio)}
          {link("/pricing", t.navPricing)}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/pricing"
          title="Credits"
          className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition hover:text-foreground sm:flex"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground" />
          {credits}
        </Link>
        <LanguageSwitcher />
        <Button size="sm" variant="outline">
          {t.signIn}
        </Button>
      </div>
    </header>
  );
}
