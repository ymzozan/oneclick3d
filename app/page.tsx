import Studio from "@/components/Studio";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">OneClick3D</span>
          <span className="rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Studio
          </span>
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Image to casting-ready jewelry
        </p>
      </header>
      <Studio />
    </main>
  );
}
