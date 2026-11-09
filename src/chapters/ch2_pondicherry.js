// CH2 · 1674: A HOME CALLED PONDICHERRY. Sher Khan Lodi's grant, Martin's town, the Dutch capture, the island safety net.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

function beach(t, stake = 0) {
  K.parchment(63); ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 700);
  for (let i = 0; i < 3; i++) { const y = 380 + i * 70; K.cut(() => { ctx.beginPath(); ctx.moveTo(-300, 700); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 40) ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 1.3 + i) * 14); ctx.lineTo(W + 300, 700); ctx.closePath(); }, i % 2 ? P.seaDark : P.sea, { shadow: 0.6, edge: 5 }); }
  K.cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, 600); ctx.bezierCurveTo(500, 560, 1300, 620, W + 300, 580); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, '#E3CFA0', { shadow: 0.6, edge: 5 });
  for (let i = 0; i < 3; i++) { const gx = ((t * 60 + i * 500) % 2300) - 200, gy = 160 + i * 50 + Math.sin(t * 3 + i) * 10; ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx - 18, gy); ctx.quadraticCurveTo(gx - 9, gy - 10 * Math.abs(Math.sin(t * 6 + i)), gx, gy); ctx.quadraticCurveTo(gx + 9, gy - 10 * Math.abs(Math.sin(t * 6 + i + 1)), gx + 18, gy); ctx.stroke(); }
  if (stake > 0) { const y = lerp(600, 760, eob(clamp(stake))); K.cut(K.P_rr(1080, y - 200, 18, 200, 4), '#7A5236', { shadow: 0.5, edge: 3 }); A.flag(1089, y - 190, t, A.FLAGS.french, { s: 0.7 }); }
}

export function build(X, C) {
  const ch = 2, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(X.at('2.1'), X.end('2.3') + 0.2, 'sea', 0.9); X.amb(X.at('2.1'), X.end('2.3') + 0.2, 'gulls', 0.8);
  { const st = X.at('2.1');
    sh({ id: 'Q01', at: st, move: cam.drift(0.03), note: 'Coromandel beach, waves, gulls; 1673', draw(lt, d, t) { beach(t); K.ribbon('1673', W / 2, 160, eob(seg(lt, 0.2, 0.6)), 80); } });
    X.ev(st + 0.2, 'ribbon', '1673'); X.ev(st + 1.0, 'flag', 'gulls', { sound: false }); }
  { const st = X.at('2.2'), bi = X.w('bee', '2.2') - st;
    sh({ id: 'Q02', at: st, move: cam.push(0.05, [800, 480]), note: 'Sher Khan Lodi and François Martin on the beach', draw(lt, d, t) { beach(t); person('sherkhan', { x: 620, y: 760, h: 520, t }); person('martin', { x: 980, y: 760, h: 500, t, dir: -1 });
      K.slip('SHER KHAN LODI', 620, 230, eob(seg(lt, 0.2, 0.5)), -0.02, 34); K.slip('FRANÇOIS MARTIN', 980, 300, eob(seg(lt, 1.5, 1.8)), 0.02, 34); K.slip('BIJAPUR', 300, 380, eob(seg(lt, bi, bi + 0.3)), -0.02, 30); } });
    X.ev(st + 0.2, 'slip', 'SHER KHAN LODI'); X.ev(st + 1.5, 'slip', 'MARTIN'); X.ev(st + bi, 'slip', 'BIJAPUR'); }
  { const st = X.at('2.3'), si = X.w('site', '2.3') - st, co = X.w('coromandel', '2.3') - st;
    sh({ id: 'Q03', at: st, move: cam.push(0.06, [1080, 600]), note: 'a stake with a blue flag goes into the sand', draw(lt, d, t) { beach(t, seg(lt, si - 0.1, si + 0.3)); person('sherkhan', { x: 620, y: 760, h: 520, t, arm: 50 }); person('martin', { x: 980, y: 760, h: 500, t, dir: -1 }); K.slip('COROMANDEL COAST', 1400, 300, eob(seg(lt, co, co + 0.3)), 0.02, 36); } });
    X.ev(st + si + 0.2, 'drop', 'stake driven'); X.ev(st + co, 'slip', 'COROMANDEL COAST'); }
  { const st = X.at('2.4');
    sh({ id: 'Q04', at: st, whip: 'down', move: cam.drift(0.03, [900, 520]), note: 'Pondicherry town grid draws itself; stat card', draw(lt, d, t) { K.parchment(65); SC.townGrid(820, 500, seg(lt, 0, 2.6)); A.statCard({ x: 1500, y: 420, title: 'Pondicherry', stats: ['French from 1674', 'capital of French India'], p: seg(lt, 1.2, 1.8), portrait: portrait('martin') }); } });
    X.ev(st, 'route', 'streets draw', { dur: 2 }); X.ev(st + 1.2, 'card', 'Pondicherry card'); }
  { const st = X.at('2.5'), he = X.w('heart', '2.5') - st;
    sh({ id: 'Q05', at: st, move: cam.push(0.05, [900, 520]), note: 'Martin with his town plan; the star pin', draw(lt, d, t) { K.parchment(65); SC.townGrid(1180, 470, 1, { cols: 7, rows: 5, cell: 90 }); person('martin', { x: 480, y: 900, h: 640, t }); A.pin(1180, 470, 'french', { star: true, sc: eob(seg(lt, he, he + 0.3)), r: 26, glow: 1 }); } });
    X.ev(st + he, 'pop', 'capital star'); X.ev(st + 0.5, 'light', 'Martin', { sound: false }); }
  { const st = X.at('2.6'), wa = X.w('wars', '2.6') - st;
    sh({ id: 'Q06', at: st, whip: 'up', move: cam.drift(0.03), era, note: 'Europe: two crowns clash', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.2, wa + 0.3) + clamp(lt - wa - 0.3), { b: 'THE DUTCH' }); } });
    X.ev(st + wa + 0.3, 'whip', 'crowns clash'); }
  { const st = X.at('2.7'), du = X.w('dutch', '2.7') - st;
    sh({ id: 'Q07', at: st, whip: 'down', move: cam.push(0.06, [820, 500]), note: 'the Dutch flag ink-bleeds over the town; low drums', draw(lt, d, t) { K.parchment(65); SC.townGrid(820, 500, 1); A.inkBleed(820, 500, 520, seg(lt, du, du + 1.0), '#D9792B', { seed: 6, alpha: 0.55 }); A.flag(820, 470, t, A.FLAGS.dutch, { s: 1.2 * eob(seg(lt, du + 0.3, du + 0.6)) }); K.ribbon('1693', 1500, 200, eob(seg(lt, 0.2, 0.6)), 80); } });
    X.ev(st + 0.2, 'ribbon', '1693'); X.ev(st + du, 'ink', 'Dutch take Pondicherry'); X.cue(st, 'drums', { dur: 2.5, gain: 0.5 }); }
  { const st = X.at('2.8'), tr = X.w('treaty', '2.8') - st;
    sh({ id: 'Q08', at: st, move: cam.drift(0.03), note: 'calendar 1693 → 1699, treaty scroll, blue bleeds back', draw(lt, d, t) { K.parchment(65); SC.townGrid(820, 500, 1); A.inkBleed(820, 500, 520, 1 - seg(lt, tr + 0.4, tr + 1.4), '#D9792B', { seed: 6, alpha: 0.55 }); A.inkBleed(820, 500, 520, seg(lt, tr + 0.8, tr + 1.8), P.royal, { seed: 3, alpha: 0.4 }); SC.calendar(1520, 420, lt < tr ? '1693' : '1699', seg(lt, tr - 0.3, tr)); } });
    X.ev(st + tr - 0.3, 'page', 'calendar flips'); X.ev(st + tr + 0.4, 'ink', 'blue bleeds back'); }
  { const st = X.at('2.9'), tw = X.w('seventeen', '2.9') - st;
    sh({ id: 'Q09', at: st, whip: 'right', move: cam.push(0.05, [960, 500]), note: 'company hall, ledgers; seal "1720s"', draw(lt, d, t) { K.hall(); R.table(960, 760, 700, { h: 120, cloth: P.royal }); R.ledger(860, 735, 1.2); R.ledger(1100, 735, 1.0); person('director', { x: 500, y: 860, h: 560, t }); A.wordSeal('1720s', 1450, 420, eob(seg(lt, tw, tw + 0.3)) * 0.95, clamp((lt - tw) * 4), P.crimson, 40); } });
    X.ev(st + tw, 'seal', '1720s'); X.ev(st + 0.3, 'light', 'hall', { sound: false }); }
  const ocean = (t, lt, { net = 0, lane = 0, pins = 0 } = {}) => {
    const v = A.realMap({ view: 'ocean', set: 'south_asia', also: ['indian_ocean'], t }), mu = A.proj(v, 57.55, -20.2), re = A.proj(v, 55.5, -21.1), pd = A.at(v, 'Pondicherry');
    if (net > 0) { ctx.save(); ctx.globalAlpha = 0.5 * clamp(net); ctx.strokeStyle = P.ink; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(300 + i * 60 * eio(clamp(net)), 600); ctx.lineTo(300 + i * 60 * eio(clamp(net)) + 200, 900); ctx.stroke(); ctx.beginPath(); ctx.moveTo(300, 600 + i * 25 * eio(clamp(net))); ctx.lineTo(1100, 620 + i * 25 * eio(clamp(net))); ctx.stroke(); } ctx.restore(); }
    if (lane > 0) A.drawPolyline([mu, [mu[0] + 200, mu[1] - 300], [pd[0] - 60, pd[1] + 200], pd], lane, P.royal, 7, [20, 14]);
    A.pin(...mu, 'french', { sc: eob(clamp(pins * 2)), r: 16 }); A.pin(...re, 'french', { sc: eob(clamp(pins * 2 - 0.5)), r: 16 }); A.pin(...pd, 'french', { star: true });
    A.placeLabel('MAURITIUS', ...mu, { dx: 110, dy: 0, sc: eob(clamp(pins * 2)), size: 24 }); A.placeLabel('RÉUNION', ...re, { dx: -100, dy: 0, sc: eob(clamp(pins * 2 - 0.5)), size: 24 }); A.placeLabel('PONDICHERRY', ...pd, { dx: 150, dy: 0, size: 24 });
    return { v, mu };
  };
  { const st = X.at('2.10'), ne = X.w('net', '2.10') - st;
    sh({ id: 'Q10', at: st, whip: 'down', move: cam.drift(0.03), note: 'a paper net unfurls across the Indian Ocean', draw(lt, d, t) { ocean(t, lt, { net: seg(lt, ne - 0.3, ne + 0.5) }); } });
    X.ev(st + ne - 0.3, 'brush', 'net unfurls'); X.amb(st, X.end('2.12') + 0.2, 'sea', 0.8); }
  { const st = X.at('2.11'), mu = X.w('mauritius', '2.11') - st, re = X.w('ray', '2.11') - st;
    sh({ id: 'Q11', at: st, move: cam.drift(0.03), note: 'Mauritius and Réunion pins; a blue sea lane draws to India', draw(lt, d, t) { ocean(t, lt, { net: 1, lane: seg(lt, re, re + 1.2), pins: seg(lt, mu - 0.2, re + 0.3) }); } });
    X.ev(st + mu - 0.2, 'pop', 'Mauritius'); X.ev(st + re, 'route', 'sea lane draws'); }
  { const st = X.at('2.12'), we = X.w('weapon', '2.12') - st;
    sh({ id: 'Q12', at: st, whip: 'right', move: cam.snap(we, 0.18, [1150, 560]), note: 'snap "weapon": French warships in Mauritius harbour', draw(lt, d, t) { SC.seaPage(t, 1150, {}); K.slip('MAURITIUS', 400, 220, eob(seg(lt, 0.2, 0.5)), -0.02, 40); } });
    X.ev(st + 0.2, 'slip', 'MAURITIUS'); X.ev(st + we, 'flag', 'warships'); }
}
