// CH8 · 1954: WHAT REALLY DECIDED INDIA — the takeaway. The French towns join India; the idea vs the money.
import { ctx, W, H, clamp, seg, eo, eob, eio, lerp } from '../core/lib.js';
import * as K from '../core/kit.js';
import * as A from '../core/atlas.js';
import * as R from '../core/props.js';
import * as SC from '../core/scenes.js';
import { person } from '../core/cast.js';
import { cam } from '../core/motion.js';
import { boardOver, pieces } from './ch4_kingmaker.js';
import { supplyMap } from './ch6_wandiwash.js';
const { P } = K;

const TOWNS = ['Chandernagore', 'Pondicherry', 'Karaikal', 'Mahe', 'Yanam'];
function townsMap(t, joined) {   // joined(i) 0..1 per town: the blue dot ink-bleeds into the tricolour
  const v = A.realMap({ view: 'india', t });
  TOWNS.forEach((n, i) => { const [x, y] = A.at(v, n), j = joined(i); if (j < 1) A.pin(x, y, 'french', { r: 14, star: n === 'Pondicherry', sc: 1 - eio(clamp(j * 1.5)) * 0.4 }); if (j > 0) { ctx.save(); ctx.globalAlpha = clamp(j * 2); SC.tricolourDot(x, y, 20 * eob(clamp(j))); ctx.restore(); } A.placeLabel(n.toUpperCase(), x, y, { dx: n === 'Mahe' ? -80 : 130, dy: n === 'Karaikal' ? 16 : 0, size: 22 }); });
  return v;
}

export function build(X, C) {
  const ch = 8, era = C.era, sh = (o) => X.add({ chapter: ch, era, ...o });
  X.amb(C.start, X.end('8.4') + 0.3, 'market', 0.7);
  { const st = X.at('8.1'), le = X.w('left', '8.1') - st;
    sh({ id: 'W01', at: st, move: cam.drift(0.03), note: 'five tiny blue dots remain on the map', draw(lt, d, t) { townsMap(t, () => 0); K.slip('NEVER FULLY LEFT', 1460, 760, eob(seg(lt, le, le + 0.3)), 0.02, 36); } });
    X.ev(st + 0.3, 'pop', 'dots pulse', { gain: 0.4 }); X.ev(st + le, 'slip', 'NEVER FULLY LEFT'); }
  { const st = X.at('8.2'), ni = X.w('nineteen', '8.2') - st;
    sh({ id: 'W02', at: st, move: cam.push(0.06, [1100, 300]), note: 'Chandernagore ink-bleeds into the tricolour; 1950', draw(lt, d, t) { townsMap(t, (i) => (i === 0 ? seg(lt, ni - 0.3, ni + 0.5) : 0)); K.ribbon('1950', 1500, 520, eob(seg(lt, ni, ni + 0.4)), 60); } });
    X.ev(st + ni - 0.3, 'ink', 'Chandernagore joins India'); X.ev(st + ni, 'ribbon', '1950', { sound: false }); }
  { const st = X.at('8.3'), fo = X.w('followed', '8.3') - st;
    sh({ id: 'W03', at: st, move: cam.push(0.05, [800, 620]), note: 'the four other towns bleed into the tricolour one by one; 1954', draw(lt, d, t) { townsMap(t, (i) => (i === 0 ? 1 : seg(lt, fo + (i - 1) * 0.35, fo + (i - 1) * 0.35 + 0.6))); K.ribbon('1954', 1500, 520, eob(seg(lt, fo + 0.8, fo + 1.2)), 60); } });
    for (let i = 1; i < 5; i++) X.ev(st + fo + (i - 1) * 0.35, 'ink', `${TOWNS[i]} joins`, { gain: 0.6 }); }
  { const st = X.at('8.4'), vo = X.w('vote', '8.4') - st;
    sh({ id: 'W04', at: st, whip: 'right', move: cam.push(0.05, [W / 2, 520]), note: 'Kizhur: a ballot drops; stat card', draw(lt, d, t) { R.room({ wall: '#D8C9A4', floor: '#8C6B4E', fl: 860, seed: 101 }); SC.ballotBox(760, 840, seg(lt, vo - 0.4, vo + 0.2)); A.statCard({ x: 1380, y: 420, title: 'Kizhur vote', stats: ['French towns join India'], date: '18 Oct 1954', p: seg(lt, vo + 0.2, vo + 0.8) }); } });
    X.ev(st + vo + 0.2, 'ballot', 'ballot drops'); X.ev(st + vo + 0.4, 'card', 'Kizhur card'); }
  { const st = X.at('8.5'), de = X.w('decided', '8.5') - st;
    sh({ id: 'W05', at: st, whip: 'left', move: cam.push(0.05, [W / 2, 470]), note: 'back to the chessboard', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { fall: 1, fallChanda: 1, crown: false }); K.slip('WHAT DECIDED INDIA?', 1560, 820, eob(seg(lt, de, de + 0.3)), 0.02, 32); } });
    X.ev(st + de, 'slip', 'the question'); }
  { const st = X.at('8.6'), sm = X.w('smartest', '8.6') - st;
    sh({ id: 'W06', at: st, move: cam.push(0.06, [700, 400]), note: 'Dupleix\'s crown-on-a-king move replays in blue', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { crown: lt > sm + 0.6, backP: { french: seg(lt, 0.1, 0.8), english: 0 } }); const [kx, ky] = sq(1.5, 2.2); if (lt > sm - 0.2 && lt < sm + 0.6) { const y = lerp(ky - 420, ky - 160, eio(seg(lt, sm - 0.2, sm + 0.6))); SC.crown(kx, y, 0.35); } } });
    X.ev(st + 0.1, 'chess', 'blue pieces return'); X.ev(st + sm + 0.6, 'chess', 'crown lands'); }
  { const st = X.at('8.7'), ar = X.w('around', '8.7') - st;
    sh({ id: 'W07', at: st, move: cam.drift(0.03, [W / 2, 470]), note: 'blue pieces settle behind the kings', draw(lt, d, t) { const sq = boardOver(t); pieces(sq, lt, { crown: true, backP: { french: 1, english: 0 } }); K.slip('THROUGH THE THRONES', 1560, 820, eob(seg(lt, ar, ar + 0.3)), 0.02, 32); } });
    X.ev(st + 0.2, 'chess', 'pieces settle', { gain: 0.5 }); X.ev(st + ar, 'slip', 'through the thrones'); }
  const split = (t, lt, { left = 1, right = 1, pulse = 0 } = {}) => {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip(); ctx.translate(-W / 4, 0);
    R.room({ wall: '#B9A98C', floor: '#5E4A36', fl: 860, seed: 81 }); R.table(960, 700, 760, { h: 160, cloth: '#2A2421' }); for (const [x, d] of [[720, 1], [1200, -1]]) person('director', { x, y: 880, h: 520, t, dir: d, seed: x }); R.ledger(960, 680, 1.3);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip(); ctx.translate(W / 4 - 260, 0); supplyMap(t, { red: 1, blue: 0 }); ctx.restore();
    ctx.fillStyle = P.ink; ctx.fillRect(W / 2 - 6, 0, 12, H);
    K.slip('ORDERS FROM PARIS', W / 4, 200, left, -0.02, 34); K.slip('PAYS FOR ITSELF', W * 3 / 4, 200, right, 0.02, 34);
  };
  { const st = X.at('8.8'), mo = X.w('money', '8.8') - st;
    sh({ id: 'W08', at: st, whip: 'down', move: cam.drift(0.02), note: 'split frame: the Paris ledger vs the supply line', draw(lt, d, t) { split(t, lt, { left: 0, right: 0 }); K.slip('IDEAS NEED MONEY', W / 2, 520, eob(seg(lt, mo, mo + 0.3)), -0.02, 44); } });
    X.ev(st + 0.1, 'split', 'split opens'); X.ev(st + mo, 'slip', 'IDEAS NEED MONEY'); }
  { const st = X.at('8.9'), pa = X.w('paris', '8.9') - st;
    sh({ id: 'W09', at: st, move: cam.push(0.05, [W / 4, 520]), note: 'left: the directors\' ledger, orders from Paris', draw(lt, d, t) { split(t, lt, { left: eob(seg(lt, pa, pa + 0.3)), right: 0 }); } });
    X.ev(st + pa, 'slip', 'ORDERS FROM PARIS'); X.ev(st + 0.4, 'route', 'quills', { dur: 1.5 }); }
  { const st = X.at('8.10'), be = X.w('bengal', '8.10') - st;
    sh({ id: 'W10', at: st, move: cam.push(0.05, [W * 3 / 4, 520]), note: 'right: the crimson arrow pulses with coins', draw(lt, d, t) { split(t, lt, { left: 1, right: eob(seg(lt, be, be + 0.3)) }); } });
    X.ev(st + be, 'slip', 'PAYS FOR ITSELF'); X.cue(st + be + 0.2, 'coins', { gain: 0.6 }); }
  { const st = X.at('8.11'), ad = X.w('added', '8.11') - st;
    sh({ id: 'W11', at: st, whip: 'up', move: cam.drift(0.03, [W / 2, 470]), note: 'the blue pieces turn crimson one by one', draw(lt, d, t) { const sq = boardOver(t); const k = seg(lt, 0.3, ad + 0.6); pieces(sq, lt, { crown: true, backP: { french: 1 - k, english: 1 } }); for (const [f, r] of [[0.75, 1.3], [1.75, 4.3]]) A.chessPiece(...sq(f, r), { kind: 'pawn', side: 'english', s: 1.35, sc: eob(clamp(k * 1.5)) }); } });
    X.ev(st + 0.3, 'chess', 'pieces turn crimson'); X.ev(st + ad, 'chess', 'last piece turns'); }
  { const st = X.at('8.12'), em = X.w('empire', '8.12') - st;
    sh({ id: 'W12', at: st, move: cam.push(0.08, [W / 2, 470]), note: 'the crimson arrow from Bengal fills the board; final push; end card (bottom-right kept clear)', draw(lt, d, t) {
      const sq = boardOver(t); pieces(sq, lt, { crown: true, backP: { french: 0, english: 1 } });
      ctx.save(); ctx.globalAlpha = 0.55 * seg(lt, em - 0.4, em + 0.6); A.supplyLine([[1700, -40], [1500, 200], [1100, 360], sq(3.5, 3.5)], { p: seg(lt, em - 0.6, em + 0.8), t, thick: 60 }); ctx.restore();
      const e = seg(lt, d - 2.0, d - 1.4); if (e > 0) { ctx.save(); ctx.globalAlpha = e; K.slip('NEXT: THE DANES IN INDIA', 620, 800, 1, -0.02, 44); ctx.restore(); }
    } });
    X.ev(st + em - 0.6, 'route', 'arrow fills the board'); X.ev(st + 2.4, 'slip', 'NEXT: THE DANES IN INDIA', { sound: false }); }
}
