import { NextResponse } from "next/server";
import { getImageTo3DTask } from "@/lib/meshy";

/** Poll the status of an in-progress image-to-3D generation task. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const task = await getImageTo3DTask(taskId);
    return NextResponse.json(task);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch task.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
