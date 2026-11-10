// CH8 · 1954: WHAT REALLY DECIDED INDIA — the takeaway. The French towns join India; the idea vs the money.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
import { supplyMap } from './ch6_wandiwash.js';
const { P } = K;

const TOWNS = [['Chandernagore', 130, 0], ['Pondicherry', 130, -6], ['Karaikal', 110, 18], ['Mahe', -70, 0], ['Yanam', 90, -4]];
/** the whole subcontinent with the five French towns; joined(i) 0..1: the French tricolour comes down and the dot turns into India's colours */
function townsMap(t, joined) {
  const v = A.realMap({ view: 'india', t });
  TOWNS.forEach(([n, dx, dy], i) => { const [x, y] = A.at(v, n), j = clamp(joined(i)); if (j < 1) { A.pin(x, y, 'french', { r: 10, star: n === 'Pondicherry' }); A.flag(x, y, t, A.FLAGS.tricolour, { s: 0.55, raise: 1 - j, droop: j, seed: i }); } if (j > 0) { ctx.save(); ctx.globalAlpha = clamp(j * 2); SC.tricolourDot(x, y, 15 * eob(j)); ctx.restore(); } A.placeLabel(n.toUpperCase(), x, y, { dx, dy, size: 20 }); });
  return v;
}
function board(t, o) { const v = SC.kingsMap(t); SC.kingPieces(v, o); return v; }

export function build(X, C) {
  const ch = 8, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(C.start, X.end('8.3') + 0.3, 'market', 0.7);
  { const st = X.at('8.1'), le = X.w('left', '8.1') - st;
    sh({ id: 'W01', at: st, move: cam.drift(0.03, [800, 560]), note: 'the whole subcontinent: five small French towns remain, under the tricolour', draw(lt, d, t) { townsMap(t, () => 0); K.slip('NEVER FULLY LEFT', 1460, 420, eob(seg(lt, le, le + 0.3)), 0.02, 36); } });
    X.ev(st + 0.3, 'flag', 'five French towns'); X.ev(st + le, 'slip', 'NEVER FULLY LEFT'); }
  { const st = X.at('8.2'), jo = X.w('joined', '8.2') - st, ni = X.w('nineteen', '8.2') - st;
    sh({ id: 'W02', at: st, move: cam.push(0.06, [1000, 380]), note: "Chandernagore: the French flag comes down, India's colours go up; 1950", draw(lt, d, t) { townsMap(t, (i) => (i === 0 ? seg(lt, jo - 0.2, jo + 0.7) : 0)); K.slip('NEVER FULLY LEFT', 1460, 420, 1, 0.02, 36); K.ribbon('1950', 1460, 560, eob(seg(lt, ni, ni + 0.4)), 60); } });
    X.ev(st + jo - 0.2, 'ink', 'Chandernagore joins India'); X.ev(st + ni, 'ribbon', '1950'); }
  { const st = X.at('8.3'), po = X.w('pon', '8.3') - st, fo = X.w('followed', '8.3') - st;
    sh({ id: 'W03', at: st, move: cam.push(0.05, [760, 640]), note: 'Pondicherry and the other towns follow one by one; 1954', draw(lt, d, t) { townsMap(t, (i) => (i === 0 ? 1 : seg(lt, po + (i - 1) * 0.45, po + (i - 1) * 0.45 + 0.7))); K.ribbon('1950', 1460, 560, 1 - seg(lt, fo, fo + 0.2), 60); K.ribbon('1954', 1460, 560, eob(seg(lt, fo + 0.2, fo + 0.6)), 60); } });
    for (let i = 1; i < 5; i++) X.ev(st + po + (i - 1) * 0.45, 'ink', `${TOWNS[i][0]} joins India`, { gain: 0.6 }); X.ev(st + fo + 0.2, 'ribbon', '1954'); }
  // 8.4 · after a vote at Kizhur: voters queue at the ballot box
  { const st = X.at('8.4'), vo = X.w('vote', '8.4') - st;
    sh({ id: 'W04', at: st, whip: 'right', move: cam.push(0.05, [W / 2, 520]), note: 'Kizhur: representatives queue; a ballot drops; card', draw(lt, d, t) { R.room({ wall: '#D8C9A4', floor: '#8C6B4E', fl: 860, seed: 101 }); A.flag(1500, 400, t, A.FLAGS.india, { s: 1.6 }); for (let i = 0; i < 4; i++) K.figure({ x: 420 - i * 110 + Math.max(0, lt - vo) * 20, y: 880, h: 470, role: i % 2 ? 'merchant' : 'worker', dir: 1, walk: (lt + i) * 3 }); SC.ballotBox(760, 860, seg(lt, vo - 0.4, vo + 0.2)); A.statCard({ x: 1300, y: 600, title: 'Kizhur vote', stats: ['French towns join India'], date: '18 Oct 1954', p: seg(lt, vo + 0.2, vo + 0.8), portrait: () => { ctx.save(); ctx.scale(0.28, 0.28); ctx.translate(0, 150); SC.ballotBox(0, 0, 0.5); ctx.restore(); } }); } });
    X.ev(st + 0.2, 'drop', 'voters queue', { gain: 0.3 }); X.ev(st + vo + 0.2, 'ballot', 'the ballot drops'); X.ev(st + vo + 0.4, 'card', 'Kizhur card', { sound: false }); X.amb(st, X.end('8.4') + 0.3, 'crowd', 0.9); }
  X.amb(X.at('8.5'), X.end('8.7') + 0.3, 'pulse', 0.35);
  { const st = X.at('8.5'), de = X.w('decided', '8.5') - st;
    sh({ id: 'W05', at: st, whip: 'left', move: cam.push(0.05, [W / 2, 500]), note: 'back to the map-board of south India', draw(lt, d, t) { board(t, { backP: { french: 0, english: 0 } }); K.slip('WHAT DECIDED INDIA?', 1560, 520, eob(seg(lt, de, de + 0.3)), 0.02, 34); } });
    X.ev(st + 0.3, 'chess', 'the kings stand again', { gain: 0.4 }); X.ev(st + de, 'slip', 'the question'); }
  { const st = X.at('8.6'), sm = X.w('smartest', '8.6') - st;
    sh({ id: 'W06', at: st, move: cam.push(0.06, [800, 420]), note: "Dupleix's move replays: a blue piece behind the king, then the crown", draw(lt, d, t) { const v = board(t, { crown: lt > sm + 0.6 ? 'Muzaffar Jang' : null, backP: { french: seg(lt, 0.1, 0.9), english: 0 } }); const [kx, ky] = SC.kingXY(v, 0); if (lt > sm - 0.2 && lt < sm + 0.6) SC.crown(kx, lerp(ky - 460, ky - 196, eio(seg(lt, sm - 0.2, sm + 0.6))), 0.32); K.slip("FRANCE'S IDEA", 300, 520, eob(seg(lt, sm, sm + 0.3)), -0.02, 34); } });
    X.ev(st + 0.1, 'chess', 'the blue pieces return'); X.ev(st + sm, 'slip', "FRANCE'S IDEA", { sound: false }); X.ev(st + sm + 0.6, 'chess', 'the crown lands'); }
  { const st = X.at('8.7'), thr = X.w('through', '8.7') - st, ar = X.w('around', '8.7') - st;
    sh({ id: 'W07', at: st, move: cam.drift(0.03, [W / 2, 500]), note: 'blue pieces stand behind the crowned kings: rule through the thrones', draw(lt, d, t) { board(t, { crown: 'Muzaffar Jang', backP: { french: 1, english: 0 } }); K.slip("FRANCE'S IDEA", 300, 520, 1, -0.02, 34); K.slip('RULE THROUGH THE THRONES', 1560, 520, eob(seg(lt, thr, thr + 0.3)), 0.02, 30); } });
    X.ev(st + thr, 'slip', 'RULE THROUGH THE THRONES'); X.ev(st + ar, 'chess', 'the pieces settle', { gain: 0.5 }); }
  // 8.8-8.10 · ideas need money: orders crawl by sea from Paris; Bengal pays on the spot
  { const st = X.at('8.8'), mo = X.w('money', '8.8') - st;
    sh({ id: 'W08', at: st, whip: 'down', move: cam.drift(0.02), note: 'the voyage map: France far away, Bengal close by', draw(lt, d, t) { SC.voyageMap(t, { blue: 0, red: 0 }); K.slip('IDEAS NEED MONEY', W / 2, 640, eob(seg(lt, mo, mo + 0.3)), -0.02, 44); } });
    X.ev(st + 0.2, 'light', 'the wide map'); X.ev(st + mo, 'slip', 'IDEAS NEED MONEY'); X.amb(st, X.end('8.9') + 0.2, 'sea', 0.6); }
  { const st = X.at('8.9'), wa = X.w('waits', '8.9') - st, pa = X.w('paris', '8.9') - st;
    sh({ id: 'W09', at: st, move: cam.push(0.05, [700, 500]), note: 'orders from Paris crawl by ship round Africa toward India', draw(lt, d, t) { SC.voyageMap(t, { blue: 0.08 + 0.5 * seg(lt, 0, d), red: 0 }); K.slip('IDEAS NEED MONEY', W / 2, 640, 1 - seg(lt, 0.2, 0.5), -0.02, 44); K.slip('WAITS FOR ORDERS', 560, 640, eob(seg(lt, wa, wa + 0.3)), -0.02, 36); K.slip('FROM PARIS', 560, 740, eob(seg(lt, pa, pa + 0.3)), 0.02, 36); } });
    X.ev(st + 0.1, 'route', 'the orders set sail', { dur: 1.5 }); X.ev(st + wa, 'slip', 'WAITS FOR ORDERS'); X.ev(st + pa, 'slip', 'FROM PARIS'); }
  { const st = X.at('8.10'), pay = X.w('pays', '8.10') - st, be = X.w('bengal', '8.10') - st;
    sh({ id: 'W10', at: st, whip: 'right', move: cam.push(0.05, [1200, 420]), note: 'Bengal pays on the spot: the crimson supply line pulses with coins', draw(lt, d, t) { supplyMap(t, { red: eo(seg(lt, 0, pay)) }); K.slip('PAYS FOR ITSELF', 1560, 560, eob(seg(lt, pay, pay + 0.3)), 0.02, 36); K.slip('FROM BENGAL', 1560, 660, eob(seg(lt, be, be + 0.3)), -0.02, 36); } });
    X.ev(st + 0.05, 'route', 'the crimson line from Bengal'); X.ev(st + pay, 'slip', 'PAYS FOR ITSELF'); X.cue(st + pay + 0.2, 'coins', { gain: 0.6 }); X.ev(st + be, 'slip', 'FROM BENGAL'); }
  { const st = X.at('8.11'), ide = X.w('idea', '8.11') - st, ad = X.w('added', '8.11') - st;
    sh({ id: 'W11', at: st, whip: 'up', move: cam.drift(0.03, [W / 2, 500]), note: 'the map-board: the pieces behind the kings turn from French blue to English crimson', draw(lt, d, t) { board(t, { crown: 'Muzaffar Jang', backP: { french: 1, english: seg(lt, ad, ad + 0.6) }, turned: seg(lt, ide - 0.2, ide + 0.2) }); K.slip("DUPLEIX'S IDEA", 300, 520, eob(seg(lt, ide, ide + 0.3)), -0.02, 34); K.slip("+ BENGAL'S MONEY", 1600, 520, eob(seg(lt, ad + 0.4, ad + 0.7)), 0.02, 34); } });
    X.ev(st + ide - 0.2, 'chess', 'the blue pieces turn crimson'); X.ev(st + ide, 'slip', "DUPLEIX'S IDEA", { sound: false }); X.ev(st + ad, 'chess', 'more crimson pieces arrive'); X.ev(st + ad + 0.4, 'slip', "+ BENGAL'S MONEY"); X.amb(st, T_END(X), 'pulse', 0.35); }
  { const st = X.at('8.12'), em = X.w('empire', '8.12') - st;
    sh({ id: 'W12', at: st, move: cam.push(0.08, [W / 2, 500]), note: 'English red spreads over the board from Bengal; final push; end card (bottom-right kept clear)', draw(lt, d, t) {
      const v = SC.kingsMap(t); A.inkBleed(W + 100, -100, 2600, seg(lt, em - 0.5, em + 1.6), P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.45 });
      SC.kingPieces(v, { crown: 'Muzaffar Jang', backP: { french: 1, english: 1 }, turned: 1 });
      K.slip('AN EMPIRE', 1600, 520, eob(seg(lt, em, em + 0.3)), 0.02, 44);
      const e = seg(lt, d - 2.2, d - 1.6); if (e > 0) { ctx.save(); ctx.globalAlpha = e; K.slip('NEXT: THE DANES IN INDIA', 520, 790, 1, -0.02, 44); ctx.restore(); }
    } });
    X.ev(st + em - 0.5, 'ink', 'English red spreads from Bengal'); X.ev(st + em, 'slip', 'AN EMPIRE'); X.ev(st + 2.4, 'slip', 'NEXT: THE DANES IN INDIA', { sound: false }); }
}
const T_END = (X) => X.end('8.12') + 1.5;
