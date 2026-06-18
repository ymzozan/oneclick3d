import { NextResponse } from "next/server";
import { generateMeshFromImage, inferenceConfigured } from "@/lib/inference";

// Reference images and GLB meshes can be a few megabytes; allow the function
// enough time to forward them to the GPU service and stream the result back.
export const maxDuration = 120;

/**
 * Generate a 3D mesh from a reference image using the self-hosted inference
 * service. Returns the GLB binary directly.
 *
 * Body: { imageUrl: string } — a public URL or data URI.
 *
 * Text-to-3D from a bare prompt is handled by a separate pipeline that is not
 * wired up yet; prompt-only requests return 422 so the client can fall back to
 * a sample piece.
 */
export async function POST(request: Request) {
  let imageUrl: string | undefined;

  try {
    const body = (await request.json()) as { imageUrl?: string };
    imageUrl = body.imageUrl;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Text-to-3D is not available yet — attach a reference image." },
      { status: 422 },
    );
  }

  if (!inferenceConfigured()) {
    return NextResponse.json(
      { error: "Inference service is not configured." },
      { status: 503 },
    );
  }

  try {
    const glb = await generateMeshFromImage(imageUrl);
    return new Response(glb, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Disposition": 'inline; filename="model.glb"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate mesh.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
