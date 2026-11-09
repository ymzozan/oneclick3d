/**
 * Client for the self-hosted image-to-3D inference service.
 *
 * The service (see `inference/`) runs an open-source model on serverless GPUs
 * and returns a GLB mesh. Only ever imported from server code; the endpoint URL
 * is read from the environment.
 */

export function inferenceConfigured(): boolean {
  return Boolean(process.env.INFERENCE_URL && process.env.MODAL_PROXY_TOKEN);
}

/**
 * Generate a 3D mesh from a reference image and return the raw GLB bytes.
 * `image` is a validated image data URI.
 */
export async function generateMeshFromImage(image: string): Promise<ArrayBuffer> {
  const endpoint = process.env.INFERENCE_URL;
  const token = process.env.MODAL_PROXY_TOKEN;
  if (!endpoint || !token) {
    throw new Error(
      "Inference is not configured.",
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    redirect: "error",
    signal: AbortSignal.timeout(65_000),
    body: JSON.stringify({ image_base64: image }),
  });

  if (!res.ok) {
    throw new Error("Inference failed.");
  }

  return res.arrayBuffer();
}
