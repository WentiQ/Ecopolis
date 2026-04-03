/* ============================================================
   ECOPOLIS — game.js
   Complete game engine: board rendering, turn management,
   all 10 phases, events, building, wheel, win/lose logic
   ============================================================ */

'use strict';

// ============================================================
// GAME STATE
// ============================================================
let G = {
  players: [],
  currentPlayerIdx: 0,
  round: 1,
  globalEco: 100,
  phase: 0,          // 0=setup, 1-10=phases, 99=gameover
  diceRoll: [1,1],
  diceTotal: 0,
  isCleanRoll: false,
  pendingMove: 0,
  buildingDeck: [],  // shuffled deck
  drawnBuilding: null,
  pendingChainReaction: null,
  wheelSpinning: false,
  innerPathMode: false,
  boardDims: {},     // calculated from DOM
  spacePositions: {},// {spaceId: {x, y, cx, cy}}
};

// ============================================================
// UTILITY
// ============================================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function $ (id) { return document.getElementById(id); }

function log(msg, cls = '') {
  const el = document.createElement('div');
  el.className = 'log-entry' + (cls ? ' ' + cls : '');
  el.textContent = msg;
  $('gameLog').prepend(el);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ============================================================
// SETUP SCREEN
// ============================================================
let numPlayers = 2;

function initSetupScreen() {
  $('rulesBody').innerHTML = RULES_HTML;
  renderPlayerSetupRows();
  document.querySelectorAll('.pcbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pcbtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      numPlayers = parseInt(btn.dataset.n);
      renderPlayerSetupRows();
    });
  });
  $('btnStartGame').addEventListener('click', startGame);
  $('btnShowRules').addEventListener('click', () => showScreen('screen-rules'));
  $('btnCloseRules').addEventListener('click', () => showScreen('screen-setup'));
  $('btnRules2').addEventListener('click', () => showScreen('screen-rules'));
  $('btnQuit').addEventListener('click', () => { if(confirm('Quit game?')) showScreen('screen-setup'); });
  $('btnPlayAgain').addEventListener('click', () => { showModal(null); showScreen('screen-setup'); });
}

function renderPlayerSetupRows() {
  const container = $('setupPlayers');
  container.innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    const row = document.createElement('div');
    row.className = 'player-setup-row';
    row.innerHTML = `
      <div class="player-color-dot" style="background:${PLAYER_COLORS[i]}"></div>
      <input id="pname${i}" type="text" placeholder="${PLAYER_NAMES_DEFAULT[i]}" maxlength="18" value="${PLAYER_NAMES_DEFAULT[i]}"/>
    `;
    container.appendChild(row);
  }
}

// ============================================================
// START GAME
// ============================================================
function startGame() {
  // Build players
  G.players = [];
  for (let i = 0; i < numPlayers; i++) {
    const nameEl = $(`pname${i}`);
    G.players.push({
      id: i,
      name: nameEl ? (nameEl.value.trim() || PLAYER_NAMES_DEFAULT[i]) : PLAYER_NAMES_DEFAULT[i],
      color: PLAYER_COLORS[i],
      position: 1,       // space 1 = start
      onInner: false,
      innerSpaceId: null,
      capital: 100,
      wellbeing: 100,
      pollution: 0,
      land: 100,
      vp: 0,
      echoInventory: 0,
      buildings: [],      // array of building card ids
      setCounts: {},      // {cat: count}
      completedSets: {},  // {cat: bool}
      centerVisits: 0,
      eliminated: false,
      pendingChainEffect: null,
    });
  }
  G.currentPlayerIdx = 0;
  G.round = 1;
  G.globalEco = 100;
  G.phase = 1;
  G.buildingDeck = shuffle([...BUILDING_CARDS]);

  showScreen('screen-game');
  buildBoard();
  buildVPTrack();
  buildDashboards();
  updateEcoTrack();
  updateAllDashboards();
  updateVPTrack();
  beginTurn();
}

// ============================================================
// BOARD BUILDING
// ============================================================
function buildBoard() {
  const inner = $('boardInner');
  const W = inner.offsetWidth;
  const H = inner.offsetHeight;
  G.boardDims = { W, H };

  // Clear previous
  $('boardSpaces').innerHTML = '';
  $('playerTokensLayer').innerHTML = '';

  // Space geometry parameters
  const pad = 14;        // outer margin
  const spW = Math.max(38, Math.floor((W - pad*2) / 22));    // space width
  const spH = Math.max(44, Math.floor((H - pad*2) / 13));    // space height

  // Outer loop rectangle bounds
  const L = pad, R = W - pad - spW, T = pad, B = H - pad - spH;
  const oW = R - L;  // outer width
  const oH = B - T;  // outer height

  // Number of spaces per side (top=20, right=20, bottom=20, left=20)
  const perSide = 20;
  const topStep  = oW / perSide;
  const rightStep= oH / perSide;
  const botStep  = oW / perSide;
  const leftStep = oH / perSide;

  G.boardDims = { W, H, L, R, T, B, oW, oH, spW, spH, pad,
                  topStep, rightStep, botStep, leftStep };

  // Position for each outer space (1-80)
  // top: 1-20 left→right
  // right: 21-40 top→bottom
  // bottom: 41-60 right→left
  // left: 61-80 bottom→top
  const positions = {};

  for (let i = 0; i < 20; i++) {
    const id = i + 1;
    positions[id] = { x: L + i * topStep, y: T };
  }
  for (let i = 0; i < 20; i++) {
    const id = i + 21;
    positions[id] = { x: R, y: T + i * rightStep };
  }
  for (let i = 0; i < 20; i++) {
    const id = i + 41;
    positions[id] = { x: R - i * botStep, y: B };
  }
  for (let i = 0; i < 20; i++) {
    const id = i + 61;
    positions[id] = { x: L, y: B - i * leftStep };
  }

  G.spacePositions = positions;

  // Render outer spaces
  OUTER_SPACES.forEach(sp => {
    const pos = positions[sp.id];
    if (!pos) return;
    const el = document.createElement('div');
    el.className = `board-space sp-${sp.type}`;
    el.id = `space-${sp.id}`;
    el.style.left = pos.x + 'px';
    el.style.top  = pos.y + 'px';
    el.style.width  = (spW - 2) + 'px';
    el.style.height = (spH - 2) + 'px';
    el.title = sp.tooltip || `Space ${sp.id}: ${sp.label}`;
    el.innerHTML = `<span class="space-num">${sp.id}</span><span class="space-icon">${sp.icon}</span><span class="space-label">${sp.label}</span>`;
    $('boardSpaces').appendChild(el);
  });

  // Center hub
  const cX = W / 2, cY = H / 2;
  const hubR = Math.min(oW, oH) * 0.20;
  const hub = $('centerHub');
  hub.style.left   = (cX - hubR) + 'px';
  hub.style.top    = (cY - hubR) + 'px';
  hub.style.width  = (hubR * 2) + 'px';
  hub.style.height = (hubR * 2) + 'px';
  positions['CENTER'] = { x: cX - hubR, y: cY - hubR, cx: cX, cy: cY };
  G.spacePositions = positions;

  // Inner path lines
  drawInnerPaths(L, R, T, B, cX, cY, pad, spW, spH);

  // Inner path spaces
  placeInnerSpaces(L, R, T, B, cX, cY, spW, spH);

  // Player tokens
  placePlayerTokens();
}

function drawInnerPaths(L, R, T, B, cX, cY, pad, spW, spH) {
  const cont = $('boardSpaces');

  function addLine(x, y, w, h, cls) {
    const d = document.createElement('div');
    d.className = 'inner-path-line ' + cls;
    d.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
    cont.appendChild(d);
  }

  const midX = cX, midY = cY;

  // Horizontal left path (well-being): from left outer to center
  addLine(L + spW, midY - 10, midX - L - spW - spW*0.8, 20, 'ipl-well');
  // Horizontal right path (industry): from center to right outer
  addLine(midX + spW*0.8, midY - 10, R - midX - spW*0.8, 20, 'ipl-indus');
  // Vertical top path (eco): from top outer to center
  addLine(midX - 10, T + spH, 20, midY - T - spH - spH*0.8, 'ipl-eco');
  // Vertical bottom path (eco): from center to bottom outer
  addLine(midX - 10, midY + spH*0.8, 20, B - midY - spH*0.8, 'ipl-eco');

  // Intersection dots at join points
  function addIntersect(x, y, label) {
    const d = document.createElement('div');
    d.className = 'intersection-dot';
    d.style.left = x + 'px'; d.style.top = y + 'px';
    d.title = 'Intersection: ' + label;
    d.innerHTML = '⊕';
    cont.appendChild(d);
  }
  addIntersect(L + spW,     midY,  'West Entry');
  addIntersect(R,           midY,  'East Entry');
  addIntersect(midX,  T + spH,    'North Entry');
  addIntersect(midX,  B,          'South Entry');
}

function placeInnerSpaces(L, R, T, B, cX, cY, spW, spH) {
  const cont = $('boardSpaces');
  const iW = spW - 4, iH = spH - 4;
  const positions = G.spacePositions;

  const innerLayout = [
    // Horizontal left (well-being path): W1-W5
    { id:'W1', x: L + spW + 2,                y: cY - iH/2 },
    { id:'W2', x: L + spW + iW + 6,           y: cY - iH/2 },
    { id:'W3', x: L + spW + (iW+6)*2,         y: cY - iH/2 },
    { id:'W4', x: L + spW + (iW+6)*3,         y: cY - iH/2 },
    { id:'W5', x: L + spW + (iW+6)*4,         y: cY - iH/2 },
    // Horizontal right (industry path): I1-I5
    { id:'I1', x: cX + spW*0.85,              y: cY - iH/2 },
    { id:'I2', x: cX + spW*0.85 + iW+6,       y: cY - iH/2 },
    { id:'I3', x: cX + spW*0.85 + (iW+6)*2,   y: cY - iH/2 },
    { id:'I4', x: cX + spW*0.85 + (iW+6)*3,   y: cY - iH/2 },
    { id:'I5', x: cX + spW*0.85 + (iW+6)*4,   y: cY - iH/2 },
    // Vertical top (eco path): E1-E4
    { id:'E1', x: cX - iW/2, y: T + spH + 2 },
    { id:'E2', x: cX - iW/2, y: T + spH + iH + 6 },
    { id:'E3', x: cX - iW/2, y: T + spH + (iH+6)*2 },
    { id:'E4', x: cX - iW/2, y: T + spH + (iH+6)*3 },
    // Vertical bottom (eco path): E5-E8
    { id:'E5', x: cX - iW/2, y: cY + spH*0.85 },
    { id:'E6', x: cX - iW/2, y: cY + spH*0.85 + iH+6 },
    { id:'E7', x: cX - iW/2, y: cY + spH*0.85 + (iH+6)*2 },
    { id:'E8', x: cX - iW/2, y: cY + spH*0.85 + (iH+6)*3 },
  ];

  INNER_SPACES.forEach(sp => {
    const layout = innerLayout.find(l => l.id === sp.id);
    if (!layout) return;
    positions[sp.id] = { x: layout.x, y: layout.y, cx: layout.x + iW/2, cy: layout.y + iH/2 };
    const el = document.createElement('div');
    el.className = `board-space ${sp.type}`;
    el.id = `space-${sp.id}`;
    el.style.left = layout.x + 'px';
    el.style.top  = layout.y + 'px';
    el.style.width  = iW + 'px';
    el.style.height = iH + 'px';
    el.title = `Inner Space ${sp.id}: ${sp.label}`;
    el.innerHTML = `<span class="space-num">${sp.id}</span><span class="space-icon">${sp.icon}</span><span class="space-label">${sp.label}</span>`;
    cont.appendChild(el);
  });

  G.spacePositions = positions;
}

function placePlayerTokens() {
  const layer = $('playerTokensLayer');
  layer.innerHTML = '';
  G.players.forEach(p => {
    const tok = document.createElement('div');
    tok.className = 'player-token';
    tok.id = `token-${p.id}`;
    tok.textContent = (p.id + 1).toString();
    tok.style.background = p.color;
    layer.appendChild(tok);
    moveToken(p);
  });
}

function moveToken(player) {
  const tok = $(`token-${player.id}`);
  if (!tok) return;
  const pos = player.onInner ? G.spacePositions[player.innerSpaceId] : G.spacePositions[player.position];
  if (!pos) return;
  const { spW, spH } = G.boardDims;
  const offset = player.id * 6; // slight offset so tokens don't overlap perfectly
  tok.style.left = (pos.x + spW/2 + offset) + 'px';
  tok.style.top  = (pos.y + spH/2 + offset) + 'px';
}

// ============================================================
// VP TRACK
// ============================================================
function buildVPTrack() {
  const track = $('vpTrack');
  track.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const cell = document.createElement('div');
    cell.className = 'vp-cell' + (i % 5 === 0 ? ' milestone' : '') + (i === 30 ? ' win-cell' : '');
    cell.id = `vp-cell-${i}`;
    cell.textContent = i;
    track.appendChild(cell);
  }
}

function updateVPTrack() {
  // Clear all dots
  document.querySelectorAll('.vp-player-dot').forEach(d => d.remove());
  G.players.forEach(p => {
    if (p.eliminated) return;
    const cellId = clamp(p.vp, 0, 30);
    const cell = $(`vp-cell-${cellId}`);
    if (!cell) return;
    const dot = document.createElement('div');
    dot.className = 'vp-player-dot';
    dot.style.background = p.color;
    cell.appendChild(dot);
  });
}

// ============================================================
// DASHBOARDS
// ============================================================
function buildDashboards() {
  const cont = $('dashboards');
  cont.innerHTML = '';
  G.players.forEach(p => {
    const d = document.createElement('div');
    d.className = 'dashboard';
    d.id = `dashboard-${p.id}`;
    d.innerHTML = `
      <div class="dash-head" style="background:${p.color}">
        <div class="dash-token" style="background:${p.color}"></div>
        <span class="dash-pname">${p.name}</span>
        <span class="dash-space-label" id="dash-space-${p.id}">Space 1</span>
        <span class="dash-vp-badge" id="dash-vp-${p.id}">0 VP</span>
      </div>
      <div class="dash-body">
        <div class="dash-stat"><span class="dash-stat-icon">💰</span><span>Capital</span><span class="dash-stat-val sv-cap" id="ds-cap-${p.id}">100</span></div>
        <div class="dash-stat"><span class="dash-stat-icon">😊</span><span>Well-being</span><span class="dash-stat-val sv-wb" id="ds-wb-${p.id}">100</span></div>
        <div class="dash-stat"><span class="dash-stat-icon">💨</span><span>Pollution</span><span class="dash-stat-val sv-pol" id="ds-pol-${p.id}">0</span></div>
        <div class="dash-stat"><span class="dash-stat-icon">🗺</span><span>Land</span><span class="dash-stat-val sv-land" id="ds-land-${p.id}">100</span></div>
        <div class="dash-stat"><span class="dash-stat-icon">📦</span><span>Echo Inv.</span><span class="dash-stat-val sv-echo" id="ds-echo-${p.id}">0</span></div>
      </div>
      <div class="dash-buildings" id="dash-builds-${p.id}"></div>
    `;
    cont.appendChild(d);
  });
}

function updateDashboard(p) {
  $(`ds-cap-${p.id}`).textContent  = p.capital;
  $(`ds-wb-${p.id}`).textContent   = p.wellbeing;
  $(`ds-pol-${p.id}`).textContent  = p.pollution;
  $(`ds-land-${p.id}`).textContent = p.land;
  $(`ds-echo-${p.id}`).textContent = p.echoInventory;
  $(`dash-vp-${p.id}`).textContent = `${p.vp} VP`;
  const spaceLabel = p.onInner ? `Inner ${p.innerSpaceId}` : (p.position === 'CENTER' ? 'CENTER' : `Space ${p.position}`);
  $(`dash-space-${p.id}`).textContent = spaceLabel;
  const dash = $(`dashboard-${p.id}`);
  if (dash) {
    dash.classList.toggle('active-player', p.id === G.currentPlayerIdx);
    dash.classList.toggle('eliminated', p.eliminated);
  }
  // Buildings
  const bEl = $(`dash-builds-${p.id}`);
  bEl.innerHTML = '';
  p.buildings.forEach(bid => {
    const card = BUILDING_CARDS.find(c => c.id === bid);
    if (!card) return;
    const tag = document.createElement('span');
    tag.className = 'built-tag';
    tag.title = card.name;
    tag.textContent = card.icon + ' ' + card.name.slice(0, 12);
    bEl.appendChild(tag);
  });
}

function updateAllDashboards() {
  G.players.forEach(p => updateDashboard(p));
}

// ============================================================
// ECO TRACK
// ============================================================
function updateEcoTrack() {
  const pct = (G.globalEco / 100) * 100;
  $('ecoTrackFill').style.width = pct + '%';
  $('ecoTrackValue').textContent = G.globalEco;
  $('ecoTrackFill').style.filter = G.globalEco < 20 ? 'brightness(1.5)' : 'none';
}

// ============================================================
// TURN MANAGEMENT
// ============================================================
function beginTurn() {
  const p = currentPlayer();
  $('roundLabel').textContent = `Round ${G.round}`;
  $('turnPlayerName').textContent = p.name;
  $('turnPlayerName').style.color = p.color;
  setPhase(1);
  setMessage('');
  $('die1').textContent = '?';
  $('die2').textContent = '?';
  $('diceTotal').textContent = '— Roll to Start —';
  setActions([{id:'btnRoll', label:'🎲 Roll Dice', cls:''}]);
  hideBuildPanel();
  hideChoicePanel();
  $('btnRoll').onclick = doRollDice;
  updateAllDashboards();

  // Apply pending chain reaction effects from previous round
  if (p.pendingChainEffect) {
    applyEffects(p, p.pendingChainEffect);
    log(`${p.name}'s chain reaction resolves: ${JSON.stringify(p.pendingChainEffect)}`, 'log-info');
    p.pendingChainEffect = null;
    updateDashboard(p);
  }

  log(`— ${p.name}'s turn begins —`, 'log-gold');
}

function currentPlayer() { return G.players[G.currentPlayerIdx]; }

function setPhase(n) {
  G.phase = n;
  const labels = {
    1:'Phase 1: Roll Dice', 2:'Phase 2: Echo Release', 3:'Phase 3: Movement',
    4:'Phase 4: Set Bonuses', 5:'Phase 5: Resolve Space', 6:'Phase 6: Build',
    7:'Phase 7: Production', 8:'Phase 8: Check Thresholds',
    9:'Phase 9: Global Events Wheel', 10:'Phase 10: End of Turn'
  };
  $('turnPhaseLabel').textContent = labels[n] || '';
}

function setMessage(msg) {
  $('turnMessage').innerHTML = msg;
}

function setActions(actions) {
  const cont = $('turnActions');
  cont.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'btn-action ' + (a.cls || '');
    btn.id = a.id;
    btn.textContent = a.label;
    if (a.disabled) btn.disabled = true;
    cont.appendChild(btn);
  });
}

function hideBuildPanel() { $('buildPanel').style.display = 'none'; }
function showBuildPanel()  { $('buildPanel').style.display = 'block'; }
function hideChoicePanel() { $('choicePanel').style.display = 'none'; }
function showChoicePanel() { $('choicePanel').style.display = 'block'; }

// ============================================================
// PHASE 1: ROLL DICE
// ============================================================
function doRollDice() {
  setPhase(1);
  const p = currentPlayer();
  const d1 = Math.ceil(Math.random() * 6);
  const d2 = Math.ceil(Math.random() * 6);
  G.diceRoll = [d1, d2];
  G.diceTotal = d1 + d2;
  G.isCleanRoll = d1 === d2;

  // Animate dice
  const die1El = $('die1'), die2El = $('die2');
  die1El.classList.add('rolling'); die2El.classList.add('rolling');
  setTimeout(() => {
    die1El.classList.remove('rolling'); die2El.classList.remove('rolling');
    die1El.textContent = d1; die2El.textContent = d2;
    $('diceTotal').textContent = `Total: ${G.diceTotal}${G.isCleanRoll ? ' 🎉 CLEAN ROLL!' : ''}`;
    log(`${p.name} rolls ${d1} + ${d2} = ${G.diceTotal}${G.isCleanRoll ? ' (Clean Roll!)' : ''}`, 'log-info');
    doEchoRelease();
  }, 500);
  $('btnRoll').disabled = true;
}

// ============================================================
// PHASE 2: ECHO RELEASE
// ============================================================
function doEchoRelease() {
  setPhase(2);
  const p = currentPlayer();

  if (G.isCleanRoll) {
    // Clean Roll: remove 2 from Echo Inventory permanently
    const removed = Math.min(2, p.echoInventory);
    p.echoInventory = Math.max(0, p.echoInventory - 2);
    log(`${p.name}: CLEAN ROLL! Removed ${removed} pollution from Echo Inventory permanently.`, 'log-good');
    setMessage(`🎉 Clean Roll! Removed <strong>${removed}</strong> Echo pollution permanently.`);
  } else {
    // Normal: release up to diceTotal from Echo Inventory to Personal Pollution
    const release = Math.min(G.diceTotal, p.echoInventory);
    p.pollution += release;
    p.echoInventory -= release;
    if (release > 0) {
      log(`${p.name}: Echo Release — ${release} pollution moved to Personal Pollution.`, 'log-bad');
      setMessage(`💨 Echo Release: <strong>+${release}</strong> Personal Pollution.`);
    } else {
      setMessage('📦 Echo Inventory empty — no pollution released.');
    }
  }
  updateDashboard(p);

  // Check if player is eliminated by pollution before moving
  if (checkElimination(p)) return;

  setTimeout(() => doMovement(), 700);
}

// ============================================================
// PHASE 3: MOVEMENT
// ============================================================
function doMovement() {
  setPhase(3);
  const p = currentPlayer();

  if (p.onInner) {
    // On inner path: show movement options
    setMessage(`You are on inner path. Move <strong>${G.diceTotal}</strong> steps. Choose direction or continue to Center.`);
    setActions([
      { id:'btnMoveCenter', label:`🎯 Move Toward Center (${G.diceTotal})`, cls:'btn-move' },
      { id:'btnMoveBack',   label:`↩ Move Outward (${G.diceTotal})`,         cls:'btn-move' },
    ]);
    $('btnMoveCenter').onclick = () => doInnerMove('center');
    $('btnMoveBack').onclick   = () => doInnerMove('back');
  } else {
    // On outer loop: move forward
    const oldPos = p.position;
    let newPos = p.position + G.diceTotal;
    let passedStart = false;
    if (newPos > 80) {
      newPos = ((newPos - 1) % 80) + 1;
      passedStart = true;
    }
    p.position = newPos;

    if (passedStart || newPos === 1) {
      p.capital += 2;
      log(`${p.name} passed START — collected +2 Capital!`, 'log-good');
    }

    log(`${p.name} moves from ${oldPos} to ${newPos}.`);
    setMessage(`Moved to Space <strong>${newPos}</strong>${passedStart ? ' (+2 Capital from START)' : ''}`);
    moveToken(p);
    highlightSpace(newPos);
    updateDashboard(p);

    // Check if space is an intersection (offer inner path)
    const intersectionSpaces = [1, 20, 21, 40, 41, 60, 61, 80];
    if (intersectionSpaces.includes(newPos)) {
      setActions([
        { id:'btnStayOuter', label:'Stay on Outer Loop', cls:'btn-ok' },
        { id:'btnEnterInner', label:'↩ Enter Inner Path', cls:'btn-move' },
      ]);
      setMessage(`You landed on an intersection! Stay on outer loop or enter an inner path?`);
      $('btnStayOuter').onclick  = () => afterMovement();
      $('btnEnterInner').onclick = () => offerInnerPath(p);
    } else {
      setTimeout(() => afterMovement(), 600);
    }
  }
}

function offerInnerPath(p) {
  // Map intersection to available inner paths
  const opts = {
    1:  [{label:'🌿 Eco Path (Top)', id:'E1'}, {label:'😊 Well-being Path', id:'W1'}],
    20: [{label:'🌿 Eco Path (Top)', id:'E1'}],
    21: [{label:'🏭 Industry Path', id:'I1'}],
    40: [{label:'🏭 Industry Path', id:'I5'}],
    41: [{label:'🌿 Eco Path (Bottom)', id:'E5'}],
    60: [{label:'🌿 Eco Path (Bottom)', id:'E8'}],
    61: [{label:'😊 Well-being Path', id:'W5'}],
    80: [{label:'😊 Well-being Path', id:'W1'}],
  };
  const options = opts[p.position] || [];
  if (!options.length) { afterMovement(); return; }

  const actions = options.map(o => ({id:`inner-${o.id}`, label:o.label, cls:'btn-move'}));
  actions.push({id:'btnStay2', label:'Stay on Outer', cls:'btn-ok'});
  setActions(actions);
  options.forEach(o => {
    $(`inner-${o.id}`).onclick = () => {
      p.onInner = true;
      p.innerSpaceId = o.id;
      p.position = p.position; // keep reference outer position for when they return
      moveToken(p);
      log(`${p.name} enters inner path at ${o.id}.`);
      afterMovement();
    };
  });
  $('btnStay2').onclick = () => afterMovement();
}

function doInnerMove(dir) {
  const p = currentPlayer();
  const innerOrder = ['W5','W4','W3','W2','W1','CENTER','I1','I2','I3','I4','I5',
                      'E1','E2','E3','E4','CENTER','E8','E7','E6','E5'];

  if (dir === 'center') {
    // Check if can reach center exactly
    p.position = 'CENTER';
    p.onInner = false;
    p.innerSpaceId = null;
    moveToken(p);
    log(`${p.name} reaches the CENTER HUB!`);
    afterMovement();
  } else {
    // Move back to outer loop
    p.onInner = false;
    p.innerSpaceId = null;
    moveToken(p);
    log(`${p.name} returns to outer loop.`);
    afterMovement();
  }
}

function afterMovement() {
  clearHighlights();
  doSetBonuses();
}

function highlightSpace(id) {
  clearHighlights();
  const el = $(`space-${id}`);
  if (el) el.classList.add('highlight-current');
}
function clearHighlights() {
  document.querySelectorAll('.board-space.highlight-current').forEach(el => el.classList.remove('highlight-current'));
}

// ============================================================
// PHASE 4: SET BONUSES
// ============================================================
function doSetBonuses() {
  setPhase(4);
  const p = currentPlayer();
  let bonuses = [];

  Object.keys(p.completedSets).forEach(cat => {
    if (p.completedSets[cat] && SET_BONUSES[cat]) {
      SET_BONUSES[cat].fn(p);
      bonuses.push(SET_BONUSES[cat].label);
    }
  });

  if (bonuses.length > 0) {
    log(`${p.name} set bonuses: ${bonuses.join(', ')}`, 'log-good');
    setMessage(`✅ Set bonuses applied: ${bonuses.join(', ')}`);
  } else {
    setMessage('');
  }
  updateDashboard(p);
  setTimeout(() => doResolveSpace(), 500);
}

// ============================================================
// PHASE 5: RESOLVE SPACE
// ============================================================
function doResolveSpace() {
  setPhase(5);
  const p = currentPlayer();

  if (p.position === 'CENTER') {
    // Center hub rewards
    p.capital   += 2;
    p.wellbeing += 2;
    p.pollution  = Math.max(0, p.pollution - 1);
    G.globalEco  = Math.min(100, G.globalEco + 1);
    p.centerVisits++;

    let vpBonus = 0;
    if (p.centerVisits % 2 === 0) {
      p.vp++;
      vpBonus = 1;
      log(`${p.name} visits Center for the ${p.centerVisits}${vpBonus ? ' (VP earned!)' : ''} time.`, 'log-gold');
    }

    // Draw free building card
    const freeCard = G.buildingDeck.pop();
    if (freeCard) G.buildingDeck.unshift(freeCard); // keep in deck but show it

    updateEcoTrack();
    updateVPTrack();
    updateDashboard(p);

    showCardModal({
      type: '🌿 CENTER HUB',
      icon: '🌟',
      name: 'Global Eco Hub!',
      desc: 'You landed exactly on the center! The world rewards your city.',
      effects: [
        {label:'+2 Capital', cls:'eff-cap'},
        {label:'+2 Well-being', cls:'eff-wb'},
        {label:'−1 Pollution', cls:'eff-pol'},
        {label:'+1 Global Eco', cls:'eff-eco'},
        vpBonus ? {label:'+1 VP', cls:'eff-vp'} : null,
      ].filter(Boolean),
      onOk: () => {
        // Offer free building card
        p.position = 1; // return to start after center
        p.onInner = false;
        moveToken(p);
        doOptionalBuilding(true); // free build
      }
    });
    return;
  }

  const spaceId = p.position;
  const space = OUTER_SPACES.find(s => s.id === spaceId);
  const innerSpace = INNER_SPACES.find(s => s.id === p.innerSpaceId);
  const activeSpace = p.onInner ? innerSpace : space;

  if (!activeSpace) { doOptionalBuilding(false); return; }

  const type = activeSpace.type;

  if (type === 'crisis' || type === 'sp-crisis') {
    const card = rand(CRISIS_CARDS);
    applyEffects(p, card.effects);
    updateDashboard(p);
    updateEcoTrack();
    showCardModal({
      type: '⚠️ CRISIS CARD',
      icon: card.icon,
      name: card.name,
      desc: card.desc,
      effects: effectsToChips(card.effects),
      onOk: () => {
        if (!checkElimination(p)) doOptionalBuilding(false);
      }
    });
    log(`${p.name} draws CRISIS: ${card.name}`, 'log-bad');
  } else if (type === 'event' || type.includes('event')) {
    // Check for chain reaction (10% chance) or world wonder (5% chance)
    const roll = Math.random();
    if (roll < 0.05 && Math.random() < 0.3) {
      const wonder = rand(WORLD_WONDERS);
      G.players.forEach(pl => { if (!pl.eliminated) applyEffects(pl, wonder.effects); });
      updateAllDashboards(); updateEcoTrack(); updateVPTrack();
      showCardModal({
        type: '🌟 RARE WORLD WONDER',
        icon: wonder.icon,
        name: wonder.name,
        desc: wonder.desc + '\n\n' + wonder.effect,
        effects: effectsToChips(wonder.effects),
        onOk: () => doOptionalBuilding(false)
      });
      log(`🌟 WORLD WONDER: ${wonder.name}!`, 'log-gold');
    } else if (roll < 0.15) {
      const cr = rand(CHAIN_REACTIONS);
      showChoicePanel();
      $('choiceTitle').textContent = `🔗 Chain Reaction: ${cr.name}`;
      $('choiceDesc').textContent  = cr.desc + '\n\n' + cr.triggerText;
      $('choiceOptions').innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = '▸ ' + cr.triggerText;
      btn.onclick = () => {
        applyEffects(p, cr.effects);
        if (cr.nextRound) p.pendingChainEffect = cr.nextRound;
        updateDashboard(p); updateEcoTrack();
        hideChoicePanel();
        doOptionalBuilding(false);
      };
      $('choiceOptions').appendChild(btn);
      log(`${p.name} triggers Chain Reaction: ${cr.name}`, 'log-info');
    } else {
      const card = rand(EVENT_CARDS_OUTER);
      applyEffects(p, card.effects);
      updateDashboard(p); updateEcoTrack();
      showCardModal({
        type: card.type === 'positive' ? '✨ POSITIVE EVENT' : '📋 EVENT CARD',
        icon: card.icon,
        name: card.name,
        desc: card.desc,
        effects: effectsToChips(card.effects),
        onOk: () => {
          if (!checkElimination(p)) doOptionalBuilding(false);
        }
      });
      log(`${p.name} draws event: ${card.name}`, 'log-info');
    }
  } else if (type === 'eco' || type.includes('eco')) {
    // Eco space: offer a dilemma
    if (Math.random() < 0.45) {
      const d = rand(DILEMMAS);
      showDilemma(d);
    } else {
      const card = rand(EVENT_CARDS_OUTER.filter(e => e.effects.pollution !== undefined || e.effects.globalEco !== undefined));
      applyEffects(p, card.effects);
      updateDashboard(p); updateEcoTrack();
      showCardModal({
        type: '🌱 ECO EVENT',
        icon: card.icon,
        name: card.name,
        desc: card.desc,
        effects: effectsToChips(card.effects),
        onOk: () => doOptionalBuilding(false)
      });
      log(`${p.name} draws eco event: ${card.name}`, 'log-good');
    }
  } else if (type === 'well' || type.includes('well')) {
    const positiveWB = EVENT_CARDS_OUTER.filter(e => (e.effects.wellbeing || 0) > 0);
    const card = rand(positiveWB.length ? positiveWB : EVENT_CARDS_OUTER);
    applyEffects(p, card.effects);
    updateDashboard(p);
    showCardModal({
      type: '😊 WELL-BEING EVENT',
      icon: card.icon,
      name: card.name,
      desc: card.desc,
      effects: effectsToChips(card.effects),
      onOk: () => doOptionalBuilding(false)
    });
    log(`${p.name} draws well-being event: ${card.name}`, 'log-info');
  } else if (type === 'indus' || type.includes('indus')) {
    // Industry: gain capital but gain echo pollution
    const capGain = Math.floor(Math.random() * 5) + 3;
    const echoPoll = Math.floor(Math.random() * 4) + 2;
    p.capital += capGain;
    p.echoInventory += echoPoll;
    updateDashboard(p);
    showCardModal({
      type: '🏭 INDUSTRY EVENT',
      icon: '⚙️',
      name: 'Industrial Activity',
      desc: 'Your city\'s industrial sector produces goods and earns capital, but at an environmental cost.',
      effects: [{label:`+${capGain} Capital`, cls:'eff-cap'},{label:`+${echoPoll} Echo Pollution`, cls:'eff-pol'}],
      onOk: () => doOptionalBuilding(false)
    });
    log(`${p.name} gains ${capGain} Capital from industry, +${echoPoll} Echo.`, 'log-info');
  } else if (type === 'start') {
    doOptionalBuilding(false);
  } else {
    doOptionalBuilding(false);
  }
}

function showDilemma(d) {
  showChoicePanel();
  $('choiceTitle').textContent = `🌿 Ecological Dilemma: ${d.name} ${d.icon}`;
  $('choiceDesc').textContent  = d.desc;
  $('choiceOptions').innerHTML = '';
  d.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = opt.text;
    btn.onclick = () => {
      const p = currentPlayer();
      applyEffects(p, opt.effects);
      updateDashboard(p); updateEcoTrack();
      hideChoicePanel();
      log(`${p.name} chose: ${opt.text}`, 'log-info');
      doOptionalBuilding(false);
    };
    $('choiceOptions').appendChild(btn);
  });
  log(`${currentPlayer().name} faces dilemma: ${d.name}`, 'log-gold');
}

// ============================================================
// PHASE 6: OPTIONAL BUILDING
// ============================================================
function doOptionalBuilding(isFree) {
  setPhase(6);
  const p = currentPlayer();
  hideBuildPanel();

  // Check if player has resources to build anything
  const available = BUILDING_CARDS.filter(card => {
    if (isFree) return !p.buildings.includes(card.id);
    return !p.buildings.includes(card.id) &&
           p.capital >= card.cost.capital &&
           p.land    >= card.cost.land;
  });

  if (available.length === 0) {
    setMessage('No affordable buildings available.');
    setTimeout(() => doProduction(), 400);
    return;
  }

  // Show build panel
  showBuildPanel();
  renderBuildList(p, isFree);

  $('btnSkipBuild').onclick = () => {
    hideBuildPanel();
    doProduction();
  };

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBuildList(p, isFree, btn.dataset.cat);
    });
  });
}

function renderBuildList(p, isFree, filterCat = 'all') {
  const list = $('buildList');
  list.innerHTML = '';

  let cards = BUILDING_CARDS.filter(card => !p.buildings.includes(card.id));
  if (filterCat !== 'all') cards = cards.filter(c => c.cat === filterCat);

  cards.forEach(card => {
    const canAfford = isFree || (p.capital >= card.cost.capital && p.land >= card.cost.land);
    const el = document.createElement('div');
    el.className = 'build-card ' + (canAfford ? 'affordable' : 'unaffordable');
    el.innerHTML = `
      <span class="bc-icon">${card.icon}</span>
      <div>
        <div class="bc-name">${card.name}</div>
        <div class="bc-stats">
          ${isFree ? '<span class="bc-stat-cap">FREE!</span>' : `<span class="bc-stat-cap">Cost: ${card.cost.capital}💰 ${card.cost.land}🗺</span>`}
          ${card.echo ? `<span class="bc-stat-poll">+${card.echo} Echo</span>` : ''}
          ${card.production.wellbeing ? `<span class="bc-stat-wb">+${card.production.wellbeing}😊/turn</span>` : ''}
          ${card.production.capital   ? `<span class="bc-stat-cap">+${card.production.capital}💰/turn</span>` : ''}
          <span class="bc-stat-vp">${card.vp}VP</span>
        </div>
      </div>`;
    if (canAfford) {
      el.onclick = () => showBuildConfirm(card, isFree);
    }
    list.appendChild(el);
  });
}

function showBuildConfirm(card, isFree) {
  $('modalBuildIcon').textContent = card.icon;
  $('modalBuildName').textContent = card.name;
  $('modalBuildDesc').textContent = `Group: ${card.group} · Category: ${card.cat}`;
  const eff = [];
  if (!isFree) { eff.push({label:`−${card.cost.capital} Capital`, cls:'eff-cap'}); eff.push({label:`−${card.cost.land} Land`, cls:'eff-land'}); }
  if (card.echo) eff.push({label:`+${card.echo} Echo Pollution`, cls:'eff-pol'});
  if (card.production.capital)   eff.push({label:`+${card.production.capital} Cap/turn`, cls:'eff-cap'});
  if (card.production.wellbeing) eff.push({label:`+${card.production.wellbeing} WB/turn`, cls:'eff-wb'});
  if (card.production.pollution < 0) eff.push({label:`${card.production.pollution} Pol/turn`, cls:'eff-eco'});
  eff.push({label:`${card.vp} VP`, cls:'eff-vp'});
  $('modalBuildEffects').innerHTML = eff.map(e => `<span class="effect-chip ${e.cls}">${e.label}</span>`).join('');

  const overlay = $('modal-build');
  overlay.style.display = 'flex';
  $('btnConfirmBuild').onclick = () => {
    overlay.style.display = 'none';
    doBuild(card, isFree);
  };
  $('btnCancelBuild').onclick = () => { overlay.style.display = 'none'; };
}

function doBuild(card, isFree) {
  const p = currentPlayer();

  if (!isFree) {
    p.capital -= card.cost.capital;
    p.land    -= card.cost.land;
  } else {
    // Free build (from center): still use land
    p.land = Math.max(0, p.land - card.cost.land);
  }

  p.echoInventory += card.echo;
  p.buildings.push(card.id);

  // Track set completion
  if (!p.setCounts[card.cat]) p.setCounts[card.cat] = 0;
  p.setCounts[card.cat]++;

  // Check if completed a set of 3
  if (p.setCounts[card.cat] === 3 && !p.completedSets[card.cat]) {
    p.completedSets[card.cat] = true;
    p.vp++;
    log(`${p.name} completes a SET of 3 ${card.cat} buildings — +1 VP!`, 'log-gold');
  }

  // VP from card
  p.vp += card.vp;

  updateDashboard(p);
  updateVPTrack();
  hideBuildPanel();

  log(`${p.name} builds ${card.icon} ${card.name} (+${card.vp}VP, +${card.echo} Echo).`, 'log-good');

  // Check win condition
  if (checkWin(p)) return;

  doProduction();
}

// ============================================================
// PHASE 7: PRODUCTION
// ============================================================
function doProduction() {
  setPhase(7);
  const p = currentPlayer();
  let prodLog = [];

  p.buildings.forEach(bid => {
    const card = BUILDING_CARDS.find(c => c.id === bid);
    if (!card) return;
    const pr = card.production;
    if (pr.capital)   { p.capital   += pr.capital;   prodLog.push(`+${pr.capital}💰`); }
    if (pr.wellbeing) { p.wellbeing += pr.wellbeing; prodLog.push(`+${pr.wellbeing}😊`); }
    if (pr.pollution && pr.pollution < 0) {
      p.echoInventory = Math.max(0, p.echoInventory + pr.pollution);
      prodLog.push(`${pr.pollution}💨`);
    }
    if (pr.globalEco) {
      G.globalEco = clamp(G.globalEco + pr.globalEco, 0, 100);
      prodLog.push(`${pr.globalEco}🌍`);
    }
  });

  if (prodLog.length) log(`${p.name} production: ${prodLog.join(' ')}`, 'log-good');
  updateDashboard(p);
  updateEcoTrack();

  doCheckThresholds();
}

// ============================================================
// PHASE 8: CHECK THRESHOLDS
// ============================================================
function doCheckThresholds() {
  setPhase(8);
  const p = currentPlayer();
  if (checkElimination(p)) return;
  doGlobalEventsWheel();
}

function checkElimination(p) {
  let reason = null;
  if (p.pollution >= 100) reason = `Personal Pollution reached 100!`;
  else if (p.capital <= 0)   reason = `Capital fell to 0!`;
  else if (p.wellbeing <= 0) reason = `Well-being fell to 0!`;

  if (reason && !p.eliminated) {
    p.eliminated = true;
    updateDashboard(p);
    log(`💀 ${p.name} ELIMINATED: ${reason}`, 'log-bad');
    $('elimTitle').textContent  = `${p.name} is Eliminated!`;
    $('elimReason').textContent = reason;
    $('modal-elim').style.display = 'flex';
    $('btnElimOk').onclick = () => {
      $('modal-elim').style.display = 'none';
      const active = G.players.filter(pl => !pl.eliminated);
      if (active.length === 1) {
        declareWinner(active[0], 'Last player standing!');
      } else if (active.length === 0) {
        showModal('modal-winner');
        $('winnerTitle').textContent = 'No Winner!';
        $('winnerSub').textContent   = 'All players were eliminated. The Earth has lost.';
        $('winnerStats').innerHTML   = '';
        $('modal-winner').style.display = 'flex';
      } else {
        doGlobalEventsWheel();
      }
    };
    return true;
  }
  return false;
}

function checkWin(p) {
  if (p.vp >= 30) {
    declareWinner(p, `Reached 30 Victory Points!`);
    return true;
  }
  return false;
}

function declareWinner(p, reason) {
  $('winnerTitle').textContent = `🏆 ${p.name} Wins!`;
  $('winnerSub').textContent   = reason;
  $('winnerStats').innerHTML   = G.players.map(pl =>
    `<div style="color:${pl.color}"><strong>${pl.name}</strong>: ${pl.vp} VP | Cap: ${pl.capital} | WB: ${pl.wellbeing} | Pol: ${pl.pollution}</div>`
  ).join('');
  $('modal-winner').style.display = 'flex';
  log(`🏆 ${p.name} WINS the game! ${reason}`, 'log-gold');
}

// ============================================================
// PHASE 9: GLOBAL EVENTS WHEEL
// ============================================================
function doGlobalEventsWheel() {
  setPhase(9);
  $('modal-wheel').style.display = 'flex';
  $('btnSpin').style.display     = 'block';
  $('btnWheelOk').style.display  = 'none';
  $('wheelResult').style.display = 'none';

  drawWheel(0); // initial draw

  $('btnSpin').onclick = () => spinWheel();
}

let wheelAngle = 0;
function drawWheel(rotation) {
  const canvas = $('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const cx = 160, cy = 160, r = 155;
  ctx.clearRect(0, 0, 320, 320);

  WHEEL_EVENTS.forEach((ev, i) => {
    const start = (i / 8) * Math.PI * 2 + rotation;
    const end   = ((i+1) / 8) * Math.PI * 2 + rotation;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = ev.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,168,75,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    const midA = start + (end - start) / 2;
    const tx = cx + Math.cos(midA) * r * 0.65;
    const ty = cy + Math.sin(midA) * r * 0.65;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(midA + Math.PI / 2);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 9px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ev.icon, 0, -8);
    ctx.fillText(ev.name.slice(0,8), 0, 4);
    ctx.restore();
  });

  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a84b';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function spinWheel() {
  $('btnSpin').disabled = true;
  const totalRotation = (Math.random() * 4 + 4) * Math.PI * 2 + Math.random() * Math.PI * 2;
  const duration = 3000;
  const startTime = performance.now();
  const startAngle = wheelAngle;

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
    const currentAngle = startAngle + totalRotation * eased;
    drawWheel(currentAngle);
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = currentAngle % (Math.PI * 2);
      // Determine which segment the pointer (top) lands on
      // Pointer is at top = -PI/2 (270 degrees)
      const normalizedAngle = (((-Math.PI/2) - wheelAngle) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
      const segmentIdx = Math.floor(normalizedAngle / (Math.PI * 2 / 8)) % 8;
      const event = WHEEL_EVENTS[segmentIdx];

      // Apply effects
      event.effect(G.players, G);
      updateAllDashboards();
      updateEcoTrack();
      updateVPTrack();

      $('wheelResult').style.display = 'block';
      $('wheelResult').innerHTML = `<strong>${event.icon} ${event.name}</strong><br>${event.desc}<br><em>${event.effectText}</em>`;
      $('btnSpin').style.display  = 'none';
      $('btnWheelOk').style.display = 'block';
      $('btnWheelOk').onclick = () => {
        $('modal-wheel').style.display = 'none';
        $('btnSpin').disabled = false;
        // Check all players for elimination
        let anyElim = false;
        G.players.forEach(p => { if(!p.eliminated && checkElimination(p)) anyElim = true; });
        if (!anyElim) doEndOfTurn();
      };

      log(`🌐 Wheel: ${event.name} — ${event.effectText}`, 'log-info');

      // Check global eco after wheel
      if (G.globalEco <= 0) {
        G.players.forEach(p => { if(!p.eliminated) p.vp = Math.max(0, p.vp - 1); });
        G.globalEco = 50;
        updateEcoTrack(); updateAllDashboards(); updateVPTrack();
        log('🌍 Global Eco hit 0! All players −1 VP. Reset to 50.', 'log-bad');
      }
    }
  }
  requestAnimationFrame(animate);
}

// ============================================================
// PHASE 10: END OF TURN
// ============================================================
function doEndOfTurn() {
  setPhase(10);
  const p = currentPlayer();
  log(`${p.name}'s turn ends.`);

  // Advance to next non-eliminated player
  let next = G.currentPlayerIdx;
  let loops = 0;
  do {
    next = (next + 1) % G.players.length;
    loops++;
  } while (G.players[next].eliminated && loops <= G.players.length);

  // If we've gone all the way around (completed a round), do round-end logic
  if (next <= G.currentPlayerIdx) {
    doEndOfRound();
  }

  G.currentPlayerIdx = next;

  // Check if all eliminated
  const alive = G.players.filter(p => !p.eliminated);
  if (alive.length === 0) {
    $('winnerTitle').textContent = 'Game Over!';
    $('winnerSub').textContent   = 'All players were eliminated. The Earth is lost.';
    $('winnerStats').innerHTML   = '';
    $('modal-winner').style.display = 'flex';
    return;
  }
  if (alive.length === 1 && G.players.length > 1) {
    declareWinner(alive[0], 'Last player standing!');
    return;
  }

  beginTurn();
}

// ============================================================
// END OF ROUND: Global Eco Decay
// ============================================================
function doEndOfRound() {
  G.round++;
  $('roundLabel').textContent = `Round ${G.round}`;

  const alive = G.players.filter(p => !p.eliminated);
  if (alive.length === 0) return;

  const totalPollution = alive.reduce((sum, p) => sum + p.pollution, 0);
  const avgPollution   = Math.ceil(totalPollution / alive.length);

  G.globalEco -= avgPollution;
  log(`🌍 End of Round ${G.round-1}: Avg pollution = ${avgPollution} → Global Eco now ${G.globalEco}.`, 'log-bad');

  if (G.globalEco <= 0) {
    G.globalEco = 50;
    G.players.forEach(p => {
      if (!p.eliminated) p.vp = Math.max(0, p.vp - 1);
    });
    updateAllDashboards(); updateVPTrack();
    log('🌍 Global Eco Penalty! All players −1 VP. Global Eco reset to 50.', 'log-bad');

    // Check all eliminations
    G.players.forEach(p => { if (!p.eliminated) checkElimination(p); });
  }

  updateEcoTrack();
}

// ============================================================
// APPLY EFFECTS HELPER
// ============================================================
function applyEffects(player, effects) {
  if (!effects) return;
  if (effects.capital)   player.capital   = Math.max(0, player.capital + effects.capital);
  if (effects.wellbeing) player.wellbeing = Math.max(0, player.wellbeing + effects.wellbeing);
  if (effects.pollution) {
    // Positive pollution = add to echo inventory, negative = reduce personal pollution
    if (effects.pollution > 0) {
      player.echoInventory += effects.pollution;
    } else {
      player.pollution = Math.max(0, player.pollution + effects.pollution);
    }
  }
  if (effects.globalEco) G.globalEco = clamp(G.globalEco + effects.globalEco, 0, 100);
  if (effects.vp)        player.vp   = Math.max(0, player.vp + effects.vp);
  if (effects.land)      player.land = Math.max(0, player.land + effects.land);
}

function effectsToChips(effects) {
  const chips = [];
  if (!effects) return chips;
  if (effects.capital)   chips.push({label:(effects.capital>0?'+':'')+effects.capital+' Capital',    cls:'eff-cap'});
  if (effects.wellbeing) chips.push({label:(effects.wellbeing>0?'+':'')+effects.wellbeing+' Well-being', cls:'eff-wb'});
  if (effects.pollution) chips.push({label:(effects.pollution>0?'+':'')+effects.pollution+' Echo Pol.',  cls:'eff-pol'});
  if (effects.globalEco) chips.push({label:(effects.globalEco>0?'+':'')+effects.globalEco+' Global Eco', cls:'eff-eco'});
  if (effects.vp)        chips.push({label:(effects.vp>0?'+':'')+effects.vp+' VP',                       cls:'eff-vp'});
  if (effects.land)      chips.push({label:(effects.land>0?'+':'')+effects.land+' Land',                 cls:'eff-land'});
  return chips;
}

// ============================================================
// CARD MODAL HELPERS
// ============================================================
function showCardModal({type, icon, name, desc, effects, onOk}) {
  $('modalCardType').textContent = type;
  $('modalCardIcon').textContent = icon;
  $('modalCardName').textContent = name;
  $('modalCardDesc').textContent = desc;
  $('modalCardEffects').innerHTML = (effects || []).map(e =>
    `<span class="effect-chip ${e.cls}">${e.label}</span>`
  ).join('');
  $('modal-card').style.display = 'flex';
  $('btnModalOk').onclick = () => {
    $('modal-card').style.display = 'none';
    if (onOk) onOk();
  };
}

function showModal(id) {
  if (id) $(id).style.display = 'flex';
}

// ============================================================
// RESIZE HANDLER
// ============================================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if ($('screen-game').classList.contains('active')) {
      buildBoard();
      placePlayerTokens();
    }
  }, 300);
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initSetupScreen();
  showScreen('screen-setup');
});
