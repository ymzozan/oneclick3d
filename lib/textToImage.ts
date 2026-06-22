/**
 * Text-to-image step of the generation pipeline.
 *
 * Turns a natural-language jewelry prompt into a clean product image that the
 * image-to-3D model can lift into a mesh. The image is produced by fal.ai's
 * hosted Flux model; everything downstream (image -> 3D) runs on our own
 * self-hosted service. Only ever imported from server code.
 */

const FAL_ENDPOINT = "https://fal.run/fal-ai/flux/schnell";

export function textToImageConfigured(): boolean {
  return Boolean(process.env.FAL_KEY);
}

/**
 * Wrap a raw user prompt so the generated image is a single, centred jewelry
 * object on a plain background — the ideal input for single-image 3D lifting.
 */
function toJewelryPrompt(prompt: string): string {
  return (
    `A single piece of fine jewelry: ${prompt}. ` +
    `Centered product photo, studio lighting, plain white seamless background, ` +
    `sharp focus, high detail, one object only, no hands, no model, no text.`
  );
}

/**
 * Generate a product image for a prompt and return it as a data URI, so the
 * downstream service receives raw bytes rather than a short-lived fal URL.
 */
export async function imageFromPrompt(prompt: string): Promise<string> {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new Error("FAL_KEY is not configured.");
  }

  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: toJewelryPrompt(prompt),
      image_size: "square_hd",
      num_images: 1,
      num_inference_steps: 4,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Image generation failed (${res.status}) ${detail}`.trim());
  }

  const data = (await res.json()) as { images?: { url?: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) {
    throw new Error("Image generation returned no image.");
  }

  const img = await fetch(url);
  if (!img.ok) {
    throw new Error(`Could not fetch generated image (${img.status}).`);
  }
  const buffer = Buffer.from(await img.arrayBuffer());
  const mime = img.headers.get("Content-Type") ?? "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}
