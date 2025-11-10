# 🚀 Guía Rápida de Inicio

## ⚡ Instalación y Ejecución

### 1. Instalar Node.js y pnpm

Si no tienes Node.js instalado:
- Descarga desde: https://nodejs.org/ (versión LTS recomendada)
- Verifica con: `node --version`

Instalar pnpm:
```bash
npm install -g pnpm
```

### 2. Instalar dependencias del proyecto

```bash
cd C:\projects\evmstudio
pnpm install
```

Esto descargará todas las librerías necesarias:
- Next.js 15
- React 19
- Three.js + React Three Fiber
- Rapier Physics
- Y más...

### 3. Ejecutar el proyecto

```bash
pnpm dev
```

Espera a que compile y abre tu navegador en:
```
http://localhost:3000
```

## 🎮 Prueba los Controles

Una vez que se cargue la página:

1. **Usa WASD para moverte**:
   - `W` - Adelante
   - `S` - Atrás
   - `A` - Izquierda
   - `D` - Derecha

2. **Observa las animaciones**:
   - Cuando no te mueves → Animación **Idle**
   - Cuando te mueves → Animación **Run**

3. **Verifica en la consola del navegador** (F12):
   - Deberías ver los nombres de las animaciones cargadas
   - Si hay errores, aparecerán aquí

## 🐛 Solución de Problemas

### El modelo no se ve

1. **Revisa la escala**: Abre `components/AvatarModel.tsx` y ajusta:
```typescript
<primitive 
  object={boyModel.clone()} 
  scale={0.01} // Prueba con 0.1, 1, o 0.001
/>
```

2. **Revisa la posición Y**: En `components/PlayerCharacter.tsx`:
```typescript
setPosition([pos.x, pos.y - 0.5, pos.z]); // Prueba con -1, -0.1, o 0
```

### El modelo está invertido o mira al revés

En `components/PlayerCharacter.tsx`, ajusta la rotación:
```typescript
setRotation(angle + Math.PI); // Añade 180 grados
```

### Las animaciones no funcionan

1. Abre la consola del navegador (F12)
2. Busca el mensaje "🎬 Animaciones cargadas"
3. Verifica que los nombres sean correctos
4. Si los nombres son diferentes (ej: "Armature|idle"), actualiza en `AvatarModel.tsx`:
```typescript
actionToPlay = actions["Armature|idle"]; // Usa el nombre exacto
```

### Panel de Debug (Opcional)

Para ver información en pantalla, edita `app/page.tsx` y añade:

```typescript
import DebugPanel from "@/components/DebugPanel";

// Dentro del return:
<DebugPanel 
  currentAnimation="idle" 
  position={[0, 0, 0]} 
/>
```

## 📝 Próximos Pasos

Una vez que todo funcione:

1. ✅ Ajusta la escala y posición del modelo
2. ✅ Implementa el salto con Spacebar
3. ✅ Añade detección de zonas
4. ✅ Crea overlay HTML con tu información
5. ✅ Añade modelo del entorno

¡Diviértete construyendo tu portfolio 3D! 🎉
















