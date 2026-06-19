"use client";

import { useI18n } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold tracking-tight">OneClick3D</span>
        <span className="rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Studio
        </span>
      </div>
      <div className="flex items-center gap-4">
        <p className="hidden text-xs text-muted-foreground md:block">{t.tagline}</p>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
