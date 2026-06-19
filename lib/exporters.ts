/**
 * Serialise a three.js object to the formats a jeweler's toolchain expects:
 * GLB for general 3D, STL for CAD / printing (MatrixGold), OBJ for sculpting
 * (ZBrush). Runs entirely in the browser.
 */

import type * as THREE from "three";

export type ExportFormat = "glb" | "stl" | "obj";

export async function exportObject(
  object: THREE.Object3D,
  format: ExportFormat,
): Promise<Blob> {
  if (format === "glb") {
    const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");
    const result = await new GLTFExporter().parseAsync(object, { binary: true });
    return new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
  }

  if (format === "stl") {
    const { STLExporter } = await import("three/examples/jsm/exporters/STLExporter.js");
    const data = new STLExporter().parse(object, { binary: false });
    return new Blob([data], { type: "model/stl" });
  }

  const { OBJExporter } = await import("three/examples/jsm/exporters/OBJExporter.js");
  const data = new OBJExporter().parse(object);
  return new Blob([data], { type: "text/plain" });
}

/** Trigger a browser download for a generated blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
