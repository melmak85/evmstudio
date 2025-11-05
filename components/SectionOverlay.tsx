"use client";

import { SectionType } from "@/types/zones";

interface SectionOverlayProps {
  currentSection: SectionType;
}

interface SectionContent {
  title: string;
  description: string;
  items?: string[];
  icon?: string;
}

const SECTION_DATA: Record<SectionType, SectionContent> = {
  Principal: {
    title: "Bienvenido a mi Portfolio 3D",
    description: "Navega con WASD para explorar las diferentes secciones",
    icon: "🏠",
    items: [
      "Usa W/A/S/D para moverte",
      "Presiona Espacio para saltar",
      "Explora las zonas iluminadas",
    ],
  },
  Proyectos: {
    title: "Proyectos",
    description: "Mis trabajos y creaciones recientes",
    icon: "💼",
    items: [
      "Portfolio 3D Interactivo - Next.js + Three.js",
      "DApp de NFTs - Solidity + React",
      "Smart Contract Auditor - Python",
      "Dashboard Analytics - TypeScript",
    ],
  },
  Habilidades: {
    title: "Habilidades",
    description: "Tecnologías y herramientas que domino",
    icon: "⚡",
    items: [
      "Frontend: React, Next.js, TypeScript",
      "Blockchain: Solidity, Web3.js, Ethers.js",
      "3D: Three.js, React Three Fiber",
      "Backend: Node.js, Python",
    ],
  },
  Contacto: {
    title: "Contacto",
    description: "¿Quieres trabajar juntos? ¡Hablemos!",
    icon: "📧",
    items: [
      "Email: tu@email.com",
      "GitHub: github.com/tuusuario",
      "LinkedIn: linkedin.com/in/tuusuario",
      "Twitter: @tuusuario",
    ],
  },
};

export default function SectionOverlay({ currentSection }: SectionOverlayProps) {
  const content = SECTION_DATA[currentSection];

  return (
    <div className="fixed top-1/2 left-8 -translate-y-1/2 max-w-md z-10">
      {/* Card principal */}
      <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        {/* Header con icono */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{content.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{content.title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1" />
          </div>
        </div>

        {/* Descripción */}
        <p className="text-gray-300 mb-4">{content.description}</p>

        {/* Items */}
        {content.items && (
          <ul className="space-y-2">
            {content.items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-200 text-sm"
              >
                <span className="text-blue-400 mt-1">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Indicador de sección activa */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Sección actual
          </p>
          <p className="text-sm text-white font-semibold">{currentSection}</p>
        </div>
      </div>

      {/* Animación de pulso si no está en Principal */}
      {currentSection !== "Principal" && (
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl -z-10 animate-pulse" />
      )}
    </div>
  );
}


