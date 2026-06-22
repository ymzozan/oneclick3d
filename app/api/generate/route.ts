import { NextResponse } from "next/server";
import { generateMeshFromImage, inferenceConfigured } from "@/lib/inference";
import { imageFromPrompt, textToImageConfigured } from "@/lib/textToImage";

// Reference images and GLB meshes can be a few megabytes, and a prompt-only
// request also pays for the text-to-image step; allow the function enough time
// to run the full pipeline and stream the result back.
export const maxDuration = 120;

/**
 * Generate a 3D mesh and return the GLB binary directly.
 *
 * Body: { imageUrl?: string; prompt?: string }
 *
 * - With an image, the self-hosted inference service lifts it straight to 3D.
 * - With only a prompt, the prompt is first turned into a reference image
 *   (text-to-image) and then lifted to 3D — so typing "bee pendant" produces a
 *   bee pendant, not a generic sample.
 */
export async function POST(request: Request) {
  let imageUrl: string | undefined;
  let prompt: string | undefined;

  try {
    const body = (await request.json()) as { imageUrl?: string; prompt?: string };
    imageUrl = body.imageUrl;
    prompt = body.prompt;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!inferenceConfigured()) {
    return NextResponse.json(
      { error: "Inference service is not configured." },
      { status: 503 },
    );
  }

  // Resolve a reference image: use the one supplied, or synthesise one from the
  // prompt via the text-to-image step.
  let image = imageUrl;
  if (!image) {
    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Provide a prompt or a reference image." },
        { status: 400 },
      );
    }
    if (!textToImageConfigured()) {
      return NextResponse.json(
        { error: "Text-to-3D is not available yet — attach a reference image." },
        { status: 422 },
      );
    }
    try {
      image = await imageFromPrompt(prompt);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate image.";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  try {
    const glb = await generateMeshFromImage(image);
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
