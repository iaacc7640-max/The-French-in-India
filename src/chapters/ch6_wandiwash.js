// CH6 · 1760: WANDIWASH (duel: Lally vs Coote) — the PAYOFF of the hook: the supply line.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

/** the English supply line: thick crimson from Bengal down the coast to Madras, with coin, rice and soldier icons riding it */
export function supplyMap(t, { red = 1, bengal = 1 } = {}) {
  const v = A.realMap({ view: 'peninsula', t }), at = (n) => A.at(v, n);
  A.inkBleed(...at('Calcutta'), 230, bengal, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.6 });
  A.pin(...at('Calcutta'), 'english', { r: 16 }); A.placeLabel('BENGAL', ...at('Calcutta'), { dx: -130, dy: 30, size: 28 });
  A.pin(...at('Madras'), 'english', { r: 16 }); A.placeLabel('MADRAS', ...at('Madras'), { dx: -100, dy: -10, size: 24 });
  A.pin(...at('Pondicherry'), 'french', { star: true }); A.placeLabel('PONDICHERRY', ...at('Pondicherry'), { dx: -150, dy: 14, size: 24 });
  if (red > 0) A.supplyLine(A.BENGAL_ROUTE.map(([a, b]) => A.proj(v, a, b)), { p: red, t, thick: 34 });
  return v;
}
function plain(t) { K.parchment(91); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 760); K.cut(K.P_rr(-300, 470, W + 600, 800, 0), '#C9B48A', { shadow: 0.4, edge: 4 }); }

export function build(X, C) {
  const ch = 6, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('6.1'), se = X.w('seven', '6.1') - st;
    sh({ id: 'U01', at: st, move: cam.drift(0.03), note: 'Europe: the crowns clash again (the Seven Years War)', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.1, se + 0.6) + clamp(lt - se - 0.6)); K.slip('THE SEVEN YEARS WAR', 1450, 300, eob(seg(lt, se, se + 0.3)), 0.02, 36); } });
    X.ev(st + se, 'slip', 'SEVEN YEARS WAR'); X.ev(st + se + 0.6, 'drop', 'crowns clash'); X.cue(st, 'drums', { dur: 2.0, gain: 0.4 }); }
  { const st = X.at('6.2'), la = X.w('lally', '6.2') - st, de = X.w('desperate', '6.2') - st, fi = X.w('finish', '6.2') - st;
    sh({ id: 'U02', at: st, whip: 'right', move: cam.push(0.05, [700, 520]), note: 'Lally lands at Pondicherry with fresh troops', draw(lt, d, t) { SC.townScene(t, 1, { ships: [[1500, A.FLAGS.french, -1], [1780, A.FLAGS.french, -1]] }); person('lally', { x: lerp(560, 380, eo(clamp(lt / 1.5))), y: 700, h: 440, t, walk: lt < 1.5 ? lt * 8 : null }); R.army(lerp(900, 700, eo(seg(lt, fi - 0.5, fi + 1))), 694, 6, 2, P.royal, { t, s: 2.0, seed: 5, march: seg(lt, fi - 0.6, fi), step: 1 }); K.slip('COMTE DE LALLY', 400, 180, eob(seg(lt, la, la + 0.3)), -0.02, 40); K.slip('PROUD · DESPERATE', 400, 280, eob(seg(lt, de, de + 0.3)), 0.02, 32); K.slip('PONDICHERRY · 1758', 1480, 240, eob(seg(lt, 0.3, 0.6)), 0.02, 34); } });
    X.ev(st + 0.3, 'slip', 'PONDICHERRY 1758'); X.ev(st + la, 'slip', 'COMTE DE LALLY'); X.ev(st + de, 'slip', 'PROUD · DESPERATE'); X.ev(st + fi - 0.5, 'drums', 'fresh troops land', { dur: 2, gain: 0.4 }); X.amb(st, X.end('6.2') + 0.2, 'sea', 0.7); }
  // 6.3 · at first he pushed them back toward Madras: blue advances north on the map, crimson falls back
  { const st = X.at('6.3'), pu = X.w('pushed', '6.3') - st, md = X.w('madras', '6.3') - st;
    sh({ id: 'U03', at: st, whip: 'down', move: cam.push(0.05, [1000, 420]), note: 'the Carnatic map: the French advance north from Pondicherry, the English fall back on Madras', draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), m = A.at(v, 'Madras'), p0 = A.at(v, 'Pondicherry'), k = eio(seg(lt, pu - 0.3, d));
      A.pin(...p0, 'french', { star: true }); A.placeLabel('PONDICHERRY', ...p0, { dx: 150, dy: 0, size: 24 }); A.pin(...m, 'english', { r: 16 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 24, sc: 1 });
      A.inkBleed(p0[0], p0[1], lerp(120, 290, k), 1, P.royal, { clipFn: A.mainland(v), seed: 3, alpha: 0.5 });
      const by = lerp(p0[1] - 90, m[1] + 170, k), ry = lerp(p0[1] - 260, m[1] + 40, k);
      R.army(p0[0] - 150, by, 8, 3, P.royal, { t, seed: 2, step: 1 }); A.flag(p0[0] - 20, by, t, A.FLAGS.french, { s: 0.6 });
      R.army(m[0] - 170, ry, 6, 2, P.crimson, { t, seed: 6, step: 1 }); A.flag(m[0] - 60, ry, t, A.FLAGS.english, { s: 0.6 });
    } });
    X.ev(st + pu - 0.3, 'ink', 'the French advance north'); X.ev(st + md, 'flag', 'the English fall back on Madras'); X.cue(st, 'drums', { dur: 2.5, gain: 0.45 }); }
  { const st = X.at('6.4'), di = X.w('didn', '6.4') - st;
    sh({ id: 'U04', at: st, whip: 'up', move: cam.snap(di, 0.08, [1150, 300]), note: 'the map: Bengal glows in the north-east', draw(lt, d, t) { const v = supplyMap(t, { red: 0, bengal: 0 }), [x, y] = A.at(v, 'Calcutta'); ctx.save(); ctx.globalAlpha = 0.4 * (0.5 + 0.5 * Math.sin(t * 5)) * seg(lt, 0.2, di); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.arc(x, y, 130, 0, 7); ctx.fill(); ctx.restore(); } });
    X.ev(st + 0.2, 'light', 'Bengal glows'); }
  { const st = X.at('6.5'), pl = X.w('plassey', '6.5') - st;
    sh({ id: 'U05', at: st, move: cam.push(0.06, [1150, 260]), note: 'Bengal inks crimson; the PLASSEY 1757 pin', draw(lt, d, t) { const v = supplyMap(t, { red: 0, bengal: seg(lt, 0, 0.9) }), [x, y] = A.at(v, 'Plassey'); A.pin(x, y, 'english', { sc: eob(seg(lt, pl, pl + 0.3)), r: 12 }); A.placeLabel('PLASSEY 1757', x, y, { dx: 140, dy: -6, size: 24, sc: eob(seg(lt, pl, pl + 0.3)) }); } });
    X.ev(st + 0.05, 'ink', 'Bengal turns crimson'); X.ev(st + pl, 'pop', 'Plassey pin'); }
  { const st = X.at('6.6'), mo = X.w('money', '6.6') - st;
    sh({ id: 'U06', at: st, move: cam.snap(mo, 0.1, [1250, 420]), note: 'THE SUPPLY LINE: thick crimson from Bengal to Madras with coin, rice and soldier icons', draw(lt, d, t) { const v = supplyMap(t, { red: seg(lt, mo - 0.5, mo + 0.7) }), [x, y] = A.at(v, 'Plassey'); A.pin(x, y, 'english', { r: 12 }); K.slip('MONEY · FOOD · MEN', 1560, 560, eob(seg(lt, mo + 0.3, mo + 0.6)), 0.02, 36); } });
    X.ev(st + mo - 0.5, 'route', 'the crimson supply line'); X.ev(st + mo + 0.3, 'slip', 'MONEY · FOOD · MEN'); X.cue(st + mo + 0.3, 'coins', { gain: 0.6 }); }
  // 6.7 · Lally's supplies had to come the long way, by sea from France: the long thin blue line, France → the Cape → Mauritius → Pondicherry
  { const st = X.at('6.7'), lo = X.w('long', '6.7') - st, fr = X.w('france', '6.7') - st;
    sh({ id: 'U07', at: st, whip: 'left', move: cam.push(0.04, [800, 520]), note: "the voyage map: Lally's long, thin supply line from France round Africa, against the short thick line from Bengal", draw(lt, d, t) { SC.voyageMap(t, { red: 1, blue: eo(seg(lt, 0.15, fr + 0.5)), broken: true }); K.slip('THE LONG WAY', 560, 640, eob(seg(lt, lo, lo + 0.3)), -0.02, 40); K.slip('SUPPLY LINE', 1560, 640, eob(seg(lt, fr, fr + 0.3)), 0.02, 40); } });
    X.ev(st + 0.15, 'route', 'the long French supply line draws from France'); X.ev(st + lo, 'slip', 'THE LONG WAY'); X.ev(st + fr, 'slip', 'SUPPLY LINE'); X.amb(st, X.end('6.7') + 0.2, 'sea', 0.6); }
  X.amb(X.at('6.8'), X.end('6.9') + 0.3, 'wind', 0.8);
  { const st = X.at('6.8'), ja = X.w('january', '6.8') - st;
    sh({ id: 'U08', at: st, whip: 'right', move: cam.push(0.06, [860, 480]), note: 'the Carnatic map: both armies converge on Wandiwash; 22 Jan 1760', draw(lt, d, t) {
      const v = A.realMap({ view: 'carnatic', t }), wa = A.at(v, 'Wandiwash'), m = A.at(v, 'Madras'), p0 = A.at(v, 'Pondicherry'), k = eio(seg(lt, 0.3, d - 0.3));
      A.pin(...p0, 'french', { star: true }); A.placeLabel('PONDICHERRY', ...p0, { dx: 150, dy: 0, size: 24 }); A.pin(...m, 'english', { r: 16 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 24 });
      A.drawPolyline([p0, [wa[0] + 30, wa[1] + 40]], k, P.royal, 7, [18, 12]); A.drawPolyline([m, [wa[0] + 30, wa[1] - 40]], k, P.crimson, 7, [18, 12]);
      A.pin(wa[0], wa[1], 'maratha', { r: 16, glow: 1, sc: eob(seg(lt, ja, ja + 0.3)) }); A.placeLabel('WANDIWASH', wa[0], wa[1], { dx: -140, dy: 0, size: 28, sc: eob(seg(lt, ja, ja + 0.3)) });
      K.ribbon('22 JAN 1760', 1500, 640, eob(seg(lt, 0.3, 0.7)), 64);
    } });
    X.ev(st + 0.3, 'ribbon', '22 JAN 1760'); X.ev(st + 0.35, 'route', 'both armies march on Wandiwash'); X.ev(st + ja, 'pop', 'Wandiwash'); X.cue(st, 'drums', { dur: 3.5, gain: 0.7 }); }
  { const st = X.at('6.9'), ko = X.w('koot', '6.9') - st, pa = X.w('patient', '6.9') - st, de = X.w('defeated', '6.9') - st;
    sh({ id: 'U09', at: st, whip: 'down', move: cam.push(0.05, [W / 2, 520]), note: 'the plain of Wandiwash: Lally and Coote face each other with their armies; the blue line pulls back', draw(lt, d, t) {
      plain(t); R.smokeDrift(960, 700, t, { s: 0.8, a: 0.4 }); const back = eio(seg(lt, de, de + 1.5));
      R.army(430 - back * 330, 700, 9, 4, P.royal, { t, s: 1.6, seed: 3, step: back > 0 && back < 1 ? 1 : 0, face: back > 0.1 ? -1 : 1 }); A.flag(250 - back * 330, 640, t, A.FLAGS.french, { s: 1.1, droop: back });
      R.army(1500, 700, 9, 4, P.crimson, { t, s: 1.6, seed: 8, face: -1 }); A.flag(1700, 640, t, A.FLAGS.english, { s: 1.1 });
      person('lally', { x: 700 - back * 280, y: 860, h: 500, t, dir: back > 0.1 ? -1 : 1 }); person('coote', { x: 1240, y: 860, h: 500, t, dir: -1 });
      K.slip('LALLY', 700 - back * 280, 300, eob(seg(lt, 0.2, 0.5)), -0.02, 36); K.slip('SIR EYRE COOTE', 1240, 300, eob(seg(lt, ko, ko + 0.3)), 0.02, 36); K.slip('PATIENT · WELL SUPPLIED', 1300, 210, eob(seg(lt, pa, pa + 0.3)), -0.01, 30);
      A.statCard({ x: W / 2, y: 520, title: 'Wandiwash', stats: ['Coote vs Lally'], date: '22 Jan 1760', p: seg(lt, de + 0.2, de + 0.8), portrait: portrait('coote') });
    } });
    X.ev(st + 0.2, 'slip', 'LALLY'); X.ev(st + ko, 'slip', 'SIR EYRE COOTE'); X.ev(st + pa, 'slip', 'PATIENT · WELL SUPPLIED'); X.ev(st + de, 'flag', 'the blue line pulls back'); X.ev(st + de + 0.2, 'card', 'Wandiwash card'); }
  { const st = X.at('6.10'), po = X.w('pon', '6.10') - st, mo = X.w('months', '6.10') - st;
    sh({ id: 'U10', at: st, whip: 'left', move: cam.push(0.06, [960, 420]), note: 'the walls of Pondicherry at night; the months flip by; the siege card', draw(lt, d, t) { SC.fortWalls(t, { night: true, torches: true, flagCols: A.FLAGS.french }); const m = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][Math.min(7, Math.floor(seg(lt, po, mo) * 7.99))]; SC.calendar(1560, 560, m, (seg(lt, po, mo) * 8) % 1, { sub: '1760' }); K.slip('PONDICHERRY BESIEGED', 430, 230, eob(seg(lt, po, po + 0.3)), -0.02, 34); A.statCard({ x: 430, y: 560, title: 'Pondicherry', stats: ['siege ~8 months'], date: 'Jan 1761', p: seg(lt, mo, mo + 0.6), portrait: portrait('lally') }); } });
    X.ev(st + po, 'slip', 'PONDICHERRY BESIEGED'); X.ev(st + po + 0.1, 'page', 'the months flip by'); X.ev(st + mo, 'card', 'siege card'); X.amb(st, X.end('6.12') + 0.2, 'wind', 0.5); }
  // 6.11 · the city surrendered: the French royal flag comes down, the English flag goes up
  { const st = X.at('6.11'), su = X.w('surrendered', '6.11') - st;
    sh({ id: 'U11', at: st, move: cam.push(0.06, [960, 300]), note: 'the French flag comes down over Pondicherry; the English flag goes up', draw(lt, d, t) { SC.fortWalls(t, { night: true, torches: true, flagCols: A.FLAGS.french, flagRaise: 1 - seg(lt, su - 0.3, su + 0.6), flag2: A.FLAGS.english, flag2Raise: seg(lt, su + 0.4, su + 1.2) }); K.ribbon('JANUARY 1761', W / 2, 560, eob(seg(lt, 0.2, 0.6)), 60); } });
    X.ev(st + 0.2, 'ribbon', 'January 1761'); X.ev(st + su - 0.3, 'flag', 'the French flag comes down'); X.ev(st + su + 0.4, 'flag', 'the English flag goes up', { gain: 0.6 }); }
  { const st = X.at('6.12'), bl = X.w('blame', '6.12') - st;
    sh({ id: 'U12', at: st, move: cam.push(0.07, [700, 520]), note: 'Lally alone by the walls, head bowed; WHO IS TO BLAME?', draw(lt, d, t) { SC.fortWalls(t, { night: true, torches: true, flagCols: A.FLAGS.french, flagRaise: 0, flag2: A.FLAGS.english, flag2Raise: 1 }); ctx.save(); ctx.translate(700, 900); ctx.rotate(0.06); ctx.translate(-700, -900); person('lally', { x: 700, y: 900, h: 520, t }); ctx.restore(); K.slip('WHO IS TO BLAME?', 1420, 560, eob(seg(lt, bl - 0.2, bl + 0.1)), 0.02, 52); } });
    X.ev(st + 0.3, 'light', 'Lally alone'); X.ev(st + bl - 0.2, 'slip', 'WHO IS TO BLAME?'); }
}
