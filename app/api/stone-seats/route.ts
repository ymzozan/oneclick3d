import { NextResponse } from "next/server";

/**
 * Stone seat detection for flush ("invisible") setting work.
 *
 * Given a model, this endpoint returns the recommended gemstone seat positions
 * so the setter can plan the layout before any metal is cut. The detection is
 * delegated to a vision model; until the model integration is wired up, the
 * endpoint returns a structured placeholder so the UI can be developed against
 * a stable contract.
 */

export interface StoneSeat {
  /** Normalised position on the model surface, range [0, 1] per axis. */
  position: { x: number; y: number; z: number };
  /** Estimated stone diameter in millimetres. */
  diameterMm: number;
  /** Suggested setting style. */
  setting: "flush" | "pave" | "prong" | "bezel";
  /** Model confidence in this seat, range [0, 1]. */
  confidence: number;
}

export interface StoneSeatResult {
  seats: StoneSeat[];
  /** True once a real vision model is producing the result. */
  detected: boolean;
}

export async function POST(request: Request) {
  let modelUrl: string | undefined;

  try {
    const body = (await request.json()) as { modelUrl?: string };
    modelUrl = body.modelUrl;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!modelUrl) {
    return NextResponse.json({ error: "modelUrl is required." }, { status: 400 });
  }

  // Placeholder layout until the vision model integration is enabled.
  const result: StoneSeatResult = {
    detected: false,
    seats: [
      { position: { x: 0.5, y: 0.62, z: 0.5 }, diameterMm: 3.0, setting: "flush", confidence: 0.0 },
      { position: { x: 0.42, y: 0.58, z: 0.48 }, diameterMm: 1.5, setting: "pave", confidence: 0.0 },
      { position: { x: 0.58, y: 0.58, z: 0.48 }, diameterMm: 1.5, setting: "pave", confidence: 0.0 },
    ],
  };

  return NextResponse.json(result);
}
