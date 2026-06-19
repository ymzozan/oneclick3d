"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Html,
  Center,
} from "@react-three/drei";
import type { StoneSeat } from "@/app/api/stone-seats/route";
import type { JewelrySpec } from "@/lib/jewelry";
import { buildJewelry } from "@/lib/jewelryMesh";

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

/** Procedural jewelry built from a parametric specification. */
function ParametricPiece({ spec }: { spec: JewelrySpec }) {
  const object = useMemo(() => buildJewelry(spec), [spec]);
  return <primitive object={object} />;
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
