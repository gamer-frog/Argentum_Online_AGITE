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
  const CHARACTER_LEVEL = 40;
  const ACTORS = [
    { id: 'player', name: 'GUERRERO', team: 'sacred', className: 'warrior', level: CHARACTER_LEVEL, x: 43, y: 46 },
    { id: 'sacredMage', name: 'MAGO', team: 'sacred', className: 'mage', level: CHARACTER_LEVEL, x: 43, y: 43 },
    { id: 'sacredCleric', name: 'CLÉRIGO', team: 'sacred', className: 'cleric', level: CHARACTER_LEVEL, x: 43, y: 49 },
    { id: 'sacredPaladin', name: 'PALADÍN', team: 'sacred', className: 'paladin', level: CHARACTER_LEVEL, x: 46, y: 46 },
    { id: 'chaoticWarrior', name: 'GUERRERO', team: 'chaotic', className: 'warrior', level: CHARACTER_LEVEL, x: 57, y: 46 },
    { id: 'chaoticMage', name: 'MAGO', team: 'chaotic', className: 'mage', level: CHARACTER_LEVEL, x: 57, y: 43 },
    { id: 'chaoticCleric', name: 'CLÉRIGO', team: 'chaotic', className: 'cleric', level: CHARACTER_LEVEL, x: 57, y: 49 },
    { id: 'chaoticPaladin', name: 'PALADÍN', team: 'chaotic', className: 'paladin', level: CHARACTER_LEVEL, x: 54, y: 46 }
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
  // Color de la mira según el hechizo preparado (FX de AO) y del golpe cuerpo a cuerpo.
  const MELEE_AIM_COLOR = '#ff685b', HEAL_AIM_COLOR = '#9ee68b';
  const FIRE_AIM_COLOR = '#ff9a54', SHOCK_AIM_COLOR = '#64d8d0', DEFAULT_AIM_COLOR = '#e8b75f';
  // Escala Imperium AO (nivel 40): el guerrero es el de más vida y NO tiene maná; el combo golpe+hechizo+hechizo mata.
  const MELEE_DAMAGE = { warrior: [85, 105], paladin: [75, 95], mage: [45, 60], cleric: [50, 65] };
  const MANA_REGEN = 6;
  // Skin por clase y facción: [body, head] humanos (raza humana por ahora).
  const FACTION_LOOKS = {
    sacred: { warrior: [1, 1], mage: [2, 2], cleric: [2, 4], paladin: [1, 3] },
    chaotic: { warrior: [3, 2], mage: [2, 1], cleric: [2, 3], paladin: [3, 4] }
  };
  const CLASS_PROFILES = {
    warrior: { label: 'GUERRERO', hp: 380, mana: 0, skills: [
      { name: 'Golpe poderoso', icon: '⚔', type: 'damage', cost: 0, damage: [105, 125], range: 1, aimColor: MELEE_AIM_COLOR },
      { name: 'Vendaje', icon: '✚', type: 'heal', cost: 0, heal: 115, aimColor: HEAL_AIM_COLOR },
      { name: 'Carga', icon: '➤', type: 'damage', cost: 0, damage: [125, 145], range: 2, aimColor: MELEE_AIM_COLOR }
    ] },
    // Nombres y daños del manual de Imperium Classic; los costos de maná son de práctica
    // (el manual no publica maná y los del foro no entran en las reservas de nivel 40).
    mage: { label: 'MAGO', hp: 260, mana: 1400, skills: [
      { name: 'Apocalipsis', icon: '✹', type: 'damage', cost: 230, damage: [117, 119], range: 7, fxSpellId: 25, aimColor: FIRE_AIM_COLOR },
      { name: 'Juicio Final', icon: '☄', type: 'damage', cost: 350, damage: [142, 144], range: 7, fxSpellId: 25, aimColor: FIRE_AIM_COLOR },
      { name: 'Inmovilizar', icon: '❄', type: 'immobilize', cost: 350, immobilize: 3.5, fxSpellId: 9, aimColor: SHOCK_AIM_COLOR },
      { name: 'Remover parálisis', icon: '✧', type: 'cleanse', cost: 330, aimColor: HEAL_AIM_COLOR }
    ] },
    cleric: { label: 'CLÉRIGO', hp: 300, mana: 1200, skills: [
      { name: 'Ráfaga Ígnea', icon: '✹', type: 'damage', cost: 230, damage: [98, 100], range: 6, fxSpellId: 2, aimColor: FIRE_AIM_COLOR },
      { name: 'Sanar', icon: '✚', type: 'heal', cost: 220, heal: [40, 45], aimColor: HEAL_AIM_COLOR },
      { name: 'Inmovilizar', icon: '❄', type: 'immobilize', cost: 350, immobilize: 3.5, fxSpellId: 9, aimColor: SHOCK_AIM_COLOR },
      { name: 'Remover parálisis', icon: '✧', type: 'cleanse', cost: 330, aimColor: HEAL_AIM_COLOR }
    ] },
    paladin: { label: 'PALADÍN', hp: 330, mana: 1000, skills: [
      { name: 'Castigo Divino', icon: '⚔', type: 'damage', cost: 40, damage: [90, 92], range: 1, aimColor: MELEE_AIM_COLOR },
      { name: 'Fuente de vida', icon: '✚', type: 'heal', cost: 220, heal: [25, 32], aimColor: HEAL_AIM_COLOR },
      { name: 'Inmovilizar', icon: '❄', type: 'immobilize', cost: 350, immobilize: 3.5, fxSpellId: 9, aimColor: SHOCK_AIM_COLOR },
      { name: 'Remover parálisis', icon: '✧', type: 'cleanse', cost: 330, aimColor: HEAL_AIM_COLOR }
    ] }
  };
  // Acceso defensivo a habilidades: nunca devolver undefined (evita TypeError en .type/.cost).
  function skillAt(index, className = currentClass) {
    const skills = CLASS_PROFILES[className]?.skills;
    return Array.isArray(skills) ? skills[index] ?? null : null;
  }
  // Las curas de Imperium se publican como rango (p. ej. Sanar 40-45); aceptar número o par.
  function skillHealAmount(skill) {
    const heal = skill?.heal;
    return Array.isArray(heal) ? rand(heal[0] ?? 0, heal[1] ?? heal[0] ?? 0) : Number(heal) || 0;
  }
  const STEP_DURATION = .22; // Velocidad de Imperium AO Classic: apenas más rápida que la caminata clásica (~4,5 casilleros/s).
  const NPC_AIM_DURATION = .58;
  const NPC_MELEE_ACCURACY = .78;
  const NPC_COMBAT_RANGES = {
    warrior: { min: 1, max: 1 },
    mage: { min: 4, max: 6 },
    cleric: { min: 3, max: 5 },
    paladin: { min: 1, max: 1 }
  };
  // Pociones de práctica ilimitadas: beber ocupa al personaje e impide atacar/lanzar; las acciones también impiden beber.
  const POTION_DURATION = 1.1, POTION_HP_SHARE = .4, POTION_MANA_SHARE = .45;
  const CAST_RECOVERY = .9;
  // Apoyo aliado (backlog 10): solo magos y clérigos asisten a otros aliados, con demora ocasional; nunca es instantáneo.
  const SUPPORT_CLASSES = new Set(['mage', 'cleric']);
  const SUPPORT_DELAY = { cleanse: [.5, 1.2], salvage: [.3, .7], heal: [.9, 1.8] };
  const SUPPORT_CLASS_HP = .68, SUPPORT_SALVAGE_HP = .34;
  // Nadie lanza hechizos fuera de su visión: ~el área del personaje en pantalla.
  const SPELL_VISION_RANGE = 11;
  // Autocuidado: solo se planta a curarse si de verdad está herido (nada de curarse por curar).
  const SELF_CARE_HP = .5;
  const images = new Map(), spellSounds = new Map();
  let mapData, grhs, characters, spellFx = {};
  let fallbackWorld = false;
  let W = 800, H = 480, dpr = 1, tilePx = 32;
  let elapsed = 0, paused = false;
  let selected = 'chaoticWarrior', selectedSkill = null, currentClass = 'warrior';
  let mouseTile = null; // Casilla bajo el cursor: alimenta la mira en vivo del hechizo preparado.
  const floatingTexts = [], spellEffects = [];
  let audioOn = true, audioReady = false, audioCtx;
  const keys = new Set();
  let joystickKey = null;
  const fighters = ACTORS.map((actor, index) => {
    const profile = CLASS_PROFILES[actor.className];
    const [body, head] = FACTION_LOOKS[actor.team]?.[actor.className] ?? [1, 1];
    return {
      ...actor, body, head, homeX: actor.x, homeY: actor.y,
      hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana,
      alive: true,
      heading: index === 1 ? 'W' : 'S', step: null, stepTime: 0, aiTimer: rand(.2, 1),
      aiFlankSide: Math.random() < .5 ? -1 : 1,
      attackCd: rand(.2, .8), flash: 0, respawn: 0, bodyFrameTime: Math.random() * 2, aim: null,
      skillCooldowns: [0, 0, 0, 0], immobilized: 0, potionCd: 0, castCd: 0, supportTask: null,
      movePlan: null, strafeTimer: 0
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
      try {
        const response = await fetch(MAP_URL + 'spellfx.json');
        if (response.ok) {
          const manifest = await response.json();
          spellFx = manifest.spells || {};
          for (const [spellId, definition] of Object.entries(spellFx)) {
            if (!definition.wav) continue;
            const sound = new Audio(`${MAP_URL}audio/${definition.wav}.wav`);
            sound.preload = 'auto';
            spellSounds.set(spellId, sound);
          }
        }
      } catch (_) { /* Authentic effects and sounds are optional. */ }
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
  function playSpellSound(spellId, fallbackFrequency = 340) {
    if (!audioOn || !audioReady) return;
    const sound = spellSounds.get(String(spellId));
    if (!sound) { tone(fallbackFrequency, .13); return; }
    try {
      sound.currentTime = 0;
      const playback = sound.play();
      if (playback?.catch) playback.catch(() => {});
    } catch (_) { /* Audio is optional. */ }
  }
  function addSpellEffect(x, y, tx, ty, kind, spellId = null) {
    const definition = spellId == null ? null : spellFx[String(spellId)];
    const animation = definition?.animation;
    const animationData = animation == null ? null : grhs[String(animation)];
    const cycles = Math.max(1, Number(definition?.loops || 0) + 1);
    const duration = animationData?.speed ? animationData.speed * cycles / 1000 : .5;
    spellEffects.push({ x, y, tx, ty, age: 0, duration, kind, spellId, definition });
  }
  function findOpen(x, y, except = null) {
    if (!mapData) return [x, y];
    for (let radius = 0; radius < 10; radius++) {
      for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
        const tx = x + dx, ty = y + dy;
        // except permite conservar la casilla propia al spawnear/reaparecer; los muertos no bloquean.
        if (isOpen(tx, ty) && !fighters.some(f => f !== except && f.alive && f.x === tx && f.y === ty)) return [tx, ty];
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
    // Cada casillero dura un poco distinto (solo NPCs): sin ese jitter el bot camina en metrónomo.
    const duration = actor === player ? STEP_DURATION : STEP_DURATION * rand(.82, 1.22);
    actor.step = { from: [x, y], to: [nx, ny], duration }; actor.stepTime = 0;
    return true;
  }
  // Plan de movimiento de NPC: rachas de 2–4 casilleros encadenados y un freno natural entre rachas.
  function npcPlanStep(actor) {
    const plan = actor.movePlan;
    if (!plan) return;
    plan.steps = (plan.steps ?? 0) + 1;
    // Rachas de 2–4 casilleros encadenados con un freno apenas perceptible entre rachas.
    if (plan.steps >= (plan.burst ?? (plan.burst = 2 + Math.floor(Math.random() * 3)))) {
      actor.movePlan = null; actor.aiTimer = rand(.05, .16); return;
    }
    const target = byId[plan.targetId], combatRange = NPC_COMBAT_RANGES[actor.className];
    if (!target?.alive || !combatRange) { actor.movePlan = null; return; }
    const range = distance(actor, target);
    let step = null;
    // Retirada: si el paso codicioso no existe (pared, aliado o esquina), buscar una casilla
    // del anillo por ruta para que el mago/clérigo no se quede acorralado en melee.
    if (plan.kind === 'retreat') step = range < combatRange.min
      ? (nextRetreatStep(actor, target, combatRange.min, combatRange.max) ?? nextPathStep(actor, target, combatRange.min, combatRange.max))
      : null;
    else if (plan.kind === 'path') step = range > combatRange.max ? nextPathStep(actor, target, combatRange.min, combatRange.max) : null;
    else if (plan.kind === 'strafe') step = range >= combatRange.min && range <= combatRange.max ? nextStrafeStep(actor, target, combatRange.min, combatRange.max) : null;
    if (!step || !startStep(actor, step[0], step[1])) { actor.movePlan = null; actor.aiTimer = rand(.04, .12); }
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
    // Coordinación de agite: un rival inmovilizado es una ventana de daño gratis.
    // El clérigo, además, lo prioriza como blanco (pedido de roles de equipo).
    const frozenBonus = (target.immobilized > 0 ? 3.5 : 0) + (actor.className === 'cleric' && target.immobilized > 0 ? 2.5 : 0);
    return distance(actor, target) * 1.6 + target.hp / target.maxHp * 5 - alliesCommitted * 2.5 - frozenBonus;
  }
  // Prioridad de apoyo: vida baja primero, pero el clérigo sostiene al paladín del equipo
  // (pedido de roles): lo cura antes que a otros y lo desparaliza por encima de todo.
  function supportPriority(actor, ally, kind = 'heal') {
    if (!actor || !ally) return Infinity;
    const paladinBias = ally.className === 'paladin'
      ? (actor.className === 'cleric' ? (kind === 'cleanse' ? 1.1 : .45) : .2)
      : 0;
    return (ally.hp / (ally.maxHp || 1)) - paladinBias + distance(actor, ally) * .01;
  }
  function allyPressure(actor, x, y, allies, radius = 1) {
    return allies.reduce((pressure, ally) => {
      const [ax, ay] = actorTile(ally), d = Math.abs(ax - x) + Math.abs(ay - y);
      return pressure + (d === 0 ? 4 : d <= radius ? 2 : d === radius + 1 ? .5 : 0);
    }, 0);
  }
  function nextPathStep(actor, target, minRange, maxRange) {
    const [sx, sy] = actorTile(actor), [tx, ty] = actorTile(target);
    const allies = fighters.filter(other => other !== actor && other.alive && other.team === actor.team);
    const queue = [[sx, sy, 0, 0, 0]], visited = new Set([`${sx},${sy}`]);
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let bestStep = null, bestScore = Infinity, firstGoalDepth = Infinity;
    for (let head = 0; head < queue.length; head++) {
      const [x, y, firstDx, firstDy, depth] = queue[head];
      if (depth > firstGoalDepth + 2) break;
      const targetDistance = Math.abs(x - tx) + Math.abs(y - ty);
      if (depth && targetDistance >= minRange && targetDistance <= maxRange) {
        firstGoalDepth = Math.min(firstGoalDepth, depth);
        const cross = (tx - x) * firstDy - (ty - y) * firstDx;
        const flankBias = cross === 0 ? 0 : (Math.sign(cross) === actor.aiFlankSide ? -.45 : .45);
        const score = depth + allyPressure(actor, x, y, allies) * 1.15 + flankBias + Math.random() * .55;
        if (score < bestScore) { bestScore = score; bestStep = [firstDx, firstDy]; }
        continue;
      }
      for (const [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
        if (visited.has(key) || !isOpen(nx, ny) || occupied(nx, ny, actor)) continue;
        visited.add(key);
        queue.push([nx, ny, depth ? firstDx : dx, depth ? firstDy : dy, depth + 1]);
      }
    }
    return bestStep;
  }
  function nextStrafeStep(actor, target, minRange, maxRange) {
    const [x, y] = actorTile(actor), [tx, ty] = actorTile(target);
    const allies = fighters.filter(other => other !== actor && other.alive && other.team === actor.team);
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let bestStep = null, bestScore = Infinity;
    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy, keyDistance = Math.abs(nx - tx) + Math.abs(ny - ty);
      if (!isOpen(nx, ny) || occupied(nx, ny, actor) || keyDistance < minRange || keyDistance > maxRange) continue;
      const cross = (tx - x) * dy - (ty - y) * dx;
      const flankBias = cross === 0 ? 0 : (Math.sign(cross) === actor.aiFlankSide ? -.9 : .9);
      const score = Math.abs(keyDistance - (minRange + maxRange) / 2) * .32
        + allyPressure(actor, nx, ny, allies) * 1.7 + flankBias + Math.random() * .5;
      if (score < bestScore) { bestScore = score; bestStep = [dx, dy]; }
    }
    return bestStep;
  }
  function nextRetreatStep(actor, target, minRange, maxRange) {
    const [x, y] = actorTile(actor), [tx, ty] = actorTile(target);
    const currentDistance = Math.abs(x - tx) + Math.abs(y - ty);
    const allies = fighters.filter(other => other !== actor && other.alive && other.team === actor.team);
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let bestStep = null, bestScore = Infinity;
    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (!isOpen(nx, ny) || occupied(nx, ny, actor)) continue;
      const nextDistance = Math.abs(nx - tx) + Math.abs(ny - ty);
      if (nextDistance <= currentDistance) continue;
      const rangePenalty = nextDistance < minRange ? minRange - nextDistance : nextDistance > maxRange ? nextDistance - maxRange : 0;
      const score = rangePenalty * 2 + allyPressure(actor, nx, ny, allies) * 1.7 + Math.random() * .25;
      if (score < bestScore) { bestScore = score; bestStep = [dx, dy]; }
    }
    return bestStep;
  }
  function attack(actor = player, targetOverride = null) {
    if (paused || !actor.alive || actor.attackCd > 0) return false;
    if ((actor.potionCd ?? 0) > 0) {
      if (actor === player) toast('Estás bebiendo una poción; esperá para atacar.');
      return false;
    }
    const target = targetOverride || byId[selected];
    if (!target || !target.alive || target === actor || !isEnemy(actor, target)) { toast('Elegí un rival de la legión contraria.'); return false; }
    const d = distance(actor, target);
    if (d > 1) { toast('Acercate al objetivo para atacar.'); return false; }
    actor.heading = actorTile(target)[0] < actorTile(actor)[0] ? 'W' : actorTile(target)[0] > actorTile(actor)[0] ? 'E' : actorTile(target)[1] < actorTile(actor)[1] ? 'N' : 'S';
    actor.attackCd = actor === player ? .62 : rand(.7, 1.05);
    actor.flash = .1;
    // Daño melee por clase (Imperium nivel 40): mismo rango para jugador y NPCs.
    const [meleeLo, meleeHi] = MELEE_DAMAGE[actor.className] ?? [11, 18];
    const damage = Math.ceil(rand(meleeLo, meleeHi)); target.hp = Math.max(0, target.hp - damage); target.flash = .22;
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
  function beginNpcAim(actor, target, spell = null, retries = 0, tile = null) {
    const [x, y] = tile ?? actorTile(target), [fromX, fromY] = actorTile(actor);
    actor.heading = x < fromX ? 'W' : x > fromX ? 'E' : y < fromY ? 'N' : 'S';
    // Apuntar NO detiene al NPC: sigue buscando ángulo y flanqueando mientras la mira corre (pedido de agite).
    // Tiempos random: cada apuntado tarda distinto (hechizos 0,38–0,62 s; golpes 0,36–0,52 s).
    const base = spell ? rand(.38, .62) : rand(.36, .52);
    // Cada reintento encadenado acelera la mira: el apuntador ajusta más rápido y el blanco tiene menos ventana de escape.
    const duration = base * Math.pow(.68, retries);
    actor.aim = { targetId: target?.id ?? null, tile: tile ?? null, x, y, fromX, fromY, cursorX: x, cursorY: y, phase: Math.random() * Math.PI * 2, duration, remaining: duration, spell, retries };
    // El primer intento usa el ritmo normal; un reintento encadenado mantiene la mira viva sin pausa larga.
    actor.attackCd = retries > 0 ? Math.max(.25, actor.attackCd * .5) : rand(.85, 1.15);
  }
  function resolveNpcAim(actor) {
    const aim = actor.aim;
    actor.aim = null;
    if (!aim || !actor.alive) return;
    // Tiro a casilla (click en el suelo): pega a quien esté parado ahí, o erra.
    if (aim.tile) { resolveTileAim(actor, aim); return; }
    const target = byId[aim.targetId];
    if (!target?.alive) return;
    // Revalido la visión al resolver: si el blanco salió del área en pantalla durante la mira, no hay lanzamiento.
    if (distance(actor, target) > SPELL_VISION_RANGE) { addFloatingTextAt(aim.x, aim.y, 'fuera de vista', 'status'); return; }
    const skill = aim.spell?.skill ?? null;
    // Como ahora el NPC puede moverse mientras apunta, el golpe melee revalida su alcance real al resolver.
    if (!skill && distance(actor, target) > Math.max(1, NPC_COMBAT_RANGES[actor.className]?.max ?? 1)) {
      addFloatingTextAt(aim.x, aim.y, 'fuera de alcance', 'status');
      return;
    }
    // Las curas y las remociones no se esquivan ni fallan: el telégrafo resuelve sobre el aliado vivo, aunque se mueva.
    if (skill?.type === 'heal' || skill?.type === 'cleanse') { npcCastSkill(actor, skill, aim.spell?.index, target); return; }
    const [x, y] = actorTile(target);
    if ((x !== aim.x || y !== aim.y) && actor !== player) {
      addFloatingTextAt(aim.x, aim.y, 'esquivó', 'status');
      // Mira persistente: si el blanco huyó de la casilla, el NPC encadena otro apuntado en vez de soltar la mira.
      if ((aim.retries ?? 0) < 2 && (actor.castCd ?? 0) <= 0 && isEnemy(actor, target) && distance(actor, target) <= SPELL_VISION_RANGE) {
        beginNpcAim(actor, target, aim.spell, (aim.retries ?? 0) + 1);
      }
      return;
    }
    // Hechizos con telégrafo apuntado: aciertan casi siempre, pero un blanco libre en movimiento puede hacerlos fallar de forma humana.
    if (aim.spell) {
      const accuracy = target.immobilized > 0 ? 1 : .82;
      if (Math.random() > accuracy) {
        // Errar un hechizo es fallo del lanzador, no esquiva del blanco.
        addFloatingText(actor, 'ERRADO', 'status');
        return;
      }
      npcCastSkill(actor, aim.spell?.skill, aim.spell?.index, target);
      return;
    }
    if (Math.random() > NPC_MELEE_ACCURACY) {
      addFloatingTextAt(aim.x, aim.y, 'falló', 'status');
      return;
    }
    actor.flash = .1;
    const [lo, hi] = MELEE_DAMAGE[actor.className] ?? [11, 18];
    const damage = Math.ceil(rand(lo, hi)); target.hp = Math.max(0, target.hp - damage); target.flash = .22;
    addFloatingText(target, `-${damage}`, 'damage');
    tone(155 + Math.random() * 50, .07);
    // El golpe también deja su intervalo antes de volver a actuar o lanzar.
    actor.attackCd = Math.max(actor.attackCd, .5);
    actor.castCd = Math.max(actor.castCd ?? 0, .45);
    if (target.hp <= 0) kill(target, actor);
    refreshHud();
  }
  // Resolución de un tiro a casilla libre: mismo telegrama humano (puede errar) y golpea a quien esté ahí.
  function resolveTileAim(actor, aim) {
    const skill = aim.spell?.skill ?? null;
    if (!skill || (skill.type !== 'damage' && skill.type !== 'immobilize')) { addFloatingText(actor, 'ERRADO', 'status'); return; }
    const [ax, ay] = actorTile(actor);
    if (Math.abs(ax - aim.x) + Math.abs(ay - aim.y) > SPELL_VISION_RANGE) { addFloatingTextAt(aim.x, aim.y, 'fuera de vista', 'status'); return; }
    if (Math.random() > .82) { addFloatingText(actor, 'ERRADO', 'status'); return; }
    const victim = fighters.find(other => other.alive && actorTile(other)[0] === aim.x && actorTile(other)[1] === aim.y) ?? null;
    if (!victim) { addFloatingTextAt(aim.x, aim.y, 'al vacío', 'status'); return; }
    npcCastSkill(actor, skill, aim.spell.index, victim);
  }
  function updateNpcAims(dt) {
    // El jugador también apunta: misma telegrafía, mismo corte si lo congelan.
    for (const actor of fighters) {
      if (!actor.aim) continue;
      // Congelado a mitad de lanzamiento: el hechizo se corta (salvo Remover Parálisis, que sirve justo para eso).
      if (actor.immobilized > 0 && actor.aim.spell?.skill?.type !== 'cleanse') { actor.aim = null; continue; }
      actor.aim.remaining -= dt;
      const target = byId[actor.aim.targetId];
      const progress = clamp(1 - actor.aim.remaining / (actor.aim.duration || NPC_AIM_DURATION), 0, 1);
      if (target?.alive) {
        const [tx, ty] = actorTile(target);
        if (target.immobilized > 0) {
          // Blanco inmovilizado: la mira se fija limpia sobre la casilla, sin temblar.
          actor.aim.cursorX = tx; actor.aim.cursorY = ty;
        } else {
          actor.aim.cursorX = tx + Math.sin(elapsed * 15 + actor.aim.phase) * (1 - progress) * .18;
          actor.aim.cursorY = ty + Math.cos(elapsed * 13 + actor.aim.phase) * (1 - progress) * .18;
        }
      } else if (actor.aim.tile) {
        // Tiro a casilla: la mira tiembla sobre el punto y se asienta con el progreso.
        actor.aim.cursorX = actor.aim.x + Math.sin(elapsed * 15 + actor.aim.phase) * (1 - progress) * .18;
        actor.aim.cursorY = actor.aim.y + Math.cos(elapsed * 13 + actor.aim.phase) * (1 - progress) * .18;
      }
      if (actor.aim.remaining <= 0) resolveNpcAim(actor);
    }
  }
  function npcCastSkill(actor, skill, index, target) {
    if (!actor || !skill || !target || !target.alive || !Number.isInteger(index)
      || !Array.isArray(actor.skillCooldowns) || index < 0 || index >= actor.skillCooldowns.length) return false;
    // Perfil defensivo: una habilidad incompleta no debe consumir maná ni romper el combate.
    if (skill.type === 'damage' && !Array.isArray(skill.damage)) return false;
    if (skill.type === 'immobilize' && !(skill.immobilize > 0)) return false;
    if (actor.mana < skill.cost || actor.skillCooldowns[index] > 0) return false;
    actor.mana -= skill.cost;
    actor.skillCooldowns[index] = skill.type === 'heal' ? 5 : skill.type === 'cleanse' ? 2.5 : skill.type === 'immobilize' ? 3.5 : 4.2 + index * .8;
    // Intervalo global de lanzamiento: nadie encadena hechizos ni golpes al instante.
    actor.attackCd = Math.max(actor.attackCd, CAST_RECOVERY);
    actor.castCd = Math.max(actor.castCd ?? 0, CAST_RECOVERY);
    const [sx, sy] = position(actor), [tx, ty] = position(target);
    if (skill.type === 'heal') {
      const restored = Math.min(Math.ceil(skillHealAmount(skill)), target.maxHp - target.hp);
      if (restored > 0) addFloatingText(actor, skill.name, 'spell');
      if (restored > 0) {
        target.hp += restored; target.flash = .2;
        addFloatingText(target, `+${restored}`, 'heal');
      }
      addSpellEffect(sx, sy, tx, ty, 'heal', skill.fxSpellId);
      if (restored > 0) playSpellSound(skill.fxSpellId, 340);
      return restored > 0;
    }
    if (skill.type === 'cleanse') {
      if (target.immobilized <= 0) {
        // Nada que remover: devolvemos el maná (uso fallido).
        actor.mana += skill.cost;
        actor.skillCooldowns[index] = 0;
        return false;
      }
      target.immobilized = 0;
      addFloatingText(actor, skill.name, 'spell');
      addFloatingText(target, 'Removida', 'status');
      addSpellEffect(sx, sy, tx, ty, 'heal', skill.fxSpellId);
      playSpellSound(skill.fxSpellId, 520);
      return true;
    }
    if (skill.type === 'immobilize') {
      addFloatingText(actor, skill.name, 'spell');
      target.immobilized = Math.max(target.immobilized, skill.immobilize);
      target.step = null; target.stepTime = 0;
      addFloatingText(target, 'Paralizado', 'status');
      addSpellEffect(sx, sy, tx, ty, actor.className, skill.fxSpellId);
      playSpellSound(skill.fxSpellId, 620);
      return true;
    }
    addFloatingText(actor, skill.name, 'spell');
    const damage = Math.ceil(rand(skill.damage[0], skill.damage[1]));
    target.hp = Math.max(0, target.hp - damage); target.flash = .28;
    addFloatingText(target, `-${damage}`, 'damage');
    addSpellEffect(sx, sy, tx, ty, actor.className, skill.fxSpellId);
    if (target.hp <= 0) kill(target, actor);
    playSpellSound(skill.fxSpellId, actor.className === 'mage' ? 620 : 340);
    return true;
  }
  function selectSkill(index) {
    if (paused || !player.alive) return;
    const skill = skillAt(index);
    if (!skill) return;
    selectedSkill = selectedSkill === index ? null : index;
    refreshSkillSelection();
    const usage = skill.type === 'heal' ? 'hacé clic en tu personaje o un aliado para curar.'
      : skill.type === 'cleanse' ? 'hacé clic en tu personaje o un aliado paralizado.'
      : 'elegí un rival en el campo.';
    toast(selectedSkill === null ? 'Selección de hechizo cancelada.' : `${skill.name} seleccionado · ${usage}`);
  }
  // Atajos E/Q: arman el hechizo propio de la clase (Inmovilizar / Remover Parálisis) como los slots 1-4.
  function armSkillOfType(type) {
    if (paused || !player.alive) return;
    const index = (CLASS_PROFILES[currentClass]?.skills ?? []).findIndex(skill => skill?.type === type);
    if (index < 0) { toast(type === 'immobilize' ? 'Tu clase no tiene Inmovilizar.' : 'Tu clase no tiene Remover Parálisis.'); return; }
    selectSkill(index);
  }
  function refreshSkillSelection() {
    document.querySelectorAll('.spell-slot[data-skill]').forEach((button, slot) => {
      button.classList.toggle('active-spell', slot === selectedSkill);
      button.setAttribute('aria-pressed', String(slot === selectedSkill));
    });
    const skill = selectedSkill === null ? null : skillAt(selectedSkill);
    const hint = skill
      ? `${skill.name} listo · ${skill.type === 'damage' || skill.type === 'immobilize' ? 'hacé clic en un rival' : skill.type === 'cleanse' ? 'hacé clic en tu personaje o un aliado paralizado' : 'hacé clic en tu personaje o un aliado'}`
      : 'Elegí un hechizo y hacé clic en un rival';
    $('spellHint').textContent = hint;
  }
  function refreshPotions() {
    document.querySelectorAll('.spell-slot[data-potion]').forEach(button => {
      const kind = button.dataset.potion, drinking = (player.potionCd ?? 0) > 0;
      const blocked = !player.alive || paused || player.attackCd > 0 || (player.castCd ?? 0) > 0;
      button.disabled = !player.alive || paused || drinking || blocked;
      button.classList.toggle('cooling', drinking);
      button.querySelector('.spell-cost').textContent = drinking ? `${player.potionCd.toFixed(1)}s` : kind === 'red' ? 'VIDA ∞' : 'MANÁ ∞';
    });
  }
  function castSkill(index, targetOverride = null) {
    if (paused || !player.alive) return;
    const skill = skillAt(index), target = targetOverride || byId[selected];
    if (!Number.isInteger(index) || index < 0 || !Array.isArray(player.skillCooldowns) || index >= player.skillCooldowns.length) return;
    if (!skill) return;
    if ((player.potionCd ?? 0) > 0) { toast('Estás bebiendo una poción; esperá para lanzar.'); return; }
    if ((player.castCd ?? 0) > 0) { toast(`Intervalo de lanzamiento: esperá ${(player.castCd).toFixed(1)}s.`); return; }
    if (player.attackCd > 0) { toast('Terminá el golpe antes de lanzar.'); return; }
    if (player.aim) return;
    const wantsAlly = skill.type === 'heal' || skill.type === 'cleanse';
    if (!target || !target.alive || (wantsAlly ? isEnemy(player, target) : (target === player || !isEnemy(player, target)))) {
      toast(wantsAlly
        ? (skill.type === 'cleanse' ? 'Hacé clic en tu personaje o en un aliado paralizado.' : 'Hacé clic en tu personaje o un aliado para curar.')
        : 'Elegí un rival como objetivo.');
      return;
    }
    // Nadie lanza fuera de su visión: el área del personaje en pantalla es el límite.
    if (distance(player, target) > SPELL_VISION_RANGE) { toast('Está fuera de tu visión; acercate para lanzar.'); return; }
    if (player.skillCooldowns[index] > 0) { toast('Esa habilidad todavía se está recuperando.'); return; }
    if (player.mana < skill.cost) { toast('No tenés maná suficiente.'); return; }
    // El jugador también apunta: la mira se ve igual que la de los bots y el hechizo recién sale al resolver.
    beginNpcAim(player, target, { skill, index });
    player.castCd = Math.max(player.castCd ?? 0, CAST_RECOVERY);
    selectedSkill = null; refreshSkillSelection();
  }
  // Lanzamiento a casilla (click en el suelo): el hechizo viaja a ese punto y pega a quien esté parado ahí.
  function castSkillAtTile(index, tile) {
    if (paused || !player.alive) return;
    const skill = skillAt(index);
    if (!skill) return;
    if ((player.potionCd ?? 0) > 0) { toast('Estás bebiendo una poción; esperá para lanzar.'); return; }
    if ((player.castCd ?? 0) > 0) { toast(`Intervalo de lanzamiento: esperá ${(player.castCd).toFixed(1)}s.`); return; }
    if (player.attackCd > 0) { toast('Terminá el golpe antes de lanzar.'); return; }
    if (player.aim) return;
    if (skill.type === 'heal' || skill.type === 'cleanse') {
      toast(skill.type === 'cleanse' ? 'La remoción necesita a tu personaje o un aliado paralizado como objetivo.' : 'La cura necesita a tu personaje o un aliado como objetivo.');
      return;
    }
    if (player.skillCooldowns[index] > 0) { toast('Esa habilidad todavía se está recuperando.'); return; }
    if (player.mana < skill.cost) { toast('No tenés maná suficiente.'); return; }
    const [px, py] = actorTile(player), [tx, ty] = tile;
    if (Math.abs(px - tx) + Math.abs(py - ty) > SPELL_VISION_RANGE) { toast('Está fuera de tu visión; acercate para lanzar.'); return; }
    beginNpcAim(player, null, { skill, index }, 0, tile);
    player.castCd = Math.max(player.castCd ?? 0, CAST_RECOVERY);
    selectedSkill = null; refreshSkillSelection();
  }
  function drinkPotion(kind) {
    if (paused || !player.alive) return;
    const red = kind === 'red';
    if ((player.potionCd ?? 0) > 0) { toast('Todavía estás bebiendo la poción.'); return; }
    if (player.attackCd > 0 || (player.castCd ?? 0) > 0) { toast('Terminá el golpe o hechizo antes de beber.'); return; }
    if (!red && player.maxMana === 0) { toast('El guerrero no usa maná: bebé una poción roja.'); return; }
    const restored = red
      ? Math.min(Math.ceil(player.maxHp * POTION_HP_SHARE), player.maxHp - player.hp)
      : Math.min(Math.ceil(player.maxMana * POTION_MANA_SHARE), player.maxMana - player.mana);
    if (!restored) { toast(red ? 'Ya tenés toda la vida.' : 'Ya tenés todo el maná.'); return; }
    player.potionCd = POTION_DURATION;
    player.attackCd = Math.max(player.attackCd, POTION_DURATION);
    player.castCd = Math.max(player.castCd ?? 0, POTION_DURATION);
    if (red) { player.hp += restored; player.flash = .2; addFloatingText(player, `+${restored}`, 'heal'); }
    else { player.mana += restored; addFloatingText(player, `+${restored}`, 'mana'); }
    addFloatingText(player, red ? 'Poción roja' : 'Poción azul', 'spell');
    toast(red ? `Poción roja bebida: +${restored} de vida.` : `Poción azul bebida: +${restored} de maná.`);
    refreshHud();
  }
  function applyClass(className) {
    currentClass = className in CLASS_PROFILES ? className : 'warrior';
    const profile = CLASS_PROFILES[currentClass];
    const [lookBody, lookHead] = FACTION_LOOKS[player.team]?.[currentClass] ?? [1, 1];
    player.className = currentClass; player.name = profile.label;
    player.body = lookBody; player.head = lookHead;
    player.maxHp = profile.hp; player.hp = profile.hp;
    player.maxMana = profile.mana; player.mana = profile.mana;
    player.skillCooldowns = [0, 0, 0, 0]; selectedSkill = null;
    // Cambiar de clase a mitad de un apuntado cancela el hechizo viejo y libera el intervalo.
    player.aim = null; player.attackCd = 0;
    player.potionCd = 0; player.castCd = 0;
    $('heroClass').textContent = profile.label;
    const heroName = document.querySelector('.hero-name');
    if (heroName) heroName.textContent = profile.label;
    const selfName = document.querySelector('.self-row .roster-copy b');
    if (selfName) selfName.textContent = profile.label;
    const selfTag = document.querySelector('.self-row .roster-copy small');
    if (selfTag) selfTag.textContent = 'TÚ';
    renderSkills(); refreshSkillSelection(); refreshHud();
    toast(`Clase ${profile.label.toLowerCase()} seleccionada.`);
  }
  function renderSkills() {
    document.querySelectorAll('.spell-slot[data-skill]').forEach((button, index) => {
      const skill = skillAt(index);
      button.disabled = !skill;
      button.querySelector('.spell-icon').textContent = skill?.icon ?? '—';
      button.querySelector('.spell-name').textContent = skill?.name ?? 'No disponible';
      const costLabel = skill?.cost > 0 ? `${skill.cost} maná` : 'sin coste';
      button.querySelector('.spell-cost').textContent = skill ? costLabel : '—';
      const typeHint = skill?.type === 'heal' ? 'Restaura vida' : skill?.type === 'cleanse' ? 'Remueve la parálisis' : skill?.type === 'immobilize' ? 'Paraliza al objetivo' : 'Daño · dentro de tu visión';
      button.title = skill ? `${skill.name} · ${costLabel} · ${typeHint}` : 'Habilidad no disponible';
    });
  }
  function actorDisplayName(actor, fallback = 'Alguien') {
    if (!actor) return fallback;
    return names[actor.id] ?? actor.name ?? fallback;
  }
  function kill(victim, attacker) {
    if (!victim) return;
    victim.alive = false; victim.respawn = 2.4; victim.step = null; victim.aim = null; victim.immobilized = 0; victim.supportTask = null; victim.movePlan = null;
    if (victim === player) updateRespawnNotice();
    for (const actor of fighters) if (actor.aim?.targetId === victim.id) actor.aim = null;
    const attackerLabel = attacker ? (attacker === player ? 'Vos' : actorDisplayName(attacker)) : 'Alguien';
    const victimLabel = victim === player ? 'vos' : actorDisplayName(victim);
    const feed = $('killFeed'), line = document.createElement('div'); line.className = 'feed-line';
    line.innerHTML = `<span class="feed-gold">✦</span> <b>${attackerLabel}</b><span> derrotó a </span><b>${victimLabel}</b>`;
    feed.prepend(line); while (feed.children.length > 3) feed.lastElementChild.remove();
    const log = $('battleLog'), entry = document.createElement('div'); entry.className = 'log-entry';
    entry.innerHTML = `${attacker === player ? '<b>Derrotaste</b>' : `<b>${attackerLabel}</b> derrotó a`} ${victim === player ? 'tu personaje' : actorDisplayName(victim)}.`;
    const empty = log.querySelector('.empty-log'); if (empty) empty.remove(); log.prepend(entry); while (log.children.length > 5) log.lastElementChild.remove();
    toast(victim === player ? 'Has caído. Regresarás al campo en un instante.' : attacker === player ? `Derrotaste a ${actorDisplayName(victim)}.` : `${actorDisplayName(victim)} cayó en combate.`);
    tone(victim === player ? 110 : 380, .17);
    refreshHud();
  }
  function respawn(actor) {
    if (!actor) return;
    const [x, y] = findOpen(actor.homeX, actor.homeY, actor);
    const profile = CLASS_PROFILES[actor.className] ?? CLASS_PROFILES.warrior;
    Object.assign(actor, { x, y, hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana, alive: true, step: null, respawn: 0, flash: .6, attackCd: .7, aim: null, immobilized: 0, aiTargetId: null, skillCooldowns: [0, 0, 0, 0], potionCd: 0, castCd: 0, supportTask: null, movePlan: null, strafeTimer: 0 });
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
    const skill = selectedSkill === null ? null : skillAt(selectedSkill);
    const supportive = skill?.type === 'heal' || skill?.type === 'cleanse';
    toast(supportive ? `${actor.name} seleccionado · con el hechizo preparado, hacé clic sobre un aliado para aplicarlo.`
      : selectedSkill === null ? `${actor.name} seleccionado · acercate y atacá con F.`
      : skill ? `${actor.name} seleccionado · ${skill.name} listo para lanzar desde el campo.` : 'Elegí un hechizo válido.');
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
    if (player.step) return; // Lanzar NO frena: caminás mientras apuntás y el hechizo sale igual.
    // Use only the most recently pressed direction: holding two keys never creates a diagonal.
    const key = [...keys].reverse().find(pressed => PLAYER_DIRECTIONS[pressed]);
    if (key) startStep(player, ...PLAYER_DIRECTIONS[key]);
  }
  function updateBots(dt) {
    for (const actor of fighters.slice(1)) {
      if (!actor.alive || actor.step) continue;
      if (actor.immobilized > 0) {
        // Congelado: solo puede intentar remover su propia parálisis, como en AO.
        if (!Array.isArray(actor.skillCooldowns)) continue;
        const profileSkills = CLASS_PROFILES[actor.className]?.skills ?? [];
        const selfCleanse = profileSkills.findIndex(skill => skill?.type === 'cleanse');
        const cleanseSkill = selfCleanse >= 0 ? profileSkills[selfCleanse] ?? null : null;
        if (cleanseSkill && !actor.aim && (actor.castCd ?? 0) <= 0 && actor.mana >= cleanseSkill.cost && actor.skillCooldowns[selfCleanse] <= 0) {
          beginNpcAim(actor, actor, { skill: cleanseSkill, index: selfCleanse });
        }
        continue;
      }
      // El intervalo de lanzamiento solo prohíbe lanzar: caminar y esquivar sigue (nadie se queda quieto).
      const recovering = (actor.castCd ?? 0) > 0;
      actor.aiTimer -= dt;
      if (actor.aiTimer > 0) continue;
      const tick = .12 + Math.random() * .08;
      actor.aiTimer = tick;

      const allies = fighters.filter(other => other.alive && other.team === actor.team);
      const profile = CLASS_PROFILES[actor.className];
      const skills = profile?.skills;
      if (!Array.isArray(skills)) continue;
      if (!Array.isArray(actor.skillCooldowns)) continue;
      // Remover parálisis primero: un aliado congelado pierde varios turnos, es lo más urgente.
      const cleanseIndex = skills.findIndex((skill, index) => skill?.type === 'cleanse' && actor.mana >= skill.cost && actor.skillCooldowns[index] <= 0);
      if (cleanseIndex >= 0 && !recovering && !actor.supportTask) {
        const frozen = allies
          .filter(other => other.immobilized > 0 && distance(actor, other) <= SPELL_VISION_RANGE)
          .sort((a, b) => supportPriority(actor, a, 'cleanse') - supportPriority(actor, b, 'cleanse'))[0] ?? null;
        if (frozen) {
          const delay = rand(SUPPORT_DELAY.cleanse[0], SUPPORT_DELAY.cleanse[1]);
          actor.supportTask = { allyId: frozen.id, kind: 'cleanse', timer: delay, delay, tries: 0 };
        }
      }
      const healingIndex = skills.findIndex((skill, index) => skill?.type === 'heal' && actor.mana >= skill.cost && actor.skillCooldowns[index] <= 0);
      if (!recovering && healingIndex >= 0) {
        const heal = skillAt(healingIndex, actor.className);
        if (heal) {
          const candidates = allies
            .filter(other => other.hp < other.maxHp && other.hp / other.maxHp < SUPPORT_CLASS_HP && distance(actor, other) <= SPELL_VISION_RANGE)
            .sort((a, b) => supportPriority(actor, a) - supportPriority(actor, b));
          const wounded = candidates[0] ?? null;
          if (wounded === actor) {
            // Autocuidado: solo si de verdad está herido; curarse por curar plantado en un rincón no.
            if (!actor.aim && actor.hp / actor.maxHp < SELF_CARE_HP) {
              beginNpcAim(actor, actor, { skill: heal, index: healingIndex });
              continue;
            }
          } else if (wounded && SUPPORT_CLASSES.has(actor.className) && !actor.supportTask) {
            // Apoyo a un aliado: intención demorada, visible como anillo verde sobre el aliado.
            const kind = wounded.hp / wounded.maxHp < SUPPORT_SALVAGE_HP ? 'salvage' : 'heal';
            const [lo, hi] = SUPPORT_DELAY[kind] ?? SUPPORT_DELAY.heal;
            const delay = rand(lo, hi);
            actor.supportTask = { allyId: wounded.id, kind, timer: delay, delay, tries: 0 };
          }
        }
      }

      const target = tacticalEnemy(actor);
      // Nadie se queda quieto jamás: con blanco lo persigue (el agite nunca para); sin blancos vivos vuelve a su puesto.
      if (!target) {
        actor.aiTargetId = null; actor.movePlan = null;
        const homeStep = nextPathStep(actor, { x: actor.homeX, y: actor.homeY }, 0, 2);
        if (homeStep) startStep(actor, homeStep[0], homeStep[1]);
        continue;
      }
      actor.aiTargetId = target.id;
      const range = distance(actor, target), combatRange = NPC_COMBAT_RANGES[actor.className];
      if (!combatRange) continue;
      // El mago jamás entra a melee: si lo presionan, primero se despega y busca ángulo.
      if (actor.className === 'mage' && range < combatRange.min) {
        const step = nextRetreatStep(actor, target, combatRange.min, combatRange.max)
          ?? nextPathStep(actor, target, combatRange.min, combatRange.max);
        if (step) {
          actor.movePlan = { kind: 'retreat', targetId: target.id };
          startStep(actor, step[0], step[1]);
          continue;
        }
        // Sin salida: se defiende a hechazos, nunca a golpes.
      }
      // Inmovilizar: con el hechizo listo y el blanco libre, suele congelar primero (agite clásico de AO).
      const freezeIndex = skills.findIndex((skill, index) => skill?.type === 'immobilize' && actor.mana >= skill.cost && actor.skillCooldowns[index] <= 0);
      if (freezeIndex >= 0 && !actor.aim && !recovering && target.immobilized <= 0 && distance(actor, target) <= SPELL_VISION_RANGE && Math.random() < .6) {
        beginNpcAim(actor, target, { skill: skillAt(freezeIndex, actor.className), index: freezeIndex });
        continue;
      }

      const attackSkills = skills.map((skill, index) => ({ skill, index }))
        .filter(({ skill, index }) => skill?.type === 'damage' && Array.isArray(skill.damage)
          && actor.mana >= skill.cost && actor.skillCooldowns[index] <= 0)
        .sort((a, b) => (b.skill.damage[0] + b.skill.damage[1]) - (a.skill.damage[0] + a.skill.damage[1]));
      if (!recovering && !actor.aim && actor.attackCd <= 0 && attackSkills.length && distance(actor, target) <= SPELL_VISION_RANGE) {
        beginNpcAim(actor, target, { skill: attackSkills[0].skill, index: attackSkills[0].index });
        continue;
      }

      // Agite frenético: nunca se queda quieto; en el anillo baila (flanquea) y a veces se reacomoda.
      let step, plan = null;
      if (range < combatRange.min) {
        step = nextRetreatStep(actor, target, combatRange.min, combatRange.max); plan = 'retreat';
      } else if (range > combatRange.max) {
        step = nextPathStep(actor, target, combatRange.min, combatRange.max); plan = 'path';
      } else {
        actor.flankTimer = (actor.flankTimer ?? rand(1.2, 2.6)) - tick;
        if (actor.flankTimer <= 0) {
          actor.flankTimer = rand(1.2, 2.6);
          if (Math.random() < .4) actor.aiFlankSide *= -1; // Cambia de flanco de vez en cuando.
        }
        if (Math.random() < .12) { step = nextPathStep(actor, target, combatRange.min, combatRange.max); plan = 'path'; }
        else { step = nextStrafeStep(actor, target, combatRange.min, combatRange.max); plan = 'strafe'; }
      }
      actor.movePlan = plan && step ? { kind: plan, targetId: target.id } : null;
      if (step) {
        startStep(actor, step[0], step[1]);
      } else if (!recovering && !actor.aim && actor.className !== 'mage' && range <= 1 && actor.attackCd <= 0) {
        beginNpcAim(actor, target);
      }
    }
  }
  function updateNpcSupport(dt) {
    // El apoyo demorado resuelve solo: vence el plazo, se revalida la necesidad y recién ahí se lanza.
    for (const actor of fighters.slice(1)) {
      const task = actor.supportTask;
      if (!task) continue;
      task.timer -= dt;
      if (task.timer > 0) continue;
      if (actor.aim) { task.timer = .2; continue; } // Termina la mira actual sin cancelar el apoyo pendiente.
      if ((actor.castCd ?? 0) > 0) { task.timer = .3; continue; } // Espera el intervalo de lanzamiento antes de apuntar la ayuda.
      actor.supportTask = null;
      if (!actor.alive || actor.immobilized > 0) continue;
      const ally = byId[task.allyId];
      if (!ally?.alive) continue;
      const profileSkills = CLASS_PROFILES[actor.className]?.skills ?? [];
      const skillIndex = task.kind === 'cleanse'
        ? profileSkills.findIndex(skill => skill?.type === 'cleanse')
        : profileSkills.findIndex(skill => skill?.type === 'heal');
      const skill = skillIndex >= 0 ? skillAt(skillIndex, actor.className) : null;
      if (!skill) continue;
      const stillNeeded = task.kind === 'cleanse' ? ally.immobilized > 0
        : ally.hp < ally.maxHp && ally.hp / ally.maxHp < SUPPORT_CLASS_HP;
      if (!stillNeeded) continue;
      // Revalido la visión al vencer el plazo: si el aliado salió del área en pantalla, no se lanza a ciegas.
      if (distance(actor, ally) > SPELL_VISION_RANGE) continue;
      if (actor.mana < skill.cost || (Array.isArray(actor.skillCooldowns) && actor.skillCooldowns[skillIndex] > 0)) {
        // Con tope de reintentos: si no puede, suelta la tarea y vuelve a moverse en vez de quedarse plantado.
        task.tries = (task.tries ?? 0) + 1;
        if (task.tries > 3) { actor.supportTask = null; actor.aiTimer = rand(.4, 1); continue; }
        actor.supportTask = task; task.timer = .5; continue;
      }
      // Toda ayuda se apunta: telégrafo verde sobre el aliado y recién entonces el hechizo.
      beginNpcAim(actor, ally, { skill, index: skillIndex });
    }
  }
  function update(dt) {
    if (!mapData || paused) return;
    elapsed += dt;
    for (const actor of fighters) {
      if (actor.attackCd > 0) actor.attackCd -= dt;
      if (actor.flash > 0) actor.flash -= dt;
      if (actor.immobilized > 0) actor.immobilized = Math.max(0, actor.immobilized - dt);
      if (actor.alive) actor.mana = Math.min(actor.maxMana, actor.mana + dt * MANA_REGEN);
      if (actor.potionCd > 0) actor.potionCd = Math.max(0, actor.potionCd - dt);
      if (actor.castCd > 0) actor.castCd = Math.max(0, actor.castCd - dt);
      if (Array.isArray(actor.skillCooldowns)) actor.skillCooldowns = actor.skillCooldowns.map(value => Math.max(0, value - dt));
      if (actor.step) {
        actor.stepTime += dt;
        if (actor.stepTime >= STEP_DURATION) {
          [actor.x, actor.y] = actor.step.to; actor.step = null; actor.stepTime = 0;
          // Encadenado del siguiente paso sin pausa: así caminan los NPCs como una persona, no a tirones.
          if (actor !== player) npcPlanStep(actor);
        }
      }
      if (!actor.alive) { actor.respawn -= dt; if (actor.respawn <= 0) respawn(actor); }
    }
    updateRespawnNotice();
    for (const text of floatingTexts) text.age += dt;
    for (const effect of spellEffects) effect.age += dt;
    while (floatingTexts.length && floatingTexts[0].age > 1.05) floatingTexts.shift();
    while (spellEffects.length && spellEffects[0].age > spellEffects[0].duration) spellEffects.shift();
    updatePlayer(); updateNpcSupport(dt); updateNpcAims(dt); updateBots(dt);
    refreshHud();
  }

  function resolveGrh(id, now, animate = true) {
    let def = grhs[String(id)];
    if (!def) return null;
    if (def.frames) {
      const frameDuration = def.speed / def.frames.length;
      const index = animate && frameDuration > 0 ? Math.floor(now / frameDuration) % def.frames.length : 0;
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
    const labelY = sy + tilePx + 12, label = actor.name;
    ctx.textAlign = 'center'; ctx.font = `600 ${Math.max(8, tilePx * .25)}px DM Sans, sans-serif`;
    ctx.fillStyle = actor.team === 'sacred' ? '#7ec8ff' : '#ff8274'; ctx.shadowColor = '#10130e'; ctx.shadowBlur = 4;
    ctx.fillText(label, centerX, labelY, tilePx * 2.8);
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72, 3);
    ctx.fillStyle = actor.hp / actor.maxHp > .3 ? '#8bb46c' : '#c96152'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72 * actor.hp / actor.maxHp, 3);
    // Maná debajo de la vida: barra azul con el maná actual del personaje (el guerrero no tiene).
    if ((actor.maxMana ?? 0) > 0) {
      ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 8, tilePx * .72, 3);
      ctx.fillStyle = '#5aa7d8'; ctx.fillRect(sx + tilePx * .14, labelY + 8, tilePx * .72 * clamp((actor.mana ?? 0) / (actor.maxMana || 1), 0, 1), 3);
    }
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
    const labelY = sy + tilePx + 12, label = actor.name;
    ctx.save(); ctx.textAlign = 'center'; ctx.font = `600 ${Math.max(8, tilePx * .25)}px DM Sans, sans-serif`;
    ctx.fillStyle = actor.team === 'sacred' ? '#7ec8ff' : '#ff8274'; ctx.shadowColor = '#10130e'; ctx.shadowBlur = 4;
    ctx.fillText(label, sx + tilePx / 2, labelY, tilePx * 2.8);
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72, 3);
    ctx.fillStyle = actor.hp / actor.maxHp > .3 ? '#8bb46c' : '#c96152'; ctx.fillRect(sx + tilePx * .14, labelY + 3, tilePx * .72 * actor.hp / actor.maxHp, 3);
    // Maná debajo de la vida: barra azul con el maná actual del personaje (el guerrero no tiene).
    if ((actor.maxMana ?? 0) > 0) {
      ctx.fillStyle = 'rgba(13,16,12,.82)'; ctx.fillRect(sx + tilePx * .14, labelY + 8, tilePx * .72, 3);
      ctx.fillStyle = '#5aa7d8'; ctx.fillRect(sx + tilePx * .14, labelY + 8, tilePx * .72 * clamp((actor.mana ?? 0) / (actor.maxMana || 1), 0, 1), 3);
    }
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
    // La mira del jugador se dibuja igual que la de los bots: línea, anillo y cruz.
    for (const actor of fighters) {
      const aim = actor.aim;
      if (!aim) continue;
      // El origen de la mira sigue la posición actual: jugador y NPC pueden caminar mientras apuntan.
      const [ox, oy] = position(actor);
      const [fromX, fromY] = screenTile(ox, oy, cameraX, cameraY);
      const [sx, sy] = screenTile(aim.cursorX, aim.cursorY, cameraX, cameraY);
      const x = sx + tilePx / 2, y = sy + tilePx / 2;
      // Mira sin texto: el color comunica qué hechizo/golpe viene (aimColor por habilidad, rojo para golpes).
      const color = aim.spell?.skill?.aimColor ?? MELEE_AIM_COLOR;
      const pulse = .5 + Math.sin(now / 90 + aim.phase) * .16;
      ctx.save(); ctx.globalAlpha = .72 + pulse * .28;
      ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = Math.max(2, tilePx * .055); ctx.shadowColor = color; ctx.shadowBlur = tilePx * .3;
      ctx.beginPath(); ctx.moveTo(fromX + tilePx / 2, fromY + tilePx / 2); ctx.lineTo(x, y); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, tilePx * (.27 + pulse * .035), 0, Math.PI * 2); ctx.stroke();
      const arm = tilePx * .42, gap = tilePx * .17;
      ctx.beginPath();
      ctx.moveTo(x - arm, y); ctx.lineTo(x - gap, y); ctx.moveTo(x + gap, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + arm); ctx.stroke();
      // Blanco inmovilizado: disco interior marca la mira fijada (puntería casi segura).
      const aimTarget = byId[aim.targetId];
      if (aimTarget?.alive && aimTarget.immobilized > 0) {
        ctx.globalAlpha = .3;
        ctx.beginPath(); ctx.arc(x, y, tilePx * .19, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // Mira en vivo del hechizo preparado: línea del personaje al cursor, misma estética que la mira de los bots.
    const readySkill = selectedSkill === null ? null : skillAt(selectedSkill);
    if (readySkill && player.alive && !paused && mouseTile) {
      const [px, py] = position(player), [psx, psy] = screenTile(px, py, cameraX, cameraY);
      const [msx, msy] = screenTile(mouseTile[0], mouseTile[1], cameraX, cameraY);
      const x = msx + tilePx / 2, y = msy + tilePx / 2, lineX = psx + tilePx / 2, lineY = psy + tilePx / 2;
      const color = readySkill.aimColor ?? DEFAULT_AIM_COLOR;
      const pulse = .5 + Math.sin(now / 120) * .2;
      ctx.save(); ctx.globalAlpha = .55 + pulse * .3; ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = Math.max(2, tilePx * .05); ctx.shadowColor = color; ctx.shadowBlur = tilePx * .25;
      ctx.beginPath(); ctx.moveTo(lineX, lineY); ctx.lineTo(x, y); ctx.stroke();
      ctx.setLineDash([tilePx * .14, tilePx * .1]);
      ctx.beginPath(); ctx.arc(x, y, tilePx * (.3 + pulse * .04), 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      const arm = tilePx * .3, gap = tilePx * .12;
      ctx.beginPath();
      ctx.moveTo(x - arm, y); ctx.lineTo(x - gap, y); ctx.moveTo(x + gap, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + arm); ctx.stroke();
      ctx.restore();
    }
    // Apoyo aliado pendiente: anillo verde punteado que se cierra sobre el aliado mientras llega la ayuda.
    for (const actor of fighters.slice(1)) {
      const task = actor.supportTask;
      if (!task) continue;
      const ally = byId[task.allyId];
      if (!ally?.alive) continue;
      const [ax, ay] = position(ally), [tsx, tsy] = screenTile(ax, ay, cameraX, cameraY);
      const x = tsx + tilePx / 2, y = tsy + tilePx / 2;
      const progress = clamp(1 - task.timer / (task.delay || 1), 0, 1);
      ctx.save(); ctx.globalAlpha = .38 + progress * .5;
      ctx.strokeStyle = HEAL_AIM_COLOR; ctx.fillStyle = HEAL_AIM_COLOR; ctx.lineWidth = Math.max(2, tilePx * .05);
      ctx.setLineDash([tilePx * .14, tilePx * .1]);
      ctx.beginPath(); ctx.arc(x, y, tilePx * (.34 - progress * .1), 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      const arm = tilePx * .16, gap = tilePx * .055;
      ctx.beginPath();
      ctx.moveTo(x - arm, y); ctx.lineTo(x - gap, y); ctx.moveTo(x + gap, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm); ctx.lineTo(x, y - gap); ctx.moveTo(x, y + gap); ctx.lineTo(x, y + arm); ctx.stroke();
      ctx.restore();
    }
    for (const effect of spellEffects) {
      const progress = effect.age / effect.duration;
      const [x0, y0] = screenTile(effect.x, effect.y, cameraX, cameraY);
      const [x1, y1] = screenTile(effect.tx, effect.ty, cameraX, cameraY);
      const animation = effect.definition?.animation;
      const animationFrame = animation == null ? null : resolveGrh(animation, effect.age * 1000);
      if (animationFrame?.image) {
        const offsetX = (effect.definition.offsetX || 0) * tilePx / 32;
        const offsetY = (effect.definition.offsetY || 0) * tilePx / 32;
        drawGrh(animation, x1 + offsetX, y1 + offsetY, effect.age * 1000);
        continue;
      }
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
      ctx.textAlign = 'center';
      if (item.kind === 'status') ctx.font = `700 ${Math.max(9, tilePx * .26)}px DM Sans, sans-serif`;
      else if (item.kind === 'spell') ctx.font = `800 ${Math.max(12, tilePx * .4)}px DM Sans, sans-serif`;
      else ctx.font = `800 ${Math.max(14, tilePx * .48)}px DM Sans, sans-serif`;
      ctx.fillStyle = item.kind === 'spell' ? '#c3c6c8' : item.kind === 'heal' ? '#9fe58e' : item.kind === 'mana' ? '#9fd8ee' : item.kind === 'status' ? '#e8d9a8' : item.kind === 'miss' ? '#ffd27a' : '#ff8274'; ctx.shadowColor = '#11150f'; ctx.shadowBlur = 5;
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
    $('manaBar').style.width = player.maxMana ? `${player.mana / player.maxMana * 100}%` : '0%';
    $('manaValue').textContent = player.maxMana ? `${Math.floor(player.mana)} / ${player.maxMana}` : '—';
    // El guerrero no tiene maná: se oculta la fila y la barra completas, no solo el valor.
    $('resourceBlock')?.classList.toggle('no-mana', !(player.maxMana > 0));
    document.querySelectorAll('.spell-slot[data-skill]').forEach((button, index) => {
      const skill = skillAt(index), cooldown = player.skillCooldowns?.[index] ?? 0;
      button.disabled = !player.alive || !skill;
      button.classList.toggle('unavailable', !skill || player.mana < skill.cost);
      button.classList.toggle('cooling', cooldown > 0);
      button.querySelector('.spell-cost').textContent = !skill ? '—' : cooldown > 0 ? `${cooldown.toFixed(1)}s` : skill.cost > 0 ? `${skill.cost} maná` : 'sin coste';
    });
    refreshPotions();

    const target = byId[selected], targetAlive = target?.alive && isEnemy(player, target);
    $('targetName').textContent = targetAlive ? target.name : 'Sin objetivo';
    if (targetAlive) {
      const targetDistance = distance(player, target);
      const attackState = !player.alive ? 'REAPARECIENDO' : paused ? 'EN PAUSA' : targetDistance > 1 ? 'FUERA DE ALCANCE' : player.attackCd > 0 ? `ATACÁ EN ${player.attackCd.toFixed(1)}s` : 'AL ALCANCE';
      $('targetStatus').textContent = `${Math.max(0, Math.round(target.hp / (target.maxHp || 1) * 100))}% · ${targetDistance} casilleros · ${attackState}`;
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
      Object.assign(actor, { x: actor.homeX, y: actor.homeY, hp: profile.hp, maxHp: profile.hp, mana: profile.mana, maxMana: profile.mana, alive: true, step: null, stepTime: 0, respawn: 0, flash: 0, attackCd: rand(.2, .8), aiTimer: rand(.2, 1), aim: null, immobilized: 0, aiTargetId: null, skillCooldowns: [0, 0, 0, 0], potionCd: 0, castCd: 0, supportTask: null, movePlan: null, strafeTimer: 0 });
    }
    floatingTexts.length = 0; spellEffects.length = 0;
    selected = 'chaoticWarrior'; selectedSkill = null; elapsed = 0; paused = false; keys.clear();
    refreshSkillSelection();
    $('respawnNotice').classList.add('hidden'); $('respawnTimer').textContent = '2.4'; $('battleLog').innerHTML = '<div class="empty-log">Las hazañas de la arena aparecerán aquí.</div>';
    $('killFeed').innerHTML = '<div class="feed-line"><span class="feed-gold">✦</span> <b>La arena te espera</b><span>—</span> buena suerte, viajero.</div>';
    refreshHud(); toast('Arena reiniciada · elegí un objetivo y luchá.');
  }
  function togglePause() { paused = !paused; toast(paused ? 'Partida pausada' : 'Partida reanudada'); }
  function tileAtPointer(px, py) {
    if (!mapData) return null;
    const [cx, cy] = position(player);
    const tx = Math.floor(cx + (px - W / 2 + tilePx / 2) / tilePx), ty = Math.floor(cy + (py - H / 2 + tilePx / 2) / tilePx);
    if (tx < 0 || ty < 0 || ty >= mapData.tiles.length || tx >= mapData.tiles[ty].length) return null;
    return [tx, ty];
  }
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
      if (selectedSkill !== null) { selectedSkill = null; refreshSkillSelection(); toast('Hechizo desarmado.'); return; }
      if (!$('helpModal').classList.contains('hidden')) $('helpModal').classList.add('hidden');
      else if (!$('sidePanel').classList.contains('hidden')) toggleScoreboard(false);
      else togglePause();
      return;
    }
    if (key === 'enter' || key === 'f' || key === ' ') { event.preventDefault(); attack(); return; }
    if (key === 'e') { armSkillOfType('immobilize'); return; }
    if (key === 'q') { armSkillOfType('cleanse'); return; }
    if (['1', '2', '3', '4'].includes(key)) { selectSkill(Number(key) - 1); return; }
    if (key === '5') { event.preventDefault(); drinkPotion('red'); return; }
    if (key === '6') { event.preventDefault(); drinkPotion('blue'); return; }
    if (key === 'tab') { event.preventDefault(); if (!event.repeat) cycleEnemyTarget(); return; }
    keys.add(key);
  });
  window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => { keys.clear(); clearJoystick(); });
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    mouseTile = tileAtPointer(event.clientX - rect.left, event.clientY - rect.top);
  });
  canvas.addEventListener('pointerleave', () => { mouseTile = null; });
  canvas.addEventListener('pointerdown', event => {
    const rect = canvas.getBoundingClientRect(), px = event.clientX - rect.left, py = event.clientY - rect.top;
    const target = actorAtPointer(px, py);
    if (target) { handleCanvasTarget(target); return; }
    // Click en el suelo con hechizo preparado: lanza a esa casilla (le pega a quien esté ahí, o erra).
    if (selectedSkill !== null) { const tile = tileAtPointer(px, py); if (tile) castSkillAtTile(selectedSkill, tile); }
  });
  canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (selectedSkill !== null) { selectedSkill = null; refreshSkillSelection(); toast('Hechizo desarmado.'); }
  });
  $('attackBtn').addEventListener('click', () => attack());
  $('classSelect').addEventListener('change', event => applyClass(event.target.value));
  document.querySelectorAll('.spell-slot[data-skill]').forEach(button => button.addEventListener('click', () => selectSkill(Number(button.dataset.skill))));
  document.querySelectorAll('.spell-slot[data-potion]').forEach(button => button.addEventListener('click', () => drinkPotion(button.dataset.potion)));
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
  // Gancho de verificación (solo lectura): permite auditar estado del juego desde la consola/playwright.
  window.AO_DEBUG = () => ({
    elapsed: Number(elapsed.toFixed(2)), paused,
    // Solo lectura: orden de apoyo que usaría el clérigo del equipo del jugador.
    supportPriority: (() => {
      const cleric = fighters.find(actor => actor.alive && actor.className === 'cleric' && actor.team === player.team);
      if (!cleric) return [];
      return fighters
        .filter(ally => ally.alive && ally.team === cleric.team)
        .map(ally => ({
          id: ally.id, cls: ally.className, hpPct: Math.round(ally.hp / (ally.maxHp || 1) * 100),
          heal: Number(supportPriority(cleric, ally).toFixed(2)), cleanse: Number(supportPriority(cleric, ally, 'cleanse').toFixed(2))
        }))
        .sort((a, b) => a.heal - b.heal);
    })(),
    texts: floatingTexts.map(text => text.text),
    fighters: fighters.map(actor => ({
      id: actor.id, cls: actor.className, hp: Math.round(actor.hp), maxHp: actor.maxHp,
      mana: Math.round(actor.mana), maxMana: actor.maxMana,
      x: actor.x, y: actor.y, stepping: Boolean(actor.step),
      immobilized: Number(actor.immobilized.toFixed(2)), alive: actor.alive,
      aiming: Boolean(actor.aim), aimSpell: actor.aim?.spell?.skill?.name ?? null, aimColor: actor.aim?.spell?.skill?.aimColor ?? null, aimTargetId: actor.aim?.targetId ?? null,
      support: actor.supportTask ? { kind: actor.supportTask.kind, ally: actor.supportTask.allyId, timer: Number(actor.supportTask.timer.toFixed(2)) } : null
    }))
  });
  let previous = performance.now();
  function loop(now) { const dt = Math.min(.05, (now - previous) / 1000); previous = now; update(dt); draw(); requestAnimationFrame(loop); }
  renderSkills(); refreshHud(); loadAssets(); requestAnimationFrame(loop);
})();
