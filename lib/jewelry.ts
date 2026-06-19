/**
 * Parametric jewelry engine.
 *
 * Turns a natural-language description into a structured specification that the
 * viewport renders procedurally. This gives an instant, fully client-side
 * generation path — distinct models from distinct prompts, with no external
 * service — alongside the self-hosted mesh generation used in production.
 */

export type Piece = "ring" | "pendant" | "bracelet";
export type StoneCut = "round" | "oval" | "emerald" | "princess";
export type Setting = "solitaire" | "pave" | "bezel" | "three-stone";

export interface JewelrySpec {
  piece: Piece;
  setting: Setting;
  cut: StoneCut;
  /** Number of accent stones (in addition to a center stone). */
  accents: number;
  /** Band thickness, world units. */
  bandWidth: number;
  /** Center stone size, world units. */
  stoneSize: number;
}

const DEFAULT: JewelrySpec = {
  piece: "ring",
  setting: "solitaire",
  cut: "round",
  accents: 0,
  bandWidth: 0.16,
  stoneSize: 0.34,
};

/** Derive a jewelry specification from a free-text prompt. */
export function specFromPrompt(prompt: string): JewelrySpec {
  const p = prompt.toLowerCase();
  const spec: JewelrySpec = { ...DEFAULT };

  if (/pendant|necklace|kolye/.test(p)) spec.piece = "pendant";
  else if (/bracelet|bangle|bilezik|tennis/.test(p)) spec.piece = "bracelet";

  if (/oval/.test(p)) spec.cut = "oval";
  else if (/emerald|baguette|baget/.test(p)) spec.cut = "emerald";
  else if (/princess|square|kare/.test(p)) spec.cut = "princess";

  if (/pav[eé]|pave|tas[ıi]?|micro/.test(p)) {
    spec.setting = "pave";
    spec.accents = 12;
  } else if (/bezel|çer[çc]eve|flush|gizli/.test(p)) {
    spec.setting = "bezel";
  } else if (/three[- ]?stone|trilogy|üçlü|3[- ]?stone/.test(p)) {
    spec.setting = "three-stone";
    spec.accents = 2;
  }

  if (/tennis/.test(p)) {
    spec.setting = "pave";
    spec.accents = 22;
    spec.stoneSize = 0.18;
  }

  if (/thin|ince|delicate|minimal/.test(p)) spec.bandWidth = 0.1;
  if (/thick|wide|geni[şs]|bold|chunky/.test(p)) spec.bandWidth = 0.24;

  const carat = p.match(/(\d+(?:\.\d+)?)\s*(?:ct|carat|karat)/);
  if (carat) {
    const ct = parseFloat(carat[1]);
    spec.stoneSize = Math.min(0.6, 0.24 + ct * 0.1);
  }

  return spec;
}

/**
 * Produce a fresh variation of a spec, keeping the overall concept but nudging
 * the details. Used by the "regenerate" action so each take feels distinct.
 */
export function varySpec(spec: JewelrySpec): JewelrySpec {
  const cuts: StoneCut[] = ["round", "oval", "emerald", "princess"];
  const settings: Setting[] = ["solitaire", "pave", "bezel", "three-stone"];
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const setting = pick(settings);
  return {
    ...spec,
    cut: pick(cuts),
    setting,
    accents: setting === "pave" ? 8 + Math.floor(Math.random() * 14) : setting === "three-stone" ? 2 : 0,
    bandWidth: Math.round((0.1 + Math.random() * 0.16) * 100) / 100,
    stoneSize: Math.round((0.26 + Math.random() * 0.2) * 100) / 100,
  };
}

/**
 * Positions of the gemstone seats for a spec, in the viewport's normalised
 * [0, 1] space (matching the stone-seat marker contract). Computed from the
 * generated geometry so highlights land exactly on the stones.
 */
export function seatPositions(spec: JewelrySpec): { x: number; y: number; z: number }[] {
  const seats: { x: number; y: number; z: number }[] = [];
  const center = { x: 0.5, y: 0.5 + 0.5, z: 0.5 };

  if (spec.setting === "three-stone") {
    seats.push({ x: 0.5, y: 0.92, z: 0.5 });
    seats.push({ x: 0.4, y: 0.88, z: 0.5 });
    seats.push({ x: 0.6, y: 0.88, z: 0.5 });
    return seats;
  }

  if (spec.setting === "pave") {
    const n = Math.min(spec.accents, 16);
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (0.25 + (0.5 * i) / Math.max(1, n - 1));
      seats.push({ x: 0.5 + Math.cos(a) * 0.45, y: 0.5 + Math.sin(a) * 0.45, z: 0.5 });
    }
    return seats;
  }

  seats.push({ x: center.x, y: 0.95, z: center.z });
  return seats;
}
