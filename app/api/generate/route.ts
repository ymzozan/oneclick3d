import { NextResponse } from "next/server";
import { createImageTo3DTask, createTextTo3DTask } from "@/lib/meshy";

/**
 * Start a 3D generation task from either a text prompt or a reference image.
 * Body: { prompt?: string; imageUrl?: string }
 *  - `imageUrl` may be a public URL or a data URI.
 *  - When both are provided, the image takes precedence.
 */
export async function POST(request: Request) {
  let prompt: string | undefined;
  let imageUrl: string | undefined;

  try {
    const body = (await request.json()) as {
      prompt?: string;
      imageUrl?: string;
    };
    prompt = body.prompt?.trim();
    imageUrl = body.imageUrl;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!prompt && !imageUrl) {
    return NextResponse.json(
      { error: "Provide a prompt or a reference image." },
      { status: 400 },
    );
  }

  try {
    const taskId = imageUrl
      ? await createImageTo3DTask(imageUrl)
      : await createTextTo3DTask(prompt!);
    return NextResponse.json({ taskId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start generation.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
