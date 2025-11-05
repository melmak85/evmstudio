# EVM Studio - Portfolio 3D Interactivo

Portafolio web 3D con navegación WASD y vista isométrica fija, construido con Next.js 15, React Three Fiber y Rapier Physics.

## ⚡ Inicio Rápido

```bash
# 1. Instalar pnpm (si no lo tienes)
npm install -g pnpm

# 2. Instalar dependencias
pnpm install

# 3. Ejecutar en modo desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) y usa **WASD** para moverte, **Espacio** para saltar.

> 📚 **Ver guías**: [QUICKSTART.md](./QUICKSTART.md) | [FEATURES.md](./FEATURES.md) | [CUSTOMIZE.md](./CUSTOMIZE.md) | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Three.js** - Motor 3D
- **React Three Fiber** - Integración de Three.js con React
- **@react-three/drei** - Utilidades para R3F
- **@react-three/rapier** - Motor de física 3D
- **Tailwind CSS** - Estilos

## 📦 Instalación

```bash
# Instalar dependencias con pnpm
pnpm install
```

## 🎮 Desarrollo

```bash
# Iniciar servidor de desarrollo con Turbopack
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🕹️ Controles

- **W** - Mover adelante
- **S** - Mover atrás
- **A** - Mover izquierda
- **D** - Mover derecha

## 📁 Estructura del Proyecto

```
evmstudio/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── Scene.tsx           # Canvas 3D
│   ├── Experience.tsx      # Escena principal
│   ├── Environment.tsx     # Entorno/Base
│   └── PlayerCharacter.tsx # Personaje con controles WASD
├── hooks/
│   └── useKeyboardControls.ts # Hook de controles de teclado
└── public/
    └── models/             # Carpeta para modelos 3D (GLB/GLTF)
```

## 🎯 Características Implementadas

### 🎮 Sistema de Controles
✅ Cámara isométrica fija (posición [20, 20, 20])  
✅ Controles WASD con transformación isométrica  
✅ **Salto con Spacebar** con cooldown de 500ms  
✅ Física con Rapier (colisiones, gravedad, impulsos)  

### 🎨 Modelo y Animaciones
✅ **Modelo 3D del avatar cargado** (boy_tpose.glb)  
✅ **Sistema de animaciones completo** con cambio automático:
  - **Idle** → cuando está quieto
  - **Run** → cuando se mueve con WASD
  - **Jump** → cuando salta con Spacebar
✅ Transiciones suaves entre animaciones (fadeIn/fadeOut 0.3s)  
✅ Rotación automática del personaje hacia la dirección del movimiento  

### 🗺️ Sistema de Zonas
✅ **Detección de zonas** con 4 áreas definidas:
  - **Principal** (centro) - Bienvenida
  - **Proyectos** (x: 10, z: 0) - Portfolio de trabajos
  - **Habilidades** (x: -10, z: 0) - Skills técnicas
  - **Contacto** (x: 0, z: 15) - Información de contacto
✅ Marcadores visuales 3D en cada zona (círculos iluminados + texto)  
✅ Detección automática al entrar en cada zona  

### 🎨 Interfaz de Usuario
✅ **Overlay HTML** con información de cada sección:
  - Título, descripción e ícono personalizados
  - Lista de items relevantes por sección
  - Animación de pulso al cambiar de zona
  - Diseño minimalista con glassmorphism
✅ Panel de controles (teclas WASD + Spacebar)  
✅ Indicador de sección actual  

### 🌍 Entorno 3D
✅ Base/suelo de 30x30 con colisión física  
✅ Grid visual de referencia  
✅ Sistema de iluminación (ambient + directional + point lights)  
✅ Sombras proyectadas  

## 🔄 Mejoras Futuras (Opcionales)

- [ ] Ajustar escala/posición del modelo según tus modelos específicos
- [ ] Cargar modelo del entorno personalizado (base_tiles.glb)
- [ ] Añadir más animaciones (caminar lento, correr rápido, etc.)
- [ ] Sistema de cámara que sigue al personaje (opcional)
- [ ] Efectos de partículas al saltar
- [ ] Sonidos ambiente y feedback de acciones
- [ ] Modo mobile con controles táctiles
- [ ] Personalizar contenido de cada sección en `SectionOverlay.tsx`

## 📝 Notas

- Los modelos 3D deben estar en formato GLB/GLTF
- Los archivos FBX pueden convertirse usando Blender o herramientas online
- La cámara está fija y no tiene OrbitControls para mantener la vista isométrica

## 🎨 Modelos Actuales

Los modelos están en `public/models/`:
- `boy_tpose.glb` - Modelo base con skeleton
- `idle_boy.glb` - Animación Idle
- `run_boy.glb` - Animación Run
- `jump.glb` - Animación Jump

## 🐛 Debugging

Si el modelo no se ve correctamente:

1. **Escala incorrecta**: Ajusta el `scale` en `AvatarModel.tsx` (línea con `scale={0.01}`)
2. **Posición Y**: Ajusta el offset en `PlayerCharacter.tsx` (línea con `pos.y - 0.5`)
3. **Ver nombres de animaciones**: Abre la consola del navegador y verás los logs de las animaciones cargadas
4. **Rotación invertida**: Ajusta el ángulo en `setRotation(angle)` o añade `+ Math.PI` si mira al revés

