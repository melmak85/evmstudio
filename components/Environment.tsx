"use client";

import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export default function Environment() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <>
      {/* Suelo/Base con colisión estática */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh 
          ref={meshRef}
          position={[0, -0.5, 0]} 
          receiveShadow
        >
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial 
            color="#2a2a3e" 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </RigidBody>

      {/* Grid visual (opcional, para referencia) */}
      <gridHelper 
        args={[30, 30, "#4a4a6e", "#2a2a3e"]} 
        position={[0, 0.01, 0]}
      />
    </>
  );
}




