// CH7 · 1763: THE REAL TURNING POINT. Paris 1763; Clive's line (paraphrase, via Lyall); Plassey vs Wandiwash; Lally's fate.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

const FR = ['Pondicherry', 'Chandernagore', 'Mahe', 'Karaikal', 'Yanam'], EN = ['Madras', 'Calcutta', 'Bombay'];
/** the whole subcontinent: French posts (shrink 0..1 makes them tiny), English posts, English red spreading (red 0..1) */
function postsMap(t, { shrink = 0, red = 0, frP = 1 } = {}) {
  const v = A.realMap({ view: 'india', t }), at = (n) => A.at(v, n);
  if (red > 0) A.inkBleed(...at('Calcutta'), 1100, red, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.5 });
  for (const n of FR) A.pin(...at(n), 'french', { star: n === 'Pondicherry', r: lerp(11, 5, eio(clamp(shrink))), sc: eob(clamp(frP)) });
  for (const n of EN) A.pin(...at(n), 'english', { r: 12 });
  return v;
}

export function build(X, C) {
  const ch = 7, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('7.1'), pa = X.w('paris', '7.1') - st;
    sh({ id: 'V01', at: st, move: cam.push(0.04), note: 'the Treaty of Paris is signed and sealed between a French and an English envoy; 1763', draw(lt, d, t) { R.room({ wall: '#CDB892', floor: '#7A5236', fl: 860, seed: 95 }); A.flag(420, 420, t, A.FLAGS.french, { s: 1.5 }); A.flag(1500, 420, t, A.FLAGS.english, { s: 1.5 }); R.table(960, 720, 700, { h: 140, cloth: '#3D5A80' }); person('director', { x: 600, y: 880, h: 540, t, arm: 50 }); person('coote', { x: 1320, y: 880, h: 540, t, dir: -1, arm: 50 }); SC.scroll(960, 520, 420, seg(lt, 0.1, 0.9), { title: 'TREATY OF PARIS', seal: lt - pa - 0.5, sealText: '1763' }); K.ribbon('1763', 960, 210, eob(seg(lt, pa + 0.3, pa + 0.7)), 64); } });
    X.ev(st + 0.1, 'card', 'the treaty unrolls'); X.ev(st + pa + 0.3, 'ribbon', '1763', { sound: false }); X.ev(st + pa + 0.5, 'seal', 'treaty seal'); X.amb(st, X.end('7.1') + 0.2, 'room', 0.5); }
  { const st = X.at('7.2'), po = X.w('posts', '7.2') - st, pw = X.w('power', '7.2') - st;
    sh({ id: 'V02', at: st, whip: 'down', move: cam.push(0.05, [800, 560]), note: 'the whole subcontinent: the French posts come back, then shrink to dots', draw(lt, d, t) { postsMap(t, { frP: seg(lt, 0.2, po), shrink: seg(lt, pw - 0.4, pw + 0.5) }); K.slip('TRADING POSTS BACK', 1420, 420, eob(seg(lt, po, po + 0.3)), 0.02, 36); K.slip('BUT NOT POWER', 1420, 540, eob(seg(lt, pw, pw + 0.3)), -0.02, 40); } });
    X.ev(st + 0.2, 'pop', 'the French posts return', { gain: 0.5 }); X.ev(st + po, 'slip', 'TRADING POSTS BACK'); X.ev(st + pw - 0.4, 'ink', 'the posts shrink'); X.ev(st + pw, 'slip', 'BUT NOT POWER', { sound: false }); }
  { const st = X.at('7.3'), en = X.w('english', '7.3') - st;
    sh({ id: 'V03', at: st, whip: 'right', move: cam.push(0.05, [700, 520]), note: 'Clive; his line, labelled "Clive (via Alfred Lyall)"; the English arrow strikes at the French', draw(lt, d, t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 880, seed: 97 }); person('clive', { x: 480, y: 900, h: 640, t, arm: 40 }); K.slip('Clive (via Alfred Lyall)', 520, 190, eob(seg(lt, 0.3, 0.6)), -0.02, 36); const k = eio(seg(lt, en, en + 0.9)); A.flag(1700, 640, t, A.FLAGS.french, { s: 1.4 }); A.flag(900, 640, t, A.FLAGS.english, { s: 1.4 }); ctx.save(); ctx.translate(lerp(1000, 1300, k), 500); K.cut(K.P_poly([[-180, -26], [120, -26], [120, -60], [220, 0], [120, 60], [120, 26], [-180, 26]]), P.crimson, { shadow: 0.6, edge: 4 }); ctx.restore(); K.slip('WHAT ENGLAND DID', 1300, 360, eob(seg(lt, en + 0.4, en + 0.7)), 0.02, 34); } });
    X.ev(st + 0.3, 'slip', 'paraphrase label'); X.ev(st + en, 'whip', 'the English arrow strikes', { gain: 0.5 }); X.ev(st + en + 0.4, 'slip', 'WHAT ENGLAND DID', { sound: false }); X.amb(st, X.end('7.4') + 0.2, 'room', 0.5); }
  { const st = X.at('7.4'), pl = X.w('planned', '7.4') - st;
    sh({ id: 'V04', at: st, move: cam.push(0.05, [1200, 520]), note: 'the same arrow in French blue, pointing the other way, as a ghost: what France had planned', draw(lt, d, t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 880, seed: 97 }); person('clive', { x: 480, y: 900, h: 640, t, arm: 40 }); K.slip('Clive (via Alfred Lyall)', 520, 190, 1, -0.02, 36); A.flag(1700, 640, t, A.FLAGS.french, { s: 1.4 }); A.flag(900, 640, t, A.FLAGS.english, { s: 1.4 }); ctx.save(); ctx.translate(1300, 500); K.cut(K.P_poly([[-180, -26], [120, -26], [120, -60], [220, 0], [120, 60], [120, 26], [-180, 26]]), P.crimson, { shadow: 0.6, edge: 4 }); ctx.restore(); K.slip('WHAT ENGLAND DID', 1300, 360, 1, 0.02, 34);
      const k = eio(seg(lt, pl - 0.5, pl + 0.3)); ctx.save(); ctx.globalAlpha = 0.55 * k; ctx.setLineDash([14, 10]); ctx.translate(lerp(1600, 1300, k), 760); ctx.scale(-1, 1); K.cut(K.P_poly([[-180, -26], [120, -26], [120, -60], [220, 0], [120, 60], [120, 26], [-180, 26]]), P.royal, { shadow: 0.3, edge: 4 }); ctx.restore(); K.slip('WHAT FRANCE HAD PLANNED', 1300, 880 - 40, eob(seg(lt, pl, pl + 0.3)), -0.02, 30); } });
    X.ev(st + pl - 0.5, 'whip', 'the French plan, in reverse', { gain: 0.5 }); X.ev(st + pl, 'slip', 'WHAT FRANCE HAD PLANNED'); }
  // 7.5-7.6 · Plassey vs Wandiwash, stamped where they happened on the whole map
  const seals = (t, lt, { pl = 1, wa = 0, glow = 0, red = 0 } = {}) => { const v = postsMap(t, { shrink: 1, red }), p1 = A.at(v, 'Plassey'), p2 = A.at(v, 'Wandiwash'); if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.4 * glow * (0.6 + 0.4 * Math.sin(t * 6)); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.arc(p2[0] - 170, p2[1], 150, 0, 7); ctx.fill(); ctx.restore(); }
    if (pl > 0) { A.drawPolyline([p1, [p1[0] + 160, p1[1] + 40]], 1, P.ink, 3, [6, 6]); A.wordSeal('PLASSEY\n1757', p1[0] + 250, p1[1] + 60, eob(clamp(pl)) * 1.05, clamp(pl * 4), P.crimson, 30); }
    if (wa > 0) { A.drawPolyline([p2, [p2[0] - 80, p2[1]]], 1, P.ink, 3, [6, 6]); A.wordSeal('WANDIWASH\n1760', p2[0] - 170, p2[1], eob(clamp(wa)) * 1.05, clamp(wa * 4), P.crimson, 26); } return v; };
  { const st = X.at('7.5'), pl = X.w('plassey', '7.5') - st, tu = X.w('turning', '7.5') - st;
    sh({ id: 'V05', at: st, whip: 'down', move: cam.push(0.05, [1000, 360]), note: 'the whole map: the PLASSEY 1757 seal stamps in Bengal', draw(lt, d, t) { seals(t, lt, { pl: seg(lt, pl, pl + 0.3) }); K.slip('THE TURNING POINT?', 1500, 620, eob(seg(lt, tu, tu + 0.3)), 0.02, 36); } });
    X.ev(st + pl, 'seal', 'PLASSEY 1757'); X.ev(st + tu, 'slip', 'the turning point?'); X.ev(st + tu + 1.6, 'light', 'the seal gleams', { sound: false }); }
  { const st = X.at('7.6'), wa = X.w('won', '7.6') - st, ri = X.w('rival', '7.6') - st;
    sh({ id: 'V06', at: st, move: cam.snap(wa, 0.1, [700, 640]), note: 'snap "Wandiwash": its seal stamps in the south and glows; English red spreads: no European rival', draw(lt, d, t) { seals(t, lt, { wa: seg(lt, wa, wa + 0.3), glow: seg(lt, wa, wa + 0.4), red: seg(lt, ri - 0.6, ri + 0.8) }); K.slip('NO EUROPEAN RIVAL', 1500, 620, eob(seg(lt, ri, ri + 0.3)), 0.02, 36); } });
    X.ev(st + wa, 'seal', 'WANDIWASH 1760'); X.ev(st + ri - 0.6, 'ink', 'English red spreads'); X.ev(st + ri, 'slip', 'NO EUROPEAN RIVAL', { sound: false }); }
  { const st = X.at('7.7'), bl = X.w('blame', '7.7') - st, on = X.w('one', '7.7') - st;
    sh({ id: 'V07', at: st, whip: 'right', move: cam.push(0.06, [800, 540]), note: 'Paris: Lally stands alone in the room; THE BLAME', draw(lt, d, t) { SC.parisRoom(t, { lally: 1 }); K.slip('THE BLAME', 1100, 200, eob(seg(lt, bl, bl + 0.3)), 0.02, 40); K.slip('LALLY', 760, 190, eob(seg(lt, on, on + 0.3)), -0.02, 40); } });
    X.ev(st + bl, 'slip', 'THE BLAME'); X.ev(st + on, 'slip', 'LALLY'); X.amb(st, X.end('7.7') + 0.3, 'street', 0.5); }
  { const st = X.at('7.8'), pr = X.w('prisoner', '7.8') - st;
    sh({ id: 'V08', at: st, whip: 'down', move: cam.drift(0.03), note: 'a ship carries Lally home under guard', draw(lt, d, t) { const x = lerp(1400, 800, eio(clamp(lt / d))); SC.seaPage(t, x, { guards: true, dir: -1, sky: '#B9C2C4', flagCols: A.FLAGS.english }); K.slip('A PRISONER', 1500, 260, eob(seg(lt, pr, pr + 0.3)), 0.02, 40); } });
    X.ev(st + 0.2, 'flag', 'the prison ship sails'); X.ev(st + pr, 'slip', 'A PRISONER'); X.amb(st, X.end('7.8') + 0.2, 'sea', 0.7); }
  { const st = X.at('7.9'), ex = X.w('executed', '7.9') - st;
    sh({ id: 'V09', at: st, whip: 'left', move: cam.snap(ex, 0.1, [1000, 560]), note: 'the Paris room from the cold open; snap "executed": Lally is gone, the candle goes out (the loop closes)', draw(lt, d, t) { SC.parisRoom(t, { lally: 1 - seg(lt, ex, ex + 0.5), out: seg(lt, ex + 0.2, ex + 0.7) + (lt > ex + 0.7 ? (lt - ex - 0.7) * 0.4 : 0), seal: lt - ex - 0.6 }); K.ribbon('9 MAY 1766', 1100, 190, eob(seg(lt, 0.3, 0.7)), 60); } });
    X.ev(st + 0.3, 'ribbon', '9 MAY 1766'); X.ev(st + ex, 'candle', 'Lally is gone; the candle goes out'); X.ev(st + ex + 0.6, 'seal', 'GUILTY'); X.cue(st + ex + 0.65, 'gavel'); X.amb(st, X.end('7.10') + 0.3, 'street', 0.5); }
  { const st = X.at('7.10'), fa = X.w('fault', '7.10') - st;
    sh({ id: 'V10', at: st, move: cam.push(0.06, [860, 560]), note: 'the empty chair and the coat; HIS FAULT?', draw(lt, d, t) { SC.parisRoom(t, { out: 2, seal: 1 }); K.slip('HIS FAULT?', 860, 260, eob(seg(lt, fa - 0.2, fa + 0.1)), 0.02, 46); } });
    X.ev(st + 0.3, 'light', 'the empty chair'); X.ev(st + fa - 0.2, 'slip', 'HIS FAULT?'); }
}
