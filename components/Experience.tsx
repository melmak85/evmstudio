"use client";

import { useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import PlayerCharacter from "./PlayerCharacter";
import Environment from "./Environment";
import ZoneMarkers from "./ZoneMarkers";
import { SectionType } from "@/types/zones";

interface ExperienceProps {
  onSectionChange?: (section: SectionType) => void;
}

export default function Experience({ onSectionChange }: ExperienceProps) {
  // Hacer que la cámara siempre apunte al centro
  useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Luces */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4a90e2" />

      {/* Física con Rapier */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* Entorno (base de tiles) */}
        <Environment />
        
        {/* Marcadores de zonas */}
        <ZoneMarkers />
        
        {/* Personaje controlable */}
        <PlayerCharacter onSectionChange={onSectionChange} />
      </Physics>
    </>
  );
}

