// Paper Atlas 16:9 · LIVING MAPS AND STORY GRAPHICS for the French in India.
// realMap (Natural Earth land, data/geo.json) · pins · inkBleed · statCard · chessboard · supplyLine · chapterCard.
// Everything is cut paper (K.cut) in the style palette. French = royal blue, English = crimson (fixed all video).
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eob, eio, rnd, rr, circle, line } from './lib.js';
import { P, cut, P_rr, P_circ, P_poly, parchment, label, slip, ribbon, compass } from './kit.js';

const SERIF = 'Caladea';
export const SIDE = {
  french: { fill: P.royal, light: '#7C93B5', text: '#F4EEDD' },
  english: { fill: P.crimson, light: '#C9716B', text: '#F4EEDD' },
  dutch: { fill: '#D9792B', light: '#E7A56E', text: '#F4EEDD' },
  nawab: { fill: P.forest, light: '#A8B184', text: '#F4EEDD' },
  nizam: { fill: '#3F5E3A', light: '#88A07F', text: '#F4EEDD' },
  maratha: { fill: '#D98C2B', light: '#E8B66E', text: '#3E2C1E' },
};

// ═════════════════════════ GEOGRAPHY ═════════════════════════
let GEO = null;
export function setGeo(g) { GEO = g; }
/** places: [lon, lat]. Approximate positions of the towns (to 0.05°), checked on the rendered map against the coast. */
export const PLACES = {
  Pondicherry: [79.83, 11.93], Karaikal: [79.84, 10.92], Mahe: [75.53, 11.70], Yanam: [82.21, 16.73],
  Chandernagore: [88.38, 22.87], Masulipatnam: [81.13, 16.17], Surat: [72.83, 21.17],
  Madras: [80.28, 13.08], 'Fort St David': [79.77, 11.74], Calcutta: [88.36, 22.57], Bombay: [72.83, 18.95],
  Arcot: [79.32, 12.90], Ambur: [78.72, 12.79], Trichinopoly: [78.69, 10.80], Srirangam: [78.69, 10.86],
  Adyar: [80.26, 13.01], Wandiwash: [79.62, 12.50], Hyderabad: [78.48, 17.38], Golconda: [78.40, 17.38],
  Bijapur: [75.71, 16.83], Plassey: [88.25, 23.80], Kizhur: [79.75, 11.98], Tanjore: [79.14, 10.79],
};
/** the Krishna river, simplified (west → east, ends at the delta) */
export const KRISHNA = [[73.6, 17.9], [74.6, 16.9], [75.7, 16.4], [76.6, 16.3], [77.6, 16.1], [78.3, 16.1], [79.2, 16.6], [80.1, 16.6], [80.6, 16.3], [81.1, 15.8]];
/** map views: centre lon/lat and degrees of longitude across the frame */
export const VIEWS = {
  india: { lon: 83, lat: 15.6, deg: 36 },          // south India + Bengal, Bay of Bengal on the right for cards
  south: { lon: 80.6, lat: 13.6, deg: 17 },      // the Carnatic + Hyderabad
  carnatic: { lon: 80.0, lat: 12.4, deg: 9 },    // Madras, Arcot, Ambur, Wandiwash, Pondicherry, Trichinopoly
  bengal: { lon: 87.5, lat: 22.0, deg: 9 },
  ocean: { lon: 66, lat: 2, deg: 62 },            // Mauritius → India sea lane
  europe: { lon: 6, lat: 48, deg: 34 },
};
export function proj(v, lon, lat) {
  const c = Math.cos(v.lat * Math.PI / 180), k = W / (v.deg * c);
  return [W / 2 + (lon - v.lon) * k * c, H / 2 - (lat - v.lat) * k];
}
export const at = (v, name) => proj(v, ...PLACES[name]);
function ringPath(v, rings) { ctx.beginPath(); for (const r of rings) { r.forEach(([lo, la], i) => { const [x, y] = proj(v, lo, la); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); } }
export const landPath = (v, set = 'south_asia') => () => ringPath(v, GEO[set]);

/** a real-coastline map page. o = { view, set ('south_asia'|'indian_ocean'|'europe'), t (water ripple), grid } */
export function realMap(o = {}) {
  const v = typeof o.view === 'string' ? VIEWS[o.view] : (o.view || VIEWS.india), t = o.t || 0;
  parchment(o.seed || 3);
  ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = P.sea; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  // living water: faint moving swell lines
  ctx.save(); ctx.strokeStyle = 'rgba(247,239,220,0.22)'; ctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) { const y = 40 + i * 80; ctx.beginPath(); for (let x = -40; x <= W + 40; x += 30) { const yy = y + Math.sin(x * 0.012 + t * 0.9 + i * 1.7) * 6; x === -40 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.setLineDash([40, 60]); ctx.lineDashOffset = -t * 20 - i * 30; ctx.stroke(); }
  ctx.restore();
  if (o.grid !== false) { ctx.strokeStyle = 'rgba(62,44,30,0.12)'; ctx.lineWidth = 2; for (let lo = -180; lo <= 180; lo += 5) { const [x] = proj(v, lo, v.lat); if (x > -10 && x < W + 10) { ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x, H + 10); ctx.stroke(); } } for (let la = -60; la <= 70; la += 5) { const [, y] = proj(v, v.lon, la); if (y > -10 && y < H + 10) { ctx.beginPath(); ctx.moveTo(-10, y); ctx.lineTo(W + 10, y); ctx.stroke(); } } }
  for (const set of [o.set || 'south_asia', ...(o.also || [])]) cut(landPath(v, set), P.land, { shadow: 0.8, edge: 5 });
  return v;
}
/** clip subsequent drawing to the land of a view (use inside save/restore) */
export function clipLand(v, set = 'south_asia') { landPath(v, set)(); ctx.clip(); }
/** the Krishna drawn as a river line; p 0..1 draws it on */
export function krishna(v, p = 1, w = 7) { const pts = KRISHNA.map(([a, b]) => proj(v, a, b)); drawPolyline(pts, p, P.sea, w); }
export function drawPolyline(pts, p, color, w, dash) {
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
  let left = tot * clamp(p); ctx.beginPath(); ctx.moveTo(...pts[0]); let head = [...pts[0], 0];
  for (let i = 1; i < pts.length && left > 0; i++) { const k = Math.min(1, left / L[i - 1]); const x = lerp(pts[i - 1][0], pts[i][0], k), y = lerp(pts[i - 1][1], pts[i][1], k); ctx.lineTo(x, y); head = [x, y, Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])]; left -= L[i - 1]; }
  ctx.save(); if (dash) ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  return head;
}

// ═════════════════════════ PINS AND LABELS ═════════════════════════
/** a coloured map pin. side = 'french' | 'english' | ... ; star = capital; sc = pop scale; glow 0..1 */
export function pin(x, y, side = 'french', { sc = 1, star = false, glow = 0, r = 13 } = {}) {
  if (sc <= 0) return; const S = SIDE[side] || SIDE.french;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; circle(0, 0, r * 2.6, S.light); ctx.restore(); }
  if (star) cut(() => { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.75 : r * 1.9; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); }, S.fill, { shadow: 0.5, edge: 4 });
  else cut(P_circ(0, 0, r), S.fill, { shadow: 0.5, edge: 4 });
  ctx.restore();
}
/** a place label on a small paper slip so it reads over any colour (keep labels above y 840) */
export function placeLabel(text, x, y, { size = 26, sc = 1, dy = -36, dx = 0, color = P.ink } = {}) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x + dx, y + dy); ctx.scale(sc, sc);
  ctx.font = `700 ${size}px ${SERIF}`; ctx.letterSpacing = '2px'; const w = ctx.measureText(text).width + 22;
  ctx.fillStyle = 'rgba(243,233,210,0.86)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.62, w, size * 1.24, 4); ctx.fill();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 1); ctx.letterSpacing = '0px'; ctx.restore();
}
/** a small cloth flag on a pole that flutters (sine-wave cloth). colours = stripes top→bottom or a function */
export function flag(x, y, t, colours, { s = 1, droop = 0, seed = 0, vertical = false } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-3, -110, 6, 110, 2), P.ink, { shadow: 0.4, edge: 2 });
  const fw = 74, fh = 48, n = 10, wave = (u) => Math.sin(u * 4 - t * 6 + seed) * 4 * u + droop * u * u * 46;
  const band = (i0, i1, col) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const u = i / n; ctx.lineTo(u * fw, -110 + i0 * fh + wave(u)); } for (let i = n; i >= 0; i--) { const u = i / n; ctx.lineTo(u * fw, -110 + i1 * fh + wave(u)); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  ctx.save(); ctx.shadowColor = 'rgba(70,45,20,0.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 4;
  if (vertical) { const k = colours.length; colours.forEach((c, i) => { ctx.beginPath(); for (let j = 0; j <= n; j++) { const u = (i + j / n) / k; ctx.lineTo(u * fw, -110 + wave(u)); } for (let j = n; j >= 0; j--) { const u = (i + j / n) / k; ctx.lineTo(u * fw, -110 + fh + wave(u)); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); }); }
  else colours.forEach((c, i) => band(i / colours.length, (i + 1) / colours.length, c));
  ctx.restore(); ctx.restore();
}
export const FLAGS = {
  french: [P.royal, '#F4EEDD', P.royal], english: ['#F4EEDD', P.crimson, '#F4EEDD'], dutch: ['#D9792B', '#F4EEDD', P.royal],
  portuguese: ['#F4EEDD', P.royal, '#F4EEDD'], danish: [P.crimson, '#F4EEDD', P.crimson], nawab: [P.forest, P.gold, P.forest],
  india: ['#D98C2B', '#F4EEDD', '#4F7D3A'],
};

// ═════════════════════════ INK-BLEED ═════════════════════════
/** a territory change as ink soaking through paper: a noise-edged blob grows from (cx, cy) to radius R as p goes 0→1.
 *  clipFn (optional) limits it (e.g. to land, or to land south of the Krishna). p going 1→0 = the ink drains back. */
export function inkBleed(cx, cy, R, p, color, { clipFn, seed = 1, alpha = 0.62 } = {}) {
  if (p <= 0) return; const r = R * eo(clamp(p));
  ctx.save(); if (clipFn) { clipFn(); ctx.clip(); }
  const blob = (rad) => { ctx.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, k = 1 + 0.16 * Math.sin(5 * a + seed) + 0.09 * Math.sin(11 * a + seed * 2.3) + 0.05 * Math.sin(23 * a + seed * 4.1); ctx.lineTo(cx + Math.cos(a) * rad * k, cy + Math.sin(a) * rad * k); } ctx.closePath(); };
  ctx.globalAlpha = alpha; blob(r); ctx.fillStyle = color; ctx.fill();
  ctx.globalAlpha = alpha * 0.55; blob(r); ctx.lineWidth = 10; ctx.strokeStyle = color; ctx.stroke();    // the wet, darker rim
  ctx.restore();
}

// ═════════════════════════ STAT CARD ═════════════════════════
/** a torn paper card popping from a map pin: { x, y (card centre), from: [px, py] pin, title, stats: [..1-3], date, portrait(fn at 0,0), p } */
export function statCard(o) {
  const p = o.p ?? 1; if (p <= 0) return; const sc = eob(clamp(p / 0.6));
  const lines = o.stats || [], h = 112 + lines.length * 46 + (o.date ? 44 : 0);
  ctx.font = `700 31px ${SERIF}`; const tw = Math.max(...lines.map((l) => ctx.measureText(l).width), 0); ctx.font = `700 40px ${SERIF}`;
  const w = o.w || Math.max(300, Math.max(tw, ctx.measureText(o.title).width) + (o.portrait ? 150 : 70));
  if (o.from) { ctx.save(); ctx.globalAlpha = clamp(p * 2); ctx.setLineDash([6, 8]); line([o.from, [lerp(o.from[0], o.x, sc), lerp(o.from[1], o.y, sc)]], P.ink, 3); ctx.restore(); }
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(sc, sc); ctx.rotate(o.rot ?? -0.02);
  cut(() => { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); for (let x = -w / 2; x <= w / 2; x += 20) ctx.lineTo(x, -h / 2 + (rnd(x + 3) - 0.5) * 8); for (let y = -h / 2; y <= h / 2; y += 20) ctx.lineTo(w / 2 + (rnd(y + 9) - 0.5) * 8, y); for (let x = w / 2; x >= -w / 2; x -= 20) ctx.lineTo(x, h / 2 + (rnd(x + 7) - 0.5) * 8); ctx.closePath(); }, '#F3E9D2', { shadow: 0.9, edge: 0 });
  circle(0, -h / 2 + 8, 9, P.crimson);
  const tx = o.portrait ? -w / 2 + 112 : -w / 2 + 30;
  if (o.portrait) { ctx.save(); ctx.beginPath(); ctx.arc(-w / 2 + 62, -h / 2 + 66, 40, 0, TAU); ctx.fillStyle = P.parchDark; ctx.fill(); ctx.clip(); ctx.translate(-w / 2 + 62, -h / 2 + 66); o.portrait(); ctx.restore(); ctx.beginPath(); ctx.arc(-w / 2 + 62, -h / 2 + 66, 40, 0, TAU); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.stroke(); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.ink; ctx.font = `700 40px ${SERIF}`; ctx.fillText(o.title, tx, -h / 2 + 60);
  ctx.font = `700 31px ${SERIF}`; lines.forEach((s, i) => { ctx.fillStyle = i === (o.hi ?? -1) ? P.crimson : P.ink; ctx.fillText(s, tx, -h / 2 + 116 + i * 46); });
  if (o.date) { ctx.font = `700 27px ${SERIF}`; ctx.fillStyle = P.sepia; ctx.fillText(o.date, tx, h / 2 - 34); }
  ctx.restore();
}

// ═════════════════════════ CHESSBOARD ═════════════════════════
/** a translucent paper chessboard laid over the map; returns sq(file, rank) → [x, y] board coordinates (0..7) */
export function chessboard({ x = W / 2, y = 470, size = 640, alpha = 0.78, tilt = 0.62, p = 1 } = {}) {
  if (p <= 0) return () => [x, y];
  const s = size / 8, a = clamp(p), sq = (f, r) => [x + (f - 3.5) * s * lerp(0.86, 1.0, r / 7), y + (r - 3.5) * s * tilt];
  ctx.save(); ctx.globalAlpha = alpha * a;
  const cornerTL = sq(-0.5, -0.5), cornerTR = sq(7.5, -0.5), cornerBR = sq(7.5, 7.5), cornerBL = sq(-0.5, 7.5);
  cut(P_poly([[cornerTL[0] - 18, cornerTL[1] - 14], [cornerTR[0] + 18, cornerTR[1] - 14], [cornerBR[0] + 22, cornerBR[1] + 16], [cornerBL[0] - 22, cornerBL[1] + 16]]), '#B9946A', { shadow: 0.8, edge: 4 });
  for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) {
    const c = [sq(f - 0.5, r - 0.5), sq(f + 0.5, r - 0.5), sq(f + 0.5, r + 0.5), sq(f - 0.5, r + 0.5)];
    ctx.beginPath(); c.forEach((q, i) => (i ? ctx.lineTo(...q) : ctx.moveTo(...q))); ctx.closePath(); ctx.fillStyle = (f + r) % 2 ? '#E9DCBC' : '#C9AE84'; ctx.fill();
  }
  ctx.restore();
  return sq;
}
/** a paper chess piece standing at (x, y). kind 'king'|'pawn'; side colours; fall 0..1 tips it over (lay down); lift raises it */
export function chessPiece(x, y, { kind = 'pawn', side = 'french', s = 1, fall = 0, lift = 0, crown = false, label: lab, sc = 1, dir = 1 } = {}) {
  if (sc <= 0) return; const S = SIDE[side] || SIDE.french;
  ctx.save(); ctx.translate(x, y - lift); ctx.scale(s * sc, s * sc); ctx.rotate(dir * eio(clamp(fall)) * Math.PI / 2 * 0.98);
  if (kind === 'king') {
    cut(P_poly([[-34, 0], [34, 0], [26, -16], [16, -20], [12, -92], [22, -100], [-22, -100], [-12, -92], [-16, -20], [-26, -16]]), S.fill, { shadow: 0.7, edge: 4 });
    cut(P_rr(-20, -118, 40, 20, 8), S.fill, { shadow: 0.4, edge: 3 });
    cut(P_rr(-5, -140, 10, 26, 3), S.fill, { shadow: 0.3, edge: 3 }); cut(P_rr(-13, -133, 26, 9, 3), S.fill, { shadow: 0, edge: 3 });
    if (crown) cut(P_poly([[-24, -118], [-28, -146], [-12, -132], [0, -152], [12, -132], [28, -146], [24, -118]]), P.gold, { shadow: 0.4, edge: 3 });
  } else {
    cut(P_poly([[-24, 0], [24, 0], [18, -12], [9, -16], [7, -44], [-7, -44], [-9, -16], [-18, -12]]), S.fill, { shadow: 0.6, edge: 3 });
    cut(P_circ(0, -54, 15), S.fill, { shadow: 0.4, edge: 3 });
  }
  ctx.restore();
  if (lab && fall < 0.5) placeLabel(lab, x, y - lift - (kind === 'king' ? 150 : 74) * s * sc, { size: 22, dy: -14 });
}

// ═════════════════════════ SUPPLY LINE ═════════════════════════
/** the supply line: a thick crimson arrow along pts (Bengal → English camp) with icons riding it, or a thin broken
 *  blue dashed line (the French overland route). p draws it on; t animates the icons; ghost = faint teaser silhouette. */
export function supplyLine(pts, { p = 1, t = 0, side = 'english', thick = 30, broken = false, icons = ['coin', 'rice', 'soldier'], ghost = 0 } = {}) {
  if (p <= 0) return; const S = SIDE[side] || SIDE.english;
  if (ghost) { ctx.save(); ctx.globalAlpha = ghost; drawPolyline(pts, p, S.fill, thick); const h = endHead(pts, p); arrowHead(h, thick, S.fill); ctx.restore(); return; }
  if (broken) {
    ctx.save(); const head = drawPolyline(pts, p, S.fill, thick * 0.3, [26, 22 + 10 * Math.sin(t * 3)]); ctx.restore();
    for (let i = 1; i < 4; i++) { const q = gather(pts, p * i / 4); ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(0.6); line([[-14, -14], [14, 14]], P.ink, 5); line([[-14, 14], [14, -14]], P.ink, 5); ctx.restore(); }
    return head;
  }
  ctx.save(); ctx.shadowColor = 'rgba(70,45,20,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; drawPolyline(pts, p, S.fill, thick); ctx.restore();
  drawPolyline(pts, p, 'rgba(247,239,220,0.25)', thick * 0.25, [18, 26]);
  const h = endHead(pts, p); arrowHead(h, thick, S.fill);
  if (p > 0.3) for (let i = 0; i < 6; i++) { const u = ((t * 0.18 + i / 6) % 1) * p; const q = gather(pts, u); iconAt(icons[i % icons.length], q[0], q[1] - thick * 0.9, 0.9); }
  return h;
}
function gather(pts, u) { const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; } let d = tot * clamp(u); for (let i = 1; i < pts.length; i++) { if (d <= L[i - 1]) { const k = d / L[i - 1]; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; } d -= L[i - 1]; } return pts[pts.length - 1]; }
function endHead(pts, p) { const q = gather(pts, p), q0 = gather(pts, Math.max(0, p - 0.02)); return [q[0], q[1], Math.atan2(q[1] - q0[1], q[0] - q0[0])]; }
function arrowHead([x, y, a], w, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); cut(P_poly([[w * 1.3, 0], [-w * 0.5, -w * 1.15], [-w * 0.5, w * 1.15]]), col, { shadow: 0.6, edge: 3 }); ctx.restore(); }
/** small paper icons: coin, rice (sack), soldier (redcoat silhouette) */
export function iconAt(kind, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'coin') { cut(P_circ(0, 0, 16), P.gold, { shadow: 0.5, edge: 3 }); ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.strokeStyle = '#A87A22'; ctx.lineWidth = 3; ctx.stroke(); }
  else if (kind === 'rice') { cut(() => { ctx.beginPath(); ctx.moveTo(-16, 18); ctx.quadraticCurveTo(-22, -6, -8, -16); ctx.lineTo(8, -16); ctx.quadraticCurveTo(22, -6, 16, 18); ctx.closePath(); }, '#D8C49A', { shadow: 0.5, edge: 3 }); line([[-8, -16], [8, -16]], P.sepia, 4); }
  else { cut(P_circ(0, -18, 8), P.skin, { shadow: 0.3, edge: 2 }); cut(P_rr(-10, -10, 20, 26, 5), P.crimson, { shadow: 0.4, edge: 2 }); cut(P_poly([[-12, -24], [0, -36], [12, -24]]), P.ink, { shadow: 0, edge: 2 }); }
  ctx.restore();
}

// ═════════════════════════ CHAPTER CARD ═════════════════════════
/** chapter card (~1.6 s): the page turns in, a gold YEAR ribbon pops, the hook title slip slides in, a fleur-de-lis seal stamps.
 *  lt = time since the card started. Draw it full-frame (the shot's camera adds the whip). */
export function chapterCard(year, title, lt, { seed = 21, film = null } = {}) {
  parchment(seed);
  const turn = eio(clamp(lt / 0.35));
  // page-turn: a folded corner sweeps across
  if (turn < 1) { ctx.save(); ctx.fillStyle = 'rgba(90,60,30,0.18)'; ctx.beginPath(); ctx.moveTo(W * (1 - turn) - 200, 0); ctx.lineTo(W * (1 - turn) + 120, 0); ctx.lineTo(W * (1 - turn) - 80, H); ctx.lineTo(W * (1 - turn) - 400, H); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (film) {   // the opening title doubles as chapter 1's card: film title, its span, then the chapter hook
    ribbon(film.span, W / 2, 250, eob(seg(lt, 0.15, 0.5)), 90);
    const fp = eo(seg(lt, 0.3, 0.65)); if (fp > 0) { ctx.save(); ctx.globalAlpha = fp; ctx.font = `700 120px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px'; ctx.fillText(film.title, W / 2, 470); ctx.letterSpacing = '0px'; ctx.restore(); }
    const sp2 = eo(seg(lt, 0.8, 1.1)); if (sp2 > 0) { ctx.save(); ctx.translate(lerp(-W * 0.4, 0, sp2), 0); slip(`${year}: ${title.toUpperCase()}`, W / 2, 660, 1, -0.015, 50); ctx.restore(); }
    const st2 = seg(lt, 1.1, 1.3); if (st2 > 0) fleurSeal(W / 2 + 600, 470, lerp(1.6, 0.7, eo(st2)), clamp(st2 * 3));
    return;
  }
  ribbon(year, W / 2, 360, eob(seg(lt, 0.2, 0.55)), 120);
  const sp = eo(seg(lt, 0.45, 0.8)); if (sp > 0) { ctx.save(); ctx.translate(lerp(-W * 0.4, 0, sp), 0); slip(title.toUpperCase(), W / 2, 590, 1, -0.015, 70); ctx.restore(); }
  const st = seg(lt, 0.8, 1.0); if (st > 0) fleurSeal(W / 2 + 520, 590, lerp(1.8, 0.8, eo(st)), clamp(st * 3));
}
/** wax seal with a paper fleur-de-lis (the French seal); a = alpha */
export function fleurSeal(x, y, s = 1, a = 1, col = P.crimson) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * TAU, r = 90 + Math.sin(an * 9) * 7; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); }, col, { shadow: 0.7, edge: 0 });
  ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; fleur(); ctx.restore();
}
function fleur() {
  ctx.beginPath(); ctx.moveTo(0, -46); ctx.bezierCurveTo(16, -30, 16, -10, 0, 6); ctx.bezierCurveTo(-16, -10, -16, -30, 0, -46); ctx.fill();
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 6, 0); ctx.bezierCurveTo(d * 30, -26, d * 50, -6, d * 36, 14); ctx.bezierCurveTo(d * 30, 4, d * 18, 4, d * 6, 10); ctx.closePath(); ctx.fill(); }
  ctx.fillRect(-28, 10, 56, 10); ctx.beginPath(); ctx.moveTo(-8, 20); ctx.lineTo(8, 20); ctx.lineTo(0, 44); ctx.closePath(); ctx.fill();
}
/** a text seal (e.g. "50 YEARS", "COUPABLE", "PLASSEY 1757"): round wax with a word */
export function wordSeal(text, x, y, s = 1, a = 1, col = P.crimson, size = 30) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const an = i / 40 * TAU, r = 100 + Math.sin(an * 9) * 7; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.closePath(); }, col, { shadow: 0.7, edge: 0 });
  ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = `700 ${size}px ${SERIF}`; ctx.fillStyle = 'rgba(40,10,8,0.62)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const parts = text.split('\n'); parts.forEach((l, i) => ctx.fillText(l, 0, (i - (parts.length - 1) / 2) * size * 1.1 + 2));
  ctx.restore();
}
