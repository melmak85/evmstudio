"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { AnimationAction, Group, LoopRepeat } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

interface AvatarModelProps {
  position?: [number, number, number];
  rotation?: number;
  visualOffsetY?: number;
  currentAnimation: "idle" | "run" | "jump";
}

export default function AvatarModel({ 
  position = [0, 0, 0], 
  rotation = 0,
  visualOffsetY = 0,
  currentAnimation = "idle" 
}: AvatarModelProps) {
  const MODEL_SCALE = 0.5;

  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const activeActionRef = useRef<string | null>(null);
  
  // Cargar el modelo base
  const { scene: boyModel } = useGLTF("/models/boy_tpose.glb");

  const clonedModel = useMemo(() => {
    if (!boyModel) return null;
    const clone = SkeletonUtils.clone(boyModel);
    clone.scale.setScalar(MODEL_SCALE);
    clone.position.set(0, visualOffsetY, 0);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [boyModel, visualOffsetY]);
  
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

  const allAnimations = useMemo(
    () => [
      ...(idleAnimations ?? []),
      ...(runAnimations ?? []),
      ...(jumpAnimations ?? []),
    ],
    [idleAnimations, runAnimations, jumpAnimations]
  );
  
  // Hook de animaciones
  const { actions, mixer } = useAnimations(allAnimations, modelRef);

  const resolveClipName = (
    fragments: string[],
    fallbacks: (string | undefined)[] = []
  ) => {
    const lowerFragments = fragments.map((fragment) => fragment.toLowerCase());

    const byFragment = allAnimations.find((clip) =>
      lowerFragments.some((fragment) =>
        clip.name.toLowerCase().includes(fragment)
      )
    )?.name;

    return (
      byFragment ??
      fallbacks.find(
        (name) => name && allAnimations.some((clip) => clip.name === name)
      )
    );
  };

  const idleClipName = resolveClipName(["idle", "breath"], [
    idleAnimations?.[0]?.name,
    allAnimations[0]?.name,
  ]);
  const runClipName = resolveClipName(["run"], [runAnimations?.[0]?.name]);
  const jumpClipName = resolveClipName(["jump"], [jumpAnimations?.[0]?.name]);
  
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

    const findAction = (clipName?: string, fragments: string[] = []) => {
      if (!actions) return undefined;
      if (clipName && actions[clipName]) {
        return { name: clipName, action: actions[clipName] as AnimationAction };
      }

      const key = Object.keys(actions).find((key) =>
        fragments.some((fragment) => key.toLowerCase().includes(fragment))
      );

      return key && actions[key]
        ? { name: key, action: actions[key] as AnimationAction }
        : undefined;
    };

    const startAction = (name: string, nextAction: AnimationAction) => {
      const previousName = activeActionRef.current;
      const previousAction =
        previousName && actions?.[previousName]
          ? (actions[previousName] as AnimationAction)
          : undefined;

      if (previousName === name && previousAction) {
        if (previousAction.paused) {
          previousAction.paused = false;
          previousAction.play();
        }
        return true;
      }

      nextAction.reset();
      nextAction.setLoop(LoopRepeat, Infinity);
      nextAction.clampWhenFinished = false;
      nextAction.enabled = true;
      nextAction.paused = false;
      nextAction.play();

      if (previousAction && previousAction !== nextAction) {
        previousAction.crossFadeTo(nextAction, 0.2, false);
      }

      activeActionRef.current = name;
      return true;
    };

    const playInOrder = (
      candidates: Array<{ name?: string; fragments: string[] }>
    ) => {
      for (const candidate of candidates) {
        const result = findAction(candidate.name, candidate.fragments);
        if (result) {
          const { name, action } = result;
          startAction(name, action);
          return true;
        }
      }
      return false;
    };

    if (currentAnimation === "run") {
      if (
        playInOrder([
          { name: runClipName, fragments: ["run"] },
          { name: idleClipName, fragments: ["idle", "breath"] },
        ])
      ) {
        return;
      }
    } else if (currentAnimation === "jump") {
      if (
        playInOrder([
          { name: jumpClipName, fragments: ["jump"] },
          { name: idleClipName, fragments: ["idle", "breath"] },
        ])
      ) {
        return;
      }
    } else {
      if (
        playInOrder([
          { name: idleClipName, fragments: ["idle", "breath"] },
          { name: runClipName, fragments: ["run"] },
          { name: jumpClipName, fragments: ["jump"] },
        ])
      ) {
        return;
      }
    }

    playInOrder(
      Object.keys(actions).map((key) => ({
        name: key,
        fragments: [key.toLowerCase()],
      }))
    );
  }, [
    actions,
    mixer,
    currentAnimation,
    idleClipName,
    runClipName,
    jumpClipName,
  ]);
  
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

