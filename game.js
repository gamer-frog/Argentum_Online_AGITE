(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const WORLD = { w: 1800, h: 1200 };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const keys = new Set();
  const player = { x: 780, y: 680, hp: 100, mp: 40, stam: 100, xp: 0, level: 1, gold: 24, potions: 3, manas: 2, dir: 1, attacking: 0 };
  const npc = { x: 780, y: 535 };
  const trees = [];
  for (let i = 0; i < 84; i++) {
    const x = 35 + ((i * 197 + (i % 7) * 61) % 1730);
    const y = 35 + ((i * 131 + (i % 9) * 47) % 1120);
    if (Math.hypot(x - 780, y - 590) > 245) trees.push({ x, y, size: 15 + (i * 7 % 14), tone: i % 3 });
  }
  const state = {
    started: false, paused: false, last: 0, time: 0, zoom: 1,
    camera: { x: player.x, y: player.y }, moveTarget: null, selected: null,
    attackAt: 0, questKills: 0, questDone: false, sound: false, toastTimer: 0,
    slimes: [
      { id: 1, x: 480, y: 570, homeX: 480, homeY: 570, hp: 36, max: 36, attack: 0, alive: true },
      { id: 2, x: 1020, y: 500, homeX: 1020, homeY: 500, hp: 36, max: 36, attack: 0, alive: true },
      { id: 3, x: 1130, y: 755, homeX: 1130, homeY: 755, hp: 36, max: 36, attack: 0, alive: true },
      { id: 4, x: 520, y: 880, homeX: 520, homeY: 880, hp: 36, max: 36, attack: 0, alive: true }
    ]
  };

  function addLog(text, kind = '') {
    const log = $('chatLog');
    const row = document.createElement('p');
    const time = document.createElement('time');
    const message = document.createElement('span');
    time.textContent = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    message.textContent = text;
    if (kind) message.className = kind;
    row.append(time, message);
    log.append(row);
    log.scrollTop = log.scrollHeight;
  }

  function notify(message) {
    const box = $('worldMessage');
    box.lastElementChild.textContent = message;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => { box.lastElementChild.textContent = 'El bosque está tranquilo... por ahora.'; }, 2500);
  }

  function updateHUD() {
    $('levelText').textContent = player.level;
    $('levelMini').textContent = player.level;
    $('xpText').textContent = player.xp;
    $('xpGoal').textContent = player.level * 100;
    $('xpBar').style.width = `${player.xp / (player.level * 100) * 100}%`;
    $('hpText').textContent = `${Math.ceil(player.hp)} / 100`;
    $('hpBar').style.width = `${player.hp}%`;
    $('mpText').textContent = `${Math.ceil(player.mp)} / 40`;
    $('mpBar').style.width = `${player.mp / 40 * 100}%`;
    $('stamText').textContent = `${Math.ceil(player.stam)} / 100`;
    $('stamBar').style.width = `${player.stam}%`;
    $('goldText').textContent = player.gold;
    $('potionCount').textContent = player.potions;
    $('manaCount').textContent = player.manas;
    $('questCount').textContent = state.questDone ? 'COMPLETADA' : `${Math.min(state.questKills, 3)} / 3`;
    $('nearbyNum').textContent = state.slimes.filter(s => s.alive && Math.hypot(s.x - player.x, s.y - player.y) < 560).length;
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  function drawGround(w, h) {
    ctx.fillStyle = '#78916a'; ctx.fillRect(0, 0, WORLD.w, WORLD.h);
    // Soft, irregular clearings keep the forest floor from looking flat.
    for (let i = 0; i < 70; i++) {
      const x = (i * 271 + 90) % WORLD.w, y = (i * 173 + 45) % WORLD.h;
      ctx.fillStyle = i % 2 ? '#829a70' : '#718967';
      ctx.beginPath(); ctx.ellipse(x, y, 35 + i % 25, 16 + i % 12, i % 2, 0, Math.PI * 2); ctx.fill();
    }
    // Winding pale dirt road leading from the village into the woods.
    ctx.strokeStyle = '#b7a77b'; ctx.lineWidth = 100; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(170, 735); ctx.bezierCurveTo(420, 690, 540, 770, 700, 685); ctx.bezierCurveTo(900, 580, 980, 635, 1220, 590); ctx.stroke();
    ctx.strokeStyle = '#c9b88a'; ctx.lineWidth = 74; ctx.beginPath();
    ctx.moveTo(170, 735); ctx.bezierCurveTo(420, 690, 540, 770, 700, 685); ctx.bezierCurveTo(900, 580, 980, 635, 1220, 590); ctx.stroke();
    // Stream at the edge of the clearing.
    ctx.strokeStyle = '#608c8a'; ctx.lineWidth = 54; ctx.beginPath(); ctx.moveTo(1450, 60); ctx.bezierCurveTo(1320, 260, 1510, 410, 1390, 630); ctx.bezierCurveTo(1290, 830, 1500, 1010, 1330, 1180); ctx.stroke();
    ctx.strokeStyle = '#78a3a0'; ctx.lineWidth = 37; ctx.beginPath(); ctx.moveTo(1450, 60); ctx.bezierCurveTo(1320, 260, 1510, 410, 1390, 630); ctx.bezierCurveTo(1290, 830, 1500, 1010, 1330, 1180); ctx.stroke();
    // Distant village fence.
    ctx.strokeStyle = '#897954'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(620, 420); ctx.lineTo(940, 420); ctx.moveTo(620, 420); ctx.lineTo(620, 520); ctx.moveTo(940, 420); ctx.lineTo(940, 520); ctx.stroke();
    for (let x = 620; x <= 940; x += 32) { ctx.beginPath(); ctx.moveTo(x, 410); ctx.lineTo(x, 432); ctx.stroke(); }
    // Grass flecks.
    for (let i = 0; i < 135; i++) {
      const x = (i * 113 + 20) % WORLD.w, y = (i * 89 + 33) % WORLD.h;
      ctx.strokeStyle = i % 2 ? '#9eb17d' : '#627d5e'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - 5); ctx.stroke();
    }
  }

  function drawHouse() {
    // Ullathorpe's inn, timber-framed and warmly lit.
    ctx.fillStyle = '#4b5c42'; ctx.fillRect(681, 438, 198, 108);
    ctx.fillStyle = '#d1bd8c'; ctx.fillRect(692, 460, 176, 85);
    ctx.fillStyle = '#79543c'; ctx.beginPath(); ctx.moveTo(665, 465); ctx.lineTo(779, 389); ctx.lineTo(895, 465); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a06f45'; ctx.beginPath(); ctx.moveTo(685, 461); ctx.lineTo(779, 400); ctx.lineTo(875, 461); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#60452f'; ctx.fillRect(757, 486, 43, 59);
    ctx.fillStyle = '#e2cc83'; ctx.fillRect(710, 479, 28, 26); ctx.fillRect(820, 479, 28, 26);
    ctx.fillStyle = '#594832'; ctx.fillRect(724, 477, 3, 30); ctx.fillRect(708, 490, 32, 3); ctx.fillRect(834, 477, 3, 30); ctx.fillRect(818, 490, 32, 3);
    ctx.fillStyle = '#584b38'; ctx.font = '12px Georgia'; ctx.textAlign = 'center'; ctx.fillText('LA POSADA', 780, 455);
    // Warm light and a little sign.
    ctx.fillStyle = '#f2d89a'; ctx.fillRect(800, 515, 4, 4);
    ctx.fillStyle = '#725237'; ctx.fillRect(882, 474, 5, 37); ctx.fillStyle = '#bd9958'; ctx.fillRect(874, 477, 23, 16);
    ctx.fillStyle = '#fff0bd'; ctx.font = '11px Georgia'; ctx.fillText('✦', 885, 489);
  }

  function drawTree(tree) {
    const { x, y, size: r, tone } = tree;
    ctx.fillStyle = '#526844'; ctx.beginPath(); ctx.ellipse(x + 4, y + 8, r * 1.25, r * .48, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ['#38543b', '#456341', '#3c5a40'][tone]; ctx.beginPath(); ctx.arc(x, y - r * .35, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ['#527148', '#5b784a', '#4d6b46'][tone]; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .55, r * .58, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#708856'; ctx.beginPath(); ctx.arc(x + r * .32, y - r * .88, r * .4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8ea06b'; ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(x - r * .23, y - r * 1.04, r * .2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }

  function drawNpc() {
    ctx.fillStyle = '#4f6044'; ctx.beginPath(); ctx.ellipse(npc.x, npc.y + 13, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#796343'; ctx.fillRect(npc.x - 10, npc.y - 5, 20, 20);
    ctx.fillStyle = '#d7bc91'; ctx.beginPath(); ctx.arc(npc.x, npc.y - 12, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6b492d'; ctx.beginPath(); ctx.arc(npc.x, npc.y - 17, 10, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#f3e7c7'; ctx.font = '11px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Don Eusebio', npc.x, npc.y - 33);
    ctx.fillStyle = '#bd9958'; ctx.beginPath(); ctx.arc(npc.x + 17, npc.y - 29, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('!', npc.x + 17, npc.y - 25);
  }

  function drawPlayer() {
    ctx.fillStyle = '#4b5d43'; ctx.beginPath(); ctx.ellipse(player.x, player.y + 11, 16, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = player.attacking > 0 ? '#d2bd79' : '#667f8b'; roundedRect(player.x - 9, player.y - 11, 18, 24, 5); ctx.fill();
    ctx.fillStyle = '#d9bf9a'; ctx.beginPath(); ctx.arc(player.x, player.y - 17, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#866649'; ctx.beginPath(); ctx.arc(player.x, player.y - 21, 9, Math.PI, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d8d1b3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(player.x + player.dir * 8, player.y - 5); ctx.lineTo(player.x + player.dir * (player.attacking > 0 ? 27 : 17), player.y - 16); ctx.stroke();
    ctx.fillStyle = '#f5ead0'; ctx.font = '10px Georgia'; ctx.textAlign = 'center'; ctx.fillText('Aventurero', player.x, player.y - 34);
  }

  function drawSlime(s) {
    const bob = Math.sin(state.time * 4 + s.id) * 2;
    ctx.fillStyle = '#526d4d'; ctx.beginPath(); ctx.ellipse(s.x, s.y + 7, 20, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = s.hit > 0 ? '#eff1b0' : '#7fb067'; ctx.beginPath(); ctx.ellipse(s.x, s.y - 2 + bob, 17, 14 - Math.max(0, s.hit || 0) * 5, 0, Math.PI, 0); ctx.quadraticCurveTo(s.x + 16, s.y + 12 + bob, s.x, s.y + 12 + bob); ctx.quadraticCurveTo(s.x - 16, s.y + 12 + bob, s.x - 17, s.y - 2 + bob); ctx.fill();
    ctx.fillStyle = '#294532'; ctx.beginPath(); ctx.arc(s.x - 5, s.y + 1 + bob, 1.7, 0, Math.PI * 2); ctx.arc(s.x + 5, s.y + 1 + bob, 1.7, 0, Math.PI * 2); ctx.fill();
    if (s.hp < s.max) { ctx.fillStyle = '#354838'; ctx.fillRect(s.x - 16, s.y - 23, 32, 4); ctx.fillStyle = '#bc6656'; ctx.fillRect(s.x - 16, s.y - 23, 32 * Math.max(0, s.hp / s.max), 4); }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(state.zoom, state.zoom); ctx.translate(-state.camera.x, -state.camera.y);
    drawGround(w, h); drawHouse();
    const things = trees.filter(t => Math.abs(t.x - state.camera.x) < w / state.zoom / 2 + 80 && Math.abs(t.y - state.camera.y) < h / state.zoom / 2 + 80).map(t => ({ y: t.y, draw: () => drawTree(t) }));
    things.push({ y: npc.y, draw: drawNpc }, ...state.slimes.filter(s => s.alive).map(s => ({ y: s.y, draw: () => drawSlime(s) })), { y: player.y, draw: drawPlayer });
    things.sort((a, b) => a.y - b.y).forEach(item => item.draw());
    const selected = state.slimes.find(s => s.id === state.selected && s.alive);
    if (selected) { ctx.strokeStyle = '#e7d18b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(selected.x, selected.y + 13, 23, 7, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }

  function worldPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left - rect.width / 2) / state.zoom + state.camera.x, y: (event.clientY - rect.top - rect.height / 2) / state.zoom + state.camera.y };
  }

  function updateNearby() {
    const nearby = state.slimes.filter(s => s.alive && Math.hypot(s.x - player.x, s.y - player.y) < 560).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y)).slice(0, 3);
    $('nearbyNum').textContent = nearby.length;
    $('nearbyList').innerHTML = nearby.length ? nearby.map(s => `<div class="nearby-entity" data-target="${s.id}"><span class="entity-avatar monster">◉</span><span class="entity-meta"><b>Limo verde</b><small>${Math.round(Math.hypot(s.x - player.x, s.y - player.y))} pasos · Nivel 1</small></span><span class="entity-health"><i style="width:${100 * s.hp / s.max}%"></i></span><span class="entity-chevron">›</span></div>`).join('') : '<p style="font-size:9px;color:#999;margin:12px 0">No hay criaturas cerca.</p>';
  }

  function updateMinimap() {
    const dot = document.querySelector('.player-dot');
    dot.style.left = `${clamp(player.x / WORLD.w * 100, 2, 96)}%`;
    dot.style.top = `${clamp(player.y / WORLD.h * 100, 2, 94)}%`;
    $('coords').textContent = `X: ${String(Math.round(player.x / 20)).padStart(3, '0')} · Y: ${String(Math.round(player.y / 20)).padStart(3, '0')}`;
    updateNearby();
  }

  function fall() {
    player.hp = 100; player.x = 780; player.y = 680; state.camera.x = player.x; state.camera.y = player.y;
    state.slimes.forEach(s => { s.aggro = false; s.x = s.homeX; s.y = s.homeY; });
    notify('Despertaste en Ullathorpe · vida restaurada'); addLog('Don Eusebio te llevó de vuelta a la aldea.');
  }

  function gainXP(amount) {
    player.xp += amount;
    while (player.xp >= player.level * 100) { player.xp -= player.level * 100; player.level++; player.hp = 100; player.mp = 40; notify(`¡Subiste al nivel ${player.level}!`); addLog(`¡Alcanzaste el nivel ${player.level}!`, 'log-quest'); }
    updateHUD();
  }

  function attack() {
    if (!state.started || state.paused) return;
    const now = performance.now(); if (now - state.attackAt < 430) return; state.attackAt = now; player.attacking = .23;
    let target = state.slimes.find(s => s.id === state.selected && s.alive);
    if (!target || Math.hypot(target.x - player.x, target.y - player.y) > 80) target = state.slimes.filter(s => s.alive && Math.hypot(s.x - player.x, s.y - player.y) < 78).sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))[0];
    if (!target) { notify('Acercate a un limo para atacar'); return; }
    state.selected = target.id; state.moveTarget = null;
    const d = Math.hypot(target.x - player.x, target.y - player.y);
    if (d > 43) { player.x += (target.x - player.x) / d * Math.min(22, d - 36); player.y += (target.y - player.y) / d * Math.min(22, d - 36); }
    target.hp -= Math.round(12 + Math.random() * 5); target.hit = .3; player.mp = Math.max(0, player.mp - 1);
    if (target.hp <= 0) {
      target.alive = false; state.questKills++; player.gold += 4; gainXP(28); addLog('Derrotaste un limo verde. +28 XP · +4 oro', 'log-quest'); notify('Limo derrotado · +28 XP · +4 oro');
      if (state.questKills === 3 && !state.questDone) { addLog('Objetivo cumplido: volvé con Don Eusebio.', 'log-quest'); notify('¡Misión cumplida! Volvé con Don Eusebio.'); }
    } else { addLog(`Golpeaste al limo verde. (${Math.max(0, target.hp)} vida)`); notify(`¡Golpe! El limo tiene ${target.hp} de vida.`); }
    updateHUD(); save();
  }

  function usePotion(type) {
    if (type === 'hp') {
      if (!player.potions) { notify('No te quedan pociones de vida'); return; }
      if (player.hp >= 100) { notify('Tu vida ya está completa'); return; }
      player.potions--; player.hp = Math.min(100, player.hp + 45); notify('Poción de vida · +45 ❤️'); addLog('Tomaste una poción de vida.');
    } else {
      if (!player.manas) { notify('No te quedan pociones de maná'); return; }
      if (player.mp >= 40) { notify('Tu maná ya está completo'); return; }
      player.manas--; player.mp = Math.min(40, player.mp + 25); notify('Poción de maná · +25 ✦'); addLog('Tomaste una poción de maná.');
    }
    updateHUD(); save();
  }

  const backdrop = $('modalBackdrop'), content = $('modalContent');
  function openModal(html) { state.paused = true; content.innerHTML = html; backdrop.classList.add('show'); }
  function closeModal() { backdrop.classList.remove('show'); state.paused = false; state.last = performance.now(); }

  function talk() {
    if (!state.started) return;
    if (Math.hypot(player.x - npc.x, player.y - npc.y) > 95) { notify('Acercate a Don Eusebio'); state.moveTarget = { x: npc.x, y: npc.y + 35 }; return; }
    if (state.questKills >= 3 && !state.questDone) {
      openModal('<p class="eyebrow">DON EUSEBIO · ULLATHORPE</p><h2>¡El camino está libre!</h2><p>¡Lo lograste, aventurero! Ya no hay limos merodeando el camino. La aldea te debe una.</p><p style="color:#927e4f">Recompensa: 80 XP · 35 oro · 2 pociones de vida</p><div class="dialog-buttons"><button class="primary" id="claimReward">COBRAR RECOMPENSA</button><button id="modalDismiss">MÁS TARDE</button></div>');
      $('claimReward').onclick = () => { state.questDone = true; player.gold += 35; player.potions += 2; gainXP(80); closeModal(); addLog('Misión completada: Una plaga verde. +80 XP · +35 oro', 'log-quest'); notify('Misión completada · +35 oro · +2 pociones'); updateHUD(); save(); };
      $('modalDismiss').onclick = closeModal; return;
    }
    if (state.questDone) { openModal('<p class="eyebrow">DON EUSEBIO · ULLATHORPE</p><h2>Siempre bienvenido.</h2><p>La aldea está en deuda con vos. Descansá junto al fuego; el camino hacia el sur siempre guarda nuevas historias.</p><div class="dialog-buttons"><button class="primary" id="modalDismiss">HASTA LUEGO</button></div>'); $('modalDismiss').onclick = closeModal; return; }
    openModal('<p class="eyebrow">DON EUSEBIO · ULLATHORPE</p><h2>¡Qué bueno que llegaste!</h2><p>Los limos verdes están invadiendo el camino. ¿Podrías derrotar a tres de ellos? Te recompensaré como corresponde.</p><p style="color:#927e4f">Recompensa: 80 XP · 35 oro · 2 pociones de vida</p><div class="dialog-buttons"><button class="primary" id="acceptQuest">ACEPTAR ENCARGO</button><button id="modalDismiss">DESPUÉS</button></div>');
    $('acceptQuest').onclick = () => { closeModal(); notify('Encargo aceptado · derrotá 3 limos'); addLog('Aceptaste el encargo de Don Eusebio.', 'log-quest'); };
    $('modalDismiss').onclick = closeModal;
  }

  function showInventory() {
    openModal(`<p class="eyebrow">TUS PERTENENCIAS</p><h2>Inventario</h2><p>Lo que llevás con vos en esta aventura.</p><div class="inventory-grid"><div class="inventory-slot">⚔<small>ESPADA CORTA</small></div><div class="inventory-slot">♜<small>TÚNICA DE CUERO</small></div><div class="inventory-slot">🧪<small>POCIÓN × ${player.potions}</small></div><div class="inventory-slot">🔵<small>MANÁ × ${player.manas}</small></div><div class="inventory-slot">◈<small>${player.gold} ORO</small></div><div class="inventory-slot">✦<small>MAPA VIEJO</small></div></div><div class="dialog-buttons"><button class="primary" id="modalDismiss">CERRAR</button></div>`);
    $('modalDismiss').onclick = closeModal;
  }
  function showHelp() {
    openModal('<p class="eyebrow">GUÍA DEL AVENTURERO</p><h2>Cómo jugar</h2><p>Explorá el bosque, ayudá a sus habitantes y convertite en leyenda. El mundo es tuyo.</p><div class="help-list"><span><kbd>W A S D</kbd> Moverte por el bosque</span><span><kbd>CLIC</kbd> Caminar / elegir objetivo</span><span><kbd>ESPACIO</kbd> Atacar al enemigo cercano</span><span><kbd>E</kbd> Hablar con Don Eusebio</span><span><kbd>H</kbd> Poción de vida</span><span><kbd>J</kbd> Poción de maná</span></div><div class="dialog-buttons"><button class="primary" id="modalDismiss">¡A LA AVENTURA!</button></div>');
    $('modalDismiss').onclick = closeModal;
  }

  function update(t) {
    if (!state.started || state.paused) { requestAnimationFrame(update); return; }
    const dt = Math.min(.04, (t - state.last) / 1000 || 0); state.last = t; state.time += dt;
    let dx = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
    let dy = (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0);
    if (state.moveTarget && !dx && !dy) {
      dx = state.moveTarget.x - player.x; dy = state.moveTarget.y - player.y;
      if (Math.hypot(dx, dy) < 8) state.moveTarget = null;
      else { const distance = Math.hypot(dx, dy); dx /= distance; dy /= distance; }
    }
    if (dx || dy) { const distance = Math.hypot(dx, dy); dx /= distance; dy /= distance; player.x = clamp(player.x + dx * 125 * dt, 18, WORLD.w - 18); player.y = clamp(player.y + dy * 125 * dt, 18, WORLD.h - 18); if (Math.abs(dx) > .1) player.dir = Math.sign(dx); player.stam = Math.max(0, player.stam - 5 * dt); }
    else player.stam = Math.min(100, player.stam + 9 * dt);
    for (const s of state.slimes) {
      if (!s.alive) continue;
      s.hit = Math.max(0, (s.hit || 0) - dt * 4); s.attack = Math.max(0, s.attack - dt);
      const distance = Math.hypot(player.x - s.x, player.y - s.y);
      if (distance < 200) s.aggro = true;
      if (s.aggro && distance < 265) {
        if (distance > 31) { s.x += (player.x - s.x) / distance * 48 * dt; s.y += (player.y - s.y) / distance * 48 * dt; }
        else if (s.attack <= 0) { s.attack = 1.6; player.hp = Math.max(0, player.hp - 5); addLog('Un limo verde te golpea.'); notify('El limo te golpeó · −5 vida'); if (player.hp <= 0) fall(); }
      } else if (distance > 320) s.aggro = false;
      else if (!s.aggro) { s.x += Math.sin(state.time * .8 + s.id) * 5 * dt; s.y += Math.cos(state.time * .7 + s.id) * 4 * dt; }
    }
    state.camera.x += (player.x - state.camera.x) * Math.min(1, dt * 4); state.camera.y += (player.y - state.camera.y) * Math.min(1, dt * 4);
    player.attacking = Math.max(0, player.attacking - dt);
    updateHUD(); updateMinimap(); draw(); requestAnimationFrame(update);
  }

  function save() {
    try { localStorage.setItem('argentum-save', JSON.stringify({ player, questKills: state.questKills, questDone: state.questDone })); } catch (_) { /* storage may be disabled */ }
  }
  try {
    const saved = JSON.parse(localStorage.getItem('argentum-save') || 'null');
    if (saved) { Object.assign(player, saved.player || {}); state.questKills = saved.questKills || 0; state.questDone = !!saved.questDone; }
  } catch (_) { /* start a fresh adventure */ }

  $('enterBtn').addEventListener('click', () => { state.started = true; state.last = performance.now(); $('startScreen').classList.add('dismissed'); notify('Bienvenido al Bosque de Ullathorpe'); });
  $('helpBtn').addEventListener('click', showHelp); $('inventoryBtn').addEventListener('click', showInventory); $('modalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  $('potionBtn').addEventListener('click', () => usePotion('hp')); $('manaBtn').addEventListener('click', () => usePotion('mp'));
  $('mapBtn').addEventListener('click', () => $('mapOverlay').classList.toggle('show')); $('closeMap').addEventListener('click', () => $('mapOverlay').classList.remove('show'));
  $('questFocus').addEventListener('click', () => { state.moveTarget = { x: npc.x, y: npc.y + 35 }; notify('Don Eusebio está junto a la aldea.'); });
  $('clearLog').addEventListener('click', () => $('chatLog').replaceChildren());
  $('chatForm').addEventListener('submit', e => { e.preventDefault(); const input = $('chatInput'), text = input.value.trim(); if (!text) return; addLog(`Vos: ${text}`); input.value = ''; });
  $('resetBtn').addEventListener('click', () => { if (confirm('¿Reiniciar la aventura? Se borrará tu progreso guardado.')) { localStorage.removeItem('argentum-save'); location.reload(); } });
  $('zoomIn').addEventListener('click', () => { state.zoom = Math.min(1.45, state.zoom + .1); document.querySelector('.zoom-controls span').textContent = `${Math.round(state.zoom * 100)}%`; });
  $('zoomOut').addEventListener('click', () => { state.zoom = Math.max(.75, state.zoom - .1); document.querySelector('.zoom-controls span').textContent = `${Math.round(state.zoom * 100)}%`; });
  $('soundBtn').addEventListener('click', e => { state.sound = !state.sound; e.currentTarget.textContent = state.sound ? '♫' : '♪'; e.currentTarget.title = state.sound ? 'Sonido activado' : 'Sonido desactivado'; notify(state.sound ? 'Sonido activado' : 'Sonido desactivado'); });
  $('miniMap').addEventListener('click', () => $('mapOverlay').classList.add('show'));
  $('nearbyList').addEventListener('click', e => { const row = e.target.closest('[data-target]'); if (!row) return; state.selected = Number(row.dataset.target); const slime = state.slimes.find(s => s.id === state.selected); if (slime) { state.moveTarget = { x: slime.x - 38, y: slime.y }; notify('Objetivo seleccionado · limo verde'); } });
  canvas.addEventListener('click', e => {
    const p = worldPoint(e);
    const slime = state.slimes.filter(s => s.alive && Math.hypot(s.x - p.x, s.y - p.y) < 32).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
    if (slime) { state.selected = slime.id; $('targetToast').innerHTML = '◉ <span>Limo verde · Nivel 1</span>'; $('targetToast').classList.add('show'); setTimeout(() => $('targetToast').classList.remove('show'), 1800); state.moveTarget = { x: slime.x - 37, y: slime.y }; return; }
    if (Math.hypot(npc.x - p.x, npc.y - p.y) < 40) { state.moveTarget = { x: npc.x, y: npc.y + 32 }; return; }
    state.selected = null; state.moveTarget = { x: clamp(p.x, 20, WORLD.w - 20), y: clamp(p.y, 20, WORLD.h - 20) };
  });
  canvas.addEventListener('contextmenu', e => { e.preventDefault(); attack(); });
  window.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    const key = e.key.toLowerCase();
    if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) e.preventDefault();
    if (key === 'escape') { if (backdrop.classList.contains('show')) closeModal(); else $('mapOverlay').classList.remove('show'); return; }
    if (key === 'e') { talk(); return; } if (key === ' ') { attack(); return; } if (key === 'h') { usePotion('hp'); return; } if (key === 'j') { usePotion('mp'); return; } if (key === 'i') { showInventory(); return; }
    keys.add(key);
  });
  window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase())); window.addEventListener('blur', () => keys.clear());
  window.addEventListener('beforeunload', save); setInterval(save, 5000); window.addEventListener('resize', draw);
  updateHUD(); updateMinimap(); draw(); requestAnimationFrame(update);
})();
