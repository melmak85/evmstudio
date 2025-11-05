"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { SectionType } from "@/types/zones";

// Posición de cámara isométrica fija
const CAMERA_POSITION: [number, number, number] = [20, 20, 20];

interface SceneProps {
  onSectionChange?: (section: SectionType) => void;
}

export default function Scene({ onSectionChange }: SceneProps) {
  return (
    <Canvas
      camera={{ 
        position: CAMERA_POSITION, 
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      shadows
      style={{ 
        width: "100vw", 
        height: "100vh",
        background: "linear-gradient(to bottom, #1a1a2e 0%, #0f0f1e 100%)"
      }}
    >
      <Experience onSectionChange={onSectionChange} />
    </Canvas>
  );
}

