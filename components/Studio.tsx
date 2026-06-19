"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/components/LanguageProvider";
import { format } from "@/lib/i18n";
import { PIPELINE_STAGES, type StageId, stageIndex } from "@/lib/pipeline";
import { specFromPrompt, varySpec, seatPositions, type JewelrySpec } from "@/lib/jewelry";
import type { ExportFormat } from "@/lib/exporters";
import type { StoneSeat } from "@/app/api/stone-seats/route";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">…</div>
  ),
});

type WorkStage = Exclude<StageId, "reference">;
const WORK_STAGES: WorkStage[] = PIPELINE_STAGES.filter(
  (s) => s.id !== "reference",
).map((s) => s.id) as WorkStage[];

interface Job {
  id: string;
  title: string;
  source: "prompt" | "image";
  referenceUrl?: string;
  createdAt: number;
  stage: WorkStage;
  modelUrl?: string;
  spec?: JewelrySpec;
  completed?: boolean;
}

const EXAMPLES = [
  "A signet ring with an oval bezel-set emerald",
  "Tennis bracelet with a row of round pavé diamonds",
  "Minimalist solitaire engagement ring, 1ct round",
  "Three-stone trilogy ring, thick band",
];

const EXPORT_FORMATS: ExportFormat[] = ["glb", "stl", "obj"];

/** Stone seats derived from the generated geometry. */
function computeSeats(spec: JewelrySpec): StoneSeat[] {
  const setting = spec.setting === "three-stone" ? "prong" : spec.setting;
  return seatPositions(spec).map((position, idx) => ({
    position,
    diameterMm:
      Math.round((idx === 0 ? spec.stoneSize : spec.stoneSize * 0.5) * 18 * 10) / 10,
    setting: setting as StoneSeat["setting"],
    confidence: 1,
  }));
}

export default function Studio() {
  const { t } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [prompt, setPrompt] = useState("");
  const [referenceUrl, setReferenceUrl] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string>();
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
    setNote(undefined);

    const id = crypto.randomUUID();
    const job: Job = {
      id,
      title: prompt.trim() || t.refAttached,
      source: referenceUrl ? "image" : "prompt",
      referenceUrl,
      createdAt: Date.now(),
      stage: "generate",
    };

    if (referenceUrl) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: referenceUrl }),
        });
        if (res.ok && res.headers.get("Content-Type")?.includes("gltf")) {
          job.modelUrl = URL.createObjectURL(await res.blob());
        } else {
          job.spec = specFromPrompt(prompt);
          setNote(t.parametricNote);
        }
      } catch {
        job.spec = specFromPrompt(prompt);
        setNote(t.unavailableNote);
      }
    } else {
      job.spec = specFromPrompt(prompt);
    }

    setJobs((prev) => [job, ...prev]);
    setActiveId(id);
    setPrompt("");
    setReferenceUrl(undefined);
    setBusy(false);
  }, [prompt, referenceUrl, t]);

  const update = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }, []);

  // Tinder-style controls: regenerate a fresh take, or approve and advance.
  const regenerate = useCallback(() => {
    if (!active?.spec) return;
    update(active.id, { spec: varySpec(active.spec) });
  }, [active, update]);

  const approve = useCallback(() => {
    if (!active) return;
    const i = WORK_STAGES.indexOf(active.stage);
    if (i < WORK_STAGES.length - 1) {
      update(active.id, { stage: WORK_STAGES[i + 1] });
    } else {
      update(active.id, { completed: true });
    }
  }, [active, update]);

  const exportModel = useCallback(
    async (fmt: ExportFormat) => {
      if (!active) return;
      setBusy(true);
      try {
        const { exportObject, downloadBlob } = await import("@/lib/exporters");
        if (active.modelUrl) {
          downloadBlob(await fetch(active.modelUrl).then((r) => r.blob()), "oneclick3d.glb");
          return;
        }
        if (active.spec) {
          const { buildJewelry } = await import("@/lib/jewelryMesh");
          downloadBlob(await exportObject(buildJewelry(active.spec), fmt), `oneclick3d.${fmt}`);
        }
      } finally {
        setBusy(false);
      }
    },
    [active],
  );

  // ---- Compose view: the single, Google-simple entry point. ----
  if (!active) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.heroTitle}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{t.heroSubtitle}</p>

          <div className="mt-8 rounded-xl border bg-card p-2 text-start shadow-sm">
            {referenceUrl && (
              <div className="flex items-center gap-3 border-b p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={referenceUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
                <span className="text-sm text-muted-foreground">{t.refAttached}</span>
                <button
                  onClick={() => setReferenceUrl(undefined)}
                  className="ms-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  {t.remove}
                </button>
              </div>
            )}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              placeholder={t.promptPlaceholder}
              rows={3}
              className="w-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between p-2">
              <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}>
                {t.attachImage}
              </Button>
              <Button onClick={generate} disabled={busy || (!prompt.trim() && !referenceUrl)}>
                {busy ? t.generating : t.generate}
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

          {jobs.length > 0 && (
            <button
              onClick={() => setActiveId(jobs[0].id)}
              className="mt-8 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {format(t.backToWorkspace, { n: jobs.length })}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- Workspace view: the approval-gated pipeline. ----
  const current = stageIndex(active.stage);
  const stageInfo = t.stages[active.stage];
  const isLast = WORK_STAGES.indexOf(active.stage) === WORK_STAGES.length - 1;
  const seats =
    active.stage === "stone-seats" && active.spec ? computeSeats(active.spec) : [];

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Projects panel */}
      <aside className="flex flex-col border-b lg:w-64 lg:border-e lg:border-b-0">
        <div className="flex items-center justify-between p-4">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t.projects}
          </span>
          <Button size="sm" variant="outline" onClick={() => setActiveId(undefined)}>
            {t.newProject}
          </Button>
        </div>
        <Separator />
        <ul className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:overflow-x-visible">
          {jobs.map((j) => (
            <li key={j.id}>
              <button
                onClick={() => setActiveId(j.id)}
                className={`w-full max-w-56 truncate rounded-md px-3 py-2 text-start text-sm transition lg:max-w-none ${
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
        <ModelViewer modelUrl={active.modelUrl} spec={active.spec} seats={seats} />
      </section>

      {/* Pipeline + inspector */}
      <aside className="flex flex-col border-t lg:w-80 lg:border-t-0 lg:border-s">
        <ol className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
          {WORK_STAGES.map((id) => {
            const idx = stageIndex(id);
            const isActive = id === active.stage;
            const done = idx < current;
            const locked = idx > current;
            return (
              <li key={id}>
                <button
                  onClick={() => !locked && update(active.id, { stage: id })}
                  disabled={locked}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-start text-sm transition ${
                    isActive ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent/50"
                  } ${locked ? "opacity-40" : ""}`}
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
                  {t.stages[id].label}
                </button>
              </li>
            );
          })}
        </ol>
        <Separator />

        <div className="flex-1 space-y-4 p-5">
          <div>
            <h2 className="text-sm font-semibold">{stageInfo.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{stageInfo.desc}</p>
          </div>

          {note && active.stage === "generate" && (
            <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{note}</p>
          )}

          {active.stage === "stone-seats" && seats.length > 0 && (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {seats.map((s, i) => (
                <li key={i} className="flex justify-between border-b py-1 last:border-b-0">
                  <span className="capitalize">{s.setting}</span>
                  <span>{s.diameterMm} mm</span>
                </li>
              ))}
            </ul>
          )}

          {isLast && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">{t.exportLabel}</span>
              <div className="flex gap-2">
                {EXPORT_FORMATS.map((fmt) => (
                  <Button
                    key={fmt}
                    variant="outline"
                    size="sm"
                    className="flex-1 uppercase"
                    disabled={busy}
                    onClick={() => exportModel(fmt)}
                  >
                    {fmt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tinder-style approval bar */}
        <div className="flex gap-2 border-t p-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={regenerate}
            disabled={busy || !active.spec}
          >
            ↻ {t.regenerate}
          </Button>
          {active.completed ? (
            <Button className="flex-1" disabled>
              ✓ {t.finished}
            </Button>
          ) : (
            <Button className="flex-1" onClick={approve}>
              {t.approve}
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
