// CH5 · 1751: THE CLERK WHO STRUCK BACK (duel part 2: Clive). Arcot, 52 days; Chanda Sahib's fall; Paris counts the cost.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
import { boardOver, pieces } from './ch4_kingmaker.js';
const { P } = K;

function madrasOffice(t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 860, seed: 51 }); R.windowPane(220, 120, 320, 440, { sky: '#9DB4B0', sea: true, t, stars: false }); A.flag(380, 500, t, A.FLAGS.english, { s: 0.8 }); R.table(1000, 720, 640, { h: 140 }); }
function directors(t, bill = 0) {
  R.room({ wall: '#B9A98C', floor: '#5E4A36', fl: 860, seed: 81 }); R.dawnWash(0.4);
  R.table(960, 700, 900, { h: 160, cloth: '#2A2421' });
  for (const [x, d] of [[620, 1], [960, 1], [1300, -1]]) person('director', { x, y: 880, h: 560, t, dir: d, seed: x, arm: 30 + 10 * Math.sin(t * 4 + x) });
  R.ledger(960, 680, 1.3);
  if (bill > 0) { const L = 900 * eio(clamp(bill)); K.cut(K.P_rr(1180, 640, 140, 30 + L * 0.35, 3), '#F1E6CC', { shadow: 0.6, edge: 3 }); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 3; for (let y = 660; y < 640 + L * 0.35; y += 22) { ctx.beginPath(); ctx.moveTo(1195, y); ctx.lineTo(1300, y); ctx.stroke(); } K.slip('COST OF THE WARS', 1250, 300, eob(clamp(bill * 2)), 0.02, 36); }
}

export function build(X, C) {
  const ch = 5, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('5.1'), cl = X.w('clive', '5.1') - st;
    sh({ id: 'S01', at: st, move: cam.snap(cl, 0.16, [1000, 460]), note: 'snap "Clive": he slams the ledger, takes a sword', draw(lt, d, t) { madrasOffice(t); R.ledger(1080, 700, 1.1, { open: 1 - eio(seg(lt, cl - 0.2, cl)) }); const red = lt > cl + 0.3; person(red ? 'clive' : 'clerk', { x: 1000, y: 900, h: 560, t, arm: lt > cl ? 70 : 20, prop: lt > cl ? 'sword' : undefined }); K.ribbon('1751', W / 2, 150, eob(seg(lt, 0.2, 0.6)), 80); K.slip('ROBERT CLIVE', 1450, 300, eob(seg(lt, cl, cl + 0.3)), 0.02, 40); } });
    X.ev(st + 0.2, 'ribbon', '1751'); X.ev(st + cl, 'drop', 'ledger slams'); X.ev(st + cl + 0.3, 'slip', 'ROBERT CLIVE'); }
  X.amb(X.at('5.2'), X.end('5.3') + 0.3, 'rain', 1);
  { const st = X.at('5.2'), ar = X.w('aar', '5.2') - st, fi = X.w('five', '5.2') - st;
    sh({ id: 'S02', at: st, whip: 'down', move: cam.push(0.05, [800, 460]), note: 'a small crimson column marches to Arcot in the rain; stat card', draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), m = A.at(v, 'Madras'), a = A.at(v, 'Arcot');
      A.pin(...m, 'english', { r: 16 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 24 }); A.pin(...a, 'nawab', { r: 16 }); A.placeLabel('ARCOT', ...a, { size: 28, sc: eob(seg(lt, ar - 0.2, ar + 0.1)) });
      const h = A.drawPolyline([m, [(m[0] + a[0]) / 2, m[1] - 40], a], seg(lt, 0.2, ar + 0.3), P.crimson, 8, [18, 12]); if (lt < ar + 0.3) A.flag(h[0], h[1], t, A.FLAGS.english, { s: 0.45 });
      A.statCard({ x: 1460, y: 680, from: a, title: 'Arcot', stats: ['~500 men', '~52 days'], date: '1751', p: seg(lt, fi, fi + 0.6), portrait: portrait('clive') });
      SC.rainFx(t, 0.8);
    } });
    X.ev(st + 0.2, 'route', 'march to Arcot'); X.ev(st + fi, 'card', 'Arcot card'); X.cue(st + 1.2, 'thunder', { gain: 0.6 }); }
  { const st = X.at('5.3'), fi = X.w('fifty', '5.3') - st;
    sh({ id: 'S03', at: st, whip: 'right', move: cam.push(0.08, [960, 420]), note: 'Arcot walls in rain; a day counter 1 → 52', draw(lt, d, t) { SC.fortWalls(t, { rain: 1, flagCols: A.FLAGS.english }); const n = Math.max(1, Math.round(1 + 51 * eio(seg(lt, 0.1, fi + 0.4)))); K.cut(K.P_rr(1420, 430, 260, 150, 8), '#F1E6CC', { shadow: 0.7, edge: 4 }); ctx.font = '700 90px Caladea'; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`DAY ${n}`, 1550, 510); } });
    X.ev(st + 0.1, 'count', 'day counter', { gain: 0.5 }); X.ev(st + fi, 'seal', 'day 52'); X.cue(st + 1.0, 'thunder', { gain: 0.7 }); }
  { const st = X.at('5.4'), lo = X.w('losing', '5.4') - st;
    sh({ id: 'S04', at: st, whip: 'up', move: cam.drift(0.03, [W / 2, 470]), note: 'chessboard: the blue-backed kings wobble', draw(lt, d, t) { const sq = boardOver(t); const wob = Math.sin(lt * 9) * 0.08 * seg(lt, lo - 0.4, lo); pieces(sq, lt, { fall: 1, crown: true, wobble: wob }); } });
    X.ev(st + lo - 0.4, 'chess', 'kings wobble'); }
  { const st = X.at('5.5'), ca = X.w('captured', '5.5') - st;
    sh({ id: 'S05', at: st, move: cam.push(0.06, [760, 470]), note: 'Chanda Sahib\'s king is laid down slowly (silence beat, no sting)', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { fall: 1, crown: true, fallChanda: seg(lt, ca, ca + 1.6) }); K.ribbon('1752', W / 2, 150, eob(seg(lt, 0.2, 0.6)), 70); } });
    X.ev(st + 0.2, 'ribbon', '1752', { sound: false }); X.ev(st + ca, 'chess', 'king laid down', { gain: 0.4 }); }
  { const st = X.at('5.6'), pa = X.w('paris', '5.6') - st;
    sh({ id: 'S06', at: st, whip: 'left', move: cam.push(0.05, [960, 560]), note: 'Paris: three directors around a ledger; quills scratch', draw(lt, d, t) { directors(t); K.slip('PARIS', 400, 160, eob(seg(lt, pa, pa + 0.3)), -0.02, 40); } });
    X.ev(st + pa, 'slip', 'PARIS'); X.ev(st + 0.3, 'route', 'quills scratch', { dur: 2.2 }); X.amb(st, X.end('5.7') + 0.2, 'street', 0.5); }
  { const st = X.at('5.7'), co = X.w('cost', '5.7') - st;
    sh({ id: 'S07', at: st, move: cam.push(0.05, [1200, 600]), note: 'a bill unrolls off the table and keeps rolling', draw(lt, d, t) { directors(t, seg(lt, co - 0.2, d)); } });
    X.ev(st + co - 0.2, 'card', 'bill unrolls'); }
  { const st = X.at('5.8'), ho = X.w('home', '5.8') - st;
    sh({ id: 'S08', at: st, whip: 'right', move: cam.drift(0.03), note: 'Dupleix sails home (left); 1754', draw(lt, d, t) { SC.seaPage(t, lerp(1300, 700, eio(clamp(lt / d))), { dir: -1 }); person('dupleix', { x: lerp(1300, 700, eio(clamp(lt / d))) - 40, y: 600, h: 200, t, dir: -1 }); K.ribbon('1754', W / 2, 150, eob(seg(lt, 0.2, 0.6)), 80); K.slip('DUPLEIX RECALLED', 1450, 300, eob(seg(lt, ho, ho + 0.3)), 0.02, 36); } });
    X.ev(st + 0.2, 'ribbon', '1754'); X.ev(st + ho, 'slip', 'RECALLED'); X.amb(st, X.end('5.8') + 0.2, 'sea', 0.8); }
  { const st = X.at('5.9'), tr = X.w('truce', '5.9') - st;
    sh({ id: 'S09', at: st, whip: 'down', move: cam.drift(0.03), note: 'truce scroll; wax seal', draw(lt, d, t) { K.parchment(83); SC.scroll(W / 2, 480, 620, seg(lt, 0.1, 0.8), { title: 'TRUCE · 1754', seal: lt - tr }); } });
    X.ev(st + 0.1, 'card', 'truce scroll'); X.ev(st + tr, 'seal', 'truce seal'); }
  { const st = X.at('5.10'), bo = X.w('board', '5.10') - st;
    sh({ id: 'S10', at: st, whip: 'up', move: cam.push(0.06, [W / 2, 470]), note: 'the chessboard, empty but for fallen pieces', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { fall: 1, fallChanda: 1, backP: { french: 1 - seg(lt, 0.2, bo), english: 1 }, crown: false }); } });
    X.ev(st + 0.2, 'chess', 'blue pieces leave'); }
  { const st = X.at('5.11'), no = X.w('not', '5.11') - st;
    sh({ id: 'S11', at: st, move: cam.push(0.07, [700, 420]), note: 'one blue pawn rocks back upright', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { fall: 1, fallChanda: 1, backP: { french: 0, english: 1 } }); const [x, y] = sq(1.2, 3.6); const up = seg(lt, no, no + 0.6); A.chessPiece(x, y, { kind: 'pawn', side: 'french', s: 1.35, fall: 1 - eob(up) * 1 + Math.sin(lt * 12) * 0.03 * (1 - up) }); } });
    X.ev(st + no, 'chess', 'blue pawn rocks upright'); }
}
