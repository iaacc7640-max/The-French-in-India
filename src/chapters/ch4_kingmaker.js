// CH4 · 1749: THE KINGMAKER (duel part 1: Dupleix). Why conquer India's thrones when you can choose who sits on them?
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

/** Dupleix's study in Pondicherry at night: window over the sea, candle */
function study(t) { R.room({ wall: '#C2AE88', floor: '#7A5236', fl: 860, seed: 43, wash: '#2F3550', washA: 0.4 }); R.windowPane(260, 110, 340, 480, { t, moon: true }); R.table(1420, 700, 420, { h: 160 }); R.candle(1420, 676, t, { s: 1.0 }); }
/** the chessboard over the south India map; returns the square→xy function */
function boardOver(t, { p = 1, view = 'south' } = {}) { A.realMap({ view, t }); return A.chessboard({ x: W / 2, y: 470, size: 720, tilt: 0.6, p }); }
const KINGS = [  // name, side colour, file, rank, backer
  ['Muzaffar Jang', 'nizam', 1.5, 2.2, 'french'], ['Chanda Sahib', 'nawab', 2.5, 5.2, 'french'],
  ['Nasir Jang', 'nizam', 5.8, 2.2, 'english'], ['Anwar-ud-din', 'nawab', 5.0, 5.2, 'english']];
/** draw the four kings + backers. o: kingsP (pop 0..1 per king), backP {french, english}, fall (Anwar-ud-din), crown */
function pieces(sq, lt, o = {}) {
  KINGS.forEach(([n, side, f, r, backer], i) => {
    const kp = o.kingsP ? o.kingsP(i) : 1, bp = (o.backP || {})[backer] ?? 1, off = backer === 'french' ? -0.75 : 0.75;
    if (bp > 0) { const [x0, y0] = sq(f + off * 3, r - 0.9), [x1, y1] = sq(f + off, r - 0.9); A.chessPiece(lerp(x0, x1, eio(bp)), lerp(y0, y1, eio(bp)), { kind: 'pawn', side: backer, s: 0.85, sc: clamp(bp * 4) }); }
    const fall = i === 3 ? (o.fall || 0) : 0;
    A.chessPiece(...sq(f, r), { kind: 'king', side, s: 0.95, sc: eob(clamp(kp)), label: n, fall, crown: i === 0 && o.crown });
  });
}

export function build(X, C) {
  const ch = 4, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(C.start, X.end('4.4') + 0.3, 'room', 0.5);

  // 4.1 · Dupleix turns from the window
  { const st = X.at('4.1');
    sh({ id: 'K01', at: st, move: cam.push(0.05, [820, 520]), note: 'Dupleix turns from the window; candle', draw(lt, d, t) {
      study(t); const turn = eio(seg(lt, 0.3, 0.8)); ctx.save(); ctx.translate(820, 0); ctx.scale(lerp(-1, 1, turn) || 0.02, 1); ctx.translate(-820, 0); person('dupleix', { x: 820, y: 920, h: 640, t }); ctx.restore();
      K.slip('JOSEPH FRANÇOIS DUPLEIX', 1300, 200, eob(seg(lt, 1.0, 1.3)), -0.02, 40);
    } });
    X.ev(st + 0.3, 'whip', 'Dupleix turns', { gain: 0.35 }); X.ev(st + 1.0, 'slip', 'name slip'); }
  // 4.2 · he lifts a chess king into the light
  { const st = X.at('4.2');
    sh({ id: 'K02', at: st, move: cam.push(0.07, [900, 420]), note: 'Dupleix lifts a chess king into the candlelight', draw(lt, d, t) {
      study(t); person('dupleix', { x: 820, y: 940, h: 700, t, arm: lerp(10, 95, eio(seg(lt, 0.2, 1.0))) });
    } });
    X.ev(st + 0.2, 'light', 'king lifted', { sound: false }); }
  // 4.3 · the chessboard ink-bleeds over the south India map
  { const st = X.at('4.3');
    sh({ id: 'K03', at: st, whip: 'down', move: cam.drift(0.03, [W / 2, 470]), note: 'THE CHESSBOARD fades in over south India', draw(lt, d, t) { boardOver(t, { p: seg(lt, 0.1, 0.9) }); } });
    X.ev(st + 0.1, 'ink', 'board bleeds in'); X.amb(st, X.end('4.7') + 0.3, 'pulse', 0.4); }
  // 4.4 · snap "choose": a hand sets a blue piece behind a king
  { const st = X.at('4.4'), cho = X.w('choose', '4.4') - st;
    sh({ id: 'K04', at: st, move: cam.snap(cho, 0.15, [W / 2 - 60, 380]), note: 'snap "choose": a hand sets a blue pawn behind a king', draw(lt, d, t) {
      const sq = boardOver(t); pieces(sq, lt, { backP: { french: 0, english: 0 } });
      const [x, y] = sq(0.75, 1.3), down = eio(seg(lt, cho - 0.5, cho)), up = eio(seg(lt, cho + 0.25, cho + 0.8));
      if (lt < cho) R.reachingHand(x, lerp(y - 260, y, down), { hold: () => A.chessPiece(0, 40, { kind: 'pawn', side: 'french', s: 0.85 }) });
      else { A.chessPiece(x, y, { kind: 'pawn', side: 'french', s: 0.85 }); R.reachingHand(x, lerp(y, y - 600, up)); }
    } });
    X.ev(st + cho, 'chess', 'blue piece set down'); }
  // 4.5 · four kings pop in pairs facing each other
  { const st = X.at('4.5'), hy = X.w('hyderabad', '4.5') - st, ca = X.w('carnatic', '4.5') - st;
    sh({ id: 'K05', at: st, move: cam.drift(0.03, [W / 2, 470]), note: 'four kings pop in pairs (Hyderabad pair, Carnatic pair)', draw(lt, d, t) {
      const sq = boardOver(t); pieces(sq, lt, { backP: { french: 0, english: 0 }, kingsP: (i) => seg(lt, (i % 2 === 0 ? hy : ca) - 0.2 + (i > 1 ? 0.15 : 0), (i % 2 === 0 ? hy : ca) + 0.2 + (i > 1 ? 0.15 : 0)) });
      K.slip('HYDERABAD', 560, 120, eob(seg(lt, hy - 0.1, hy + 0.2)), -0.02, 34); K.slip('THE CARNATIC', 1360, 120, eob(seg(lt, ca - 0.1, ca + 0.2)), 0.02, 34);
    } });
    X.ev(st + hy - 0.2, 'chess', 'Hyderabad pair'); X.ev(st + ca - 0.2, 'chess', 'Carnatic pair'); }
  // 4.6 · blue pieces slide behind Muzaffar Jang and Chanda Sahib
  { const st = X.at('4.6'), b = X.w('backed', '4.6') - st;
    sh({ id: 'K06', at: st, move: cam.push(0.05, [700, 470]), note: 'blue pieces slide behind Muzaffar Jang and Chanda Sahib', draw(lt, d, t) {
      const sq = boardOver(t); pieces(sq, lt, { backP: { french: seg(lt, b, b + 0.8), english: 0 } });
    } });
    X.ev(st + b + 0.4, 'chess', 'blue pieces slide in'); }
  // 4.7 · crimson pieces slide behind Nasir Jang and Anwar-ud-din
  { const st = X.at('4.7'), e = X.w('english', '4.7') - st;
    sh({ id: 'K07', at: st, move: cam.push(0.05, [1220, 470]), note: 'crimson pieces slide behind Nasir Jang and Anwar-ud-din', draw(lt, d, t) {
      const sq = boardOver(t); pieces(sq, lt, { backP: { french: 1, english: seg(lt, e, e + 0.8) } });
    } });
    X.ev(st + e + 0.4, 'chess', 'crimson pieces slide in'); }
  // 4.8 · whip → map: Ambur, drums, 1749 ribbon, stat card
  { const st = X.at('4.8'), am = X.w('aam', '4.8') - st;
    sh({ id: 'K08', at: st, whip: 'right', move: cam.push(0.07, [700, 520]), note: 'Carnatic map: Ambur pin, drums, 1749, Ambur stat card', draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), at = (n) => A.at(v, n);
      A.pin(...at('Pondicherry'), 'french', { star: true }); A.pin(...at('Madras'), 'english'); A.placeLabel('PONDICHERRY', ...at('Pondicherry'), { dx: 150, dy: 0, size: 24 }); A.placeLabel('MADRAS', ...at('Madras'), { dx: 100, dy: 0, size: 24 });
      const [ax, ay] = at('Ambur'); A.pin(ax, ay, 'nawab', { sc: eob(seg(lt, am - 0.2, am + 0.1)), r: 16 }); A.placeLabel('AMBUR', ax, ay, { sc: eob(seg(lt, am, am + 0.3)), size: 28 });
      A.flag(ax - 70, ay + 10, t, A.FLAGS.nawab, { s: 0.7 }); A.flag(ax + 30, ay + 10, t, A.FLAGS.french, { s: 0.7, seed: 2 });
      A.statCard({ x: 1460, y: 330, from: [ax, ay], title: 'Ambur', stats: ['Nawab Anwar-ud-din killed'], date: '1749', p: seg(lt, am + 0.6, am + 1.2) });
      K.ribbon('1749', 760, 170, eob(seg(lt, 0.2, 0.6)), 80);
    } });
    X.ev(st + 0.2, 'ribbon', '1749'); X.ev(st + am - 0.2, 'pop', 'Ambur pin'); X.ev(st + am + 0.6, 'card', 'Ambur stat card'); X.cue(st, 'drums', { dur: 4.0, gain: 0.6 }); }
  // 4.9 · a green king falls slowly; cut-in: a turban resting on an empty saddle (serious, no sting)
  { const st = X.at('4.9'), ki = X.w('killed', '4.9') - st;
    sh({ id: 'K09', at: st, move: cam.push(0.06, [1120, 470]), note: 'Anwar-ud-din king falls slowly → turban on an empty saddle', draw(lt, d, t) {
      if (lt < ki + 0.1) { const sq = boardOver(t); pieces(sq, lt, { fall: seg(lt, 0.2, ki) }); }
      else { K.parchment(47); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#2F3550'; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); R.emptySaddle(W / 2 - 40, 840, t, { s: 1.4, turban: P.gold }); }
    } });
    X.ev(st + 0.2, 'fall', 'green king tips over', { gain: 0.5 }); X.ev(st + ki + 0.1, 'whip', 'cut-in: empty saddle', { sound: false }); }
  // 4.10 · the Krishna draws itself; blue ink-bleeds over everything south of it; gold title seal
  { const st = X.at('4.10'), kr = X.w('krishna', '4.10') - st, gov = X.w('governor', '4.10') - st;
    sh({ id: 'K10', at: st, whip: 'up', move: cam.drift(0.03, [900, 560]), note: 'the Krishna draws itself; blue bleeds south of it; gold seal', draw(lt, d, t) {
      const v = A.realMap({ view: 'south', t }), at = (n) => A.at(v, n);
      A.krishna(v, seg(lt, 0.1, kr), 9);
      A.inkBleed(...at('Pondicherry'), 1100, seg(lt, kr - 0.2, kr + 1.2), P.royal, { clipFn: () => { clipSouthOfKrishna(v); }, seed: 3, alpha: 0.6 });
      A.pin(...at('Pondicherry'), 'french', { star: true }); A.placeLabel('KRISHNA', ...A.proj(v, 77.4, 16.1), { dy: -34, size: 26, sc: eob(seg(lt, kr - 0.4, kr)) });
      A.wordSeal('GOVERNOR', 1560, 300, eob(seg(lt, gov + 0.2, gov + 0.5)) * 0.85, clamp((lt - gov - 0.2) * 4), P.gold, 26);
    } });
    X.ev(st + 0.1, 'route', 'Krishna draws itself', { dur: 1.2 }); X.ev(st + kr - 0.2, 'ink', 'blue bleeds south of the Krishna'); X.ev(st + gov + 0.2, 'seal', 'gold seal'); }
  // 4.11 · whip → Hyderabad court: Bussy beside the throne
  { const st = X.at('4.11'), bu = X.w('boo', '4.11') - st;
    sh({ id: 'K11', at: st, whip: 'right', move: cam.push(0.05, [W / 2, 520]), note: 'Hyderabad court: Bussy beside the throne', draw(lt, d, t) {
      hydCourt(t); person('bussy', { x: 1260, y: 900, h: 560, t, dir: -1 });
      K.slip('BUSSY', 1260, 200, eob(seg(lt, bu, bu + 0.3)), 0.02, 40); K.slip('HYDERABAD', 560, 200, eob(seg(lt, 0.2, 0.5)), -0.02, 40);
    } });
    X.ev(st + 0.2, 'slip', 'HYDERABAD'); X.ev(st + bu, 'slip', 'name slip BUSSY'); X.amb(st, X.end('4.12') + 0.2, 'court', 0.7); }
  // 4.12 · a coin purse passes from the ruler to Bussy's men
  { const st = X.at('4.12'), pa = X.w('paid', '4.12') - st;
    sh({ id: 'K12', at: st, move: cam.push(0.05, [1000, 560]), note: 'a coin purse passes from the ruler to Bussy', draw(lt, d, t) {
      hydCourt(t); person('bussy', { x: 1260, y: 900, h: 560, t, dir: -1, arm: 40 });
      const u = eio(seg(lt, pa, pa + 0.9)); ctx.save(); ctx.translate(lerp(900, 1180, u), lerp(560, 540, u) - Math.sin(u * Math.PI) * 60); ctx.scale(1.4, 1.4); K.cut(K.P_circ(0, 0, 26), '#8C5A3C', { shadow: 0.5, edge: 3 }); K.cut(K.P_poly([[-12, -24], [12, -24], [0, -10]]), '#8C5A3C', { shadow: 0, edge: 3 }); ctx.restore();
    } });
    X.ev(st + pa, 'coin', 'purse passes'); }
  // 4.13 · Dupleix holding the crowned king
  { const st = X.at('4.13'), br = X.w('brilliant', '4.13') - st;
    sh({ id: 'K13', at: st, move: cam.drift(0.03, [900, 460]), note: 'Dupleix holds the crowned king; gold glint', draw(lt, d, t) {
      study(t); person('dupleix', { x: 820, y: 940, h: 700, t, arm: 95 });
      const g = Math.exp(-((lt - br) ** 2) * 18); if (g > 0.02) { ctx.save(); ctx.globalAlpha = g; K.cut(K.P_poly([[1010, 260], [1022, 290], [1052, 302], [1022, 314], [1010, 344], [998, 314], [968, 302], [998, 290]]), '#F2C14E', { shadow: 0, edge: 2 }); ctx.restore(); }
    } });
    X.ev(st + br, 'light', 'gold glint', { sound: false }); X.cue(st + br, 'sparkle', { dur: 0.6, gain: 0.4 }); }
  // 4.14 · whip → Madras: a young clerk at a ledger looks up (snap "clerk"); sting handled by the orchestrator
  { const st = X.at('4.14'), cl = X.w('clerk', '4.14') - st;
    sh({ id: 'K14', at: st, whip: 'right', move: cam.snap(cl, 0.18, [1000, 420]), note: 'Madras: the young clerk at his ledger looks up', draw(lt, d, t) {
      R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 860, seed: 51 }); R.windowPane(220, 120, 320, 440, { sky: '#9DB4B0', sea: true, t, stars: false });
      A.flag(380, 500, t, A.FLAGS.english, { s: 0.8 });
      R.table(1000, 720, 640, { h: 140 }); R.ledger(1080, 700, 1.1);
      const up = eio(seg(lt, cl - 0.4, cl)); ctx.save(); ctx.translate(1000, 900); ctx.rotate(lerp(0.12, 0, up)); ctx.translate(-1000, -900); person('clerk', { x: 1000, y: 900, h: 560, t, arm: lerp(60, 20, up) }); ctx.restore();
      K.slip('MADRAS', 380, 140, eob(seg(lt, 0.2, 0.5)), -0.02, 40);
    } });
    X.ev(st + 0.2, 'slip', 'MADRAS'); X.ev(st + cl, 'pop', 'the clerk looks up', { gain: 0.5 }); X.amb(st, X.end('4.14') + 0.3, 'room', 0.5); }
}

/** the Hyderabad court: green banners (the Nizam), a throne with the ruler */
function hydCourt(t) {
  R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 53 });
  for (const x of [300, 700, 1220, 1620]) K.cut(() => { ctx.beginPath(); ctx.moveTo(x - 120, 880); ctx.lineTo(x - 120, 360); ctx.arc(x, 360, 120, Math.PI, Math.PI * 2); ctx.lineTo(x + 120, 880); ctx.closePath(); }, '#B39E78', { shadow: 0, edge: 0 });
  for (const x of [520, 1420]) A.flag(x, 360, t, ['#3F5E3A', '#F4EEDD', '#3F5E3A'], { s: 1.6, seed: x });
  R.throne(900, 880, { s: 1.0 });
  person('nizam', { x: 900, y: 860, h: 470, t, seed: 4 });   // the ruler Bussy served (unnamed on screen)
}
/** clip to the land south of the Krishna (a polygon: the river line closed around the south of the map) */
function clipSouthOfKrishna(v) {
  A.landPath(v)(); ctx.clip();
  const pts = A.KRISHNA.map(([a, b]) => A.proj(v, a, b)); ctx.beginPath(); ctx.moveTo(-400, pts[0][1]); pts.forEach((p) => ctx.lineTo(...p)); ctx.lineTo(W + 400, pts[pts.length - 1][1]); ctx.lineTo(W + 400, H + 400); ctx.lineTo(-400, H + 400); ctx.closePath();
}
