const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const rooms = {};

const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const checkWin = (board, player) =>
  WINS.find(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);

const checkDraw = (board) => board.every((cell) => cell !== null);
const genId = () => Math.random().toString(36).substring(2, 7).toUpperCase();

const removePlayerFromRoom = (socket, notifyOpponent = true) => {
  const roomId = socket.data.roomId;
  if (!roomId || !rooms[roomId]) {
    socket.data.roomId = null;
    return;
  }

  const room = rooms[roomId];
  room.players = room.players.filter((playerId) => playerId !== socket.id);
  delete room.symbols[socket.id];
  socket.leave(roomId);
  socket.data.roomId = null;

  if (room.players.length === 0) {
    delete rooms[roomId];
    return;
  }

  if (notifyOpponent) {
    io.to(room.players[0]).emit('opponent_left');
  }

  delete rooms[roomId];
};

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    const fileName = path.basename(filePath);
    if (fileName === 'index.html' || fileName === 'sw.js' || fileName === 'manifest.webmanifest' || fileName === 'reset-sw.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.get('/manifest.webmanifest', (req, res) => {
  res.type('application/manifest+json');
  res.sendFile(path.join(__dirname, 'public', 'manifest.webmanifest'));
});
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('create_room', () => {
    removePlayerFromRoom(socket, false);

    const roomId = genId();
    rooms[roomId] = {
      players: [socket.id],
      board: Array(9).fill(null),
      currentPlayer: 'X',
      scores: { X: 0, O: 0 },
      symbols: { [socket.id]: 'X' }
    };

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.emit('room_created', { roomId, symbol: 'X' });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  socket.on('join_room', ({ roomId }) => {
    removePlayerFromRoom(socket, false);

    const cleanRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms[cleanRoomId];

    if (!room) {
      socket.emit('error', 'Sala no encontrada');
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', 'Sala llena');
      return;
    }

    room.players.push(socket.id);
    room.symbols[socket.id] = 'O';
    socket.join(cleanRoomId);
    socket.data.roomId = cleanRoomId;

    socket.emit('room_joined', { roomId: cleanRoomId, symbol: 'O' });
    io.to(room.players[0]).emit('opponent_joined');
    io.to(cleanRoomId).emit('game_start', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      scores: room.scores
    });

    console.log(`Room ${cleanRoomId}: 2 players ready`);
  });

  socket.on('make_move', ({ index }) => {
    const roomId = socket.data.roomId;
    const room = rooms[roomId];
    if (!room) return;

    const playerSymbol = room.symbols[socket.id];
    if (playerSymbol !== room.currentPlayer) return;
    if (room.board[index]) return;

    room.board[index] = playerSymbol;

    const winCombo = checkWin(room.board, playerSymbol);
    const draw = !winCombo && checkDraw(room.board);

    io.to(roomId).emit('move_made', { index, symbol: playerSymbol });

    if (winCombo) {
      room.scores[playerSymbol] += 1;
      io.to(roomId).emit('game_over', { winner: playerSymbol, winCombo, scores: room.scores });
      return;
    }

    if (draw) {
      io.to(roomId).emit('game_over', { winner: null, winCombo: null, scores: room.scores });
      return;
    }

    room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('turn_change', { currentPlayer: room.currentPlayer });
  });

  socket.on('request_replay', () => {
    const roomId = socket.data.roomId;
    const room = rooms[roomId];
    if (!room) return;

    room.board = Array(9).fill(null);
    room.currentPlayer = 'X';
    io.to(roomId).emit('game_restart', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      scores: room.scores
    });
  });

  socket.on('leave_room', () => {
    removePlayerFromRoom(socket, true);
  });

  socket.on('disconnect', () => {
    removePlayerFromRoom(socket, true);
    console.log('Disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Triki 3D Multiplayer on port ${PORT}`);
});


