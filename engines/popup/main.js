// EP001 · Part 1 · Paper Pop-up Book engine (scenes are defined in scenes.js)
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clamp, lerp, seg, ss, eio, eo, back, TAU, hash } from './lib.js';
import { makeBook, coverCanvases, texOf, BW, BD, PG } from './book.js';
import { cutMesh } from './cutmesh.js';
import { makePost } from './post.js';
import { SPREAD, person, PEOPLE } from './art.js';
import { buildScenes } from './scenes.js';

const W = 1920, H = 1080, QS = new URLSearchParams(location.search);
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setSize(W, H); renderer.setPixelRatio(1); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('stage').appendChild(renderer.domElement);
const OX = document.getElementById('ov').getContext('2d');
const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, W / H, .004, 30), post = makePost(renderer, scene, cam, W, H);
await Promise.all([document.fonts.load('600 40px Lora'), document.fonts.load('700 40px "Playfair Display"'), document.fonts.load('italic 40px "Playfair Display"'), document.fonts.load('600 30px "Source Sans 3"')]);
const TL = await (await fetch('timeline.json')).json();
const A = '/core/assets/polyhaven/';
const hdr = await new RGBELoader().loadAsync(A + 'lythwood_lounge_2k.hdr'); hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr; scene.background = hdr; scene.backgroundBlurriness = .22; scene.backgroundRotation.set(0, 2.3, 0); scene.environmentRotation.set(0, 2.3, 0); scene.environmentIntensity = .4;
const tl = new THREE.TextureLoader(), wt = n => { const t = tl.load(A + `walnut_${n}.jpg`); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.2, 1.4); t.anisotropy = 12; return t; };
const wd = wt('diff'); wd.colorSpace = THREE.SRGBColorSpace;
const desk = new THREE.Mesh(new THREE.BoxGeometry(2.6, .04, 1.7), new THREE.MeshStandardMaterial({ map: wd, normalMap: wt('nor'), roughnessMap: wt('rough'), color: '#c9a88a', envMapIntensity: .8 })); desk.position.set(0, -.02, .25); desk.receiveShadow = true; scene.add(desk);
try { const m = (await new GLTFLoader().loadAsync(A + 'desk_lamp_arm_01/desk_lamp_arm_01.gltf')).scene; m.position.set(-.347, 0, .51); m.scale.setScalar(.55); m.rotation.y = -.76; m.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; if (o.material.name.includes('light')) { o.material = o.material.clone(); o.material.emissive = new THREE.Color('#ffd9a0'); o.material.emissiveIntensity = 6; } } }); scene.add(m); } catch (e) { }

// ---------------------------------------------------------------- the book
const cover = coverCanvases((x, px, py, w, h) => {      // emblem: wall + dome
  x.fillStyle = '#87b8e0'; x.fillRect(px - 20, py - 20, w + 40, h + 40);
  x.fillStyle = '#e8c27a'; x.beginPath(); x.arc(px + w * .78, py + h * .18, w * .13, 0, TAU); x.fill();
  x.fillStyle = '#d8c8a6'; x.strokeStyle = '#3a2a24'; x.lineWidth = 8; x.beginPath(); x.rect(px - 30, py + h * .6, w + 60, h * .5); x.fill(); x.stroke();
  for (let i = 0; i < 6; i++) { x.beginPath(); x.rect(px - 30 + i * (w + 60) / 6, py + h * .52, (w + 60) / 12, h * .1); x.fill(); x.stroke(); }
  x.fillStyle = '#c9c3b8'; x.beginPath(); x.arc(px + w * .5, py + h * .6, w * .36, Math.PI, 0); x.fill(); x.stroke();
  x.fillStyle = '#e2ae3a'; x.beginPath(); x.arc(px + w * .5, py + h * .24, w * .05, 0, TAU); x.fill(); x.stroke();
});
const book = makeBook(cover); scene.add(book.root); book.setOpen(0);
const lampHead = new THREE.Vector3(-.28, .375, .44);
const spot = new THREE.SpotLight('#fff0dc', 2.4, 3, .75, .55, 2); spot.position.copy(lampHead); spot.target.position.set(.02, 0, .2); spot.castShadow = true; spot.shadow.mapSize.set(4096, 4096); spot.shadow.bias = -.00006; spot.shadow.normalBias = .0004; spot.shadow.radius = 5; spot.shadow.camera.near = .05; spot.shadow.camera.far = 2; scene.add(spot, spot.target);
const sun = new THREE.DirectionalLight('#fff3e0', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.00008; sun.shadow.normalBias = .0003; sun.shadow.radius = 4; Object.assign(sun.shadow.camera, { left: -.3, right: .3, top: .3, bottom: -.3, near: .1, far: 3 }); sun.target.position.set(0, .05, .12); sun.position.set(-.35, .55, .75); scene.add(sun, sun.target);
const hemi = new THREE.HemisphereLight('#cfe6ff', '#caa27a', .6); scene.add(hemi);

// ---------------------------------------------------------------- kit for scene definitions
const GROUPS = {}, TEX = new Map();
const tex = c => { if (!TEX.has(c)) TEX.set(c, texOf(c)); return TEX.get(c); };
const kit = {
  TL, mk(id) { const g = new THREE.Group(); g.visible = false; g.userData.id = id; book.stage.add(g); GROUPS[id] = g; return g; },
  put(g, item, x, z, o = {}) { const m = cutMesh(item, { s: o.s ?? 1, tex: tex(item.c) }); m.position.set(x, o.y ?? 0, z); if (o.rz) m.rotation.z = o.rz; if (o.flip) m.scale.x = -1; m.userData.base = [x, o.y ?? 0, z]; m.userData.rise = o.rise ?? true; g.add(m); return m; },
  who(g, name, x, z, o = {}) {                            // a person: two mouth states, swapped while speaking
    const grp = new THREE.Group(); const c = cutMesh(person(name, 0), { s: o.s ?? 1, tex: tex(person(name, 0).c) }), op = cutMesh(person(name, 1), { s: o.s ?? 1, tex: tex(person(name, 1).c) });
    grp.add(c, op); op.visible = false; grp.userData = { base: [x, o.y ?? 0, z], who: name, closed: c, open: op, rise: o.rise ?? true, s: o.s ?? 1, flip: !!o.flip };
    grp.position.set(x, o.y ?? 0, z); if (o.flip) grp.scale.x = -1; g.add(grp); return grp;
  },
};
const SC = buildScenes(kit);          // [{id,t0,t1,spread,mood,shots,tick,...}]
for (const s of SC) { if (!GROUPS[s.link || s.id] && !s.special) throw new Error('scene group missing: ' + s.id); }

// pages
const PTEX = {}; const pageTex = (k, w) => (PTEX[k + w] ||= texOf(SPREAD[k][w]));

// speech state
const SP = { NARRATOR: null }; const NAMEMAP = { SPHRANTZES: 'sphrantzes', CONSTANTINE: 'constantine', MEHMED: 'mehmed', HALIL: 'halil', URBAN: 'urban', GIUSTINIANI: 'giustiniani', NOTARAS: 'notaras', GENNADIUS: 'gennadius', DIMITRI: 'dimitri', STAVROS: 'stavros' };
const speaker = t => { for (const l of TL.lines) if (t >= l.t0 - .02 && t <= l.t1 + .08) return NAMEMAP[l.speaker] || (l.speaker === 'CITIZEN' ? 'citizen' : null); return null; };

// subtitles: split each line into chunks by punctuation / length
const SUBS = [];
for (const l of TL.lines) {
  const words = l.text.replace(/\s+/g, ' ').split(' '); const chunks = []; let cur = [];
  for (const w of words) { cur.push(w); const len = cur.join(' ').length; if (len > 54 || (/[.?!]$/.test(w) && len > 28) || (/[,;:]$/.test(w) && len > 40)) { chunks.push(cur.join(' ')); cur = []; } }
  if (cur.length) { if (chunks.length && cur.join(' ').length < 14) chunks[chunks.length - 1] += ' ' + cur.join(' '); else chunks.push(cur.join(' ')); }
  const tot = chunks.reduce((a, c) => a + c.length + 6, 0); let t = l.t0;
  for (const c of chunks) { const d = (l.t1 - l.t0 + .12) * (c.length + 6) / tot; SUBS.push({ t0: t, t1: t + d, text: c, who: l.speaker }); t += d; }
}

// ---------------------------------------------------------------- render
const lerpArr = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
function camAt(s, t) {
  const sh = s.shots; let cur = sh[0];
  for (const k of sh) if (t >= k[0]) cur = k;
  const [a, b, A, B] = cur; return lerpArr(A, B || A, eio(seg(t, a, b)));
}
const sceneAt = t => { let cur = SC[0]; for (const s of SC) if (t >= s.t0) cur = s; return cur; };

window.render = function (t) {
  const s = sceneAt(t), base = s.link ? SC.find(q => q.id === s.link) : s, lt = t - base.t0;
  for (const k in GROUPS) GROUPS[k].visible = false;
  let G = null;
  // book state
  const openA = s.id === 'open' ? ss(seg(t, 3.0, 7.2)) * Math.PI / 2 : Math.PI / 2; book.setOpen(openA);
  if (s.spread) { const sp = SPREAD[s.spread]; book.groundMat.map = pageTex(s.spread, 'ground'); book.backMat.map = pageTex(s.spread, 'sky'); book.groundMat.needsUpdate = book.backMat.needsUpdate = true; }
  if (s.id === 'open') { const sp = SPREAD.wall; book.groundMat.map = pageTex('wall', 'ground'); book.backMat.map = pageTex('wall', 'sky'); book.groundMat.needsUpdate = book.backMat.needsUpdate = true; }
  if (GROUPS[s.link || s.id]) {
    G = GROUPS[s.link || s.id]; G.visible = true;
    const spk = speaker(t);
    G.children.forEach(m => {
      const u = m.userData; if (!u.base) return;
      const z = u.base[2], d = (z / BD) * .5, dl = u.delay || 0, k = eo(seg(lt, d * .5 + dl, d * .5 + dl + .55));
      if (u.rise !== false) { m.rotation.x = -(1 - back(k, 1.6)) * 1.5; m.visible = k > 0; }
      if (u.who) { const on = spk === u.who; const tk = Math.floor(t * 7.5 + hash(u.who.length) * 3) % 2 === 0; u.open.visible = on && tk; u.closed.visible = !(on && tk);
        const bob = on ? Math.sin(t * 15) * .0012 : Math.sin(t * 1.6 + z * 20) * .0006; m.position.y = u.base[1] + Math.max(0, bob); m.rotation.z = on ? Math.sin(t * 6.5) * .035 : 0; }
    });
    if (s.tick) s.tick(t, lt, G, seg(t, s.t0, s.t1));
  }
  // light mood
  const md = s.mood || {}, night = md.night ?? 0, dawn = md.dawn ?? 0;
  sun.intensity = 2.6 - night * 2.1 - dawn * .5; sun.color.set(night > .7 ? '#9fb4ff' : dawn ? '#ff9a6b' : (md.warm ? '#ffb88a' : '#fff3e0')); hemi.intensity = .6 - night * .12; spot.intensity = 1.2 - night * .45 + dawn * 1.0; renderer.toneMappingExposure = 1 - night * .05;
  const ck = s.id === 'open' ? openCam(t) : camAt(s, t); if (s.id !== 'open') { ck[2] = Math.min(ck[2], .47);
    const hw = Math.tan(ck[6] * Math.PI / 360) * (W / H) * ck[2] * .97, lim = Math.max(0, .215 - hw), sh = Math.max(-lim - ck[3], Math.min(lim - ck[3], 0)); // keep the frame inside the page: no glare strip / desk
    const over = Math.max(0, Math.abs(ck[3]) - lim); if (over > 0) { const d = -Math.sign(ck[3]) * over; ck[0] += d; ck[3] += d; } }
  cam.position.set(ck[0], ck[1], ck[2]); cam.fov = ck[6]; cam.lookAt(ck[3], ck[4], ck[5]); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  post.dof.focus = cam.position.distanceTo(new THREE.Vector3(ck[3], ck[4], ck[5])); post.dof.aper = ck[7]; post.dof.maxCoc = 14; post.vig.uniforms.fade.value = 1; post.vig.uniforms.warm.value = .12; post.bloom.strength = .2 + night * .02;
  scene.updateMatrixWorld(true); post.composer.render();
  // subtitles
  OX.clearRect(0, 0, W, H); const c = SUBS.find(q => t >= q.t0 - .05 && t < q.t1 + .45);
  if (c) { const a = Math.min(ss(seg(t, c.t0 - .05, c.t0 + .15)), 1 - ss(seg(t, c.t1 + .25, c.t1 + .45))); OX.save(); OX.globalAlpha = a; OX.textAlign = 'center'; OX.textBaseline = 'middle'; OX.lineJoin = 'round';
    if (c.who !== 'NARRATOR') { OX.font = '700 34px "Source Sans 3"'; OX.lineWidth = 9; OX.strokeStyle = '#3a2a24'; const nm = c.who.toUpperCase(); OX.strokeText(nm, W / 2, H - 150); OX.fillStyle = '#ffd98a'; OX.fillText(nm, W / 2, H - 150); }
    OX.font = '600 42px Lora'; OX.lineWidth = 9; OX.strokeStyle = '#3a2a24'; OX.strokeText(c.text, W / 2, H - 96); OX.fillStyle = '#fff6dc'; OX.fillText(c.text, W / 2, H - 96); OX.restore(); }
};
function openCam(t) {       // closed book on the desk → opens → front-facing frame
  const A = [0, .5, .62, 0, 0, .15, 30, 3], B = [0, .34, .66, 0, .02, .13, 30, 3], C = [0, .17, .56, 0, .06, .13, 30, 2.4];
  const u1 = ss(seg(t, 0, 3)), u2 = ss(seg(t, 5.2, 9));
  return lerpArr(lerpArr(A, B, u1), C, u2);
}
window.DUR = TL.end; window.EV = (SC.flatMap(s => s.ev || []));
window.render(parseFloat(QS.get('t') ?? '5'));
window.READY = true;
