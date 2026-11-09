// Review boards for gate 4 (not part of the film): ?lab=cast (the cast with idle motion), ?lab=kit (map, pins,
// ink-bleed, stat card, chessboard, supply line), ?lab=card (chapter card + whip pan), ?lab=props (props).
import { ctx, W, H, clamp, seg, eo, eob, eio } from './core/lib.js';
import * as K from './core/kit.js';
import * as A from './core/atlas.js';
import { person, CAST, portrait } from './core/cast.js';
import { cam } from './core/motion.js';
const { P } = K;

export function buildShots(lab) {
  const S = [], events = [], cues = [];
  if (lab === 'cast') {
    const names = Object.keys(CAST);
    S.push({ id: 'CAST', at: 0, move: cam.drift(0), draw(lt, d, t) {
      K.parchment(5); ctx.font = '700 44px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText('SO CLOSE TO EMPIRE · THE CAST (idle: breathing + head sway)', W / 2, 62);
      names.forEach((n, i) => { const row = i < 9 ? 0 : 1, col = row ? i - 9 : i, x = 130 + col * 207 + (row ? 103 : 0), y = row ? 1000 : 520;
        person(n, { x, y, h: 360, t, seed: i * 1.3, dir: 1 });
        ctx.font = '700 19px Caladea'; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText(CAST[n].label, x, y + 26); });
    } });
  }
  if (lab === 'kit') {
    S.push({ id: 'KIT', at: 0, move: cam.drift(0), era: 5, draw(lt, d, t) {
      const v = A.realMap({ view: 'india', t });
      const fr = (n) => A.at(v, n);
      A.inkBleed(...fr('Pondicherry'), 300, seg(lt, 0.3, 1.6), P.royal, { clipFn: A.mainland(v), seed: 2 });
      A.inkBleed(...fr('Calcutta'), 220, seg(lt, 0.8, 2.0), P.crimson, { clipFn: A.mainland(v), seed: 5 });
      A.krishna(v, seg(lt, 0, 1.2));
      A.supplyLine([fr('Calcutta'), [1330, 330], [1150, 560], fr('Madras')], { p: seg(lt, 1.5, 3), t });
      A.supplyLine([fr('Mahe'), [640, 650], fr('Wandiwash')], { p: seg(lt, 2.2, 3.4), t, side: 'french', broken: true });
      for (const n of ['Pondicherry', 'Chandernagore', 'Masulipatnam', 'Mahe', 'Karaikal', 'Yanam', 'Surat']) A.pin(...fr(n), 'french', { star: n === 'Pondicherry', sc: eob(seg(lt, 0.2, 0.5)) });
      for (const n of ['Madras', 'Fort St David', 'Calcutta', 'Bombay']) A.pin(...fr(n), 'english', { sc: eob(seg(lt, 0.4, 0.7)) });
      for (const n of ['Arcot', 'Ambur', 'Wandiwash', 'Trichinopoly', 'Hyderabad', 'Bijapur', 'Plassey']) { const [x, y] = fr(n); K.circle?.(x, y, 6, P.ink); ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fillStyle = P.ink; ctx.fill(); }
      A.placeLabel('PONDICHERRY', ...fr('Pondicherry'), { dx: 120, dy: 0, size: 22 }); A.placeLabel('MADRAS', ...fr('Madras'), { dx: 90, dy: 0, size: 22 }); A.placeLabel('CALCUTTA', ...fr('Calcutta')); A.placeLabel('HYDERABAD', ...fr('Hyderabad'));
      A.placeLabel('SURAT', ...fr('Surat')); A.placeLabel('MAHE', ...fr('Mahe'), { dy: 34 }); A.placeLabel('ARCOT', ...fr('Arcot'), { dx: -60, dy: -18, size: 18 }); A.placeLabel('WANDIWASH', ...fr('Wandiwash'), { dx: -90, dy: 8, size: 18 });
      A.flag(fr('Pondicherry')[0] + 40, fr('Pondicherry')[1] + 60, t, A.FLAGS.french, { s: 0.5 });
      A.statCard({ x: 1500, y: 560, from: fr('Madras'), title: 'Adyar', stats: ['~350 French + ~700 sepoys', 'vs ~10,000'], date: '24 Oct 1746', p: seg(lt, 3.2, 3.8), portrait: portrait('paradis'), hi: 1 });
    } });
  }
  if (lab === 'chess') {
    S.push({ id: 'CHESS', at: 0, move: cam.push(0.06, [W / 2, 480]), era: 3, draw(lt, d, t) {
      const v = A.realMap({ view: 'south', t });
      const sq = A.chessboard({ x: W / 2, y: 470, size: 700, p: seg(lt, 0, 0.6) });
      const kings = [['Muzaffar Jang', 'nizam', 1, 2, 'french'], ['Chanda Sahib', 'nawab', 2, 5, 'french'], ['Nasir Jang', 'nizam', 6, 2, 'english'], ['Anwar-ud-din', 'nawab', 5, 5, 'english']];
      kings.forEach(([n, side, f, r, backer], i) => { const [x, y] = sq(f, r); const fall = i === 3 ? seg(lt, 4.5, 5.6) : 0;
        A.chessPiece(...sq(f + (backer === 'french' ? -1 : 1) * 0.6, r - 0.9), { kind: 'pawn', side: backer, s: 0.8, sc: eob(seg(lt, 2.2 + i * 0.3, 2.6 + i * 0.3)) });
        A.chessPiece(x, y, { kind: 'king', side, s: 0.9, sc: eob(seg(lt, 0.8 + i * 0.25, 1.2 + i * 0.25)), label: n, fall, crown: i === 0 && lt > 3.6 }); });
    } });
  }
  if (lab === 'card') {
    S.push({ id: 'MAP', at: 0, move: cam.drift(), era: 0, draw(lt, d, t) { A.realMap({ view: 'europe', set: 'europe', t }); } });
    S.push({ id: 'CARD', at: 2.0, whip: 'left', move: cam.push(0.05), draw(lt, d, t) { A.chapterCard('1749', 'The Kingmaker', lt); } });
    S.push({ id: 'OCEAN', at: 4.6, whip: 'down', move: cam.snap(1.0, 0.18, [1100, 560]), era: 1, draw(lt, d, t) { const v = A.realMap({ view: 'ocean', set: 'south_asia', also: ['indian_ocean'], t }); } });
  }
  if (lab === 'thumb') {
    S.push({ id: 'THUMB', at: 0, move: cam.drift(0), draw(lt, d, t) {
      const v = A.realMap({ view: 'india', t: 0 }), at = (n) => A.at(v, n);
      A.inkBleed(...at('Calcutta'), 760, 1, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.6 });
      A.inkBleed(...at('Pondicherry'), 560, 1, P.royal, { clipFn: A.mainland(v), seed: 2, alpha: 0.82 });
      person('dupleix', { x: 1450, y: 1000, h: 820, t: 0, arm: 95 });
      K.ribbon('1760', 1450, 150, 1, 90);
      ctx.save(); ctx.font = '700 104px Caladea'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.strokeStyle = '#F3E9D2';
      for (const [txt, y, c] of [['SO CLOSE', 760, P.ink], ['TO EMPIRE', 880, P.crimson]]) { ctx.strokeText(txt, 80, y); ctx.fillStyle = c; ctx.fillText(txt, 80, y); }
      ctx.restore();
    } });
  }
  return { shots: S, cues, events };
}
