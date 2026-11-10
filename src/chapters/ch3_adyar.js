// CH3 · 1746: ONE THOUSAND VS TEN THOUSAND. La Bourdonnais takes Madras; the broken promise; Adyar; Madras handed back.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

/** the Nawab's durbar: the Nawab on the right, Dupleix on the left holding out (or keeping) the promise of Madras */
function promise(t, { scroll = 1, keep = 0 } = {}) {
  R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 75 }); A.flag(1560, 420, t, A.FLAGS.nawab, { s: 1.8 });
  person('nawab', { x: 1380, y: 880, h: 560, t, dir: -1, arm: keep > 0.5 ? 50 : 10 });
  person('dupleix', { x: 520, y: 880, h: 560, t, arm: lerp(70, 5, eio(keep)), prop: 'none' });
  if (scroll > 0) { const k = eio(clamp(keep)); ctx.save(); ctx.translate(lerp(960, 430, k), lerp(520, 640, k)); ctx.rotate(-0.08 * k); ctx.scale(lerp(1, 0.45, k), lerp(1, 0.45, k)); SC.scroll(0, 0, 400, scroll, { title: 'MADRAS FOR THE NAWAB' }); ctx.restore(); }
}

export function build(X, C) {
  const ch = 3, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('3.1'), wa = X.w('war', '3.1') - st;
    sh({ id: 'R01', at: st, move: cam.drift(0.03), note: 'Europe: the crowns of France and Britain clash; 1746', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.2, wa + 0.2) + clamp(lt - wa - 0.2)); K.ribbon('1746', 1500, 220, eob(seg(lt, 0.1, 0.5)), 80); } });
    X.ev(st + 0.1, 'ribbon', '1746'); X.ev(st + wa + 0.2, 'drop', 'crowns clash'); X.ev(st + wa + 1.2, 'light', 'paper sparks', { sound: false }); }
  { const st = X.at('3.2'), fl = X.w('fleet', '3.2') - st, la = X.w('la', '3.2') - st;
    sh({ id: 'R02', at: st, whip: 'down', move: cam.push(0.05, [1100, 520]), note: 'Mauritius harbour: La Bourdonnais and his fleet', draw(lt, d, t) { SC.seaPage(t, 1150, {}); for (const [sx, sy, ss] of [[1650, 590, 0.5], [760, 600, 0.45]]) { ctx.save(); ctx.translate(sx, sy + Math.sin(t * 2 + sx) * 6); SC.shipSmall(ss, t, A.FLAGS.french); ctx.restore(); } K.cut(K.P_rr(-40, 700, 560, 36, 6), P.sepia); person('labourdonnais', { x: 330, y: 700, h: 440, t }); K.slip('LA BOURDONNAIS', 330, 180, eob(seg(lt, la, la + 0.3)), -0.02, 36); K.slip('MAURITIUS', 1500, 240, eob(seg(lt, fl + 0.5, fl + 0.8)), 0.02, 36); } });
    X.ev(st + fl, 'flag', 'the fleet'); X.ev(st + fl + 0.5, 'slip', 'MAURITIUS'); X.ev(st + la, 'slip', 'LA BOURDONNAIS'); X.amb(st, X.end('3.3') + 0.2, 'sea', 0.8); }
  // 3.3 · sailed to India (the route draws) and captured Madras (the fort: English flag down, French flag up)
  { const st = X.at('3.3'), ca = X.w('captured', '3.3') - st, md = X.w('madras', '3.3') - st;
    sh({ id: 'R03', at: st, whip: 'up', move: cam.push(0.05, [1200, 300]), note: 'the fleet sails Mauritius → Madras; then Fort St George: English flag down, French flag up', draw(lt, d, t) {
      if (lt < ca) { const v = A.realMap({ view: 'ocean', t }), mu = A.at(v, 'Mauritius'), m = A.at(v, 'Madras'); const h = A.drawPolyline([mu, A.proj(v, 66, -8), A.proj(v, 76, 3), A.proj(v, 81.5, 10), m], eo(seg(lt, 0, ca)), P.royal, 7, [20, 14]); ctx.save(); ctx.translate(h[0], h[1] - 4); SC.shipSmall(0.14, t, A.FLAGS.french); ctx.restore(); A.pin(...mu, 'french', { r: 12 }); A.placeLabel('MAURITIUS', ...mu, { dx: 120, dy: 0, size: 22 }); A.pin(...m, 'english', { r: 13 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 24 }); }
      else { SC.fortWalls(t, { flagCols: A.FLAGS.english, flagRaise: 1 - seg(lt, ca + 0.1, md + 0.2), flag2: A.FLAGS.french, flag2Raise: seg(lt, md, md + 0.7) }); K.slip('MADRAS · FORT ST GEORGE', 430, 220, eob(seg(lt, ca + 0.1, ca + 0.4)), -0.02, 36); }
    } });
    X.ev(st, 'route', 'the fleet sails to India'); X.ev(st + ca, 'whip', 'cut to Fort St George', { gain: 0.4 }); X.ev(st + md, 'flag', 'English flag down, French flag up'); }
  { const st = X.at('3.4'), pr = X.w('promised', '3.4') - st, na = X.w('nawab', '3.4') - st;
    sh({ id: 'R04', at: st, whip: 'right', move: cam.push(0.05, [960, 540]), note: 'Dupleix holds out the promise of Madras to the Nawab of the Carnatic', draw(lt, d, t) { promise(t, { scroll: seg(lt, pr - 0.2, pr + 0.5) }); K.slip('DUPLEIX', 520, 190, eob(seg(lt, 0.3, 0.6)), -0.02, 36); K.slip('NAWAB OF THE CARNATIC', 1380, 190, eob(seg(lt, na, na + 0.3)), 0.02, 32); } });
    X.ev(st + 0.3, 'slip', 'DUPLEIX'); X.ev(st + pr - 0.2, 'card', 'the promise scroll'); X.ev(st + na, 'slip', 'NAWAB'); X.amb(st, X.end('3.5') + 0.2, 'court', 0.6); }
  { const st = X.at('3.5'), ke = X.w('kept', '3.5') - st;
    sh({ id: 'R05', at: st, move: cam.snap(ke, 0.12, [700, 560]), note: 'snap "kept": Dupleix pulls the scroll back', draw(lt, d, t) { promise(t, { keep: seg(lt, ke - 0.25, ke + 0.3) }); K.slip('DUPLEIX', 520, 190, 1, -0.02, 36); K.slip('NAWAB OF THE CARNATIC', 1380, 190, 1, 0.02, 32); } });
    X.ev(st + ke - 0.25, 'whip', 'the scroll is pulled back', { gain: 0.5 }); }
  // 3.6 · the Nawab sent an army: it marches from Arcot toward Madras on the map
  { const st = X.at('3.6'), ar = X.w('army', '3.6') - st;
    sh({ id: 'R06', at: st, whip: 'left', move: cam.push(0.06, [900, 420]), note: "map: the Nawab's army marches from Arcot toward French-held Madras; drums", draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), md = A.at(v, 'Madras'), ac = A.at(v, 'Arcot'), pd = A.at(v, 'Pondicherry'), k = eio(seg(lt, ar - 0.6, d));
      A.pin(...pd, 'french', { star: true }); A.placeLabel('PONDICHERRY', ...pd, { dx: 150, dy: 0, size: 24 }); A.pin(...md, 'french', { r: 16 }); A.flag(md[0], md[1], t, A.FLAGS.french, { s: 0.8 }); A.placeLabel('MADRAS', ...md, { dx: 100, dy: 14, size: 24 }); A.pin(...ac, 'nawab', { r: 14 }); A.placeLabel('ARCOT', ...ac, { size: 24, dy: 36 });
      A.drawPolyline([ac, [lerp(ac[0], md[0], 0.5), ac[1] - 50], [md[0] - 90, md[1] + 10]], k, P.forest, 8, [18, 12]);
      const ax = lerp(ac[0], md[0] - 210, k), ay = lerp(ac[1], md[1] + 10, k) - Math.sin(k * Math.PI) * 30; R.army(ax, ay - 40, 9, 3, P.forest, { t, turban: true, seed: 5, step: 1, s: 1.1 }); A.flag(ax + 150, ay - 40, t, A.FLAGS.nawab, { s: 0.6 });
    } });
    X.ev(st + ar - 0.6, 'route', "the Nawab's army marches"); X.ev(st + ar + 0.6, 'flag', 'green banners'); X.cue(st, 'drums', { dur: 3.0, gain: 0.55 }); }
  { const st = X.at('3.7'), ud = X.w('ud', '3.7') - st, th = X.w('thousand', '3.7') - st;
    sh({ id: 'R07', at: st, whip: 'down', move: cam.push(0.06, [940, 520]), note: 'the Adyar river: about a thousand French soldiers and sepoys form up', draw(lt, d, t) { SC.adyarMap(t, { blue: seg(lt, 0.4, th + 0.5) }); K.ribbon('24 OCT 1746', 1500, 220, eob(seg(lt, ud, ud + 0.4)), 60); K.slip('~1,000 FRENCH + SEPOYS', 1180, 700, eob(seg(lt, th, th + 0.3)), -0.02, 32); } });
    X.ev(st + 0.4, 'drums', 'soldiers form up', { dur: 3.5, gain: 0.5 }); X.ev(st + ud, 'ribbon', 'Adyar date'); X.ev(st + th, 'slip', '~1,000'); X.amb(st, X.end('3.8') + 0.2, 'wind', 0.5); }
  { const st = X.at('3.8'), te = X.w('ten', '3.8') - st, wo = X.w('won', '3.8') - st;
    sh({ id: 'R08', at: st, move: cam.snap(te, 0.1, [700, 380]), note: 'snap "ten": the army of ~10,000; Adyar card; on "won" it breaks and flows away', draw(lt, d, t) { SC.adyarMap(t, { blue: 1, green: clamp((lt - te + 0.5) / 0.5), scatter: eio(seg(lt, wo - 0.1, wo + 1.2)) }); K.ribbon('24 OCT 1746', 1500, 220, 1, 60); A.statCard({ x: 1500, y: 470, title: 'Adyar', stats: ['~350 French + ~700 sepoys', 'vs ~10,000'], date: '24 Oct 1746', p: seg(lt, te + 0.3, te + 0.9), hi: 1, portrait: portrait('paradis') }); } });
    X.ev(st + te - 0.5, 'pop', 'the big army'); X.ev(st + te + 0.3, 'card', 'Adyar card'); X.ev(st + wo - 0.1, 'whip', 'the big army breaks', { gain: 0.5 }); }
  // 3.9 · every European in India learned the lesson: the news runs from Adyar to every nation's post
  { const st = X.at('3.9'), le = X.w('lesson', '3.9') - st;
    sh({ id: 'R09', at: st, whip: 'up', move: cam.drift(0.03, [800, 520]), note: 'the whole subcontinent: the news runs from Adyar to the Portuguese, Dutch, English and Danish posts', draw(lt, d, t) {
      const v = A.realMap({ view: 'india', t }), ad = A.at(v, 'Adyar');
      [['portuguese', 'Goa'], ['english', 'Bombay'], ['english', 'Calcutta'], ['dutch', 'Pulicat'], ['danish', 'Tranquebar'], ['french', 'Pondicherry']].forEach(([s, n], i) => { const q = A.at(v, n), k = eio(seg(lt, 0.3 + i * 0.12, 1.1 + i * 0.12)); if (Math.hypot(q[0] - ad[0], q[1] - ad[1]) > 40) A.drawPolyline([ad, q], k, P.ink, 4, [10, 9]); A.flag(q[0], q[1], t, A.FLAGS[s], { s: 0.6, seed: i }); });
      A.pin(ad[0], ad[1], 'french', { star: true, r: 12, glow: 1 }); K.slip('THE SAME LESSON', 1420, 470, eob(seg(lt, le, le + 0.3)), 0.02, 40);
    } });
    X.ev(st + 0.3, 'route', 'the news spreads'); X.ev(st + le, 'slip', 'THE SAME LESSON'); }
  // 3.10 · a small, drilled army could beat a far bigger one
  { const st = X.at('3.10'), dr = X.w('drilled', '3.10') - st, bi = X.w('bigger', '3.10') - st;
    sh({ id: 'R10', at: st, whip: 'right', move: cam.push(0.05), note: 'a small drilled formation faces a big loose crowd; DISCIPLINE > NUMBERS', draw(lt, d, t) {
      K.parchment(77); R.army(520, 600, 8, 4, P.royal, { t, s: 2.2, gap: 26, seed: 3 }); R.army(1340, 560, 16, 7, P.forest, { t, s: 1.5, gap: 30, rowGap: 30, turban: true, seed: 9, march: clamp((lt - bi + 0.6) / 0.5), scatter: 0.05 + 0.03 * Math.sin(t * 2) });
      K.slip('SMALL · DRILLED', 520, 360, eob(seg(lt, dr, dr + 0.3)), -0.02, 40); K.slip('FAR BIGGER', 1340, 330, eob(seg(lt, bi, bi + 0.3)), 0.02, 40);
      const k = seg(lt, bi + 0.5, bi + 0.8); if (k > 0) { ctx.save(); ctx.translate(W / 2, 200); ctx.scale(lerp(1.5, 1, eo(k)), lerp(1.5, 1, eo(k))); ctx.globalAlpha = clamp(k * 3); K.slip('DISCIPLINE > NUMBERS', 0, 0, 1, -0.02, 60); ctx.restore(); }
    } });
    X.ev(st + dr, 'slip', 'SMALL, DRILLED'); X.ev(st + bi, 'slip', 'FAR BIGGER'); X.ev(st + bi + 0.5, 'seal', 'DISCIPLINE > NUMBERS'); }
  // 3.11 · a treaty in Europe handed Madras back to the English: the flags swap on the fort
  { const st = X.at('3.11'), tr = X.w('treaty', '3.11') - st, ba = X.w('back', '3.11') - st;
    sh({ id: 'R11', at: st, whip: 'left', move: cam.drift(0.03), note: 'Fort St George: the French flag comes down, the English flag goes back up; treaty 1748', draw(lt, d, t) { SC.fortWalls(t, { flagCols: A.FLAGS.english, flagRaise: seg(lt, ba, ba + 0.7), flag2: A.FLAGS.french, flag2Raise: 1 - seg(lt, ba - 0.4, ba + 0.2) }); K.slip('MADRAS', 430, 220, eob(seg(lt, 0.2, 0.5)), -0.02, 40); K.slip('TREATY OF AIX-LA-CHAPELLE · 1748', 1420, 230, eob(seg(lt, tr, tr + 0.3)), 0.02, 30); } });
    X.ev(st + 0.2, 'slip', 'MADRAS'); X.ev(st + tr, 'card', 'treaty'); X.ev(st + ba - 0.4, 'flag', 'French flag down, English flag up'); }
  { const st = X.at('3.12'), bi = X.w('bigger', '3.12') - st;
    sh({ id: 'R12', at: st, whip: 'right', move: cam.push(0.08, [520, 380]), note: 'a silhouette at a Pondicherry window, a chess piece in hand', draw(lt, d, t) { R.room({ wall: '#C2AE88', floor: '#7A5236', fl: 860, seed: 43, wash: '#2F3550', washA: 0.55 }); R.windowPane(300, 110, 440, 560, { t, moon: true }); ctx.save(); ctx.filter = 'brightness(0.15)'; person('dupleix', { x: 520, y: 900, h: 640, t, dir: -1, arm: 70 }); ctx.restore(); ctx.filter = 'none'; K.slip('PONDICHERRY', 1300, 300, eob(seg(lt, 0.4, 0.7)), 0.02, 40); } });
    X.ev(st + 0.4, 'slip', 'PONDICHERRY'); X.ev(st + bi, 'chess', 'the chess piece turns', { gain: 0.4 }); X.amb(st, X.end('3.12') + 0.3, 'room', 0.5); }
}
