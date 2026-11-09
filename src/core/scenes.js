// Paper Atlas 16:9 · SHARED SCENES for "So Close to Empire" (used by several chapters; cut paper, style palette only).
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eob, eio, rnd, circle, line } from './lib.js';
import { P, cut, P_rr, P_circ, P_poly, parchment, ribbon, slip, label } from './kit.js';
import * as A from './atlas.js';
import * as R from './props.js';
import { person } from './cast.js';

const SERIF = 'Caladea';
/** Lally's room in Paris at dawn: door, chair with his coat, a candle on a small table (CH0 and CH7) */
export function parisRoom(t, { out = 0, seal = 0 } = {}) {
  R.room({ wall: '#B9A98C', floor: '#6E5A44', fl: 840, seed: 17 }); R.dawnWash(0.9);
  R.windowPane(1320, 140, 300, 420, { sky: '#5A7096', sea: false, t, stars: false });
  R.door(240, 220, 300, 620);
  R.chairWithCoat(860, 840, { s: 1.05 });
  R.table(1180, 700, 260, { h: 140 }); R.candle(1180, 676, t, { s: 1.1, out });
  if (seal > 0) A.wordSeal('COUPABLE', 1500, 700, lerp(1.9, 0.95, eo(clamp(seal / 0.25))), clamp(seal * 4), P.crimson, 30);
}
/** a paper crown icon */
export function crown(x, y, s = 1, col = P.gold) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-70, 40], [-80, -40], [-36, 0], [0, -60], [36, 0], [80, -40], [70, 40]]), col, { shadow: 0.7, edge: 4 }); cut(P_rr(-74, 30, 148, 24, 6), col, { shadow: 0.4, edge: 3 }); ctx.restore(); }
/** the Europe map with two crowns that slide in and clash at p = 1 (paper sparks fly after) */
export function europeClash(t, p, { a = 'FRANCE', b = 'BRITAIN' } = {}) {
  const v = A.realMap({ view: 'europe', set: 'europe', t });
  const [fx, fy] = A.proj(v, 2.3, 47), [bx, by] = A.proj(v, -1.5, 52.5);
  A.inkBleed(fx, fy, 260, 1, P.royal, { clipFn: A.landPath(v, 'europe'), seed: 4, alpha: 0.35 });
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
export function fortWalls(t, { rain = 0, night = false, flagCols = A.FLAGS.english, torches = false, white = 0 } = {}) {
  parchment(71); ctx.fillStyle = night ? '#2F3550' : rain ? '#8C97A0' : P.sky; ctx.fillRect(-300, -300, W + 600, 820);
  cut(P_rr(-300, 760, W + 600, 600, 0), night ? '#4A3A2E' : '#8C6B4E', { shadow: 0, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.moveTo(100, 780); ctx.lineTo(100, 380); for (let x = 100; x < 1820; x += 80) { ctx.lineTo(x, 380); ctx.lineTo(x, 340); ctx.lineTo(x + 40, 340); ctx.lineTo(x + 40, 380); } ctx.lineTo(1820, 380); ctx.lineTo(1820, 780); ctx.closePath(); }, P.stone, { shadow: 0.8, edge: 4 });
  cut(P_rr(820, 200, 280, 580, 6), P.stoneDark, { shadow: 0.8, edge: 4 }); cut(P_rr(900, 600, 120, 180, 60), '#2A1E16', { shadow: 0, edge: 3 });
  ctx.strokeStyle = 'rgba(62,44,30,0.25)'; ctx.lineWidth = 3; for (let r = 0; r < 6; r++) for (let c = 0; c < 22; c++) { const x = 110 + c * 80 + (r % 2) * 40, y = 400 + r * 62; if (x > 800 && x < 1110) continue; ctx.strokeRect(x, y, 80, 62); }
  A.flag(960, 200, t, white > 0 ? ['#F4EEDD', '#F4EEDD', '#F4EEDD'] : flagCols, { s: 1.4 });
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
export { person, R, A };
