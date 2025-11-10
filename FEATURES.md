# 🎯 Características Detalladas

## 🎮 Sistema de Controles

### Movimiento WASD Isométrico
- **W** - Mover hacia adelante
- **S** - Mover hacia atrás  
- **A** - Mover hacia la izquierda
- **D** - Mover hacia la derecha
- **Spacebar** - Saltar

### Transformación Isométrica
El movimiento WASD está rotado 45° para alinearse con la vista de la cámara isométrica:
```typescript
const ISO_ROTATION_Y = Math.PI / 4; // 45 grados
direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ISO_ROTATION_Y);
```

### Sistema de Salto
- Cooldown de 500ms entre saltos
- Detección de suelo (solo puede saltar si está en tierra)
- Fuerza de impulso: 8 unidades
- Animación de salto activada automáticamente

## 🎨 Sistema de Animaciones

### Animaciones Disponibles
1. **Idle** (`idle_boy.glb`)
   - Se activa cuando el personaje está quieto
   - Loop continuo

2. **Run** (`run_boy.glb`)
   - Se activa cuando te mueves con WASD
   - Loop continuo

3. **Jump** (`jump.glb`)
   - Se activa al presionar Spacebar
   - Se reproduce una vez

### Transiciones
- **FadeIn**: 0.3 segundos al entrar
- **FadeOut**: 0.3 segundos al salir
- Las animaciones se mezclan suavemente sin cortes bruscos

### Lógica de Prioridad
```
Saltando > Corriendo > Idle
```
Si estás saltando, no se cambia a Run aunque te muevas.

## 🗺️ Sistema de Zonas

### Zonas Definidas

#### 1. Principal (Centro)
- **Posición**: (0, 0)
- **Radio**: Ilimitado (fuera de otras zonas)
- **Contenido**: Bienvenida y guía de navegación

#### 2. Proyectos
- **Posición**: X: 10, Z: 0
- **Radio**: 4 unidades
- **Contenido**: Lista de proyectos destacados

#### 3. Habilidades
- **Posición**: X: -10, Z: 0
- **Radio**: 4 unidades
- **Contenido**: Stack técnico y herramientas

#### 4. Contacto
- **Posición**: X: 0, Z: 15
- **Radio**: 4 unidades
- **Contenido**: Información de contacto y redes sociales

### Detección de Zonas
```typescript
// Cálculo de distancia euclidiana
const distance = Math.sqrt(
  Math.pow(pos.x - zone.x, 2) + Math.pow(pos.z - zone.z, 2)
);

if (distance < zone.radius) {
  // Estás dentro de la zona
}
```

### Marcadores Visuales
Cada zona tiene:
- **Círculo exterior**: Ring geometry con emisión azul (opacity 0.3)
- **Círculo interior**: Circle geometry más brillante (opacity 0.1)
- **Texto 3D**: Nombre de la zona flotante
- **Color**: #4a90e2 (azul)

## 🎨 Sistema de UI

### Overlay de Sección
Componente: `SectionOverlay.tsx`

Características:
- **Posición**: Fijo a la izquierda, centrado verticalmente
- **Diseño**: Glassmorphism (fondo negro/80% con blur)
- **Contenido dinámico**: Cambia según la zona actual
- **Animación**: Pulso de borde al cambiar de sección

Estructura:
```
┌─────────────────────────┐
│ 🏠 Título               │ ← Icono + Título
│ ━━━━━━━━━━━━━━━━       │ ← Barra de color
│                         │
│ Descripción breve       │
│                         │
│ ▸ Item 1               │
│ ▸ Item 2               │ ← Lista de items
│ ▸ Item 3               │
│                         │
│ ───────────────────     │
│ SECCIÓN ACTUAL          │ ← Indicador
│ Proyectos              │
└─────────────────────────┘
```

### Panel de Controles
- **Posición**: Esquina inferior izquierda
- **Diseño**: Compacto y minimalista
- **Contenido**: Lista de teclas con etiquetas `<kbd>`

## 🔧 Personalización

### Modificar Zonas
Edita `types/zones.ts`:
```typescript
export const ZONES: Zone[] = [
  {
    name: "TuSeccion",
    x: 5,      // Posición X
    z: 10,     // Posición Z
    radius: 4, // Radio de detección
  },
];
```

### Modificar Contenido
Edita `components/SectionOverlay.tsx`:
```typescript
const SECTION_DATA: Record<SectionType, SectionContent> = {
  TuSeccion: {
    title: "Tu Título",
    description: "Tu descripción",
    icon: "🎯",
    items: ["Item 1", "Item 2"],
  },
};
```

### Ajustar Velocidad
Edita `components/PlayerCharacter.tsx`:
```typescript
const SPEED = 5;        // Velocidad de movimiento
const JUMP_FORCE = 8;   // Fuerza de salto
```

### Ajustar Escala del Modelo
Edita `components/AvatarModel.tsx`:
```typescript
<primitive 
  object={boyModel.clone()} 
  scale={0.01} // Cambia este valor
/>
```

## 📊 Flujo de Datos

```
Usuario presiona tecla
    ↓
useKeyboardControls detecta
    ↓
PlayerCharacter recibe estado
    ↓
useFrame calcula movimiento
    ↓
Rapier aplica física
    ↓
Detecta zona actual
    ↓
Notifica cambio a página
    ↓
SectionOverlay actualiza UI
```

## 🎯 Eventos Clave

### onSectionChange
```typescript
// En page.tsx
const [currentSection, setCurrentSection] = useState<SectionType>("Principal");

<Scene onSectionChange={setCurrentSection} />
```

Este callback se dispara cada vez que el personaje entra en una nueva zona.

## 🚀 Performance

### Optimizaciones Implementadas
- ✅ Preload de modelos GLB
- ✅ Dynamic imports para componentes 3D (evitar SSR)
- ✅ Reutilización de geometrías
- ✅ Shadows optimizadas (mapSize 2048x2048)
- ✅ Cooldown en saltos para evitar spam
- ✅ FPS target: 60fps

### Recomendaciones
- Modelos < 10MB
- Texturas comprimidas
- Usar GLB en vez de GLTF + assets externos















