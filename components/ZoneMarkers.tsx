"use client";

import { ZONES } from "@/types/zones";
import { Text } from "@react-three/drei";

export default function ZoneMarkers() {
  return (
    <>
      {ZONES.map((zone) => (
        <group key={zone.name} position={[zone.x, 0.1, zone.z]}>
          {/* Círculo indicador de zona */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[zone.radius - 0.2, zone.radius, 32]} />
            <meshStandardMaterial
              color="#4a90e2"
              transparent
              opacity={0.3}
              emissive="#4a90e2"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Círculo interior más brillante */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <circleGeometry args={[zone.radius - 0.5, 32]} />
            <meshStandardMaterial
              color="#4a90e2"
              transparent
              opacity={0.1}
              emissive="#4a90e2"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Texto 3D con nombre de la zona */}
          <Text
            position={[0, 0.2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {zone.name}
          </Text>
        </group>
      ))}
    </>
  );
}
















