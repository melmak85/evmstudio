export type SectionType = "Principal" | "Proyectos" | "Habilidades" | "Contacto";

export interface Zone {
  name: SectionType;
  x: number;
  z: number;
  radius: number;
}

// Definición de las zonas del portfolio
export const ZONES: Zone[] = [
  {
    name: "Proyectos",
    x: 10,
    z: 0,
    radius: 4,
  },
  {
    name: "Habilidades",
    x: -10,
    z: 0,
    radius: 4,
  },
  {
    name: "Contacto",
    x: 0,
    z: 15,
    radius: 4,
  },
];

















