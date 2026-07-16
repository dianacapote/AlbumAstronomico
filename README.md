# Nuestra estrella 🌌

Página web romántica lista para abrir en Visual Studio Code. Solo HTML, CSS y JavaScript puro (sin frameworks).

## Cómo usarla

1. Abre la carpeta en Visual Studio Code.
2. Instala la extensión **Live Server** (o similar) y haz clic derecho en `index.html` → "Open with Live Server". (Abrir el archivo directamente con doble clic también funciona, pero Live Server evita problemas con rutas).
3. Personaliza el contenido:
   - **Fotos**: colócalas en `img/` siguiendo `img/LEEME.txt`.
   - **Música**: coloca tu mp3 en `audio/` siguiendo `audio/LEEME.txt`.
   - **Textos**: busca los comentarios `<!-- ESCRIBE AQUÍ ... -->` en `index.html`.
   - **Colores/velocidades**: busca los comentarios `// CAMBIA AQUÍ ...` en `style.css` y `script.js`.
4. Sube la carpeta completa a cualquier hosting gratuito (GitHub Pages, Netlify, Vercel) para compartir el enlace.

## Estructura

```
index.html     → estructura de la página (secciones, textos, comentarios de dónde editar)
style.css      → todo el estilo (colores, tipografía, animaciones, responsive)
script.js      → cielo animado (canvas), scroll reveal, música, efectos del botón final
img/           → tus fotos
audio/         → vuestra canción
assets/        → recursos extra opcionales
```

## Qué incluye

- Pantalla de inicio con cielo animado y frase progresiva antes del botón "Entrar".
- Cielo con estrellas parpadeantes, partículas doradas, nubes de acuarela y estrellas fugaces aleatorias, con parallax al mover el ratón.
- 8 capítulos con foto + título + texto, revelados con scroll (fade, zoom, desenfoque).
- Línea de constelación que se dibuja a medida que avanzas.
- Sección "Así veía la NASA el universo ese día" con tarjetas comparativas.
- Carta final con efecto cristal (glassmorphism).
- Botón de música (no autoplay).
- Botón final "Te quiero" con estrellas fugaces extra, confeti dorado, brillo de fondo y mensaje.
- Totalmente responsive y con `prefers-reduced-motion` respetado.
