# Modelos 3D

Coloca tus archivos de modelos 3D aquí.

## Archivos esperados:

- `base_tiles.glb` - Modelo del entorno/base con tiles
- `my_avatar.glb` - Modelo del personaje (con bones en T-pose)
- `animations/` - Carpeta para archivos de animaciones separados

## Conversión de FBX a GLB

Si tienes archivos `.fbx`, puedes convertirlos a `.glb` usando:

### Opción 1: Blender
1. Abre Blender
2. File > Import > FBX (.fbx)
3. Selecciona tu modelo
4. File > Export > glTF 2.0 (.glb/.gltf)
5. Selecciona formato GLB y exporta

### Opción 2: Herramientas Online
- [gltf.report](https://gltf.report/) - Visor y validador
- [FBX2glTF](https://github.com/facebookincubator/FBX2glTF) - Conversor CLI

## Notas importantes:

- Los modelos deben estar optimizados para web (< 10MB preferiblemente)
- Las texturas deben estar embebidas o en la misma carpeta
- Los bones del avatar deben seguir convenciones estándar (Mixamo, etc.)
















