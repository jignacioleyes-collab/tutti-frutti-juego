// ============================================
// TUTTI FRUTTI - Frontend Application
// ============================================

const state = {
  socket: null,
  playerId: null,
  playerName: '',
  roomCode: null,
  isHost: false,
  players: [],
  settings: { rounds: 5, categories: ['Nombre', 'Color', 'Cosa', 'Comida', 'Animal'] },
  currentRound: 0,
  currentLetter: null,
  phase: 'home',
  answers: {},
  hasSubmitted: false,
  hasTuttiFrutti: false,
  cyclingInterval: null
};

// Audio Context setup
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initSocket();
  bindEvents();
  
  // Click anywhere to initialize audio context (browser policy)
  document.body.addEventListener('click', initAudio, { once: true });
});

// --- Socket Connection ---
function initSocket() {
  state.socket = io();
  
  const { socket } = state;

  // Server → Client events
  socket.on('room-created', ({ code, playerId }) => {
    state.roomCode = code;
    state.playerId = playerId;
    state.isHost = true;
    state.players = [{ id: playerId, name: state.playerName, isHost: true, score: 0 }];
    showScreen('screen-waiting');
    renderWaitingRoom();
    showToast('Sala creada exitosamente', 'success');
  });

  socket.on('room-joined', ({ code, playerId, players, settings }) => {
    state.roomCode = code;
    state.playerId = playerId;
    // Check if we are the host (in case of host reassignment)
    const me = players.find(p => p.id === playerId);
    state.isHost = me ? me.isHost : false;
    state.players = players;
    state.settings = settings;
    showScreen('screen-waiting');
    renderWaitingRoom();
    showToast('Te uniste a la sala', 'success');
  });

  socket.on('player-joined', ({ players }) => {
    state.players = players;
    if(state.phase === 'waiting') renderWaitingRoom();
    playSound('stop'); // subtle blip
  });

  socket.on('player-left', (data) => {
    // data may be { players: [...] } or { id: '...' }
    if (data.players) {
      state.players = data.players;
    } else if (data.id) {
      state.players = state.players.filter(p => p.id !== data.id);
    }
    if(state.phase === 'waiting') renderWaitingRoom();
    else renderStatusBadges();
  });

  socket.on('settings-updated', (data) => {
    // Handle both { settings: {...} } and direct settings object
    state.settings = data.settings || data;
    if(!state.isHost && state.phase === 'waiting') renderWaitingRoom();
  });

  socket.on('countdown', ({ count }) => {
    if (state.phase !== 'countdown') showScreen('screen-countdown');
    playCountdown(count);
  });

  socket.on('go', () => {
    playGoSound();
    const countEl = document.getElementById('countdown-number');
    countEl.textContent = '¡YA!';
    countEl.style.fontSize = '8rem';
    
    setTimeout(() => {
      document.querySelector('.countdown-container').classList.add('hidden');
      document.getElementById('letter-cycling-container').classList.remove('hidden');
    }, 1000);
  });

  socket.on('letter-cycling', ({ letter }) => {
    state.currentLetter = letter;
    document.getElementById('cycling-letter').textContent = letter;
    document.getElementById('cycling-letter').classList.add('cycling');
  });

  socket.on('letter-stopped', ({ letter, stoppedBy }) => {
    state.currentLetter = letter;
    showLetterRevealed(letter, stoppedBy);
  });

  socket.on('player-submitted', ({ playerName, playersSubmitted, totalPlayers }) => {
    if(state.phase === 'playing') {
      renderStatusBadges(playersSubmitted);
      if(playerName !== state.playerName) {
        showToast(`${playerName} ya terminó.`, 'info');
      }
    }
  });

  socket.on('tutti-frutti-called', ({ playerName, secondsLeft }) => {
    state.hasTuttiFrutti = true;
    showTuttiFruttiOverlay(playerName, secondsLeft);
    playSound('tuttifrutti');
  });

  socket.on('time-warning', ({ secondsLeft }) => {
    const timerBox = document.getElementById('tutti-frutti-timer-box');
    const tfSeconds = document.getElementById('tf-seconds');
    const tfOverlaySeconds = document.getElementById('tf-overlay-seconds');
    
    timerBox.classList.remove('hidden');
    tfSeconds.textContent = secondsLeft;
    tfOverlaySeconds.textContent = secondsLeft;
    playSound('countdown'); // tick
  });

  socket.on('round-results', ({ round, totalRounds, letter, results }) => {
    state.currentRound = round;
    state.currentLetter = letter;
    state.settings.rounds = totalRounds;
    state.hasSubmitted = false;
    state.hasTuttiFrutti = false;
    showScreen('screen-results');
    renderResults(results);
    renderLeaderboard(results);
    
    const isLastRound = round >= totalRounds;
    document.getElementById('btn-next-round').classList.toggle('hidden', !state.isHost || isLastRound);
    document.getElementById('waiting-next-round').classList.toggle('hidden', state.isHost || isLastRound);
  });

  socket.on('game-over', ({ rankings }) => {
    setTimeout(() => {
      showScreen('screen-gameover');
      renderGameOver(rankings);
      playSound('win');
      createConfetti();
    }, 2000); // Brief delay so players can see the last round results
  });

  socket.on('error', ({ message }) => {
    showToast(message, 'error');
  });
}

// --- Screen Navigation ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
  const phaseMap = {
    'screen-home': 'home',
    'screen-waiting': 'waiting',
    'screen-countdown': 'countdown',
    'screen-game': 'playing',
    'screen-results': 'results',
    'screen-gameover': 'gameover'
  };
  state.phase = phaseMap[screenId];
}

// --- Events Binding ---
function bindEvents() {
  document.getElementById('btn-show-join').addEventListener('click', () => {
    document.getElementById('join-room-container').classList.remove('hidden');
  });

  document.getElementById('btn-create-room').addEventListener('click', createRoom);
  document.getElementById('btn-join-room').addEventListener('click', joinRoom);
  
  document.getElementById('btn-copy-code').addEventListener('click', copyRoomCode);
  document.getElementById('btn-add-category').addEventListener('click', addCategory);
  document.getElementById('btn-start-game').addEventListener('click', startGame);
  document.getElementById('btn-stop-letter').addEventListener('click', stopLetter);
  document.getElementById('btn-tutti-frutti').addEventListener('click', callTuttiFrutti);
  document.getElementById('btn-next-round').addEventListener('click', () => state.socket.emit('start-round'));
  
  document.getElementById('btn-new-game').addEventListener('click', () => {
    window.location.reload();
  });
  document.getElementById('btn-back-home').addEventListener('click', () => {
    window.location.reload();
  });

  // Settings change emitters
  document.querySelectorAll('input[name="rounds"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.settings.rounds = parseInt(e.target.value);
      updateSettings();
    });
  });

  // Enter keys
  document.getElementById('new-category-input').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addCategory();
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.game-table td')) {
      document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.remove('active'));
    }
  });
}

// --- Home Screen ---
function createRoom() {
  const name = document.getElementById('player-name').value.trim();
  if(!name) return showToast('Ingresá tu nombre primero', 'error');
  state.playerName = name;
  state.socket.emit('create-room', { playerName: name });
}

function joinRoom() {
  const name = document.getElementById('player-name').value.trim();
  const code = document.getElementById('room-code-input').value.trim().toUpperCase();
  if(!name) return showToast('Ingresá tu nombre primero', 'error');
  if(!code || code.length !== 4) return showToast('Código inválido', 'error');
  state.playerName = name;
  state.socket.emit('join-room', { code, playerName: name });
}

// --- Waiting Room ---
function renderWaitingRoom() {
  document.getElementById('display-room-code').textContent = state.roomCode;
  document.getElementById('player-count').textContent = `${state.players.length}/6`;
  
  const list = document.getElementById('players-list');
  list.innerHTML = state.players.map((p) => `
    <li class="player-item">
      <div class="player-dot"></div>
      <span>${p.name}</span>
      ${p.isHost ? '<span class="player-host-badge">👑 Host</span>' : ''}
      ${p.id === state.playerId ? '<span class="player-you-badge">(vos)</span>' : ''}
    </li>
  `).join('');

  if(state.isHost) {
    document.getElementById('host-settings').classList.remove('hidden');
    document.getElementById('waiting-message').classList.add('hidden');
    renderCategories();
  } else {
    document.getElementById('host-settings').classList.add('hidden');
    document.getElementById('waiting-message').classList.remove('hidden');
    document.getElementById('waiting-message').textContent = 
      `Esperando que el host inicie. Categorías: ${state.settings.categories.join(', ')}`;
  }
}

function copyRoomCode() {
  navigator.clipboard.writeText(state.roomCode);
  showToast('¡Código copiado!', 'success');
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  container.innerHTML = state.settings.categories.map((c, i) => `
    <div class="chip">
      ${c} <button onclick="removeCategory(${i})">&times;</button>
    </div>
  `).join('');
}

function addCategory() {
  const input = document.getElementById('new-category-input');
  const val = input.value.trim();
  if(val && !state.settings.categories.includes(val)) {
    state.settings.categories.push(val);
    updateSettings();
    input.value = '';
    renderCategories();
  }
}

window.removeCategory = function(index) {
  state.settings.categories.splice(index, 1);
  updateSettings();
  renderCategories();
};

function updateSettings() {
  state.socket.emit('update-settings', { settings: state.settings });
}

function startGame() {
  if(state.players.length < 2) {
    // allow testing alone, but normally require 2
    console.warn("Starting with < 2 players");
  }
  state.socket.emit('start-round');
}

// --- Countdown & Letter ---
function playCountdown(count) {
  const countEl = document.getElementById('countdown-number');
  countEl.style.fontSize = '10rem';
  countEl.textContent = count;
  playSound('countdown');
}

function stopLetter() {
  document.getElementById('btn-stop-letter').disabled = true;
  state.socket.emit('stop-letter');
}

function showLetterRevealed(letter, stoppedBy) {
  playSound('stop');
  const letterEl = document.getElementById('cycling-letter');
  letterEl.classList.remove('cycling');
  letterEl.textContent = letter;
  letterEl.classList.add('letter-revealed-glow');

  document.getElementById('btn-stop-letter').classList.add('hidden');
  const revealed = document.getElementById('letter-revealed');
  revealed.classList.remove('hidden');
  
  // stoppedBy is already the player name string from the server
  document.getElementById('letter-stopped-by').textContent = `Detenido por: ${stoppedBy}`;
  document.getElementById('letter-revealed-text').textContent = `¡La letra es ${letter}!`;

  // Auto transition to game board
  setTimeout(() => {
    // Reset view for next round
    letterEl.classList.remove('letter-revealed-glow');
    document.getElementById('btn-stop-letter').classList.remove('hidden');
    document.getElementById('btn-stop-letter').disabled = false;
    revealed.classList.add('hidden');
    document.querySelector('.countdown-container').classList.remove('hidden');
    document.getElementById('letter-cycling-container').classList.add('hidden');
    
    startPlayingRound();
  }, 2500);
}

// --- Game Grid ---
function startPlayingRound() {
  showScreen('screen-game');
  state.hasSubmitted = false;
  state.hasTuttiFrutti = false;
  state.answers = {};
  
  const myPlayer = state.players.find(p => p.id === state.playerId);
  const myScore = myPlayer ? myPlayer.score : 0;
  
  document.getElementById('current-round-text').textContent = `Ronda ${state.currentRound} de ${state.settings.rounds}`;
  document.getElementById('game-player-score').textContent = `${myScore} pts`;
  document.getElementById('game-current-letter').textContent = state.currentLetter;
  document.getElementById('tutti-frutti-timer-box').classList.add('hidden');
  document.getElementById('tf-overlay').classList.add('hidden');
  document.getElementById('btn-tutti-frutti').disabled = false;
  document.getElementById('btn-tutti-frutti').textContent = '¡TUTTI FRUTTI! 🍊';
  
  renderGameGrid();
  renderStatusBadges([]);
}

function renderGameGrid() {
  const thead = document.getElementById('game-table-header');
  const trow = document.getElementById('game-table-row');
  
  thead.innerHTML = state.settings.categories.map(c => `<th>${c}</th>`).join('');
  
  trow.innerHTML = state.settings.categories.map((c, i) => `
    <td>
      <input type="text" data-cat="${c}" id="input-${i}" autocomplete="off" 
             placeholder="${state.currentLetter}...">
    </td>
  `).join('');

  // Setup input listeners (no dropdown suggestions)
  state.settings.categories.forEach((c, i) => {
    const input = document.getElementById(`input-${i}`);
    setupInput(input, c);
  });
  
  // Focus first input
  setTimeout(() => document.getElementById('input-0')?.focus(), 100);
}

function setupInput(input, category) {
  input.addEventListener('input', () => {
    const val = input.value.trim();
    
    if (val.length > 0) {
      const isValid = (typeof window.isValidCategoryWord === 'function')
        ? window.isValidCategoryWord(val, category, state.currentLetter)
        : (val.normalize('NFD').replace(/[\u0300-\u036f]/g, '')[0].toUpperCase() === state.currentLetter && val.length >= 2);
      
      if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
      }
    } else {
      input.classList.remove('invalid', 'valid');
    }

    state.answers[category] = val; // save to state
  });
}

function setupAutocomplete(input, dropdown, category) {
  let selectedIndex = -1;

  input.addEventListener('input', () => {
    const val = input.value.trim();
    
    // Auto capitalize first letter
    if(val.length > 0) {
      if(val[0].toUpperCase() !== state.currentLetter) {
        input.classList.add('invalid');
        input.classList.remove('valid');
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }
    } else {
      input.classList.remove('invalid', 'valid');
    }

    state.answers[category] = val; // save to state

    // Dictionary matching — findSuggestions returns [{word, distance}]
    if (val.length > 0 && typeof window.findSuggestions === 'function') {
      const suggestions = window.findSuggestions(val, category, state.currentLetter);
      if(suggestions && suggestions.length > 0) {
        dropdown.innerHTML = suggestions.slice(0, 5).map((s, idx) => `
          <div class="suggestion-item" data-index="${idx}">${highlightMatch(s.word, val)}</div>
        `).join('');
        dropdown.classList.add('active');
        selectedIndex = -1;
      } else {
        dropdown.classList.remove('active');
      }
    } else {
      dropdown.classList.remove('active');
    }
  });

  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.suggestion-item');
    if(!dropdown.classList.contains('active') || items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateDropdownSelection(items, selectedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateDropdownSelection(items, selectedIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if(selectedIndex >= 0) {
        input.value = items[selectedIndex].textContent;
        state.answers[category] = input.value;
        input.classList.remove('invalid');
        input.classList.add('valid');
        dropdown.classList.remove('active');
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('active');
    }
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.suggestion-item');
    if(item) {
      input.value = item.textContent;
      state.answers[category] = input.value;
      input.classList.remove('invalid');
      input.classList.add('valid');
      dropdown.classList.remove('active');
      input.focus();
    }
  });
}

function highlightMatch(str, match) {
  const regex = new RegExp(`^(${match})`, 'i');
  return str.replace(regex, `<span class="match-highlight">$1</span>`);
}

function updateDropdownSelection(items, index) {
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === index);
  });
}

function renderStatusBadges(submittedIds = []) {
  const container = document.getElementById('status-badges');
  container.innerHTML = state.players.map(p => `
    <span class="badge ${submittedIds.includes(p.id) ? 'done' : ''}">
      ${p.name} ${submittedIds.includes(p.id) ? '✅' : '✍️'}
    </span>
  `).join('');
}

function callTuttiFrutti() {
  if (state.hasSubmitted) return;
  
  // Collect all values
  document.querySelectorAll('.game-table input').forEach(inp => {
    state.answers[inp.dataset.cat] = inp.value.trim();
  });

  state.hasSubmitted = true;
  document.getElementById('btn-tutti-frutti').disabled = true;
  document.getElementById('btn-tutti-frutti').textContent = 'Esperando a los demás...';
  
  state.socket.emit('tutti-frutti');
  state.socket.emit('submit-answers', { answers: state.answers });
}

function showTuttiFruttiOverlay(playerName, seconds) {
  if(!state.hasSubmitted) {
    const overlay = document.getElementById('tf-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('tf-caller-name').textContent = `¡${playerName} cantó TUTTI FRUTTI!`;
    document.getElementById('tf-overlay-seconds').textContent = seconds;
    
    // Auto submit when time runs out handled by server sending round-results,
    // but let's submit local state immediately just in case
    document.querySelectorAll('.game-table input').forEach(inp => {
      state.answers[inp.dataset.cat] = inp.value.trim();
    });
    state.socket.emit('submit-answers', { answers: state.answers });
    state.hasSubmitted = true;
  }
}

// --- Results ---
function renderResults(results) {
  document.getElementById('results-letter').textContent = state.currentLetter;
  
  const thead = document.getElementById('results-table-header');
  const tbody = document.getElementById('results-table-body');
  
  thead.innerHTML = `
    <tr>
      <th>Jugador</th>
      ${state.settings.categories.map(c => `<th>${c}</th>`).join('')}
      <th>Total Ronda</th>
    </tr>
  `;

  tbody.innerHTML = results.map(r => {
    const isMe = (r.playerId === state.playerId);
    return `
    <tr class="${isMe ? 'my-row' : ''}">
      <td class="text-bold">${r.playerName} ${isMe ? '(yo)' : ''}</td>
      ${state.settings.categories.map(c => {
        const wordData = r.answers ? r.answers[c] : null;
        const pts = wordData ? wordData.points : 0;
        const ptsClass = `pts-${pts}`;
        const word = wordData && wordData.word ? wordData.word : '-';
        const otherAns = getOtherPlayersAnswers(c, r.playerId, results);
        
        return `
          <td class="answer-cell">
            <div class="main-answer">
              <span>${word}</span>
              <span class="pts-badge ${ptsClass}">${pts}</span>
            </div>
            ${otherAns ? `<div class="other-answers">${otherAns}</div>` : ''}
          </td>
        `;
      }).join('')}
      <td class="row-total">+${r.roundTotal}</td>
    </tr>
  `;
  }).join('');
}

function getOtherPlayersAnswers(category, currentPlayerId, results) {
  return results
    .filter(r => r.playerId !== currentPlayerId && r.answers && r.answers[category] && r.answers[category].word)
    .map(r => `${r.playerName}: ${r.answers[category].word}`)
    .join(', ');
}

function renderLeaderboard(results) {
  // Update state players with new totals from results
  results.forEach(r => {
    const p = state.players.find(pl => pl.id === r.playerId);
    if(p) p.score = r.gameTotal;
  });
  
  // Update header score if game screen is active
  const myPlayer = state.players.find(p => p.id === state.playerId);
  if (myPlayer) {
    const scoreEl = document.getElementById('game-player-score');
    if (scoreEl) scoreEl.textContent = `${myPlayer.score} pts`;
  }
  
  // Sort by score DESC
  const sorted = [...state.players].sort((a,b) => b.score - a.score);
  
  document.getElementById('partial-leaderboard').innerHTML = sorted.map((p, i) => `
    <li>
      <span>${i+1}. ${p.name}</span>
      <span class="text-accent">${p.score} pts</span>
    </li>
  `).join('');
}

// --- Game Over ---
function renderGameOver(rankings) {
  // rankings = [{ playerName, score, position }]
  // Update final leaderboard list
  document.getElementById('final-leaderboard').innerHTML = rankings.map((p, i) => `
    <li>
      <span>${i === 0 ? '👑' : ''} ${i+1}. ${p.playerName}</span>
      <span class="text-accent">${p.score} pts</span>
    </li>
  `).join('');

  // Setup Podium — order is: 2nd | 1st | 3rd
  const top3 = rankings.slice(0, 3);
  
  // 1st place (center, tallest)
  if(top3[0]) {
    document.getElementById('podium-1').querySelector('.podium-name').textContent = top3[0].playerName;
    document.getElementById('podium-1').querySelector('.podium-score').textContent = `${top3[0].score} pts`;
    document.getElementById('podium-1').style.visibility = 'visible';
  }

  // 2nd place (left)
  if(top3[1]) {
    document.getElementById('podium-2').querySelector('.podium-name').textContent = top3[1].playerName;
    document.getElementById('podium-2').querySelector('.podium-score').textContent = `${top3[1].score} pts`;
    document.getElementById('podium-2').style.visibility = 'visible';
  } else {
    document.getElementById('podium-2').style.visibility = 'hidden';
  }
  
  // 3rd place (right)
  if(top3[2]) {
    document.getElementById('podium-3').querySelector('.podium-name').textContent = top3[2].playerName;
    document.getElementById('podium-3').querySelector('.podium-score').textContent = `${top3[2].score} pts`;
    document.getElementById('podium-3').style.visibility = 'visible';
  } else {
    document.getElementById('podium-3').style.visibility = 'hidden';
  }

  document.getElementById('btn-new-game').classList.remove('hidden');
  document.getElementById('btn-back-home').classList.remove('hidden');
}

// --- Utilities ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function playSound(type) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'countdown') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'stop') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } else if (type === 'tuttifrutti') {
    playMelody([440, 554.37, 659.25], 0.15); // A4, C#5, E5
  } else if (type === 'win') {
    playMelody([523.25, 659.25, 783.99, 1046.50], 0.2); // C5, E5, G5, C6
  }
}

function playGoSound() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

function playMelody(frequencies, duration) {
  if(!audioCtx) return;
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    const startTime = audioCtx.currentTime + (i * duration);
    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff6b35', '#4ecdc4', '#ffe66d', '#ff6b6b', '#51cf66', '#ffffff'];
  
  for(let i=0; i<100; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti-piece';
    
    // random props
    const left = Math.random() * 100;
    const animDuration = Math.random() * 3 + 2;
    const animDelay = Math.random() * 2;
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    conf.style.left = `${left}vw`;
    conf.style.width = `${size}px`;
    conf.style.height = `${size * 0.5}px`;
    conf.style.backgroundColor = color;
    conf.style.animationDuration = `${animDuration}s`;
    conf.style.animationDelay = `${animDelay}s`;
    
    container.appendChild(conf);
  }
  
  // Clean up after 6s
  setTimeout(() => {
    container.innerHTML = '';
  }, 6000);
}
