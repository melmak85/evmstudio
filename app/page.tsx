"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SectionType } from "@/types/zones";

// Importar Scene dinámicamente para evitar problemas con SSR
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <p className="text-white text-xl">Cargando experiencia 3D...</p>
    </div>
  ),
});

// Importar SectionOverlay dinámicamente
const SectionOverlay = dynamic(() => import("@/components/SectionOverlay"), {
  ssr: false,
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState<SectionType>("Principal");

  return (
    <main className="w-full h-screen relative">
      <Scene onSectionChange={setCurrentSection} />
      
      {/* Overlay con información de la sección actual */}
      <SectionOverlay currentSection={currentSection} />
      
      {/* Instrucciones de control */}
      <div className="fixed bottom-8 left-8 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-white/10 z-10">
        <h3 className="font-bold mb-2">Controles</h3>
        <div className="space-y-1 text-sm">
          <p><kbd className="px-2 py-1 bg-white/10 rounded">W</kbd> Adelante</p>
          <p><kbd className="px-2 py-1 bg-white/10 rounded">S</kbd> Atrás</p>
          <p><kbd className="px-2 py-1 bg-white/10 rounded">A</kbd> Izquierda</p>
          <p><kbd className="px-2 py-1 bg-white/10 rounded">D</kbd> Derecha</p>
          <p><kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Saltar</p>
        </div>
      </div>
    </main>
  );
}

