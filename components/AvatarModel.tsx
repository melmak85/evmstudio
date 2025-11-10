"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

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
  const MODEL_SCALE = 0.5;
  const MODEL_OFFSET: [number, number, number] = [0, 5, 0];

  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  
  // Cargar el modelo base
  const { scene: boyModel } = useGLTF("/models/boy_tpose.glb");

  const clonedModel = useMemo(() => {
    if (!boyModel) return null;
    const clone = SkeletonUtils.clone(boyModel);
    clone.scale.setScalar(MODEL_SCALE);
    clone.position.set(...MODEL_OFFSET);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [boyModel]);
  
  // Debug: Verificar modelo cargado
  useEffect(() => {
    if (clonedModel) {
      console.log("✅ Modelo cargado correctamente");
      console.log("📦 Tamaño del modelo:", clonedModel);
    } else {
      console.warn("⚠️ Modelo no cargado aún");
    }
  }, [clonedModel]);
  
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
  const { actions } = useAnimations(allAnimations, modelRef);

  const idleClipName = idleAnimations[0]?.name;
  const runClipName = runAnimations[0]?.name;
  const jumpClipName = jumpAnimations[0]?.name;
  
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
    Object.values(actions).forEach((action) => action?.fadeOut(0.3));
    
    // Reproducir la nueva animación
    let actionToPlay;
    
    const findAction = (fragments: string[], fallbackName?: string) => {
      if (!actions) return undefined;
      const key = Object.keys(actions).find((key) =>
        fragments.some((fragment) => key.toLowerCase().includes(fragment))
      );
      if (key && actions[key]) {
        return actions[key];
      }
      if (fallbackName && actions[fallbackName]) {
        return actions[fallbackName];
      }
      return undefined;
    };

    switch (currentAnimation) {
      case "run":
        actionToPlay = findAction(["run"], runClipName);
        break;
      case "jump":
        actionToPlay = findAction(["jump"], jumpClipName);
        break;
      case "idle":
      default:
        actionToPlay = findAction(["idle", "breath"], idleClipName);
        break;
    }
    
    const fallbackAction =
      !actionToPlay && idleClipName && actions[idleClipName]
        ? actions[idleClipName]
        : Object.values(actions)[0];

    (actionToPlay ?? fallbackAction)?.reset().fadeIn(0.3).play();
    
  }, [currentAnimation, actions, idleClipName, runClipName, jumpClipName]);
  
  // Actualizar rotación
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  }, [rotation]);
  
  return (
    <group ref={groupRef} position={position}>
      {clonedModel && (
        <primitive 
          ref={modelRef}
          object={clonedModel} 
        />
      )}
    </group>
  );
}

// Precargar los modelos
useGLTF.preload("/models/boy_tpose.glb");
useGLTF.preload("/models/idle_boy.glb");
useGLTF.preload("/models/run_boy.glb");
useGLTF.preload("/models/jump.glb");

