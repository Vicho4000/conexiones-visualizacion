# Conexiones

**Conexiones** es una visualización web sobre soledad, red de apoyo y bienestar
en Chile.

Permite elegir género, rango de edad y región para observar cómo cambian tres
elementos de la escena:

- La postura de la persona central representa el nivel promedio de soledad.
- Las personas alrededor representan la red de apoyo percibida.
- El resplandor de la figura central representa el bienestar promedio.

La visualización muestra **promedios de grupos**, no personas reales. Sirve para
comparar patrones y no para explicar por qué existen esas diferencias.

## Cómo ver el proyecto

La forma más sencilla es abrir el enlace público de Vercel que comparte el
equipo. No es necesario instalar ningún programa.

Si recibiste la carpeta del proyecto y necesitas abrirla en tu computador:

1. Abre la carpeta con Visual Studio Code.
2. Abre el menú `Terminal` y selecciona `New Terminal`.
3. Escribe `npm install` y presiona Enter. Esto se hace solo la primera vez.
4. Escribe `npm run dev` y presiona Enter.
5. Abre en Chrome la dirección que aparece en la terminal, normalmente
   `http://localhost:3000`.

Para detener el proyecto, vuelve a la terminal y presiona `Control + C`.

## Cómo usar la visualización

1. Selecciona Mujer u Hombre.
2. Mueve el control de edad.
3. Selecciona una región en el mapa.
4. Observa cómo cambian la figura central, las personas de alrededor y el
   resplandor.
5. Pasa el cursor sobre la persona central para ver un resumen fácil de leer.

Los botones flotantes permiten abrir la explicación, el hallazgo destacado y
la comparación con la selección anterior.

## Dónde está cada cosa

| Si buscas…                               | Está en…                           |
| ---------------------------------------- | ---------------------------------- |
| Las bases originales                     | `data/raw/`                        |
| Los datos que usa la página              | `data/processed/`                  |
| Las imágenes de la persona central       | `public/personas/persona-central/` |
| Las imágenes de la red de apoyo          | `public/personas/red-de-apoyo/`    |
| El mapa de Chile                         | `public/mapas/`                    |
| La metodología y decisiones de diseño    | `documentacion/`                   |
| Imágenes antiguas que ya no usa el sitio | `recursos/imagenes-anteriores/`    |

Hay una explicación más completa en
[`GUIA_DE_CARPETAS.md`](./GUIA_DE_CARPETAS.md).

## Qué se puede cambiar sin programar

- Consultar las bases originales en `data/raw/`.
- Revisar la metodología y la hoja de ruta en `documentacion/`.
- Revisar o reemplazar imágenes manteniendo exactamente el mismo nombre y
  formato del archivo.
- Proponer cambios mediante un documento, comentario o tarea para que el equipo
  los implemente.

Antes de reemplazar datos o imágenes, guarda una copia y coordina el cambio con
el equipo.

## Qué no se debe modificar directamente

- No edites los archivos de `data/raw/`: son las fuentes originales.
- No subas contraseñas, claves ni datos personales al proyecto.
- No cambies o borres carpetas técnicas como `app`, `lib`, `public` o
  `components` sin avisar al equipo.
- No publiques cambios directamente en la rama `main` de GitHub.

## Datos y metodología

La página utiliza agregados preparados en `data/processed/ebs-profiles.json`.
La metodología está documentada en
[`documentacion/metodologia-de-datos.md`](./documentacion/metodologia-de-datos.md)
y los indicadores en
[`documentacion/definicion-de-indicadores.md`](./documentacion/definicion-de-indicadores.md).

Las encuestas utilizadas son independientes. La visualización no conecta
respuestas de una encuesta con participantes de otra ni afirma relaciones
causales entre soledad, red de apoyo y bienestar.

## Cómo colaborar mediante GitHub

GitHub guarda el historial del proyecto. Cada cambio debe realizarse en una
rama separada para que otra persona pueda revisarlo antes de incorporarlo.

En la terminal:

```bash
git switch main
git pull
git switch -c tipo/descripcion-breve
```

Después de hacer el cambio:

```bash
npm run lint
npm run typecheck
git add ruta/del/archivo
git commit -m "Descripción breve del cambio"
git push -u origin tipo/descripcion-breve
```

Luego abre GitHub, selecciona **Compare & pull request**, explica el cambio y
solicita una revisión. Nunca hagas push directo a `main`.

## Publicación con Vercel

Vercel crea automáticamente una vista previa para cada Pull Request. Cuando un
cambio aprobado se incorpora a `main`, Vercel publica la nueva versión del
sitio.

En este momento el proyecto no necesita variables secretas ni configuración
adicional.

## Información técnica para el equipo de desarrollo

El proyecto utiliza Next.js, React, TypeScript, Tailwind CSS y D3. Los comandos
de revisión disponibles son:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Las reglas de colaboración técnica están en [`AGENTS.md`](./AGENTS.md).
