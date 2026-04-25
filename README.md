# Triki 3D

Juego web multijugador de tres en raya con estetica futurista, soporte para partidas en linea, modo local y juego contra IA. El proyecto esta construido como una aplicacion ligera servida por Express y sincronizada en tiempo real con Socket.IO.

## Resumen para portafolio

Videojuego web casual con enfoque en experiencia rapida, instalacion como PWA y sincronizacion en tiempo real entre dos jugadores. El repositorio contiene cliente, servidor y capa basica offline en una estructura compacta y facil de desplegar.

## Modos de juego

- Online con salas privadas por codigo.
- Local en un mismo dispositivo.
- Contra IA.

## Arquitectura

- `server.js`: servidor HTTP, entrega del cliente y eventos Socket.IO.
- `public/index.html`: cliente principal del juego.
- `public/manifest.webmanifest`: configuracion PWA.
- `public/sw.js`: cache de app shell y soporte offline basico.

## Stack tecnico

- Node.js
- Express
- Socket.IO
- HTML/CSS/JavaScript
- PWA

## Flujo multijugador

1. Un jugador crea una sala.
2. El servidor genera un codigo de cinco caracteres.
3. El segundo jugador se une con ese codigo.
4. El tablero se sincroniza en tiempo real para ambos clientes.

## Ejecucion local

```bash
npm install
npm start
```

URL local:

- `http://127.0.0.1:3000`

## Publicacion

URL publica esperada:
- `https://andresito202.github.io/triki/`

Compatibilidad con GitHub Pages:
- El cliente estatico y la PWA si son compatibles.
- El modo `online` no se publica en GitHub Pages porque depende de Express + Socket.IO.
- En la URL publica quedan operativos `local` y `contra IA`.

Despliegue:
- `Settings -> Pages -> Build and deployment -> Source -> GitHub Actions`

Notas:
- El workflow publica directamente el contenido de `public/`.
- Manifest, service worker e iconos quedaron ajustados para la subruta `/triki/`.

## Enfoque de ingenieria

- Servidor unico para servir cliente y WebSocket sin capas innecesarias.
- PWA integrada para instalacion en escritorio y moviles.
- Codigo orientado a partida rapida y baja friccion de acceso.
- Base apropiada para evolucionar ranking, persistencia o matchmaking.
