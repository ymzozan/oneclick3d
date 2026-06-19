"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Html,
  Center,
} from "@react-three/drei";
import type { StoneSeat } from "@/app/api/stone-seats/route";
import type { JewelrySpec, StoneCut } from "@/lib/jewelry";

interface ModelViewerProps {
  /** URL of a GLB model to display. Takes precedence over `spec`. */
  modelUrl?: string;
  /** Parametric spec rendered procedurally when no GLB is available. */
  spec?: JewelrySpec;
  /** Detected stone seats to highlight on the model. */
  seats?: StoneSeat[];
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const METAL = "#d4d4d4";
const GEM = "#ffffff";

/** A single faceted gemstone whose shape follows the requested cut. */
function Gem({
  cut,
  size,
  position,
}: {
  cut: StoneCut;
  size: number;
  position: [number, number, number];
}) {
  const material = (
    <meshStandardMaterial color={GEM} metalness={0.1} roughness={0} transparent opacity={0.92} />
  );
  return (
    <mesh position={position}>
      {cut === "round" && <octahedronGeometry args={[size, 0]} />}
      {cut === "oval" && <sphereGeometry args={[size, 24, 24]} />}
      {cut === "emerald" && <boxGeometry args={[size * 1.5, size, size * 1.05]} />}
      {cut === "princess" && <boxGeometry args={[size, size, size]} />}
      {material}
    </mesh>
  );
}

/** Procedural jewelry built from a parametric specification. */
function ParametricPiece({ spec }: { spec: JewelrySpec }) {
  const r = 1;
  const top: [number, number, number] = [0, r, 0];

  const ovalScale: [number, number, number] =
    spec.cut === "oval" ? [1.3, 0.7, 1] : [1, 1, 1];

  return (
    <group>
      {/* Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r, spec.bandWidth, 48, 96]} />
        <meshStandardMaterial color={METAL} metalness={1} roughness={0.16} />
      </mesh>

      {/* Center stone */}
      <group scale={ovalScale}>
        <Gem cut={spec.cut} size={spec.stoneSize} position={top} />
      </group>

      {/* Solitaire prongs */}
      {spec.setting === "solitaire" &&
        [0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const pr = spec.stoneSize * 0.8;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * pr, r, Math.sin(a) * pr]}
              rotation={[0, 0, 0]}
            >
              <cylinderGeometry args={[0.025, 0.025, spec.stoneSize * 1.2, 12]} />
              <meshStandardMaterial color={METAL} metalness={1} roughness={0.16} />
            </mesh>
          );
        })}

      {/* Bezel collar (flush / invisible setting) */}
      {spec.setting === "bezel" && (
        <mesh position={top} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[spec.stoneSize * 1.05, 0.05, 24, 48]} />
          <meshStandardMaterial color={METAL} metalness={1} roughness={0.16} />
        </mesh>
      )}

      {/* Three-stone side gems */}
      {spec.setting === "three-stone" &&
        [-1, 1].map((s) => (
          <Gem
            key={s}
            cut={spec.cut}
            size={spec.stoneSize * 0.6}
            position={[s * spec.stoneSize * 1.4, r - 0.05, 0]}
          />
        ))}

      {/* Pavé / tennis row along the front of the band */}
      {spec.setting === "pave" &&
        Array.from({ length: Math.min(spec.accents, 22) }).map((_, i, arr) => {
          const span = Math.PI * 0.9;
          const a = Math.PI / 2 - span / 2 + (span * i) / Math.max(1, arr.length - 1);
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, Math.sin(a) * r, spec.bandWidth]}
            >
              <octahedronGeometry args={[spec.stoneSize * 0.32, 0]} />
              <meshStandardMaterial color={GEM} metalness={0.1} roughness={0} />
            </mesh>
          );
        })}
    </group>
  );
}

/** Markers that highlight where stones should be set. */
function SeatMarkers({ seats }: { seats: StoneSeat[] }) {
  return (
    <group>
      {seats.map((seat, i) => {
        const x = (seat.position.x - 0.5) * 2;
        const y = (seat.position.y - 0.5) * 2;
        const z = (seat.position.z - 0.5) * 2;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#111111" />
            <Html distanceFactor={8} position={[0, 0.12, 0]}>
              <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white">
                {seat.diameterMm}mm · {seat.setting}
              </span>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}

export default function ModelViewer({ modelUrl, spec, seats = [] }: ModelViewerProps) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }} className="h-full w-full">
      <color attach="background" args={["#f4f4f5"]} />
      <Suspense
        fallback={
          <Html center>
            <span className="text-sm text-neutral-500">Loading model…</span>
          </Html>
        }
      >
        <Stage environment="city" intensity={0.5} adjustCamera={1.1}>
          <Center>
            {modelUrl ? (
              <LoadedModel url={modelUrl} />
            ) : spec ? (
              <ParametricPiece spec={spec} />
            ) : (
              <ParametricPiece
                spec={{
                  piece: "ring",
                  setting: "solitaire",
                  cut: "round",
                  accents: 0,
                  bandWidth: 0.16,
                  stoneSize: 0.34,
                }}
              />
            )}
          </Center>
          {seats.length > 0 && <SeatMarkers seats={seats} />}
        </Stage>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} />
    </Canvas>
  );
}
