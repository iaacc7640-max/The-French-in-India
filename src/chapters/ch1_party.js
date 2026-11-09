// CH1 · 1664: LAST TO THE PARTY. Colbert's company, the Madagascar detour, Caron at Surat, Marcara at Golconda.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

const POSTS = [['portuguese', 73.8, 15.5], ['dutch', 79.75, 11.0], ['english', 80.28, 13.08], ['danish', 79.85, 11.03]];
function indiaFlags(v, t, lt, { blue = 0, route = 0 } = {}) {
  POSTS.forEach(([s, lo, la], i) => { const [x, y] = A.proj(v, lo, la + (s === 'danish' ? -0.9 : 0)); const p = eob(seg(lt, 0.15 + i * 0.3, 0.45 + i * 0.3)); if (p > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(p, p); A.flag(0, 0, t, A.FLAGS[s], { s: 0.55, seed: i }); ctx.restore(); } });
  if (route > 0) { const [sx, sy] = A.at(v, 'Surat'); const pts = [[-60, sy - 140], [sx - 260, sy - 60], [sx - 40, sy + 10]]; const h = A.drawPolyline(pts, route, P.royal, 7, [20, 14]); ctx.save(); ctx.translate(h[0], h[1]); ctx.scale(0.12, 0.12); ctx.rotate(0); ctx.restore(); if (blue > 0) A.flag(h[0], h[1], t, A.FLAGS.french, { s: 0.55 * eob(clamp(blue)) }); }
}
function versailles(t, { sign = 0, seal = 0 } = {}) {
  K.hall(); ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = P.gold; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore();
  R.table(1280, 760, 520, { h: 120, cloth: P.royal });
  SC.scroll(1280, 560, 480, sign, { title: 'COMPAGNIE DES INDES' , seal, sealText: '50\nYEARS' });
  person('louis', { x: 520, y: 860, h: 640, t });
  person('colbert', { x: 880, y: 860, h: 580, t, dir: 1, arm: 20 + 25 * Math.sin(clamp(sign) * 3) });
}
function golconda(t) {
  R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 57 });
  for (const x of [300, 700, 1220, 1620]) K.cut(() => { ctx.beginPath(); ctx.moveTo(x - 120, 880); ctx.lineTo(x - 120, 360); ctx.arc(x, 360, 120, Math.PI, Math.PI * 2); ctx.lineTo(x + 120, 880); ctx.closePath(); }, '#B39E78', { shadow: 0, edge: 0 });
  R.throne(1250, 880, { col: '#5E3B28' }); person('sultan', { x: 1250, y: 860, h: 470, t, seed: 9, prop: 'none' });
}

export function build(X, C) {
  const ch = 1, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(X.at('1.1'), X.end('1.2') + 0.2, 'sea', 0.5);
  { const st = X.at('1.1');
    sh({ id: 'P01', at: st, move: cam.drift(0.03, [700, 520]), note: 'India map: Portuguese, Dutch, English, Danish flags pop in', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }); indiaFlags(v, t, lt); } });
    for (let i = 0; i < 4; i++) X.ev(st + 0.15 + i * 0.3, 'flag', `${POSTS[i][0]} flag`); }
  { const st = X.at('1.2'), f = X.w('fast', '1.2') - st;
    sh({ id: 'P02', at: st, move: cam.snap(f, 0.12, [500, 400]), note: 'a blue route hurries in from the west, blue flag last', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }); indiaFlags(v, t, 9, { route: seg(lt, 0, f), blue: seg(lt, f - 0.1, f + 0.3) }); } });
    X.ev(st, 'route', 'blue route draws in'); X.ev(st + f, 'flag', 'blue flag arrives'); }
  X.amb(X.at('1.3'), X.end('1.5') + 0.2, 'court', 0.8);
  { const st = X.at('1.3'), co = X.w('kol', '1.3') - st;
    sh({ id: 'P03', at: st, whip: 'right', move: cam.push(0.05, [800, 520]), note: 'Versailles hall: Louis XIV and Colbert', draw(lt, d, t) { versailles(t); K.ribbon('1664', W / 2, 150, eob(seg(lt, 0.2, 0.6)), 80); K.slip('LOUIS XIV', 520, 300, eob(seg(lt, 1.2, 1.5)), -0.02, 36); K.slip('COLBERT', 880, 330, eob(seg(lt, co, co + 0.3)), 0.02, 36); } });
    X.ev(st + 0.2, 'ribbon', '1664'); X.ev(st + 1.2, 'slip', 'LOUIS XIV'); X.ev(st + co, 'slip', 'COLBERT'); }
  { const st = X.at('1.4');
    sh({ id: 'P04', at: st, move: cam.push(0.06, [1100, 560]), note: 'the charter unrolls on the map table', draw(lt, d, t) { versailles(t, { sign: seg(lt, 0.1, 0.9) }); } });
    X.ev(st + 0.1, 'card', 'charter unrolls'); }
  { const st = X.at('1.5'), fi = X.w('fifty', '1.5') - st;
    sh({ id: 'P05', at: st, move: cam.snap(fi, 0.14, [1280, 560]), note: 'seal "50 YEARS" stamps on the charter', draw(lt, d, t) { versailles(t, { sign: 1, seal: lt - fi }); } });
    X.ev(st + fi, 'seal', '50 YEARS'); }
  { const st = X.at('1.6'), ma = X.w('madagascar', '1.6') - st;
    sh({ id: 'P06', at: st, whip: 'down', move: cam.snap(ma, 0.12, [560, 700]), note: 'Madagascar: the flag droops, coins drain away', draw(lt, d, t) {
      const v = A.realMap({ view: 'madagascar', set: 'indian_ocean', t }); const [mx, my] = A.proj(v, 46.9, -19);
      A.flag(mx, my - 20, t, A.FLAGS.french, { s: 0.9, droop: seg(lt, 0.5, 2.5) });
      for (let i = 0; i < 8; i++) { const u = seg(lt, 0.4 + i * 0.25, 1.4 + i * 0.25); if (u > 0 && u < 1) A.iconAt('coin', mx + 40 + i * 6, my + 20 + u * 300, 1.2); }
      A.placeLabel('MADAGASCAR', mx, my, { dy: 120, sc: eob(seg(lt, ma - 0.2, ma + 0.1)), size: 30 });
    } });
    X.ev(st + 0.4, 'coin', 'coins drain'); X.ev(st + ma, 'slip', 'MADAGASCAR'); X.ev(st + 2.4, 'coin', 'more coins', { gain: 0.5 }); }
  { const st = X.at('1.7');
    sh({ id: 'P07', at: st, whip: 'up', move: cam.push(0.07, [420, 400]), note: 'back to India, push toward the west coast', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }); indiaFlags(v, t, 9); } });
    X.ev(st + 0.1, 'push', 'push to the west coast', { sound: false }); }
  { const st = X.at('1.8'), su = X.w('surat', '1.8') - st;
    sh({ id: 'P08', at: st, move: cam.drift(0.03), note: 'Surat harbour: a French ship; Caron on the pier; blue pin', draw(lt, d, t) {
      SC.seaPage(t, lerp(1500, 1150, eo(clamp(lt / 2))), {}); K.cut(K.P_rr(-40, 700, 520, 36, 6), P.sepia); for (const x of [20, 200, 380]) K.cut(K.P_rr(x, 700, 24, 200, 4), P.sepia);
      person('caron', { x: 300, y: 705, h: 380, t }); K.ribbon('1668', W / 2, 140, eob(seg(lt, 0.2, 0.6)), 80);
      K.slip('FRANÇOIS CARON', 300, 260, eob(seg(lt, 1.0, 1.3)), -0.02, 34); K.slip('SURAT', 1500, 260, eob(seg(lt, su, su + 0.3)), 0.02, 40);
    } });
    X.ev(st + 0.2, 'ribbon', '1668'); X.ev(st + 1.0, 'slip', 'CARON'); X.ev(st + su, 'slip', 'SURAT'); X.amb(st, X.end('1.8') + 0.2, 'sea', 0.7); }
  { const st = X.at('1.9'), ma = X.w('mar', '1.9') - st;
    sh({ id: 'P09', at: st, whip: 'right', move: cam.push(0.05, [900, 520]), note: 'Golconda court: Marcara bows', draw(lt, d, t) { golconda(t); const bow = Math.sin(clamp((lt - ma) / 1.2) * Math.PI) * 0.18; ctx.save(); ctx.translate(700, 880); ctx.rotate(bow); ctx.translate(-700, -880); person('marcara', { x: 700, y: 880, h: 560, t }); ctx.restore(); K.slip('AN ARMENIAN MERCHANT', 380, 330, eob(seg(lt, 1.4, 1.7)), 0.01, 30); K.slip('MARCARA', 380, 230, eob(seg(lt, ma, ma + 0.3)), -0.02, 38); } });
    X.ev(st + 1.4, 'slip', 'ARMENIAN MERCHANT'); X.ev(st + ma, 'slip', 'MARCARA'); X.amb(st, X.end('1.10') + 0.2, 'court', 0.8); }
  { const st = X.at('1.10'), go = X.w('golconda', '1.10') - st;
    sh({ id: 'P10', at: st, move: cam.push(0.05, [1000, 520]), note: 'the trading-rights scroll unrolls; seal', draw(lt, d, t) { golconda(t); person('marcara', { x: 700, y: 880, h: 560, t, arm: 60 }); SC.scroll(1000, 470, 360, seg(lt, 0.1, 0.8), { title: 'GOLCONDA', seal: lt - go }); } });
    X.ev(st + 0.1, 'card', 'scroll unrolls'); X.ev(st + go, 'seal', 'Golconda seal'); }
  { const st = X.at('1.11'), ms = X.w('mussoo', '1.11') - st;
    sh({ id: 'P11', at: st, whip: 'down', move: cam.drift(0.03, [700, 420]), note: 'map: route Golconda → Masulipatnam draws itself; pin', draw(lt, d, t) {
      const v = A.realMap({ view: 'deccan', t }), a = A.at(v, 'Golconda'), b = A.at(v, 'Masulipatnam');
      A.drawPolyline([a, [(a[0] + b[0]) / 2, a[1] - 20], b], seg(lt, 0.1, ms), P.royal, 7, [20, 14]);
      A.pin(...a, 'nizam'); A.placeLabel('GOLCONDA', ...a, { size: 26 }); A.pin(...b, 'french', { sc: eob(seg(lt, ms, ms + 0.3)) }); A.placeLabel('MASULIPATNAM', ...b, { dx: 140, dy: 0, size: 26, sc: eob(seg(lt, ms, ms + 0.3)) });
    } });
    X.ev(st + 0.1, 'route', 'route to Masulipatnam'); X.ev(st + ms, 'pop', 'Masulipatnam pin'); }
  const twoPins = (v, t, lt) => { for (const n of ['Surat', 'Masulipatnam']) { A.pin(...A.at(v, n), 'french', { glow: 0.5 + 0.5 * Math.sin(t * 3) }); A.placeLabel(n.toUpperCase(), ...A.at(v, n), { size: 24 }); } };
  { const st = X.at('1.12');
    sh({ id: 'P12', at: st, move: cam.drift(0.03), note: 'two blue pins glow: a foothold', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }); twoPins(v, t, lt); K.slip('A FOOTHOLD', 1450, 300, eob(seg(lt, 0.4, 0.7)), 0.02, 42); } });
    X.ev(st + 0.1, 'pop', 'pins pulse', { gain: 0.4 }); X.ev(st + 0.4, 'slip', 'A FOOTHOLD'); }
  { const st = X.at('1.13');
    sh({ id: 'P13', at: st, move: cam.push(0.08, [800, 700]), note: 'slow push on an empty patch of Coromandel coast', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }); twoPins(v, t, lt); const [x, y] = A.at(v, 'Pondicherry'); ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4); ctx.setLineDash([10, 8]); ctx.strokeStyle = P.royal; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.stroke(); ctx.restore(); } });
    X.ev(st + 0.5, 'light', 'empty circle on the coast', { sound: false }); }
}
