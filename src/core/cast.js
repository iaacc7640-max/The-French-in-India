// Paper Atlas 16:9 · THE CAST of "So Close to Empire". Original period figures, told apart by costume and props, not faces.
// person(name, { x, y, h, dir, t, seed, arm, prop, look }) draws one standing cut-paper figure WITH idle motion:
// breathing (1.8% vertical scale, 3.5 s loop) and head sway (±1.5°), so nothing freezes after its entrance.
import { ctx, TAU, clamp, rnd } from './lib.js';
import { P, cut, P_rr, P_circ, P_poly } from './kit.js';

const BLACK = '#2A2421', WHITE = '#F4EEDD', WIG = '#EDE6D6', WIGSH = '#D2C8B4', REDCOAT = '#A8322D', GREEN_IRISH = '#4F8A4A';
const NIZAM = '#3F5E3A', SAFFRON = '#D98C2B';
/** costume table: coat, trim, robe (long) or legs, hat, extras */
export const CAST = {
  louis:        { label: 'LOUIS XIV',        coat: P.wine,   trim: P.gold,  robe: 1, hat: 'bigwig', sun: 1, cape: P.royal },
  colbert:      { label: 'COLBERT',          coat: BLACK,    trim: WHITE,   robe: 1, hat: 'wig', prop: 'ledger' },
  caron:        { label: 'FRANÇOIS CARON',   coat: '#5A4632', trim: WHITE,  hat: 'broad' },
  marcara:      { label: 'MARCARA',          coat: '#6B4A6E', trim: P.gold, robe: 1, hat: 'tallcap' },
  sherkhan:     { label: 'SHER KHAN LODI',   coat: '#8C5A3C', trim: P.gold, robe: 1, hat: 'turban', turban: WHITE, sash: P.crimson },
  martin:       { label: 'FRANÇOIS MARTIN',  coat: '#6E5A44', trim: WHITE,  hat: 'tricorne', prop: 'plan' },
  labourdonnais:{ label: 'LA BOURDONNAIS',   coat: P.royal,  trim: P.gold,  hat: 'tricorne', prop: 'flag' },
  paradis:      { label: 'PARADIS',          coat: P.royal,  trim: WHITE,   hat: 'tricorne', prop: 'compass' },
  nawab:        { label: 'NAWAB OF THE CARNATIC', coat: P.forest, trim: P.gold, robe: 1, hat: 'turban', turban: P.gold, sash: P.gold },
  dupleix:      { label: 'DUPLEIX',          coat: P.royal,  trim: P.gold,  hat: 'wig', sash: WHITE, prop: 'chess' },
  muzaffar:     { label: 'MUZAFFAR JANG',    coat: NIZAM,    trim: WHITE,   robe: 1, hat: 'turban', turban: WHITE, sash: WHITE },
  nizam:        { label: 'THE NIZAM',        coat: NIZAM,    trim: P.gold,  robe: 1, hat: 'turban', turban: P.gold, sash: P.gold },
  sultan:       { label: 'SULTAN OF GOLCONDA', coat: '#4E5A7A', trim: P.gold, robe: 1, hat: 'turban', turban: '#E8D6A8', sash: P.gold },
  chanda:       { label: 'CHANDA SAHIB',     coat: '#5E6B3A', trim: P.gold, robe: 1, hat: 'turban', turban: '#E8D6A8', sash: P.gold },
  bussy:        { label: 'BUSSY',            coat: P.royal,  trim: WHITE,   hat: 'tricorne', sword: 1 },
  clerk:        { label: 'ROBERT CLIVE',     coat: '#4A4A52', trim: WHITE,  hat: 'none', hair: '#5A4030', prop: 'quill' },
  clive:        { label: 'ROBERT CLIVE',     coat: REDCOAT,  trim: WHITE,   hat: 'tricorne', sword: 1 },
  director:     { label: 'COMPANY DIRECTOR', coat: BLACK,    trim: WHITE,   hat: 'wig', prop: 'ledger' },
  lally:        { label: 'COMTE DE LALLY',   coat: P.royal,  trim: P.gold,  hat: 'tricorne', ribbon: GREEN_IRISH, sword: 1 },
  coote:        { label: 'EYRE COOTE',       coat: REDCOAT,  trim: P.gold,  hat: 'tricorne', sword: 1 },
};
const rad = (d) => d * Math.PI / 180;

/** one cast member. o = { x, y (feet), h (default 560), dir 1|-1, t (film time, drives idle), seed, arm (deg raise of front arm), walk, prop override } */
export function person(name, o = {}) {
  const c = CAST[name] || CAST.martin, h = o.h || 560, d = o.dir || 1, s = h / 640, t = o.t || 0, seed = o.seed ?? name.length;
  const breathe = 1 + 0.018 * Math.sin(TAU * t / 3.5 + seed), sway = rad(1.5) * Math.sin(TAU * t / 4.3 + seed * 1.7);
  const wk = o.walk != null ? Math.sin(o.walk) : 0, arm = (o.arm || 0) + 3 * Math.sin(TAU * t / 3.5 + seed + 0.6);
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * d, s * breathe);
  // legs (coats) or robe
  if (!c.robe) for (const k of [-1, 1]) cut(P_poly([[k * 22 - 18, -250], [k * 22 + 18, -250], [k * 22 + 16 + k * wk * 30, 0], [k * 22 - 16 + k * wk * 30, 0]]), c.legs || '#3A3030', { shadow: 0.6, edge: 4 });
  if (c.cape) cut(P_poly([[-80, -470], [80, -470], [150, 0], [-150, 0]]), c.cape, { shadow: 0.7, edge: 5 });
  // back arm
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(-34, -440); ctx.rotate(rad(10 - wk * 18)); ctx.roundRect(-20, 0, 40, 220, 20); ctx.restore(); }, c.coat, { shadow: 0.5, edge: 4 });
  // body: long coat with skirts (18th c.) or robe
  if (c.robe) cut(P_poly([[-70, -470], [70, -470], [120, 0], [-120, 0]]), c.coat);
  else cut(P_poly([[-75, -470], [75, -470], [95, -150], [70, -130], [-70, -130], [-95, -150]]), c.coat);
  // coat front trim + buttons
  ctx.fillStyle = c.trim; ctx.fillRect(-6, -460, 12, c.robe ? 440 : 320);
  if (!c.robe) for (let i = 0; i < 5; i++) circle2(16, -430 + i * 55, 6, c.trim);
  if (c.sash) { ctx.save(); ctx.beginPath(); ctx.moveTo(-75, -440); ctx.lineTo(-45, -470); ctx.lineTo(80, -250); ctx.lineTo(50, -220); ctx.closePath(); ctx.fillStyle = c.sash; ctx.fill(); ctx.restore(); }
  if (c.ribbon) { cut(P_poly([[-50, -420], [-30, -420], [-24, -360], [-40, -372], [-56, -360]]), c.ribbon, { shadow: 0.3, edge: 3 }); }
  if (c.sun) { ctx.save(); ctx.translate(0, -360); for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.fillStyle = P.gold; ctx.fillRect(-4, 26, 8, 22); } ctx.restore(); circle2(0, -360, 26, P.gold); }
  if (c.sword) cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(-60, -250); ctx.rotate(rad(-28)); ctx.roundRect(-5, 0, 10, 200, 4); ctx.restore(); }, '#B9A98C', { shadow: 0.4, edge: 3 });
  // head (idle sway around the neck)
  ctx.save(); ctx.translate(0, -470); ctx.rotate(sway); ctx.translate(0, 470);
  if (c.hat === 'wig' || c.hat === 'bigwig') { const big = c.hat === 'bigwig'; for (const k of [-1, 1]) for (let i = 0; i < (big ? 4 : 2); i++) cut(P_circ(k * (52 + i * 4), -560 + i * (big ? 38 : 30), big ? 34 : 26), WIG, { shadow: 0.4, edge: 3 }); }
  cut(P_circ(0, -540, 66), P.skin);
  hat(c);
  ctx.restore();
  // front arm (raise with o.arm) + prop in hand
  ctx.save(); ctx.translate(34, -440); ctx.rotate(rad(-arm - 10 + wk * 18));
  cut(() => { ctx.beginPath(); ctx.roundRect(-20, 0, 40, 220, 20); }, c.coat, { shadow: 0.5, edge: 4 });
  cut(P_circ(0, 222, 20), P.skin, { shadow: 0.3, edge: 3 });
  const prop = o.prop ?? c.prop;
  if (prop) { ctx.translate(0, 230); ctx.rotate(rad(arm + 10)); drawProp(prop, t); }
  ctx.restore();
  ctx.restore();
}
function circle2(x, y, r, f) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = f; ctx.fill(); }
function hat(c) {
  const k = c.hat;
  if (k === 'wig' || k === 'bigwig') { cut(() => { ctx.beginPath(); ctx.arc(0, -560, 70, Math.PI * 1.05, Math.PI * 1.95); ctx.quadraticCurveTo(40, -600, 0, -585); ctx.quadraticCurveTo(-40, -600, -68, -585); ctx.closePath(); }, WIG, { shadow: 0.4, edge: 3 }); if (k === 'bigwig') cut(P_circ(0, -624, 46), WIG, { shadow: 0.4, edge: 3 }); }
  if (k === 'tricorne') { cut(P_poly([[-100, -586], [-60, -640], [0, -652], [60, -640], [100, -586], [0, -604]]), BLACK, { shadow: 0.5, edge: 4 }); if (c.trim === P.gold) { ctx.strokeStyle = P.gold; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-96, -588); ctx.lineTo(0, -606); ctx.lineTo(96, -588); ctx.stroke(); } for (const s2 of [-1, 1]) cut(P_circ(s2 * 56, -548, 20), WIG, { shadow: 0.2, edge: 2 }); }
  if (k === 'broad') { cut(P_rr(-110, -600, 220, 22, 10), BLACK, { shadow: 0.5, edge: 4 }); cut(P_rr(-56, -660, 112, 66, 14), BLACK, { shadow: 0.4, edge: 4 }); }
  if (k === 'tallcap') { cut(P_poly([[-56, -584], [56, -584], [44, -700], [-44, -700]]), BLACK, { shadow: 0.5, edge: 4 }); cut(P_rr(-60, -598, 120, 22, 6), P.gold, { shadow: 0, edge: 3 }); }
  if (k === 'turban') { cut(() => { ctx.beginPath(); ctx.ellipse(0, -590, 86, 50, 0, Math.PI, TAU); ctx.lineTo(80, -575); ctx.lineTo(-80, -575); ctx.closePath(); }, c.turban || WHITE, { shadow: 0.5, edge: 4 }); ctx.strokeStyle = 'rgba(62,44,30,0.25)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, -588 + i * 6, 80 - i * 6, 40 - i * 6, -0.15, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } cut(P_circ(26, -620, 9), P.crimson, { shadow: 0, edge: 2 }); }
  if (k === 'none') cut(() => { ctx.beginPath(); ctx.arc(0, -556, 70, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); }, c.hair || P.ink, { shadow: 0.3, edge: 3 });
}
/** props held in the front hand (drawn at the hand, upright) */
export function drawProp(kind, t = 0) {
  if (kind === 'ledger') { cut(P_rr(-46, -20, 92, 66, 5), '#5E3B28', { shadow: 0.5, edge: 3 }); ctx.fillStyle = WHITE; ctx.fillRect(-40, -14, 80, 8); }
  if (kind === 'plan') { cut(P_rr(-60, -30, 120, 80, 3), WHITE, { shadow: 0.5, edge: 3 }); ctx.strokeStyle = P.sepia; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-50, -18 + i * 18); ctx.lineTo(50, -18 + i * 18); ctx.moveTo(-40 + i * 28, -26); ctx.lineTo(-40 + i * 28, 44); ctx.stroke(); } }
  if (kind === 'flag') { cut(P_rr(-4, -180, 8, 200, 2), P.ink, { shadow: 0.4, edge: 2 }); ctx.save(); ctx.fillStyle = '#F7F1E1'; ctx.strokeStyle = P.gold; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(i * 10, -178 + Math.sin(i * 0.6 - t * 6) * 4 * i / 8); for (let i = 8; i >= 0; i--) ctx.lineTo(i * 10, -128 + Math.sin(i * 0.6 - t * 6) * 4 * i / 8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = P.gold; for (const [fx, fy] of [[22, -160], [46, -160], [66, -160], [34, -142], [58, -142]]) { ctx.beginPath(); ctx.arc(fx, fy, 4, 0, TAU); ctx.fill(); } ctx.restore(); }
  if (kind === 'compass') { ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(-24, 40); ctx.moveTo(0, -40); ctx.lineTo(24, 40); ctx.stroke(); circle2(0, -40, 8, P.gold); }
  if (kind === 'chess') { ctx.save(); ctx.scale(0.55, 0.55); cut(P_poly([[-30, 0], [30, 0], [14, -20], [10, -80], [-10, -80], [-14, -20]]), P.royal, { shadow: 0.5, edge: 3 }); cut(P_poly([[-22, -80], [-26, -110], [-10, -96], [0, -118], [10, -96], [26, -110], [22, -80]]), P.gold, { shadow: 0.3, edge: 3 }); ctx.restore(); }
  if (kind === 'quill') { ctx.save(); ctx.rotate(-0.5); cut(() => { ctx.beginPath(); ctx.moveTo(0, 20); ctx.quadraticCurveTo(-18, -50, 4, -110); ctx.quadraticCurveTo(14, -50, 0, 20); ctx.closePath(); }, WHITE, { shadow: 0.4, edge: 2 }); ctx.restore(); }
  if (kind === 'sword') cut(P_rr(-5, -150, 10, 170, 4), '#B9A98C', { shadow: 0.4, edge: 3 });
  if (kind === 'purse') cut(() => { ctx.beginPath(); ctx.arc(0, 18, 26, 0, TAU); ctx.moveTo(-12, -6); ctx.lineTo(12, -6); ctx.lineTo(0, 6); ctx.closePath(); }, '#8C5A3C', { shadow: 0.5, edge: 3 });
}
/** head-and-shoulders portrait for stat cards (drawn around 0,0, about 80 px tall) */
export function portrait(name) { return () => { ctx.save(); ctx.scale(0.16, 0.16); ctx.translate(0, 700); person(name, { x: 0, y: 0, h: 640 }); ctx.restore(); }; }
