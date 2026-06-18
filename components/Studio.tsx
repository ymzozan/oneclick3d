"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PIPELINE_STAGES, type StageId, stageIndex } from "@/lib/pipeline";
import type { StoneSeat } from "@/app/api/stone-seats/route";

// The viewer pulls in three.js, so it is loaded on the client only.
const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Initialising viewport…
    </div>
  ),
});

interface Job {
  id: string;
  title: string;
  source: "prompt" | "image";
  referenceUrl?: string;
  createdAt: number;
  stage: StageId;
  modelUrl?: string;
  seats: StoneSeat[];
  note?: string;
}

const EXAMPLES = [
  "A signet ring with an oval bezel-set emerald",
  "Art-nouveau pendant with intertwined vines",
  "Tennis bracelet with a row of round pavé diamonds",
  "Minimalist solitaire engagement ring, 1ct round",
];

export default function Studio() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [prompt, setPrompt] = useState("");
  const [referenceUrl, setReferenceUrl] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  const active = jobs.find((j) => j.id === activeId);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => setReferenceUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const generate = useCallback(async () => {
    if (!prompt.trim() && !referenceUrl) return;
    setBusy(true);
    setError(undefined);

    const id = crypto.randomUUID();
    const job: Job = {
      id,
      title: prompt.trim() || "Reference image",
      source: referenceUrl ? "image" : "prompt",
      referenceUrl,
      createdAt: Date.now(),
      stage: "generate",
      seats: [],
    };

    // Hand off to the generation service. When no API key is configured the
    // request fails gracefully and the studio falls back to a sample piece so
    // the full pipeline can still be explored.
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), imageUrl: referenceUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        job.note = data.error ?? "Generation service unavailable — showing a sample piece.";
      }
      job.stage = "preview";
    } catch {
      job.note = "Generation service unavailable — showing a sample piece.";
      job.stage = "preview";
    }

    setJobs((prev) => [job, ...prev]);
    setActiveId(id);
    setPrompt("");
    setReferenceUrl(undefined);
    setBusy(false);
  }, [prompt, referenceUrl]);

  const update = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  const detectSeats = useCallback(async () => {
    if (!active) return;
    setBusy(true);
    try {
      const res = await fetch("/api/stone-seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelUrl: active.modelUrl ?? "placeholder" }),
      });
      const data = await res.json();
      update(active.id, { seats: data.seats ?? [] });
    } finally {
      setBusy(false);
    }
  }, [active, update]);

  // ---- Compose view: the single, Google-simple entry point. ----
  if (!active) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create jewelry from a single idea
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Describe the piece or drop a reference image. OneClick3D builds the
            model, maps the stone seats and prepares it for casting.
          </p>

          <div className="mt-8 rounded-xl border bg-card p-2 text-left shadow-sm">
            {referenceUrl && (
              <div className="flex items-center gap-3 border-b p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={referenceUrl}
                  alt="Reference"
                  className="h-12 w-12 rounded-md object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  Reference image attached
                </span>
                <button
                  onClick={() => setReferenceUrl(undefined)}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              </div>
            )}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              placeholder="Describe the piece you want to create…"
              rows={3}
              className="w-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                Attach image
              </Button>
              <Button onClick={generate} disabled={busy || (!prompt.trim() && !referenceUrl)}>
                {busy ? "Generating…" : "Generate"}
              </Button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFile(file);
              }}
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-xs text-destructive">{error}</p>}

          {jobs.length > 0 && (
            <button
              onClick={() => setActiveId(jobs[0].id)}
              className="mt-8 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Back to workspace ({jobs.length})
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- Workspace view: the panel where generated pieces land. ----
  const current = stageIndex(active.stage);

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Projects panel */}
      <aside className="flex flex-col border-b lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between p-4">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Projects
          </span>
          <Button size="sm" variant="outline" onClick={() => setActiveId(undefined)}>
            New
          </Button>
        </div>
        <Separator />
        <ul className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:overflow-x-visible">
          {jobs.map((j) => (
            <li key={j.id}>
              <button
                onClick={() => setActiveId(j.id)}
                className={`w-full max-w-56 truncate rounded-md px-3 py-2 text-left text-sm transition lg:max-w-none ${
                  j.id === activeId ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                {j.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Viewport */}
      <section className="relative flex min-h-[55vh] flex-1 items-center justify-center bg-muted/30">
        <ModelViewer
          modelUrl={active.modelUrl}
          seats={active.stage === "stone-seats" ? active.seats : []}
        />
      </section>

      {/* Pipeline + inspector */}
      <aside className="flex flex-col border-t lg:w-80 lg:border-t-0 lg:border-l">
        <ol className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
          {PIPELINE_STAGES.filter((s) => s.id !== "reference").map((s) => {
            const idx = stageIndex(s.id);
            const isActive = s.id === active.stage;
            const done = idx < current;
            return (
              <li key={s.id}>
                <button
                  onClick={() => update(active.id, { stage: s.id })}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                    isActive ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      isActive
                        ? "bg-foreground text-background"
                        : done
                          ? "bg-foreground/70 text-background"
                          : "border text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : idx}
                  </span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
        <Separator />
        <div className="flex-1 space-y-4 p-5">
          <div>
            <h2 className="text-sm font-semibold">{PIPELINE_STAGES[current].label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {PIPELINE_STAGES[current].description}
            </p>
          </div>

          {active.note && active.stage === "preview" && (
            <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {active.note}
            </p>
          )}

          {active.stage === "stone-seats" && (
            <div className="space-y-3">
              <Button onClick={detectSeats} disabled={busy} className="w-full">
                {busy ? "Analysing…" : "Detect stone seats"}
              </Button>
              {active.seats.length > 0 && (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {active.seats.map((s, i) => (
                    <li key={i} className="flex justify-between border-b py-1 last:border-b-0">
                      <span className="capitalize">{s.setting}</span>
                      <span>{s.diameterMm} mm</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(active.stage === "sculpt" || active.stage === "cad" || active.stage === "sprue") && (
            <Button variant="outline" className="w-full" disabled>
              Export for {PIPELINE_STAGES[current].tool ?? "production"}
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
