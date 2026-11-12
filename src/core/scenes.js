// Paper Atlas 16:9 · SHARED SCENES for "So Close to Empire" (used by several chapters; cut paper, style palette only).
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P, cut, P_rr, P_circ, P_poly, parchment, ribbon, slip, label } from './kit.js';
import * as A from './atlas.js';
import * as R from './props.js';
import { person } from './cast.js';

const SERIF = 'Caladea';
/** Lally's room in Paris at dawn: door, chair, a candle on a small table (CH0 and CH7).
 *  lally 0..1 = the general standing in the room (he wears the coat); when he is gone the coat hangs on the chair. */
export function parisRoom(t, { out = 0, seal = 0, lally = 0, sealText = 'GUILTY' } = {}) {
  R.room({ wall: '#B9A98C', floor: '#6E5A44', fl: 840, seed: 17 }); R.dawnWash(0.9);
  R.windowPane(1320, 140, 300, 420, { sky: '#5A7096', sea: false, t, stars: false });
  R.door(240, 220, 300, 620);
  if (lally < 0.5) R.chairWithCoat(860, 840, { s: 1.05 });
  R.table(1180, 700, 260, { h: 140 }); R.candle(1180, 676, t, { s: 1.1, out });
  if (lally > 0) { ctx.save(); ctx.globalAlpha = clamp(lally); person('lally', { x: 760, y: 850, h: 600, t }); ctx.restore(); }
  if (seal > 0) A.wordSeal(sealText, 1500, 700, lerp(1.9, 0.95, eo(clamp(seal / 0.25))), clamp(seal * 4), P.crimson, 34);
}
/** the Adyar river near Madras, 1746: the small French-led force south of the river, the Nawab's army north-west of it.
 *  o = { blue 0..1 (march in), green 0..1 (appear), scatter 0..1 (the big army breaks and flows away west), labels } */
export const ADYAR_VIEW = { lon: 79.6, lat: 12.75, deg: 7, base: 'asia' };
export function adyarMap(t, { blue = 1, green = 0, scatter = 0, labels = 1 } = {}) {
  const v = A.realMap({ view: ADYAR_VIEW, t }), md = A.at(v, 'Madras'), pd = A.at(v, 'Pondicherry');
  A.drawPolyline([[79.72, 12.96], [79.9, 13.03], [80.08, 12.99], [80.27, 13.01]].map(([a, b]) => A.proj(v, a, b)), 1, P.sea, 16);
  A.pin(md[0], md[1], 'french', { r: 15 }); A.pin(pd[0], pd[1], 'french', { r: 15, star: true });
  if (labels > 0) { A.placeLabel('MADRAS', md[0], md[1], { dx: 110, dy: 0, size: 26 }); A.placeLabel('PONDICHERRY', pd[0], pd[1], { dx: 160, dy: 0, size: 26 }); A.placeLabel('ADYAR RIVER', ...A.proj(v, 79.72, 12.96), { dx: -100, dy: 0, size: 22 }); }
  if (green > 0) { R.army(560, 320, 22, 8, P.forest, { t, s: 1.25, march: clamp(green), scatter, dir: -1, turban: true, seed: 9, step: 1 }); if (scatter < 0.3) for (const fx of [300, 560, 820]) A.flag(fx, 205, t, A.FLAGS.nawab, { s: 0.7, seed: fx }); }
  if (blue > 0) { R.army(900, 590, 9, 4, P.royal, { t, s: 1.5, march: clamp(blue), seed: 3, step: blue < 1 ? 1 : 0 }); A.flag(1090, 590, t, A.FLAGS.french, { s: 0.7 }); }
  if (scatter > 0.05 && scatter < 1) { R.smokeDrift(700, 330, t, { s: 0.7, a: 0.4 }); }
  return v;
}
/** the WHOLE subcontinent with its posts. posts = [[name, side, star?]]; r = pin radius */
export function fullMap(t, posts = [], { r = 9, glow = 0 } = {}) { const v = A.realMap({ view: 'india', t }); for (const [n, side, star] of posts) A.pin(...A.at(v, n), side, { r, star: !!star, glow }); return v; }
/** a paper crown icon */
export function crown(x, y, s = 1, col = P.gold) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-70, 40], [-80, -40], [-36, 0], [0, -60], [36, 0], [80, -40], [70, 40]]), col, { shadow: 0.7, edge: 4 }); cut(P_rr(-74, 30, 148, 24, 6), col, { shadow: 0.4, edge: 3 }); ctx.restore(); }
/** the Europe map with two crowns that slide in and clash at p = 1 (paper sparks fly after) */
export function europeClash(t, p, { a = 'FRANCE', b = 'BRITAIN' } = {}) {
  const v = A.realMap({ view: 'europe', set: 'europe', t });
  const [fx, fy] = A.proj(v, 2.3, 47), [bx, by] = A.proj(v, -1.5, 52.5);
  A.inkBleed(fx, fy, 260, 1, P.royal, { clipFn: A.landPath(v, 'europe'), seed: 4, alpha: 0.6 });
  A.placeLabel(a, fx, fy + 70, { size: 28 }); A.placeLabel(b, bx - 30, by - 40, { size: 28 });
  const k = eio(clamp(p)), mx = (fx + bx) / 2, my = (fy + by) / 2 - 60;
  crown(lerp(fx + 160, mx + 70, k), lerp(fy, my, k), 0.9, P.gold); crown(lerp(bx - 200, mx - 70, k), lerp(by, my, k), 0.9, '#B98B3A');
  if (p > 1) for (let i = 0; i < 9; i++) { const a2 = i / 9 * TAU, d = (p - 1) * 260; ctx.save(); ctx.globalAlpha = clamp(1.6 - p); cut(P_rr(mx + Math.cos(a2) * d - 8, my + Math.sin(a2) * d - 4, 16, 8, 2), P.crimson, { shadow: 0, edge: 2 }); ctx.restore(); }
  return v;
}
/** a parchment scroll unrolling (p 0..1) with a few lines of text and an optional seal */
export function scroll(x, y, w, p, { lines = [], seal = 0, sealText = null, title = null } = {}) {
  const h = 420 * eio(clamp(p)); if (h < 4) return;
  cut(P_rr(x - w / 2, y - h / 2, w, h, 6), '#F1E6CC', { shadow: 0.8, edge: 4 });
  for (const s of [-1, 1]) cut(P_rr(x - w / 2 - 20, y + s * h / 2 - 18, w + 40, 36, 18), '#C9AE84', { shadow: 0.6, edge: 3 });
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2 + 20, w, h - 40); ctx.clip();
  if (title) { let fs = 46; ctx.font = `700 ${fs}px ${SERIF}`; while (ctx.measureText(title).width > w - 60 && fs > 20) { fs -= 2; ctx.font = `700 ${fs}px ${SERIF}`; } ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, x, y - 130); }
  ctx.strokeStyle = 'rgba(62,44,30,0.45)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { const yy = y - 70 + i * 34; ctx.beginPath(); ctx.moveTo(x - w / 2 + 50, yy); ctx.lineTo(x + w / 2 - 50 - (i % 3) * 40, yy); ctx.stroke(); }
  lines.forEach((l, i) => { ctx.font = `700 34px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText(l, x, y - 60 + i * 50); });
  ctx.restore();
  if (seal > 0) A.wordSeal(sealText || '', x + w / 2 - 70, y + h / 2 - 80, lerp(1.8, 0.75, eo(clamp(seal / 0.25))), clamp(seal * 4), P.crimson, 24);
}
/** a wall calendar showing a label; flip 0..1 animates a page turning */
export function calendar(x, y, text, flip = 0, { sub = '' } = {}) {
  cut(P_rr(x - 130, y - 150, 260, 300, 8), '#F1E6CC', { shadow: 0.8, edge: 4 }); cut(P_rr(x - 130, y - 150, 260, 70, 8), P.crimson, { shadow: 0, edge: 3 });
  for (const dx of [-60, 60]) circle(x + dx, y - 150, 10, P.ink);
  ctx.font = `700 64px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + 20);
  if (sub) { ctx.font = `700 30px ${SERIF}`; ctx.fillStyle = '#F4EEDD'; ctx.fillText(sub, x, y - 115); }
  if (flip > 0 && flip < 1) { ctx.save(); ctx.translate(x, y - 80); ctx.scale(1, 1 - 2 * Math.abs(0.5 - flip) * 0 - flip); cut(P_rr(-130, 0, 260, 230, 8), '#E9DCBC', { shadow: 0.6, edge: 3 }); ctx.restore(); }
}
/** an East Indiaman sailing on paper waves across the frame; x = ship centre; flagCols = stern flag */
export function seaPage(t, shipX, { flagCols = A.FLAGS.french, night = false, guards = false, sky = P.sky, dir = 1 } = {}) {
  parchment(61); ctx.fillStyle = night ? '#3A4262' : sky; ctx.fillRect(-300, -300, W + 600, 900);
  if (!night) cut(P_circ(1580, 180, 70), '#EFC66A', { shadow: 0.4, edge: 5 });
  for (let i = 0; i < 4; i++) { const y = 600 + i * 100; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.009 + t * 1.5 + i) * 18); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.7, edge: 5 });
    if (i === 1) { ctx.save(); ctx.translate(shipX, 660 + Math.sin(t * 2) * 8); ctx.scale(dir, 1); ctx.rotate(Math.sin(t * 1.6) * 0.04); K_ship(0.85, t, flagCols, guards); ctx.restore(); } }
}
function K_ship(s, t, flagCols, guards) {
  ctx.save(); ctx.scale(s, s);
  cut(P_poly([[-300, -60], [300, -60], [240, 60], [-240, 60]]), '#7A5236');
  for (const mx of [-120, 90]) { cut(P_rr(mx - 9, -470, 18, 420, 6), P.ink, { shadow: 0.5, edge: 3 }); const b = 1 + 0.03 * Math.sin(t * 2 + mx); cut(P_poly([[mx - 120 * b, -420], [mx + 110 * b, -420], [mx + 95 * b, -140], [mx - 105 * b, -140]]), P.edge); }
  A.flag(-270, -60, t, flagCols, { s: 1.1 });
  if (guards) for (const gx of [-60, 40, 150]) person(gx === 40 ? 'lally' : 'coote', { x: gx, y: -60, h: 170, t, seed: gx });
  ctx.restore();
}
/** stone fort walls with crenellations; rain 0..1 and night wash optional; flag on the tower */
export function fortWalls(t, { rain = 0, night = false, flagCols = A.FLAGS.english, torches = false, flagRaise = 1, flag2 = null, flag2Raise = 0 } = {}) {
  parchment(71); ctx.fillStyle = night ? '#2F3550' : rain ? '#8C97A0' : P.sky; ctx.fillRect(-300, -300, W + 600, 820);
  cut(P_rr(-300, 760, W + 600, 600, 0), night ? '#4A3A2E' : '#8C6B4E', { shadow: 0, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.moveTo(100, 780); ctx.lineTo(100, 380); for (let x = 100; x < 1820; x += 80) { ctx.lineTo(x, 380); ctx.lineTo(x, 340); ctx.lineTo(x + 40, 340); ctx.lineTo(x + 40, 380); } ctx.lineTo(1820, 380); ctx.lineTo(1820, 780); ctx.closePath(); }, P.stone, { shadow: 0.8, edge: 4 });
  cut(P_rr(820, 200, 280, 580, 6), P.stoneDark, { shadow: 0.8, edge: 4 }); cut(P_rr(900, 600, 120, 180, 60), '#2A1E16', { shadow: 0, edge: 3 });
  ctx.strokeStyle = 'rgba(62,44,30,0.25)'; ctx.lineWidth = 3; for (let r = 0; r < 6; r++) for (let c = 0; c < 22; c++) { const x = 110 + c * 80 + (r % 2) * 40, y = 400 + r * 62; if (x > 800 && x < 1110) continue; ctx.strokeRect(x, y, 80, 62); }
  A.flag(1250, 340, t, flagCols, { s: 1.5, raise: flagRaise, droop: 1 - flagRaise }); if (flag2) A.flag(700, 340, t, flag2, { s: 1.5, raise: flag2Raise });
  if (torches) for (const tx of [300, 640, 1280, 1620]) { R.candle(tx, 420, t, { s: 1.2 }); }
  if (night) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#1D2236'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
  if (rain > 0) rainFx(t, rain);
}
export function rainFx(t, a = 1) {
  ctx.save(); ctx.globalAlpha = 0.45 * a; ctx.strokeStyle = '#E9EEF2'; ctx.lineWidth = 3;
  for (let i = 0; i < 140; i++) { const x = (rnd(i) * (W + 400) + t * 260) % (W + 400) - 200, y = (rnd(i + 50) * H + t * 1400 * (0.8 + rnd(i) * 0.4)) % (H + 100) - 50; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 12, y + 40); ctx.stroke(); }
  ctx.restore();
}
/** a town grid drawing itself street by street (top-down plan of Pondicherry) */
export function townGrid(cx, cy, p, { cols = 9, rows = 6, cell = 90, color = P.royal } = {}) {
  const w = cols * cell, h = rows * cell, x0 = cx - w / 2, y0 = cy - h / 2;
  cut(P_rr(x0 - 30, y0 - 30, w + 60, h + 60, 10), '#E3D2AC', { shadow: 0.6, edge: 4 });
  const n = cols + rows + 2; ctx.lineCap = 'round';
  for (let i = 0; i <= cols; i++) { const k = clamp(p * n - i); if (k > 0) line([[x0 + i * cell, y0], [x0 + i * cell, y0 + h * k]], P.ink, 6); }
  for (let j = 0; j <= rows; j++) { const k = clamp(p * n - cols - 1 - j); if (k > 0) line([[x0, y0 + j * cell], [x0 + w * k, y0 + j * cell]], P.ink, 6); }
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const k = clamp(p * n - (i + j) * 0.6); if (k > 0.2) { ctx.globalAlpha = 0.5 * clamp((k - 0.2) * 2); ctx.fillStyle = (i + j) % 3 ? '#C9AE84' : color; ctx.fillRect(x0 + i * cell + 10, y0 + j * cell + 10, cell - 20, cell - 20); ctx.globalAlpha = 1; } }
}
/** a ballot box; drop 0..1 lowers a paper slip into the slot */
export function ballotBox(x, y, drop = 0) {
  cut(P_rr(x - 160, y - 200, 320, 200, 10), '#7A5236', { shadow: 0.8, edge: 4 }); cut(P_rr(x - 60, y - 210, 120, 16, 6), '#2A1E16', { shadow: 0, edge: 2 });
  if (drop < 1) { const yy = lerp(y - 420, y - 210, eio(clamp(drop))); cut(P_rr(x - 50, yy - 120, 100, 130, 4), '#F4EEDD', { shadow: 0.5, edge: 3 }); line([[x - 30, yy - 80], [x + 30, yy - 80]], P.ink, 4); }
}
/** a strip of Indian tricolour (saffron, white, green) used for 1950/1954 */
export function tricolourDot(x, y, r = 22) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); ctx.fillStyle = '#D98C2B'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r / 3); ctx.fillStyle = '#F4EEDD'; ctx.fillRect(x - r, y - r / 3, 2 * r, 2 * r / 3); ctx.fillStyle = '#4F7D3A'; ctx.fillRect(x - r, y + r / 3, 2 * r, 2 * r / 3); ctx.restore(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = P.edge; ctx.lineWidth = 4; ctx.stroke(); circle(x, y, r * 0.18, P.royal); }

// ═════════════════════════ A TOWN ON THE COAST (Pondicherry growing) ═════════════════════════
const TOWN = [   // x, row (0 = back, 1 = front), w, h, wall, roof — houses appear in this order as the town grows
  [900, 1, 110, 120], [1040, 1, 96, 104], [760, 1, 100, 110], [1170, 1, 104, 116], [640, 1, 92, 100], [1300, 1, 98, 108],
  [960, 0, 80, 88], [1100, 0, 76, 84], [820, 0, 78, 86], [520, 1, 96, 104], [1430, 1, 100, 112], [1230, 0, 74, 82],
  [700, 0, 74, 80], [400, 1, 90, 98], [1560, 1, 96, 104], [1360, 0, 76, 84], [580, 0, 72, 78], [290, 1, 86, 94],
  [1680, 1, 92, 100], [1490, 0, 72, 80], [460, 0, 70, 76], [190, 1, 80, 88], [1790, 1, 84, 92], [1610, 0, 70, 78],
];
const WALLS = ['#E3D2AC', '#D8C49A', '#EADBB8', '#CDB892'], ROOFS = ['#A8503E', '#8C5A3C', '#B0623E', '#7A4B33'];
/** a coastal town seen from the sea. grow 0..1 = how much of it is built (a first hut → fort, church, streets of houses).
 *  o = { flag, flagRaise, flag2, flag2Raise (a second flag going up), ships: [[x, spec, dir]], fort (0..1), night } */
export function townScene(t, grow = 1, o = {}) {
  const base = 640, g = clamp(grow), n = Math.round(g * TOWN.length);
  parchment(67); ctx.fillStyle = o.night ? '#3A4262' : P.sky; ctx.fillRect(-300, -300, W + 600, base + 300);
  if (!o.night) cut(P_circ(1640, 190, 62), '#EFC66A', { shadow: 0.4, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-300, base); ctx.lineTo(-300, 470); ctx.bezierCurveTo(300, 420, 800, 500, 1200, 450); ctx.bezierCurveTo(1500, 420, 1800, 480, W + 300, 440); ctx.lineTo(W + 300, base); ctx.closePath(); }, '#B9B48A', { shadow: 0.3, edge: 4 });   // low green hinterland
  for (const [px, ps, sd] of [[120, 0.9, 1], [1010, 0.7, 3], [1850, 0.95, 5], [345, 0.75, 2], [1520, 0.7, 4]]) R.palm(px, base - 6, ps, t, sd);
  for (let i = 0; i < n; i++) { const [x, row, w, h] = TOWN[i]; if (row === 0) R.house(x, base - 26, w, h, WALLS[i % 4], ROOFS[(i + 1) % 4], eob(clamp(g * TOWN.length - i))); }
  const fort = clamp(o.fort ?? (g - 0.25) * 3);
  if (fort > 0) { ctx.save(); ctx.translate(960, base); ctx.scale(1, eob(fort)); cut(() => { ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(-210, -84); for (let x = -210; x < 210; x += 42) { ctx.lineTo(x, -84); ctx.lineTo(x, -104); ctx.lineTo(x + 21, -104); ctx.lineTo(x + 21, -84); } ctx.lineTo(210, -84); ctx.lineTo(210, 0); ctx.closePath(); }, P.stone, { shadow: 0.7, edge: 4 }); cut(P_rr(-36, -150, 72, 150, 4), P.stoneDark, { shadow: 0.5, edge: 4 }); cut(P_rr(-16, -46, 32, 46, 16), '#2A1E16', { shadow: 0, edge: 2 }); ctx.restore();
    if (fort > 0.8) { A.flag(960, base - 150, t, o.flag || A.FLAGS.french, { s: 1.25, raise: o.flagRaise ?? 1, droop: 1 - (o.flagRaise ?? 1) }); if (o.flag2) A.flag(1040, base - 104, t, o.flag2, { s: 1.1, raise: o.flag2Raise ?? 0 }); } }
  const church = clamp((g - 0.6) * 4); if (church > 0) { ctx.save(); ctx.translate(1380, base - 20); ctx.scale(eob(church), eob(church)); cut(P_rr(-46, -110, 92, 110, 3), '#EADBB8', { shadow: 0.6, edge: 4 }); cut(P_poly([[-24, -110], [0, -200], [24, -110]]), '#8C5A3C', { shadow: 0.4, edge: 3 }); ctx.fillStyle = P.ink; ctx.fillRect(-2, -224, 4, 26); ctx.fillRect(-9, -216, 18, 4); ctx.restore(); }
  for (let i = 0; i < n; i++) { const [x, row, w, h] = TOWN[i]; if (row === 1 && Math.abs(x - 960) > 250) R.house(x, base, w, h, WALLS[i % 4], ROOFS[i % 4], eob(clamp(g * TOWN.length - i))); }
  cut(P_rr(-300, base - 4, W + 600, 70, 0), '#E3CFA0', { shadow: 0.3, edge: 4 });                                        // the beach
  for (let i = 0; i < 4; i++) { const y = base + 56 + i * 96; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.009 + t * 1.5 + i) * 14); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.6, edge: 5 });
    if (i === 0) for (const [sx, spec, dir] of (o.ships || [])) { ctx.save(); ctx.translate(sx, y + 34 + Math.sin(t * 2 + sx) * 6); ctx.scale(dir || 1, 1); ctx.rotate(Math.sin(t * 1.6 + sx) * 0.03); shipSmall(0.5, t, spec); ctx.restore(); } }
}
function shipSmall(s, t, flagSpec) { ctx.save(); ctx.scale(s, s); cut(P_poly([[-300, -60], [300, -60], [240, 60], [-240, 60]]), '#7A5236'); for (const mx of [-120, 90]) { cut(P_rr(mx - 9, -470, 18, 420, 6), P.ink, { shadow: 0.5, edge: 3 }); const b = 1 + 0.03 * Math.sin(t * 2 + mx); cut(P_poly([[mx - 120 * b, -420], [mx + 110 * b, -420], [mx + 95 * b, -140], [mx - 105 * b, -140]]), P.edge); } A.flag(-270, -60, t, flagSpec, { s: 1.6 }); ctx.restore(); }
export { shipSmall };

// ═════════════════════════ A FACTORY (trading post) OPENING ═════════════════════════
/** the French factory at Surat: a warehouse by the river. open 0..1 swings the doors; flagRaise 0..1; goods 0..1 stacks bales, barrels and crates outside; sign 0..1 */
export function factoryScene(t, { open = 0, flagRaise = 0, goods = 0, sign = 0, title = 'FRENCH FACTORY' } = {}) {
  const base = 800;
  parchment(69); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, base + 300);
  cut(P_circ(300, 200, 62), '#EFC66A', { shadow: 0.4, edge: 5 });
  for (let i = 0; i < 2; i++) { const y = 520 + i * 60; cut(() => { ctx.beginPath(); ctx.moveTo(-300, base); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 1.4 + i) * 10); ctx.lineTo(W + 300, base); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.5, edge: 5 }); }   // the river Tapti
  ctx.save(); ctx.translate(1640, 590 + Math.sin(t * 2) * 5); shipSmall(0.42, t, A.FLAGS.french); ctx.restore();
  cut(P_rr(-300, base - 110, W + 600, 500, 0), '#C9B48A', { shadow: 0.3, edge: 4 });
  R.palm(250, base - 100, 1.0, t, 1); R.palm(1500, base - 104, 0.85, t, 2);
  // the warehouse
  const x0 = 560, w = 800, h = 360;
  cut(P_rr(x0, base - h, w, h, 4), '#E3D2AC', { shadow: 0.9, edge: 5 });
  cut(P_poly([[x0 - 30, base - h + 6], [x0 + 90, base - h - 120], [x0 + w - 90, base - h - 120], [x0 + w + 30, base - h + 6]]), '#A8503E', { shadow: 0.7, edge: 5 });
  ctx.strokeStyle = 'rgba(62,44,30,0.25)'; ctx.lineWidth = 3; for (let i = 1; i < 9; i++) { ctx.beginPath(); ctx.moveTo(x0 + 90 + i * (w - 180) / 9 - 12, base - h - 114); ctx.lineTo(x0 + i * w / 9 - 3, base - h + 2); ctx.stroke(); }
  for (const dx of [110, 250, 550, 690]) { cut(P_rr(x0 + dx - 34, base - h + 70, 68, 90, 30), '#6E7F8C', { shadow: 0.2, edge: 4 }); }
  // doorway: dark interior with stacked goods, two leaves swinging open
  const dx0 = x0 + w / 2 - 90, dw = 180, dh = 230, op = eio(clamp(open));
  cut(() => { ctx.beginPath(); ctx.moveTo(dx0, base); ctx.lineTo(dx0, base - dh + 90); ctx.arc(dx0 + 90, base - dh + 90, 90, Math.PI, TAU); ctx.lineTo(dx0 + dw, base); ctx.closePath(); }, '#2A1E16', { shadow: 0, edge: 5 });
  if (op > 0.3) { ctx.save(); ctx.globalAlpha = clamp((op - 0.3) * 2); R.goods('bale', dx0 + 60, base - 4, 1, '#C9AE84'); R.goods('bale', dx0 + 122, base - 4, 1, '#3D5A80'); R.goods('bale', dx0 + 90, base - 44, 1, '#A8322D'); ctx.restore(); }
  for (const k of [0, 1]) { ctx.save(); ctx.translate(k ? dx0 + dw : dx0, base); ctx.scale((k ? -1 : 1) * lerp(1, 0.16, op), 1); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -dh + 90); ctx.arc(90, -dh + 90, 90, Math.PI, Math.PI * 1.5); ctx.lineTo(90, 0); ctx.closePath(); }, '#7A5236', { shadow: 0.4, edge: 4 }); ctx.restore(); }
  // sign board + flag
  if (sign > 0) { ctx.save(); ctx.translate(x0 + w / 2, base - h + 34); ctx.scale(eob(clamp(sign)), eob(clamp(sign))); ctx.font = `700 34px ${SERIF}`; const tw = ctx.measureText(title).width + 50; cut(P_rr(-tw / 2, -28, tw, 56, 6), '#3D5A80', { shadow: 0.6, edge: 4 }); ctx.fillStyle = '#F4EEDD'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '3px'; ctx.fillText(title, 0, 2); ctx.letterSpacing = '0px'; ctx.restore(); }
  A.flag(x0 + w / 2, base - h - 120, t, A.FLAGS.french, { s: 1.5, raise: clamp(flagRaise), droop: 1 - clamp(flagRaise) });
  // goods stacking up outside
  const G = [['bale', 430, '#C9AE84'], ['barrel', 360, null], ['crate', 480, null], ['bale', 445, '#A8322D'], ['barrel', 1420, null], ['crate', 1480, null], ['bale', 1450, '#3D5A80'], ['barrel', 300, null]];
  G.forEach(([kind, gx, col], i) => R.goods(kind, gx, base + 40 - (i === 3 || i === 6 ? 44 : 0), eob(clamp(goods * G.length - i)), col || undefined));
}

// ═════════════════════════ THE MAP AS A CHESSBOARD ═════════════════════════
export const KINGS = [   // name, piece colour, place, side of the place (-1 left, 1 right), backer
  ['Muzaffar Jang', 'nizam', 'Hyderabad', -1, 'french'], ['Nasir Jang', 'nizam', 'Hyderabad', 1, 'english'],
  ['Chanda Sahib', 'nawab', 'Arcot', -1, 'french'], ['Anwar-ud-din', 'nawab', 'Arcot', 1, 'english']];
/** south India as the board: a faint chequer inked onto the land, HYDERABAD and THE CARNATIC named. Returns the view. */
export function kingsMap(t, { p = 1, labels = 1 } = {}) {
  const v = A.realMap({ view: 'kings', t });
  if (p > 0) { ctx.save(); A.mainland(v)(); ctx.clip(); ctx.globalAlpha = 0.5 * clamp(p); for (let i = -2; i < 22; i++) for (let j = 0; j < 12; j++) if ((i + j) % 2) { ctx.fillStyle = 'rgba(62,44,30,0.16)'; ctx.fillRect(i * 96 + 30, j * 96 + 20, 96, 96); } ctx.restore(); }
  if (labels > 0) { const h = A.at(v, 'Hyderabad'), a = A.at(v, 'Arcot'); A.placeLabel('HYDERABAD', h[0], h[1] + 44, { size: 26, sc: eob(clamp(labels)), dy: 0 }); A.placeLabel('THE CARNATIC', a[0], a[1] + 44, { size: 26, sc: eob(clamp(labels)), dy: 0 }); }
  return v;
}
export const kingXY = (v, i) => { const [, , place, side] = KINGS[i], [x, y] = A.at(v, place); return [x + side * 150, y]; };
/** the four princes as chess kings standing at their real places, with French (blue) and English (crimson) pieces behind them.
 *  o = { kingsP(i) pop 0..1, backP: { french, english } slide-in 0..1, fall: { name: 0..1 }, crown: name, wobble, turned: 0..1 (blue backers turn crimson) } */
export function kingPieces(v, o = {}) {
  KINGS.forEach(([n, side, place, sd, backer], i) => {
    const [x, y] = kingXY(v, i), kp = o.kingsP ? o.kingsP(i) : 1, bp = (o.backP || {})[backer] ?? 1, fall = (o.fall || {})[n] || 0;
    if (bp > 0) { const bx = lerp(x + sd * 420, x + sd * 96, eio(clamp(bp))), col = backer === 'french' && (o.turned || 0) > 0.5 ? 'english' : backer; A.chessPiece(bx, y + 6, { kind: 'pawn', side: col, s: 1.25, sc: clamp(bp * 4) }); }
    A.chessPiece(x, y, { kind: 'king', side, s: 1.2, sc: eob(clamp(kp)), label: kp > 0.6 ? n : null, fall: fall + (backer === 'french' && !fall ? (o.wobble || 0) : 0), dir: sd, crown: o.crown === n });
  });
}

// ═════════════════════════ THE VOYAGE MAP (France → India) ═════════════════════════
/** the wide map from France to India. blue 0..1 draws the long French sea route (round the Cape, via Mauritius) with a ship riding its tip;
 *  red 0..1 draws the short English route Bengal → Madras. labels 0..1 */
export function voyageMap(t, { blue = 0, red = 0, labels = 1, broken = false, ship = true, simple = false } = {}) {
  const v = A.realMap({ view: 'voyage', t }), P2 = (pts) => pts.map(([a, b]) => A.proj(v, a, b));
  const fr = A.proj(v, 2.3, 47), pd = A.at(v, 'Pondicherry'), ca = A.at(v, 'Calcutta'), mu = A.at(v, 'Mauritius');
  if (blue > 0) { const h = A.drawPolyline(P2(A.SEA_ROUTE), blue, P.royal, 7, broken ? [18, 16] : [26, 12]); if (ship && blue < 1) { ctx.save(); ctx.translate(h[0], h[1] - 6); shipSmall(0.12, t, A.FLAGS.french); ctx.restore(); } }
  if (red > 0) { const pts = P2(A.BENGAL_ROUTE); ctx.save(); ctx.shadowColor = 'rgba(70,45,20,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; A.drawPolyline(pts, red, P.crimson, 18); ctx.restore(); }
  A.pin(fr[0], fr[1], 'french', { r: 14, star: true });
  if (simple) { const sc = eob(clamp(labels)); A.placeLabel('FRANCE', fr[0], fr[1], { dx: 120, dy: 0, size: 28, sc }); A.placeLabel('INDIA', ...A.proj(v, 79, 21), { size: 28, dy: 0, sc }); A.placeLabel('CAPE OF GOOD HOPE', ...A.proj(v, 18.5, -34), { dx: -170, dy: 0, size: 20, sc }); return v; }
  A.pin(pd[0], pd[1], 'french', { r: 10 }); A.pin(ca[0], ca[1], 'english', { r: 10 }); A.pin(mu[0], mu[1], 'french', { r: 8 });
  if (labels > 0) { const sc = eob(clamp(labels)); A.placeLabel('FRANCE', fr[0], fr[1], { dx: 120, dy: 0, size: 28, sc }); A.placeLabel('MAURITIUS', mu[0], mu[1], { dx: 130, dy: 6, size: 22, sc }); A.placeLabel('PONDICHERRY', pd[0], pd[1], { dx: 150, dy: 16, size: 22, sc }); A.placeLabel('BENGAL', ca[0], ca[1], { dx: 100, dy: -10, size: 22, sc }); A.placeLabel('CAPE OF GOOD HOPE', ...A.proj(v, 18.5, -34), { dx: -170, dy: 0, size: 20, sc }); }
  return v;
}
export { person, R, A };
