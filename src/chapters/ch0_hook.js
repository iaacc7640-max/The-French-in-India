// CH0 · COLD OPEN: the paradox (no card). France beats an army ten times its size and picks India's kings, yet executes
// its own general for losing it all. "The answer wasn't a battle. It was a supply line."
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

const POSTS = [['Pondicherry', 'french', 1], ['Chandernagore', 'french'], ['Masulipatnam', 'french'], ['Mahe', 'french'], ['Karaikal', 'french'], ['Yanam', 'french'], ['Madras', 'english'], ['Calcutta', 'english'], ['Bombay', 'english']];
/** the whole subcontinent: French blue over the south, English red in Bengal. blue 0..1 = how much French ink is left */
function twoColour(t, blue, red = 1) {
  const v = A.realMap({ view: 'india', t }), at = (n) => A.at(v, n);
  A.inkBleed(...at('Calcutta'), 190, red, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.6 });      // English: Bengal
  A.inkBleed(...at('Pondicherry'), 235, blue, P.royal, { clipFn: A.mainland(v), seed: 2, alpha: 0.82 });   // French influence: the south, up to about the Krishna
  for (const [n, side, star] of POSTS) A.pin(...at(n), side, { r: 9, star: !!star, glow: side === 'french' ? 0.5 + 0.5 * Math.sin(t * 3) : 0 });
  return v;
}

export function build(X, C) {
  const ch = 0, sh = (o) => X.add({ chapter: ch, ...o });

  // 0.0 · the paradox as a question, on the whole map: French blue spreads over the south… and drains away on "lose India"
  { const st = 0, be = X.w('beat', '0.0') - st, te = X.w('ten', '0.0') - st, lo = X.w('lose', '0.0') - st;
    sh({ id: 'H00', at: st, move: cam.push(0.05, [800, 560]), note: 'whole India: French blue spreads, x10 slip, then drains on "lose India"', draw(lt, d, t) {
      twoColour(t, eo(seg(lt, 0.2, be + 0.6)) * (1 - eio(seg(lt, lo - 0.1, lo + 0.9))), 0);
      K.slip('1 : 10', 1420, 420, eob(seg(lt, te, te + 0.3)), -0.02, 64); K.slip('…AND STILL LOST INDIA?', 1420, 560, eob(seg(lt, lo, lo + 0.3)), 0.02, 40);
    } });
    X.ev(st + 0.2, 'ink', 'French blue spreads'); X.ev(st + te, 'slip', '1 : 10'); X.ev(st + lo - 0.1, 'ink', 'blue drains away'); X.ev(st + lo, 'slip', 'and still lost India?'); X.amb(st, X.end('0.0') + 0.3, 'wind', 0.6); }

  // 0.1 · southern India: about a thousand French-led soldiers march to the Adyar
  { const st = X.at('0.1'), th = X.w('thousand', '0.1') - st;
    sh({ id: 'H01', at: st, whip: 'down', move: cam.push(0.05, [940, 520]), note: 'southern India (Madras, Adyar river): ~1,000 French-led soldiers march in', draw(lt, d, t) {
      SC.adyarMap(t, { blue: seg(lt, 0.3, th + 0.4) });
      K.ribbon('1746', 1500, 220, eob(seg(lt, 0.25, 0.65)), 80); K.slip('~1,000 FRENCH-LED', 700, 745, eob(seg(lt, th, th + 0.3)), -0.02, 34);
    } });
    X.ev(st + 0.25, 'ribbon', '1746'); X.ev(st + 0.6, 'drums', 'French-led soldiers march', { dur: 3.5, gain: 0.5 }); X.ev(st + th, 'slip', '~1,000'); X.amb(st, X.end('0.2') + 0.3, 'wind', 0.5); }

  // 0.2 · snap "ten thousand": the Nawab's army fills the far bank; the stat card; then it breaks and flows away
  { const st = X.at('0.2'), ten = X.w('ten', '0.2') - st, so = X.w('southern', '0.2') - st;
    sh({ id: 'H02', at: st, move: cam.snap(ten, 0.1, [700, 380]), note: 'snap: the army of ~10,000 across the river; Adyar card; it breaks and flows away', draw(lt, d, t) {
      SC.adyarMap(t, { blue: 1, green: clamp((lt - ten + 0.5) / 0.6), scatter: eio(seg(lt, so + 0.2, d + 0.3)) });
      K.ribbon('1746', 1500, 220, 1, 80); K.slip('~1,000 FRENCH-LED', 700, 745, 1, -0.02, 34);
      A.statCard({ x: 1470, y: 610, title: 'Adyar', stats: ['~350 French + ~700 sepoys', 'vs ~10,000'], date: '24 Oct 1746', p: seg(lt, ten + 0.4, ten + 1.0), hi: 1, portrait: portrait('paradis') });
    } });
    X.ev(st + ten - 0.5, 'pop', 'the big army appears'); X.ev(st + ten + 0.4, 'card', 'Adyar stat card'); X.ev(st + so + 0.2, 'whip', 'the big army breaks', { gain: 0.5 }); }

  // 0.3 · a French governor… (Dupleix beside the map-board of south India, two princes waiting)
  const board = (t, lt, crown) => {
    const v = SC.kingsMap(t), hy = A.at(v, 'Hyderabad'), ar = A.at(v, 'Arcot');
    A.chessPiece(hy[0], hy[1], { kind: 'king', side: 'nizam', s: 1.2, crown: crown >= 1 }); A.chessPiece(ar[0], ar[1], { kind: 'king', side: 'nawab', s: 1.2, crown: crown >= 1.4 });
    for (const [q, c0] of [[hy, 0], [ar, 0.4]]) { const u = clamp((crown - c0) / 1); if (u > 0 && u < 1) SC.crown(q[0], lerp(q[1] - 420, q[1] - 196, eio(u)), 0.32); }
    person('dupleix', { x: 330, y: 850, h: 600, t, arm: 30 + clamp(crown) * 50, prop: 'chess' });
  };
  { const st = X.at('0.3'), go = X.w('governor', '0.3') - st;
    sh({ id: 'H03', at: st, whip: 'right', move: cam.push(0.05, [900, 520]), note: 'Dupleix beside south India: princes at Hyderabad and in the Carnatic', draw(lt, d, t) { board(t, lt, 0); K.slip('DUPLEIX', 330, 200, eob(seg(lt, go, go + 0.3)), -0.02, 44); } });
    X.ev(st + go, 'slip', 'name slip DUPLEIX'); X.ev(st + 1.6, 'chess', 'princes wait', { gain: 0.4 }); X.amb(st, X.end('0.4') + 0.2, 'room', 0.5); }
  // 0.4 · …choosing who sat on India's thrones: crowns come down on the two kings
  { const st = X.at('0.4'), thr = X.w('thrones', '0.4') - st;
    sh({ id: 'H04', at: st, move: cam.snap(thr, 0.1, [1000, 480]), note: 'crowns descend on the kings at Hyderabad and Arcot', draw(lt, d, t) { board(t, lt, seg(lt, thr - 0.9, thr) + clamp((lt - thr) / 0.5) * 0.4 + (lt > thr + 0.5 ? 0.1 : 0)); K.slip('DUPLEIX', 330, 200, 1, -0.02, 44); } });
    X.ev(st + thr, 'chess', 'crown lands at Hyderabad'); X.ev(st + thr + 0.5, 'chess', 'crown lands at Arcot'); }

  // 0.5-0.7 · Paris, May 1766: the general in his room; "executed" is never shown: he is gone, the candle goes out, a seal stamps
  const exe = X.w('executed', '0.6');
  { const st = X.at('0.5');
    sh({ id: 'H05', at: st, whip: 'left', move: cam.push(0.05, [900, 540]), note: 'Paris at dawn: General Lally in his room; May 1766', draw(lt, d, t) { SC.parisRoom(t, { lally: 1 }); K.ribbon('MAY 1766', 1100, 190, eob(seg(lt, 0.3, 0.7)), 64); K.slip('PARIS', 390, 150, eob(seg(lt, 0.9, 1.2)), -0.03, 40); } });
    X.ev(st + 0.3, 'ribbon', 'May 1766'); X.ev(st + 0.9, 'slip', 'PARIS'); X.amb(st, X.end('0.7') + 0.2, 'street', 0.6); }
  { const st = X.at('0.6'), e = exe - st, la = X.w('lally', '0.6') - st;
    sh({ id: 'H06', at: st, move: cam.snap(e, 0.1, [1000, 560]), note: 'snap "executed": Lally is gone, the candle goes out, GUILTY seal', draw(lt, d, t) {
      SC.parisRoom(t, { lally: 1 - seg(lt, e, e + 0.5), out: seg(lt, e + 0.2, e + 0.7) + (lt > e + 0.7 ? (lt - e - 0.7) * 0.4 : 0), seal: lt - e - 0.7 });
      K.slip('PARIS', 390, 150, 1, -0.03, 40); K.slip('COMTE DE LALLY', 800, 190, eob(seg(lt, la, la + 0.3)), 0.02, 44);
    } });
    X.ev(exe, 'candle', 'Lally is gone; the candle goes out'); X.ev(exe + 0.7, 'seal', 'GUILTY seal'); X.cue(exe + 0.75, 'gavel'); X.cue(exe + 1.5, 'door', { gain: 0.8 }); X.ev(st + la, 'slip', 'COMTE DE LALLY'); }
  { const st = X.at('0.7');
    sh({ id: 'H07', at: st, move: cam.push(0.06, [860, 560]), note: 'the empty chair and his coat; FOR LOSING INDIA', draw(lt, d, t) { SC.parisRoom(t, { out: 2, seal: 1 }); K.slip('COMTE DE LALLY', 800, 190, 1, 0.02, 44); K.slip('FOR LOSING INDIA', 800, 300, eob(seg(lt, 0.15, 0.45)), -0.02, 38); } });
    X.ev(st + 0.15, 'slip', 'FOR LOSING INDIA'); }

  // 0.8-0.9 · the whole subcontinent: almost won (blue)… and everything lost (the blue drains)
  { const st = X.at('0.8');
    sh({ id: 'H08', at: st, whip: 'down', move: cam.drift(0.03, [800, 520]), note: 'the whole subcontinent, French blue and English red', draw(lt, d, t) { twoColour(t, eo(seg(lt, 0, 0.8))); K.slip('WHAT WENT WRONG?', 1420, 470, eob(seg(lt, 0.5, 0.8)), 0.02, 44); } });
    X.ev(st + 0.1, 'ink', 'blue and red territory'); X.ev(st + 0.5, 'slip', 'WHAT WENT WRONG?'); X.amb(st, X.end('0.11') + 0.4, 'wind', 0.5); }
  { const st = X.at('0.9'), lo = X.w('losing', '0.9') - st;
    sh({ id: 'H09', at: st, move: cam.drift(0.03, [800, 520]), note: 'the blue ink drains away on "losing everything"', draw(lt, d, t) { twoColour(t, 1 - eio(seg(lt, lo - 0.2, lo + 0.9))); K.slip('WHAT WENT WRONG?', 1420, 470, 1, 0.02, 44); } });
    X.ev(st + 0.3, 'pop', 'blue pins pulse', { gain: 0.4 }); X.ev(st + lo - 0.2, 'ink', 'blue drains away'); }
  { const st = X.at('0.10'), bat = X.w('battle', '0.10') - st;
    sh({ id: 'H10', at: st, move: cam.push(0.05, [1100, 480]), note: 'crossed swords pop and are struck through: not a battle', draw(lt, d, t) { twoColour(t, 0); R.crossedSwords(1420, 470, eob(seg(lt, bat - 0.3, bat)) * 0.9, seg(lt, bat + 0.35, bat + 0.7)); } });
    X.ev(st + bat - 0.3, 'pop', 'crossed swords'); X.ev(st + bat + 0.35, 'route', 'struck through'); }
  // 0.11 · snap "supply": the faint crimson line from Bengal (teaser; paid off in CH6)
  { const st = X.at('0.11'), sup = X.w('supply', '0.11') - st;
    sh({ id: 'H11', at: st, move: cam.snap(sup, 0.12, [900, 420]), note: 'snap "supply": a faint crimson line from Bengal to Madras (teaser)', draw(lt, d, t) {
      const v = twoColour(t, 0), g = clamp((lt - sup + 0.2) / 0.3) * (1 - clamp((lt - sup - 1.4) / 0.6));
      A.supplyLine(A.BENGAL_ROUTE.map(([a, b]) => A.proj(v, a, b)), { p: 1, ghost: 0.5 * g, t, thick: 20 }); K.slip('A SUPPLY LINE', 1420, 470, eob(seg(lt, sup, sup + 0.3)), 0.02, 44);
    } });
    X.ev(st + sup, 'route', 'supply line teaser'); X.ev(st + sup + 0.1, 'slip', 'A SUPPLY LINE', { sound: false }); }
}
