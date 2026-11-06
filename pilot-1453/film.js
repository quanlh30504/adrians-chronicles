// Adrian's Chronicles — Pilot "The Last Spring" (1453). Engraving (main) + Archive Light Table (evidence), joined by the loupe iris.
// Built on the Copperplate Engraving engine (copied into ./engine). Voice: Kokoro bm_george; times from out/voice/words.json (V0 = voice start).
import * as B from './engine/burin.js';
import { engraveShape } from './engine/index.js';
import { drawSheet, paperTexture, borderInk, engraveText, writeScript, wrapLines, roundelFrame, PAL, FONTS, measure } from './engine/plate.js';
import { Wash } from './engine/wash.js';
import { clamp, eio, eo, ss } from '/core/lib.js';

export const W = 1920, H = 1080;
const PLATE = [70, 44, 1850, 1036], BORDER = [100, 72, 1820, 1008];
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const V0 = 3.0;                       // voice starts here
const HEAD = 'Playfair Display', LABEL = 'Source Sans 3', NOTEF = 'Lora';   // type system (Set 2): headings Playfair, small caps labels Source Sans 3, notes + subtitles Lora
const SIGNAL = '#a63a2a'; const SIGNAL_ON_DARK = '#ee9a86';             // madder: the channel's one signal colour (labels on the light table)

export function makeFilm({ img = null, meta = null } = {}) {
  // ------------------------------------------------------------------ timeline (film seconds)
  const T = {
    city: { ol: [-1.0, 5.2], h1: [2.6, 7.2], h2: [4.0, 8.4], h3: [5.0, 9.4] },
    sea: [4.5, 9.6], title: 5.2, latin: 5.9, labels: 7.4,
    houses: [6.2, 9.4], walls: [8.4, 10.4],
    r1: { ring: [11.0, 11.5], cont: [11.4, 13.3], travel: [12.0, 13.4], name: 13.4, latin: 13.7, note: 14.0 },
    camp: [17.6, 21.8], gun: [21.4, 23.4], gunLabel: 23.6,
    loupeIn: [25.7, 26.7], lt: [26.7, 31.0], loupeOut: [31.0, 32.0],
    wash: [33.2, 36.2], sign: 38.6, end: 42.2,
  };
  const DUR = T.end + 0.5;

  // ------------------------------------------------------------------ the plan of the city (all original drawing, world coordinates)
  const LIGHT = [-0.6, -0.7];
  const CITY = 'M600 330 C800 308 1000 328 1180 388 C1330 438 1450 452 1522 482 C1486 546 1380 604 1250 652 C1000 772 760 852 592 884 L560 860 C536 700 558 520 600 330 Z';
  const city = engraveShape(CITY, { light: LIGHT, spacing: 8.5, style: 'contour', wMax: 1.5, outlineW: 2.2, g: 'c', seed: 3, base: 0.0 });
  const ink = city.ink;
  const R = B.RNG(11);

  // land walls: a cubic along the west edge, towers every ~26 px (two rows) and the wall line itself
  const bez = (p0, p1, p2, p3, u) => { const a = 1 - u; return [a * a * a * p0[0] + 3 * a * a * u * p1[0] + 3 * a * u * u * p2[0] + u * u * u * p3[0], a * a * a * p0[1] + 3 * a * a * u * p1[1] + 3 * a * u * u * p2[1] + u * u * u * p3[1]]; };
  const WALL = [[560, 860], [536, 700], [558, 520], [600, 330]];
  const wallPts = []; for (let i = 0; i <= 60; i++) wallPts.push(bez(...WALL, i / 60));
  let towers = '';
  for (let i = 1; i < 30; i++) { const [x, y] = bez(...WALL, i / 30); towers += `M${x - 10} ${y - 11} h20 v22 h-20 Z `; }
  for (let i = 0; i < 30; i++) { const [x, y] = bez(...WALL, (i + 0.5) / 30); towers += `M${x - 27} ${y - 6} h11 v12 h-11 Z `; }
  const wallShape = engraveShape(towers, { ink, light: LIGHT, spacing: 2.6, wMax: 1.1, outlineW: 1.3, g: 'w', seed: 5 });
  ink.group('wall'); B.stroke(ink, wallPts, 2.8); B.stroke(ink, wallPts.map(([x, y]) => [x - 38, y]), 1.6);

  // houses and one great dome inside the walls
  let houses = '';
  for (let n = 0, k = 0; n < 900 && k < 72; n++) {
    const x = 640 + R() * 820, y = 340 + R() * 520, w = 12 + R() * 16, h = 10 + R() * 14;
    const ok = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].every(([a, b]) => B.inPoly(city.shape.polys, a, b));
    const nearDome = Math.hypot(x - 1330, y - 530) < 70;
    const nearEdge = [[x - 22, y], [x + w + 22, y], [x, y - 22], [x, y + h + 22]].some(([a, b]) => !B.inPoly(city.shape.polys, a, b));
    if (!ok || nearDome || nearEdge) continue;
    houses += `M${x} ${y} h${w} v${h} h${-w} Z `; k++;
  }
  engraveShape(houses, { ink, light: LIGHT, spacing: 2.7, wMax: 1.0, outlineW: 1.2, g: 'o', seed: 7 });
  const dome = engraveShape('M1298 548 C1296 506 1364 506 1362 548 Z M1290 548 H1370 V578 H1290 Z', { ink, light: LIGHT, spacing: 2.8, wMax: 1.2, outlineW: 1.5, g: 's', seed: 9 });

  // the besiegers' camp (outside the walls), the sultan's tent, one great gun
  let tents = '';
  for (let n = 0, k = 0; n < 600 && k < 26; n++) {
    const x = 150 + R() * 320, y = 560 + R() * 290, s = 0.9 + R() * 0.5;
    if (Math.hypot(x - 300, y - 650) < 70) continue;
    tents += `M${x - 15 * s} ${y + 10 * s} L${x} ${y - 14 * s} L${x + 15 * s} ${y + 10 * s} Z `; k++;
  }
  tents += 'M255 690 L300 595 L345 690 Z';
  engraveShape(tents, { ink, light: LIGHT, spacing: 3.0, wMax: 1.2, outlineW: 1.5, g: 'k', seed: 13 });
  ink.group('kpole'); B.stroke(ink, [[300, 595], [300, 560]], 1.4); B.stroke(ink, [[300, 560], [326, 568], [300, 576]], 1.1);
  const gun = engraveShape('M420 598 L492 580 L496 594 L424 612 Z M415 600 L424 614 L412 622 Z', { ink, light: LIGHT, spacing: 2.2, wMax: 1.2, outlineW: 1.6, g: 'n', seed: 15 });

  // sea marks in the open water (short wavelets), kept clear of the roundel and its label
  ink.group('sea');
  for (let n = 0, k = 0; n < 4000 && k < 95; n++) {
    const x = 640 + R() * 1160, y = 230 + R() * 760, L = 22 + R() * 26;
    if (B.inPoly(city.shape.polys, x, y) || B.inPoly(city.shape.polys, x + L, y)) continue;
    if (Math.hypot(x - 1330, y - 420) < 0) continue;
    if (y > 270 && y < 420 && x < 1000) continue;                       // keep the Golden Horn label clear
    if (y > 840 && y < 940 && x > 800 && x < 1200) continue;             // keep the Propontis label clear
    // outside the coast only: skip points that sit within 18 px of the shore on the city side
    let nearIn = false; for (const [dx, dy] of [[0, 16], [0, -16], [L, 16], [L, -16]]) if (B.inPoly(city.shape.polys, x + dx, y + dy)) nearIn = true;
    if (nearIn) continue;
    B.stroke(ink, [[x, y], [x + L * 0.33, y - 2.2], [x + L * 0.66, y + 1.6], [x + L, y - 1.0]], 0.9 + R() * 0.4); k++;
  }

  // roundel 1: the land walls, magnified (authored large, scaled in)
  const art = new B.Ink();
  {
    let wallArt = '';
    for (let x = -460; x <= 440; x += 64) wallArt += `M${x} -62 h40 v34 h-40 Z `;                 // merlons, inner wall
    wallArt += 'M-480 -28 H480 V226 H-480 Z ';                                                  // the inner wall
    for (const cx of [-340, 0, 340]) { for (let x = -76; x <= 52; x += 44) wallArt += `M${cx + x} -250 h30 v30 h-30 Z `; wallArt += `M${cx - 84} -220 h168 V226 h-168 Z `; }   // three towers with merlons
    for (let x = -460; x <= 440; x += 52) wallArt += `M${x} 250 h32 v26 h-32 Z `;               // outer wall merlons
    wallArt += 'M-480 276 H480 V372 H-480 Z ';                                                  // the outer wall
    engraveShape(wallArt, { ink: art, light: LIGHT, spacing: 12, wMax: 4.6, outlineW: 5, style: 'hatch', angle: -0.7, g: 'r', seed: 21 });
  }
  const FOCUS = { x: 590, y: 372, r: 64 }, SLOT = [290, 262], RR = 120;
  const a1 = T.r1;
  art.schedule('rol', a1.cont[0], a1.cont[0] + 0.5 * (a1.cont[1] - a1.cont[0]), { conc: 10 });
  art.schedule('rh1', a1.cont[0] + 0.25, a1.cont[1] - 0.3, { conc: 70 });
  art.schedule('rh2', a1.cont[0] + 0.5, a1.cont[1] - 0.1, { conc: 70 });
  art.schedule('rh3', a1.cont[0] + 0.7, a1.cont[1], { conc: 70 });
  art.build();

  // ------------------------------------------------------------------ ink schedule (cutting order is the animation)
  ink.schedule('col', ...T.city.ol, { conc: 2 });
  ink.schedule('ch1', ...T.city.h1, { conc: 60 }); ink.schedule('ch2', ...T.city.h2, { conc: 60 }); ink.schedule('ch3', ...T.city.h3, { conc: 70 });
  ink.schedule('sea', ...T.sea, { conc: 40 });
  ink.schedule(['ool', 'oh1', 'oh2', 'oh3', 'sol', 'sh1', 'sh2', 'sh3'], ...T.houses, { conc: 90 });
  ink.schedule(['wol', 'wh1', 'wh2', 'wh3', 'wall'], ...T.walls, { conc: 80 });
  ink.schedule(['kol', 'kh1', 'kh2', 'kh3', 'kpole'], ...T.camp, { conc: 60 });
  ink.schedule(['nol', 'nh1', 'nh2', 'nh3'], ...T.gun, { conc: 20 });
  ink.build();
  const frameInk = new B.Ink(); borderInk(frameInk, BORDER); frameInk.schedule('main', 2.6, 6.0, { conc: 1.2 }); frameInk.build();

  // hand colouring: buff on the land, madder on the walls and the besiegers' tent — only at the end
  const wash = new Wash({ scale: 1.5 });
  wash.add({ path: city.shape.path, polys: city.shape.polys, color: '#c9a45e', origin: [1000, 560], t0: T.wash[0], dur: 2.4, alpha: 0.62, seed: 2, spill: 3.5, lift: 0.6 });
  wash.add({ path: wallShape.shape.path, polys: wallShape.shape.polys, color: '#a63a2a', origin: [580, 600], t0: T.wash[0] + 1.2, dur: 1.4, alpha: 0.8, seed: 4, spill: 2.5, lift: 0.5 });
  wash.add({ path: dome.shape.path, polys: dome.shape.polys, color: '#7b8a9a', origin: [1330, 540], t0: T.wash[0] + 1.6, dur: 1.0, alpha: 0.7, seed: 6, spill: 2.5, lift: 0.5 });

  // ------------------------------------------------------------------ voice plan -> subtitles (film seconds)
  const subs = [
    { t0: 3.1, t1: 9.9, text: 'In the spring of 1453, a city that had stood for eleven hundred years was about to fall.' },
    { t0: 10.0, t1: 13.4, text: 'Its walls had turned back army after army.' },
    { t0: 13.7, t1: 17.7, text: 'Its emperor had perhaps seven thousand men to hold them.' },
    { t0: 17.8, t1: 25.9, text: 'Facing him: tens of thousands of soldiers, a twenty-one-year-old sultan, and a very large cannon.' },
    { t0: 26.0, t1: 31.3, text: 'Now, you would think a thousand years of history might buy you a little more time.' },
    { t0: 31.5, t1: 38.2, text: 'But history, as it turns out, has never once accepted a loyalty card.' },
  ];

  // ------------------------------------------------------------------ camera
  const first = ink.S.find(x => x.g === 'col');
  const tipAt = t => { const f = (first.n - 1) * clamp((t - first.s0) / (first.s1 - first.s0)), j = Math.min(first.n - 2, Math.floor(f)), u = f - j, xy = first.xy;
    return { x: xy[2 * j] + (xy[2 * j + 2] - xy[2 * j]) * u, y: xy[2 * j + 1] + (xy[2 * j + 3] - xy[2 * j + 1]) * u }; };
  const WIDE = { cx: 960, cy: 540, z: 1, rot: 0 };
  const keys = []; const K = (t, c, e = eio) => keys.push([t, c, e]);
  K(2.4, { cx: 0, cy: 0, z: 3.4, rot: 0, follow: true });
  K(4.2, WIDE); K(9.8, WIDE, x => x);
  K(11.0, { cx: 500, cy: 470, z: 2.0, rot: 0 }); K(14.2, { cx: 500, cy: 470, z: 2.0, rot: 0 }, x => x);
  K(15.6, WIDE); K(18.2, WIDE, x => x);
  K(19.6, { cx: 420, cy: 690, z: 1.9, rot: 0 }); K(23.0, { cx: 440, cy: 680, z: 1.95, rot: 0 }, x => x);
  K(24.6, WIDE); K(T.wash[1], { cx: 962, cy: 546, z: 1.02, rot: -0.0015 }, x => x); K(T.end, WIDE);
  const camAt = t => {
    if (t <= 2.4) { const tp = tipAt(t); return { cx: tp.x + 16, cy: tp.y + 22, z: 3.4 * (1 - 0.03 * Math.max(0, t)), rot: 0 }; }
    let i = 0; while (i < keys.length - 1 && keys[i + 1][0] <= t) i++;
    let [ta, ca] = keys[i]; const nx = keys[i + 1]; if (!nx) return ca;
    if (ca.follow) { const tp = tipAt(2.4); ca = { cx: tp.x + 16, cy: tp.y + 22, z: 3.4 * (1 - 0.072), rot: 0 }; }
    const [tb, cb, e] = nx, u = e(seg(t, ta, tb));
    const za = Math.log(ca.z), zb = Math.log(cb.z), z = Math.exp(lerp(za, zb, u));
    const wa = 1 / ca.z, wb = 1 / cb.z, v = Math.abs(wb - wa) > 1e-6 ? (1 / z - wa) / (wb - wa) : u;
    const k = Math.abs(za - zb) > 0.3 ? clamp(v) : u;
    return { cx: lerp(ca.cx, cb.cx, k), cy: lerp(ca.cy, cb.cy, k), z, rot: lerp(ca.rot || 0, cb.rot || 0, u) };
  };
  const applyCam = (ctx, c) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, H / 2); ctx.rotate(c.rot || 0); ctx.scale(c.z, c.z); ctx.translate(-c.cx, -c.cy); };

  // ------------------------------------------------------------------ roundel 1
  const roundelAt = t => {
    if (t < a1.ring[0]) return null;
    const u = eio(seg(t, ...a1.travel));
    return { x: lerp(FOCUS.x, SLOT[0], u), y: lerp(FOCUS.y, SLOT[1], u) - Math.sin(u * Math.PI) * 30, r: Math.exp(lerp(Math.log(FOCUS.r), Math.log(RR), u)), ring: seg(t, ...a1.ring), travel: u };
  };
  function drawRoundel(ctx, t, cam) {
    const r = roundelAt(t); if (!r) return;
    // leader under the roundel
    const dx = FOCUS.x - r.x, dy = FOCUS.y - r.y, L = Math.hypot(dx, dy);
    if (L > r.r + 6) {
      const end = [r.x + dx / L * r.r, r.y + dy / L * r.r];
      ctx.save(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 0.95; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(FOCUS.x, FOCUS.y); ctx.lineTo(...end); ctx.stroke();
      ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(FOCUS.x, FOCUS.y, 1.8, 0, 7); ctx.fill(); ctx.restore();
      engraveText(ctx, '1', FOCUS.x - 22, FOCUS.y - 14, { size: 16, font: HEAD, italic: true, p: seg(t, a1.travel[1] - 0.3, a1.travel[1] + 0.2) });
    }
    ctx.save(); ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = PAL.paper; ctx.fillRect(r.x - r.r, r.y - r.r, r.r * 2, r.r * 2);
    ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(paperTexture(W, H), 0, 0, W, H);
    ctx.globalAlpha = 0.55; ctx.fillStyle = PAL.plateTone; ctx.fillRect(r.x - r.r, r.y - r.r, r.r * 2, r.r * 2);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const k = r.r / 500; ctx.translate(r.x, r.y); ctx.scale(k, k);
    art.draw(ctx, t, { wScale: Math.max(1, 0.55 / (k * cam.z)) ** 0.6 });
    ctx.restore();
    roundelFrame(ctx, r.x, r.y, r.r, { p: r.ring, w: 2.0 });
    const lx = SLOT[0], ly = SLOT[1] + RR;
    if (t > a1.name) {
      engraveText(ctx, 'FIG. 1  ·  THE LAND WALLS', lx, ly + 36, { size: 17, font: LABEL, weight: 700, track: 0.14, p: seg(t, a1.name, a1.name + 0.6) });
      engraveText(ctx, 'muri terrestres', lx, ly + 64, { size: 21, font: HEAD, italic: true, weight: 400, p: seg(t, a1.latin, a1.latin + 0.55) });
      const lines = wrapLines(ctx, 'Two lines of wall, and a moat before them.', 380, { size: 27, font: NOTEF, italic: true });
      const np = seg(t, a1.note, a1.note + 1.1);
      lines.forEach((ln, q) => engraveText(ctx, ln, lx, ly + 102 + q * 32, { size: 27, font: NOTEF, italic: true, weight: 400, p: clamp(np * lines.length - q) }));
    }
  }

  // ------------------------------------------------------------------ plate scene
  function drawPlate(ctx, t, cam) {
    applyCam(ctx, cam);
    drawSheet(ctx, { W, H, plate: PLATE });
    wash.draw(ctx, t);
    ink.draw(ctx, t);
    frameInk.draw(ctx, t);
    engraveText(ctx, 'CONSTANTINOPLE.', 960, 132, { size: 50, font: HEAD, weight: 700, track: 0.1, p: seg(t, T.title, T.title + 0.9) });
    engraveText(ctx, 'Anno Domini MCDLIII', 960, 170, { size: 25, font: HEAD, italic: true, weight: 400, p: seg(t, T.latin, T.latin + 0.8) });
    engraveText(ctx, 'CORNU AUREUM', 900, 300, { size: 15, font: LABEL, weight: 600, track: 0.2, p: seg(t, T.labels, T.labels + 0.7) });
    engraveText(ctx, 'PROPONTIS', 1000, 905, { size: 15, font: LABEL, weight: 600, track: 0.2, p: seg(t, T.labels + 0.2, T.labels + 0.9) });
    engraveText(ctx, 'the great bombard', 300, 905, { size: 21, font: HEAD, italic: true, weight: 400, p: seg(t, T.gunLabel, T.gunLabel + 0.8) });
    if (t > T.gunLabel) { ctx.save(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(340, 880); ctx.lineTo(412, 630); ctx.stroke(); ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.arc(412, 630, 1.7, 0, 7); ctx.fill(); ctx.restore(); }
    drawRoundel(ctx, t, cam);
    // signature
    if (t > T.sign) {
      engraveText(ctx, "ADRIAN’S CHRONICLES", 960, 988, { size: 21, font: HEAD, weight: 700, track: 0.2, p: seg(t, T.sign, T.sign + 0.9) });
      engraveText(ctx, 'Pilot plate  ·  Plate I', BORDER[0] + 4, 1026, { size: 14, font: HEAD, italic: true, align: 'left', p: seg(t, T.sign + 0.8, T.sign + 1.3) });
      engraveText(ctx, 'narrated, set and cut in code', BORDER[2] - 4, 1026, { size: 14, font: HEAD, italic: true, align: 'right', p: seg(t, T.sign + 1.0, T.sign + 1.5) });
    }
  }

  // ------------------------------------------------------------------ the archive light table (inside the loupe)
  const LC = [940, 560];            // where the loupe lands on the plate
  function drawLightTable(ctx, t) {
    const u = seg(t, T.lt[0] - 0.6, T.lt[1] + 4.4);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 1100); g.addColorStop(0, '#eef1f3'); g.addColorStop(1, '#c9d0d6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,135,150,0.10)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // the object: a real manuscript page, slow push toward the walled city (anchor), nothing redrawn
    const asp = img ? img.width / img.height : 0.7, oh = 850, ow = oh * asp, ox = 640, oy = 490;
    const AX = (0.655 - 0.5) * ow, AY = (0.346 - 0.5) * oh, s = lerp(1.0, 1.22, ss(u));
    ctx.save(); ctx.translate(ox, oy); ctx.translate(AX, AY); ctx.scale(s, s); ctx.translate(-AX, -AY);
    ctx.shadowColor = 'rgba(40,50,60,0.35)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 12; ctx.fillStyle = '#f3ecd8'; ctx.fillRect(-ow / 2, -oh / 2, ow, oh); ctx.shadowColor = 'transparent';
    if (img) ctx.drawImage(img, -ow / 2, -oh / 2, ow, oh);
    else { ctx.fillStyle = '#d8d0b8'; ctx.fillRect(-ow / 2 + 20, -oh / 2 + 20, ow - 40, oh - 40); ctx.fillStyle = '#8a7f66'; ctx.font = '600 30px "Bodoni Moda"'; ctx.textAlign = 'center'; ctx.fillText('REAL ARCHIVE SCAN PENDING', 0, -6); }
    ctx.restore();
    // label: anchor dot + ring, leader, dark caption plate with the record's own wording
    const lp = ss(seg(t, T.lt[0] + 1.0, T.lt[0] + 1.8));
    if (lp > 0) {
      const ax = ox + AX, ay = oy + AY, bx = 1180, by = 250;
      ctx.globalAlpha = lp; ctx.strokeStyle = SIGNAL; ctx.fillStyle = SIGNAL; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ax, ay, 14, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(ax, ay, 4, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(ax + 10, ay - 10); ctx.lineTo(bx - 20, ay - 10); ctx.lineTo(bx - 20, by + 90); ctx.stroke();
      ctx.fillStyle = 'rgba(30,36,44,0.94)'; ctx.fillRect(bx - 20, by + 90, 560, 150);
      ctx.fillStyle = SIGNAL_ON_DARK; ctx.font = '700 15px "Source Sans 3"'; ctx.letterSpacing = '2px'; ctx.textAlign = 'left'; ctx.fillText((meta && meta.label_top) || 'ARCHIVE RECORD', bx, by + 122); ctx.letterSpacing = '0px';
      ctx.fillStyle = '#f0ece0'; ctx.font = '600 26px "Lora"'; const lines = wrapLines(ctx, (meta && meta.reading) || 'Source record pending.', 400, { size: 26, font: NOTEF, weight: 600 });
      lines.slice(0, 2).forEach((ln, i) => ctx.fillText(ln, bx, by + 156 + i * 30));
      ctx.fillStyle = '#b4bfca'; ctx.font = '400 16px "Source Sans 3"'; ctx.fillText((meta && meta.source) || 'catalogue no. pending', bx, by + 222);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  // the loupe iris: the same ring that frames a roundel, grown from the plate to the whole frame and back
  function loupeRadius(t) {
    if (t >= T.loupeIn[0] && t < T.lt[0]) return lerp(70, 1500, eio(seg(t, ...T.loupeIn)));
    if (t >= T.lt[0] && t < T.loupeOut[0]) return 1500;
    if (t >= T.loupeOut[0] && t < T.loupeOut[1]) return lerp(1500, 70, eio(seg(t, ...T.loupeOut)));
    return 0;
  }

  // ------------------------------------------------------------------ subtitles
  let _subLayer = null; const subLayer = (w, h) => { if (!_subLayer) _subLayer = document.createElement('canvas'); if (_subLayer.width !== w) _subLayer.width = w; if (_subLayer.height !== h) _subLayer.height = h; return _subLayer; };
  function drawSubs(ctx, t) {
    const i = subs.findIndex(x => t >= x.t0 && t < Math.min(x.t1 + 0.6, subs[subs.indexOf(x) + 1] ? subs[subs.indexOf(x) + 1].t0 - 0.05 : 1e9)); if (i < 0) return;
    const sb = subs[i], end = Math.min(sb.t1 + 0.6, subs[i + 1] ? subs[i + 1].t0 - 0.05 : 1e9);
    const a = Math.min(seg(t, sb.t0, sb.t0 + 0.25), 1 - seg(t, end - 0.2, end));
    const SUBFONT = NOTEF, size = 35, lines = wrapLines(ctx, sb.text, 900, { size, font: SUBFONT, weight: 600 });
    const lh = size * 1.3, hgt = lines.length * lh + 26, wid = Math.max(...lines.map(l => measure(ctx, l, { size, font: SUBFONT, weight: 600 }).tw)) + 80;
    const y1 = 1058, y0 = y1 - hgt, x0 = 960 - wid / 2, PAD = 40;
    // SYNC RULE: the slip and its text are drawn into ONE offscreen layer and composited with ONE alpha.
    // (engraveText resets ctx.globalAlpha to its own `alpha` option, so drawing the text straight onto a faded slip makes the text appear first.)
    const cw = Math.ceil(wid + 2 * PAD), ch = Math.ceil(hgt + 2 * PAD);
    const lay = subLayer(cw, ch), lc = lay.getContext('2d');
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, cw, ch); lc.globalAlpha = 1;
    lc.shadowColor = 'rgba(60,40,20,0.28)'; lc.shadowBlur = 14; lc.shadowOffsetY = 4; lc.fillStyle = '#f7f1e0'; lc.beginPath();
    const RR2 = B.RNG(7), X0 = PAD, Y0 = PAD, X1 = PAD + wid, Y1 = PAD + hgt;
    lc.moveTo(X0, Y0); for (let x = X0; x <= X1; x += 14) lc.lineTo(x, Y0 + (RR2() - 0.5) * 2.2); for (let y = Y0; y <= Y1; y += 12) lc.lineTo(X1 + (RR2() - 0.5) * 2, y); for (let x = X1; x >= X0; x -= 14) lc.lineTo(x, Y1 + (RR2() - 0.5) * 2.2); for (let y = Y1; y >= Y0; y -= 12) lc.lineTo(X0 + (RR2() - 0.5) * 2, y); lc.closePath(); lc.fill();
    lc.shadowColor = 'transparent';
    lines.forEach((ln, q) => engraveText(lc, ln, PAD + wid / 2, Y0 + 14 + lh * (q + 0.78), { size, font: SUBFONT, weight: 600, p: 1 }));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(lay, x0 - PAD, y0 - PAD); ctx.restore();
  }

  function render(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    const cam = camAt(t);
    drawPlate(ctx, t, cam);
    const lr = loupeRadius(t);
    if (lr > 0) {
      const c = lr > 1400 ? [W / 2, H / 2] : [lerp(LC[0], W / 2, ss(lr / 1500)), lerp(LC[1], H / 2, ss(lr / 1500))];
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(c[0], c[1], lr, 0, Math.PI * 2); ctx.clip(); drawLightTable(ctx, t); ctx.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (lr < 1400) roundelFrame(ctx, c[0], c[1], lr, { p: 1, w: 3.0 }); ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!(lr > 1400)) { const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.55, W / 2, H / 2, H * 1.15); vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(120,86,46,0.2)'); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
    if (!(typeof location !== 'undefined' && location.search.includes('nosub'))) drawSubs(ctx, t);
  }

  // sound cues for the mixer
  const EV = [{ t: 0, type: 'burin', until: 5.4 }, { t: 2.6, type: 'hatch', until: 9.6 }, { t: T.title, type: 'title', dur: 0.9 }, { t: T.walls[0], type: 'hatch', until: T.walls[1] },
    { t: a1.ring[0], type: 'ring' }, { t: a1.travel[0], type: 'travel', until: a1.travel[1] }, { t: a1.travel[1], type: 'land' }, { t: a1.cont[0], type: 'hatch', until: a1.cont[1] },
    { t: T.camp[0], type: 'hatch', until: T.camp[1] }, { t: T.gun[0], type: 'hatch', until: T.gun[1] }, { t: T.loupeIn[0], type: 'loupe', until: T.loupeIn[1] }, { t: T.lt[0], type: 'glass' },
    { t: T.loupeOut[0], type: 'loupe', until: T.loupeOut[1] }, { t: T.wash[0], type: 'wash', until: T.wash[1] }, { t: T.sign, type: 'title', dur: 0.9 }];
  return { render, DUR, T, EV, subs };
}
