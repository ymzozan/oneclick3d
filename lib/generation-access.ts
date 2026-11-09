import { createHash, timingSafeEqual } from "node:crypto";

const hourlyLimit = 10;
const windowSeconds = 60 * 60;
const reserve = `
local count = tonumber(redis.call("GET", KEYS[1]) or "0")
if count >= tonumber(ARGV[1]) then return 0 end
if count == 0 then
  redis.call("SET", KEYS[1], 1, "EX", ARGV[2])
else
  redis.call("INCR", KEYS[1])
end
return 1
`;

export function canGenerate(request: Request) {
  const expected = process.env.GENERATION_ACCESS_TOKEN;
  const provided = request.headers.get("Authorization");
  if (!expected || expected.length < 32 || !provided?.startsWith("Bearer ")) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(provided.slice(7)), digest(expected));
}

export async function reserveGeneration() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Generation quota is not configured");
  const response = await fetch(url, {
    method: "POST",
    redirect: "error",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", reserve, 1, "oneclick3d:generation-quota", hourlyLimit, windowSeconds]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Generation quota unavailable");
  const { result } = await response.json();
  if (result !== 0 && result !== 1) throw new Error("Invalid generation quota response");
  return result === 1;
}

export async function readLimitedBody(stream: ReadableStream<Uint8Array> | null, maxBytes: number) {
  if (!stream) throw new Error("Request body missing");
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new RangeError("Body too large");
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
}
