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
const JUMP_ANIMATION_DURATION_MS = 2400;
const ISO_ROTATION_Y = Math.PI / 4; // 45 grados para vista isométrica
const MODEL_VISUAL_OFFSET_Y = -0.8;

interface PlayerCharacterProps {
  onSectionChange?: (section: SectionType) => void;
}

export default function PlayerCharacter({ onSectionChange }: PlayerCharacterProps) {
  const keys = useKeyboardControls();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [currentAnimation, setCurrentAnimation] =
    useState<"idle" | "run" | "jump">("idle");
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [isJumping, setIsJumping] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionType>("Principal");
  const lastSpacePress = useRef(0);
  const hasLandedRef = useRef(false);

  const lastJumpEndRef = useRef(0);
  const lastJumpStartRef = useRef(0);

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const pos = rigidBodyRef.current.translation();
    const vel = rigidBodyRef.current.linvel();
    const velX = vel.x;
    const velY = vel.y;
    const velZ = vel.z;
    const horizontalSpeed = Math.hypot(velX, velZ);
    
    let forward = 0;
    let sideways = 0;

    // 1. Obtener intención de movimiento del usuario
    if (keys.w) forward = -1;
    if (keys.s) forward = 1;
    if (keys.a) sideways = -1;
    if (keys.d) sideways = 1;

    const isGrounded = Math.abs(velY) < 0.4 && pos.y <= 1.05;
    
    if (keys.space && isGrounded && !isJumping) {
      const now = Date.now();
      // Evitar doble salto (cooldown de 500ms)
      if (now - lastSpacePress.current > 500 && now - lastJumpEndRef.current > 3000) {
        rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
        setCurrentAnimation("jump");
        setIsJumping(true);
        hasLandedRef.current = false;
        lastSpacePress.current = now;
        lastJumpStartRef.current = now;
      }
    }
    
    if (!isGrounded && isJumping) {
      hasLandedRef.current = false;
    }

    const jumpElapsed =
      lastJumpStartRef.current > 0 ? Date.now() - lastJumpStartRef.current : 0;
    if (
      isJumping &&
      isGrounded &&
      Math.abs(velY) < 0.15 &&
      jumpElapsed >= JUMP_ANIMATION_DURATION_MS
    ) {
      setIsJumping(false);
      hasLandedRef.current = true;
      lastJumpEndRef.current = Date.now();
      lastJumpStartRef.current = 0;
    }

    // 4. Calcular dirección cruda (relativa a la pantalla)
    const direction = new THREE.Vector3(sideways, 0, forward);
    const hasMoveInput = forward !== 0 || sideways !== 0;
    
    const isMoving = hasMoveInput && direction.length() > 0;

    let nextAnimation: "idle" | "run" | "jump" = currentAnimation;

    if (isJumping || !isGrounded) {
      nextAnimation = "jump";
    } else if (isMoving && hasMoveInput) {
      direction.normalize();
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ISO_ROTATION_Y);

      const velocity = direction.multiplyScalar(SPEED);
      rigidBodyRef.current.setLinvel({ x: velocity.x, y: velY, z: velocity.z }, true);

      const angle = Math.atan2(direction.x, direction.z);
      setRotation(angle);

      nextAnimation = "run";
    } else {
      rigidBodyRef.current.setLinvel({ x: 0, y: velY, z: 0 }, true);
      nextAnimation = "idle";
    }

    if (nextAnimation !== currentAnimation) {
      setCurrentAnimation(nextAnimation);
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

