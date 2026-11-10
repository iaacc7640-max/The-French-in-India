// CH1 · 1664: LAST TO THE PARTY. Colbert's company, the Madagascar detour, the factory at Surat, Marcara at Golconda.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

const NATIONS = [['portuguese', 'Goa', 'PORTUGUESE', -150], ['dutch', 'Pulicat', 'DUTCH', 120], ['english', 'Surat', 'ENGLISH', -130], ['danish', 'Tranquebar', 'DANES', 110]];
/** the whole subcontinent with the four earlier European nations' flags (pop 0..1 each) */
function europeans(t, pop) {
  const v = A.realMap({ view: 'india', t });
  NATIONS.forEach(([s, place, name, dx], i) => { const [x, y] = A.at(v, place), p = eob(clamp(pop(i))); if (p <= 0) return; A.pin(x, y, 'maratha', { r: 7 }); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); A.flag(0, 0, t, A.FLAGS[s], { s: 0.75, seed: i }); ctx.restore(); A.placeLabel(name, x, y, { dx, dy: -40, size: 22, sc: p }); });
  return v;
}
function versailles(t, { sign = 0, seal = 0 } = {}) {
  K.hall(); ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = P.gold; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  R.table(1280, 760, 520, { h: 120, cloth: P.royal });
  SC.scroll(1280, 560, 480, sign, { title: 'COMPAGNIE DES INDES', seal, sealText: '50\nYEARS' });
  person('louis', { x: 520, y: 860, h: 640, t });
  person('colbert', { x: 880, y: 860, h: 580, t, dir: 1, arm: 20 + 25 * Math.sin(clamp(sign) * 3) });
}
function golconda(t) {
  R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 57 });
  for (const x of [300, 700, 1220, 1620]) K.cut(() => { ctx.beginPath(); ctx.moveTo(x - 120, 880); ctx.lineTo(x - 120, 360); ctx.arc(x, 360, 120, Math.PI, Math.PI * 2); ctx.lineTo(x + 120, 880); ctx.closePath(); }, '#B39E78', { shadow: 0, edge: 0 });
  R.throne(1250, 880, { col: '#5E3B28' }); person('sultan', { x: 1250, y: 860, h: 470, t, seed: 9, prop: 'none' });
}
const TURN = { lon: 62, lat: 0, deg: 110, base: 'indian_ocean' };   // Madagascar and Surat in one frame

export function build(X, C) {
  const ch = 1, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  // 1.1 · the four nations already in India
  { const st = X.at('1.1'), la = X.w('last', '1.1') - st;
    sh({ id: 'P01', at: st, move: cam.drift(0.03, [800, 520]), note: 'the whole subcontinent: Portuguese, Dutch, English and Danish flags already there', draw(lt, d, t) { europeans(t, (i) => seg(lt, 0.2 + i * 0.35, 0.5 + i * 0.35)); K.slip('THE FRENCH: LAST TO ARRIVE', 1420, 470, eob(seg(lt, la, la + 0.3)), 0.02, 38); } });
    NATIONS.forEach((n, i) => X.ev(st + 0.2 + i * 0.35, 'flag', `${n[2]} flag`)); X.ev(st + la, 'slip', 'last to arrive'); X.amb(st, X.end('1.2') + 0.2, 'sea', 0.5); }
  // 1.2 · so they had to move fast: a ship races from France round Africa
  { const st = X.at('1.2'), f = X.w('fast', '1.2') - st;
    sh({ id: 'P02', at: st, whip: 'left', move: cam.snap(f, 0.08, [900, 500]), note: 'the voyage map: a French ship races from France round Africa toward India', draw(lt, d, t) { SC.voyageMap(t, { blue: eo(seg(lt, 0.1, d - 0.1)), labels: seg(lt, 0.1, 0.4) }); } });
    X.ev(st + 0.1, 'route', 'the route from France draws'); X.ev(st + f, 'flag', 'the ship races on'); }
  X.amb(X.at('1.3'), X.end('1.5') + 0.2, 'court', 0.8);
  { const st = X.at('1.3'), lo = X.w('louis', '1.3') - st, co = X.w('kol', '1.3') - st;
    sh({ id: 'P03', at: st, whip: 'right', move: cam.push(0.05, [800, 520]), note: 'Versailles: Louis XIV and his minister Colbert', draw(lt, d, t) { versailles(t); K.ribbon('1664', 1500, 200, eob(seg(lt, 0.2, 0.6)), 80); K.slip('LOUIS XIV', 520, 170, eob(seg(lt, lo, lo + 0.3)), -0.02, 36); K.slip('COLBERT', 900, 230, eob(seg(lt, co, co + 0.3)), 0.02, 36); } });
    X.ev(st + 0.2, 'ribbon', '1664'); X.ev(st + lo, 'slip', 'LOUIS XIV'); X.ev(st + co, 'slip', 'COLBERT'); }
  { const st = X.at('1.4'), cr = X.w('created', '1.4') - st;
    sh({ id: 'P04', at: st, move: cam.push(0.06, [1100, 560]), note: 'the company charter unrolls on the map table', draw(lt, d, t) { versailles(t, { sign: seg(lt, cr, cr + 0.8) }); } });
    X.ev(st + cr, 'card', 'charter unrolls'); X.ev(st + cr + 1.4, 'route', 'Colbert signs', { dur: 0.8 }); }
  { const st = X.at('1.5'), fi = X.w('fifty', '1.5') - st;
    sh({ id: 'P05', at: st, move: cam.snap(fi, 0.12, [1280, 560]), note: 'seal "50 YEARS" stamps on the charter', draw(lt, d, t) { versailles(t, { sign: 1, seal: lt - fi }); } });
    X.ev(st + fi, 'seal', '50 YEARS'); X.ev(st + fi + 1.6, 'light', 'the seal gleams', { sound: false }); }
  // 1.6 · Madagascar (with the African coast beside it): the flag droops, the coins sink
  { const st = X.at('1.6'), mo = X.w('money', '1.6') - st, ma = X.w('madagascar', '1.6') - st;
    sh({ id: 'P06', at: st, whip: 'down', move: cam.push(0.05, [760, 600]), note: 'Madagascar beside Africa: the French flag droops, coins sink into the sea', draw(lt, d, t) {
      const v = A.realMap({ view: 'madagascar', t }), fd = A.at(v, 'Fort Dauphin'), mid = A.proj(v, 46.8, -19.2);
      A.placeLabel('AFRICA', ...A.proj(v, 36.5, -14), { size: 30, dy: 0 }); A.placeLabel('MADAGASCAR', mid[0], mid[1], { size: 30, dy: 0, sc: eob(seg(lt, 0.2, 0.5)) });
      A.pin(fd[0], fd[1], 'french', { r: 12 }); A.flag(fd[0], fd[1], t, A.FLAGS.french, { s: 1.3, droop: seg(lt, 0.6, ma), raise: 1 - 0.5 * seg(lt, mo, ma + 0.5) });
      for (let i = 0; i < 9; i++) { const u = seg(lt, mo - 0.3 + i * 0.22, mo + 0.9 + i * 0.22); if (u > 0 && u < 1) { ctx.save(); ctx.globalAlpha = 1 - u * 0.7; A.iconAt('coin', fd[0] + 120 + i * 34, fd[1] - 260 + u * 300, 1.4); ctx.restore(); } }
      K.slip('WASTED YEARS', 1380, 330, eob(seg(lt, 0.9, 1.2)), 0.02, 40); K.slip('WASTED MONEY', 1380, 450, eob(seg(lt, mo, mo + 0.3)), -0.02, 40);
    } });
    X.ev(st + 0.2, 'slip', 'MADAGASCAR', { sound: false }); X.ev(st + 0.9, 'slip', 'WASTED YEARS'); X.ev(st + mo, 'coin', 'coins sink'); X.ev(st + ma, 'flag', 'the flag droops'); X.amb(st, X.end('1.7') + 0.2, 'sea', 0.7); }
  // 1.7 · so it turned to India: the ship sails from Madagascar to Surat
  { const st = X.at('1.7'), ind = X.w('india', '1.7') - st;
    sh({ id: 'P07', at: st, whip: 'up', move: cam.push(0.05, [1100, 300]), note: 'a ship sails from Madagascar north to India (Surat)', draw(lt, d, t) {
      const v = A.realMap({ view: TURN, t }), a = A.proj(v, 49.3, -12.5), b = A.at(v, 'Surat'), h = A.drawPolyline([a, A.proj(v, 56, -2), A.proj(v, 64, 10), A.proj(v, 70.5, 19.5), b], eo(seg(lt, 0.1, ind + 0.5)), P.royal, 7, [22, 14]);
      ctx.save(); ctx.translate(h[0], h[1] - 4); SC.shipSmall(0.13, t, A.FLAGS.french); ctx.restore(); A.placeLabel('MADAGASCAR', ...A.proj(v, 46.8, -19), { size: 22, dy: 0 }); A.pin(b[0], b[1], 'french', { r: 12, sc: eob(seg(lt, ind + 0.3, ind + 0.6)) }); A.placeLabel('SURAT', b[0], b[1], { dx: -90, dy: 0, size: 26, sc: eob(seg(lt, ind + 0.3, ind + 0.6)) });
    } });
    X.ev(st + 0.1, 'route', 'ship sails to India'); X.ev(st + ind + 0.3, 'pop', 'Surat pin'); }
  // 1.8 · the factory (trading post) at Surat opens: doors swing open, the flag goes up, goods stack up
  { const st = X.at('1.8'), ka = X.w('ka', '1.8') - st, op = X.w('opened', '1.8') - st, fa = X.w('factory', '1.8') - st, su = X.w('surat', '1.8') - st;
    sh({ id: 'P08', at: st, whip: 'right', move: cam.push(0.05, [960, 560]), note: 'Surat: the French factory opens (doors, flag, sign, goods); Caron', draw(lt, d, t) {
      SC.factoryScene(t, { open: seg(lt, op - 0.1, op + 0.7), flagRaise: seg(lt, op + 0.2, fa + 0.6), sign: seg(lt, fa, fa + 0.3), goods: seg(lt, fa + 0.1, d - 0.2) });
      person('caron', { x: 330, y: 840, h: 420, t, arm: lt > op ? 60 : 10 });
      K.ribbon('1668', 1560, 200, eob(seg(lt, 0.2, 0.6)), 70); K.slip('FRANÇOIS CARON', 330, 330, eob(seg(lt, ka, ka + 0.3)), -0.02, 32); K.slip('SURAT', 1560, 330, eob(seg(lt, su, su + 0.3)), 0.02, 40);
    } });
    X.ev(st + 0.2, 'ribbon', '1668'); X.ev(st + ka, 'slip', 'CARON'); X.ev(st + op - 0.1, 'door', 'factory doors open', { gain: 0.6 }); X.ev(st + fa, 'slip', 'FRENCH FACTORY sign'); X.ev(st + fa + 0.4, 'drop', 'goods stack up', { gain: 0.5 }); X.ev(st + su, 'slip', 'SURAT'); X.amb(st, X.end('1.8') + 0.2, 'market', 0.8); }
  { const st = X.at('1.9'), ar = X.w('armenian', '1.9') - st, ma = X.w('mar', '1.9') - st;
    sh({ id: 'P09', at: st, whip: 'right', move: cam.push(0.05, [900, 520]), note: 'Golconda court: Marcara, an Armenian merchant, bows to the Sultan', draw(lt, d, t) { golconda(t); const bow = Math.sin(clamp((lt - ma) / 1.2) * Math.PI) * 0.18; ctx.save(); ctx.translate(700, 880); ctx.rotate(bow); ctx.translate(-700, -880); person('marcara', { x: 700, y: 880, h: 560, t }); ctx.restore(); K.slip('AN ARMENIAN MERCHANT', 380, 330, eob(seg(lt, ar, ar + 0.3)), 0.01, 30); K.slip('MARCARA', 380, 230, eob(seg(lt, ma, ma + 0.3)), -0.02, 38); K.ribbon('1669', 1560, 200, eob(seg(lt, 0.3, 0.7)), 70); } });
    X.ev(st + 0.3, 'ribbon', '1669'); X.ev(st + ar, 'slip', 'ARMENIAN MERCHANT'); X.ev(st + ma, 'slip', 'MARCARA'); X.amb(st, X.end('1.10') + 0.2, 'court', 0.8); }
  { const st = X.at('1.10'), ri = X.w('rights', '1.10') - st, go = X.w('golconda', '1.10') - st;
    sh({ id: 'P10', at: st, move: cam.push(0.05, [1000, 520]), note: 'the Sultan grants trading rights: the scroll unrolls and is sealed', draw(lt, d, t) { golconda(t); person('marcara', { x: 700, y: 880, h: 560, t, arm: 60 }); SC.scroll(1000, 470, 420, seg(lt, ri - 0.3, ri + 0.5), { title: 'TRADING RIGHTS', seal: lt - go }); K.slip('SULTAN OF GOLCONDA', 1480, 250, eob(seg(lt, go - 0.5, go - 0.2)), 0.02, 30); } });
    X.ev(st + ri - 0.3, 'card', 'scroll unrolls'); X.ev(st + go - 0.5, 'slip', 'SULTAN OF GOLCONDA'); X.ev(st + go, 'seal', 'Golconda seal'); }
  { const st = X.at('1.11'), ms = X.w('mussoo', '1.11') - st;
    sh({ id: 'P11', at: st, whip: 'down', move: cam.push(0.05, [1000, 520]), note: 'map: the way from Golconda to the coast at Masulipatnam draws itself', draw(lt, d, t) {
      const v = A.realMap({ view: 'deccan', t }), a = A.at(v, 'Golconda'), b = A.at(v, 'Masulipatnam');
      A.drawPolyline([a, [(a[0] + b[0]) / 2, a[1] - 20], b], seg(lt, 0.1, ms), P.royal, 7, [20, 14]);
      A.pin(...a, 'nizam'); A.placeLabel('GOLCONDA', ...a, { size: 26 }); A.pin(...b, 'french', { sc: eob(seg(lt, ms, ms + 0.3)) }); A.flag(b[0], b[1], t, A.FLAGS.french, { s: 0.8 * eob(seg(lt, ms + 0.1, ms + 0.4)) }); A.placeLabel('MASULIPATNAM', ...b, { dx: 150, dy: 0, size: 26, sc: eob(seg(lt, ms, ms + 0.3)) });
    } });
    X.ev(st + 0.1, 'route', 'route to Masulipatnam'); X.ev(st + ms, 'pop', 'Masulipatnam pin and flag'); }
  const footholds = (t) => { const v = A.realMap({ view: 'india', t }); for (const [n, dx] of [['Surat', -90], ['Masulipatnam', 140]]) { const [x, y] = A.at(v, n); A.pin(x, y, 'french', { r: 10, glow: 0.5 + 0.5 * Math.sin(t * 3) }); A.flag(x, y, t, A.FLAGS.french, { s: 0.6 }); A.placeLabel(n.toUpperCase(), x, y, { dx, dy: 14, size: 22 }); } return v; };
  { const st = X.at('1.12'), fo = X.w('foothold', '1.12') - st;
    sh({ id: 'P12', at: st, whip: 'left', move: cam.drift(0.03, [800, 520]), note: 'the whole subcontinent: two French footholds, Surat and Masulipatnam', draw(lt, d, t) { footholds(t); K.slip('A FOOTHOLD', 1420, 470, eob(seg(lt, fo, fo + 0.3)), 0.02, 44); } });
    X.ev(st + 0.3, 'pop', 'footholds glow', { gain: 0.4 }); X.ev(st + fo, 'slip', 'A FOOTHOLD'); }
  { const st = X.at('1.13'), ho = X.w('home', '1.13') - st;
    sh({ id: 'P13', at: st, move: cam.push(0.08, [760, 640]), note: 'an empty, ringed spot on the Coromandel coast: no home yet', draw(lt, d, t) { const v = footholds(t), [x, y] = A.at(v, 'Pondicherry'); ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4); ctx.setLineDash([8, 7]); ctx.strokeStyle = P.royal; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 26, 0, 7); ctx.stroke(); ctx.restore(); K.slip('A HOME?', 1420, 470, eob(seg(lt, ho, ho + 0.3)), 0.02, 44); } });
    X.ev(st + 0.3, 'light', 'empty ring on the coast'); X.ev(st + ho, 'slip', 'A HOME?'); }
}
