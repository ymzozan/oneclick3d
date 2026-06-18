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

interface ModelViewerProps {
  /** URL of a GLB model to display. When absent, a placeholder is shown. */
  modelUrl?: string;
  /** Detected stone seats to highlight on the model. */
  seats?: StoneSeat[];
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/** Placeholder geometry shown before a real model is generated. */
function PlaceholderRing() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.18, 48, 96]} />
        <meshStandardMaterial color="#d9d9d9" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

/** Markers that highlight where stones should be set. */
function SeatMarkers({ seats }: { seats: StoneSeat[] }) {
  return (
    <group>
      {seats.map((seat, i) => {
        // Map normalised [0,1] coordinates into the viewport's working space.
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

export default function ModelViewer({ modelUrl, seats = [] }: ModelViewerProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={["#f4f4f5"]} />
      <Suspense
        fallback={
          <Html center>
            <span className="text-sm text-neutral-400">Loading model…</span>
          </Html>
        }
      >
        <Stage environment="city" intensity={0.5} adjustCamera={1.1}>
          <Center>
            {modelUrl ? <LoadedModel url={modelUrl} /> : <PlaceholderRing />}
          </Center>
          {seats.length > 0 && <SeatMarkers seats={seats} />}
        </Stage>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} />
    </Canvas>
  );
}
