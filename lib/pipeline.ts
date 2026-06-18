/**
 * OneClick3D production pipeline.
 *
 * Models the end-to-end workflow a jeweler follows to take a reference image
 * all the way to a casting-ready 3D model: image-to-3D generation, web preview,
 * AI-assisted stone seat detection, sculpting hand-off, parametric CAD and the
 * final sprueing ("koçanlama") step before casting.
 */

export type StageId =
  | "reference"
  | "generate"
  | "preview"
  | "stone-seats"
  | "sculpt"
  | "cad"
  | "sprue";

export interface PipelineStage {
  id: StageId;
  /** Short label shown in the stepper. */
  label: string;
  /** One-line description of what happens in this stage. */
  description: string;
  /** External tool the stage hands off to, if any. */
  tool?: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "reference",
    label: "Reference",
    description:
      "Upload a reference photo or sketch of the piece you want to create.",
  },
  {
    id: "generate",
    label: "Generate 3D",
    description: "Turn the reference into a base 3D mesh.",
    tool: "Meshy",
  },
  {
    id: "preview",
    label: "Preview",
    description: "Inspect the generated model directly in the browser.",
    tool: "three.js",
  },
  {
    id: "stone-seats",
    label: "Stone Seats",
    description:
      "Detect and map gemstone seats for flush (invisible) setting work.",
    tool: "AI",
  },
  {
    id: "sculpt",
    label: "Sculpt",
    description: "Export for organic, high-detail sculpting work.",
    tool: "ZBrush",
  },
  {
    id: "cad",
    label: "CAD",
    description: "Refine settings, galleries and mountings parametrically.",
    tool: "MatrixGold",
  },
  {
    id: "sprue",
    label: "Sprueing",
    description:
      "Lay out sprues and casting channels (koçan) ready for production.",
  },
];

export function stageIndex(id: StageId): number {
  return PIPELINE_STAGES.findIndex((s) => s.id === id);
}
