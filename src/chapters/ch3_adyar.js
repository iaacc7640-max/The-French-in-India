// CH3 · 1746: ONE THOUSAND VS TEN THOUSAND. La Bourdonnais takes Madras; the broken promise; Adyar; Madras handed back.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

function carnatic(t, { madras = 0, green = 0, pins = true } = {}) {
  const v = A.realMap({ view: 'carnatic', t }), md = A.at(v, 'Madras'), pd = A.at(v, 'Pondicherry');
  if (madras !== 0) A.inkBleed(...md, 150, Math.abs(madras), madras > 0 ? P.royal : P.crimson, { clipFn: A.landPath(v), seed: 8, alpha: 0.7 });
  if (pins) { A.pin(...pd, 'french', { star: true }); A.placeLabel('PONDICHERRY', ...pd, { dx: 150, dy: 0, size: 24 }); A.pin(...md, madras > 0.5 ? 'french' : 'english', { r: 16 }); A.placeLabel('MADRAS', ...md, { dx: 100, dy: 0, size: 24 }); }
  if (green > 0) { const ar = A.at(v, 'Arcot'); for (let i = 0; i < 3; i++) { const k = eio(clamp(green - i * 0.15)); A.flag(lerp(ar[0] - 120, md[0] - 80, k) - i * 50, lerp(ar[1], md[1] + 20, k) + i * 30, t, A.FLAGS.nawab, { s: 0.6, seed: i }); } }
  return v;
}
function adyarFord(t, { scatter = 0, ten = 0 } = {}) {
  K.parchment(73); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 520);
  K.cut(P_ground, '#B9A67A', { shadow: 0.4, edge: 4 });
  K.cut(() => { ctx.beginPath(); ctx.moveTo(-300, 560); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, 560 + Math.sin(x * 0.01 + t) * 8); ctx.lineTo(W + 300, 700); for (let x = W + 300; x >= -300; x -= 40) ctx.lineTo(x, 680 + Math.sin(x * 0.012 + t * 1.3) * 8); ctx.closePath(); }, P.sea, { shadow: 0.5, edge: 5 });
  R.dotArmy(420, 800, 20, 7, 18, P.royal, { t, r: 6, seed: 3 });
  if (ten > 0) R.dotArmy(1380, 360, 60, 18, 13, P.forest, { t, r: 5, seed: 9, march: clamp(ten), scatter, dir: 1 });
  K.slip('ADYAR RIVER', 960, 620, 1, -0.01, 32);
}
const P_ground = () => { ctx.beginPath(); ctx.rect(-300, 200, W + 600, H + 300); };

export function build(X, C) {
  const ch = 3, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('3.1'), wa = X.w('war', '3.1') - st;
    sh({ id: 'R01', at: st, move: cam.drift(0.03), note: 'Europe: France and Britain crowns clash; 1746', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.2, wa + 0.2) + clamp(lt - wa - 0.2)); K.ribbon('1746', W / 2, 170, eob(seg(lt, 0.1, 0.5)), 80); } });
    X.ev(st + 0.1, 'ribbon', '1746'); X.ev(st + wa + 0.2, 'whip', 'crowns clash'); }
  { const st = X.at('3.2'), la = X.w('la', '3.2') - st;
    sh({ id: 'R02', at: st, whip: 'down', move: cam.push(0.05, [1100, 520]), note: 'Mauritius harbour: La Bourdonnais on deck, flag flutters', draw(lt, d, t) { SC.seaPage(t, 1100, {}); person('labourdonnais', { x: 380, y: 700, h: 440, t }); K.cut(K.P_rr(-40, 700, 560, 36, 6), P.sepia); K.slip('LA BOURDONNAIS', 380, 200, eob(seg(lt, la, la + 0.3)), -0.02, 36); K.slip('MAURITIUS', 1500, 200, eob(seg(lt, 0.2, 0.5)), 0.02, 34); } });
    X.ev(st + 0.2, 'slip', 'MAURITIUS'); X.ev(st + la, 'slip', 'LA BOURDONNAIS'); X.amb(st, X.end('3.3') + 0.2, 'sea', 0.8); }
  { const st = X.at('3.3'), md = X.w('madras', '3.3') - st;
    sh({ id: 'R03', at: st, whip: 'up', move: cam.snap(md, 0.12, [1000, 380]), note: 'route Mauritius → Madras; blue bleeds over Fort St George', draw(lt, d, t) {
      const v = A.realMap({ view: 'ocean', set: 'south_asia', also: ['indian_ocean'], t }), mu = A.proj(v, 57.55, -20.2), m = A.at(v, 'Madras');
      const h = A.drawPolyline([mu, [mu[0] + 260, mu[1] - 330], [m[0] + 60, m[1] + 240], m], seg(lt, 0, md), P.royal, 7, [20, 14]); if (lt < md) A.flag(h[0], h[1], t, A.FLAGS.french, { s: 0.45 });
      A.pin(...mu, 'french'); A.inkBleed(...m, 60, seg(lt, md, md + 0.6), P.royal, { seed: 2, alpha: 0.75 }); A.pin(...m, lt > md ? 'french' : 'english', { r: 16 }); A.placeLabel('MADRAS', ...m, { dx: 100, dy: 0, size: 26 });
    } });
    X.ev(st, 'route', 'fleet sails'); X.ev(st + md, 'ink', 'Madras turns blue'); }
  { const st = X.at('3.4'), pr = X.w('promised', '3.4') - st;
    sh({ id: 'R04', at: st, whip: 'right', move: cam.drift(0.03), note: 'a sealed promise scroll held out toward the Nawab', draw(lt, d, t) { R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 75 }); A.flag(1500, 400, t, A.FLAGS.nawab, { s: 1.8 }); person('nawab', { x: 1380, y: 880, h: 560, t }); SC.scroll(760, 470, 380, seg(lt, pr - 0.2, pr + 0.5), { title: 'MADRAS → NAWAB' }); K.slip('NAWAB OF THE CARNATIC', 1380, 160, eob(seg(lt, 1.2, 1.5)), 0.02, 32); } });
    X.ev(st + pr - 0.2, 'card', 'promise scroll'); X.ev(st + 1.2, 'slip', 'NAWAB'); X.amb(st, X.end('3.5') + 0.2, 'court', 0.6); }
  { const st = X.at('3.5'), ke = X.w('kept', '3.5') - st;
    sh({ id: 'R05', at: st, move: cam.snap(ke, 0.14, [760, 470]), note: 'snap "kept": the scroll is pocketed', draw(lt, d, t) { R.room({ wall: '#C9B48C', floor: '#6E5A44', fl: 880, seed: 75 }); A.flag(1500, 400, t, A.FLAGS.nawab, { s: 1.8 }); person('nawab', { x: 1380, y: 880, h: 560, t }); const k = eio(seg(lt, ke, ke + 0.5)); ctx.save(); ctx.translate(lerp(0, -500, k), lerp(0, 300, k)); ctx.globalAlpha = 1 - k; SC.scroll(760, 470, 380, 1 - k * 0.6, { title: 'MADRAS → NAWAB' }); ctx.restore(); } });
    X.ev(st + ke, 'slip', 'scroll pocketed'); }
  { const st = X.at('3.6'), ar = X.w('army', '3.6') - st;
    sh({ id: 'R06', at: st, whip: 'left', move: cam.push(0.06, [960, 480]), note: 'map: the Nawab\'s green banners advance on Madras; drums', draw(lt, d, t) { carnatic(t, { madras: 1, green: seg(lt, ar - 0.3, d) }); } });
    X.ev(st + ar - 0.3, 'flag', 'green banners advance'); X.cue(st, 'drums', { dur: 3.0, gain: 0.55 }); }
  { const st = X.at('3.7'), ud = X.w('ud', '3.7') - st;
    sh({ id: 'R07', at: st, whip: 'down', move: cam.push(0.06, [600, 700]), note: 'Adyar ford: a small blue block holds the bank', draw(lt, d, t) { adyarFord(t); K.ribbon('24 OCT 1746', 600, 210, eob(seg(lt, ud, ud + 0.4)), 60); } });
    X.ev(st + ud, 'ribbon', 'Adyar date'); X.ev(st + 2.5, 'pop', 'blue block steadies', { gain: 0.4 }); X.amb(st, X.end('3.8') + 0.2, 'sea', 0.5); }
  { const st = X.at('3.8'), te = X.w('ten', '3.8') - st, wo = X.w('won', '3.8') - st;
    sh({ id: 'R08', at: st, move: cam.snap(te, 0.14, [1300, 380]), note: 'snap "ten": the green cloud; Adyar stat card; it scatters', draw(lt, d, t) { adyarFord(t, { ten: clamp((lt - te + 0.4) / 0.4), scatter: eio(seg(lt, wo, wo + 1.2)) }); A.statCard({ x: 1450, y: 760, title: 'Adyar', stats: ['~350 French + ~700 sepoys', 'vs ~10,000'], date: '24 Oct 1746', p: seg(lt, te + 0.3, te + 0.9), hi: 1, portrait: portrait('paradis') }); } });
    X.ev(st + te - 0.4, 'pop', 'green cloud'); X.ev(st + te + 0.3, 'card', 'Adyar card'); X.ev(st + wo, 'whip', 'cloud scatters', { gain: 0.5 }); }
  { const st = X.at('3.9'), le = X.w('lesson', '3.9') - st;
    sh({ id: 'R09', at: st, whip: 'up', move: cam.drift(0.03), note: 'all the Europeans\' pins tilt toward Adyar', draw(lt, d, t) { const v = A.realMap({ view: 'india', t }), ad = A.at(v, 'Adyar'); [['Bombay', 'english'], ['Calcutta', 'english'], ['Surat', 'french'], ['Masulipatnam', 'french'], ['Karaikal', 'dutch'], ['Pondicherry', 'french']].forEach(([n, s], i) => { const [x, y] = A.at(v, n); const k = eio(seg(lt, 0.3 + i * 0.12, 0.9 + i * 0.12)); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(ad[1] - y, ad[0] - x) * 0.25 * k); A.flag(0, 0, t, A.FLAGS[s], { s: 0.5, seed: i }); ctx.restore(); }); K.slip('THE SAME LESSON', 1450, 300, eob(seg(lt, le, le + 0.3)), 0.02, 40); } });
    X.ev(st + 0.3, 'flag', 'pins tilt'); X.ev(st + le, 'slip', 'THE SAME LESSON'); }
  { const st = X.at('3.10'), dr = X.w('drilled', '3.10') - st;
    sh({ id: 'R10', at: st, move: cam.push(0.05), note: 'slip "DISCIPLINE > NUMBERS" stamps', draw(lt, d, t) { K.parchment(77); R.dotArmy(560, 520, 20, 7, 18, P.royal, { t, r: 6, seed: 3 }); R.dotArmy(1380, 520, 40, 20, 12, P.forest, { t, r: 4, seed: 9 }); const k = seg(lt, dr, dr + 0.3); if (k > 0) { ctx.save(); ctx.translate(W / 2, 220); ctx.scale(lerp(1.6, 1, eo(k)), lerp(1.6, 1, eo(k))); ctx.globalAlpha = clamp(k * 3); K.slip('DISCIPLINE > NUMBERS', 0, 0, 1, -0.02, 64); ctx.restore(); } } });
    X.ev(st + dr, 'seal', 'DISCIPLINE > NUMBERS'); }
  { const st = X.at('3.11'), tr = X.w('treaty', '3.11') - st, ba = X.w('back', '3.11') - st;
    sh({ id: 'R11', at: st, whip: 'left', move: cam.drift(0.03), note: 'treaty scroll; Madras bleeds back to crimson', draw(lt, d, t) { carnatic(t, { madras: lt < ba ? 1 : -seg(lt, ba, ba + 0.8) }); SC.scroll(1500, 480, 340, seg(lt, tr - 0.2, tr + 0.5), { title: 'TREATY', seal: lt - tr - 0.6 }); } });
    X.ev(st + tr - 0.2, 'card', 'treaty'); X.ev(st + ba, 'ink', 'Madras returns to crimson'); }
  { const st = X.at('3.12');
    sh({ id: 'R12', at: st, whip: 'right', move: cam.push(0.08, [520, 380]), note: 'a silhouette at a Pondicherry window, a chess piece in hand', draw(lt, d, t) { R.room({ wall: '#C2AE88', floor: '#7A5236', fl: 860, seed: 43, wash: '#2F3550', washA: 0.55 }); R.windowPane(300, 110, 440, 560, { t, moon: true }); ctx.save(); ctx.globalAlpha = 0.92; ctx.filter = 'brightness(0.15)'; person('dupleix', { x: 520, y: 900, h: 640, t, dir: -1, arm: 70 }); ctx.restore(); ctx.filter = 'none'; } });
    X.ev(st + 0.5, 'light', 'silhouette', { sound: false }); X.ev(st + 1.6, 'chess', 'chess piece turns', { gain: 0.4 }); X.amb(st, X.end('3.12') + 0.3, 'room', 0.5); }
}
