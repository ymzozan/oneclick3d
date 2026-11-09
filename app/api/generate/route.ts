import { NextResponse } from "next/server";
import { generateMeshFromImage, inferenceConfigured } from "@/lib/inference";
import { imageFromPrompt, textToImageConfigured } from "@/lib/textToImage";
import { canGenerate, readLimitedBody, reserveGeneration } from "@/lib/generation-access";

export const maxDuration = 120;

const maxBodyBytes = 4 * 1024 * 1024;
const imageData = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

export async function POST(request: Request) {
  if (!canGenerate(request)) {
    return NextResponse.json({ error: "Generation access required." }, { status: 401 });
  }

  let body: { imageUrl?: unknown; prompt?: unknown };
  try {
    body = JSON.parse((await readLimitedBody(request.body, maxBodyBytes)).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch (error) {
    return error instanceof RangeError
      ? NextResponse.json({ error: "Image is too large." }, { status: 413 })
      : NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { imageUrl, prompt } = body;
  if (imageUrl !== undefined && (typeof imageUrl !== "string" || !imageData.test(imageUrl))) {
    return NextResponse.json({ error: "Attach a PNG, JPEG or WebP image." }, { status: 400 });
  }
  if (typeof imageUrl !== "string" && (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2000)) {
    return NextResponse.json({ error: "Provide a prompt of up to 2000 characters." }, { status: 400 });
  }

  if (!inferenceConfigured() || (!imageUrl && !textToImageConfigured())) {
    return NextResponse.json({ error: "Generation service is unavailable." }, { status: 503 });
  }

  try {
    if (!(await reserveGeneration())) {
      return NextResponse.json({ error: "Hourly generation quota reached." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Generation quota is unavailable." }, { status: 503 });
  }

  try {
    const image = typeof imageUrl === "string" ? imageUrl : await imageFromPrompt(String(prompt));
    const glb = await generateMeshFromImage(image);
    return new Response(glb, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Disposition": 'inline; filename="model.glb"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not generate the model." }, { status: 502 });
  }
}
