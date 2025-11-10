"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import AvatarModel from "./AvatarModel";
import { ZONES, SectionType } from "@/types/zones";

// Constantes de movimiento
const SPEED = 5;
const JUMP_FORCE = 8;
const ISO_ROTATION_Y = Math.PI / 4; // 45 grados para vista isométrica
const MODEL_VISUAL_OFFSET_Y = -0.7;

interface PlayerCharacterProps {
  onSectionChange?: (section: SectionType) => void;
}

export default function PlayerCharacter({ onSectionChange }: PlayerCharacterProps) {
  const keys = useKeyboardControls();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [currentAnimation, setCurrentAnimation] = useState<"idle" | "run" | "jump">("idle");
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [isJumping, setIsJumping] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionType>("Principal");
  const lastSpacePress = useRef(0);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const pos = rigidBodyRef.current.translation();
    const vel = rigidBodyRef.current.linvel();
    
    let forward = 0;
    let sideways = 0;

    // 1. Obtener intención de movimiento del usuario
    if (keys.w) forward = 1;
    if (keys.s) forward = -1;
    if (keys.a) sideways = -1;
    if (keys.d) sideways = 1;

    // 2. Detectar si está en el suelo (para permitir salto)
    const isGrounded = Math.abs(vel.y) < 0.5 && pos.y < 1.5;
    
    // 3. Manejar salto
    if (keys.space && isGrounded && !isJumping) {
      const now = Date.now();
      // Evitar doble salto (cooldown de 500ms)
      if (now - lastSpacePress.current > 500) {
        rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
        setCurrentAnimation("jump");
        setIsJumping(true);
        lastSpacePress.current = now;
      }
    }
    
    // Resetear estado de salto cuando toca el suelo
    if (isGrounded && isJumping) {
      setIsJumping(false);
    }

    // 4. Calcular dirección cruda (relativa a la pantalla)
    const direction = new THREE.Vector3(sideways, 0, forward);
    
    if (direction.length() > 0) {
      direction.normalize();
      
      // 5. Aplicar rotación isométrica
      // Rotamos el vector de movimiento para que coincida con la vista de la cámara
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ISO_ROTATION_Y);

      // 6. Aplicar velocidad al cuerpo de física (mantener velocidad Y)
      const velocity = direction.multiplyScalar(SPEED);
      rigidBodyRef.current.setLinvel({ x: velocity.x, y: vel.y, z: velocity.z }, true);

      // 7. Rotar el modelo para que mire en la dirección del movimiento
      const angle = Math.atan2(direction.x, direction.z);
      setRotation(angle);
      
      // 8. Cambiar a animación de correr (si no está saltando)
      if (!isJumping) {
        setCurrentAnimation("run");
      }
    } else {
      // Detener movimiento horizontal si no hay input (mantener velocidad Y)
      rigidBodyRef.current.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
      
      // Cambiar a animación idle (si no está saltando)
      if (!isJumping) {
        setCurrentAnimation("idle");
      }
    }
    
    // 9. Actualizar posición del modelo visual
    setPosition([pos.x, pos.y - 1, pos.z]); // Ajustar Y para que los pies toquen el suelo
    
    // 10. Detección de zonas
    let newSection: SectionType = "Principal";
    
    for (const zone of ZONES) {
      const distance = Math.sqrt(
        Math.pow(pos.x - zone.x, 2) + Math.pow(pos.z - zone.z, 2)
      );
      
      if (distance < zone.radius) {
        newSection = zone.name;
        break;
      }
    }
    
    // 11. Notificar cambio de sección
    if (newSection !== currentSection) {
      setCurrentSection(newSection);
      if (onSectionChange) {
        onSectionChange(newSection);
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="ball"
      mass={1}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]} // Evitar que el personaje se voltee
      linearDamping={0.5}
      angularDamping={0.5}
    >
      {/* Modelo del avatar con animaciones */}
      <AvatarModel 
        position={position}
        rotation={rotation}
        visualOffsetY={MODEL_VISUAL_OFFSET_Y}
        currentAnimation={currentAnimation}
      />
      
      {/* Colisionador invisible (esfera) */}
      <mesh visible={false}>
        <sphereGeometry args={[0.5]} />
      </mesh>
    </RigidBody>
  );
}

