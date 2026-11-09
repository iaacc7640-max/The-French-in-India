// CH7 · 1763: THE REAL TURNING POINT. Paris 1763; Clive's line (paraphrase, via Lyall); Plassey vs Wandiwash; Lally's fate.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
const { P } = K;

function pinsMap(t, shrink = 0, onlyRed = 0) {
  const v = A.realMap({ view: 'india', t }), at = (n) => A.at(v, n);
  A.inkBleed(...at('Calcutta'), 760, clamp(onlyRed), P.crimson, { clipFn: A.landPath(v), seed: 5, alpha: 0.5 });
  for (const n of ['Pondicherry', 'Chandernagore', 'Mahe', 'Karaikal', 'Yanam']) A.pin(...at(n), 'french', { star: n === 'Pondicherry', r: lerp(13, 6, eio(clamp(shrink))) });
  for (const n of ['Madras', 'Calcutta', 'Bombay']) A.pin(...at(n), 'english', { r: 16 });
  return v;
}

export function build(X, C) {
  const ch = 7, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  { const st = X.at('7.1'), pa = X.w('paris', '7.1') - st;
    sh({ id: 'V01', at: st, move: cam.drift(0.03), note: 'the Treaty of Paris unrolls; 1763 ribbon; seal', draw(lt, d, t) { K.parchment(95); SC.scroll(W / 2, 520, 640, seg(lt, 0.1, 0.9), { title: 'TREATY OF PARIS', seal: lt - pa - 0.5, sealText: '1763' }); K.ribbon('1763', W / 2, 160, eob(seg(lt, 0.3, 0.7)), 70); } });
    X.ev(st + 0.1, 'card', 'treaty unrolls'); X.ev(st + 0.3, 'ribbon', '1763', { sound: false }); X.ev(st + pa + 0.5, 'seal', 'treaty seal'); X.amb(st, X.end('7.2') + 0.2, 'room', 0.5); }
  { const st = X.at('7.2'), po = X.w('power', '7.2') - st;
    sh({ id: 'V02', at: st, whip: 'down', move: cam.push(0.05, [700, 600]), note: 'French pins return, then shrink to dots', draw(lt, d, t) { pinsMap(t, seg(lt, po - 0.3, po + 0.6)); K.slip('TRADING POSTS, NOT POWER', 1450, 760, eob(seg(lt, po, po + 0.3)), 0.02, 34); } });
    X.ev(st + 0.3, 'pop', 'pins return', { gain: 0.5 }); X.ev(st + po - 0.3, 'ink', 'pins shrink'); }
  { const st = X.at('7.3');
    sh({ id: 'V03', at: st, whip: 'right', move: cam.push(0.05, [600, 520]), note: 'Clive; slip "Clive (via Alfred Lyall)"', draw(lt, d, t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 880, seed: 97 }); person('clive', { x: 560, y: 900, h: 640, t }); K.slip('Clive (via Alfred Lyall)', 1300, 300, eob(seg(lt, 0.3, 0.6)), -0.02, 40); } });
    X.ev(st + 0.3, 'slip', 'paraphrase label'); }
  { const st = X.at('7.4'), pl = X.w('planned', '7.4') - st;
    sh({ id: 'V04', at: st, move: cam.push(0.05, [1100, 520]), note: 'two paper arrows swap direction (blue → crimson)', draw(lt, d, t) { R.room({ wall: '#D2C29E', floor: '#8C6B4E', fl: 880, seed: 97 }); person('clive', { x: 560, y: 900, h: 640, t, arm: 40 }); K.slip('Clive (via Alfred Lyall)', 1300, 200, 1, -0.02, 34);
      const k = eio(seg(lt, pl - 0.2, pl + 0.5)); for (const [y, col, dirA] of [[460, P.royal, 1], [640, P.crimson, -1]]) { const dir = lerp(dirA, -dirA, k); ctx.save(); ctx.translate(1300, y); ctx.scale(dir, 1); K.cut(K.P_poly([[-220, -26], [120, -26], [120, -60], [220, 0], [120, 60], [120, 26], [-220, 26]]), col, { shadow: 0.6, edge: 4 }); ctx.restore(); } } });
    X.ev(st + pl - 0.2, 'whip', 'arrows swap', { gain: 0.5 }); }
  { const st = X.at('7.5'), pl = X.w('plassey', '7.5') - st;
    sh({ id: 'V05', at: st, whip: 'down', move: cam.drift(0.03), note: 'seal PLASSEY 1757 stamps (left)', draw(lt, d, t) { K.parchment(99); A.wordSeal('PLASSEY\n1757', 620, 470, eob(seg(lt, pl, pl + 0.3)) * 1.6, clamp((lt - pl) * 4), P.crimson, 34); K.slip('THE TURNING POINT?', 620, 780, eob(seg(lt, pl + 0.8, pl + 1.1)), -0.02, 36); } });
    X.ev(st + pl, 'seal', 'PLASSEY 1757'); X.ev(st + pl + 0.8, 'slip', 'turning point?'); }
  { const st = X.at('7.6'), wa = X.w('won', '7.6') - st, ri = X.w('rival', '7.6') - st;
    sh({ id: 'V06', at: st, move: cam.snap(wa, 0.12, [1300, 470]), note: 'snap "Wandiwash": seal WANDIWASH 1760 glows; map cut-in, only crimson', draw(lt, d, t) {
      if (lt < ri) { K.parchment(99); A.wordSeal('PLASSEY\n1757', 620, 470, 1.6, 1, P.crimson, 34); const g = 0.5 + 0.5 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = 0.35 * g * seg(lt, wa, wa + 0.3); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.arc(1300, 470, 230, 0, 7); ctx.fill(); ctx.restore(); A.wordSeal('WANDIWASH\n1760', 1300, 470, eob(seg(lt, wa, wa + 0.3)) * 1.6, clamp((lt - wa) * 4), P.crimson, 30); }
      else { pinsMap(t, 1, 1); K.slip('NO EUROPEAN RIVAL', 1450, 760, eob(seg(lt, ri, ri + 0.3)), 0.02, 36); }
    } });
    X.ev(st + wa, 'seal', 'WANDIWASH 1760'); X.ev(st + ri, 'ink', 'only crimson'); }
  { const st = X.at('7.7'), bl = X.w('blame', '7.7') - st;
    sh({ id: 'V07', at: st, whip: 'right', move: cam.push(0.06, [860, 560]), note: 'push on the empty chair', draw(lt, d, t) { SC.parisRoom(t); K.slip('THE BLAME', 860, 260, eob(seg(lt, bl, bl + 0.3)), 0.02, 40); } });
    X.ev(st + bl, 'slip', 'THE BLAME'); X.amb(st, X.end('7.9') + 0.3, 'street', 0.5); }
  { const st = X.at('7.8'), pr = X.w('prisoner', '7.8') - st;
    sh({ id: 'V08', at: st, whip: 'down', move: cam.drift(0.03), note: 'a ship under guard sails left', draw(lt, d, t) { const x = lerp(1400, 800, eio(clamp(lt / d))); SC.seaPage(t, x, { guards: true, dir: -1, sky: '#B9C2C4' }); K.slip('A PRISONER', 1500, 260, eob(seg(lt, pr, pr + 0.3)), 0.02, 40); } });
    X.ev(st + pr, 'slip', 'A PRISONER'); X.amb(st, X.end('7.8') + 0.2, 'sea', 0.7); }
  { const st = X.at('7.9'), ex = X.w('executed', '7.9') - st;
    sh({ id: 'V09', at: st, whip: 'left', move: cam.snap(ex, 0.12, [1180, 560]), note: 'the Paris door from CH0; snap "executed": the candle goes out (the loop closes)', draw(lt, d, t) { SC.parisRoom(t, { out: seg(lt, ex, ex + 0.5) + (lt > ex + 0.5 ? (lt - ex - 0.5) * 0.4 : 0), seal: lt - ex - 0.4 }); K.slip('9 MAY 1766', 400, 140, eob(seg(lt, 0.3, 0.6)), -0.03, 40); } });
    X.ev(st + 0.3, 'slip', '9 MAY 1766'); X.ev(st + ex, 'candle', 'candle goes out'); X.ev(st + ex + 0.4, 'seal', 'COUPABLE'); X.cue(st + ex + 0.45, 'gavel'); }
}
