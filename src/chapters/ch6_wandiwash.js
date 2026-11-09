// CH6 · 1760: WANDIWASH (duel: Lally vs Coote) — the PAYOFF of the hook: the supply line.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
import { boardOver } from './ch4_kingmaker.js';
const { P } = K;

/** the full supply-line map: thick crimson from Bengal, thin broken blue overland to the French */
export function supplyMap(t, { red = 1, blue = 1, teaser = 0 } = {}) {
  const v = A.realMap({ view: 'india', t }), at = (n) => A.at(v, n);
  A.inkBleed(...at('Calcutta'), 260, 1, P.crimson, { clipFn: A.landPath(v), seed: 5, alpha: 0.6 });
  A.pin(...at('Calcutta'), 'english', { r: 16 }); A.placeLabel('BENGAL', ...at('Calcutta'), { dx: -120, dy: 0, size: 26 });
  A.pin(...at('Madras'), 'english', { r: 16 }); A.placeLabel('MADRAS', ...at('Madras'), { dx: 100, dy: 0, size: 24 });
  A.pin(...at('Pondicherry'), 'french', { star: true }); A.placeLabel('PONDICHERRY', ...at('Pondicherry'), { dx: 150, dy: 10, size: 24 });
  if (red > 0) A.supplyLine([at('Calcutta'), [1330, 330], [1150, 560], at('Madras')], { p: red, t, thick: 34 });
  if (blue > 0) A.supplyLine([at('Mahe'), [640, 650], at('Wandiwash')], { p: blue, t, side: 'french', broken: true });
  return v;
}

export function build(X, C) {
  const ch = 6, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('6.1'), se = X.w('seven', '6.1') - st;
    sh({ id: 'U01', at: st, move: cam.drift(0.03), note: 'Europe: crowns clash again (no year shown)', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.1, se + 0.6) + clamp(lt - se - 0.6)); K.slip('THE SEVEN YEARS WAR', 1450, 300, eob(seg(lt, se, se + 0.3)), 0.02, 36); } });
    X.ev(st + se, 'slip', 'SEVEN YEARS WAR'); X.ev(st + se + 0.6, 'whip', 'crowns clash'); X.cue(st, 'drums', { dur: 2.0, gain: 0.4 }); }
  { const st = X.at('6.2'), la = X.w('lally', '6.2') - st;
    sh({ id: 'U02', at: st, whip: 'right', move: cam.push(0.05, [700, 520]), note: 'Lally arrives at Pondicherry in the coat from the cold open', draw(lt, d, t) { SC.seaPage(t, 1350, {}); K.cut(K.P_rr(-40, 700, 900, 36, 6), P.sepia); for (const x of [40, 300, 560, 820]) K.cut(K.P_rr(x, 700, 24, 200, 4), P.sepia); person('lally', { x: lerp(820, 600, eo(clamp(lt / 1.5))), y: 705, h: 460, t, walk: lt < 1.5 ? lt * 8 : null }); K.slip('COMTE DE LALLY', 600, 200, eob(seg(lt, la, la + 0.3)), -0.02, 40); } });
    X.ev(st + la, 'slip', 'COMTE DE LALLY'); X.ev(st + 1.5, 'drop', 'steps ashore', { gain: 0.4 }); X.amb(st, X.end('6.2') + 0.2, 'sea', 0.7); }
  { const st = X.at('6.3'), pu = X.w('pushed', '6.3') - st;
    sh({ id: 'U03', at: st, whip: 'down', move: cam.drift(0.03, [W / 2, 470]), note: 'chessboard: blue pieces push the crimson pieces back', draw(lt, d, t) { const sq = boardOver(t); const k = eio(seg(lt, pu - 0.2, pu + 1.0)); for (let i = 0; i < 4; i++) { A.chessPiece(...sq(2 + i * 0.9 + k * 1.2, 4.6 - k * 0.8), { kind: 'pawn', side: 'french', s: 1.35 }); A.chessPiece(...sq(2.4 + i * 0.9 + k * 1.6, 2.6 - k * 1.4), { kind: 'pawn', side: 'english', s: 1.35 }); } K.slip('TOWARD MADRAS', 1500, 300, eob(seg(lt, pu + 0.6, pu + 0.9)), 0.02, 34); } });
    X.ev(st + pu - 0.2, 'chess', 'blue pushes'); X.ev(st + pu + 0.6, 'slip', 'TOWARD MADRAS'); }
  { const st = X.at('6.4'), di = X.w('didn', '6.4') - st;
    sh({ id: 'U04', at: st, whip: 'up', move: cam.snap(di, 0.1, [1150, 300]), note: 'the two-colour map; Bengal glows', draw(lt, d, t) { supplyMap(t, { red: 0, blue: 0 }); const v = A.VIEWS.india, [x, y] = A.at(v, 'Calcutta'); ctx.save(); ctx.globalAlpha = 0.35 * (0.5 + 0.5 * Math.sin(t * 5)) * seg(lt, di - 0.3, di); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.arc(x, y, 120, 0, 7); ctx.fill(); ctx.restore(); } });
    X.ev(st + di - 0.3, 'light', 'Bengal glows'); }
  { const st = X.at('6.5'), pl = X.w('plassey', '6.5') - st;
    sh({ id: 'U05', at: st, move: cam.push(0.06, [1150, 260]), note: 'Bengal bleeds crimson; a small PLASSEY 1757 pin', draw(lt, d, t) { const v = supplyMap(t, { red: 0, blue: 0 }); const [x, y] = A.at(v, 'Plassey'); A.pin(x, y, 'english', { sc: eob(seg(lt, pl, pl + 0.3)), r: 12 }); A.placeLabel('PLASSEY 1757', x, y, { dx: 130, dy: 0, size: 24, sc: eob(seg(lt, pl, pl + 0.3)) }); } });
    X.ev(st + 0.1, 'ink', 'Bengal crimson'); X.ev(st + pl, 'pop', 'Plassey pin'); }
  { const st = X.at('6.6'), mo = X.w('money', '6.6') - st;
    sh({ id: 'U06', at: st, move: cam.snap(mo, 0.12, [1250, 420]), note: 'THE SUPPLY LINE: thick crimson from Bengal with coin, rice and soldier icons', draw(lt, d, t) { supplyMap(t, { red: seg(lt, mo - 0.5, mo + 0.6), blue: 0 }); K.slip('SUPPLY LINE', 1560, 520, eob(seg(lt, mo + 0.4, mo + 0.7)), 0.02, 40); } });
    X.ev(st + mo - 0.5, 'route', 'crimson supply line'); X.ev(st + mo + 0.4, 'slip', 'SUPPLY LINE'); X.cue(st + mo + 0.3, 'coins', { gain: 0.6 }); }
  { const st = X.at('6.7'), ov = X.w('overland', '6.7') - st;
    sh({ id: 'U07', at: st, move: cam.push(0.05, [700, 640]), note: 'a thin, broken blue line struggles overland', draw(lt, d, t) { supplyMap(t, { red: 1, blue: seg(lt, 0.2, ov + 0.3) }); K.slip('THE LONG WAY', 380, 820, eob(seg(lt, ov, ov + 0.3)), -0.02, 34); } });
    X.ev(st + 0.2, 'route', 'broken blue line'); X.ev(st + ov, 'slip', 'THE LONG WAY'); }
  X.amb(X.at('6.8'), X.end('6.9') + 0.3, 'wind', 0.8);
  { const st = X.at('6.8');
    sh({ id: 'U08', at: st, whip: 'right', move: cam.push(0.06, [W / 2, 520]), note: 'Wandiwash plain; marching drums; 22 Jan 1760', draw(lt, d, t) { K.parchment(91); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 760); K.cut(K.P_rr(-300, 460, W + 600, 800, 0), '#C9B48A', { shadow: 0.4, edge: 4 }); for (const [x, s, side] of [[380, 0.9, 'french'], [1540, 0.9, 'english']]) { A.flag(x, 560, t, A.FLAGS[side], { s: 1.2 }); R.dotArmy(x, 680, 18, 6, 18, side === 'french' ? P.royal : P.crimson, { t, r: 6, seed: x }); } K.ribbon('22 JAN 1760', W / 2, 200, eob(seg(lt, 0.3, 0.7)), 70); } });
    X.ev(st + 0.3, 'ribbon', '22 JAN 1760'); X.cue(st, 'drums', { dur: 3.5, gain: 0.7 }); }
  { const st = X.at('6.9'), wa = X.w('won', '6.9') - st, de = X.w('defeated', '6.9') - st;
    sh({ id: 'U09', at: st, move: cam.snap(wa, 0.1, [W / 2, 500]), note: 'Lally vs Coote two-shot; Wandiwash stat card; blue banners pull back', draw(lt, d, t) {
      K.parchment(91); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 760); K.cut(K.P_rr(-300, 460, W + 600, 800, 0), '#C9B48A', { shadow: 0.4, edge: 4 });
      const back = eio(seg(lt, de, de + 1.4));
      A.flag(380 - back * 300, 560, t, A.FLAGS.french, { s: 1.2, droop: back }); R.dotArmy(380 - back * 300, 680, 18, 6, 18, P.royal, { t, r: 6, seed: 380 });
      A.flag(1540, 560, t, A.FLAGS.english, { s: 1.2 }); R.dotArmy(1540, 680, 18, 6, 18, P.crimson, { t, r: 6, seed: 1540 });
      person('lally', { x: 620 - back * 260, y: 860, h: 520, t }); person('coote', { x: 1300, y: 860, h: 520, t, dir: -1 });
      A.statCard({ x: W / 2, y: 330, title: 'Wandiwash', stats: ['Coote vs Lally'], date: '22 Jan 1760', p: seg(lt, wa + 0.2, wa + 0.8) });
    } });
    X.ev(st + wa + 0.2, 'card', 'Wandiwash card'); X.ev(st + de, 'flag', 'blue banners pull back'); }
  { const st = X.at('6.10'), mo = X.w('months', '6.10') - st;
    sh({ id: 'U10', at: st, whip: 'left', move: cam.push(0.06, [960, 420]), note: 'Pondicherry walls at night; eight months flip; siege card', draw(lt, d, t) { SC.fortWalls(t, { night: true, torches: true, flagCols: A.FLAGS.french }); const m = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][Math.min(7, Math.floor(seg(lt, 0.3, mo) * 7.99))]; SC.calendar(1560, 420, m, (seg(lt, 0.3, mo) * 8) % 1, { sub: '1760' }); A.statCard({ x: 420, y: 300, title: 'Pondicherry', stats: ['siege ~8 months'], date: 'Jan 1761', p: seg(lt, mo, mo + 0.6) }); } });
    X.ev(st + 0.3, 'page', 'months flip'); X.ev(st + mo, 'card', 'siege card'); X.amb(st, X.end('6.11') + 0.2, 'wind', 0.5); }
  { const st = X.at('6.11'), su = X.w('surrendered', '6.11') - st;
    sh({ id: 'U11', at: st, move: cam.push(0.06, [960, 300]), note: 'a white flag rises over the walls', draw(lt, d, t) { SC.fortWalls(t, { night: true, torches: true, flagCols: A.FLAGS.french, white: lt > su - 0.2 ? 1 : 0 }); K.ribbon('JANUARY 1761', W / 2, 560, eob(seg(lt, 0.2, 0.6)), 60); } });
    X.ev(st + 0.2, 'ribbon', 'January 1761'); X.ev(st + su - 0.2, 'flag', 'white flag'); }
}
