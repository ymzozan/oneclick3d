/**
 * Builds the three.js geometry for a parametric jewelry specification.
 *
 * This is the single source of truth for the procedural piece: the viewport
 * renders the returned group, and the exporters serialise the very same group
 * to GLB / STL / OBJ — so what a maker previews is exactly what they download.
 */

import * as THREE from "three";
import type { JewelrySpec, StoneCut } from "@/lib/jewelry";

const METAL_COLOR = 0xd4d4d4;
const GEM_COLOR = 0xffffff;

function metalMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: METAL_COLOR,
    metalness: 1,
    roughness: 0.16,
  });
}

function gemMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: GEM_COLOR,
    metalness: 0.1,
    roughness: 0,
    transparent: true,
    opacity: 0.92,
  });
}

function gemGeometry(cut: StoneCut, size: number): THREE.BufferGeometry {
  switch (cut) {
    case "oval":
      return new THREE.SphereGeometry(size, 24, 24);
    case "emerald":
      return new THREE.BoxGeometry(size * 1.5, size, size * 1.05);
    case "princess":
      return new THREE.BoxGeometry(size, size, size);
    case "round":
    default:
      return new THREE.OctahedronGeometry(size, 0);
  }
}

export function buildJewelry(spec: JewelrySpec): THREE.Group {
  const group = new THREE.Group();
  const r = 1;

  // Band
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(r, spec.bandWidth, 48, 96),
    metalMaterial(),
  );
  band.rotation.x = Math.PI / 2;
  group.add(band);

  // Center stone
  const centerStone = new THREE.Mesh(gemGeometry(spec.cut, spec.stoneSize), gemMaterial());
  centerStone.position.set(0, r, 0);
  if (spec.cut === "oval") centerStone.scale.set(1.3, 0.7, 1);
  group.add(centerStone);

  // Solitaire prongs
  if (spec.setting === "solitaire") {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const pr = spec.stoneSize * 0.8;
      const prong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, spec.stoneSize * 1.2, 12),
        metalMaterial(),
      );
      prong.position.set(Math.cos(a) * pr, r, Math.sin(a) * pr);
      group.add(prong);
    }
  }

  // Bezel collar (flush / invisible setting)
  if (spec.setting === "bezel") {
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(spec.stoneSize * 1.05, 0.05, 24, 48),
      metalMaterial(),
    );
    collar.position.set(0, r, 0);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);
  }

  // Three-stone side gems
  if (spec.setting === "three-stone") {
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(gemGeometry(spec.cut, spec.stoneSize * 0.6), gemMaterial());
      side.position.set(s * spec.stoneSize * 1.4, r - 0.05, 0);
      group.add(side);
    }
  }

  // Pavé / tennis row along the front of the band
  if (spec.setting === "pave") {
    const count = Math.min(spec.accents, 22);
    const span = Math.PI * 0.9;
    for (let i = 0; i < count; i++) {
      const a = Math.PI / 2 - span / 2 + (span * i) / Math.max(1, count - 1);
      const accent = new THREE.Mesh(
        new THREE.OctahedronGeometry(spec.stoneSize * 0.32, 0),
        gemMaterial(),
      );
      accent.position.set(Math.cos(a) * r, Math.sin(a) * r, spec.bandWidth);
      group.add(accent);
    }
  }

  return group;
}
