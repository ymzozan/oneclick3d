/**
 * Client for the self-hosted image-to-3D inference service.
 *
 * The service (see `inference/`) runs an open-source model on serverless GPUs
 * and returns a GLB mesh. Only ever imported from server code; the endpoint URL
 * is read from the environment.
 */

export function inferenceConfigured(): boolean {
  return Boolean(process.env.INFERENCE_URL);
}

/**
 * Generate a 3D mesh from a reference image and return the raw GLB bytes.
 * `image` may be a public URL or a data URI.
 */
export async function generateMeshFromImage(image: string): Promise<ArrayBuffer> {
  const endpoint = process.env.INFERENCE_URL;
  if (!endpoint) {
    throw new Error(
      "INFERENCE_URL is not configured. Deploy the inference service and set the URL.",
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_base64: image }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Inference failed (${res.status}) ${detail}`.trim());
  }

  return res.arrayBuffer();
}
