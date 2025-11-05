"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";

interface AvatarModelProps {
  position?: [number, number, number];
  rotation?: number;
  currentAnimation: "idle" | "run" | "jump";
}

export default function AvatarModel({ 
  position = [0, 0, 0], 
  rotation = 0,
  currentAnimation = "idle" 
}: AvatarModelProps) {
  const groupRef = useRef<Group>(null);
  
  // Cargar el modelo base
  const { scene: boyModel } = useGLTF("/models/boy_tpose.glb");
  
  // Cargar todas las animaciones
  const { animations: idleAnimations } = useGLTF("/models/idle_boy.glb");
  const { animations: runAnimations } = useGLTF("/models/run_boy.glb");
  const { animations: jumpAnimations } = useGLTF("/models/jump.glb");
  
  // Combinar todas las animaciones
  const allAnimations = [
    ...idleAnimations,
    ...runAnimations,
    ...jumpAnimations,
  ];
  
  // Hook de animaciones
  const { actions, mixer } = useAnimations(allAnimations, groupRef);
  
  // Debug: Mostrar animaciones cargadas (solo una vez)
  useEffect(() => {
    if (allAnimations.length > 0) {
      console.group("🎬 Animaciones cargadas:");
      allAnimations.forEach((anim, index) => {
        console.log(`${index + 1}. "${anim.name}" - Duración: ${anim.duration.toFixed(2)}s`);
      });
      console.groupEnd();
      
      if (actions) {
        console.log("✅ Acciones disponibles:", Object.keys(actions));
      }
    }
  }, []); // Solo al montar
  
  // Cambiar animación cuando cambia currentAnimation
  useEffect(() => {
    if (!actions) return;
    
    // Detener todas las animaciones actuales
    Object.values(actions).forEach((action) => {
      action?.fadeOut(0.3);
    });
    
    // Reproducir la nueva animación
    let actionToPlay;
    
    switch (currentAnimation) {
      case "run":
        // Buscar la animación de run (puede tener diferentes nombres)
        actionToPlay = actions[Object.keys(actions).find(key => 
          key.toLowerCase().includes('run')
        ) || ''];
        break;
      case "jump":
        actionToPlay = actions[Object.keys(actions).find(key => 
          key.toLowerCase().includes('jump')
        ) || ''];
        break;
      case "idle":
      default:
        actionToPlay = actions[Object.keys(actions).find(key => 
          key.toLowerCase().includes('idle')
        ) || ''];
        break;
    }
    
    if (actionToPlay) {
      actionToPlay.reset().fadeIn(0.3).play();
    }
    
  }, [currentAnimation, actions]);
  
  // Actualizar rotación
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  }, [rotation]);
  
  return (
    <group ref={groupRef} position={position}>
      <primitive 
        object={boyModel.clone()} 
        scale={0.01} // Ajustar escala si es necesario
      />
    </group>
  );
}

// Precargar los modelos
useGLTF.preload("/models/boy_tpose.glb");
useGLTF.preload("/models/idle_boy.glb");
useGLTF.preload("/models/run_boy.glb");
useGLTF.preload("/models/jump.glb");

