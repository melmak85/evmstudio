/**
 * Utilidad para inspeccionar modelos GLB y ver información de animaciones
 * Útil para debugging - ejecutar en el navegador console
 */

import * as THREE from "three";

export function inspectGLTF(gltf: any) {
  console.group("🔍 Inspección de Modelo GLTF");
  
  console.log("📦 Scene:", gltf.scene);
  console.log("🎬 Animaciones encontradas:", gltf.animations.length);
  
  if (gltf.animations.length > 0) {
    console.group("📋 Lista de animaciones:");
    gltf.animations.forEach((anim: THREE.AnimationClip, index: number) => {
      console.log(`${index + 1}. "${anim.name}" - Duración: ${anim.duration.toFixed(2)}s`);
    });
    console.groupEnd();
  }
  
  // Buscar bones/skeleton
  let skeletonFound = false;
  gltf.scene.traverse((child: any) => {
    if (child.isSkeleton || child.type === "Bone") {
      if (!skeletonFound) {
        console.log("🦴 Skeleton encontrado!");
        skeletonFound = true;
      }
    }
  });
  
  console.groupEnd();
}

// Hook para usar en componentes
export function useModelInspector() {
  return (gltf: any, modelName: string) => {
    console.log(`\n🎯 Inspeccionando: ${modelName}`);
    inspectGLTF(gltf);
  };
}















