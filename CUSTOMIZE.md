# 🎨 Guía de Personalización

Esta guía te ayudará a personalizar tu portfolio 3D.

## 📝 Contenido de las Secciones

### Editar textos y descripciones

Abre `components/SectionOverlay.tsx` y modifica el objeto `SECTION_DATA`:

```typescript
const SECTION_DATA: Record<SectionType, SectionContent> = {
  Principal: {
    title: "Tu Título Aquí",
    description: "Tu descripción personalizada",
    icon: "🏠", // Cambia el emoji
    items: [
      "Tu mensaje 1",
      "Tu mensaje 2",
      "Tu mensaje 3",
    ],
  },
  Proyectos: {
    title: "Mis Proyectos",
    description: "Mis mejores trabajos",
    icon: "💼",
    items: [
      "Proyecto 1 - Descripción breve",
      "Proyecto 2 - Descripción breve",
      "Proyecto 3 - Descripción breve",
    ],
  },
  // ... más secciones
};
```

## 🗺️ Posición de las Zonas

### Mover zonas en el mapa

Abre `types/zones.ts` y ajusta las coordenadas:

```typescript
export const ZONES: Zone[] = [
  {
    name: "Proyectos",
    x: 10,      // ← Cambiar posición X (izquierda/derecha)
    z: 0,       // ← Cambiar posición Z (adelante/atrás)
    radius: 4,  // ← Cambiar tamaño de la zona
  },
  // ... más zonas
];
```

### Mapa de coordenadas
```
        Z+
         ↑
         |
    (-10,0) [Habilidades]
         |
-X ←-----+-----→ +X
         |
    (10,0) [Proyectos]
         |
    (0,15) [Contacto]
         ↓
        Z-
```

### Añadir nueva zona

1. **Actualiza el tipo** en `types/zones.ts`:
```typescript
export type SectionType = "Principal" | "Proyectos" | "Habilidades" | "Contacto" | "TuNuevaSeccion";
```

2. **Añade la zona**:
```typescript
export const ZONES: Zone[] = [
  // ... zonas existentes
  {
    name: "TuNuevaSeccion",
    x: 5,
    z: -10,
    radius: 4,
  },
];
```

3. **Añade el contenido** en `components/SectionOverlay.tsx`:
```typescript
const SECTION_DATA: Record<SectionType, SectionContent> = {
  // ... secciones existentes
  TuNuevaSeccion: {
    title: "Tu Sección",
    description: "Descripción",
    icon: "🎯",
    items: ["Item 1", "Item 2"],
  },
};
```

## 🎮 Ajustes de Gameplay

### Velocidad de movimiento

En `components/PlayerCharacter.tsx`:
```typescript
const SPEED = 5;        // Aumenta = más rápido, disminuye = más lento
const JUMP_FORCE = 8;   // Aumenta = salta más alto
```

### Sensibilidad del salto

```typescript
const isGrounded = Math.abs(vel.y) < 0.5 && pos.y < 1.5;
//                                    ↑         ↑
//                          Velocidad Y   Altura máxima
```

## 🎨 Colores y Estilos

### Color de las zonas

En `components/ZoneMarkers.tsx`:
```typescript
<meshStandardMaterial
  color="#4a90e2"  // ← Cambia este color (hex)
  emissive="#4a90e2"
  emissiveIntensity={0.5}  // ← Brillo (0-1)
/>
```

### Estilos del overlay

En `components/SectionOverlay.tsx`:
```typescript
<div className="bg-black/80 ...">  // ← Cambia opacidad /80 = 80%
```

O crea estilos personalizados en `app/globals.css`:
```css
.custom-overlay {
  background: rgba(10, 10, 30, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(74, 144, 226, 0.3);
}
```

## 🎭 Modelo 3D

### Ajustar escala del personaje

En `components/AvatarModel.tsx`:
```typescript
<primitive 
  object={boyModel.clone()} 
  scale={0.01}  // ← Prueba: 0.1, 1, 0.001
/>
```

### Ajustar altura del personaje

En `components/PlayerCharacter.tsx`:
```typescript
setPosition([pos.x, pos.y - 0.5, pos.z]);
//                          ↑
//                   Ajusta este valor
```

Si el personaje:
- **Flota**: Aumenta el valor negativo (-1, -1.5, etc.)
- **Está enterrado**: Disminuye el valor (-0.1, 0, etc.)

### Rotación del modelo

Si el personaje mira hacia atrás:
```typescript
setRotation(angle + Math.PI);  // Añade 180 grados
```

Si mira en diagonal:
```typescript
setRotation(angle + Math.PI / 2);  // Añade 90 grados
```

## 🌍 Entorno

### Tamaño del suelo

En `components/Environment.tsx`:
```typescript
<boxGeometry args={[30, 1, 30]} />
//                  ↑   ↑  ↑
//                  X   Y  Z
```

### Color del suelo

```typescript
<meshStandardMaterial 
  color="#2a2a3e"  // ← Color base
  roughness={0.8}  // ← Rugosidad (0=liso, 1=áspero)
  metalness={0.2}  // ← Metalicidad (0-1)
/>
```

### Grid de referencia

```typescript
<gridHelper 
  args={[30, 30, "#4a4a6e", "#2a2a3e"]}
  //     ↑   ↑      ↑          ↑
  //  Tamaño|   Color1   Color2
  //      Divisiones
/>
```

## 💡 Iluminación

En `components/Experience.tsx`:

### Luz ambiental
```typescript
<ambientLight intensity={0.5} />  // ← 0-1 (más alto = más brillante)
```

### Luz direccional (sol)
```typescript
<directionalLight
  position={[10, 20, 10]}  // ← Posición de la luz
  intensity={1}            // ← Intensidad
  color="#ffffff"          // ← Color (opcional)
/>
```

### Luz puntual
```typescript
<pointLight 
  position={[-10, 10, -10]} 
  intensity={0.5} 
  color="#4a90e2"  // ← Color de ambiente
/>
```

## 📱 Responsive

### Ajustar overlay para mobile

En `components/SectionOverlay.tsx`:
```typescript
<div className="fixed top-1/2 left-8 -translate-y-1/2 max-w-md
                md:left-8 sm:left-4 sm:max-w-sm">
//              ↑ Desktop  ↑ Mobile
```

## 🎬 Animaciones

### Velocidad de transición

En `components/AvatarModel.tsx`:
```typescript
action?.fadeOut(0.3);  // ← Segundos de fade out
action?.fadeIn(0.3);   // ← Segundos de fade in
```

### Cambiar nombres de animaciones

Si tus animaciones tienen nombres diferentes (ej: "Armature|idle"):

```typescript
// En AvatarModel.tsx
switch (currentAnimation) {
  case "idle":
    actionToPlay = actions["Armature|idle"];  // ← Nombre exacto
    break;
  // ...
}
```

Para ver los nombres reales, revisa la consola del navegador (F12).

## 🎯 Tips Rápidos

### Probar cambios rápidamente
1. Guarda el archivo
2. El navegador se recarga automáticamente (HMR)
3. Verifica en `http://localhost:3000`

### Depurar posiciones
Activa el `DebugPanel` en `app/page.tsx`:
```typescript
import DebugPanel from "@/components/DebugPanel";

// En el return:
<DebugPanel 
  currentAnimation={currentAnimation} 
  position={playerPosition} 
/>
```

### Resetear todo
Si algo se rompe:
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

## 📚 Recursos

- **Three.js Docs**: https://threejs.org/docs/
- **R3F Docs**: https://docs.pmnd.rs/react-three-fiber/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Emojis**: https://emojipedia.org/

---

¿Necesitas ayuda? Revisa `FEATURES.md` para detalles técnicos o `QUICKSTART.md` para solución de problemas.


