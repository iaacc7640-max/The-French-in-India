// CH5 · 1751: THE CLERK WHO STRUCK BACK (duel part 2: Clive). Arcot, 52 days; Chanda Sahib's fall; Paris counts the cost.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

function madrasOffice(t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 860, seed: 51 }); R.windowPane(220, 120, 320, 440, { sky: '#9DB4B0', sea: true, t, stars: false }); A.flag(380, 500, t, A.FLAGS.english, { s: 0.8 }); R.table(1000, 720, 640, { h: 140 }); }
export function directors(t, bill = 0) {
  R.room({ wall: '#B9A98C', floor: '#5E4A36', fl: 860, seed: 81 }); R.dawnWash(0.4);
  R.table(960, 700, 900, { h: 160, cloth: '#2A2421' });
  for (const [x, d] of [[620, 1], [960, 1], [1300, -1]]) person('director', { x, y: 880, h: 560, t, dir: d, seed: x, arm: 30 + 10 * Math.sin(t * 4 + x) });
  R.ledger(960, 680, 1.3);
  if (bill > 0) { const L = 900 * eio(clamp(bill)); K.cut(K.P_rr(1180, 640, 140, 30 + L * 0.2, 3), '#F1E6CC', { shadow: 0.6, edge: 3 }); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 3; for (let y = 660; y < 640 + L * 0.2; y += 22) { ctx.beginPath(); ctx.moveTo(1195, y); ctx.lineTo(1300, y); ctx.stroke(); } for (let i = 0; i < 5; i++) { const c = clamp(bill * 6 - i); if (c > 0) A.iconAt('coin', 1420 + i * 44, 640 - Math.sin(c * Math.PI) * 40, 1.5 * (1 - 0.6 * eio(clamp(bill * 3 - i * 0.4 - 1)))); } }
}

export function build(X, C) {
  const ch = 5, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('5.1'), cl = X.w('clive', '5.1') - st;
    sh({ id: 'S01', at: st, move: cam.snap(cl, 0.14, [1000, 460]), note: 'snap "Clive": the clerk shuts the ledger, takes a sword and a red coat', draw(lt, d, t) { madrasOffice(t); R.ledger(1080, 700, 1.1, { open: 1 - eio(seg(lt, cl - 0.2, cl)) }); const red = lt > cl + 0.3; person(red ? 'clive' : 'clerk', { x: 1000, y: 900, h: 560, t, arm: lt > cl ? 70 : 20, prop: lt > cl ? 'sword' : undefined }); K.ribbon('1751', 1500, 220, eob(seg(lt, 0.2, 0.6)), 80); K.slip('ROBERT CLIVE', 1500, 360, eob(seg(lt, cl, cl + 0.3)), 0.02, 40); } });
    X.ev(st + 0.2, 'ribbon', '1751'); X.ev(st + cl, 'drop', 'the ledger slams shut'); X.ev(st + cl + 0.3, 'slip', 'ROBERT CLIVE'); X.amb(st, X.end('5.1') + 0.2, 'room', 0.5); }
  X.amb(X.at('5.2'), X.end('5.3') + 0.3, 'rain', 1);
  { const st = X.at('5.2'), ar = X.w('aar', '5.2') - st, fi = X.w('five', '5.2') - st;
    sh({ id: 'S02', at: st, whip: 'down', move: cam.push(0.05, [800, 460]), note: 'a small column of redcoats marches from Madras to Arcot in the rain; card', draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), m = A.at(v, 'Madras'), a = A.at(v, 'Arcot'), k = eio(seg(lt, 0.2, ar + 0.4));
      A.pin(...m, 'english', { r: 16 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 24 }); A.pin(...a, 'nawab', { r: 16 }); A.placeLabel('ARCOT', ...a, { size: 28, dy: 44, sc: eob(seg(lt, ar - 0.2, ar + 0.1)) });
      A.drawPolyline([m, [(m[0] + a[0]) / 2, m[1] - 40], a], k, P.crimson, 8, [18, 12]);
      const ax = lerp(m[0], a[0], k), ay = lerp(m[1], a[1], k) - Math.sin(k * Math.PI) * 30; R.army(ax, ay - 50, 6, 2, P.crimson, { t, seed: 2, step: k < 1 ? 1 : 0, s: 1.2 }); A.flag(ax + 110, ay - 50, t, A.FLAGS.english, { s: 0.6 });
      A.statCard({ x: 1480, y: 640, from: a, title: 'Arcot', stats: ['~500 men', '~52 days'], date: '1751', p: seg(lt, fi, fi + 0.6), portrait: portrait('clive') }); SC.rainFx(t, 0.8);
    } });
    X.ev(st + 0.2, 'route', 'the march to Arcot'); X.ev(st + ar - 0.2, 'pop', 'Arcot'); X.ev(st + fi, 'card', 'Arcot card'); X.cue(st + 1.2, 'thunder', { gain: 0.6 }); }
  { const st = X.at('5.3'), fi = X.w('fifty', '5.3') - st;
    sh({ id: 'S03', at: st, whip: 'right', move: cam.push(0.08, [960, 420]), note: 'the walls of Arcot in the rain: the English flag holds; a day counter runs 1 → 52', draw(lt, d, t) { SC.fortWalls(t, { rain: 1, flagCols: A.FLAGS.english }); R.army(960, 318, 14, 1, P.crimson, { t, s: 1.6, gap: 50, seed: 4 }); R.smokeDrift(300, 380, t, { s: 0.7, a: 0.4 }); R.smokeDrift(1700, 380, t, { s: 0.6, a: 0.35, seed: 3 }); const n = Math.max(1, Math.round(1 + 51 * eio(seg(lt, 0.1, fi + 0.5)))); K.cut(K.P_rr(1420, 450, 280, 150, 8), '#F1E6CC', { shadow: 0.7, edge: 4 }); ctx.font = '700 86px Caladea'; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`DAY ${n}`, 1560, 528); } });
    X.ev(st + 0.1, 'count', 'the day counter runs', { gain: 0.5 }); X.ev(st + fi + 0.5, 'seal', 'day 52'); X.cue(st + 1.0, 'thunder', { gain: 0.7 }); }
  { const st = X.at('5.4'), lo = X.w('losing', '5.4') - st;
    sh({ id: 'S04', at: st, whip: 'up', move: cam.drift(0.03, [W / 2, 500]), note: 'the map-board: the French-backed kings wobble', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { fall: { 'Anwar-ud-din': 1 }, wobble: Math.sin(lt * 9) * 0.1 * seg(lt, 0.3, lo) }); K.slip("DUPLEIX'S PRINCES", 300, 520, eob(seg(lt, 0.4, 0.7)), -0.02, 34); } });
    X.ev(st + 0.4, 'slip', "DUPLEIX'S PRINCES"); X.ev(st + lo - 0.4, 'chess', 'the kings wobble'); X.amb(st, X.end('5.5') + 0.3, 'pulse', 0.35); }
  { const st = X.at('5.5'), ca = X.w('captured', '5.5') - st;
    sh({ id: 'S05', at: st, move: cam.push(0.06, [820, 640]), note: "Chanda Sahib's king is laid down slowly (silence beat, no sting)", draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { fall: { 'Anwar-ud-din': 1, 'Chanda Sahib': seg(lt, ca, ca + 1.6) } }); K.ribbon('1752', 1560, 520, eob(seg(lt, 0.2, 0.6)), 70); } });
    X.ev(st + 0.2, 'ribbon', '1752', { sound: false }); X.ev(st + ca, 'chess', 'the king is laid down', { gain: 0.4 }); X.ev(st + ca + 2.4, 'light', 'a long quiet beat', { sound: false }); }
  { const st = X.at('5.6'), pa = X.w('paris', '5.6') - st, di = X.w('directors', '5.6') - st;
    sh({ id: 'S06', at: st, whip: 'left', move: cam.push(0.05, [960, 560]), note: "Paris: the company's directors around a ledger; quills scratch", draw(lt, d, t) { directors(t); K.slip('PARIS', 400, 200, eob(seg(lt, pa, pa + 0.3)), -0.02, 40); K.slip('THE DIRECTORS', 1480, 220, eob(seg(lt, di, di + 0.3)), 0.02, 36); } });
    X.ev(st + pa, 'slip', 'PARIS'); X.ev(st + 0.3, 'route', 'quills scratch', { dur: 2.2 }); X.ev(st + di, 'slip', 'THE DIRECTORS'); X.amb(st, X.end('5.7') + 0.2, 'street', 0.5); }
  { const st = X.at('5.7'), co = X.w('cost', '5.7') - st;
    sh({ id: 'S07', at: st, move: cam.push(0.05, [1200, 600]), note: 'the bill for the wars unrolls; coins drain off the table', draw(lt, d, t) { directors(t, seg(lt, co - 0.2, d)); K.slip('COST OF THE WARS', 1480, 220, eob(seg(lt, co, co + 0.3)), 0.02, 36); } });
    X.ev(st + co - 0.2, 'card', 'the bill unrolls'); X.ev(st + co + 0.5, 'coin', 'coins drain away'); }
  { const st = X.at('5.8'), ho = X.w('home', '5.8') - st;
    sh({ id: 'S08', at: st, whip: 'right', move: cam.drift(0.03), note: 'Dupleix sails home; 1754', draw(lt, d, t) { const x = lerp(1300, 700, eio(clamp(lt / d))); SC.seaPage(t, x, { dir: -1 }); person('dupleix', { x: x - 40, y: 600, h: 200, t, dir: -1 }); K.ribbon('1754', 1500, 220, eob(seg(lt, 0.2, 0.6)), 80); K.slip('DUPLEIX RECALLED', 430, 240, eob(seg(lt, ho, ho + 0.3)), -0.02, 36); } });
    X.ev(st + 0.2, 'ribbon', '1754'); X.ev(st + ho, 'slip', 'RECALLED'); X.amb(st, X.end('5.8') + 0.2, 'sea', 0.8); }
  // 5.9 · his successor signed a truce with the English: two officials at a table, the truce is sealed
  { const st = X.at('5.9'), su = X.w('successor', '5.9') - st, tr = X.w('truce', '5.9') - st;
    sh({ id: 'S09', at: st, whip: 'down', move: cam.push(0.05, [960, 540]), note: "Dupleix's successor and an English governor sign and seal a truce", draw(lt, d, t) { R.room({ wall: '#CDB892', floor: '#7A5236', fl: 860, seed: 85 }); A.flag(420, 420, t, A.FLAGS.french, { s: 1.5 }); A.flag(1500, 420, t, A.FLAGS.english, { s: 1.5 }); R.table(960, 720, 700, { h: 140, cloth: '#3F5E3A' }); person('director', { x: 600, y: 880, h: 540, t, arm: 50 }); person('coote', { x: 1320, y: 880, h: 540, t, dir: -1, arm: 50 }); SC.scroll(960, 520, 380, seg(lt, 0.2, 0.9), { title: 'TRUCE · 1754', seal: lt - tr - 0.3 }); K.slip("DUPLEIX'S SUCCESSOR", 560, 230, eob(seg(lt, su, su + 0.3)), -0.02, 30); K.slip('THE ENGLISH', 1360, 230, eob(seg(lt, tr + 0.5, tr + 0.8)), 0.02, 32); } });
    X.ev(st + 0.2, 'card', 'the truce unrolls'); X.ev(st + su, 'slip', "DUPLEIX'S SUCCESSOR"); X.ev(st + tr + 0.3, 'seal', 'truce sealed'); X.ev(st + tr + 0.5, 'slip', 'THE ENGLISH', { sound: false }); }
  { const st = X.at('5.10'), bo = X.w('board', '5.10') - st;
    sh({ id: 'S10', at: st, whip: 'up', move: cam.push(0.05, [W / 2, 500]), note: 'the map-board: the French pieces slide away', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { fall: { 'Anwar-ud-din': 1, 'Chanda Sahib': 1 }, backP: { french: 1 - eio(seg(lt, 0.3, bo + 0.3)), english: 1 } }); K.slip('FRANCE WALKS AWAY', 300, 520, eob(seg(lt, bo - 0.3, bo)), -0.02, 34); } });
    X.ev(st + 0.3, 'chess', 'the blue pieces leave the board'); X.ev(st + bo - 0.3, 'slip', 'FRANCE WALKS AWAY'); X.amb(st, X.end('5.11') + 0.3, 'pulse', 0.35); }
  { const st = X.at('5.11'), no = X.w('not', '5.11') - st;
    sh({ id: 'S11', at: st, move: cam.push(0.07, [900, 700]), note: 'one blue piece rocks back upright at Pondicherry: the game is not over', draw(lt, d, t) { const v = SC.kingsMap(t); SC.kingPieces(v, { fall: { 'Anwar-ud-din': 1, 'Chanda Sahib': 1 }, backP: { french: 0, english: 1 } }); const [x, y] = A.at(v, 'Pondicherry'), up = seg(lt, no, no + 0.6); A.pin(x, y, 'french', { star: true, r: 12 }); A.chessPiece(x + 70, y + 20, { kind: 'pawn', side: 'french', s: 1.25, fall: 1 - eob(up) + Math.sin(lt * 12) * 0.03 * (1 - up) }); } });
    X.ev(st + 0.4, 'light', 'a fallen blue piece at Pondicherry', { sound: false }); X.ev(st + no, 'chess', 'the blue piece rocks upright'); }
}
