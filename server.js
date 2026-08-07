const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let isValidCategoryWord;
try {
  isValidCategoryWord = require(path.join(__dirname, 'public', 'js', 'dictionary.js')).isValidCategoryWord;
} catch (e1) {
  try {
    isValidCategoryWord = require('./public/js/dictionary.js').isValidCategoryWord;
  } catch (e2) {
    try {
      isValidCategoryWord = require('./dictionary.js').isValidCategoryWord;
    } catch (e3) {
      console.warn('Warning: dictionary.js not found at standard path, using fallback validation.');
      isValidCategoryWord = (text, cat, letter) => !!(text && letter && text.trim().toLowerCase().startsWith(letter.toLowerCase()));
    }
  }
}

// Serve static files from multiple possible directory locations
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(__dirname));

// Route handler for root /
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'Public', 'index.html'),
    path.join(__dirname, 'index.html')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).send('index.html no encontrado');
});

const PORT = process.env.PORT || 3000;
const VALID_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V'];

const rooms = new Map();

// ── Helpers ──────────────────────────────────────────────

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.has(code));
  return code;
}

/** Returns an array of player objects from the room's players Map */
function getPlayersArray(room) {
  return Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    isHost: p.isHost,
    score: p.score
  }));
}

// ── Scoring ──────────────────────────────────────────────

function calculateResults(room) {
  const categoryAnswers = {}; // { category: { normalizedAnswer: [{ socketId, text }] } }

  room.settings.categories.forEach(cat => {
    categoryAnswers[cat] = {};
  });

  // Group answers by normalized value per category
  for (const [socketId, answers] of room.answers.entries()) {
    room.settings.categories.forEach(cat => {
      const rawText = (answers && answers[cat]) || '';
      const normText = normalizeText(rawText);

      if (!categoryAnswers[cat][normText]) {
        categoryAnswers[cat][normText] = [];
      }
      categoryAnswers[cat][normText].push({ socketId, text: rawText });
    });
  }

  const roundPoints = new Map();
  const detailedAnswers = new Map();

  for (const [socketId] of room.players.entries()) {
    roundPoints.set(socketId, 0);
    detailedAnswers.set(socketId, {});
  }

  // Calculate points per category
  room.settings.categories.forEach(cat => {
    for (const [normText, entries] of Object.entries(categoryAnswers[cat])) {
      if (normText === '') {
        // Empty = 0 points
        entries.forEach(entry => {
          if (detailedAnswers.has(entry.socketId)) {
            detailedAnswers.get(entry.socketId)[cat] = { word: entry.text, points: 0 };
          }
        });
      } else {
        const sampleText = entries[0].text;
        const isValidWord = isValidCategoryWord(sampleText, cat, room.currentLetter);
        
        let points = 0;
        if (!isValidWord) {
          points = 0; // Invalid answer (not in dictionary / wrong letter / gibberish)
        } else if (entries.length === 1) {
          points = 10; // Unique answer
        } else {
          points = 5;  // Repeated answer
        }

        entries.forEach(entry => {
          if (detailedAnswers.has(entry.socketId)) {
            detailedAnswers.get(entry.socketId)[cat] = { word: entry.text, points };
            roundPoints.set(entry.socketId, (roundPoints.get(entry.socketId) || 0) + points);
          }
        });
      }
    }
  });

  // Build results array — frontend expects: playerName, playerId, answers, roundTotal, gameTotal
  const results = [];
  for (const [socketId, player] of room.players.entries()) {
    const roundTotal = roundPoints.get(socketId) || 0;
    player.score += roundTotal;

    results.push({
      playerId: socketId,
      playerName: player.name,
      answers: detailedAnswers.get(socketId) || {},
      roundTotal,
      gameTotal: player.score
    });
  }

  results.sort((a, b) => b.gameTotal - a.gameTotal);

  room.phase = 'results';

  io.to(room.code).emit('round-results', {
    round: room.currentRound,
    totalRounds: room.settings.rounds,
    letter: room.currentLetter,
    results
  });

  // Check if game is over
  if (room.currentRound >= room.settings.rounds) {
    room.phase = 'gameover';
    const rankings = results.map((r, i) => ({
      playerName: r.playerName,
      score: r.gameTotal,
      position: i + 1
    }));
    io.to(room.code).emit('game-over', { rankings });
  }
}

function cleanupRoom(room) {
  if (room.letterCycleInterval) {
    clearInterval(room.letterCycleInterval);
    room.letterCycleInterval = null;
  }
  if (room.tuttiFruttiTimer) {
    clearTimeout(room.tuttiFruttiTimer);
    room.tuttiFruttiTimer = null;
  }
  if (room.countdownInterval) {
    clearInterval(room.countdownInterval);
    room.countdownInterval = null;
  }
}

// ── Socket.IO ────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ─── CREATE ROOM ───
  socket.on('create-room', ({ playerName }) => {
    if (!playerName || playerName.trim() === '') {
      return socket.emit('error', { message: 'Nombre de jugador inválido' });
    }

    const code = generateRoomCode();
    const room = {
      code,
      host: socket.id,
      players: new Map(),
      settings: {
        rounds: 5,
        categories: ['Nombre', 'Color', 'Cosa', 'Comida', 'Animal']
      },
      currentRound: 0,
      usedLetters: [],
      currentLetter: null,
      phase: 'waiting',
      answers: new Map(),
      letterCycleInterval: null,
      countdownInterval: null,
      tuttiFruttiBy: null,
      tuttiFruttiTimer: null,
      submittedCount: 0
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName.trim(),
      isHost: true,
      score: 0
    });

    rooms.set(code, room);
    socket.join(code);
    socket.roomCode = code;
    socket.playerName = playerName.trim();

    // Frontend expects { code, playerId }
    socket.emit('room-created', {
      code,
      playerId: socket.id
    });
  });

  // ─── JOIN ROOM ───
  socket.on('join-room', ({ code, playerName }) => {
    const room = rooms.get(code);
    if (!room) {
      return socket.emit('error', { message: 'La sala no existe. Verificá el código.' });
    }
    if (room.players.size >= 6) {
      return socket.emit('error', { message: 'La sala está llena (máximo 6 jugadores)' });
    }
    if (room.phase !== 'waiting' && room.phase !== 'results') {
      return socket.emit('error', { message: 'El juego ya está en curso. Esperá a que termine la ronda.' });
    }
    if (!playerName || playerName.trim() === '') {
      return socket.emit('error', { message: 'Nombre de jugador inválido' });
    }

    const name = playerName.trim();

    room.players.set(socket.id, {
      id: socket.id,
      name,
      isHost: false,
      score: 0
    });

    socket.join(code);
    socket.roomCode = code;
    socket.playerName = name;

    // Frontend expects { code, playerId, players, settings }
    socket.emit('room-joined', {
      code,
      playerId: socket.id,
      players: getPlayersArray(room),
      settings: room.settings
    });

    // Broadcast updated player list to all in room
    io.to(code).emit('player-joined', {
      players: getPlayersArray(room)
    });
  });

  // ─── UPDATE SETTINGS ───
  socket.on('update-settings', ({ settings }) => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;

    if (room.host !== socket.id) {
      return socket.emit('error', { message: 'Solo el host puede cambiar la configuración' });
    }

    if (settings.rounds && [5, 10, 15].includes(settings.rounds)) {
      room.settings.rounds = settings.rounds;
    }
    if (settings.categories && Array.isArray(settings.categories) && settings.categories.length > 0) {
      room.settings.categories = settings.categories;
    }

    // Frontend expects { settings }
    io.to(code).emit('settings-updated', { settings: room.settings });
  });

  // ─── START ROUND ───
  socket.on('start-round', () => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;

    if (room.host !== socket.id) {
      return socket.emit('error', { message: 'Solo el host puede iniciar la ronda' });
    }

    if (room.phase !== 'waiting' && room.phase !== 'results') {
      return socket.emit('error', { message: 'No se puede iniciar la ronda en este momento' });
    }

    room.currentRound++;
    room.phase = 'countdown';
    room.answers.clear();
    room.submittedCount = 0;
    room.tuttiFruttiBy = null;
    if (room.tuttiFruttiTimer) {
      clearTimeout(room.tuttiFruttiTimer);
      room.tuttiFruttiTimer = null;
    }

    // Pick a random letter NOT yet used
    let availableLetters = VALID_LETTERS.filter(l => !room.usedLetters.includes(l));
    if (availableLetters.length === 0) {
      room.usedLetters = [];
      availableLetters = [...VALID_LETTERS];
    }
    room.currentLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    // Countdown: 3, 2, 1, GO!
    let count = 3;
    io.to(code).emit('countdown', { count });

    room.countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        io.to(code).emit('countdown', { count });
      } else if (count === 0) {
        // Emit ¡YA!
        io.to(code).emit('go');
      } else {
        // count < 0 → start cycling
        clearInterval(room.countdownInterval);
        room.countdownInterval = null;
        room.phase = 'cycling';

        room.letterCycleInterval = setInterval(() => {
          const randomLetter = VALID_LETTERS[Math.floor(Math.random() * VALID_LETTERS.length)];
          io.to(code).emit('letter-cycling', { letter: randomLetter });
        }, 100);
      }
    }, 1000);
  });

  // ─── STOP LETTER ───
  socket.on('stop-letter', () => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;
    if (room.phase !== 'cycling') return;

    clearInterval(room.letterCycleInterval);
    room.letterCycleInterval = null;
    room.usedLetters.push(room.currentLetter);
    room.phase = 'playing';

    // Frontend expects { letter, stoppedBy } where stoppedBy is the playerName string
    io.to(code).emit('letter-stopped', {
      letter: room.currentLetter,
      stoppedBy: socket.playerName
    });
  });

  // ─── SUBMIT ANSWERS ───
  socket.on('submit-answers', ({ answers }) => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;
    if (room.phase !== 'playing') return;

    if (!room.answers.has(socket.id)) {
      room.answers.set(socket.id, answers || {});
      room.submittedCount++;

      io.to(code).emit('player-submitted', {
        playerName: socket.playerName,
        playersSubmitted: room.submittedCount,
        totalPlayers: room.players.size
      });

      if (room.submittedCount >= room.players.size) {
        if (room.tuttiFruttiTimer) {
          clearTimeout(room.tuttiFruttiTimer);
          room.tuttiFruttiTimer = null;
        }
        calculateResults(room);
      }
    }
  });

  // ─── TUTTI FRUTTI ───
  socket.on('tutti-frutti', () => {
    const code = socket.roomCode;
    const room = rooms.get(code);
    if (!room) return;
    if (room.phase !== 'playing') return;
    if (room.tuttiFruttiBy !== null) return; // already called

    room.tuttiFruttiBy = socket.id;

    io.to(code).emit('tutti-frutti-called', {
      playerName: socket.playerName,
      secondsLeft: 10
    });

    // 10-second countdown for remaining players
    let secondsLeft = 10;
    const timerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        io.to(code).emit('time-warning', { secondsLeft });
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);

    room.tuttiFruttiTimer = setTimeout(() => {
      clearInterval(timerInterval);

      // Force-submit empty answers for anyone who hasn't submitted
      for (const [playerId] of room.players.entries()) {
        if (!room.answers.has(playerId)) {
          room.answers.set(playerId, {});
          room.submittedCount++;
        }
      }
      calculateResults(room);
    }, 10000);
  });

  // ─── DISCONNECT ───
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const code = socket.roomCode;
    if (!code) return;

    const room = rooms.get(code);
    if (!room) return;

    room.players.delete(socket.id);
    room.answers.delete(socket.id);

    if (room.players.size === 0) {
      cleanupRoom(room);
      rooms.delete(code);
      return;
    }

    // If host left, assign new host
    if (room.host === socket.id) {
      const newHostId = Array.from(room.players.keys())[0];
      const newHost = room.players.get(newHostId);
      newHost.isHost = true;
      room.host = newHostId;
    }

    // Broadcast updated player list
    io.to(code).emit('player-left', {
      players: getPlayersArray(room)
    });

    // If playing and everyone has now submitted, calculate results
    if (room.phase === 'playing' && room.submittedCount >= room.players.size && room.players.size > 0) {
      if (room.tuttiFruttiTimer) {
        clearTimeout(room.tuttiFruttiTimer);
        room.tuttiFruttiTimer = null;
      }
      calculateResults(room);
    }
  });
});

// ── Start Server ─────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`🍊 Tutti Frutti server running on http://localhost:${PORT}`);
});
