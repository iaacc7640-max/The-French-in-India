// CH4 · 1749: THE KINGMAKER (duel part 1: Dupleix). Why conquer India's thrones when you can choose who sits on them?
// South India itself is the chessboard: the princes stand as kings at Hyderabad and in the Carnatic.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

/** Dupleix's study in Pondicherry at night: window over the sea, candle */
export function study(t) { R.room({ wall: '#C2AE88', floor: '#7A5236', fl: 860, seed: 43, wash: '#2F3550', washA: 0.4 }); R.windowPane(260, 110, 340, 480, { t, moon: true }); R.table(1420, 700, 420, { h: 160 }); R.candle(1420, 676, t, { s: 1.0 }); }
/** the Hyderabad court: green banners (the Nizam), a throne with the ruler */
function hydCourt(t) {
  R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 53 });
  for (const x of [300, 700, 1220, 1620]) K.cut(() => { ctx.beginPath(); ctx.moveTo(x - 120, 880); ctx.lineTo(x - 120, 360); ctx.arc(x, 360, 120, Math.PI, Math.PI * 2); ctx.lineTo(x + 120, 880); ctx.closePath(); }, '#B39E78', { shadow: 0, edge: 0 });
  for (const x of [520, 1420]) A.flag(x, 360, t, A.FLAGS.nizam, { s: 1.6, seed: x });
  R.throne(900, 880, { s: 1.0 }); person('nizam', { x: 900, y: 860, h: 470, t, seed: 4 });
}

export function build(X, C) {
  const ch = 4, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(C.start, X.end('4.2') + 0.3, 'room', 0.5);
  { const st = X.at('4.1'), na = X.w('joseph', '4.1') - st;
    sh({ id: 'K01', at: st, move: cam.push(0.05, [820, 520]), note: 'Dupleix turns from the window; candle', draw(lt, d, t) { study(t); const turn = eio(seg(lt, 0.3, 0.8)); ctx.save(); ctx.translate(820, 0); ctx.scale(lerp(-1, 1, turn) || 0.02, 1); ctx.translate(-820, 0); person('dupleix', { x: 820, y: 920, h: 640, t }); ctx.restore(); K.slip('JOSEPH FRANÇOIS DUPLEIX', 1300, 230, eob(seg(lt, na, na + 0.3)), -0.02, 40); } });
    X.ev(st + 0.3, 'whip', 'Dupleix turns', { gain: 0.35 }); X.ev(st + na, 'slip', 'name slip'); }
  { const st = X.at('4.2'), si = X.w('simple', '4.2') - st;
    sh({ id: 'K02', at: st, move: cam.push(0.07, [900, 420]), note: 'Dupleix lifts a chess king into the candlelight', draw(lt, d, t) { study(t); person('dupleix', { x: 820, y: 940, h: 700, t, arm: lerp(10, 95, eio(seg(lt, 0.2, si))) }); } });
    X.ev(st + 0.2, 'light', 'the king is lifted'); }
  // 4.3 · why conquer India's thrones: south India becomes the board, two crowns wait at Hyderabad and in the Carnatic
  const crowns = (v, t, a = 1) => { for (const n of ['Hyderabad', 'Arcot']) { const [x, y] = A.at(v, n); ctx.save(); ctx.globalAlpha = a; SC.crown(x, y - 70 + Math.sin(t * 2 + x) * 6, 0.6); ctx.restore(); } };
  { const st = X.at('4.3'), thr = X.w('thrones', '4.3') - st;
    sh({ id: 'K03', at: st, whip: 'down', move: cam.drift(0.03, [W / 2, 500]), note: 'south India becomes the board: crowns wait at Hyderabad and in the Carnatic', draw(lt, d, t) { const v = SC.kingsMap(t, { p: seg(lt, 0.1, 0.9), labels: seg(lt, 0.5, 0.8) }); crowns(v, t, seg(lt, thr - 0.3, thr)); } });
    X.ev(st + 0.1, 'ink', 'the board inks onto the map'); X.ev(st + thr - 0.3, 'pop', 'two crowns'); X.amb(st, X.end('4.7') + 0.3, 'pulse', 0.4); }
  { const st = X.at('4.4'), cho = X.w('choose', '4.4') - st;
    sh({ id: 'K04', at: st, move: cam.snap(cho, 0.1, [900, 420]), note: 'snap "choose": a hand sets a blue piece beside the Hyderabad crown', draw(lt, d, t) {
      const v = SC.kingsMap(t), [hx, hy] = A.at(v, 'Hyderabad'); crowns(v, t);
      const x = hx - 150, y = hy + 6, down = eio(seg(lt, cho - 0.5, cho)), up = eio(seg(lt, cho + 0.25, cho + 0.8));
      if (lt < cho) R.reachingHand(x, lerp(y - 260, y, down), { hold: () => A.chessPiece(0, 40, { kind: 'pawn', side: 'french', s: 1.25 }) });
      else { A.chessPiece(x, y, { kind: 'pawn', side: 'french', s: 1.25 }); R.reachingHand(x, lerp(y, y - 700, up)); }
    } });
    X.ev(st + cho, 'chess', 'a blue piece is set down'); }
  { const st = X.at('4.5'), hy = X.w('hyderabad', '4.5') - st, ca = X.w('carnatic', '4.5') - st;
    sh({ id: 'K05', at: st, move: cam.push(0.04, [W / 2, 500]), note: 'four rival princes stand as kings: two at Hyderabad, two in the Carnatic', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { backP: { french: 0, english: 0 }, kingsP: (i) => seg(lt, (i < 2 ? hy : ca) - 0.2 + (i % 2) * 0.2, (i < 2 ? hy : ca) + 0.2 + (i % 2) * 0.2) }); K.slip('RIVAL PRINCES', 1560, 520, eob(seg(lt, 0.6, 0.9)), 0.02, 36); } });
    X.ev(st + 0.6, 'slip', 'RIVAL PRINCES'); X.ev(st + hy - 0.2, 'chess', 'the Hyderabad rivals'); X.ev(st + ca - 0.2, 'chess', 'the Carnatic rivals'); }
  { const st = X.at('4.6'), b = X.w('backed', '4.6') - st;
    sh({ id: 'K06', at: st, move: cam.push(0.05, [800, 500]), note: 'French blue pieces slide in behind Muzaffar Jang and Chanda Sahib', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { backP: { french: seg(lt, b, b + 0.9), english: 0 } }); K.slip('FRENCH-BACKED', 300, 520, eob(seg(lt, b + 0.5, b + 0.8)), -0.02, 34); } });
    X.ev(st + b + 0.4, 'chess', 'blue pieces slide in'); X.ev(st + b + 0.5, 'slip', 'FRENCH-BACKED', { sound: false }); }
  { const st = X.at('4.7'), e = X.w('english', '4.7') - st;
    sh({ id: 'K07', at: st, move: cam.push(0.05, [1120, 500]), note: 'English crimson pieces slide in behind Nasir Jang and Anwar-ud-din', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { backP: { french: 1, english: seg(lt, e, e + 0.9) } }); K.slip('FRENCH-BACKED', 300, 520, 1, -0.02, 34); K.slip('ENGLISH-BACKED', 1620, 520, eob(seg(lt, e + 0.5, e + 0.8)), 0.02, 34); } });
    X.ev(st + e + 0.4, 'chess', 'crimson pieces slide in'); X.ev(st + e + 0.5, 'slip', 'ENGLISH-BACKED', { sound: false }); }
  // 4.8 · 1749, at Ambur: the two armies on the map; the card
  { const st = X.at('4.8'), am = X.w('aam', '4.8') - st, wo = X.w('won', '4.8') - st;
    sh({ id: 'K08', at: st, whip: 'right', move: cam.push(0.06, [760, 500]), note: "the Carnatic map: Ambur; Dupleix's side and the Nawab's army meet; card", draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), at = (n) => A.at(v, n), [ax, ay] = at('Ambur');
      A.pin(...at('Pondicherry'), 'french', { star: true }); A.placeLabel('PONDICHERRY', ...at('Pondicherry'), { dx: 150, dy: 0, size: 24 }); A.pin(...at('Madras'), 'english'); A.placeLabel('MADRAS', ...at('Madras'), { dx: 100, dy: 0, size: 24 }); A.pin(...at('Arcot'), 'nawab', { r: 12 }); A.placeLabel('ARCOT', ...at('Arcot'), { dx: 80, dy: 20, size: 22 });
      A.pin(ax, ay, 'nawab', { sc: eob(seg(lt, am - 0.2, am + 0.1)), r: 16, glow: 1 }); A.placeLabel('AMBUR', ax, ay, { sc: eob(seg(lt, am, am + 0.3)), size: 28, dy: 44 });
      const sc2 = eio(seg(lt, wo, wo + 1.2)); R.army(ax - 190, ay - 110, 8, 3, P.royal, { t, seed: 2, march: seg(lt, 0.4, am) }); A.flag(ax - 330, ay - 110, t, A.FLAGS.french, { s: 0.6 });
      R.army(ax + 190, ay - 110, 10, 4, P.forest, { t, turban: true, seed: 6, march: seg(lt, 0.4, am), scatter: sc2 * 0.8, dir: 1 }); if (sc2 < 0.3) A.flag(ax + 360, ay - 110, t, A.FLAGS.nawab, { s: 0.6, seed: 2 });
      R.smokeDrift(ax, ay - 150, t, { s: 0.6, a: 0.45 });
      A.statCard({ x: 1480, y: 330, from: [ax, ay], title: 'Ambur', stats: ['Nawab Anwar-ud-din killed'], date: '1749', p: seg(lt, wo, wo + 0.6), portrait: portrait('nawab') }); K.ribbon('1749', 1500, 640, eob(seg(lt, 0.2, 0.6)), 80);
    } });
    X.ev(st + 0.2, 'ribbon', '1749'); X.ev(st + 0.5, 'drums', 'the armies form', { dur: 3.5, gain: 0.6 }); X.ev(st + am - 0.2, 'pop', 'Ambur pin'); X.ev(st + wo, 'card', 'Ambur card'); }
  // 4.9 · the Nawab Anwar-ud-din was killed: his king falls on the map; cut-in: a turban on an empty saddle (serious, no sting)
  { const st = X.at('4.9'), ki = X.w('killed', '4.9') - st;
    sh({ id: 'K09', at: st, whip: 'down', move: cam.push(0.06, [1100, 560]), note: "Anwar-ud-din's king falls slowly → a turban on an empty saddle", draw(lt, d, t) {
      if (lt < ki + 0.1) { const v = SC.kingsMap(t); SC.kingPieces(v, { fall: { 'Anwar-ud-din': seg(lt, 0.3, ki) } }); }
      else { K.parchment(47); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#2F3550'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); R.emptySaddle(W / 2 - 60, 830, t, { s: 1.15, turban: P.gold }); K.slip('AMBUR · 1749', W / 2, 190, 1, -0.02, 40); }
    } });
    X.ev(st + 0.3, 'fall', 'the green king tips over', { gain: 0.5 }); X.ev(st + ki + 0.1, 'light', 'cut-in: the empty saddle'); }
  // 4.10 · governor of the Mughal lands south of the Krishna: the river draws itself, blue ink bleeds south of it
  { const st = X.at('4.10'), kr = X.w('krishna', '4.10') - st, gov = X.w('governor', '4.10') - st;
    sh({ id: 'K10', at: st, whip: 'up', move: cam.push(0.04, [800, 600]), note: 'the Krishna draws itself; blue ink bleeds over the lands south of it; GOVERNOR seal', draw(lt, d, t) {
      const v = A.realMap({ view: 'peninsula', t }), at = (n) => A.at(v, n);
      A.krishna(v, seg(lt, 0.1, gov + 0.6), 9);
      A.inkBleed(...at('Pondicherry'), 900, seg(lt, kr - 0.6, kr + 0.9), P.royal, { clipFn: () => { A.mainland(v)(); ctx.clip(); const pts = A.KRISHNA.map(([a, b]) => A.proj(v, a, b)); ctx.beginPath(); ctx.moveTo(-400, pts[0][1]); pts.forEach((q) => ctx.lineTo(...q)); ctx.lineTo(W + 400, pts[pts.length - 1][1]); ctx.lineTo(W + 400, H + 400); ctx.lineTo(-400, H + 400); ctx.closePath(); }, seed: 3, alpha: 0.82 });
      A.pin(...at('Pondicherry'), 'french', { star: true }); A.placeLabel('RIVER KRISHNA', ...A.proj(v, 77.4, 16.1), { dy: -34, size: 24, sc: eob(seg(lt, gov + 0.3, gov + 0.6)) });
      A.wordSeal('GOVERNOR', 1500, 420, eob(seg(lt, gov, gov + 0.3)) * 0.9, clamp((lt - gov) * 4), P.gold, 26);
    } });
    X.ev(st + 0.1, 'route', 'the Krishna draws itself', { dur: 1.2 }); X.ev(st + gov, 'seal', 'GOVERNOR seal'); X.ev(st + kr - 0.6, 'ink', 'blue bleeds south of the Krishna'); }
  { const st = X.at('4.11'), bu = X.w('boo', '4.11') - st, hy = X.w('hyderabad', '4.11') - st;
    sh({ id: 'K11', at: st, whip: 'right', move: cam.push(0.05, [W / 2, 520]), note: 'the Hyderabad court: Bussy and French soldiers beside the throne', draw(lt, d, t) { hydCourt(t); R.army(1500, 800, 5, 2, P.royal, { t, s: 3.2, gap: 30, rowGap: 14, seed: 4 }); person('bussy', { x: 1240, y: 900, h: 560, t, dir: -1 }); K.slip('BUSSY', 1240, 200, eob(seg(lt, bu, bu + 0.3)), 0.02, 40); K.slip('HYDERABAD', 420, 200, eob(seg(lt, hy, hy + 0.3)), -0.02, 40); } });
    X.ev(st + 0.3, 'drums', 'French soldiers stand guard', { dur: 1.5, gain: 0.35 }); X.ev(st + bu, 'slip', 'name slip BUSSY'); X.ev(st + hy, 'slip', 'HYDERABAD'); X.amb(st, X.end('4.12') + 0.2, 'court', 0.7); }
  { const st = X.at('4.12'), pa = X.w('paid', '4.12') - st;
    sh({ id: 'K12', at: st, move: cam.push(0.05, [1000, 560]), note: 'a purse of coins passes from the ruler to Bussy', draw(lt, d, t) { hydCourt(t); R.army(1500, 800, 5, 2, P.royal, { t, s: 3.2, gap: 30, rowGap: 14, seed: 4 }); person('bussy', { x: 1240, y: 900, h: 560, t, dir: -1, arm: 40 }); const u = eio(seg(lt, pa, pa + 0.9)); ctx.save(); ctx.translate(lerp(900, 1160, u), lerp(560, 540, u) - Math.sin(u * Math.PI) * 60); ctx.scale(1.4, 1.4); K.cut(K.P_circ(0, 0, 26), '#8C5A3C', { shadow: 0.5, edge: 3 }); K.cut(K.P_poly([[-12, -24], [12, -24], [0, -10]]), '#8C5A3C', { shadow: 0, edge: 3 }); ctx.restore(); for (let i = 0; i < 3; i++) { const c = seg(lt, pa + 0.9 + i * 0.15, pa + 1.3 + i * 0.15); if (c > 0 && c < 1) A.iconAt('coin', 1160 + i * 26, 500 - c * 60, 1.2); } } });
    X.ev(st + pa, 'coin', 'the purse passes'); }
  { const st = X.at('4.13'), br = X.w('brilliant', '4.13') - st;
    sh({ id: 'K13', at: st, whip: 'left', move: cam.drift(0.03, [900, 460]), note: 'Dupleix holds up the crowned king; a gold glint', draw(lt, d, t) { study(t); person('dupleix', { x: 820, y: 940, h: 700, t, arm: 95 }); const g = Math.exp(-((lt - br) ** 2) * 18); if (g > 0.02) { ctx.save(); ctx.globalAlpha = g; K.cut(K.P_poly([[1010, 260], [1022, 290], [1052, 302], [1022, 314], [1010, 344], [998, 314], [968, 302], [998, 290]]), '#F2C14E', { shadow: 0, edge: 2 }); ctx.restore(); } K.slip('A BRILLIANT PLAN', 1350, 300, eob(seg(lt, br, br + 0.3)), 0.02, 40); } });
    X.ev(st + br, 'slip', 'A BRILLIANT PLAN'); X.cue(st + br, 'sparkle', { dur: 0.6, gain: 0.4 }); X.amb(st, X.end('4.14') + 0.3, 'room', 0.5); }
  { const st = X.at('4.14'), cl = X.w('clerk', '4.14') - st;
    sh({ id: 'K14', at: st, whip: 'right', move: cam.snap(cl, 0.16, [1000, 420]), note: 'Madras: the young English clerk at his ledger looks up', draw(lt, d, t) {
      R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 860, seed: 51 }); R.windowPane(220, 120, 320, 440, { sky: '#9DB4B0', sea: true, t, stars: false }); A.flag(380, 500, t, A.FLAGS.english, { s: 0.8 });
      R.table(1000, 720, 640, { h: 140 }); R.ledger(1080, 700, 1.1);
      const up = eio(seg(lt, cl - 0.4, cl)); ctx.save(); ctx.translate(1000, 900); ctx.rotate(lerp(0.12, 0, up)); ctx.translate(-1000, -900); person('clerk', { x: 1000, y: 900, h: 560, t, arm: lerp(60, 20, up) }); ctx.restore();
      K.slip('MADRAS', 1500, 220, eob(seg(lt, 0.3, 0.6)), 0.02, 40); K.slip('A YOUNG CLERK', 1500, 340, eob(seg(lt, cl, cl + 0.3)), -0.02, 36);
    } });
    X.ev(st + 0.3, 'slip', 'MADRAS'); X.ev(st + cl, 'pop', 'the clerk looks up', { gain: 0.5 }); X.ev(st + cl + 0.1, 'slip', 'A YOUNG CLERK', { sound: false }); }
}
