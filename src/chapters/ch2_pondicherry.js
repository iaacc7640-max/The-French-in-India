// CH2 · 1674: A HOME CALLED PONDICHERRY. The Bijapur state and Sher Khan Lodi's grant, the town growing, the Dutch capture,
// the island safety net.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person, portrait } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

const BIJ = '#8C5A3C';
/** the Bijapur Sultanate (approximate, c. 1673) inked on the map of south India; ink 0..1 */
function bijapurMap(t, ink, { view = 'bijapur' } = {}) {
  const v = A.realMap({ view, t }), b = A.at(v, 'Bijapur');
  A.inkBleed(b[0], b[1], 1500, ink, BIJ, { clipFn: () => { A.mainland(v)(); ctx.clip(); ctx.beginPath(); A.BIJAPUR.forEach(([lo, la], i) => { const q = A.proj(v, lo, la); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.closePath(); }, seed: 7, alpha: 0.6 });
  A.pin(b[0], b[1], 'maratha', { r: 13 }); A.placeLabel('BIJAPUR', b[0], b[1], { size: 24 });
  return v;
}
function ocean(t, { net = 0, lane = 0, pins = 0 } = {}) {
  const v = A.realMap({ view: 'ocean', t }), mu = A.at(v, 'Mauritius'), re = A.at(v, 'Reunion'), pd = A.at(v, 'Pondicherry');
  if (net > 0) { ctx.save(); ctx.globalAlpha = clamp(net); ctx.setLineDash([10, 10]); ctx.strokeStyle = P.royal; ctx.lineWidth = 4; for (const [a, b, bend] of [[mu, pd, -120], [re, pd, 60], [mu, re, 0]]) { ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + bend, (a[1] + b[1]) / 2, lerp(a[0], b[0], eio(clamp(net))), lerp(a[1], b[1], eio(clamp(net)))); ctx.stroke(); } ctx.restore(); }
  if (lane > 0) { const h = A.drawPolyline([mu, A.proj(v, 66, -8), A.proj(v, 76, 4), A.proj(v, 80.6, 10.5), pd], lane, P.royal, 7, [20, 14]); if (lane < 1) { ctx.save(); ctx.translate(h[0], h[1] - 4); SC.shipSmall(0.13, t, A.FLAGS.french); ctx.restore(); } }
  A.pin(...mu, 'french', { sc: eob(clamp(pins * 2)), r: 14 }); A.pin(...re, 'french', { sc: eob(clamp(pins * 2 - 0.6)), r: 14 }); A.pin(...pd, 'french', { star: true, r: 12 });
  A.placeLabel('MAURITIUS', ...mu, { dx: 120, dy: -8, sc: eob(clamp(pins * 2)), size: 24 }); A.placeLabel('RÉUNION', ...re, { dx: -30, dy: 44, sc: eob(clamp(pins * 2 - 0.6)), size: 24 }); A.placeLabel('PONDICHERRY', ...pd, { dx: 150, dy: 0, size: 24 }); A.placeLabel('MADAGASCAR', ...A.proj(v, 46.8, -19), { size: 20, dy: 0 });
  return v;
}

export function build(X, C) {
  const ch = 2, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  // 2.1 · 1673: the Bijapur state appears on the map of south India
  { const st = X.at('2.1');
    sh({ id: 'Q01', at: st, move: cam.drift(0.03, [900, 520]), note: 'south India: the Bijapur Sultanate inks in; 1673', draw(lt, d, t) { bijapurMap(t, seg(lt, 0.2, 1.8)); K.ribbon('1673', 1560, 200, eob(seg(lt, 0.2, 0.6)), 80); } });
    X.ev(st + 0.2, 'ribbon', '1673'); X.ev(st + 0.3, 'ink', 'Bijapur state inks in'); }
  // 2.2 · Sher Khan Lodi, a governor under the Sultan of Bijapur
  { const st = X.at('2.2'), sk = X.w('shayr', '2.2') - st, go = X.w('governor', '2.2') - st, bi = X.w('bee', '2.2') - st;
    sh({ id: 'Q02', at: st, move: cam.push(0.05, [1000, 600]), note: 'Bijapur Sultanate labelled; Sher Khan Lodi, its governor, at Valikondapuram', draw(lt, d, t) {
      const v = bijapurMap(t, 1), vk = A.at(v, 'Valikondapuram');
      A.placeLabel('BIJAPUR SULTANATE', ...A.proj(v, 76.3, 14.6), { size: 30, dy: 0, sc: eob(seg(lt, bi - 0.2, bi + 0.1)) });
      A.pin(vk[0], vk[1], 'maratha', { r: 12, sc: eob(seg(lt, sk, sk + 0.3)) });
      A.statCard({ x: 1480, y: 520, from: vk, title: 'Sher Khan Lodi', stats: ['governor under Bijapur'], p: seg(lt, sk, sk + 0.6), portrait: portrait('sherkhan') });
      K.ribbon('1673', 1560, 200, 1, 80);
    } });
    X.ev(st + sk, 'card', 'Sher Khan Lodi card'); X.ev(st + go + 0.6, 'pop', 'governor pin', { gain: 0.4 }); X.ev(st + bi - 0.2, 'slip', 'BIJAPUR SULTANATE'); }
  // 2.3 · granted them a site on the Coromandel coast: the grant travels to the coast, a French flag is planted
  { const st = X.at('2.3'), si = X.w('site', '2.3') - st, co = X.w('coromandel', '2.3') - st;
    sh({ id: 'Q03', at: st, whip: 'right', move: cam.snap(si, 0.1, [1000, 600]), note: 'the grant travels from the governor to the coast; a French flag marks the site', draw(lt, d, t) {
      const v = bijapurMap(t, 1, { view: 'carnatic' }), vk = A.at(v, 'Valikondapuram'), pd = A.at(v, 'Pondicherry'), u = eio(seg(lt, 0.1, si));
      A.pin(vk[0], vk[1], 'maratha', { r: 14 }); A.placeLabel('SHER KHAN LODI', vk[0], vk[1], { size: 22, dy: 40 });
      A.drawPolyline([vk, [(vk[0] + pd[0]) / 2, vk[1] - 120], pd], u, P.ink, 5, [14, 12]);
      if (u < 1) { ctx.save(); ctx.translate(lerp(vk[0], pd[0], u), lerp(vk[1], pd[1], u) - Math.sin(u * Math.PI) * 90); ctx.scale(0.16, 0.16); SC.scroll(0, 0, 380, 1, { title: 'GRANT' }); ctx.restore(); }
      A.pin(pd[0], pd[1], 'french', { r: 16, sc: eob(seg(lt, si, si + 0.3)), glow: 1 }); A.flag(pd[0], pd[1], t, A.FLAGS.french, { s: 1.1, raise: seg(lt, si, si + 0.6) });
      A.placeLabel('THE SITE', pd[0], pd[1], { dx: 130, dy: 0, size: 26, sc: eob(seg(lt, si, si + 0.3)) }); A.placeLabel('COROMANDEL COAST', ...A.proj(v, 80.45, 12.6), { dx: 170, dy: 0, size: 26, sc: eob(seg(lt, co, co + 0.3)) });
    } });
    X.ev(st + 0.1, 'route', 'the grant travels to the coast'); X.ev(st + si, 'flag', 'French flag planted at the site'); X.ev(st + co, 'slip', 'COROMANDEL COAST'); X.amb(st, X.end('2.3') + 0.2, 'sea', 0.6); }
  // 2.4 · Pondicherry grew there: the town builds itself along the shore
  X.amb(X.at('2.4'), X.end('2.5') + 0.2, 'sea', 0.9); X.amb(X.at('2.4'), X.end('2.5') + 0.2, 'gulls', 0.8);
  { const st = X.at('2.4'), gr = X.w('grew', '2.4') - st, yr = X.w('sixteen', '2.4') - st;
    sh({ id: 'Q04', at: st, whip: 'down', move: cam.push(0.05, [960, 560]), note: 'Pondicherry grows on the shore: first huts, a fort, more houses', draw(lt, d, t) {
      SC.townScene(t, lerp(0.04, 0.62, eo(seg(lt, gr - 0.3, d + 0.2))), { ships: [[1500, A.FLAGS.french, -1]] });
      K.slip('PONDICHERRY', 420, 250, eob(seg(lt, 0.2, 0.5)), -0.02, 44); K.ribbon('1674', 1500, 240, eob(seg(lt, yr, yr + 0.4)), 80);
    } });
    X.ev(st + 0.2, 'slip', 'PONDICHERRY'); for (let i = 0; i < 4; i++) X.ev(st + gr + i * 0.5, 'drop', 'houses go up', { gain: 0.35 }); X.ev(st + yr, 'ribbon', '1674'); }
  // 2.5 · François Martin turned it into the heart of French India: the town fills out; the capital star
  { const st = X.at('2.5'), ma = X.w('martin', '2.5') - st, he = X.w('heart', '2.5') - st;
    sh({ id: 'Q05', at: st, move: cam.push(0.05, [960, 520]), note: 'Martin in front of the finished town; card: capital of French India', draw(lt, d, t) {
      SC.townScene(t, lerp(0.62, 1, eo(seg(lt, 0, he + 0.4))), { ships: [[1500, A.FLAGS.french, -1], [1790, A.FLAGS.french, -1]] });
      person('martin', { x: 250, y: 700, h: 430, t, arm: 30 }); K.slip('FRANÇOIS MARTIN', 300, 220, eob(seg(lt, ma, ma + 0.3)), -0.02, 34);
      A.pin(960, 420, 'french', { star: true, sc: eob(seg(lt, he, he + 0.3)), r: 24, glow: 1 });
      A.statCard({ x: 1500, y: 300, title: 'Pondicherry', stats: ['French from 1674', 'capital of French India'], p: seg(lt, he + 0.1, he + 0.7), portrait: portrait('martin') });
    } });
    X.ev(st + ma, 'slip', 'FRANÇOIS MARTIN'); X.ev(st + 1.4, 'drop', 'more houses', { gain: 0.35 }); X.ev(st + he, 'pop', 'capital star'); X.ev(st + he + 0.1, 'card', 'Pondicherry card'); }
  { const st = X.at('2.6'), wa = X.w('wars', '2.6') - st;
    sh({ id: 'Q06', at: st, whip: 'up', move: cam.drift(0.03), note: 'Europe: the crowns of France and the Dutch clash', draw(lt, d, t) { SC.europeClash(t, seg(lt, 0.2, wa + 0.3) + clamp(lt - wa - 0.3), { b: 'THE DUTCH' }); } });
    X.ev(st + 0.2, 'whip', 'crowns close in', { gain: 0.4 }); X.ev(st + wa + 0.3, 'drop', 'crowns clash'); }
  // 2.7 · the Dutch captured Pondicherry: Dutch ships arrive; the French flag comes down, the Dutch flag goes up
  { const st = X.at('2.7'), du = X.w('dutch', '2.7') - st, ca = X.w('captured', '2.7') - st;
    sh({ id: 'Q07', at: st, whip: 'down', move: cam.push(0.06, [960, 520]), note: 'Dutch ships arrive at Pondicherry; the French flag comes down, the Dutch flag goes up', draw(lt, d, t) {
      const k = eo(seg(lt, 0.2, ca));
      SC.townScene(t, 1, { flagRaise: 1 - seg(lt, ca, ca + 0.7), flag2: A.FLAGS.dutch, flag2Raise: seg(lt, ca + 0.3, ca + 1.0), ships: [[lerp(2100, 1420, k), A.FLAGS.dutch, -1], [lerp(2400, 1700, k), A.FLAGS.dutch, -1], [lerp(-300, 330, k), A.FLAGS.dutch, 1]] });
      K.ribbon('1693', 1500, 240, eob(seg(lt, 0.2, 0.6)), 80); K.slip('THE DUTCH', 420, 250, eob(seg(lt, du, du + 0.3)), -0.02, 44);
    } });
    X.ev(st + 0.2, 'ribbon', '1693'); X.ev(st + du, 'slip', 'THE DUTCH'); X.ev(st + ca, 'flag', 'French flag comes down, Dutch flag goes up'); X.cue(st, 'drums', { dur: 2.5, gain: 0.5 }); X.amb(st, X.end('2.8') + 0.2, 'sea', 0.8); }
  // 2.8 · a peace treaty in Europe got it back: the flags swap again; 1693 → 1699
  { const st = X.at('2.8'), tr = X.w('treaty', '2.8') - st, ba = X.w('back', '2.8') - st;
    sh({ id: 'Q08', at: st, move: cam.drift(0.03, [960, 520]), note: 'the treaty: the Dutch flag comes down, the French flag goes back up; 1693 → 1699', draw(lt, d, t) {
      SC.townScene(t, 1, { flagRaise: seg(lt, ba - 0.2, ba + 0.5), flag2: A.FLAGS.dutch, flag2Raise: 1 - seg(lt, tr + 0.3, ba), ships: [[lerp(1420, 2300, eio(seg(lt, tr, d))), A.FLAGS.dutch, 1]] });
      SC.calendar(1560, 330, lt < tr ? '1693' : '1699', seg(lt, tr - 0.3, tr)); K.slip('TREATY OF RYSWICK', 420, 250, eob(seg(lt, tr, tr + 0.3)), -0.02, 36);
    } });
    X.ev(st + tr - 0.3, 'page', 'calendar flips to 1699'); X.ev(st + tr, 'slip', 'TREATY OF RYSWICK'); X.ev(st + ba - 0.2, 'flag', 'French flag back up'); }
  { const st = X.at('2.9'), re = X.w('rebuilt', '2.9') - st, tw = X.w('seventeen', '2.9') - st;
    sh({ id: 'Q09', at: st, whip: 'right', move: cam.push(0.05, [960, 500]), note: 'the company hall in France: ledgers; seal "1720s"', draw(lt, d, t) { K.hall(); R.table(960, 760, 700, { h: 120, cloth: P.royal }); R.ledger(860, 735, 1.2); R.ledger(1100, 735, 1.0); person('director', { x: 500, y: 860, h: 560, t, arm: 20 + 20 * Math.sin(lt * 3) }); K.slip('THE COMPANY, REBUILT', 1400, 250, eob(seg(lt, re, re + 0.3)), 0.02, 36); A.wordSeal('1720s', 1450, 470, eob(seg(lt, tw, tw + 0.3)) * 0.95, clamp((lt - tw) * 4), P.crimson, 40); } });
    X.ev(st + 0.3, 'route', 'quills', { dur: 1.2 }); X.ev(st + re, 'slip', 'THE COMPANY, REBUILT'); X.ev(st + tw, 'seal', '1720s'); }
  { const st = X.at('2.10'), ne = X.w('net', '2.10') - st;
    sh({ id: 'Q10', at: st, whip: 'down', move: cam.drift(0.03), note: 'the Indian Ocean: dashed links (the safety net) reach from the islands to Pondicherry', draw(lt, d, t) { ocean(t, { net: seg(lt, ne - 0.5, ne + 0.4), pins: 0.3 }); } });
    X.ev(st + ne - 0.5, 'brush', 'the safety net links draw'); X.amb(st, X.end('2.12') + 0.2, 'sea', 0.8); }
  { const st = X.at('2.11'), mu = X.w('mauritius', '2.11') - st, re = X.w('ray', '2.11') - st;
    sh({ id: 'Q11', at: st, move: cam.push(0.05, [820, 760]), note: 'Mauritius and Réunion named; a sea lane with a ship draws to India', draw(lt, d, t) { ocean(t, { net: 1, lane: seg(lt, 0.3, d - 0.2), pins: seg(lt, mu - 0.2, re + 0.3) }); K.slip('FRENCH ISLANDS', 1480, 620, eob(seg(lt, 0.2, 0.5)), 0.02, 40); } });
    X.ev(st + 0.2, 'slip', 'FRENCH ISLANDS'); X.ev(st + 0.3, 'route', 'sea lane draws'); X.ev(st + mu - 0.2, 'pop', 'Mauritius'); X.ev(st + re - 0.1, 'pop', 'Réunion'); }
  { const st = X.at('2.12'), we = X.w('weapon', '2.12') - st;
    sh({ id: 'Q12', at: st, whip: 'right', move: cam.snap(we, 0.14, [1000, 560]), note: 'snap "weapon": a French war fleet in Mauritius harbour', draw(lt, d, t) { SC.seaPage(t, 1150, {}); for (const [sx, sy, ss] of [[520, 600, 0.55], [1650, 590, 0.5], [300, 720, 0.4]]) { ctx.save(); ctx.translate(sx, sy + Math.sin(t * 2 + sx) * 6); SC.shipSmall(ss, t, A.FLAGS.french); ctx.restore(); } K.slip('MAURITIUS', 400, 220, eob(seg(lt, 0.2, 0.5)), -0.02, 40); K.slip('A WAR FLEET', 1500, 240, eob(seg(lt, we, we + 0.3)), 0.02, 40); } });
    X.ev(st + 0.2, 'slip', 'MAURITIUS'); X.ev(st + we, 'flag', 'the war fleet'); X.ev(st + we + 0.1, 'slip', 'A WAR FLEET', { sound: false }); }
}
