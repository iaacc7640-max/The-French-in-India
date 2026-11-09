// CH0 · COLD OPEN: the paradox (no card). 1,000 beat 10,000; a Frenchman picks India's kings; yet France executes
// its own general for losing it all. "The answer wasn't a battle. It was a supply line."
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

/** Lally's room in Paris at dawn: door, chair with his coat, a candle on a small table */
function parisRoom(t, { out = 0, seal = 0 } = {}) {
  R.room({ wall: '#B9A98C', floor: '#6E5A44', fl: 840, seed: 17 }); R.dawnWash(0.9);
  R.windowPane(1320, 140, 300, 420, { sky: '#5A7096', sea: false, t, stars: false });
  R.door(240, 220, 300, 620);
  R.chairWithCoat(860, 840, { s: 1.05 });
  R.table(1180, 700, 260, { h: 140 }); R.candle(1180, 676, t, { s: 1.1, out });
  if (seal > 0) A.wordSeal('COUPABLE', 1500, 700, lerp(1.9, 0.95, eo(clamp(seal / 0.25))), clamp(seal * 4), P.crimson, 30);
}

export function build(X, C) {
  const ch = 0, sh = (o) => X.add({ chapter: ch, ...o });
  X.amb(0, X.end('0.4') + 0.3, 'wind', 0.6);

  // 0.0 · the paradox as a question: a crowned blue king topples on Dupleix's board
  { const st = 0, lo = X.w('lose', '0.0') - st;
    sh({ id: 'H00', at: st, move: cam.push(0.06, [1180, 470]), note: 'opening question: the crowned blue king topples; slip "?"', draw(lt, d, t) {
      K.parchment(29); const sq = A.chessboard({ x: 1180, y: 520, size: 560, tilt: 0.5 });
      A.chessPiece(...sq(3, 4), { kind: 'king', side: 'french', s: 1.4, crown: true, fall: eio(seg(lt, lo - 0.2, lo + 0.6)) });
      A.chessPiece(...sq(5, 2), { kind: 'king', side: 'english', s: 1.4 });
      R.dotArmy(380, 420, 10, 6, 16, P.royal, { t, r: 5, seed: 2 }); R.dotArmy(380, 640, 30, 10, 11, P.forest, { t, r: 4, seed: 7 });
      K.slip('×10', 380, 250, eob(seg(lt, 1.0, 1.3)), -0.02, 44); K.slip('?', 1520, 200, eob(seg(lt, lo + 0.4, lo + 0.7)), 0.03, 70);
    } });
    X.ev(st + 1.0, 'slip', 'x10'); X.ev(st + lo - 0.2, 'fall', 'blue king topples'); X.ev(st + lo + 0.4, 'slip', 'question mark'); }

  // 0.1 · a tidy block of ~1,000 blue dots marches in; 1746 ribbon
  { const st = X.at('0.1'), rib = 0.6;
    sh({ id: 'H01', at: st, whip: 'right', move: cam.drift(0.03), note: '1,000 blue dots march in; 1746 ribbon', draw(lt, d, t) {
      K.parchment(31); R.dotArmy(520 + eo(clamp(lt / 3)) * 80, 560, 40, 25, 15, P.royal, { t, march: clamp(lt / 2.6), r: 5, seed: 2 });
      K.ribbon('1746', W / 2, 190, eob(seg(lt, rib, rib + 0.4)), 90);
      K.slip('~1,000', 520, 820, eob(seg(lt, 2.3, 2.6)), -0.02, 46);
    } });
    X.ev(st + rib, 'ribbon', '1746'); X.ev(st + 1.2, 'drums', 'dots march', { dur: 3.0, gain: 0.45 }); X.ev(st + 2.3, 'slip', '~1,000'); }

  // 0.2 · snap onto "ten thousand": the green cloud; Adyar stat card; the cloud scatters
  { const st = X.at('0.2'), ten = X.w('ten', '0.2') - st;
    sh({ id: 'H02', at: st, move: cam.snap(ten, 0.14, [1350, 520]), note: 'snap: 10,000 green cloud; Adyar stat card; cloud scatters', draw(lt, d, t) {
      K.parchment(31); R.dotArmy(600, 560, 40, 25, 15, P.royal, { t, r: 5, seed: 2 });
      const sc = seg(lt, d - 0.9, d);
      R.dotArmy(1380, 520, 64, 44, 11, P.forest, { t, r: 4, march: clamp((lt - ten + 0.6) / 0.6), seed: 7, scatter: eio(sc) });
      A.statCard({ x: 1440, y: 600, title: 'Adyar', stats: ['~350 French + ~700 sepoys', 'vs ~10,000'], date: '24 Oct 1746', p: seg(lt, ten + 0.45, ten + 1.0), hi: 1, from: [1100, 560], portrait: portrait('paradis') });
    } });
    X.ev(st + ten - 0.3, 'pop', 'green cloud appears'); X.ev(st + ten + 0.45, 'card', 'Adyar stat card'); X.ev(st + 2.2, 'whip', 'cloud scatters', { gain: 0.5 }); }

  // 0.3 · whip → Dupleix at a chessboard, candle; push
  const board = (lt, t, crown) => {
    R.room({ wall: '#C2AE88', floor: '#7A5236', fl: 840, seed: 41, wash: '#2F3550', washA: 0.35 });
    R.windowPane(160, 120, 300, 420, { t, moon: true });
    R.table(1180, 640, 820, { h: 200, cloth: P.royal });
    const sq = A.chessboard({ x: 1180, y: 520, size: 420, tilt: 0.42 });
    A.chessPiece(...sq(2, 4), { kind: 'king', side: 'nizam', s: 0.75, crown: crown > 0 && crown >= 1 });
    A.chessPiece(...sq(5, 3), { kind: 'king', side: 'nawab', s: 0.75 });
    A.chessPiece(...sq(1.4, 3.2), { kind: 'pawn', side: 'french', s: 0.65 }); A.chessPiece(...sq(6, 2.4), { kind: 'pawn', side: 'english', s: 0.65 });
    R.candle(1560, 600, t, { s: 0.9 });
    person('dupleix', { x: 640, y: 900, h: 620, t, arm: 30 + crown * 25, prop: crown >= 1 ? 'none' : 'chess' });
    if (crown > 0 && crown < 1) { const [kx, ky] = sq(2, 4); const y = lerp(ky - 360, ky - 92, eio(crown)); A.chessPiece(kx, y + 92, { kind: 'king', side: 'nizam', s: 0, sc: 0 }); ctx.save(); ctx.translate(kx, y); ctx.scale(0.75, 0.75); K.cut(K.P_poly([[-24, 0], [-28, -28], [-12, -14], [0, -34], [12, -14], [28, -28], [24, 0]]), P.gold, { shadow: 0.5, edge: 3 }); ctx.restore(); }
  };
  { const st = X.at('0.3');
    sh({ id: 'H03', at: st, whip: 'right', move: cam.push(0.06, [900, 520]), note: 'Dupleix at a chessboard, candle', draw(lt, d, t) {
      board(lt, t, 0); K.slip('DUPLEIX', 640, 160, eob(seg(lt, 0.5, 0.8)), -0.02, 44);
    } });
    X.ev(st + 0.5, 'slip', 'name slip DUPLEIX'); X.ev(st + 1.9, 'light', 'candle glow swells', { sound: false }); X.amb(st, X.end('0.4') + 0.2, 'room', 0.5); }

  // 0.4 · snap "thrones": Dupleix sets a gold crown on a chess king
  { const st = X.at('0.4'), thr = X.w('thrones', '0.4') - st;
    sh({ id: 'H04', at: st, move: cam.snap(thr, 0.16, [1000, 420]), note: 'crown descends onto the chess king (click)', draw(lt, d, t) {
      board(lt, t, seg(lt, thr - 0.7, thr));
    } });
    X.ev(st + thr, 'chess', 'crown lands on the king'); }

  // 0.5-0.7 · whip → Paris at dawn: door, Lally's coat on a chair, candle; push 8% across the three cuts
  const pStart = X.at('0.5'), exe = X.w('executed', '0.6');
  { sh({ id: 'H05', at: pStart, whip: 'left', era: null, move: cam.push(0.05, [1000, 560]), note: 'Paris door at dawn, Lally coat, candle; 1766', draw(lt, d, t) {
      parisRoom(t); K.ribbon('1766', W / 2, 150, eob(seg(lt, 0.3, 0.7)), 80);
    } });
    X.ev(pStart + 0.3, 'ribbon', '1766'); X.amb(pStart, X.end('0.7') + 0.2, 'street', 0.6); }
  { const st = X.at('0.6'), e = exe - st;
    sh({ id: 'H06', at: st, move: cam.snap(e, 0.12, [1180, 560]), note: 'snap "executed": candle out, COUPABLE seal', draw(lt, d, t) {
      parisRoom(t, { out: seg(lt, e, e + 0.5) * 1.0 + (lt > e + 0.5 ? (lt - e - 0.5) * 0.4 : 0), seal: lt - e - 0.5 });
      K.slip('MAY 1766', 400, 140, 1, -0.03, 40);
    } });
    X.ev(exe, 'candle', 'candle goes out'); X.ev(exe + 0.5, 'seal', 'COUPABLE seal'); X.cue(exe + 0.55, 'gavel'); X.cue(exe + 1.4, 'door', { gain: 0.8 }); }
  { const st = X.at('0.7');
    sh({ id: 'H07', at: st, move: cam.push(0.06, [860, 560]), note: 'empty chair; COMTE DE LALLY slip', draw(lt, d, t) {
      parisRoom(t, { out: 2, seal: 1 }); K.slip('COMTE DE LALLY', 860, 300, eob(seg(lt, 0.15, 0.45)), 0.02, 46);
    } });
    X.ev(st + 0.15, 'slip', 'COMTE DE LALLY'); }

  // 0.8-0.10 · the two-colour map: half blue, half red; the blue drains away
  const twoColour = (t, blue, swords = 0, strike = 0) => {
    const v = A.realMap({ view: 'india', t }), at = (n) => A.at(v, n);
    A.inkBleed(...at('Calcutta'), 760, 1, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.55 });
    A.inkBleed(...at('Pondicherry'), 560, blue, P.royal, { clipFn: A.mainland(v), seed: 2, alpha: 0.82 });
    for (const n of ['Pondicherry', 'Chandernagore', 'Masulipatnam', 'Mahe', 'Karaikal', 'Yanam']) A.pin(...at(n), 'french', { star: n === 'Pondicherry', glow: 0.5 + 0.5 * Math.sin(t * 3) });
    for (const n of ['Madras', 'Calcutta', 'Bombay']) A.pin(...at(n), 'english');
    if (swords > 0) R.crossedSwords(1450, 420, eob(clamp(swords)) * 0.9, strike);
    return v;
  };
  { const st = X.at('0.8');
    sh({ id: 'H08', at: st, whip: 'down', move: cam.drift(0.03, [800, 500]), note: 'India half blue, half red; blue pins pulse', draw(lt, d, t) { twoColour(t, 1); } });
    X.ev(st + 0.4, 'ink', 'blue and red territory', { sound: false }); X.ev(st + 1.2, 'pop', 'blue pins pulse', { gain: 0.4 }); X.amb(st, X.end('0.11') + 0.4, 'wind', 0.5); }
  { const st = X.at('0.9'), ev = X.w('everything', '0.9') - st;
    sh({ id: 'H09', at: st, move: cam.drift(0.03, [800, 500]), note: 'the blue ink DRAINS back to its pins', draw(lt, d, t) { twoColour(t, 1 - eio(seg(lt, 0.1, ev + 0.6))); } });
    X.ev(st + 0.1, 'ink', 'blue drains away'); }
  { const st = X.at('0.10'), bat = X.w('battle', '0.10') - st;
    sh({ id: 'H10', at: st, move: cam.push(0.05, [1100, 480]), note: 'crossed swords pop and are struck through', draw(lt, d, t) { twoColour(t, 0, seg(lt, bat - 0.3, bat), seg(lt, bat + 0.35, bat + 0.7)); } });
    X.ev(st + bat - 0.3, 'pop', 'crossed swords'); X.ev(st + bat + 0.35, 'route', 'struck through'); }

  // 0.11 · snap "supply": a faint crimson arrow from Bengal (teaser) appears and fades
  { const st = X.at('0.11'), sup = X.w('supply', '0.11') - st;
    sh({ id: 'H11', at: st, move: cam.snap(sup, 0.14, [1000, 400]), note: 'snap "supply": crimson arrow silhouette from Bengal (teaser)', draw(lt, d, t) {
      const v = twoColour(t, 0), at = (n) => A.at(v, n);
      const g = clamp((lt - sup + 0.2) / 0.3) * (1 - clamp((lt - sup - 1.4) / 0.6));
      A.supplyLine([at('Calcutta'), [1330, 330], [1150, 560], at('Madras')], { p: 1, ghost: 0.45 * g, t });
    } });
    X.ev(st + sup, 'route', 'supply line teaser'); }
}
