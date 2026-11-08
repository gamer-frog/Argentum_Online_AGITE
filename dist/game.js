(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const frame = document.getElementById('gameFrame');
  const $ = id => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  // Resuelve assets/ao/ relativo a la ubicación de este script: funciona servido
  // desde la raíz, desde /dist/ o si el despliegue copia dist/ a la raíz.
  const MAP_CANDIDATES = [];
  try {
    if (document.currentScript && document.currentScript.src) {
      const base = new URL('.', document.currentScript.src).href;
      for (const candidate of [`${base}assets/ao/`, `${base}../assets/ao/`]) {
        if (!MAP_CANDIDATES.includes(candidate)) MAP_CANDIDATES.push(candidate);
      }
    }
  } catch { /* sin currentScript; queda el candidato relativo. */ }
  if (!MAP_CANDIDATES.includes('assets/ao/')) MAP_CANDIDATES.push('assets/ao/');
  let MAP_URL = MAP_CANDIDATES[0];
  const ACTORS = [
    { id: 'player', name: 'Viajero del Sur', team: 'sacred', className: 'warrior', x: 43, y: 46 },
    { id: 'sacredMage', name: 'Mago Sagrado', team: 'sacred', className: 'mage', x: 43, y: 43 },
    { id: 'sacredCleric', name: 'Clérigo Sagrado', team: 'sacred', className: 'cleric', x: 43, y: 49 },
    { id: 'sacredPaladin', name: 'Paladín Sagrado', team: 'sacred', className: 'paladin', x: 46, y: 46 },
    { id: 'chaoticWarrior', name: 'Guerrero Caótico', team: 'chaotic', className: 'warrior', x: 57, y: 46 },
    { id: 'chaoticMage', name: 'Mago Caótico', team: 'chaotic', className: 'mage', x: 57, y: 43 },
    { id: 'chaoticCleric', name: 'Clérigo Caótico', team: 'chaotic', className: 'cleric', x: 57, y: 49 },
    { id: 'chaoticPaladin', name: 'Paladín Caótico', team: 'chaotic', className: 'paladin', x: 54, y: 46 }
  ];
  const HEADINGS = { N: 1, E: 2, S: 3, W: 4 };
  const DELTAS = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const PLAYER_DIRECTIONS = {
    arrowup: [0, -1], w: [0, -1],
    arrowright: [1, 0], d: [1, 0],
    arrowdown: [0, 1], s: [0, 1],
    arrowleft: [-1, 0], a: [-1, 0]
  };
  const names = Object.fromEntries(ACTORS.map(actor => [actor.id, actor.name]));
  const CLASS_PROFILES = {
    warrior: { label: 'GUERRERO', body: 1, head: 1, hp: 130, mana: 70, skills: [
      { name: 'Golpe poderoso', icon: '⚔', type: 'damage', cost: 14, damage: [25, 34], range: 1 },
      { name: 'Vendaje', icon: '✚', type: 'heal', cost: 18, heal: 32, cleanse: true },
      { name: 'Carga', icon: '➤', type: 'damage', cost: 24, damage: [35, 44], range: 2 }
    ] },
    mage: { label: 'MAGO', body: 2, head: 2, hp: 90, mana: 130, skills: [
      { name: 'Bola de fuego', icon: '✹', type: 'damage', cost: 22, damage: [27, 38], range: 7 },
      { name: 'Curar', icon: '✚', type: 'heal', cost: 24, heal: 36, cleanse: true },
      { name: 'Rayo', icon: 'ϟ', type: 'damage', cost: 32, damage: [39, 51], range: 8, immobilize: 1.8 }
    ] },
    cleric: { label: 'CLÉRIGO', body: 2, head: 4, hp: 105, mana: 145, skills: [
      { name: 'Luz sagrada', icon: '✹', type: 'damage', cost: 22, damage: [24, 34], range: 6 },
      { name: 'Sanar', icon: '✚', type: 'heal', cost: 18, heal: 40, cleanse: true },
      { name: 'Destello', icon: '✧', type: 'damage', cost: 30, damage: [34, 46], range: 7 }
    ] },
    paladin: { label: 'PALADÍN', body: 1, head: 3, hp: 145, mana: 90, skills: [
      { name: 'Golpe sagrado', icon: '⚔', type: 'damage', cost: 16, damage: [26, 36], range: 1 },
      { name: 'Plegaria', icon: '✚', type: 'heal', cost: 20, heal: 34 },
      { name: 'Carga de luz', icon: '➤', type: 'damage', cost: 25, damage: [34, 44], range: 2 }
    ] }
  };
  const STEP_DURATION = .115;
  const NPC_AIM_DURATION = .58;
  const NPC_MELEE_ACCURACY = .78;
  const images = new Map();
  let mapData, grhs, characters;
  let fallbackWorld = false;
  let W = 800, H = 480, dpr = 1, tilePx = 32;
  let elapsed = 0, paused = false;
  let selected = 'chaoticWarrior', selectedSkill = null, currentClass = 'warrior';
  const floatingTexts = [], spellEffects = [];
  let audioOn = true, audioReady = false, audioCtx;
  const keys = new Set();
  let joystickKey = null;
  const fighters = ACTORS.map((actor, index) => {
    const profile = CLASS_PROFILES[actor.className];
    return {
      ...actor, body: profile.body, head: profile.head, homeX: actor.x, homeY: actor.y,
      hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana,
      alive: true,
      heading: index === 1 ? 'W' : 'S', step: null, stepTime: 0, aiTimer: rand(.2, 1),
      attackCd: rand(.2, .8), flash: 0, respawn: 0, bodyFrameTime: Math.random() * 2, aim: null,
      skillCooldowns: [0, 0, 0], immobilized: 0
    };
  });
  const player = fighters[0];
  const byId = Object.fromEntries(fighters.map(actor => [actor.id, actor]));
  let lastToast = 0;

  function loadImage(id) {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        // AO's legacy indexed-color sheets use palette entry 0 (pure black) as transparency.
        // PNG palette exports lost that color key, so restore alpha before drawing them.
        const normalized = document.createElement('canvas');
        normalized.width = image.naturalWidth; normalized.height = image.naturalHeight;
        const sheet = normalized.getContext('2d', { willReadFrequently: true });
        sheet.drawImage(image, 0, 0);
        const pixels = sheet.getImageData(0, 0, normalized.width, normalized.height);
        for (let i = 0; i < pixels.data.length; i += 4) {
          if (pixels.data[i] === 0 && pixels.data[i + 1] === 0 && pixels.data[i + 2] === 0) pixels.data[i + 3] = 0;
        }
        sheet.putImageData(pixels, 0, 0);
        resolve([id, normalized]);
      };
      image.onerror = () => {
        console.warn(`No se pudo cargar assets/ao/graphics/${id}.png; se dibujará el mapa sin esa lámina.`);
        resolve([id, null]);
      };
      image.src = `${MAP_URL}graphics/${id}.png`;
    });
  }
  async function loadData(base) {
    return Promise.all(['map.json', 'grhs.json', 'characters.json'].map(name => fetch(base + name).then(response => {
      if (!response.ok) throw new Error(`Could not load ${name} from ${base}: ${response.status}`);
      return response.json();
    })));
  }
  async function loadAssets() {
    try {
      for (let index = 0; index < MAP_CANDIDATES.length; index++) {
        try {
          [mapData, grhs, characters] = await loadData(MAP_CANDIDATES[index]);
          MAP_URL = MAP_CANDIDATES[index];
          break;
        } catch (error) {
          if (index === MAP_CANDIDATES.length - 1) throw error;
        }
      }
      const ids = [...new Set(Object.values(grhs).flatMap(def => def.image ? [def.image] : []))];
      const loaded = await Promise.all(ids.map(loadImage));
      for (const [id, image] of loaded) if (image) images.set(id, image);
      const missing = ids.length - images.size;
      if (missing) toast(`${missing} láminas de mapa no cargaron; el resto del mundo sigue disponible.`);
      fighters.forEach(actor => { [actor.x, actor.y] = findOpen(actor.x, actor.y, actor); actor.homeX = actor.x; actor.homeY = actor.y; });
      refreshHud();
    } catch (error) {
      console.warn('No se pudieron cargar los recursos de AO; se inicia una arena de práctica local.', error);
      fallbackWorld = true;
      mapData = {
        width: 100,
        height: 100,
        tiles: Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => ({ b: false, g: [0, 0, 0, 0] })))
      };
      grhs = {};
      characters = { bodies: {}, heads: {} };
      toast('Faltan assets/ao/: arena de práctica visual alternativa.');
      refreshHud();
    }
  }
  function resize() {
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    W = rect.width; H = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tilePx = clamp(Math.min(W / 25, H / 16), 24, 40);
  }
  new ResizeObserver(resize).observe(frame);
  window.addEventListener('resize', resize);
  resize();

  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(lastToast); lastToast = setTimeout(() => el.classList.remove('show'), 1800);
  }
  function tone(freq = 220, duration = .08) {
    if (!audioOn || !audioReady) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.frequency.value = freq; gain.gain.setValueAtTime(.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
      osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch (_) { /* Audio is optional. */ }
  }
  function findOpen(x, y) {
    if (!mapData) return [x, y];
    for (let radius = 0; radius < 10; radius++) {
      for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
        const tx = x + dx, ty = y + dy;
        if (isOpen(tx, ty) && !fighters.some(f => f.x === tx && f.y === ty)) return [tx, ty];
      }
    }
    return [x, y];
  }
  function isOpen(x, y) { return x >= 0 && y >= 0 && x < mapData.width && y < mapData.height && !mapData.tiles[y][x].b; }
  function pos(actor) { return actor.step ? actor.step.from : [actor.x, actor.y]; }
  function actorTile(actor) { return actor.step ? actor.step.to : [actor.x, actor.y]; }
  function distance(a, b) { const [ax, ay] = actorTile(a), [bx, by] = actorTile(b); return Math.abs(ax - bx) + Math.abs(ay - by); }
  function occupied(x, y, except) { return fighters.some(actor => actor !== except && actor.alive && actorTile(actor)[0] === x && actorTile(actor)[1] === y); }
  function startStep(actor, dx, dy) {
    if (!actor.alive || actor.immobilized > 0 || actor.step || (!dx && !dy)) return false;
    if (dx && dy) { if (Math.abs(dx) >= Math.abs(dy)) dy = 0; else dx = 0; }
    dx = Math.sign(dx); dy = Math.sign(dy);
    const [x, y] = actorTile(actor), nx = x + dx, ny = y + dy;
    if (!isOpen(nx, ny) || occupied(nx, ny, actor)) return false;
    actor.heading = dx < 0 ? 'W' : dx > 0 ? 'E' : dy < 0 ? 'N' : 'S';
    actor.step = { from: [x, y], to: [nx, ny] }; actor.stepTime = 0;
    return true;
  }
  function position(actor) {
    if (!actor.step) return [actor.x, actor.y];
    const t = clamp(actor.stepTime / STEP_DURATION, 0, 1), [x0, y0] = actor.step.from, [x1, y1] = actor.step.to;
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
  }
  function isEnemy(a, b) { return Boolean(a && b && a.team !== b.team); }
  function tacticalEnemy(actor) {
    const candidates = fighters.filter(other => isEnemy(actor, other) && other.alive);
    return candidates.sort((a, b) => enemyScore(actor, a) - enemyScore(actor, b))[0] || null;
  }
  function enemyScore(actor, target) {
    const alliesCommitted = fighters.filter(ally => ally !== actor && ally.alive && ally.team === actor.team && (ally.aim?.targetId === target.id || ally.aiTargetId === target.id)).length;
    return distance(actor, target) * 1.6 + target.hp / target.maxHp * 5 - alliesCommitted * 2.5;
  }
  function tacticalAlly(actor) {
    return fighters.filter(other => other.alive && other.team === actor.team)
      .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0] || actor;
  }
  function nextPathStep(actor, target) {
    const [sx, sy] = actorTile(actor), [tx, ty] = actorTile(target);
    const queue = [[sx, sy]], first = new Map([[`${sx},${sy}`, null]]);
    const directions = [[0, -1, 'N'], [1, 0, 'E'], [0, 1, 'S'], [-1, 0, 'W']];
    while (queue.length) {
      const [x, y] = queue.shift();
      if (Math.abs(x - tx) + Math.abs(y - ty) <= 1) {
        const key = `${x},${y}`, parent = first.get(key);
        if (!parent) return null;
        let step = key;
        while (first.get(step) !== `${sx},${sy}`) step = first.get(step);
        const [nx, ny] = step.split(',').map(Number);
        return [nx - sx, ny - sy];
      }
      for (const [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
        if (first.has(key) || !isOpen(nx, ny) || occupied(nx, ny, actor)) continue;
        first.set(key, `${x},${y}`); queue.push([nx, ny]);
      }
    }
    return null;
  }
  function attack(actor = player, targetOverride = null) {
    if (paused || !actor.alive || actor.attackCd > 0) return false;
    const target = targetOverride || byId[selected];
    if (!target || !target.alive || target === actor || !isEnemy(actor, target)) { toast('Elegí un rival de la legión contraria.'); return false; }
    const d = distance(actor, target);
    if (d > 1) { toast('Acercate al objetivo para atacar.'); return false; }
    actor.heading = actorTile(target)[0] < actorTile(actor)[0] ? 'W' : actorTile(target)[0] > actorTile(actor)[0] ? 'E' : actorTile(target)[1] < actorTile(actor)[1] ? 'N' : 'S';
    actor.attackCd = actor === player ? .62 : rand(.7, 1.05);
    actor.flash = .1;
    const damage = Math.ceil(rand(11, 18)); target.hp = Math.max(0, target.hp - damage); target.flash = .22;
    addFloatingText(target, `-${damage}`, 'damage');
    tone(155 + Math.random() * 50, .07);
    if (target.hp <= 0) kill(target, actor);
    refreshHud(); return true;
  }
  function addFloatingText(actor, text, kind) {
    const [x, y] = position(actor);
    floatingTexts.push({ x, y, text, kind, age: 0 });
  }
  function addFloatingTextAt(x, y, text, kind) {
    floatingTexts.push({ x, y, text, kind, age: 0 });
  }
  function beginNpcAim(actor, target) {
    const [x, y] = actorTile(target), [fromX, fromY] = actorTile(actor);
    actor.heading = x < fromX ? 'W' : x > fromX ? 'E' : y < fromY ? 'N' : 'S';
    actor.aim = { targetId: target.id, x, y, fromX, fromY, cursorX: x, cursorY: y, phase: Math.random() * Math.PI * 2, remaining: NPC_AIM_DURATION };
    actor.attackCd = rand(.85, 1.15);
  }
  function resolveNpcAim(actor) {
    const aim = actor.aim;
    actor.aim = null;
    if (!aim) return;
    const target = byId[aim.targetId];
    if (!actor.alive || !target?.alive) return;
    const [x, y] = actorTile(target);
    if (x !== aim.x || y !== aim.y) {
      addFloatingTextAt(aim.x, aim.y, 'ESQUIVADO', 'miss');
      return;
    }
    if (Math.random() > NPC_MELEE_ACCURACY) {
      addFloatingTextAt(aim.x, aim.y, 'FALLÓ', 'miss');
      return;
    }
    actor.flash = .1;
    const damage = Math.ceil(rand(11, 18)); target.hp = Math.max(0, target.hp - damage); target.flash = .22;
    addFloatingText(target, `-${damage}`, 'damage');
    tone(155 + Math.random() * 50, .07);
    if (target.hp <= 0) kill(target, actor);
    refreshHud();
  }
  function updateNpcAims(dt) {
    for (const actor of fighters.slice(1)) {
      if (!actor.aim) continue;
      actor.aim.remaining -= dt;
      const target = byId[actor.aim.targetId];
      if (target?.alive) {
        const [tx, ty] = actorTile(target), progress = clamp(1 - actor.aim.remaining / NPC_AIM_DURATION, 0, 1);
        actor.aim.cursorX = tx + Math.sin(elapsed * 15 + actor.aim.phase) * (1 - progress) * .18;
        actor.aim.cursorY = ty + Math.cos(elapsed * 13 + actor.aim.phase) * (1 - progress) * .18;
      }
      if (actor.aim.remaining <= 0) resolveNpcAim(actor);
    }
  }
  function npcCastSkill(actor, skill, index, target) {
    if (actor.mana < skill.cost || actor.skillCooldowns[index] > 0) return false;
    actor.mana -= skill.cost;
    actor.skillCooldowns[index] = skill.type === 'heal' ? 5 : 2.8 + index * .7;
    actor.attackCd = Math.max(actor.attackCd, .55);
    const [sx, sy] = position(actor), [tx, ty] = position(target);
    if (skill.type === 'heal') {
      const restored = Math.min(skill.heal, target.maxHp - target.hp);
      if (restored > 0) {
        target.hp += restored; target.flash = .2;
        addFloatingText(target, `+${restored}`, 'heal');
      }
      if (skill.cleanse && target.immobilized > 0) {
        target.immobilized = 0;
        addFloatingText(target, 'LIBRE', 'heal');
      }
      spellEffects.push({ x: sx, y: sy, tx, ty, age: 0, duration: .65, kind: 'heal' });
    } else {
      const damage = Math.ceil(rand(skill.damage[0], skill.damage[1]));
      target.hp = Math.max(0, target.hp - damage); target.flash = .28;
      addFloatingText(target, `-${damage}`, 'damage');
      spellEffects.push({ x: sx, y: sy, tx, ty, age: 0, duration: .42, kind: actor.className });
      if (skill.immobilize) {
        target.immobilized = Math.max(target.immobilized, skill.immobilize);
        target.step = null; target.stepTime = 0;
        addFloatingText(target, 'INMOVILIZADO', 'miss');
      }
      if (target.hp <= 0) kill(target, actor);
    }
    tone(actor.className === 'mage' ? 620 : 340, .13);
    return true;
  }
  function selectSkill(index) {
    if (paused || !player.alive) return;
    const skill = CLASS_PROFILES[currentClass].skills[index];
    if (!skill) return;
    selectedSkill = selectedSkill === index ? null : index;
    refreshSkillSelection();
    toast(selectedSkill === null ? 'Selección de hechizo cancelada.' : `${skill.name} seleccionado · ${skill.type === 'heal' ? 'hacé clic en tu personaje para curarte.' : 'elegí un rival en el campo.'}`);
  }
  function refreshSkillSelection() {
    document.querySelectorAll('.spell-slot').forEach((button, slot) => {
      button.classList.toggle('active-spell', slot === selectedSkill);
      button.setAttribute('aria-pressed', String(slot === selectedSkill));
    });
    const skill = selectedSkill === null ? null : CLASS_PROFILES[currentClass].skills[selectedSkill];
    $('spellHint').textContent = skill ? `${skill.name} listo · ${skill.type === 'heal' ? 'hacé clic en tu personaje' : 'hacé clic en un rival'}` : 'Elegí un hechizo y hacé clic en un rival';
  }
  function castSkill(index, targetOverride = null) {
    if (paused || !player.alive) return;
    const skill = CLASS_PROFILES[currentClass].skills[index], target = targetOverride || byId[selected];
    if (!skill || !target || !target.alive || (skill.type === 'heal' ? target !== player : target === player || !isEnemy(player, target))) {
      toast(skill?.type === 'heal' ? 'Hacé clic en tu personaje para curarte.' : 'Elegí un rival como objetivo.'); return;
    }
    if (player.skillCooldowns[index] > 0) { toast('Esa habilidad todavía se está recuperando.'); return; }
    if (player.mana < skill.cost) { toast('No tenés maná suficiente.'); return; }
    if (skill.type === 'damage' && distance(player, target) > skill.range) { toast(`Acercate; alcance máximo: ${skill.range} casilleros.`); return; }
    player.mana -= skill.cost;
    player.skillCooldowns[index] = skill.type === 'heal' ? 5 : 2.8 + index * .7;
    const [px, py] = position(player), [tx, ty] = position(target);
    if (skill.type === 'heal') {
      const restored = Math.min(skill.heal, player.maxHp - player.hp);
      if (!restored && !(skill.cleanse && player.immobilized > 0)) { player.mana += skill.cost; player.skillCooldowns[index] = 0; toast('Ya tenés toda la vida.'); return; }
      if (restored > 0) {
        player.hp += restored; player.flash = .2; addFloatingText(player, `+${restored}`, 'heal');
      }
      if (skill.cleanse && player.immobilized > 0) {
        player.immobilized = 0;
        addFloatingText(player, 'LIBRE', 'heal');
      }
      spellEffects.push({ x: px, y: py, tx: px, ty: py, age: 0, duration: .65, kind: 'heal' });
      toast(`${skill.name}: ${restored ? `recuperaste ${restored} de vida` : 'eliminaste la inmovilización'}.`); tone(520, .15);
    } else {
      const damage = Math.ceil(rand(skill.damage[0], skill.damage[1]));
      target.hp = Math.max(0, target.hp - damage); target.flash = .28;
      addFloatingText(target, `-${damage}`, 'damage');
      spellEffects.push({ x: px, y: py, tx, ty, age: 0, duration: .42, kind: currentClass });
      if (skill.immobilize) {
        target.immobilized = Math.max(target.immobilized, skill.immobilize);
        target.step = null; target.stepTime = 0;
        addFloatingText(target, 'INMOVILIZADO', 'miss');
      }
      toast(`${skill.name} · ${damage} de daño a ${target.name}.${skill.immobilize ? ' Inmovilizado.' : ''}`); tone(currentClass === 'mage' ? 620 : 340, .13);
      if (target.hp <= 0) kill(target, player);
    }
    selectedSkill = null; refreshSkillSelection();
    refreshHud();
  }
  function applyClass(className) {
    currentClass = className in CLASS_PROFILES ? className : 'warrior';
    const profile = CLASS_PROFILES[currentClass];
    player.body = profile.body; player.head = profile.head;
    player.maxHp = profile.hp; player.hp = profile.hp;
    player.maxMana = profile.mana; player.mana = profile.mana;
    player.skillCooldowns = [0, 0, 0]; selectedSkill = null;
    $('heroClass').textContent = profile.label;
    renderSkills(); refreshSkillSelection(); refreshHud();
    toast(`Clase ${profile.label.toLowerCase()} seleccionada.`);
  }
  function renderSkills() {
    CLASS_PROFILES[currentClass].skills.forEach((skill, index) => {
      const button = document.querySelector(`[data-skill="${index}"]`);
      button.querySelector('.spell-icon').textContent = skill.icon;
      button.querySelector('.spell-name').textContent = skill.name;
      button.querySelector('.spell-cost').textContent = `${skill.cost} maná`;
      button.title = `${skill.name} · ${skill.cost} maná · ${skill.type === 'heal' ? 'Restaura vida' : `Alcance ${skill.range}`}`;
    });
  }
  function kill(victim, attacker) {
    victim.alive = false; victim.respawn = 2.4; victim.step = null; victim.aim = null; victim.immobilized = 0;
    if (victim === player) updateRespawnNotice();
    for (const actor of fighters) if (actor.aim?.targetId === victim.id) actor.aim = null;
    const feed = $('killFeed'), line = document.createElement('div'); line.className = 'feed-line';
    line.innerHTML = `<span class="feed-gold">✦</span> <b>${attacker === player ? 'Vos' : names[attacker.id]}</b><span> derrotó a </span><b>${victim === player ? 'vos' : names[victim.id]}</b>`;
    feed.prepend(line); while (feed.children.length > 3) feed.lastElementChild.remove();
    const log = $('battleLog'), entry = document.createElement('div'); entry.className = 'log-entry';
    entry.innerHTML = `${attacker === player ? '<b>Derrotaste</b>' : `<b>${names[attacker.id]}</b> derrotó a`} ${victim === player ? 'tu personaje' : names[victim.id]}.`;
    const empty = log.querySelector('.empty-log'); if (empty) empty.remove(); log.prepend(entry); while (log.children.length > 5) log.lastElementChild.remove();
    toast(victim === player ? 'Has caído. Regresarás al campo en un instante.' : attacker === player ? `Derrotaste a ${names[victim.id]}.` : `${names[victim.id]} cayó en combate.`);
    tone(victim === player ? 110 : 380, .17);
    refreshHud();
  }
  function respawn(actor) {
    const [x, y] = findOpen(actor.homeX, actor.homeY), profile = CLASS_PROFILES[actor.className];
    Object.assign(actor, { x, y, hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana, alive: true, step: null, respawn: 0, flash: .6, attackCd: .7, aim: null, immobilized: 0, aiTargetId: null, skillCooldowns: [0, 0, 0] });
    if (actor === player) updateRespawnNotice();
  }
  function updateRespawnNotice() {
    const notice = $('respawnNotice');
    if (!notice) return;
    const show = !player.alive;
    notice.classList.toggle('hidden', !show);
    if (show) $('respawnTimer').textContent = Math.max(0, player.respawn).toFixed(1);
  }
  function selectTarget(actor) {
    if (!actor || actor === player || !actor.alive || !isEnemy(player, actor)) { toast('Seleccioná un rival de la legión contraria.'); return; }
    selected = actor.id; refreshHud();
    const skill = selectedSkill === null ? null : CLASS_PROFILES[currentClass].skills[selectedSkill];
    toast(skill?.type === 'heal' ? `${actor.name} seleccionado · hacé clic en tu personaje para curarte.` : selectedSkill === null ? `${actor.name} seleccionado · acercate y atacá con F.` : `${actor.name} seleccionado · ${skill.name} listo para lanzar desde el campo.`);
  }
  function cycleEnemyTarget() {
    const enemies = fighters.filter(actor => actor.alive && isEnemy(player, actor));
    if (!enemies.length) return;
    const currentIndex = enemies.findIndex(actor => actor.id === selected);
    selectTarget(enemies[(currentIndex + 1) % enemies.length]);
  }
  function toggleScoreboard(force) {
    const panel = $('sidePanel'), button = $('scoreboardToggle');
    const open = typeof force === 'boolean' ? force : panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !open);
    $('arenaLayout').classList.toggle('scoreboard-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', `${open ? 'Ocultar' : 'Mostrar'} combatientes`);
  }
  function handleCanvasTarget(target) {
    if (!target) return;
    if (selectedSkill === null) {
      selectTarget(target);
      return;
    }
    selected = target.id;
    castSkill(selectedSkill, target);
  }
  function clearJoystick() {
    if (joystickKey) keys.delete(joystickKey);
    joystickKey = null;
    const knob = $('joyKnob');
    if (knob) knob.style.transform = '';
  }
  function updateJoystick(event) {
    const joy = $('joystick'), knob = $('joyKnob');
    if (!joy || !knob) return;
    const rect = joy.getBoundingClientRect(), dx = event.clientX - (rect.left + rect.width / 2), dy = event.clientY - (rect.top + rect.height / 2);
    const length = Math.hypot(dx, dy), radius = rect.width * .32, scale = length > radius ? radius / length : 1;
    knob.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    if (joystickKey) keys.delete(joystickKey);
    joystickKey = length < 12 ? null : Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'arrowleft' : 'arrowright') : (dy < 0 ? 'arrowup' : 'arrowdown');
    if (joystickKey) keys.add(joystickKey);
  }
  function updatePlayer() {
    if (player.step) return;
    // Use only the most recently pressed direction: holding two keys never creates a diagonal.
    const key = [...keys].reverse().find(pressed => PLAYER_DIRECTIONS[pressed]);
    if (key) startStep(player, ...PLAYER_DIRECTIONS[key]);
  }
  function updateBots(dt) {
    for (const actor of fighters.slice(1)) {
      if (!actor.alive || actor.step || actor.immobilized > 0) continue;
      actor.aiTimer -= dt;
      if (actor.aiTimer > 0 || actor.aim) continue;
      actor.aiTimer = .2 + Math.random() * .08;

      const allies = fighters.filter(other => other.alive && other.team === actor.team);
      const wounded = allies.filter(other => other.hp / other.maxHp < .68 || other.immobilized > 0)
        .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
      const healingIndex = CLASS_PROFILES[actor.className].skills.findIndex(skill => skill.type === 'heal' && actor.mana >= skill.cost && actor.skillCooldowns[CLASS_PROFILES[actor.className].skills.indexOf(skill)] <= 0);
      if (wounded && healingIndex >= 0) {
        const heal = CLASS_PROFILES[actor.className].skills[healingIndex];
        if ((wounded.hp < wounded.maxHp && wounded.hp / wounded.maxHp < .68) || (heal.cleanse && wounded.immobilized > 0)) {
          if (npcCastSkill(actor, heal, healingIndex, wounded)) continue;
        }
      }

      const target = tacticalEnemy(actor);
      if (!target) continue;
      actor.aiTargetId = target.id;
      const profile = CLASS_PROFILES[actor.className];
      const range = distance(actor, target);
      const attackSkills = profile.skills.map((skill, index) => ({ skill, index }))
        .filter(({ skill, index }) => skill.type === 'damage' && range <= skill.range && actor.mana >= skill.cost && actor.skillCooldowns[index] <= 0)
        .sort((a, b) => (b.skill.damage[0] + b.skill.damage[1]) - (a.skill.damage[0] + a.skill.damage[1]));
      if (attackSkills.length && npcCastSkill(actor, attackSkills[0].skill, attackSkills[0].index, target)) continue;
      if (range <= 1) {
        if (actor.attackCd <= 0) beginNpcAim(actor, target);
      } else {
        const step = nextPathStep(actor, target);
        if (step) startStep(actor, step[0], step[1]);
      }
    }
  }
  function update(dt) {
    if (!mapData || paused) return;
    elapsed += dt;
    for (const actor of fighters) {
      if (actor.attackCd > 0) actor.attackCd -= dt;
      if (actor.flash > 0) actor.flash -= dt;
      if (actor.immobilized > 0) actor.immobilized = Math.max(0, actor.immobilized - dt);
      if (actor.alive) actor.mana = Math.min(actor.maxMana, actor.mana + dt * .8);
      actor.skillCooldowns = actor.skillCooldowns.map(value => Math.max(0, value - dt));
      if (actor.step) {
        actor.stepTime += dt;
        if (actor.stepTime >= STEP_DURATION) { [actor.x, actor.y] = actor.step.to; actor.step = null; actor.stepTime = 0; }
      }
      if (!actor.alive) { actor.respawn -= dt; if (actor.respawn <= 0) respawn(actor); }
    }
    updateRespawnNotice();
    for (const text of floatingTexts) text.age += dt;
    for (const effect of spellEffects) effect.age += dt;
    while (floatingTexts.length && floatingTexts[0].age > 1.05) floatingTexts.shift();
    while (spellEffects.length && spellEffects[0].age > spellEffects[0].duration) spellEffects.shift();
    updatePlayer(); updateNpcAims(dt); updateBots(dt);
    refreshHud();
  }

  function resolveGrh(id, now, animate = true) {
    let def = grhs[String(id)];
    if (!def) return null;
    if (def.frames) {
      const index = animate ? Math.floor(now / Math.max(1, def.speed)) % def.frames.length : 0;
      def = grhs[String(def.frames[index])];
    }
    if (!def || !def.image) return null;
    return { image: images.get(def.image), def };
  }
  function screenTile(x, y, cameraX, cameraY) {
    return [W / 2 + (x - cameraX) * tilePx - tilePx / 2, H / 2 + (y - cameraY) * tilePx - tilePx / 2];
  }
  function drawGrh(id, x, y, now, animate = true) {
    const frameData = resolveGrh(id, now, animate);
    if (!frameData || !frameData.image) return;
    const { image, def } = frameData, width = def.w * tilePx / 32, height = def.h * tilePx / 32;
    ctx.drawImage(image, def.x, def.y, def.w, def.h, x + (tilePx - width) / 2, y + tilePx - height, width, height);
  }
  function visibleRange(cameraX, cameraY) {
    return {
      minX: Math.max(0, Math.floor(cameraX - W / tilePx / 2) - 2),
      maxX: Math.min(mapData.width - 1, Math.ceil(cameraX + W / tilePx / 2) + 2),
      minY: Math.max(0, Math.floor(cameraY - H / tilePx / 2) - 3),
      maxY: Math.min(mapData.height - 1, Math.ceil(cameraY + H / tilePx / 2) + 2)
    };
  }
  function drawGround(range, now, cameraX, cameraY) {
    for (let y = range.minY; y <= range.maxY; y++) for (let x = range.minX; x <= range.maxX; x++) {
      const [sx, sy] = screenTile(x, y, cameraX, cameraY), layers = mapData.tiles[y][x].g;
      if (fallbackWorld) {
        const variation = (x * 17 + y * 31 + x * y) % 5;
        ctx.fillStyle = ['#344b32', '#374e34', '#3a5036', '#344a31', '#3b5137'][variation];
        ctx.fillRect(sx, sy, tilePx + 1, tilePx + 1);
        ctx.strokeStyle = 'rgba(190,205,130,.055)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sx + tilePx * .2, sy + tilePx * .72); ctx.lineTo(sx + tilePx * .32, sy + tilePx * .48);
        ctx.moveTo(sx + tilePx * .72, sy + tilePx * .82); ctx.lineTo(sx + tilePx * .8, sy + tilePx * .65); ctx.stroke();
      } else {
        if (layers[0]) drawGrh(layers[0], sx, sy, now);
        if (layers[1]) drawGrh(layers[1], sx, sy, now);
      }
    }
  }
  function drawFallbackCharacter(actor, sx, sy) {
    const centerX = sx + tilePx / 2, baseY = sy + tilePx * .88;
    const sacred = actor.team === 'sacred';
    const robe = sacred ? '#5277a1' : '#9a4c46';
    const trim = sacred ? '#d9c17b' : '#d79b65';
    if (actor === byId[selected]) {
      ctx.fillStyle = 'rgba(230,194,115,.20)'; ctx.beginPath(); ctx.ellipse(centerX, baseY, tilePx * .38, tilePx * .13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(245,211,137,.8)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    ctx.save();
    ctx.fillStyle = 'rgba(10,14,10,.5)'; ctx.beginPath(); ctx.ellipse(centerX, baseY, tilePx * .24, tilePx * .09, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(centerX - tilePx * .22, baseY - tilePx * .47); ctx.lineTo(centerX + tilePx * .22, baseY - tilePx * .47); ctx.lineTo(centerX + tilePx * .3, baseY - tilePx * .04); ctx.lineTo(centerX - tilePx * .3, baseY - tilePx * .04); ctx.closePath(); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(centerX - tilePx * .21, baseY - tilePx * .11, tilePx * .42, tilePx * .045);
    ctx.fillStyle = '#d8b68c'; ctx.beginPath(); ctx.arc(centerX, baseY - tilePx * .59, tilePx * .15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = actor.className === 'mage' ? '#3d3158' : '#584334'; ctx.beginPath();
    ctx.moveTo(centerX - tilePx * .19, baseY - tilePx * .63); ctx.lineTo(centerX, baseY - tilePx * .9); ctx.lineTo(centerX + tilePx * .19, baseY - tilePx * .63); ctx.closePath(); ctx.fill();
    if (actor.className === 'warrior' || actor.className === 'paladin') {
      ctx.strokeStyle = '#ded6c2'; ctx.lineWidth = Math.max(1.5, tilePx * .055); ctx.beginPath();
      ctx.moveTo(centerX + tilePx * .24, baseY - tilePx * .36); ctx.lineTo(centerX + tilePx * .39, baseY - tilePx * .66); ctx.stroke();
    }
    const labelY = sy + tilePx + 12, label = actor === player ? 'Viajero del Sur' : actor.name;
    ctx.textAlign = 'center'; ctx.font = `600 ${Math.max(8, tilePx * .25)}px DM Sans, sans-serif`;
    ctx.fillStyle = actor === player ? '#f5dc9d' : '#f1ead3'; ctx.shadowColor = '#10130e'; ctx.shadowBlur = 4;
    ctx.fillText(label, centerX, labelY, tilePx * 2.8);
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72, 3);
    ctx.fillStyle = actor.hp > 35 ? '#8bb46c' : '#c96152'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72 * actor.hp / actor.maxHp, 3);
    if (actor.flash > 0) { ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,235,180,${actor.flash * 1.5})`; ctx.fillRect(sx, sy - tilePx, tilePx, tilePx * 2); }
    ctx.restore();
  }
  function drawCharacter(actor, now, cameraX, cameraY) {
    if (!actor.alive) return;
    const [x, y] = position(actor), [sx, sy] = screenTile(x, y, cameraX, cameraY);
    if (fallbackWorld) {
      drawFallbackCharacter(actor, sx, sy);
      return;
    }
    const body = characters.bodies[String(actor.body)], head = characters.heads[String(actor.head)];
    if (!body || !head) return;
    const facing = HEADINGS[actor.heading], bodyId = body[`Walk${facing}`], headId = head[`Head${facing}`];
    if (actor === byId[selected]) {
      ctx.fillStyle = 'rgba(230,194,115,.20)'; ctx.beginPath(); ctx.ellipse(sx + tilePx / 2, sy + tilePx * .88, tilePx * .34, tilePx * .12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(245,211,137,.72)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx + tilePx / 2, sy + tilePx * .88, tilePx * .36, tilePx * .13, 0, 0, Math.PI * 2); ctx.stroke();
    }
    drawGrh(bodyId, sx, sy, now, true);
    drawGrh(headId, sx + (body.HeadOffsetX || 0) * tilePx / 32, sy + (body.HeadOffsetY || 0) * tilePx / 32, now, false);
    const labelY = sy + tilePx + 12, label = actor === player ? 'Viajero del Sur' : actor.name;
    ctx.save(); ctx.textAlign = 'center'; ctx.font = `600 ${Math.max(8, tilePx * .25)}px DM Sans, sans-serif`;
    ctx.fillStyle = actor === player ? '#f5dc9d' : '#f1ead3'; ctx.shadowColor = '#10130e'; ctx.shadowBlur = 4;
    ctx.fillText(label, sx + tilePx / 2, labelY, tilePx * 2.8);
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72, 3);
    ctx.fillStyle = actor.hp > 35 ? '#8bb46c' : '#c96152'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72 * actor.hp / actor.maxHp, 3);
    if (actor.immobilized > 0) {
      ctx.textAlign = 'center'; ctx.font = `700 ${Math.max(12, tilePx * .38)}px sans-serif`;
      ctx.fillStyle = '#9be8f3'; ctx.shadowColor = '#36b8d5'; ctx.shadowBlur = 8;
      ctx.fillText(`❄ ${actor.immobilized.toFixed(1)}s`, sx + tilePx / 2, sy - 5);
      ctx.shadowBlur = 0;
    }
    if (actor.flash > 0) { ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,235,180,${actor.flash * 1.5})`; ctx.fillRect(sx, sy - tilePx, tilePx, tilePx * 2); }
    ctx.restore();
  }
  function drawWorldLayer(range, now, cameraX, cameraY) {
    const actorsAt = new Map();
    for (const actor of fighters) if (actor.alive) {
      const [x, y] = position(actor), key = `${Math.floor(y)},${Math.floor(x)}`;
      if (!actorsAt.has(key)) actorsAt.set(key, []); actorsAt.get(key).push(actor);
    }
    for (let y = range.minY; y <= range.maxY; y++) for (let x = range.minX; x <= range.maxX; x++) {
      const [sx, sy] = screenTile(x, y, cameraX, cameraY), layers = mapData.tiles[y][x].g;
      if (layers[2]) drawGrh(layers[2], sx, sy, now);
      for (const actor of actorsAt.get(`${y},${x}`) || []) drawCharacter(actor, now, cameraX, cameraY);
    }
    for (let y = range.minY; y <= range.maxY; y++) for (let x = range.minX; x <= range.maxX; x++) {
      const id = mapData.tiles[y][x].g[3];
      if (id) { const [sx, sy] = screenTile(x, y, cameraX, cameraY); drawGrh(id, sx, sy, now); }
    }
  }
  function drawCombatEffects(cameraX, cameraY, now) {
    const aimColors = ['#ff685b', '#64d8d0', '#e8b75f'];
    for (const [index, actor] of fighters.slice(1).entries()) {
      const aim = actor.aim;
      if (!aim) continue;
      const [fromX, fromY] = screenTile(aim.fromX, aim.fromY, cameraX, cameraY);
      const [sx, sy] = screenTile(aim.cursorX, aim.cursorY, cameraX, cameraY);
      const x = sx + tilePx / 2, y = sy + tilePx / 2;
      const color = aimColors[index % aimColors.length], pulse = .5 + Math.sin(now / 90 + aim.phase) * .16;
      ctx.save(); ctx.globalAlpha = .72 + pulse * .28;
      ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = Math.max(2, tilePx * .055); ctx.shadowColor = color; ctx.shadowBlur = tilePx * .3;
      ctx.beginPath(); ctx.moveTo(fromX + tilePx / 2, fromY + tilePx / 2); ctx.lineTo(x, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, tilePx * (.27 + pulse * .035), 0, Math.PI * 2); ctx.stroke();
      const arm = tilePx * .42, gap = tilePx * .17;
      ctx.beginPath();
      ctx.moveTo(x - arm, y); ctx.lineTo(x - gap, y); ctx.moveTo(x + gap, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + arm); ctx.stroke();
      ctx.shadowBlur = 4; ctx.textAlign = 'center'; ctx.font = `700 ${Math.max(9, tilePx * .27)}px DM Sans, sans-serif`;
      ctx.fillStyle = '#fff0d4'; ctx.fillText(`${actor.name.split(' ')[0]} · APUNTANDO`, x, sy - 4);
      ctx.restore();
    }
    for (const effect of spellEffects) {
      const progress = effect.age / effect.duration;
      const [x0, y0] = screenTile(effect.x, effect.y, cameraX, cameraY);
      const [x1, y1] = screenTile(effect.tx, effect.ty, cameraX, cameraY);
      const x = x0 + tilePx / 2 + (x1 - x0) * progress;
      const y = y0 + tilePx / 2 + (y1 - y0) * progress;
      ctx.save(); ctx.globalAlpha = 1 - progress;
      ctx.fillStyle = effect.kind === 'heal' ? '#9ee68b' : effect.kind === 'mage' ? '#ff9a54' : '#f4df9b';
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = tilePx * .55;
      ctx.beginPath(); ctx.arc(x, y, tilePx * (.1 + progress * .23), 0, Math.PI * 2); ctx.fill();
      if (effect.kind !== 'heal') {
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = Math.max(2, tilePx * .06);
        ctx.beginPath(); ctx.moveTo(x0 + tilePx / 2, y0 + tilePx / 2); ctx.lineTo(x, y); ctx.stroke();
      }
      ctx.restore();
    }
    for (const item of floatingTexts) {
      const [sx, sy] = screenTile(item.x, item.y, cameraX, cameraY), progress = item.age / 1.05;
      ctx.save(); ctx.globalAlpha = Math.min(1, (1 - progress) * 2.5);
      ctx.textAlign = 'center'; ctx.font = `800 ${Math.max(14, tilePx * .48)}px DM Sans, sans-serif`;
      ctx.fillStyle = item.kind === 'heal' ? '#9fe58e' : item.kind === 'miss' ? '#ffd27a' : '#ff8274'; ctx.shadowColor = '#11150f'; ctx.shadowBlur = 5;
      ctx.fillText(item.text, sx + tilePx / 2, sy - tilePx * .18 - progress * tilePx * .8);
      ctx.restore();
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!mapData) {
      ctx.fillStyle = '#182116'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#e5d5a5'; ctx.textAlign = 'center';
      ctx.font = '14px DM Sans'; ctx.fillText('Cargando el mundo de Argentum Online…', W / 2, H / 2); return;
    }
    const [cx, cy] = position(player), now = performance.now();
    const range = visibleRange(cx, cy);
    ctx.imageSmoothingEnabled = false;
    drawGround(range, now, cx, cy); drawWorldLayer(range, now, cx, cy); drawCombatEffects(cx, cy, now);
    if (fallbackWorld) {
      const message = 'ARENA DE PRÁCTICA · RECURSOS VISUALES AO NO INSTALADOS';
      ctx.save(); ctx.font = '700 10px DM Sans, sans-serif'; ctx.textAlign = 'left';
      const width = ctx.measureText(message).width + 20;
      ctx.fillStyle = 'rgba(17,22,17,.82)'; ctx.fillRect(12, 52, width, 25);
      ctx.fillStyle = '#e5d5a5'; ctx.fillText(message, 22, 68); ctx.restore();
    }
  }
  function refreshHud() {
    if (!player) return;
    $('healthBar').style.width = `${player.hp / player.maxHp * 100}%`;
    $('healthValue').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
    $('manaBar').style.width = `${player.mana / player.maxMana * 100}%`;
    $('manaValue').textContent = `${Math.floor(player.mana)} / ${player.maxMana}`;
    document.querySelectorAll('.spell-slot').forEach((button, index) => {
      const skill = CLASS_PROFILES[currentClass].skills[index], cooldown = player.skillCooldowns[index];
      button.disabled = !player.alive;
      button.classList.toggle('unavailable', player.mana < skill.cost);
      button.classList.toggle('cooling', cooldown > 0);
      button.querySelector('.spell-cost').textContent = cooldown > 0 ? `${cooldown.toFixed(1)}s` : `${skill.cost} maná`;
    });

    const target = byId[selected], targetAlive = target?.alive && isEnemy(player, target);
    $('targetName').textContent = targetAlive ? target.name : 'Sin objetivo';
    if (targetAlive) {
      const targetDistance = distance(player, target);
      const attackState = !player.alive ? 'REAPARECIENDO' : paused ? 'EN PAUSA' : targetDistance > 1 ? 'FUERA DE ALCANCE' : player.attackCd > 0 ? `ATACÁ EN ${player.attackCd.toFixed(1)}s` : 'AL ALCANCE';
      $('targetStatus').textContent = `${Math.round(target.hp)}% · ${targetDistance} casilleros · ${attackState}`;
    } else {
      $('targetStatus').textContent = 'Seleccioná un rival';
    }
    $('attackBtn').disabled = !targetAlive || !player.alive || paused || distance(player, target) > 1 || player.attackCd > 0;
    for (const actor of fighters) {
      const row = document.querySelector(`[data-fighter="${actor.id}"]`);
      if (row) { row.classList.toggle('fighter-dead', !actor.alive); row.classList.toggle('targeted', actor.id === selected); }
    }
  }
  function resetGame() {
    for (const actor of fighters) {
      const profile = CLASS_PROFILES[actor.className];
      Object.assign(actor, { x: actor.homeX, y: actor.homeY, hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana, alive: true, step: null, stepTime: 0, respawn: 0, flash: 0, attackCd: rand(.2, .8), aiTimer: rand(.2, 1), aim: null, immobilized: 0, aiTargetId: null, skillCooldowns: [0, 0, 0] });
    }
    floatingTexts.length = 0; spellEffects.length = 0;
    selected = 'chaoticWarrior'; selectedSkill = null; elapsed = 0; paused = false; keys.clear();
    refreshSkillSelection();
    $('respawnNotice').classList.add('hidden'); $('respawnTimer').textContent = '2.4'; $('battleLog').innerHTML = '<div class="empty-log">Las hazañas de la arena aparecerán aquí.</div>';
    $('killFeed').innerHTML = '<div class="feed-line"><span class="feed-gold">✦</span> <b>La arena te espera</b><span>—</span> buena suerte, viajero.</div>';
    refreshHud(); toast('Arena reiniciada · elegí un objetivo y luchá.');
  }
  function togglePause() { paused = !paused; toast(paused ? 'Partida pausada' : 'Partida reanudada'); }
  function actorAtPointer(x, y) {
    const [cx, cy] = position(player), range = visibleRange(cx, cy); let best = null, bestScore = Infinity;
    for (const actor of fighters) {
      if (!actor.alive) continue;
      const [ax, ay] = position(actor), [sx, sy] = screenTile(ax, ay, cx, cy);
      if (x >= sx - 5 && x <= sx + tilePx + 5 && y >= sy - tilePx * 1.2 && y <= sy + tilePx) {
        const score = Math.hypot(x - (sx + tilePx / 2), y - (sy + tilePx / 2)); if (score < bestScore) { best = actor; bestScore = score; }
      }
    }
    return best;
  }
  window.addEventListener('pointerdown', () => { audioReady = true; }, { once: true });
  window.addEventListener('keydown', event => {
    audioReady = true; const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
    if (key === 'escape') {
      if (!$('helpModal').classList.contains('hidden')) $('helpModal').classList.add('hidden');
      else if (!$('sidePanel').classList.contains('hidden')) toggleScoreboard(false);
      else togglePause();
      return;
    }
    if (key === 'enter' || key === 'f') { event.preventDefault(); attack(); return; }
    if (['1', '2', '3'].includes(key)) { selectSkill(Number(key) - 1); return; }
    if (key === 'tab') { event.preventDefault(); if (!event.repeat) cycleEnemyTarget(); return; }
    keys.add(key);
  });
  window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => { keys.clear(); clearJoystick(); });
  canvas.addEventListener('pointerdown', event => {
    const rect = canvas.getBoundingClientRect(), target = actorAtPointer(event.clientX - rect.left, event.clientY - rect.top);
    if (target) handleCanvasTarget(target);
  });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  $('attackBtn').addEventListener('click', () => attack());
  $('classSelect').addEventListener('change', event => applyClass(event.target.value));
  document.querySelectorAll('.spell-slot').forEach(button => button.addEventListener('click', () => selectSkill(Number(button.dataset.skill))));
  $('scoreboardToggle').addEventListener('click', () => toggleScoreboard());
  document.querySelectorAll('.roster-row[data-fighter]').forEach(row => {
    if (row.dataset.fighter !== 'player') row.addEventListener('click', () => selectTarget(byId[row.dataset.fighter]));
  });
  const joystick = $('joystick');
  if (joystick) {
    joystick.addEventListener('pointerdown', event => { event.preventDefault(); joystick.setPointerCapture(event.pointerId); updateJoystick(event); });
    joystick.addEventListener('pointermove', event => { if (joystick.hasPointerCapture(event.pointerId)) updateJoystick(event); });
    joystick.addEventListener('pointerup', clearJoystick);
    joystick.addEventListener('pointercancel', clearJoystick);
    joystick.addEventListener('lostpointercapture', clearJoystick);
  }
  $('restartBtn').addEventListener('click', resetGame);
  $('soundToggle').addEventListener('click', () => { audioOn = !audioOn; $('soundLabel').textContent = `SONIDO ${audioOn ? 'ON' : 'OFF'}`; $('soundIcon').textContent = audioOn ? '♫' : '♪'; });
  $('helpBtn').addEventListener('click', () => $('helpModal').classList.remove('hidden'));
  $('closeHelp').addEventListener('click', () => $('helpModal').classList.add('hidden'));
  $('helpModal').addEventListener('click', event => { if (event.target === $('helpModal')) $('helpModal').classList.add('hidden'); });
  $('menuBtn').addEventListener('click', togglePause);
  let previous = performance.now();
  function loop(now) { const dt = Math.min(.05, (now - previous) / 1000); previous = now; update(dt); draw(); requestAnimationFrame(loop); }
  renderSkills(); refreshHud(); loadAssets(); requestAnimationFrame(loop);
})();
