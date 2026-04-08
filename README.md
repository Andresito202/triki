# Triki 3D - Multijugador Online

## Como ejecutarlo en local
1. Entra a la carpeta del proyecto.
2. Ejecuta `npm install`.
3. Ejecuta `npm start`.
4. Abre `http://127.0.0.1:3000`.

## Modos disponibles
- En linea
- Local
- Contra IA

## Flujo online
1. Jugador 1 crea una sala.
2. Comparte el codigo de 5 letras.
3. Jugador 2 se une con ese codigo.
4. La partida inicia en tiempo real.

## Instalacion como app
- En PC puedes instalarla desde Chrome o Edge.
- En Android puedes usar Agregar a pantalla de inicio.
- En iPhone puedes usar Compartir y luego Agregar a pantalla de inicio.

## Archivos principales
- `server.js`: servidor local con Express y Socket.IO.
- `public/index.html`: cliente completo del juego.
- `public/manifest.webmanifest`: configuracion PWA.
- `public/sw.js`: cache basica para instalacion.