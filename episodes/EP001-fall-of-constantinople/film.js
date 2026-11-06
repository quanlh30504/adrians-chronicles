// EP001 — The Fall of Constantinople. Storyboard build for PART 1 (eleven key frames, one scene per 10 s). v2
// Style: Copperplate Engraving (main) + Archive Light Table (evidence), joined by the loupe iris. Engine copied from pilot-1453.
// Each scene is built once (ink schedule 0.2–3.4 s of its local clock) and settles by local t ≈ 4 s; stills are taken at SB[i].
import * as B from './engine/burin.js';
import { engraveShape } from './engine/index.js';
import { drawSheet, borderInk, engraveText, wrapLines, roundelFrame, measure, PAL } from './engine/plate.js';
import { Wash } from './engine/wash.js';
import { clamp, ss } from '/core/lib.js';

export const W = 1920, H = 1080;
const PLATE = [70, 44, 1850, 1036], BORDER = [100, 72, 1820, 1008];
const HEAD = 'Playfair Display', LABEL = 'Source Sans 3', NOTEF = 'Lora';
const SIGNAL = '#a63a2a', SIGNAL_ON_DARK = '#ee9a86';
const SCENE_LEN = 10;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const LIGHT = [-0.6, -0.7];

const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const rectD = (x, y, w, h) => `M${x} ${y} h${w} v${h} h${-w} Z `;

export function makeFilm({ imgs = {}, meta = {}, plan = null, timing = null } = {}) {
  const scenes = [];
  const add = (name, build) => { const s = build(); s.name = name; scenes.push(s); };

  // shared helpers ----------------------------------------------------------------
  function frameInk() { const f = new B.Ink(); borderInk(f, BORDER); f.schedule('main', 0.2, 1.6, { conc: 1.2 }); f.build(); return f; }
  const title = (ctx, lt, text, sub, t0 = 2.2) => {
    engraveText(ctx, text, 960, 132, { size: 50, font: HEAD, weight: 700, track: 0.1, p: seg(lt, t0, t0 + 1.0) });
    if (sub) engraveText(ctx, sub, 960, 170, { size: 25, font: HEAD, italic: true, weight: 400, p: seg(lt, t0 + 0.6, t0 + 1.4) });
  };
  const label = (ctx, lt, t0, text, x, y, o = {}) => engraveText(ctx, text, x, y, { size: 17, font: LABEL, weight: 700, track: 0.14, p: seg(lt, t0, t0 + 0.7), ...o });
  const note = (ctx, lt, t0, text, x, y, o = {}) => engraveText(ctx, text, x, y, { size: 25, font: HEAD, italic: true, weight: 400, p: seg(lt, t0, t0 + 0.8), ...o });
  const sched = (ink, groups, a = 0.2, b = 3.4, conc = 70) => { ink.schedule(groups || ink.groups(), a, b, { conc }); ink.build(); };
  const wavelets = (ink, R, rect, n, avoid = []) => {
    ink.group('sea');
    for (let q = 0, k = 0; q < 6000 && k < n; q++) {
      const x = rect[0] + R() * (rect[2] - rect[0]), y = rect[1] + R() * (rect[3] - rect[1]), L = 24 + R() * 28;
      if (avoid.some(([a, b, c, d]) => x + L > a && x < b && y > c && y < d)) continue;
      B.stroke(ink, [[x, y], [x + L * 0.33, y - 2.2], [x + L * 0.66, y + 1.6], [x + L, y - 1.0]], 0.9 + R() * 0.4); k++;
    }
  };
  // a three-masted carrack, side view, bow to the right (local coords, ~250 wide)
  const ship = (ink, x, y, s, g, seed, rot = 0) => {
    const at = B.xf(x, y, s, rot);
    // hull with a rounded keel, a high stern castle and a forecastle
    engraveShape('M-130 -8 C-124 30 -70 46 0 46 C70 46 124 30 152 -10 L120 -8 Z', { ink, at, light: LIGHT, spacing: 3.2, wMax: 1.3, outlineW: 2.2, g: g + 'h', seed });
    engraveShape('M-132 -8 L-138 -56 L-70 -56 L-62 -8 Z M104 -8 L112 -50 L168 -56 L152 -8 Z', { ink, at, light: LIGHT, spacing: 3.2, wMax: 1.2, outlineW: 1.9, g: g + 'c', seed: seed + 1 });
    // billowed square sails on three masts
    engraveShape('M-50 -124 C-28 -112 28 -112 50 -124 L42 -28 C20 -14 -20 -14 -42 -28 Z M-36 -208 C-18 -198 18 -198 36 -208 L30 -130 C10 -120 -10 -120 -30 -130 Z M62 -92 C78 -84 106 -84 122 -92 L116 -26 C100 -16 84 -16 68 -26 Z M-116 -86 C-102 -78 -78 -78 -64 -86 L-68 -60 C-82 -54 -98 -54 -112 -60 Z', { ink, at, light: LIGHT, spacing: 3, wMax: 1.1, outlineW: 1.7, g: g + 's', seed: seed + 2 });
    ink.group(g + 'm');
    const P = (a, b) => at([a, b]);
    for (const [x0, y1] of [[0, -230], [92, -130], [-90, -100]]) B.stroke(ink, [P(x0, -6), P(x0, y1)], 2.6 * s + 0.8);
    B.stroke(ink, [P(0, -230), P(18, -222), P(34, -230)], 1.6);             // pennant
    for (const [a, b, c, d] of [[0, -230, -138, -56], [0, -230, 168, -56], [92, -130, 168, -56], [-90, -100, -138, -56]]) B.stroke(ink, [P(a, b), P(c, d)], 0.8);
  };

  // light table (the archive moment): the real object, one label, source ------------
  function lightTable(ctx, code, lt, { ox = 640, oy = 500, oh = 850, anchor = [0.5, 0.35], labelTop = null, reading = null, source = null, bx = 1180 } = {}) {
    const img = imgs[code], m = meta[code] || {};
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 1100); g.addColorStop(0, '#eef1f3'); g.addColorStop(1, '#c9d0d6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,135,150,0.10)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const asp = img ? img.width / img.height : 0.7, ow = oh * asp;
    const AX = (anchor[0] - 0.5) * ow, AY = (anchor[1] - 0.5) * oh, s = lerp(1.0, 1.1, ss(seg(lt, 0, 5)));
    ctx.save(); ctx.translate(ox, oy); ctx.translate(AX, AY); ctx.scale(s, s); ctx.translate(-AX, -AY);
    ctx.shadowColor = 'rgba(40,50,60,0.35)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 12; ctx.fillStyle = '#f3ecd8'; ctx.fillRect(-ow / 2, -oh / 2, ow, oh); ctx.shadowColor = 'transparent';
    if (img) ctx.drawImage(img, -ow / 2, -oh / 2, ow, oh);
    ctx.restore();
    const lp = ss(seg(lt, 1.0, 1.8));
    if (lp > 0) {
      const ax = ox + AX, ay = oy + AY, by = 250;
      ctx.globalAlpha = lp; ctx.strokeStyle = SIGNAL; ctx.fillStyle = SIGNAL; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ax, ay, 14, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(ax, ay, 4, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax + 10, ay - 10); ctx.lineTo(bx - 20, ay - 10); ctx.lineTo(bx - 20, by + 90); ctx.stroke();
      const lines = wrapLines(ctx, reading || m.reading || '', 480, { size: 26, font: NOTEF, weight: 600 }).slice(0, 4);
      const bh = 92 + lines.length * 31 + 44;
      ctx.fillStyle = 'rgba(30,36,44,0.94)'; ctx.fillRect(bx - 20, by + 90, 580, bh);
      ctx.fillStyle = SIGNAL_ON_DARK; ctx.font = '700 15px "Source Sans 3"'; ctx.letterSpacing = '2px'; ctx.textAlign = 'left'; ctx.fillText(labelTop || m.label_top || 'ARCHIVE RECORD', bx, by + 122); ctx.letterSpacing = '0px';
      ctx.fillStyle = '#f0ece0'; ctx.font = '600 26px "Lora"';
      lines.forEach((ln, i) => ctx.fillText(ln, bx, by + 156 + i * 31));
      ctx.fillStyle = '#b4bfca'; ctx.font = '400 16px "Source Sans 3"'; ctx.fillText(source || ('Wikimedia Commons · ' + (m.license || '') + ' · checked ' + (m.checked || '')), bx, by + 90 + bh - 20);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // =============================================================== 1 · cold open: the plate of the city (P1-01..05)
  add('P1-01 · cold open plate', () => {
    const ink = new B.Ink(), R = B.RNG(11);
    const CITY = 'M600 330 C800 308 1000 328 1180 388 C1330 438 1450 452 1522 482 C1486 546 1380 604 1250 652 C1000 772 760 852 592 884 L560 860 C536 700 558 520 600 330 Z';
    const city = engraveShape(CITY, { ink, light: LIGHT, spacing: 8.5, style: 'contour', wMax: 1.5, outlineW: 2.2, g: 'c', seed: 3, base: 0.0 });
    const bez = (p0, p1, p2, p3, u) => { const a = 1 - u; return [a * a * a * p0[0] + 3 * a * a * u * p1[0] + 3 * a * u * u * p2[0] + u * u * u * p3[0], a * a * a * p0[1] + 3 * a * a * u * p1[1] + 3 * a * u * u * p2[1] + u * u * u * p3[1]]; };
    const WALL = [[560, 860], [536, 700], [558, 520], [600, 330]];
    const wallPts = []; for (let i = 0; i <= 60; i++) wallPts.push(bez(...WALL, i / 60));
    let towers = '';
    for (let i = 1; i < 30; i++) { const [x, y] = bez(...WALL, i / 30); towers += rectD(x - 10, y - 11, 20, 22); }
    for (let i = 0; i < 30; i++) { const [x, y] = bez(...WALL, (i + 0.5) / 30); towers += rectD(x - 27, y - 6, 11, 12); }
    const wallShape = engraveShape(towers, { ink, light: LIGHT, spacing: 2.6, wMax: 1.1, outlineW: 1.3, g: 'w', seed: 5 });
    ink.group('wall'); B.stroke(ink, wallPts, 2.8); B.stroke(ink, wallPts.map(([x, y]) => [x - 38, y]), 1.6);
    let houses = '';
    for (let n = 0, k = 0; n < 900 && k < 72; n++) {
      const x = 640 + R() * 820, y = 340 + R() * 520, w = 12 + R() * 16, h = 10 + R() * 14;
      const ok = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].every(([a, b]) => B.inPoly(city.shape.polys, a, b));
      const nearEdge = [[x - 22, y], [x + w + 22, y], [x, y - 22], [x, y + h + 22]].some(([a, b]) => !B.inPoly(city.shape.polys, a, b));
      if (!ok || nearEdge || Math.hypot(x - 1330, y - 530) < 70) continue; houses += rectD(x, y, w, h); k++;
    }
    engraveShape(houses, { ink, light: LIGHT, spacing: 2.7, wMax: 1.0, outlineW: 1.2, g: 'o', seed: 7 });
    engraveShape('M1298 548 C1296 506 1364 506 1362 548 Z M1290 548 H1370 V578 H1290 Z', { ink, light: LIGHT, spacing: 2.8, wMax: 1.2, outlineW: 1.5, g: 's', seed: 9 });
    let tents = '';
    for (let n = 0, k = 0; n < 600 && k < 26; n++) { const x = 150 + R() * 320, y = 560 + R() * 290, s = 0.9 + R() * 0.5; if (Math.hypot(x - 300, y - 650) < 70) continue; tents += `M${x - 15 * s} ${y + 10 * s} L${x} ${y - 14 * s} L${x + 15 * s} ${y + 10 * s} Z `; k++; }
    tents += 'M255 690 L300 595 L345 690 Z';
    engraveShape(tents, { ink, light: LIGHT, spacing: 3.0, wMax: 1.2, outlineW: 1.5, g: 'k', seed: 13 });
    ink.group('kpole'); B.stroke(ink, [[300, 595], [300, 560]], 1.4); B.stroke(ink, [[300, 560], [326, 568], [300, 576]], 1.1);
    wavelets(ink, R, [640, 230, 1800, 900], 70, [[640, 1000, 270, 420], [800, 1200, 840, 940]]);
    const TX0 = 1000, TX1 = 1720, TY = 860, tk = new B.Ink(); tk.group('ticks'); B.stroke(tk, [[TX0, TY], [TX1, TY]], 1.4);
    for (let i = 0; i <= 53; i++) { const x = lerp(TX0, TX1, i / 53); B.stroke(tk, [[x, TY - 8], [x, TY + 8]], i % 10 === 0 ? 1.6 : 0.9); }
    sched(tk, null, 0.2, 3.2, 20);
    sched(ink); const fr = frameInk();
    const wash = new Wash({ scale: 1.5 });
    wash.add({ path: wallShape.shape.path, polys: wallShape.shape.polys, color: SIGNAL, origin: [580, 600], t0: 3.4, dur: 1.2, alpha: 0.8, seed: 4, spill: 2.5, lift: 0.5 });
    const draw = (ctx, lt, o = {}) => {
      drawSheet(ctx, { W, H, plate: PLATE }); wash.draw(ctx, lt); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'CONSTANTINOPLE.', 'Anno Domini MCDLIII');
      label(ctx, lt, 2.6, 'CORNU AUREUM', 900, 300, { size: 15, weight: 600, track: 0.2 }); label(ctx, lt, 2.8, 'PROPONTIS', 760, 905, { size: 15, weight: 600, track: 0.2 });
      if (o.ticks != null) {
        tk.draw(ctx, o.ticks); label(ctx, o.ticks, 2.0, '6 APRIL', TX0, TY + 38, { size: 15 }); label(ctx, o.ticks, 2.1, '29 MAY', TX1, TY + 38, { size: 15 }); note(ctx, o.ticks, 2.3, 'fifty-three days', (TX0 + TX1) / 2, TY - 26, { size: 22 });
      }
    };
    return { draw };
  });

  // =============================================================== 2 · the three suspects (P1-06..09)
  add('P1-06 · the suspects', () => {
    const ink = new B.Ink(); const cx = [400, 960, 1520], cy = 560, PW = 520;
    ink.group('panels'); for (const c of cx) B.outline(ink, rectPts(c - PW / 2, 290, c + PW / 2, 830), { w: 1.7, step: 4 });
    // FIG. I the cannon
    const at1 = B.xf(cx[0], cy, 1);
    engraveShape('M-210 -52 L-190 -52 L-190 44 L-210 44 Z M-190 -40 L90 -66 L100 -66 L100 22 L90 22 L-190 32 Z M-125 -50 h14 v82 h-14 Z M-35 -58 h14 v92 h-14 Z M50 -64 h14 v96 h-14 Z M-170 52 L130 40 L170 112 L-210 120 Z', { ink, at: at1, light: LIGHT, spacing: 4.4, wMax: 1.4, outlineW: 1.9, g: 'a', seed: 21 });
    engraveShape(B.ellipse(cx[0] - 90, cy + 128, 66, 66), { ink, light: LIGHT, spacing: 4, wMax: 1.3, outlineW: 2, g: 'b', seed: 22 });
    ink.group('spokes'); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; B.stroke(ink, [[cx[0] - 90, cy + 128], [cx[0] - 90 + Math.cos(a) * 62, cy + 128 + Math.sin(a) * 62]], 1.4); }
    ink.group('ground1'); B.stroke(ink, [[cx[0] - 230, cy + 196], [cx[0] + 230, cy + 196]], 1.1);
    // FIG. II the little door in a wall, with the bar lifted out of its brackets
    const arc = B.ellipsePts(0, -40, 90, 90, 0, 28, Math.PI, Math.PI * 2);
    engraveShape(B.ring([[-90, 170], ...arc, [90, 170]].map(([x, y]) => [x + cx[1], y + cy])), { ink, light: LIGHT, spacing: 5, wMax: 1.3, outlineW: 2.2, g: 'd', seed: 31 });
    engraveShape(`M${cx[1] - 245} ${cy - 130} h125 v300 h-125 Z M${cx[1] + 120} ${cy - 130} h125 v300 h-125 Z`, { ink, light: LIGHT, spacing: 5.5, wMax: 1.2, outlineW: 1.8, g: 'e', seed: 32 });
    ink.group('planks'); for (const dx of [-45, 0, 45]) B.stroke(ink, [[cx[1] + dx, cy - 36], [cx[1] + dx, cy + 170]], 1.1);
    ink.group('iron'); for (const y of [cy + 10, cy + 110]) B.stroke(ink, [[cx[1] - 90, y], [cx[1] + 90, y]], 3); B.stroke(ink, [[cx[1] - 120, cy + 56], [cx[1] - 90, cy + 56]], 4); B.stroke(ink, [[cx[1] + 90, cy + 56], [cx[1] + 120, cy + 56]], 4);
    ink.group('bar'); B.stroke(ink, [[cx[1] - 200, cy + 190], [cx[1] - 70, cy + 168]], 7, { taper: 6 }); B.stroke(ink, [[cx[1] - 200, cy + 200], [cx[1] - 70, cy + 178]], 2.4);
    // FIG. III a breastplate: shoulders, collar, ridge, rivets, a hole where the shot went in
    const at3 = B.xf(cx[2], cy, 1), hole = [cx[2] + 40, cy - 34];
    engraveShape('M-84 -150 C-50 -164 50 -164 84 -150 L124 -110 C140 -40 130 50 100 120 C70 160 34 180 0 184 C-34 180 -70 160 -100 120 C-130 50 -140 -40 -124 -110 Z', { ink, at: at3, light: LIGHT, spacing: 4, wMax: 1.5, outlineW: 2.4, style: 'contour', g: 'f', seed: 41 });
    ink.group('ridge'); B.stroke(ink, [[cx[2], cy - 156], [cx[2] + 4, cy + 176]], 1.8); B.stroke(ink, [[cx[2] - 70, cy - 140], [cx[2], cy - 112], [cx[2] + 70, cy - 140]], 1.6);
    ink.group('rivets'); for (let k = 0; k < 11; k++) { const a = Math.PI * (0.12 + k * 0.076); ink.dot(cx[2] + Math.cos(a + Math.PI) * 114, cy - 30 + Math.sin(a + Math.PI) * -150 + 150, 3.2); }
    ink.group('cracks'); for (let k = 0; k < 8; k++) { const a = k * Math.PI * 2 / 8 + 0.3, L = 26 + (k % 3) * 16; B.stroke(ink, [[hole[0] + Math.cos(a) * 16, hole[1] + Math.sin(a) * 16], [hole[0] + Math.cos(a) * (16 + L), hole[1] + Math.sin(a) * (16 + L)]], 1.1); }
    sched(ink); const fr = frameInk();
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt);
      const hp = seg(lt, 2.4, 3.0); if (hp > 0) { ctx.save(); ctx.fillStyle = PAL.paper; ctx.beginPath(); ctx.arc(hole[0], hole[1], 16 * hp, 0, 7); ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.4; ctx.stroke(); ctx.restore(); }
      const tp = seg(lt, 3.2, 4.4); if (tp > 0) {   // the one drop of madder: a streak running down from the hole
        ctx.save(); const g = ctx.createLinearGradient(0, hole[1], 0, hole[1] + 150 * tp); g.addColorStop(0, 'rgba(166,58,42,0.9)'); g.addColorStop(1, 'rgba(166,58,42,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hole[0] - 7, hole[1] + 12); ctx.lineTo(hole[0] + 7, hole[1] + 12); ctx.lineTo(hole[0] + 3, hole[1] + 150 * tp); ctx.lineTo(hole[0] - 3, hole[1] + 150 * tp); ctx.closePath(); ctx.fill(); ctx.restore(); }
      title(ctx, lt, 'THE SUSPECTS.', 'who broke the walls?');
      const T = ['FIG. I  ·  THE CANNON', 'FIG. II  ·  THE LITTLE DOOR', 'FIG. III  ·  THE WOUNDED MAN'], N = ['a stone ball, seven times a day', 'forgotten, or left open on purpose', 'carried off the wall at dawn'];
      cx.forEach((c, i) => { label(ctx, lt, 2.6 + i * 0.2, T[i], c, 872); note(ctx, lt, 3.0 + i * 0.2, N[i], c, 912, { size: 22 }); });
    };
    return { draw };
  });

  // =============================================================== 3 · loupe over the plate: the siege miniature (P1-14)
  add('P1-14 · loupe → archive (s1)', () => {
    const base = scenes[0];
    const draw = (ctx, lt) => {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); base.draw(ctx, 6); ctx.restore();
      const R = 640, c = [980, 540];
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, Math.PI * 2); ctx.clip();
      lightTable(ctx, 's1', lt, { ox: c[0] - 330, oy: c[1] + 20, oh: 780, anchor: [0.52, 0.40], bx: 960, labelTop: 'SIEGE MINIATURE · c. 1455', reading: 'Jean Le Tavernier, painted in Lille within a few years of the fall.', source: 'BnF MS Fr 9087 · public domain · via Wikimedia Commons' });
      ctx.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); roundelFrame(ctx, c[0], c[1], R, { p: 1, w: 3.0 }); ctx.restore();
    };
    return { draw };
  });

  // =============================================================== 4 · the Great Church (P1-15/24)
  add('P1-15 · Hagia Sophia', () => {
    const ink = new B.Ink(), R = B.RNG(17), at = B.xf(960, 640, 1);
    // nave block, buttresses, the great dome on its drum, two half-domes, the apse
    engraveShape('M-330 0 H330 V200 H-330 Z', { ink, at, light: LIGHT, spacing: 4.2, wMax: 1.3, outlineW: 2.2, g: 'a', seed: 1 });
    engraveShape('M-390 -40 h56 v240 h-56 Z M334 -40 h56 v240 h-56 Z M-120 -6 h32 v206 h-32 Z M88 -6 h32 v206 h-32 Z', { ink, at, light: LIGHT, spacing: 3.6, wMax: 1.2, outlineW: 1.9, g: 'b', seed: 2 });
    engraveShape('M-300 0 C-300 -120 -150 -120 -150 0 Z M150 0 C150 -120 300 -120 300 0 Z', { ink, at, light: LIGHT, spacing: 3.4, wMax: 1.3, outlineW: 2, style: 'contour', g: 'c', seed: 3 });
    engraveShape('M-150 -10 h300 v-70 h-300 Z', { ink, at, light: LIGHT, spacing: 3.2, wMax: 1.2, outlineW: 2, g: 'd', seed: 4 });
    engraveShape('M-150 -80 C-150 -260 150 -260 150 -80 Z', { ink, at, light: LIGHT, spacing: 3.2, wMax: 1.5, outlineW: 2.4, style: 'contour', g: 'e', seed: 5 });
    ink.group('windows'); for (let k = 0; k < 20; k++) { const x = -135 + k * 14.2; B.stroke(ink, [[960 + x, 640 - 72], [960 + x, 640 - 24]], 2.2); }
    for (const x of [-250, -200, -50, 50, 200, 250]) for (const y of [40, 110]) B.stroke(ink, [[960 + x, 640 + y], [960 + x, 640 + y + 36]], 2.6);
    ink.group('cross'); B.stroke(ink, [[960, 640 - 252], [960, 640 - 292]], 2); B.stroke(ink, [[960 - 14, 640 - 276], [960 + 14, 640 - 276]], 2);
    ink.group('ground'); B.stroke(ink, [[300, 840], [1620, 840]], 1.3);
    wavelets(ink, R, [160, 860, 1760, 960], 0);
    sched(ink); const fr = frameInk();
    const draw = (ctx, lt, o = {}) => {
      drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'HAGIA SOPHIA.', 'the Great Church · the evening of 28 May 1453');
      label(ctx, lt, 2.8, 'FIG. 2', 960, 252); note(ctx, lt, 3.1, 'the Great Church', 960, 900, { size: 26 });
      if (o.note) { const p = seg(o.noteT ?? lt, 0, 1.2); ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = SIGNAL; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(960 - 120, 700); ctx.lineTo(960 + 120, 640 - 330); ctx.stroke(); ctx.restore(); label(ctx, o.noteT ?? lt, 0.3, o.note, 960, 960 - 40, { size: 17 }); }
    };
    return { draw };
  });

  // =============================================================== 5 · an empire that fits inside one city (P1-19/25)
  add('P1-19 · 1450', () => {
    const ink = new B.Ink(), R = B.RNG(23);
    // schematic outline map (ours, not a modern map): the Balkans and Greece to the west, Anatolia to the east, the Aegean between
    // coastlines: corner points rounded (Chaikin) and roughened with noise, so the outlines read as shore, not as polygons
    const coast = (pts, seed, it = 3, rough = 7) => { let P = pts; for (let k = 0; k < it; k++) { const Q = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } P = Q; } return B.ring(P.map(([x, y], i) => [x + (B.noise1(i / 5, seed) - 0.5) * rough, y + (B.noise1(i / 5, seed + 9) - 0.5) * rough])); };
    const balkans = engraveShape(coast([[220, 250], [700, 232], [860, 300], [880, 380], [800, 430], [720, 470], [700, 560], [640, 640], [590, 706], [540, 676], [500, 590], [450, 520], [380, 440], [300, 380], [230, 320]], 3), { ink, light: LIGHT, spacing: 7, style: 'hatch', angle: -0.5, wMax: 1.2, outlineW: 2, g: 'a', seed: 11, base: 0.22 });
    const morea = engraveShape(coast([[500, 722], [470, 752], [466, 800], [506, 838], [548, 862], [600, 846], [614, 802], [596, 756], [552, 722]], 5, 3, 5), { ink, light: LIGHT, spacing: 4.2, wMax: 1.3, outlineW: 2.2, g: 'b', seed: 12 });
    const anat = engraveShape(coast([[1080, 330], [1780, 296], [1780, 900], [1160, 924], [1060, 800], [1100, 680], [1030, 600], [1070, 500], [1030, 420]], 7), { ink, light: LIGHT, spacing: 7, style: 'hatch', angle: -0.5, wMax: 1.2, outlineW: 2, g: 'c', seed: 13, base: 0.22 });
    const islands = [[796, 560, 26, 17], [880, 470, 20, 13], [958, 520, 18, 12]].map(([x, y, rx, ry], i) => engraveShape(B.ellipse(x, y, rx, ry, 0.2), { ink, light: LIGHT, spacing: 3, wMax: 1.1, outlineW: 1.9, g: 'i' + i, seed: 14 + i }).shape);
    const isl = islands[0];
    const city = engraveShape(B.ellipse(944, 382, 30, 22), { ink, light: LIGHT, spacing: 3, wMax: 1.3, outlineW: 2.6, g: 'e', seed: 15 });
    wavelets(ink, R, [700, 420, 1050, 880], 34, [[720, 800, 460, 600], [840, 1000, 440, 560]]);
    sched(ink); const fr = frameInk();
    const wash = new Wash({ scale: 1.5 });
    for (const [s, o, t0, a] of [[city.shape, [944, 382], 3.0, 0.9], [morea.shape, [550, 780], 3.2, 0.75], ...islands.map((sh, i) => [sh, [sh.bbox[0] + 20, sh.bbox[1] + 12], 3.4 + i * 0.1, 0.75])]) wash.add({ path: s.path, polys: s.polys, color: SIGNAL, origin: o, t0, dur: 1.2, alpha: a, seed: 5, spill: 2, lift: 0.4 });
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); wash.draw(ctx, lt); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'THE ROMANS, 1450.', 'one city, a few islands, and the Morea');
      label(ctx, lt, 2.6, 'OTTOMAN LANDS', 460, 330); label(ctx, lt, 2.7, 'OTTOMAN LANDS', 1420, 380); label(ctx, lt, 2.8, 'THE AEGEAN', 860, 700, { size: 15, weight: 600, track: 0.2 });
      label(ctx, lt, 3.2, 'CONSTANTINOPLE', 944, 410, { size: 15 }); label(ctx, lt, 3.4, 'THE MOREA · MYSTRAS', 400, 870, { size: 15 }); note(ctx, lt, 3.6, 'a few islands', 1000, 600, { size: 21 });
      note(ctx, lt, 3.8, 'schematic outline — not to scale', 1500, 980, { size: 18 });
    };
    return { draw };
  });

  // =============================================================== 6 · the land walls in section (P1-29..36)
  add('P1-29 · the walls', () => {
    const ink = new B.Ink(), GY = 720, PX = 5;
    ink.group('ground'); B.stroke(ink, [[130, GY], [240, GY]], 1.4); B.stroke(ink, [[540, GY], [1780, GY]], 1.4);
    engraveShape(`M240 ${GY} L300 ${GY + 100} L480 ${GY + 100} L540 ${GY} Z`, { ink, light: LIGHT, spacing: 4, wMax: 1.2, outlineW: 1.8, g: 'a', seed: 51 });
    let m = ''; for (let x = 590; x < 668; x += 22) m += rectD(x, GY - 25 * PX - 14, 12, 14);
    engraveShape(rectD(590, GY - 25 * PX, 78, 25 * PX) + m, { ink, light: LIGHT, spacing: 3.6, wMax: 1.3, outlineW: 1.9, g: 'b', seed: 52 });
    let m2 = ''; for (let x = 790; x < 900; x += 24) m2 += rectD(x, GY - 40 * PX - 16, 14, 16);
    engraveShape(rectD(790, GY - 40 * PX, 110, 40 * PX) + m2, { ink, light: LIGHT, spacing: 3.6, wMax: 1.3, outlineW: 1.9, g: 'c', seed: 53 });
    let m3 = ''; for (let x = 816; x < 940; x += 24) m3 += rectD(x, GY - 60 * PX - 16, 14, 16);
    engraveShape(rectD(816, GY - 60 * PX, 128, 60 * PX) + m3, { ink, light: LIGHT, spacing: 3.4, wMax: 1.4, outlineW: 2.1, g: 'd', seed: 54 });
    ink.group('slits'); for (const [x, y] of [[860, GY - 270], [900, GY - 200]]) B.stroke(ink, [[x, y], [x, y + 36]], 2.4);
    let hs = ''; for (let i = 0; i < 9; i++) hs += rectD(1020 + i * 80, GY - 36 - (i % 3) * 10, 54, 36 + (i % 3) * 10);
    engraveShape(hs, { ink, light: LIGHT, spacing: 3, wMax: 1, outlineW: 1.4, g: 'e', seed: 55 });
    ink.group('men'); for (const x of [190, 240]) { B.stroke(ink, [[x, GY - 6], [x, GY - 34]], 1.6); B.stroke(ink, [[x, GY - 34], [x - 10, GY - 6]], 1.3); B.stroke(ink, [[x, GY - 34], [x + 10, GY - 6]], 1.3); B.stroke(ink, [[x, GY - 28], [x + 14, GY - 38]], 1.2); ink.dot(x, GY - 42, 6); }
    ink.group('arrows'); for (const dy of [0, 26, 52]) B.stroke(ink, [[870, GY - 150 + dy], [330, GY - 60 + dy * 0.4]], 0.9);
    ink.group('dims');
    B.stroke(ink, [[240, GY + 150], [540, GY + 150]], 1.0); B.stroke(ink, [[240, GY + 140], [240, GY + 160]], 1.0); B.stroke(ink, [[540, GY + 140], [540, GY + 160]], 1.0);
    B.stroke(ink, [[570, GY - 125], [570, GY]], 1.0); B.stroke(ink, [[560, GY - 125], [580, GY - 125]], 1.0);
    B.stroke(ink, [[1000, GY - 200], [1000, GY]], 1.0); B.stroke(ink, [[990, GY - 200], [1010, GY - 200]], 1.0);
    B.stroke(ink, [[970, GY - 300], [970, GY]], 1.0); B.stroke(ink, [[960, GY - 300], [980, GY - 300]], 1.0);
    sched(ink); const fr = frameInk();
    const wash = new Wash({ scale: 1.5 });
    const dipShape = B.shape(`M1180 ${GY + 4} C1280 ${GY + 70} 1420 ${GY + 70} 1520 ${GY + 4} Z`);
    wash.add({ path: dipShape.path, polys: dipShape.polys, color: SIGNAL, origin: [1350, GY + 30], t0: 3.2, dur: 1.4, alpha: 0.78, seed: 6, spill: 2.5, lift: 0.5 });
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); wash.draw(ctx, lt); ink.draw(ctx, lt); fr.draw(ctx, lt);
      ctx.save(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(1180, GY); ctx.bezierCurveTo(1280, GY + 70, 1420, GY + 70, 1520, GY); ctx.stroke(); ctx.restore();
      title(ctx, lt, 'THE LAND WALLS.', 'muri terrestres');
      label(ctx, lt, 2.6, 'FIG. 1  ·  SECTION', 960, 238);
      label(ctx, lt, 2.7, 'THE DITCH', 390, GY + 196); label(ctx, lt, 2.8, 'CA. 60 FT', 390, GY + 226, { size: 15, weight: 600 });
      label(ctx, lt, 2.9, 'OUTER WALL', 630, GY - 190); label(ctx, lt, 3.0, 'CA. 25 FT', 630, GY - 166, { size: 15, weight: 600 });
      label(ctx, lt, 3.1, 'INNER WALL', 1070, GY - 226); label(ctx, lt, 3.2, '40 FT +', 1070, GY - 202, { size: 15, weight: 600 });
      label(ctx, lt, 3.3, 'TOWERS', 1030, GY - 340); label(ctx, lt, 3.4, 'CA. 60 FT', 1030, GY - 316, { size: 15, weight: 600 });
      label(ctx, lt, 3.6, 'MESOTEICHION', 1350, GY + 110); note(ctx, lt, 3.8, 'the middle wall · the Lycus valley', 1350, GY + 146, { size: 22 });
    };
    return { draw };
  });

  // =============================================================== 7 · the boy sultan on the light table (P1-45)
  add('P1-45 · Mehmed (m1)', () => ({
    draw: (ctx, lt) => lightTable(ctx, 'm1', lt, { ox: 600, oy: 520, oh: 880, anchor: [0.5, 0.3], labelTop: 'SULTAN MEHMED II', reading: 'Portrait attributed to Gentile Bellini, Venice, c. 1480 — painted twenty-seven years after the siege.', source: 'Wikimedia Commons · public domain · attribution to be verified' }),
  }));

  // =============================================================== 8 · the Cutter of the Strait (P1-59..64)
  add('P1-59 · Boghaz-kesen', () => {
    const ink = new B.Ink(), R = B.RNG(61), CY = 540;
    const gap = x => 210 + 240 * (1 - Math.exp(-(((x - 930) / 430) ** 2)));
    const yT = x => CY - gap(x) / 2 + (B.noise1(x / 60, 3) - 0.5) * 16, yB = x => CY + gap(x) / 2 + (B.noise1(x / 60, 7) - 0.5) * 16;
    const XS = []; for (let x = 170; x <= 1750; x += 20) XS.push(x);
    const topPts = [...XS.map(x => [x, yT(x)]), ...[...XS].reverse().map(x => [x, 262 + (B.noise1(x / 90, 11) - 0.5) * 30])];
    const botPts = [...XS.map(x => [x, yB(x)]), ...[...XS].reverse().map(x => [x, 928 + (B.noise1(x / 90, 13) - 0.5) * 24])];
    engraveShape(B.ring(topPts), { ink, light: LIGHT, spacing: 6.5, style: 'hatch', angle: -0.5, wMax: 1.2, outlineW: 2.2, g: 'a', seed: 61, base: 0.15 });
    engraveShape(B.ring(botPts), { ink, light: LIGHT, spacing: 6.5, style: 'hatch', angle: -0.5, wMax: 1.2, outlineW: 2.2, g: 'b', seed: 62, base: 0.15 });
    const fort = engraveShape('M850 428 L872 338 L960 306 L1046 348 L1020 430 Z', { ink, light: LIGHT, spacing: 3.2, wMax: 1.2, outlineW: 2, g: 'c', seed: 63 });
    let tw = ''; for (const [x, y, r] of [[872, 338, 22], [960, 306, 28], [1046, 348, 22], [850, 428, 20], [1020, 430, 20]]) tw += `M${x - r} ${y + r} h${2 * r} v${-2 * r - 14} h${-2 * r} Z `;
    const towers = engraveShape(tw, { ink, light: LIGHT, spacing: 3, wMax: 1.2, outlineW: 1.8, g: 'd', seed: 64 });
    engraveShape('M880 660 h26 v-34 h-26 Z M930 668 h30 v-42 h-30 Z M984 660 h26 v-34 h-26 Z M880 660 H1010 V676 H880 Z', { ink, light: LIGHT, spacing: 3, wMax: 1, outlineW: 1.5, g: 'e', seed: 65 });
    wavelets(ink, R, [180, 400, 1740, 780], 80, [[300, 440, 380, 520], [330, 440, 590, 650], [480, 690, 520, 580], [1000, 1130, 515, 565], [1210, 1500, 440, 530], [860, 1020, 330, 730], [1090, 1560, 640, 700]]);
    ink.group('dim'); B.stroke(ink, [[930, 440], [930, 626]], 1.1); B.stroke(ink, [[918, 440], [942, 440]], 1.1); B.stroke(ink, [[918, 626], [942, 626]], 1.1);
    ship(ink, 360, 560, 0.34, 'sh', 91);          // a ship in the strait, small, for scale
    sched(ink); const fr = frameInk();
    const wash = new Wash({ scale: 1.5 });
    wash.add({ path: towers.shape.path, polys: towers.shape.polys, color: SIGNAL, origin: [950, 330], t0: 3.2, dur: 1.4, alpha: 0.5, seed: 9, spill: 2, lift: 0.4 });
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); wash.draw(ctx, lt); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'BOGHAZ-KESEN.', 'the Cutter of the Strait — or, depending on the translation, the Cutter of the Throat');
      label(ctx, lt, 2.6, 'EUROPE', 360, 420, { align: 'left' }); label(ctx, lt, 2.7, 'ASIA', 360, 690, { align: 'left' }); note(ctx, lt, 2.9, 'the Bosphorus', 560, 548, { size: 26 });
      label(ctx, lt, 3.0, 'CA. 660 M', 960, 540, { size: 16, align: 'left' }); label(ctx, lt, 3.2, 'RUMELI HISAR', 1240, 470, { align: 'left' }); note(ctx, lt, 3.4, 'finished 31 August 1452', 1240, 506, { size: 22, align: 'left' });
      label(ctx, lt, 3.5, 'ANADOLU HISAR · THE OLDER FORT', 1040, 610, { size: 14, weight: 600, align: 'left' });
    };
    return { draw };
  });

  // =============================================================== 9 · a Venetian ship ignores the signal (P1-65)
  add('P1-65 · November 1452', () => {
    const ink = new B.Ink(), R = B.RNG(71);
    ship(ink, 780, 700, 2.0, 'v', 73, -0.09);
    engraveShape('M1380 330 h170 v420 h-170 Z M1360 330 h210 v-34 h-210 Z', { ink, light: LIGHT, spacing: 4.2, wMax: 1.4, outlineW: 2.2, g: 'f', seed: 81 });
    let m = ''; for (let x = 1362; x < 1566; x += 36) m += rectD(x, 270, 20, 28);
    engraveShape(m, { ink, light: LIGHT, spacing: 3, wMax: 1, outlineW: 1.6, g: 'g', seed: 82 });
    engraveShape('M1380 430 L1260 446 L1252 470 L1380 482 Z', { ink, light: LIGHT, spacing: 3, wMax: 1.2, outlineW: 1.8, g: 'h', seed: 83 });   // the gun, muzzle to the left
    ink.group('shot'); for (let k = 0; k < 12; k++) { const u = k / 12, x = lerp(1236, 1020, u), y = 458 + (u - 0.2) * 120 * u * 2 + 30 * u; B.stroke(ink, [[x, y], [x - 8, y + 2]], 2.2); }
    ink.group('smoke'); for (const [x, y, r] of [[1220, 452, 26], [1176, 438, 34], [1124, 430, 42], [1060, 424, 50]]) { const e = B.ellipsePts(x, y, r, r * 0.8, 0, 28); B.stroke(ink, [...e, e[0]], 1.2); B.stroke(ink, e.slice(2, 16), 0.8); }
    wavelets(ink, R, [150, 800, 1340, 960], 90, [[460, 1120, 360, 900], [600, 820, 880, 925], [700, 1260, 960, 1010], [1160, 1360, 520, 640]]);
    ink.group('shore'); B.stroke(ink, [[1340, 760], [1790, 760]], 1.4);
    sched(ink); const fr = frameInk();
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'NOVEMBER 1452.', 'a Venetian ship ignores the signal to stop');
      label(ctx, lt, 2.6, 'A VENETIAN SHIP', 700, 905, { size: 15 }); label(ctx, lt, 2.8, 'THE NEW FORTRESS', 1560, 820, { size: 15 }); note(ctx, lt, 3.2, 'the guns of the new fortress', 1250, 620, { size: 22 });
    };
    return { draw };
  });

  // =============================================================== 10 · the great gun on the road (P1-76..78)
  add('P1-77 · the great gun', () => {
    const ink = new B.Ink(), R = B.RNG(75), GR = 790;
    // far hills and, at the right edge, the walls of the city on the horizon
    ink.group('hills'); for (const [y0, amp, ph] of [[400, 18, 0], [440, 14, 2], [478, 10, 5]]) { const pts = []; for (let x = 130; x <= 1780; x += 16) pts.push([x, y0 + Math.sin(x / 150 + ph) * amp + (B.noise1(x / 80, ph) - 0.5) * 8]); B.stroke(ink, pts, 1.2); }
    let tw = ''; for (let i = 0; i < 6; i++) tw += rectD(1560 + i * 38, 372 - (i % 2) * 10, 22, 44 + (i % 2) * 10);
    engraveShape(tw + rectD(1550, 414, 240, 38), { ink, light: LIGHT, spacing: 3, wMax: 1, outlineW: 1.5, g: 'z', seed: 70 });
    // cart + gun
    engraveShape('M1020 560 L1300 540 L1300 622 L1020 630 Z M1010 548 L1030 548 L1030 640 L1010 640 Z M1080 556 h14 v78 h-14 Z M1170 548 h14 v82 h-14 Z M1250 542 h14 v86 h-14 Z', { ink, light: LIGHT, spacing: 4, wMax: 1.4, outlineW: 1.9, g: 'a', seed: 71 });
    engraveShape('M980 650 L1330 636 L1380 700 L940 708 Z', { ink, light: LIGHT, spacing: 4.2, wMax: 1.3, outlineW: 1.9, g: 'b', seed: 72 });
    for (const [x, y, r, s] of [[1050, 712, 70, 73], [1290, 712, 70, 74]]) { engraveShape(B.ellipse(x, y, r, r), { ink, light: LIGHT, spacing: 4, wMax: 1.3, outlineW: 2, g: 'w' + s, seed: s }); ink.group('sp' + s); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; B.stroke(ink, [[x, y], [x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4)]], 1.4); } }
    // an ox, side view, facing right, head lowered into the yoke
    // one ox, side view, facing right: long back with a hump, legs drawn as tapered solids (thigh + shin + hoof), a big head with horns
    const ox = (x, y, s, g, seed) => {
      const at = B.xf(x, y, s);
      const leg = (lx, bend) => `M${lx - 11} 20 C${lx - 10 + bend} 50 ${lx - 7 + bend} 70 ${lx - 7} 96 L${lx - 12} 104 L${lx + 9} 104 L${lx + 6} 96 C${lx + 6 + bend} 70 ${lx + 11 + bend} 50 ${lx + 12} 20 Z`;
      engraveShape('M-112 -8 C-104 -40 -50 -48 -8 -44 C16 -62 56 -66 80 -46 C98 -36 112 -30 116 -12 C118 6 108 24 92 30 L-80 32 C-104 30 -116 14 -112 -8 Z', { ink, at, light: LIGHT, spacing: 3.2, wMax: 1.3, outlineW: 2.2, g: g + 'b', seed });
      engraveShape(leg(-86, 8) + leg(-52, -2) + leg(52, 2) + leg(88, -6), { ink, at, light: LIGHT, spacing: 2.6, wMax: 1.2, outlineW: 1.9, g: g + 'l', seed: seed + 2 });
      engraveShape('M104 -40 C136 -52 172 -40 188 -10 L194 18 C184 38 158 38 142 30 C122 22 106 4 100 -14 Z', { ink, at, light: LIGHT, spacing: 2.6, wMax: 1.2, outlineW: 2, g: g + 'h', seed: seed + 1 });
      ink.group(g + 'k'); const P = (px, py) => at([px, py]);
      B.stroke(ink, [P(136, -44), P(150, -78), P(184, -80), P(204, -104)], 3 * s + 0.6); B.stroke(ink, [P(122, -44), P(112, -72), P(124, -86)], 2.6 * s + 0.4);
      ink.dot(...P(160, -12), 3.4 * s); B.stroke(ink, [P(-112, -4), P(-134, 30), P(-130, 84)], 2 * s + 0.4); B.stroke(ink, [P(60, -64), P(112, -22)], 5 * s); B.stroke(ink, [P(54, -66), P(104, -18)], 1.6);
    };
    for (const px of [240, 515, 790]) ox(px, 696, 0.88, 'p' + px, px);
    ink.group('beam'); B.stroke(ink, [[310, 624], [1000, 640]], 2.8); B.stroke(ink, [[310, 636], [1000, 652]], 1.2);
    ink.group('ground'); B.stroke(ink, [[130, GR], [1780, GR]], 1.2);
    const man = (x, y, k, pick) => { B.stroke(ink, [[x, y], [x, y - 38 * k]], 1.6); B.stroke(ink, [[x, y - 38 * k], [x - 10 * k, y]], 1.3); B.stroke(ink, [[x, y - 38 * k], [x + 10 * k, y]], 1.3); B.stroke(ink, [[x, y - 30 * k], [x + 12 * k, y - 12 * k]], 1.2); ink.dot(x, y - 46 * k, 6.5 * k); if (pick) B.stroke(ink, [[x + 4 * k, y - 40 * k], [x + 26 * k, y - 62 * k]], 1.3); };
    ink.group('men'); for (let i = 0; i < 9; i++) man(1000 + i * 52, GR + 76, 1.1, false); for (let i = 0; i < 7; i++) man(1430 + i * 46, GR, 1.0, true);
    sched(ink); const fr = frameInk();
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'THE GREAT GUN.', 'hauled toward the city, that winter');
      label(ctx, lt, 2.6, '60 OXEN', 500, 900); label(ctx, lt, 2.8, '200 MEN BESIDE IT', 1180, 940); label(ctx, lt, 3.0, '200 LABOURERS AHEAD', 1620, 870);
      label(ctx, lt, 3.2, 'THE CITY', 1670, 350, { size: 15, weight: 600 }); note(ctx, lt, 3.4, 'by the end of March, within five miles of the walls', 960, 990, { size: 23 });
    };
    return { draw };
  });

  // =============================================================== 11 · the count (P1-83..86)
  add('P1-83 · the count', () => {
    const ink = new B.Ink(); const X0 = 300, U = 1 / 55;
    const bar = (x, y, n, g, seed, ang) => engraveShape(rectD(x, y, n * U, 52), { ink, light: LIGHT, spacing: 3.2, wMax: 1.3, outlineW: 1.9, style: 'hatch', angle: ang, g, seed });
    bar(X0, 330, 4983, 'a', 91, -0.6); bar(X0 + 4983 * U + 4, 330, 2000, 'b', 92, 0.9);
    bar(X0, 590, 80000, 'c', 93, -0.6);
    ink.group('brackets'); B.stroke(ink, [[X0, 400], [X0, 416], [X0 + 6983 * U + 4, 416], [X0 + 6983 * U + 4, 400]], 1.1);
    B.stroke(ink, [[X0, 660], [X0, 676], [X0 + 80000 * U, 676], [X0 + 80000 * U, 660]], 1.1);
    // the walls, fourteen miles, with the defenders spread along them
    ink.group('wallline'); B.stroke(ink, [[X0, 850], [X0 + 80000 * U, 850]], 2.4); B.stroke(ink, [[X0, 862], [X0 + 80000 * U, 862]], 1.1);
    for (let i = 0; i <= 40; i++) { const x = X0 + i * (80000 * U) / 40; B.stroke(ink, [[x, 850], [x, 826]], 1.6); ink.dot(x, 818, 5.5); }
    sched(ink); const fr = frameInk();
    const draw = (ctx, lt) => {
      drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt);
      title(ctx, lt, 'THE COUNT.', 'a census the emperor wanted kept quiet');
      label(ctx, lt, 2.6, 'GREEK MEN FIT TO FIGHT', X0, 262, { align: 'left', size: 15 });
      engraveText(ctx, '4,983', X0, 318, { size: 44, font: HEAD, weight: 700, p: seg(lt, 2.8, 3.4), align: 'left' });
      label(ctx, lt, 3.0, 'FOREIGNERS', X0 + 250, 262, { align: 'left', size: 15 });
      engraveText(ctx, '< 2,000', X0 + 250, 318, { size: 44, font: HEAD, weight: 700, p: seg(lt, 3.2, 3.8), align: 'left' });
      engraveText(ctx, 'UNDER 7,000', X0 + 3491 * U + 2, 462, { size: 34, font: HEAD, weight: 700, p: seg(lt, 3.4, 4.0) });
      label(ctx, lt, 3.5, 'THE SULTAN’S ARMY, PLUS IRREGULARS', X0, 530, { align: 'left', size: 15 });
      engraveText(ctx, '≈ 80,000', X0, 580, { size: 44, font: HEAD, weight: 700, p: seg(lt, 3.6, 4.2), align: 'left' });
      label(ctx, lt, 3.9, 'FOURTEEN MILES OF WALLS', X0, 900, { align: 'left', size: 15 }); note(ctx, lt, 4.1, 'spread evenly, about one man to every eleven feet — our arithmetic', X0 + 400, 940, { size: 23, align: 'left' });
    };
    return { draw };
  });

  // =============================================================== generic plates (typography, timelines, quotes, tallies…)
  const T0 = 0.5;                                                   // generic plates cut their title first
  const sheet = (ctx, ink, fr, lt) => { drawSheet(ctx, { W, H, plate: PLATE }); ink.draw(ctx, lt); fr.draw(ctx, lt); };
  const madderLine = (ctx, x0, y0, x1, y1, p) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = SIGNAL; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); ctx.stroke(); ctx.restore(); };
  // rows of engraved text, one under the other, separated by hairlines; some rows struck through in madder
  function mkTypo({ title: T, sub, rows = [], strike = [], top = 330 }) {
    const ink = new B.Ink(), step = rows.length > 3 ? 112 : rows.length > 2 ? 130 : 160;
    ink.group('rules'); rows.forEach((r, i) => B.stroke(ink, [[560, top + i * step + 56], [1360, top + i * step + 56]], 0.9));
    sched(ink, null, 0.6, 3.0, 20); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      rows.forEach((r, i) => {
        const y = top + i * step, t0 = 1.6 + i * 0.6, kind = r.kind || 'big';
        const o = kind === 'big' ? { size: r.size || 54, font: HEAD, weight: 700, track: 0.06 } : kind === 'note' ? { size: r.size || 32, font: HEAD, italic: true, weight: 400 } : { size: r.size || 20, font: LABEL, weight: 700, track: 0.16 };
        engraveText(ctx, r.text, 960, y + 30, { ...o, p: seg(lt, t0, t0 + 0.9) });
        if (strike.includes(i)) madderLine(ctx, 960 - (r.w || 240), y + 14, 960 + (r.w || 240), y + 14, seg(lt, t0 + 1.4, t0 + 1.9));
      });
    };
    return { draw };
  }
  // a dated axis: events sit on a line, labels above/below alternately
  function mkTimeline({ title: T, sub, events = [], x0 = 300, x1 = 1620, y = 560 }) {
    const ink = new B.Ink(); ink.group('axis'); B.stroke(ink, [[x0 - 40, y], [x1 + 40, y]], 1.6);
    events.forEach(e => { const x = lerp(x0, x1, e.f); B.stroke(ink, [[x, y - 14], [x, y + 14]], 2); ink.dot(x, y, 5); });
    sched(ink, null, 0.6, 3.0, 8); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      events.forEach((e, i) => {
        const x = lerp(x0, x1, e.f), up = i % 2 === 0, t0 = 1.6 + i * 0.9, yy = up ? y - 70 : y + 90;
        engraveText(ctx, e.a, x, yy, { size: 48, font: HEAD, weight: 700, p: seg(lt, t0, t0 + 0.9) });
        if (e.b) engraveText(ctx, e.b, x, yy + (up ? 38 : 40), { size: 26, font: HEAD, italic: true, weight: 400, p: seg(lt, t0 + 0.5, t0 + 1.3) });
        if (e.c) label(ctx, lt, t0 + 0.7, e.c, x, yy + (up ? 74 : 80), { size: 16 });
      });
    };
    return { draw };
  }
  function mkQuote({ title: T, sub, quote, who }) {
    const ink = new B.Ink(); ink.group('rule'); B.outline(ink, rectPts(330, 300, 1590, 760), { w: 1.4, step: 4 }); B.outline(ink, rectPts(342, 312, 1578, 748), { w: 0.7, step: 4 });
    sched(ink, null, 0.6, 2.6, 10); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      const lines = wrapLines(ctx, quote, 1060, { size: 38, font: NOTEF, italic: true }); const np = seg(lt, 1.4, 1.4 + 0.9 * lines.length);
      lines.forEach((ln, q) => engraveText(ctx, ln, 960, 470 + q * 56, { size: 38, font: NOTEF, italic: true, weight: 400, p: clamp(np * lines.length - q) }));
      label(ctx, lt, 1.8 + lines.length * 0.8, who, 960, 700, { size: 17 });
    };
    return { draw };
  }
  // n burin strokes in a row (a tally); optional strike-through in madder
  function mkTally({ title: T, sub, n = 7, big, foot, strikeAt = null }) {
    const ink = new B.Ink(); const x0 = 960 - (n - 1) * 36;
    ink.group('tally'); for (let i = 0; i < n; i++) B.stroke(ink, [[x0 + i * 72, 380], [x0 + i * 72 + 4, 600]], 4.2, { taper: 8 });
    sched(ink, null, 0.8, 0.8 + n * 0.45, 3); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      if (big) engraveText(ctx, big, 960, 720, { size: 56, font: HEAD, weight: 700, track: 0.06, p: seg(lt, 0.8 + n * 0.45, 0.8 + n * 0.45 + 0.9) });
      if (foot) note(ctx, lt, 1.2 + n * 0.5, foot, 960, 800, { size: 28 });
      if (strikeAt != null) madderLine(ctx, x0 - 40, 500, x0 + (n - 1) * 72 + 40, 480, seg(lt, strikeAt, strikeAt + 1.2));
    };
    return { draw };
  }
  function mkStones({ title: T, sub, stones = [], foot }) {
    const ink = new B.Ink(), xs = stones.map((s, i) => 960 + (i - (stones.length - 1) / 2) * 420);
    stones.forEach((s, i) => engraveShape(B.ellipse(xs[i], 520, s.r, s.r), { ink, light: LIGHT, spacing: 4.4, wMax: 1.4, outlineW: 2.2, g: 's' + i, seed: 30 + i }));
    sched(ink, null, 0.6, 3.2, 40); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      stones.forEach((s, i) => { const t0 = 1.8 + i * 0.5; label(ctx, lt, t0, s.label, xs[i], 520 + s.r + 56, { size: 22 }); if (s.src) note(ctx, lt, t0 + 0.2, s.src, xs[i], 520 + s.r + 92, { size: 22 }); });
      if (foot) note(ctx, lt, 3.6, foot, 960, 860, { size: 28 });
    };
    return { draw };
  }
  function mkSeals({ title: T, sub, seals = [] }) {
    const ink = new B.Ink(), xs = seals.map((s, i) => 960 + (i - (seals.length - 1) / 2) * 460);
    seals.forEach((s, i) => { ink.group('r' + i); B.outline(ink, B.ellipsePts(xs[i], 520, 150, 150, 0, 60), { w: 2.2, step: 4 }); B.outline(ink, B.ellipsePts(xs[i], 520, 136, 136, 0, 60), { w: 0.9, step: 4 }); });
    sched(ink, null, 0.6, 2.6, 6); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      seals.forEach((s, i) => { const t0 = 1.4 + i * 0.7; engraveText(ctx, s.name, xs[i], 530, { size: s.size || 34, font: HEAD, weight: 700, track: 0.06, p: seg(lt, t0, t0 + 0.9) }); label(ctx, lt, t0 + 0.6, s.role, xs[i], 730, { size: 16 }); note(ctx, lt, t0 + 0.9, s.note, xs[i], 772, { size: 22 }); });
    };
    return { draw };
  }
  function mkBars({ title: T, sub, bars = [], unit = 55, x0 = 300, foot }) {
    const ink = new B.Ink();
    bars.forEach((b, i) => { engraveShape(rectD(x0, 380 + i * 200, b.n / unit, 52), { ink, light: LIGHT, spacing: 3.2, wMax: 1.3, outlineW: 1.9, g: 'b' + i, seed: 60 + i }); });
    sched(ink, null, 0.8, 3.0, 30); const fr = frameInk();
    const draw = (ctx, lt) => {
      sheet(ctx, ink, fr, lt); title(ctx, lt, T, sub, T0);
      bars.forEach((b, i) => { const t0 = 1.4 + i * 0.8; label(ctx, lt, t0, b.label, x0, 350 + i * 200, { align: 'left', size: 16 }); engraveText(ctx, b.big, x0 + b.n / unit + 24, 424 + i * 200, { size: 44, font: HEAD, weight: 700, align: 'left', p: seg(lt, t0 + 0.8, t0 + 1.6) }); });
      if (foot) note(ctx, lt, 3.4, foot, 960, 860, { size: 28 });
    };
    return { draw };
  }
  const mkLT = o => ({ full: true, draw: (ctx, lt) => lightTable(ctx, o.code, lt, o) });

  // ------------------------------------------------------------------ the timeline of the Part: plan (what picture) x timing (when, from the voice)
  const KEYS = ['city', 'suspects', 'loupe_s1', 'hagia', 'empire', 'walls', 'mehmed', 'strait', 'ship', 'gun', 'count'];
  const REG = {}; scenes.forEach((s, i) => { REG[KEYS[i]] = s; });
  const GEN = { typo: mkTypo, timeline: mkTimeline, quote: mkQuote, tally: mkTally, stones: mkStones, seals: mkSeals, bars: mkBars, lt: mkLT };
  const cache = {};
  const sceneFor = e => { if (REG[e.scene]) return REG[e.scene]; const k = e.scene + JSON.stringify(e.p || {}); return cache[k] || (cache[k] = GEN[e.scene](e.p || {})); };
  let entries = [], DUR = scenes.length * SCENE_LEN;
  const SB = scenes.map((s, i) => i * SCENE_LEN + 5.2);
  if (plan && timing) {
    const LM = {}; timing.lines.forEach(l => { LM[l.id] = l; });
    DUR = timing.lines[timing.lines.length - 1].t1 + 2.4;
    entries = plan.map((e, i) => ({ ...e, sc: sceneFor(e), t0: i === 0 ? 0 : Math.max(0, LM[e.line].sentences[e.s[0]].t0 - 0.12) }));
    entries.forEach((e, i) => { e.t1 = i + 1 < entries.length ? entries[i + 1].t0 : DUR; });
  }
  const FULLSCALE = 0.93;                                           // engraved plates sit a little smaller so the subtitle strip lives in the paper margin
  const eio = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  function drawEntry(ctx, e, t) {
    const lt = t - e.t0, o = e.o || {}, tt = o.settled ? lt + 10 : lt, oo = { ...o };
    if (o.ticksAt != null) oo.ticks = lt - o.ticksAt;
    if (o.note) oo.noteT = lt;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!e.sc.full) {
      const u = clamp(lt / Math.max(8, e.t1 - e.t0)), cam = o.cam;
      ctx.translate(960, 60); ctx.scale(FULLSCALE, FULLSCALE); ctx.translate(-960, -60);
      if (cam) { const z = lerp(cam.z0, cam.z1 ?? cam.z0 * 1.06, u); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-cam.cx, -cam.cy); }   // a push-in on part of the plate
      else { const z = 1 + 0.025 * u; ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540); }
    }
    e.sc.draw(ctx, tt, oo); ctx.restore();
  }
  const TRANS = 1.0;
  function renderEntries(ctx, t) {
    let i = entries.findIndex(e => t >= e.t0 && t < e.t1); if (i < 0) i = entries.length - 1;
    const e = entries[i], prev = entries[i - 1], u = e.trans && prev ? clamp((t - e.t0) / TRANS) : 1;
    if (u >= 1 || !prev) { drawEntry(ctx, e, t); return; }
    if (e.trans === 'turn') {
      drawEntry(ctx, e, t);
      const k = eio(u); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(0, -H * k);
      ctx.shadowColor = 'rgba(40,30,20,0.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, W, H); ctx.shadowColor = 'transparent';
      drawEntry(ctx, prev, t); ctx.restore();
    } else if (e.trans === 'iris') {
      drawEntry(ctx, prev, t); const r = lerp(40, 1250, eio(u));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.clip(); drawEntry(ctx, e, t); ctx.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); roundelFrame(ctx, W / 2, H / 2, r, { p: 1, w: 3.0 }); ctx.restore();
    } else if (e.trans === 'irisout') {
      drawEntry(ctx, e, t); const r = lerp(1250, 40, eio(u));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.clip(); drawEntry(ctx, prev, t); ctx.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); roundelFrame(ctx, W / 2, H / 2, r, { p: 1, w: 3.0 }); ctx.restore();
    } else drawEntry(ctx, e, t);
  }

  // ------------------------------------------------------------------ subtitles: Lora 600 ~35 px on a deckled paper slip; text and slip are ONE layer, ONE alpha (knowledge/11)
  const subs = timing ? timing.subs : [];
  let _subLayer = null; const subLayer = (w, h) => { if (!_subLayer) _subLayer = document.createElement('canvas'); if (_subLayer.width !== w) _subLayer.width = w; if (_subLayer.height !== h) _subLayer.height = h; return _subLayer; };
  function drawSubs(ctx, t) {
    const i = subs.findIndex((x, k) => t >= x.t0 && t < Math.min(x.t1 + 0.6, subs[k + 1] ? subs[k + 1].t0 - 0.05 : 1e9)); if (i < 0) return;
    const sb = subs[i], end = Math.min(sb.t1 + 0.6, subs[i + 1] ? subs[i + 1].t0 - 0.05 : 1e9);
    const a = Math.min(seg(t, sb.t0, sb.t0 + 0.25), 1 - seg(t, end - 0.2, end));
    const size = 35, lines = wrapLines(ctx, sb.text, 900, { size, font: NOTEF, weight: 600 });
    const lh = size * 1.3, hgt = lines.length * lh + 26, wid = Math.max(...lines.map(l => measure(ctx, l, { size, font: NOTEF, weight: 600 }).tw)) + 80;
    const y1 = 1064, y0 = y1 - hgt, x0 = 960 - wid / 2, PAD = 40, cw = Math.ceil(wid + 2 * PAD), ch = Math.ceil(hgt + 2 * PAD);
    const lay = subLayer(cw, ch), lc = lay.getContext('2d');
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, cw, ch); lc.globalAlpha = 1;
    lc.shadowColor = 'rgba(60,40,20,0.28)'; lc.shadowBlur = 14; lc.shadowOffsetY = 4; lc.fillStyle = '#f7f1e0'; lc.beginPath();
    const RR2 = B.RNG(7), X0 = PAD, Y0 = PAD, X1 = PAD + wid, Y1 = PAD + hgt;
    lc.moveTo(X0, Y0); for (let x = X0; x <= X1; x += 14) lc.lineTo(x, Y0 + (RR2() - 0.5) * 2.2); for (let y = Y0; y <= Y1; y += 12) lc.lineTo(X1 + (RR2() - 0.5) * 2, y); for (let x = X1; x >= X0; x -= 14) lc.lineTo(x, Y1 + (RR2() - 0.5) * 2.2); for (let y = Y1; y >= Y0; y -= 12) lc.lineTo(X0 + (RR2() - 0.5) * 2, y); lc.closePath(); lc.fill();
    lc.shadowColor = 'transparent';
    lines.forEach((ln, q) => engraveText(lc, ln, PAD + wid / 2, Y0 + 14 + lh * (q + 0.78), { size, font: NOTEF, weight: 600, p: 1 }));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(lay, x0 - PAD, y0 - PAD); ctx.restore();
  }

  function render(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    if (entries.length) renderEntries(ctx, t);
    else { const i = Math.min(scenes.length - 1, Math.max(0, Math.floor(t / SCENE_LEN))); scenes[i].draw(ctx, t - i * SCENE_LEN, {}); }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.55, W / 2, H / 2, H * 1.15); vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(120,86,46,0.2)');
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
    if (!(typeof location !== 'undefined' && location.search.includes('nosub'))) drawSubs(ctx, t);
  }
  return { render, DUR, SB, EV: [], subs, entries };
}
