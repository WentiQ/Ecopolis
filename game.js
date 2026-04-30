/* ================================================================
   ECOPOLIS — game.js  Complete game engine
   Blueprint-accurate board, 10-phase turns, full rules
   ================================================================ */
'use strict';

// ── State ──────────────────────────────────────────────────────
let G = {
  players:[], currentIdx:0, round:1, globalEco:100,
  phase:0, dice:[1,1], total:0, isClean:false,
  buildingDeck:[], isFree:false,
  spacePos:{},   // id→{x,y,w,h,cx,cy}
  boardDims:{},
};
let numPlayers = 2;

// ── Helpers ────────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const rnd = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a; }

function log(msg,cls=''){
  const e=document.createElement('div');
  e.className='le'+(cls?' '+cls:'');
  e.textContent=msg;
  $('gameLog').prepend(e);
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
  if(id==='screen-game') setTimeout(()=>{ buildBoard(); buildVP(); buildDashes(); updateEco(); updateAllDashes(); updateVP(); beginTurn(); },50);
}

// ── Setup screen ───────────────────────────────────────────────
function initSetup(){
  $('rulesBody').innerHTML = RULES_HTML;
  renderSetupRows();
  document.querySelectorAll('.pcbtn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.pcbtn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    numPlayers=parseInt(b.dataset.n);
    renderSetupRows();
  }));
  $('btnStartGame').addEventListener('click',startGame);
  $('btnShowRules').addEventListener('click',()=>showScreen('screen-rules'));
  $('btnCloseRules').addEventListener('click',()=>showScreen('screen-setup'));
  $('btnShowBlueprintSetup').addEventListener('click',openBlueprint);
  $('btnRulesGame').addEventListener('click',()=>showScreen('screen-rules'));
  $('btnBlueprintGame').addEventListener('click',openBlueprint);
  $('btnQuit').addEventListener('click',()=>{ if(confirm('Quit?')) showScreen('screen-setup'); });
  $('btnPlayAgain').addEventListener('click',()=>{ closeAllModals(); showScreen('screen-setup'); });
  $('btnCloseBp').addEventListener('click',()=>{ $('modal-blueprint').style.display='none'; });
  $('btnDlBlueprint').addEventListener('click',downloadBlueprint);
}

function renderSetupRows(){
  const c=$('setupPlayers'); c.innerHTML='';
  for(let i=0;i<numPlayers;i++){
    const r=document.createElement('div'); r.className='p-setup-row';
    r.innerHTML=`<div class="p-color-dot" style="background:${PLAYER_COLORS[i]}"></div>
      <input id="pn${i}" type="text" placeholder="${PLAYER_NAMES_DEFAULT[i]}" maxlength="16" value="${PLAYER_NAMES_DEFAULT[i]}"/>`;
    c.appendChild(r);
  }
}

// ── Start game ─────────────────────────────────────────────────
function startGame(){
  G.players=[];
  for(let i=0;i<numPlayers;i++){
    const ni=$(`pn${i}`); 
    G.players.push({
      id:i, name:ni?ni.value.trim()||PLAYER_NAMES_DEFAULT[i]:PLAYER_NAMES_DEFAULT[i],
      color:PLAYER_COLORS[i],
      pos:1, onInner:false, innerId:null, innerDir:null, innerPath:null,
      capital:100, wellbeing:100, pollution:0, land:100, vp:0,
      echo:0, buildings:[], setCounts:{}, completedSets:{},
      centerVisits:0, eliminated:false, pendingChain:null,
    });
  }
  G.currentIdx=0; G.round=1; G.globalEco=100; G.phase=1;
  G.buildingDeck=shuffle([...BUILDING_CARDS]);
  showScreen('screen-game');
}

// ── Board building ─────────────────────────────────────────────
function buildBoard(){
  const inner=$('boardInner');
  const W=inner.offsetWidth, H=inner.offsetHeight;
  const S=Math.min(W,H); // use minimum for square reference
  G.boardDims={W,H,S};

  $('boardSpaces').innerHTML='';
  $('tokenLayer').innerHTML='';
  G.spacePos={};

  // Dimensions from blueprint scaled to pixel board
  // Board = 91.44cm × 91.44cm
  // Outer track width = 6.35cm  → fraction = 6.35/91.44 = 0.0694
  // Corner = 6.35×6.35cm square
  // Side spaces: 4.14cm wide, 6.35cm tall
  // Inner tiles: orthogonal = 5.29×5.08cm, diagonal = 6.86×5.08cm

  const f = S/91.44;          // pixels per cm
  const trackW = 6.35*f;      // outer track width in px
  const cornerSz = trackW;

  const innerAreaX = trackW;
  const innerAreaY = trackW;
  const innerAreaW = W - 2*trackW;
  const innerAreaH = H - 2*trackW;

  // Side space sizes
  const sideW = 4.14*f;
  const sideH = 6.35*f;

  // --- Outer Loop Positions ---
  // New layout: 17 spaces per side (not 19)
  const TOP_Y    = 0;
  const BOT_Y    = H - sideH;
  const LEFT_X   = 0;
  const RIGHT_X  = W - sideH;

  const sideLen  = W - 2*cornerSz; // available for horizontal spacing
  const sideStep = sideLen / 17;   // 17 spaces per side (TOP and BOTTOM)
  
  // Vertical spacing: RIGHT has 16 spaces, LEFT has 17 spaces
  const rightSideAvail = H - 2*cornerSz;
  const rightStep = rightSideAvail / 16;  // 16 spaces on RIGHT side
  const leftStep = rightSideAvail / 17;   // 17 spaces on LEFT side

  // Space width for each side
  const spW_top  = sideStep - 1;
  const spH_top  = sideH;
  const spW_side = sideH;       // rotated
  // Use reduced heights for vertical sides to prevent overlap
  const spH_right = rightStep - 1;  // Height for RIGHT side
  const spH_left = leftStep - 1;    // Height for LEFT side

  const pos = {};

  // Corner 1 (space 1, START) — top-left
  pos[1]  = {x:0, y:0, w:cornerSz, h:cornerSz};
  // Corner 2 (space 19, WAR) — top-right
  pos[19] = {x:W-cornerSz, y:0, w:cornerSz, h:cornerSz};
  // Corner 3 (space 37, RENEWABLE ENERGY) — bottom-right
  pos[37] = {x:W-cornerSz, y:H-cornerSz, w:cornerSz, h:cornerSz};
  // Corner 4 (space 55, LONELINESS) — bottom-left
  pos[55] = {x:0, y:H-cornerSz, w:cornerSz, h:cornerSz};

  // Side 1: spaces 2-18, top row left→right (17 spaces after corner 1, before corner 2)
  for(let i=0;i<17;i++){
    const id=i+2;
    pos[id]={x:cornerSz+i*sideStep, y:0, w:spW_top, h:spH_top};
  }
  // Side 2: spaces 20-35, right col top→bottom (16 spaces after corner 2, before corner 3)
  for(let i=0;i<16;i++){
    const id=i+20;
    pos[id]={x:W-spW_side, y:cornerSz+i*rightStep, w:spW_side, h:spH_right};
  }
  // Side 3: spaces 38-54, bottom row right→left (17 spaces after corner 3, before corner 4)
  for(let i=0;i<17;i++){
    const id=i+38;
    pos[id]={x:W-cornerSz-(i+1)*sideStep+1, y:H-spH_top, w:spW_top, h:spH_top};
  }
  // Side 4: spaces 56-72, left col bottom→top (17 spaces after corner 4, wrapping back to start)
  for(let i=0;i<17;i++){
    const id=i+56;
    pos[id]={x:0, y:H-cornerSz-(i+1)*leftStep+1, w:spW_side, h:spH_left};
  }

  // Compute centers
  Object.keys(pos).forEach(k=>{ const p=pos[k]; p.cx=p.x+p.w/2; p.cy=p.y+p.h/2; });

  // --- Inner path positions ---
  // Inner area (inside outer loop)
  const iL=trackW, iT=trackW, iR=W-trackW, iB=H-trackW;
  const iW=iR-iL, iH=iB-iT;
  const cX=W/2, cY=H/2;

  // Center hub radius
  const hubR = 7.62*f; // 15.24cm diameter / 2
  pos['CENTER']={x:cX-hubR,y:cY-hubR,w:hubR*2,h:hubR*2,cx:cX,cy:cY};

  // Orthogonal tile sizes (scaled)
  const ort_len = 5.29*f;
  const ort_wid = 5.08*f;
  const diag_len= 6.86*f;
  const diag_wid= 5.08*f;

  // UP line: from top outer edge → center, spaces placed N→S (VT1 nearest outer, now 6 spaces)
  const upAvail = cY - hubR - iT;
  const upStep  = upAvail / 6;
  for(let i=0;i<6;i++){
    const spaceNames = ['VT1','VT2','VT3','VT4','VT5','VT6'];
    const id = spaceNames[i];
    const cx=cX, cy=iT + i*upStep + upStep/2;
    pos[id]={x:cx-ort_wid/2, y:cy-ort_len/2, w:ort_wid, h:ort_len, cx, cy};
  }
  // RIGHT line: from right outer → center (HR1-HR6, 6 spaces)
  const riAvail = iR - (cX + hubR);
  const riStep  = riAvail / 6;
  for(let i=0;i<6;i++){
    const spaceNames = ['HR1','HR2','HR3','HR4','HR5','HR6'];
    const id = spaceNames[i];
    const cx=iR - i*riStep - riStep/2, cy=cY;
    pos[id]={x:cx-ort_len/2, y:cy-ort_wid/2, w:ort_len, h:ort_wid, cx, cy};
  }
  // DOWN line: from bottom outer → center (VB1-VB6, 6 spaces)
  const dnAvail = iB - (cY + hubR);
  const dnStep  = dnAvail / 6;
  for(let i=0;i<6;i++){
    const spaceNames = ['VB1','VB2','VB3','VB4','VB5','VB6'];
    const id = spaceNames[i];
    const cx=cX, cy=iB - i*dnStep - dnStep/2;
    pos[id]={x:cx-ort_wid/2, y:cy-ort_len/2, w:ort_wid, h:ort_len, cx, cy};
  }
  // LEFT line: from left outer → center (HL1-HL6, 6 spaces)
  const lfAvail = (cX - hubR) - iL;
  const lfStep  = lfAvail / 6;
  for(let i=0;i<6;i++){
    const spaceNames = ['HL1','HL2','HL3','HL4','HL5','HL6'];
    const id = spaceNames[i];
    const cx=iL + i*lfStep + lfStep/2, cy=cY;
    pos[id]={x:cx-ort_len/2, y:cy-ort_wid/2, w:ort_len, h:ort_wid, cx, cy};
  }

  // Diagonal lines (8 spaces each now, not 7)
  // t range: start at 0.04 from outer corner, end at 0.78 (leaves gap before hub)
  const diagTMin=0.04, diagTMax=0.78;
  // TR (Top-Right): 8 spaces
  for(let i=0;i<8;i++){
    const spaceNames = ['TR1','TR2','TR3','TR4','TR5','TR6','TR7','TR8'];
    const id = spaceNames[i];
    const t=diagTMin + (i/7)*(diagTMax-diagTMin);
    const cx=iR - t*(iR-cX), cy=iT + t*(cY-iT);
    pos[id]={x:cx-diag_wid/2, y:cy-diag_len/2, w:diag_wid, h:diag_len, cx, cy};
  }
  // BR (Bottom-Right): 8 spaces
  for(let i=0;i<8;i++){
    const spaceNames = ['BR1','BR2','BR3','BR4','BR5','BR6','BR7','BR8'];
    const id = spaceNames[i];
    const t=diagTMin + (i/7)*(diagTMax-diagTMin);
    const cx=iR - t*(iR-cX), cy=iB - t*(iB-cY);
    pos[id]={x:cx-diag_wid/2, y:cy-diag_len/2, w:diag_wid, h:diag_len, cx, cy};
  }
  // BL (Bottom-Left): 8 spaces
  for(let i=0;i<8;i++){
    const spaceNames = ['BL1','BL2','BL3','BL4','BL5','BL6','BL7','BL8'];
    const id = spaceNames[i];
    const t=diagTMin + (i/7)*(diagTMax-diagTMin);
    const cx=iL + t*(cX-iL), cy=iB - t*(iB-cY);
    pos[id]={x:cx-diag_wid/2, y:cy-diag_len/2, w:diag_wid, h:diag_len, cx, cy};
  }
  // TL (Top-Left): 8 spaces
  for(let i=0;i<8;i++){
    const spaceNames = ['TL1','TL2','TL3','TL4','TL5','TL6','TL7','TL8'];
    const id = spaceNames[i];
    const t=diagTMin + (i/7)*(diagTMax-diagTMin);
    const cx=iL + t*(cX-iL), cy=iT + t*(cY-iT);
    pos[id]={x:cx-diag_wid/2, y:cy-diag_len/2, w:diag_wid, h:diag_len, cx, cy};
  }

  G.spacePos=pos;

  // Draw inner path lines
  drawInnerLines(trackW,cX,cY,hubR,iL,iT,iR,iB);

  // Render outer spaces
  OUTER_SPACES.forEach(sp=>{
    const p=pos[sp.id]; if(!p) return;
    const el=document.createElement('div');
    el.className='bs '+sp.type+(sp.isCorner?' bs-corner':'');
    el.style.cssText=`left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;`;
    el.id='sp-'+sp.id;
    el.title=`#${sp.id} ${sp.label}`;
    const small=p.w<38||p.h<38;
    el.innerHTML=`<span class="sn">${sp.id}</span><span class="si">${sp.icon}</span>${!small?`<span class="sl">${sp.label}</span>`:''}`;
    $('boardSpaces').appendChild(el);
  });

  // Render inner spaces
  INNER_SPACES.forEach(sp=>{
    const p=pos[sp.id]; if(!p) return;
    const el=document.createElement('div');
    el.className='bs '+sp.type;
    el.style.cssText=`left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;`;
    el.id='sp-'+sp.id;
    el.title=sp.name;
    el.innerHTML=`<span class="si">${sp.icon}</span><span class="sl">${sp.name.slice(0,10)}</span>`;
    $('boardSpaces').appendChild(el);
  });

  // Center hub
  const hub=$('centerHub');
  const hp=pos['CENTER'];
  hub.style.cssText=`left:${hp.x}px;top:${hp.y}px;width:${hp.w}px;height:${hp.h}px;`;

  // Tokens
  G.players.forEach(p=>createToken(p));
  G.players.forEach(p=>moveToken(p));
}

function drawInnerLines(tw,cX,cY,hubR,iL,iT,iR,iB){
  const cont=$('boardSpaces');
  function line(x,y,w,h,cls){
    const d=document.createElement('div');
    d.className='ipl '+cls;
    d.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
    cont.appendChild(d);
  }
  const lw=8;
  line(cX-lw/2, iT,        lw, cY-hubR-iT,   'ipl-up');
  line(cX+hubR, cY-lw/2,   iR-cX-hubR, lw,   'ipl-right');
  line(cX-lw/2, cY+hubR,   lw, iB-cY-hubR,   'ipl-down');
  line(iL,      cY-lw/2,   cX-hubR-iL, lw,   'ipl-left');
  // Diagonals (thin rotated divs)
  function diagLine(x1,y1,x2,y2,cls){
    const len=Math.hypot(x2-x1,y2-y1);
    const ang=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
    const mx=(x1+x2)/2-(len/2), my=(y1+y2)/2-lw/2;
    const d=document.createElement('div');
    d.className='ipl '+cls;
    d.style.cssText=`left:${(x1+x2)/2-len/2}px;top:${(y1+y2)/2-lw/2}px;width:${len}px;height:${lw}px;transform-origin:center;transform:rotate(${ang}deg);`;
    cont.appendChild(d);
  }
  diagLine(iR,iT, cX+hubR*0.7,cY-hubR*0.7, 'ipl-diag');
  diagLine(iR,iB, cX+hubR*0.7,cY+hubR*0.7, 'ipl-diag');
  diagLine(iL,iB, cX-hubR*0.7,cY+hubR*0.7, 'ipl-diag');
  diagLine(iL,iT, cX-hubR*0.7,cY-hubR*0.7, 'ipl-diag');
}

function createToken(p){
  const tok=document.createElement('div');
  tok.className='ptok'; tok.id='tok-'+p.id;
  tok.textContent=(p.id+1).toString();
  tok.style.background=p.color;
  $('tokenLayer').appendChild(tok);
}

function moveToken(p){
  const tok=$('tok-'+p.id); if(!tok) return;
  const sp=p.onInner ? G.spacePos[p.innerId] : (p.pos==='CENTER'?G.spacePos['CENTER']:G.spacePos[p.pos]);
  if(!sp) return;
  const off=p.id*7;
  tok.style.left=(sp.cx+off)+'px';
  tok.style.top =(sp.cy+off)+'px';
}

// ── VP Track ──────────────────────────────────────────────────
function buildVP(){
  const c=$('vpCells'); c.innerHTML='';
  for(let i=1;i<=30;i++){
    const el=document.createElement('div');
    el.className='vpc'+(i%5===0?' m5':'')+(i===30?' m30':'');
    el.id='vpc-'+i; el.textContent=i;
    c.appendChild(el);
  }
}
function updateVP(){
  document.querySelectorAll('.vpc-dot').forEach(d=>d.remove());
  G.players.forEach(p=>{
    if(p.eliminated) return;
    const c=$('vpc-'+clamp(p.vp,0,30)); if(!c) return;
    const d=document.createElement('div');
    d.className='vpc-dot'; d.style.background=p.color;
    c.appendChild(d);
  });
}

// ── Dashboards ────────────────────────────────────────────────
function buildDashes(){
  $('dashLeft').innerHTML=''; $('dashRight').innerHTML='';
  G.players.forEach((p,i)=>{
    const el=document.createElement('div');
    el.className='dashboard'; el.id='dash-'+p.id;
    el.innerHTML=`
      <div class="dash-head" style="background:${p.color}">
        <div class="dash-dot" style="background:${p.color}"></div>
        <span class="dash-name">${p.name}</span>
        <span class="dash-space" id="dsp-${p.id}">Sp.1</span>
        <span class="dash-vp" id="dvp-${p.id}">0VP</span>
      </div>
      <div class="dash-body">
        <div class="d-stat"><span>💰</span><span class="d-val cv-cap" id="dc-${p.id}">100</span></div>
        <div class="d-stat"><span>😊</span><span class="d-val cv-wb" id="dw-${p.id}">100</span></div>
        <div class="d-stat"><span>💨</span><span class="d-val cv-pol" id="dp-${p.id}">0</span></div>
        <div class="d-stat"><span>🗺</span><span class="d-val cv-land" id="dl-${p.id}">100</span></div>
        <div class="d-stat"><span>📦</span><span class="d-val cv-echo" id="de-${p.id}">0</span></div>
      </div>
      <div class="dash-builds" id="db-${p.id}"></div>`;
    (i<2 ? $('dashLeft') : $('dashRight')).appendChild(el);
  });
}
function updateDash(p){
  $(`dc-${p.id}`).textContent=p.capital;
  $(`dw-${p.id}`).textContent=p.wellbeing;
  $(`dp-${p.id}`).textContent=p.pollution;
  $(`dl-${p.id}`).textContent=p.land;
  $(`de-${p.id}`).textContent=p.echo;
  $(`dvp-${p.id}`).textContent=p.vp+'VP';
  const sp=p.pos==='CENTER'?'Center':p.onInner?`In:${p.innerId}`:`Sp.${p.pos}`;
  $(`dsp-${p.id}`).textContent=sp;
  const d=$('dash-'+p.id);
  if(d){ d.classList.toggle('active-player',p.id===G.currentIdx); d.classList.toggle('eliminated',p.eliminated); }
  const db=$('db-'+p.id); db.innerHTML='';
  p.buildings.forEach(bid=>{ const c=BUILDING_CARDS.find(x=>x.id===bid); if(!c) return;
    const t=document.createElement('span'); t.className='b-tag'; t.title=c.name; t.textContent=c.icon+' '+c.name.slice(0,10); db.appendChild(t); });
}
function updateAllDashes(){ G.players.forEach(p=>updateDash(p)); }

// ── Eco Track ─────────────────────────────────────────────────
function updateEco(){
  const pct=G.globalEco; $('ecoBarFill').style.width=pct+'%'; $('ecoBarVal').textContent=G.globalEco;
}

// ── Turn management ───────────────────────────────────────────
function cur(){ return G.players[G.currentIdx]; }

function beginTurn(){
  const p=cur();
  $('roundLabel').textContent='Round '+G.round;
  $('tsName').textContent=p.name; $('tsName').style.color=p.color;
  setPhase(1); setMsg(''); setDice('?','?','Roll!');
  setActions([{id:'btnRoll',label:'🎲 Roll Dice',cls:''}]);
  $('btnRoll').onclick=doRoll;
  hideBuild(); hideChoice();
  updateAllDashes();
  // Apply pending chain reaction
  if(p.pendingChain){ applyFx(p,p.pendingChain); p.pendingChain=null; updateDash(p); }
  log(`— ${p.name}'s turn —`,'gold');
}

function setPhase(n){
  G.phase=n;
  const L={1:'Phase 1: Roll',2:'Phase 2: Echo Release',3:'Phase 3: Move',4:'Phase 4: Set Bonuses',
           5:'Phase 5: Resolve Space',6:'Phase 6: Build',7:'Phase 7: Production',
           8:'Phase 8: Thresholds',9:'Phase 9: Wheel',10:'Phase 10: End Turn'};
  $('tsPhase').textContent=L[n]||'';
}
function setMsg(m){ $('tsMsg').innerHTML=m; }
function setDice(d1,d2,tot){ $('die1').textContent=d1; $('die2').textContent=d2; $('tsTotal').textContent=tot; }
function setActions(acts){
  const c=$('tsActions'); c.innerHTML='';
  acts.forEach(a=>{
    const b=document.createElement('button'); b.className='btn-act '+(a.cls||''); b.id=a.id; b.textContent=a.label;
    if(a.dis) b.disabled=true; c.appendChild(b);
  });
}
function hideBuild(){ $('buildPanel').style.display='none'; }
function hideChoice(){ $('choicePanel').style.display='none'; }
function closeAllModals(){ ['modal-card','modal-build','modal-winner','modal-wheel','modal-elim','modal-blueprint'].forEach(id=>{ const m=$(id); if(m) m.style.display='none'; }); }

// ── Phase 1: Roll ─────────────────────────────────────────────
function doRoll(){
  $('btnRoll').disabled=true;
  const d1=Math.ceil(Math.random()*6), d2=Math.ceil(Math.random()*6);
  G.dice=[d1,d2]; G.total=d1+d2; G.isClean=(d1===d2);
  $('die1').classList.add('rolling'); $('die2').classList.add('rolling');
  setTimeout(()=>{
    $('die1').classList.remove('rolling'); $('die2').classList.remove('rolling');
    setDice(d1,d2,`${G.total}${G.isClean?' 🎉CLEAN!':''}`);
    log(`${cur().name} rolls ${d1}+${d2}=${G.total}${G.isClean?' (Clean Roll!)':''}`,G.isClean?'good':'info');
    doEcho();
  },500);
}

// ── Phase 2: Echo Release ─────────────────────────────────────
function doEcho(){
  setPhase(2); const p=cur();
  if(G.isClean){
    const rm=Math.min(2,p.echo); p.echo=Math.max(0,p.echo-2);
    log(`${p.name}: CLEAN ROLL — removed ${rm} Echo permanently.`,'good');
    setMsg(`🎉 Clean Roll! Removed <b>${rm}</b> Echo pollution.`);
  } else {
    const rel=Math.min(G.total,p.echo); p.pollution+=rel; p.echo-=rel;
    if(rel>0){ log(`${p.name}: Echo release +${rel} Pollution.`,'bad'); setMsg(`💨 Echo Release: <b>+${rel}</b> Pollution.`); }
    else setMsg('📦 Echo Inventory empty.');
  }
  updateDash(p);
  if(checkElim(p)) return;
  setTimeout(doMove,700);
}

// ── Phase 3: Movement ─────────────────────────────────────────
function doMove(){
  setPhase(3); const p=cur();
  if(p.pos==='CENTER'){
    // Player is at center - must choose an exit direction (cannot go back)
    setMsg(`At CENTER HUB. Choose an exit direction to continue forward.`);
    setActions([
      {id:'btnExitVT',label:'↑ Top',cls:'blue'},
      {id:'btnExitVB',label:'↓ Bottom',cls:'blue'},
      {id:'btnExitHR',label:'→ Right',cls:'blue'},
      {id:'btnExitHL',label:'← Left',cls:'blue'},
      {id:'btnExitTR',label:'↗ Top-Right',cls:'amber'},
      {id:'btnExitBR',label:'↘ Bot-Right',cls:'amber'},
      {id:'btnExitBL',label:'↙ Bot-Left',cls:'amber'},
      {id:'btnExitTL',label:'↖ Top-Left',cls:'amber'},
    ]);
    const exitMap={
      btnExitVT:{path:'VT',idx:'VT6'},btnExitVB:{path:'VB',idx:'VB6'},
      btnExitHR:{path:'HR',idx:'HR6'},btnExitHL:{path:'HL',idx:'HL6'},
      btnExitTR:{path:'TR',idx:'TR8'},btnExitBR:{path:'BR',idx:'BR8'},
      btnExitBL:{path:'BL',idx:'BL8'},btnExitTL:{path:'TL',idx:'TL8'},
    };
    Object.entries(exitMap).forEach(([btnId,info])=>{
      const btn=$(btnId); if(!btn) return;
      btn.onclick=()=>{
        p.pos=null; p.onInner=true; p.innerId=info.idx;
        p.innerDir='outward'; p.innerPath=info.path;
        moveToken(p); log(`${p.name} exits CENTER via ${info.path} path.`,'gold');
        afterMove();
      };
    });
  } else if(p.onInner){
    // On inner path - can only move FORWARD (no going back)
    const dir = p.innerDir || 'inward';
    if(dir==='inward'){
      setMsg(`Advancing inner path toward CENTER.`);
      setActions([{id:'btnGoCenter',label:'→ Enter Center Hub',cls:'blue'}]);
      $('btnGoCenter').onclick=()=>{ p.pos='CENTER'; p.onInner=false; p.innerId=null; p.innerDir=null; p.innerPath=null; moveToken(p); log(`${p.name} reaches CENTER!`,'gold'); afterMove(); };
    } else {
      setMsg(`Moving outward through inner path to outer board.`);
      setActions([{id:'btnExitToOuter',label:'→ Exit to Outer Board',cls:'green'}]);
      $('btnExitToOuter').onclick=()=>{
        p.onInner=false; p.innerId=null; p.innerDir=null; p.innerPath=null;
        moveToken(p); log(`${p.name} exits inner path to outer board.`);
        afterMove();
      };
    }
  } else {
    const old=p.pos; let np=(typeof p.pos==='number'?p.pos:1)+G.total; let passedStart=false;
    // NEW: 71 spaces total (1 START + 3 corners + 17*4 sides = 72, but using 71 playable)
    if(np>72){ np=((np-1)%72)+1; passedStart=true; }
    p.pos=np;
    if(passedStart||np===1){ p.capital+=2; log(`${p.name} passes START +2 Capital!`,'good'); }
    log(`${p.name} → Space ${np}.`);
    setMsg(`Moved to Space <b>${np}</b>${passedStart?' (+2 Capital)':''}`);
    moveToken(p); highlightSp(np); updateDash(p);
    // NEW: Intersections updated for new layout - corners and mid-points on each side
    const ixSpaces=[1,10,19,28,37,47,55,64];
    if(ixSpaces.includes(np)){
      setMsg(setMsg(`Space <b>${np}</b> — intersection! Enter inner path?`));
      setActions([{id:'btnStayOuter',label:'Stay Outer',cls:'green'},{id:'btnEnterInner',label:'Enter Inner Path',cls:'blue'}]);
      $('btnStayOuter').onclick=()=>afterMove();
      $('btnEnterInner').onclick=()=>offerInner(p,np);
    } else setTimeout(afterMove,600);
  }
}

function offerInner(p,spId){
  // NEW: Map space→ available inner line entry (updated for new 71-space layout)
  const map={
    1:['VT','HL'],      // START - can enter Vertical Top or Horizontal Left
    10:['VT'],          // TOP mid-point
    19:['VT','HR'],     // WAR corner - can enter Vertical Top or Horizontal Right
    28:['HR'],          // RIGHT mid-point
    37:['HR','VB'],     // RENEWABLE ENERGY corner
    47:['VB'],          // BOTTOM mid-point
    55:['VB','HL'],     // LONELINESS corner
    64:['HL']           // LEFT mid-point
  };
  const dirs=map[spId]||['VT'];
  const dirNames={VT:'↑ Top Vertical',HR:'→ Right Horizontal',VB:'↓ Bottom Vertical',HL:'← Left Horizontal',TR:'↗ Top-Right Diagonal',BR:'↘ Bot-Right Diagonal',BL:'↙ Bot-Left Diagonal',TL:'↖ Top-Left Diagonal'};
  const acts=dirs.map(d=>({id:'inner-'+d,label:dirNames[d]||d,cls:'blue'}));
  acts.push({id:'stayOuter2',label:'Stay Outer',cls:'green'});
  setActions(acts);
  dirs.forEach(d=>{ const btn=$('inner-'+d); if(btn) btn.onclick=()=>{ p.onInner=true; p.innerId=d+'1'; p.innerDir='inward'; p.innerPath=d; moveToken(p); log(`${p.name} enters ${d} path.`); afterMove(); }; });
  $('stayOuter2').onclick=()=>afterMove();
}

function afterMove(){ clearHighlight(); doSetBonuses(); }

function highlightSp(id){ clearHighlight(); const e=$('sp-'+id); if(e) e.classList.add('pulse'); }
function clearHighlight(){ document.querySelectorAll('.bs.pulse').forEach(e=>e.classList.remove('pulse')); }

// ── Phase 4: Set Bonuses ──────────────────────────────────────
function doSetBonuses(){
  setPhase(4); const p=cur(); let got=[];
  Object.keys(p.completedSets).forEach(cat=>{ if(p.completedSets[cat]&&SET_BONUSES[cat]){ SET_BONUSES[cat].fn(p); got.push(SET_BONUSES[cat].label); } });
  if(got.length) log(`${p.name} set bonuses: ${got.join(', ')}`,'good');
  updateDash(p);
  setTimeout(doResolve,400);
}

// ── Phase 5: Resolve Space ────────────────────────────────────
function doResolve(){
  setPhase(5); const p=cur();

  if(p.pos==='CENTER'){
    p.capital+=2; p.wellbeing+=2; p.pollution=Math.max(0,p.pollution-1);
    G.globalEco=Math.min(100,G.globalEco+1); p.centerVisits++;
    let vpBonus=0;
    if(p.centerVisits%2===0){ p.vp++; vpBonus=1; }
    updateEco(); updateVP(); updateDash(p);
    showCard({type:'🌿 CENTER HUB',icon:'🌟',name:'Global Eco Hub!',desc:'You landed on the center. The world rewards your city. Choose your exit direction next turn!',
      effects:[{label:'+2 Capital',cls:'ch-cap'},{label:'+2 WB',cls:'ch-wb'},{label:'−1 Pollution',cls:'ch-pol'},{label:'+1 Global Eco',cls:'ch-eco'},
               vpBonus?{label:'+1 VP',cls:'ch-vp'}:null].filter(Boolean),
      onOk:()=>{ doOptBuild(true); }});
    log(`${p.name} reaches CENTER HUB!${vpBonus?' +1VP!':''}`,'gold');
    return;
  }

  // Find space data
  const outerSp = typeof p.pos==='number' ? OUTER_SPACES.find(s=>s.id===p.pos) : null;
  const innerSp = p.onInner ? INNER_SPACES.find(s=>s.id===p.innerId) : null;
  const activeSp= p.onInner ? innerSp : outerSp;
  if(!activeSp){ doOptBuild(false); return; }

  // New event format with modifiers directly in space
  if(activeSp.modifiers){
    resolveNewEvent(p, activeSp);
  } else {
    // Fallback to old CARD_DATA system if needed
    const ref = activeSp.cardRef;
    if(ref && CARD_DATA[ref]){
      const cd=CARD_DATA[ref];
      resolveCard(p,cd,ref);
    } else {
      const t=activeSp.type||'';
      if(t.includes('asset')){ resolveAsset(p); }
      else if(t.includes('crisis')){ resolveCard(p,rnd(Object.values(CARD_DATA).filter(c=>c.type==='crisis'))); }
      else if(t.includes('dilemma')){ resolveCard(p,rnd(Object.values(CARD_DATA).filter(c=>c.type==='dilemma'))); }
      else if(t.includes('chain')){ resolveCard(p,rnd(Object.values(CARD_DATA).filter(c=>c.type==='chain'))); }
      else if(t.includes('wonder')){ resolveWonder(p,rnd(Object.values(CARD_DATA).filter(c=>c.type==='wonder'))); }
      else doOptBuild(false);
    }
  }
}

function resolveNewEvent(p, space){
  // Apply modifiers from new event format
  const mods = space.modifiers || {};
  
  if(mods.capital) p.capital = Math.max(0, p.capital + mods.capital);
  if(mods.wellbeing) p.wellbeing = Math.max(0, p.wellbeing + mods.wellbeing);
  if(mods.pollution) p.pollution = Math.max(0, Math.min(100, p.pollution + mods.pollution));
  if(mods.globalEco) G.globalEco = Math.max(0, Math.min(100, G.globalEco + mods.globalEco));
  if(mods.land) p.land = Math.max(0, p.land + mods.land);
  if(mods.vp) p.vp = p.vp + mods.vp;

  updateDash(p); updateEco(); updateVP();

  // Build effect chips for display
  const effects = [];
  if(mods.capital) effects.push({label:`${mods.capital>0?'+':''}${mods.capital} Capital`, cls:'ch-cap'});
  if(mods.wellbeing) effects.push({label:`${mods.wellbeing>0?'+':''}${mods.wellbeing} WB`, cls:'ch-wb'});
  if(mods.pollution) effects.push({label:`${mods.pollution>0?'+':''}${mods.pollution} Pollution`, cls:'ch-pol'});
  if(mods.globalEco) effects.push({label:`${mods.globalEco>0?'+':''}${mods.globalEco} Global Eco`, cls:'ch-eco'});
  if(mods.land) effects.push({label:`${mods.land>0?'+':''}${mods.land} Land`, cls:'ch-land'});
  if(mods.vp) effects.push({label:`${mods.vp>0?'+':''}${mods.vp} VP`, cls:'ch-vp'});

  // Determine event type from points
  let typeLabel = '📋 EVENT';
  if(space.points > 0) typeLabel = '✨ POSITIVE';
  else if(space.points < 0) typeLabel = '⚠️ NEGATIVE';

  showCard({
    type: typeLabel,
    icon: space.icon,
    name: space.label,
    desc: `${space.label}`,
    effects: effects,
    onOk: ()=>{ if(!checkElim(p)) doOptBuild(false); }
  });

  log(`${p.name}: ${typeLabel} — ${space.label}`, space.points < 0 ? 'bad' : 'good');
}

function resolveCard(p,cd,name){
  if(!cd){ doOptBuild(false); return; }
  if(cd.type==='dilemma'){
    showDilemma(p,cd,name); return;
  }
  if(cd.type==='wonder'){
    resolveWonder(p,cd,name); return;
  }
  if(cd.type==='chain'){
    // Show chain as a choice
    $('cpTitle').textContent=`🔗 Chain Reaction: ${name||cd.icon}`;
    $('cpDesc').textContent=cd.desc+(cd.nextRound?'\n\nNext round effect will also apply.':'');
    $('cpOpts').innerHTML='';
    const btn=document.createElement('button'); btn.className='cbtn';
    btn.textContent='▸ '+Object.entries(cd.effects).map(([k,v])=>`${k} ${v>0?'+':''}${v}`).join(', ');
    btn.onclick=()=>{ applyFx(p,cd.effects); if(cd.nextRound) p.pendingChain=cd.nextRound; updateDash(p); updateEco(); hideChoice(); doOptBuild(false); };
    $('cpOpts').appendChild(btn); $('choicePanel').style.display='block';
    log(`${p.name}: Chain Reaction!`,'info'); return;
  }
  // crisis / positive
  applyFx(p,cd.effects);
  updateDash(p); updateEco(); updateVP();
  const typeLabel= cd.type==='crisis'?'⚠️ CRISIS':cd.type==='positive'?'✨ POSITIVE':'📋 EVENT';
  showCard({type:typeLabel,icon:cd.icon,name:name||cd.icon,desc:cd.desc,
    effects:fxChips(cd.effects),
    onOk:()=>{ if(!checkElim(p)) doOptBuild(false); }});
  log(`${p.name}: ${cd.type.toUpperCase()} — ${name||cd.icon}`,cd.type==='crisis'?'bad':'good');
}

function resolveAsset(p){
  // Landing on a City Asset space → can purchase or produces a small random gain
  const capGain=Math.floor(Math.random()*4)+2;
  const echoPol=Math.floor(Math.random()*3)+1;
  p.capital+=capGain; p.echo+=echoPol;
  updateDash(p);
  showCard({type:'🏭 CITY ASSET',icon:'⚙️',name:'Industrial Activity',
    desc:'Your city\'s sector earns capital, but at an environmental cost.',
    effects:[{label:`+${capGain} Capital`,cls:'ch-cap'},{label:`+${echoPol} Echo Pol.`,cls:'ch-pol'}],
    onOk:()=>doOptBuild(false)});
  log(`${p.name}: Asset +${capGain} Capital, +${echoPol} Echo.`,'info');
}

function resolveWonder(p,cd,name){
  // Wonders affect all players
  G.players.forEach(pl=>{ if(!pl.eliminated) applyFx(pl,cd.effects); });
  updateAllDashes(); updateEco(); updateVP();
  showCard({type:'🌟 WORLD WONDER',icon:cd.icon,name:name||cd.icon||'Wonder',
    desc:cd.desc+'\n'+cd.effect,effects:fxChips(cd.effects),
    onOk:()=>doOptBuild(false)});
  log(`🌟 WORLD WONDER: ${name||cd.icon}!`,'gold');
}

function showDilemma(p,cd,name){
  $('cpTitle').textContent=`🌿 Dilemma: ${name||cd.icon} ${cd.icon}`;
  $('cpDesc').textContent=cd.desc;
  $('cpOpts').innerHTML='';
  (cd.options||[]).forEach(opt=>{
    const b=document.createElement('button'); b.className='cbtn'; b.textContent=opt.text;
    b.onclick=()=>{ applyFx(p,opt.effects); updateDash(p); updateEco(); hideChoice(); log(`${p.name}: ${opt.text}`,'info'); doOptBuild(false); };
    $('cpOpts').appendChild(b);
  });
  $('choicePanel').style.display='block';
  log(`${p.name}: Dilemma — ${name||cd.icon}`,'gold');
}

// ── Phase 6: Optional Building ────────────────────────────────
function doOptBuild(isFree){
  setPhase(6); G.isFree=isFree; const p=cur();
  const avail=BUILDING_CARDS.filter(c=>!p.buildings.includes(c.id)&&(isFree||(p.capital>=c.cost.capital&&p.land>=c.cost.land)));
  if(!avail.length){ setMsg('No affordable buildings.'); setTimeout(doProd,400); return; }
  renderBuildList(p,isFree);
  $('buildPanel').style.display='block';
  $('btnSkipBuild').onclick=()=>{ hideBuild(); doProd(); };
  document.querySelectorAll('.fbtn').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('.fbtn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderBuildList(p,isFree,b.dataset.cat); }));
}

function renderBuildList(p,isFree,cat='all'){
  const list=$('bpList'); list.innerHTML='';
  let cards=BUILDING_CARDS.filter(c=>!p.buildings.includes(c.id));
  if(cat!=='all') cards=cards.filter(c=>c.cat===cat);
  cards.forEach(c=>{
    const can=isFree||(p.capital>=c.cost.capital&&p.land>=c.cost.land);
    const el=document.createElement('div'); el.className='bc'+(can?'':' unaffordable');
    el.innerHTML=`<span class="bc-ic">${c.icon}</span><div><div class="bc-nm">${c.name}</div><div class="bc-st">${isFree?'<span class="bc-cap">FREE</span>':`<span class="bc-cap">💰${c.cost.capital} 🗺${c.cost.land}</span>`}${c.echo?`<span class="bc-pol">+${c.echo}💨</span>`:''}${c.production.wellbeing?`<span class="bc-wb">+${c.production.wellbeing}😊/t</span>`:''}${c.production.capital?`<span class="bc-cap">+${c.production.capital}💰/t</span>`:''}  <span class="bc-vp">${c.vp}VP</span></div></div>`;
    if(can) el.onclick=()=>showBuildModal(c,isFree);
    list.appendChild(el);
  });
}

function showBuildModal(card,isFree){
  $('mBuildIcon').textContent=card.icon; $('mBuildName').textContent=card.name;
  $('mBuildDesc').textContent=`${card.group} · ${card.cat}`;
  const eff=[];
  if(!isFree){ eff.push({label:`−${card.cost.capital} Capital`,cls:'ch-cap'}); eff.push({label:`−${card.cost.land} Land`,cls:'ch-land'}); }
  if(card.echo) eff.push({label:`+${card.echo} Echo`,cls:'ch-pol'});
  if(card.production.capital)   eff.push({label:`+${card.production.capital} Cap/turn`,cls:'ch-cap'});
  if(card.production.wellbeing) eff.push({label:`+${card.production.wellbeing} WB/turn`,cls:'ch-wb'});
  if(card.vp) eff.push({label:`+${card.vp} VP`,cls:'ch-vp'});
  $('mBuildEffects').innerHTML=eff.map(e=>`<span class="chip ${e.cls}">${e.label}</span>`).join('');
  $('modal-build').style.display='flex';
  $('btnConfirmBuild').onclick=()=>{ $('modal-build').style.display='none'; doBuild(card,isFree); };
  $('btnCancelBuild').onclick=()=>{ $('modal-build').style.display='none'; };
}

function doBuild(card,isFree){
  const p=cur();
  if(!isFree){ p.capital-=card.cost.capital; p.land=Math.max(0,p.land-card.cost.land); }
  else p.land=Math.max(0,p.land-card.cost.land);
  p.echo+=card.echo; p.buildings.push(card.id);
  if(!p.setCounts[card.cat]) p.setCounts[card.cat]=0;
  p.setCounts[card.cat]++;
  if(p.setCounts[card.cat]===3&&!p.completedSets[card.cat]){ p.completedSets[card.cat]=true; p.vp++; log(`${p.name} completes ${card.cat} SET — +1VP!`,'gold'); }
  p.vp+=card.vp;
  updateDash(p); updateVP(); hideBuild();
  log(`${p.name} builds ${card.icon} ${card.name} (+${card.vp}VP)`,'good');
  if(checkWin(p)) return;
  doProd();
}

// ── Phase 7: Production ───────────────────────────────────────
function doProd(){
  setPhase(7); const p=cur();
  p.buildings.forEach(bid=>{
    const c=BUILDING_CARDS.find(x=>x.id===bid); if(!c) return;
    const pr=c.production;
    if(pr.capital)   p.capital+=pr.capital;
    if(pr.wellbeing) p.wellbeing+=pr.wellbeing;
    if(pr.pollution&&pr.pollution<0) p.echo=Math.max(0,p.echo+pr.pollution);
    if(pr.globalEco) G.globalEco=clamp(G.globalEco+pr.globalEco,0,100);
  });
  updateDash(p); updateEco();
  doThreshold();
}

// ── Phase 8: Thresholds ───────────────────────────────────────
function doThreshold(){ setPhase(8); const p=cur(); if(!checkElim(p)) doWheel(); }

function checkElim(p){
  let r=null;
  if(p.pollution>=100) r='Pollution reached 100!';
  else if(p.capital<=0) r='Capital fell to 0!';
  else if(p.wellbeing<=0) r='Well-being fell to 0!';
  if(r&&!p.eliminated){
    p.eliminated=true; updateDash(p); log(`💀 ${p.name} ELIMINATED: ${r}`,'bad');
    $('elimTitle').textContent=`${p.name} Eliminated!`; $('elimReason').textContent=r;
    $('modal-elim').style.display='flex';
    $('btnElimOk').onclick=()=>{
      $('modal-elim').style.display='none';
      const alive=G.players.filter(x=>!x.eliminated);
      if(alive.length===1&&G.players.length>1) declareWinner(alive[0],'Last player standing!');
      else if(alive.length===0) gameOver();
      else doWheel();
    };
    return true;
  }
  return false;
}

function checkWin(p){ if(p.vp>=30){ declareWinner(p,'Reached 30 Victory Points!'); return true; } return false; }
function declareWinner(p,r){
  $('wTitle').textContent=`🏆 ${p.name} Wins!`; $('wSub').textContent=r;
  $('wStats').innerHTML=G.players.map(pl=>`<div style="color:${pl.color}"><b>${pl.name}</b>: ${pl.vp}VP | 💰${pl.capital} | 😊${pl.wellbeing} | 💨${pl.pollution}</div>`).join('');
  $('modal-winner').style.display='flex'; log(`🏆 ${p.name} WINS! ${r}`,'gold');
}
function gameOver(){
  $('wTitle').textContent='No Winner'; $('wSub').textContent='All players eliminated.'; $('wStats').innerHTML='';
  $('modal-winner').style.display='flex';
}

// ── Phase 9: Wheel ────────────────────────────────────────────
function doWheel(){
  setPhase(9);
  $('modal-wheel').style.display='flex';
  $('btnSpin').style.display='block'; $('btnWheelOk').style.display='none';
  $('wheelResult').style.display='none';
  drawWheel(0);
  $('btnSpin').onclick=spinWheel;
}

let wAngle=0;
function drawWheel(rot){
  const cv=$('wheelCanvas'), ctx=cv.getContext('2d');
  const cx=140,cy=140,r=136;
  ctx.clearRect(0,0,280,280);
  WHEEL_EVENTS.forEach((ev,i)=>{
    const s=(i/8)*Math.PI*2+rot, e=((i+1)/8)*Math.PI*2+rot;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,s,e); ctx.closePath();
    ctx.fillStyle=ev.color; ctx.fill(); ctx.strokeStyle='rgba(200,168,75,.5)'; ctx.lineWidth=1.5; ctx.stroke();
    const ma=s+(e-s)/2, tx=cx+Math.cos(ma)*r*.65, ty=cy+Math.sin(ma)*r*.65;
    ctx.save(); ctx.translate(tx,ty); ctx.rotate(ma+Math.PI/2);
    ctx.fillStyle='white'; ctx.font='bold 8px Rajdhani,sans-serif'; ctx.textAlign='center';
    ctx.fillText(ev.icon,0,-6); ctx.fillText(ev.name.slice(0,7),0,5); ctx.restore();
  });
  ctx.beginPath(); ctx.arc(cx,cy,16,0,Math.PI*2); ctx.fillStyle='#c8a84b'; ctx.fill();
  ctx.strokeStyle='white'; ctx.lineWidth=2; ctx.stroke();
}

function spinWheel(){
  $('btnSpin').disabled=true;
  const total=(Math.random()*4+4)*Math.PI*2+Math.random()*Math.PI*2;
  const dur=3000, t0=performance.now(), a0=wAngle;
  function anim(now){
    const t=Math.min(1,(now-t0)/dur), ease=1-Math.pow(1-t,3);
    const cur=a0+total*ease; drawWheel(cur);
    if(t<1){ requestAnimationFrame(anim); return; }
    wAngle=cur%(Math.PI*2);
    const norm=(((-Math.PI/2)-wAngle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
    const idx=Math.floor(norm/(Math.PI*2/8))%8;
    const ev=WHEEL_EVENTS[idx];
    ev.effect(G.players,G);
    updateAllDashes(); updateEco(); updateVP();
    $('wheelResult').style.display='block';
    $('wheelResult').innerHTML=`<b>${ev.icon} ${ev.name}</b><br>${ev.desc}<br><em>${ev.effectText}</em>`;
    $('btnSpin').style.display='none'; $('btnWheelOk').style.display='block';
    $('btnWheelOk').onclick=()=>{ $('modal-wheel').style.display='none'; $('btnSpin').disabled=false;
      G.players.forEach(pl=>{ if(!pl.eliminated) checkElim(pl); });
      if(G.globalEco<=0){ G.players.forEach(pl=>{ if(!pl.eliminated) pl.vp=Math.max(0,pl.vp-1); }); G.globalEco=50; updateEco(); updateAllDashes(); updateVP(); log('🌍 Eco hit 0! All −1VP, reset to 50.','bad'); }
      doEndTurn(); };
    log(`🌐 Wheel: ${ev.name} — ${ev.effectText}`,'info');
  }
  requestAnimationFrame(anim);
}

// ── Phase 10: End of Turn ─────────────────────────────────────
function doEndTurn(){
  setPhase(10); log(`${cur().name}'s turn ends.`);
  let next=G.currentIdx, loops=0;
  do { next=(next+1)%G.players.length; loops++; } while(G.players[next].eliminated&&loops<=G.players.length);
  const isNewRound = next<=G.currentIdx;
  if(isNewRound) doEndRound();
  G.currentIdx=next;
  const alive=G.players.filter(p=>!p.eliminated);
  if(!alive.length){ gameOver(); return; }
  if(alive.length===1&&G.players.length>1){ declareWinner(alive[0],'Last player standing!'); return; }
  beginTurn();
}

function doEndRound(){
  G.round++;
  const alive=G.players.filter(p=>!p.eliminated); if(!alive.length) return;
  const avgPol=Math.ceil(alive.reduce((s,p)=>s+p.pollution,0)/alive.length);
  G.globalEco-=avgPol;
  log(`🌍 Round ends: avg pollution ${avgPol} → Eco now ${G.globalEco}.`,'bad');
  if(G.globalEco<=0){
    G.globalEco=50; G.players.forEach(p=>{ if(!p.eliminated) p.vp=Math.max(0,p.vp-1); });
    log('🌍 Eco PENALTY! All −1VP, reset to 50.','bad');
    G.players.forEach(p=>{ if(!p.eliminated) checkElim(p); });
  }
  updateEco();
}

// ── Effects helpers ───────────────────────────────────────────
function applyFx(p,fx){ if(!fx) return;
  if(fx.capital)   p.capital  =Math.max(0,p.capital  +fx.capital);
  if(fx.wellbeing) p.wellbeing=Math.max(0,p.wellbeing+fx.wellbeing);
  if(fx.pollution) { if(fx.pollution>0) p.echo+=fx.pollution; else p.pollution=Math.max(0,p.pollution+fx.pollution); }
  if(fx.globalEco) G.globalEco=clamp(G.globalEco+fx.globalEco,0,100);
  if(fx.vp)        p.vp=Math.max(0,p.vp+fx.vp);
  if(fx.land)      p.land=Math.max(0,p.land+fx.land);
}

function fxChips(fx){ if(!fx) return [];
  return Object.entries(fx).map(([k,v])=>({
    label:(v>0?'+':'')+v+' '+{capital:'Capital',wellbeing:'Well-being',pollution:'Echo Pol.',globalEco:'Global Eco',vp:'VP',land:'Land'}[k],
    cls: k==='capital'?'ch-cap':k==='wellbeing'?'ch-wb':k==='pollution'?'ch-pol':k==='globalEco'?'ch-eco':k==='vp'?'ch-vp':'ch-land',
  }));
}

// ── Card modal ────────────────────────────────────────────────
function showCard({type,icon,name,desc,effects,onOk}){
  $('mType').textContent=type; $('mIcon').textContent=icon;
  $('mName').textContent=name; $('mDesc').textContent=desc;
  $('mEffects').innerHTML=(effects||[]).map(e=>`<span class="chip ${e.cls}">${e.label}</span>`).join('');
  $('modal-card').style.display='flex';
  $('btnMOk').onclick=()=>{ $('modal-card').style.display='none'; if(onOk) onOk(); };
}

// ── BLUEPRINT ─────────────────────────────────────────────────
function openBlueprint(){
  $('modal-blueprint').style.display='flex';
  drawBlueprint();
}

function drawBlueprint(){
  const cv=$('bpCanvas');
  // Blueprint canvas: 1400×1400 px representing 91.44cm×91.44cm
  const SIZE=1400;
  cv.width=SIZE; cv.height=SIZE;
  const ctx=cv.getContext('2d');

  // Background: blueprint dark blue
  ctx.fillStyle='#001830';
  ctx.fillRect(0,0,SIZE,SIZE);

  const f=SIZE/91.44; // px per cm
  const trackW=6.35*f;
  const cornerSz=trackW;
  const sideLen=(SIZE-2*cornerSz)/19;
  const cX=SIZE/2, cY=SIZE/2;
  const hubR=7.62*f;

  // ---- Grid ----
  ctx.strokeStyle='rgba(0,100,200,.2)'; ctx.lineWidth=0.5;
  for(let i=0;i<=91;i+=1){
    const p=i*f;
    ctx.beginPath(); ctx.moveTo(p,0); ctx.lineTo(p,SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,p); ctx.lineTo(SIZE,p); ctx.stroke();
  }
  // Major grid every 5cm
  ctx.strokeStyle='rgba(0,150,255,.35)'; ctx.lineWidth=0.8;
  for(let i=0;i<=91;i+=5){
    const p=i*f;
    ctx.beginPath(); ctx.moveTo(p,0); ctx.lineTo(p,SIZE); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,p); ctx.lineTo(SIZE,p); ctx.stroke();
  }

  // ---- Dimension text helper ----
  function dimLine(x1,y1,x2,y2,label,offset=18,color='#00c8ff'){
    ctx.strokeStyle=color; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    // arrowheads
    function arrow(x,y,ang){ ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
      ctx.fillStyle=color; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-8,4); ctx.lineTo(-8,-4); ctx.closePath(); ctx.fill(); ctx.restore(); }
    const ang=Math.atan2(y2-y1,x2-x1);
    arrow(x1,y1,ang+Math.PI); arrow(x2,y2,ang);
    ctx.fillStyle=color; ctx.font='bold 13px monospace'; ctx.textAlign='middle';
    ctx.fillText(label,(x1+x2)/2,(y1+y2)/2-6);
  }

  // ---- Outer loop border ----
  ctx.strokeStyle='#00c8ff'; ctx.lineWidth=2;
  ctx.strokeRect(0,0,SIZE,SIZE);

  // ---- Track border ----
  ctx.strokeStyle='#00aaee'; ctx.lineWidth=1.5;
  ctx.strokeRect(trackW,trackW,SIZE-2*trackW,SIZE-2*trackW);

  // ---- Outer Loop Spaces ----
  function drawSpace(x,y,w,h,id,label,col,isCorner){
    ctx.fillStyle=col+'33';
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle=col; ctx.lineWidth=isCorner?2:1;
    ctx.strokeRect(x,y,w,h);
    ctx.fillStyle=col; ctx.textAlign='center';
    ctx.font=isCorner?'bold 11px monospace':'bold 9px monospace';
    const lbl=isCorner?label:label.slice(0,10);
    ctx.fillText(lbl, x+w/2, y+h/2-5);
    ctx.font='10px monospace';
    ctx.fillText('#'+id, x+w/2, y+h/2+7);
  }

  const spW=sideLen-1, spH=trackW;
  // Corners
  const cornerColors={'s-start':'#f5e030','s-crisis':'#ff4040','s-event':'#4080ff','s-chain':'#f0a020','s-dilemma':'#c040e0','s-asset':'#40cc40','s-wonder':'#f0f040'};
  const getCol=(sp)=>cornerColors[sp.type]||'#80ff80';

  // Corners
  drawSpace(0,0,cornerSz,cornerSz,1,'START','#f5e030',true);
  drawSpace(SIZE-cornerSz,0,cornerSz,cornerSz,21,'TERRORISM','#ff4040',true);
  drawSpace(SIZE-cornerSz,SIZE-cornerSz,cornerSz,cornerSz,41,'DEFORESTATION','#ff4040',true);
  drawSpace(0,SIZE-cornerSz,cornerSz,cornerSz,61,'POLL.DISASTER','#ff4040',true);

  // Side 1: top (2-20)
  for(let i=0;i<19;i++){
    const sp=OUTER_SPACES.find(s=>s.id===i+2);
    if(sp) drawSpace(cornerSz+i*sideLen, 0, spW, spH, sp.id, sp.label, getCol(sp), false);
  }
  // Side 2: right (22-40)
  for(let i=0;i<19;i++){
    const sp=OUTER_SPACES.find(s=>s.id===i+22);
    if(sp) drawSpace(SIZE-spH, cornerSz+i*sideLen, spH, spW, sp.id, sp.label, getCol(sp), false);
  }
  // Side 3: bottom (42-60) right→left
  for(let i=0;i<19;i++){
    const sp=OUTER_SPACES.find(s=>s.id===i+42);
    if(sp) drawSpace(SIZE-cornerSz-(i+1)*sideLen, SIZE-spH, spW, spH, sp.id, sp.label, getCol(sp), false);
  }
  // Side 4: left (62-80) bottom→top
  for(let i=0;i<19;i++){
    const sp=OUTER_SPACES.find(s=>s.id===i+62);
    if(sp) drawSpace(0, SIZE-cornerSz-(i+1)*sideLen, spH, spW, sp.id, sp.label, getCol(sp), false);
  }

  // ---- Inner path lines ----
  ctx.strokeStyle='rgba(0,200,100,.5)'; ctx.lineWidth=2; ctx.setLineDash([8,4]);
  ctx.beginPath(); ctx.moveTo(cX,trackW); ctx.lineTo(cX,cY-hubR); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cX,cY+hubR); ctx.lineTo(cX,SIZE-trackW); ctx.stroke();
  ctx.strokeStyle='rgba(180,60,20,.5)';
  ctx.beginPath(); ctx.moveTo(trackW,cY); ctx.lineTo(cX-hubR,cY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cX+hubR,cY); ctx.lineTo(SIZE-trackW,cY); ctx.stroke();
  ctx.strokeStyle='rgba(200,200,0,.5)';
  ctx.beginPath(); ctx.moveTo(trackW,trackW); ctx.lineTo(cX-hubR*.7,cY-hubR*.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SIZE-trackW,trackW); ctx.lineTo(cX+hubR*.7,cY-hubR*.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(SIZE-trackW,SIZE-trackW); ctx.lineTo(cX+hubR*.7,cY+hubR*.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(trackW,SIZE-trackW); ctx.lineTo(cX-hubR*.7,cY+hubR*.7); ctx.stroke();
  ctx.setLineDash([]);

  // ---- Inner spaces ----
  const iOrtW=5.29*f, iOrtH=5.08*f, iDiagW=6.86*f, iDiagH=5.08*f;
  function drawInner(cx,cy,w,h,label,col,ang){
    ctx.save(); ctx.translate(cx,cy); if(ang) ctx.rotate(ang*Math.PI/180);
    ctx.fillStyle=col+'22'; ctx.fillRect(-w/2,-h/2,w,h);
    ctx.strokeStyle=col; ctx.lineWidth=1; ctx.strokeRect(-w/2,-h/2,w,h);
    ctx.fillStyle=col; ctx.textAlign='center'; ctx.font='8px monospace';
    ctx.fillText(label.slice(0,12),0,3); ctx.restore();
  }
  const iL=trackW,iT=trackW,iR=SIZE-trackW,iB=SIZE-trackW;
  const upAvail=cY-hubR-iT, upStep=upAvail/6;
  for(let i=0;i<6;i++){ const sp=INNER_SPACES.find(s=>s.id==='UP'+(i+1)); if(sp) drawInner(cX,iT+i*upStep+upStep/2,iOrtH,iOrtW,sp.name,'#00dd88'); }
  const riAvail=iR-(cX+hubR), riStep=riAvail/6;
  for(let i=0;i<6;i++){ const sp=INNER_SPACES.find(s=>s.id==='RI'+(i+1)); if(sp) drawInner(iR-i*riStep-riStep/2,cY,iOrtW,iOrtH,sp.name,'#cc6030'); }
  const dnAvail=iB-(cY+hubR), dnStep=dnAvail/6;
  for(let i=0;i<6;i++){ const sp=INNER_SPACES.find(s=>s.id==='DN'+(i+1)); if(sp) drawInner(cX,iB-i*dnStep-dnStep/2,iOrtH,iOrtW,sp.name,'#4488ff'); }
  const lfAvail=(cX-hubR)-iL, lfStep=lfAvail/6;
  for(let i=0;i<6;i++){ const sp=INNER_SPACES.find(s=>s.id==='LF'+(i+1)); if(sp) drawInner(iL+i*lfStep+lfStep/2,cY,iOrtW,iOrtH,sp.name,'#cc44cc'); }
  const diagPairs=[{pre:'TR',x1:iR,y1:iT,col:'#ffee00'},{pre:'BR',x1:iR,y1:iB,col:'#ff8844'},{pre:'BL',x1:iL,y1:iB,col:'#88ff44'},{pre:'TL',x1:iL,y1:iT,col:'#44ccff'}];
  diagPairs.forEach(({pre,x1,y1,col})=>{
    for(let i=0;i<7;i++){
      const t=(i+0.5)/7;
      const dx=cX+(x1>cX?-1:1)*(cX-Math.min(x1,cX))*(1-t)*-1;
      const cx2=x1+(cX-x1)*t, cy2=y1+(cY-y1)*t;
      const sp=INNER_SPACES.find(s=>s.id===pre+(i+1)); if(!sp) continue;
      const ang=Math.atan2(cY-y1,cX-x1)*180/Math.PI;
      drawInner(cx2,cy2,iDiagW,iDiagH,sp.name,col,ang);
    }
  });

  // ---- Center Hub ----
  ctx.beginPath(); ctx.arc(cX,cY,hubR,0,Math.PI*2);
  ctx.fillStyle='rgba(0,80,20,.3)'; ctx.fill();
  ctx.strokeStyle='#c8a84b'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle='#c8a84b'; ctx.font='bold 14px monospace'; ctx.textAlign='center';
  ctx.fillText('GLOBAL ECO HUB',cX,cY-6); ctx.fillText(`ø ${(hubR/f*2).toFixed(2)} cm`,cX,cY+12);

  // ---- Dimension annotations ----
  ctx.strokeStyle='#00c8ff'; ctx.fillStyle='#00c8ff'; ctx.lineWidth=1.5;
  // Full board width
  ctx.beginPath(); ctx.moveTo(20,SIZE+20); ctx.lineTo(SIZE-20,SIZE+20);
  // Just annotate as text instead
  ctx.font='bold 14px monospace'; ctx.textAlign='center';
  ctx.fillText('← 91.44 cm →', SIZE/2, SIZE-6);
  ctx.save(); ctx.translate(SIZE-8,SIZE/2); ctx.rotate(-Math.PI/2);
  ctx.fillText('← 91.44 cm →',0,0); ctx.restore();

  // Track width annotation
  ctx.font='10px monospace'; ctx.textAlign='left'; ctx.fillStyle='#88ccff';
  ctx.fillText('Outer Track: 6.35 cm',4,trackW+14);
  ctx.fillText(`Corner: 6.35×6.35 cm`,4,trackW+26);
  ctx.fillText(`Side Space: 4.14×6.35 cm`,4,trackW+38);
  ctx.fillText(`Orth.Tile: 5.29×5.08 cm`,4,trackW+50);
  ctx.fillText(`Diag.Tile: 6.86×5.08 cm`,4,trackW+62);
  ctx.fillText(`Total Spaces: 132`,4,trackW+74);
  ctx.fillText(`(80 outer + 52 inner)`,4,trackW+86);

  // ---- Title block ----
  ctx.fillStyle='rgba(0,20,60,.8)'; ctx.fillRect(0,SIZE-32,SIZE,32);
  ctx.strokeStyle='#00c8ff'; ctx.lineWidth=1; ctx.strokeRect(0,SIZE-32,SIZE,32);
  ctx.fillStyle='#00c8ff'; ctx.font='bold 13px monospace'; ctx.textAlign='center';
  ctx.fillText('ECOPOLIS BOARD GAME — TECHNICAL BLUEPRINT  |  Scale 1:1  |  91.44 cm × 91.44 cm  |  132 Spaces Total',SIZE/2,SIZE-12);

  // ---- Legend ----
  const legItems=[['#f5e030','Start Corner'],['#ff4040','Crisis'],['#40cc40','City Asset'],['#c040e0','Dilemma'],['#f0a020','Chain Reaction'],['#f0f040','Wonder'],['#4080ff','Event'],['#00dd88','Inner Ortho'],['#ffee00','Inner Diagonal']];
  let lx=6, ly=SIZE-50;
  ctx.font='9px monospace';
  legItems.forEach(([col,lbl])=>{
    ctx.fillStyle=col; ctx.fillRect(lx,ly,12,9); lx+=14;
    ctx.fillStyle='#aaddff'; ctx.fillText(lbl,lx,ly+9); lx+=ctx.measureText(lbl).width+8;
    if(lx>SIZE-120){ lx=6; ly-=14; }
  });
}

function downloadBlueprint(){
  const cv=$('bpCanvas');
  const link=document.createElement('a');
  link.download='ecopolis_board_blueprint.png';
  link.href=cv.toDataURL('image/png');
  link.click();
}

// ── Resize handler ────────────────────────────────────────────
let resizeT;
window.addEventListener('resize',()=>{
  clearTimeout(resizeT);
  resizeT=setTimeout(()=>{ if($('screen-game').classList.contains('active')) buildBoard(); },300);
});

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{ initSetup(); showScreen('screen-setup'); });
