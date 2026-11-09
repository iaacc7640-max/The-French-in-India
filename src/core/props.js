// Paper Atlas 16:9 · PROPS AND ROOMS for "So Close to Empire" (cut paper, style palette only).
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eob, rnd, circle, line } from './lib.js';
import { P, cut, P_rr, P_circ, P_poly, parchment } from './kit.js';

const WOOD = '#7A5236', WOOD2 = '#5E3B28', STONE = P.stone, NIGHT = '#2F3550';

/** an interior wall with a floor line; wash = optional colour wash (night / dawn) */
export function room({ wall = '#CDB892', floor = '#8C6B4E', fl = 830, seed = 13, wash = null, washA = 0 } = {}) {
  parchment(seed);
  cut(P_rr(-300, -300, W + 600, fl + 300, 0), wall, { shadow: 0, edge: 0 });
  ctx.strokeStyle = 'rgba(62,44,30,0.10)'; ctx.lineWidth = 3; for (let x = -40; x < W + 40; x += 160) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, fl); ctx.stroke(); }
  cut(P_rr(-300, fl, W + 600, 600, 0), floor, { shadow: 0, edge: 0 });
  cut(P_rr(-300, fl - 14, W + 600, 18, 0), WOOD2, { shadow: 0.4, edge: 3 });
  if (wash) { ctx.save(); ctx.globalAlpha = washA; ctx.fillStyle = wash; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
}
/** a tall window: sky with optional sea, stars, moon */
export function windowPane(x, y, w, h, { sky = NIGHT, sea = true, t = 0, stars = true, moon = false } = {}) {
  cut(P_rr(x - 14, y - 14, w + 28, h + 28, 8), WOOD, { shadow: 0.8, edge: 4 });
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
  if (stars) for (let i = 0; i < 26; i++) circle(x + rnd(i + 3) * w, y + rnd(i + 9) * h * 0.6, 2 + rnd(i) * 2, `rgba(233,220,188,${0.5 + 0.5 * Math.sin(t * 2 + i)})`);
  if (moon) circle(x + w * 0.7, y + h * 0.22, 26, '#E9DCBC');
  if (sea) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - 10, y + h); for (let xx = x - 10; xx <= x + w + 10; xx += 16) ctx.lineTo(xx, y + h * (0.66 + i * 0.1) + Math.sin(xx * 0.03 + t * 1.4 + i) * 5); ctx.lineTo(x + w + 10, y + h); ctx.closePath(); ctx.fillStyle = i % 2 ? '#3E4A66' : '#47557A'; ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = WOOD; ctx.fillRect(x + w / 2 - 6, y, 12, h); ctx.fillRect(x, y + h * 0.45 - 6, w, 12);
}
/** a candle with a living flame; out 0..1 snuffs it (flame shrinks, a smoke wisp rises) */
export function candle(x, y, t, { s = 1, out = 0, glow = true } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const lit = 1 - clamp(out);
  if (glow && lit > 0) { const g = ctx.createRadialGradient(0, -90, 0, 0, -90, 260); g.addColorStop(0, `rgba(242,190,90,${0.32 * lit})`); g.addColorStop(1, 'rgba(242,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -380, 600, 600); }
  cut(P_rr(-36, -8, 72, 16, 6), P.gold, { shadow: 0.5, edge: 3 });
  cut(P_rr(-16, -86, 32, 80, 6), '#F1E6CC', { shadow: 0.5, edge: 3 });
  line([[0, -86], [0, -98]], P.ink, 3);
  if (lit > 0) { const f = 1 + 0.12 * Math.sin(t * 13) + 0.06 * Math.sin(t * 29); ctx.save(); ctx.translate(Math.sin(t * 7) * 1.5, -98); ctx.scale(lit, lit * f);
    cut(() => { ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-12, -24, 0, -44); ctx.quadraticCurveTo(12, -24, 10, 0); ctx.closePath(); }, '#E0782E', { shadow: 0, edge: 2 });
    cut(() => { ctx.beginPath(); ctx.moveTo(-5, 0); ctx.quadraticCurveTo(-6, -14, 0, -26); ctx.quadraticCurveTo(6, -14, 5, 0); ctx.closePath(); }, '#F2C14E', { shadow: 0, edge: 0 }); ctx.restore(); }
  if (out > 0 && out < 1.8) { ctx.save(); ctx.globalAlpha = clamp(1.4 - out * 0.8); ctx.strokeStyle = '#8F8578'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = -100 - i * 8 * clamp(out * 1.5); ctx.lineTo(Math.sin(i * 0.6 + t * 3) * 10 * i / 20, yy); } ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
/** a heavy wooden door in a stone frame; open 0..1 (0 = shut) */
export function door(x, y, w, h, { open = 0 } = {}) {
  cut(P_rr(x - 30, y - 30, w + 60, h + 30, 6), STONE, { shadow: 0.8, edge: 4 });
  cut(P_rr(x, y, w, h, 4), '#2A1E16', { shadow: 0, edge: 0 });
  const k = 1 - clamp(open) * 0.75; ctx.save(); ctx.translate(x, y); ctx.scale(k, 1);
  cut(P_rr(0, 0, w, h, 4), WOOD2, { shadow: 0.6, edge: 4 });
  ctx.strokeStyle = 'rgba(30,20,12,0.45)'; ctx.lineWidth = 5; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(w * i / 5, 8); ctx.lineTo(w * i / 5, h - 8); ctx.stroke(); }
  for (const yy of [h * 0.18, h * 0.78]) cut(P_rr(-6, yy, w * 0.7, 22, 4), '#3E3A36', { shadow: 0.3, edge: 2 });
  circle(w * 0.84, h * 0.52, 12, P.gold);
  ctx.restore();
}
/** a chair with a coat draped over it (Lally's coat: royal blue, gold trim, Irish green ribbon) */
export function chairWithCoat(x, y, { s = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-110, -420, 26, 420, 6), WOOD, { shadow: 0.6, edge: 3 }); cut(P_rr(84, -230, 22, 230, 6), WOOD, { shadow: 0.6, edge: 3 }); cut(P_rr(-110, -250, 216, 30, 8), WOOD, { shadow: 0.6, edge: 3 });
  cut(P_poly([[-130, -430], [-60, -440], [-40, -250], [20, -240], [40, -120], [-150, -110]]), P.royal, { shadow: 0.8, edge: 4 });
  ctx.fillStyle = P.gold; ctx.fillRect(-100, -430, 10, 300);
  cut(P_poly([[-80, -380], [-62, -380], [-58, -330], [-71, -340], [-84, -330]]), '#4F8A4A', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** a table (map table / desk); top at y */
export function table(x, y, w, { h = 230, cloth = null } = {}) {
  for (const k of [-1, 1]) cut(P_rr(x + k * (w / 2 - 40) - 14, y, 28, h, 6), WOOD2, { shadow: 0.6, edge: 3 });
  cut(P_rr(x - w / 2, y - 26, w, 30, 6), WOOD, { shadow: 0.8, edge: 4 });
  if (cloth) cut(P_poly([[x - w / 2 + 10, y - 22], [x + w / 2 - 10, y - 22], [x + w / 2 - 30, y + 80], [x - w / 2 + 30, y + 80]]), cloth, { shadow: 0.5, edge: 3 });
}
/** an open ledger lying on a desk */
export function ledger(x, y, s = 1, { open = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-130, 0], [0, 10], [0, -60], [-120, -70]]), '#F1E6CC', { shadow: 0.6, edge: 3 });
  cut(P_poly([[0, 10], [130 * open, 0], [120 * open, -70], [0, -60]]), '#F1E6CC', { shadow: 0.6, edge: 3 });
  ctx.strokeStyle = 'rgba(62,44,30,0.4)'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-110, -54 + i * 11); ctx.lineTo(-14, -48 + i * 11); ctx.moveTo(14, -48 + i * 11); ctx.lineTo(108 * open, -54 + i * 11); ctx.stroke(); }
  ctx.restore();
}
/** a horse with a saddle and a turban resting on the empty saddle (Ambur, told with objects) */
export function emptySaddle(x, y, t, { s = 1, turban = P.gold } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const b = Math.sin(t * 1.4) * 3;
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -210 + b * 0.3, 210, 90, 0, 0, TAU); }, '#6E4A34', { shadow: 0.8, edge: 4 });
  cut(P_poly([[150, -250], [230, -390 + b], [290, -370 + b], [250, -300], [200, -200]]), '#6E4A34', { shadow: 0.6, edge: 4 });
  for (const lx of [-150, -100, 110, 160]) cut(P_rr(lx - 14, -150, 28, 150, 8), '#5A3B28', { shadow: 0.5, edge: 3 });
  cut(P_poly([[-60, -300], [70, -300], [60, -250], [-50, -250]]), P.forest, { shadow: 0.6, edge: 3 });
  cut(P_poly([[-70, -300], [-50, -330], [60, -330], [80, -300]]), P.crimson, { shadow: 0.5, edge: 3 });
  ctx.save(); ctx.translate(0, -352); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 58, 30, 0, Math.PI, TAU); ctx.lineTo(54, 10); ctx.lineTo(-54, 10); ctx.closePath(); }, turban, { shadow: 0.5, edge: 3 }); circle(16, -14, 6, P.crimson); ctx.restore();
  ctx.restore();
}
/** a throne (cut paper) */
export function throne(x, y, { s = 1, col = '#3F5E3A' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-110, -420, 220, 420, 20), col, { shadow: 0.8, edge: 4 }); cut(P_rr(-140, -170, 280, 50, 14), P.gold, { shadow: 0.6, edge: 3 });
  cut(P_poly([[-60, -420], [0, -500], [60, -420]]), P.gold, { shadow: 0.5, edge: 3 });
  ctx.restore();
}
/** a sleeve and hand reaching down from above to (x, y), holding something drawn by hold() at the fingertips */
export function reachingHand(x, y, { sleeve = P.royal, cuff = '#F4EEDD', hold = null } = {}) {
  cut(P_rr(x - 34, y - 700, 68, 560, 30), sleeve, { shadow: 0.7, edge: 4 });
  cut(P_rr(x - 40, y - 160, 80, 40, 12), cuff, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(x, y - 86, 34, 44, 0, 0, TAU); }, P.skin, { shadow: 0.5, edge: 3 });
  if (hold) { ctx.save(); ctx.translate(x, y - 40); hold(); ctx.restore(); }
}
/** an army as a block of dots; march 0..1 fills it in; scatter 0..1 sends the dots outward (nobody is shown hurt) */
export function dotArmy(cx, cy, cols, rows, gap, col, { t = 0, scatter = 0, r = 6, march = 1, seed = 1, dir = 1 } = {}) {
  ctx.fillStyle = col;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const k = i * rows + j; if (rnd(k * 0.37 + seed) > march) continue;
    let x = cx + (i - cols / 2) * gap + Math.sin(t * 3 + k) * 1.5, y = cy + (j - rows / 2) * gap + Math.cos(t * 2.3 + k) * 1.2;
    if (scatter > 0) { const a = rnd(k * 1.7 + seed) * TAU, d = scatter * (120 + rnd(k + 9) * 500); x += Math.cos(a) * d + dir * scatter * 380; y += Math.sin(a) * d * 0.5; }
    ctx.globalAlpha = 1 - scatter * 0.85; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
/** dawn wash for Paris scenes */
export function dawnWash(a = 1) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(61,90,128,${0.55 * a})`); g.addColorStop(0.7, `rgba(200,149,47,${0.18 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600); }
/** crossed swords slip (the "battle" icon), struck through with p 0..1 */
export function crossedSwords(x, y, s = 1, strike = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) { ctx.save(); ctx.rotate(k * 0.7); cut(P_rr(-8, -150, 16, 240, 5), '#B9A98C', { shadow: 0.5, edge: 3 }); cut(P_rr(-36, 60, 72, 16, 6), P.gold, { shadow: 0.4, edge: 3 }); ctx.restore(); }
  if (strike > 0) line([[-170, -110], [-170 + 340 * clamp(strike), -110 + 220 * clamp(strike)]], P.crimson, 16);
  ctx.restore();
}
