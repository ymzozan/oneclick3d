/**
 * Thin server-side client for the Meshy image-to-3D API.
 *
 * Only ever imported from server code (route handlers); the API key is read
 * from the environment and never exposed to the browser.
 */

const MESHY_BASE_URL = "https://api.meshy.ai/openapi/v1";

export interface MeshyTask {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED";
  progress: number;
  modelUrls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
  };
  thumbnailUrl?: string;
}

function apiKey(): string {
  const key = process.env.MESHY_API_KEY;
  if (!key) {
    throw new Error(
      "MESHY_API_KEY is not configured. Add it to your environment to enable 3D generation.",
    );
  }
  return key;
}

/**
 * Kick off an image-to-3D generation task and return its task id.
 * `imageUrl` may be a public URL or a data URI.
 */
export async function createImageTo3DTask(imageUrl: string): Promise<string> {
  const res = await fetch(`${MESHY_BASE_URL}/image-to-3d`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
      enable_pbr: true,
      should_remesh: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Meshy task creation failed (${res.status})`);
  }

  const data = (await res.json()) as { result: string };
  return data.result;
}

/**
 * Kick off a text-to-3D generation task from a natural-language prompt and
 * return its task id.
 */
export async function createTextTo3DTask(prompt: string): Promise<string> {
  const res = await fetch(`${MESHY_BASE_URL}/text-to-3d`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "preview",
      prompt,
      art_style: "realistic",
      should_remesh: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Meshy task creation failed (${res.status})`);
  }

  const data = (await res.json()) as { result: string };
  return data.result;
}

/** Fetch the current state of a generation task. */
export async function getImageTo3DTask(taskId: string): Promise<MeshyTask> {
  const res = await fetch(`${MESHY_BASE_URL}/image-to-3d/${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });

  if (!res.ok) {
    throw new Error(`Meshy task lookup failed (${res.status})`);
  }

  const data = (await res.json()) as {
    id: string;
    status: MeshyTask["status"];
    progress: number;
    model_urls?: Record<string, string>;
    thumbnail_url?: string;
  };

  return {
    id: data.id,
    status: data.status,
    progress: data.progress,
    modelUrls: data.model_urls,
    thumbnailUrl: data.thumbnail_url,
  };
}
