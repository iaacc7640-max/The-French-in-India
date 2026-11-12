// Review boards for gate 4 (not part of the film): ?lab=cast (the cast with idle motion), ?lab=kit (map, pins,
// ink-bleed, stat card, chessboard, supply line), ?lab=card (chapter card + whip pan), ?lab=props (props).
import { ctx, W, H, clamp, seg, eo, eob, eio } from './core/lib.js';
import * as K from './core/kit.js';
import * as A from './core/atlas.js';
import { person, CAST, portrait } from './core/cast.js';
import { cam } from './core/motion.js';
import * as R from './core/props.js';
import * as SC from './core/scenes.js';
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
      const v = A.realMap({ view: 'peninsula', t: 0 }), at = (n) => A.at(v, n);
      A.inkBleed(...at('Calcutta'), 450, 1, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.6 });
      A.inkBleed(...at('Pondicherry'), 560, 1, P.royal, { clipFn: A.mainland(v), seed: 2, alpha: 0.82 });
      person('dupleix', { x: 1450, y: 1000, h: 820, t: 0, arm: 95 });
      K.ribbon('1760', 1450, 150, 1, 90);
      ctx.save(); ctx.font = '700 104px Caladea'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.strokeStyle = '#F3E9D2';
      for (const [txt, y, c] of [['SO CLOSE', 760, P.ink], ['TO EMPIRE', 880, P.crimson]]) { ctx.strokeText(txt, 80, y); ctx.fillStyle = c; ctx.fillText(txt, 80, y); }
      ctx.restore();
    } });
  }
  // ═════ YOUTUBE THUMBNAILS (1920x1080 drawn, exported at 1280x720). Big words, few of them, nothing key in the bottom-right
  // corner (YouTube's duration badge sits there), readable at phone size. ═════
  const big = (text, x, y, size, fill, { align = 'left', stroke = '#2A1E16', sw = 0.16, rot = 0, font = 'Inter', weight = 900 } = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(30,20,10,0.45)'; ctx.shadowBlur = size * 0.12; ctx.shadowOffsetY = size * 0.06;
    ctx.lineWidth = size * sw; ctx.strokeStyle = stroke; ctx.strokeText(text, 0, 0); ctx.shadowColor = 'transparent'; ctx.fillStyle = fill; ctx.fillText(text, 0, 0); ctx.restore();
  };
  const stamp = (text, x, y, size, rot = -0.08, col = P.crimson) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * 1.1, h = size * 1.55;
    K.cut(K.P_rr(-w / 2, -h / 2, w, h, 10), col, { shadow: 1.2, edge: 0 }); ctx.strokeStyle = '#F4EEDD'; ctx.lineWidth = 6; ctx.setLineDash([]); ctx.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24);
    ctx.fillStyle = '#F7F1E1'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.04); ctx.restore();
  };
  const vignette = (a = 0.5) => { const g = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1200); g.addColorStop(0, 'rgba(20,12,6,0)'); g.addColorStop(1, `rgba(20,12,6,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  if (lab === 'thumbA') {   // 1,000 vs 10,000 … and still lost India
    S.push({ id: 'TA', at: 0, move: cam.drift(0), noDust: true, draw(lt, d, t) {
      K.parchment(31); ctx.fillStyle = '#C9B48A'; ctx.fillRect(0, 560, W, 520);
      const g = ctx.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, '#9DB4B0'); g.addColorStop(1, '#E3D2AC'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 560);
      R.army(1420, 640, 30, 12, P.forest, { t: 0, s: 1.15, gap: 25, rowGap: 24, turban: true, seed: 9 });
      for (const fx of [1080, 1300, 1520, 1740]) A.flag(fx, 470, 0.4, A.FLAGS.nawab, { s: 1.1, seed: fx });
      R.army(360, 720, 7, 4, P.royal, { t: 0, s: 2.6, gap: 28, rowGap: 22, seed: 3 }); A.flag(560, 650, 0.4, A.FLAGS.french, { s: 1.6 });
      ctx.save(); const sh = ctx.createLinearGradient(0, 0, 0, 380); sh.addColorStop(0, 'rgba(20,12,6,0.55)'); sh.addColorStop(1, 'rgba(20,12,6,0)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, W, 380); ctx.restore();
      big('1,000', 60, 190, 220, '#F7F1E1', { stroke: P.royal, sw: 0.2 }); big('VS', 885, 200, 120, P.gold, { align: 'center' }); big('10,000', 1860, 190, 220, '#F7F1E1', { align: 'right', stroke: P.forest, sw: 0.2 });
      stamp('…AND STILL LOST INDIA', 760, 960, 92, -0.05); vignette(0.35);
    } });
  }
  if (lab === 'thumbB') {   // France almost won India
    S.push({ id: 'TB', at: 0, move: cam.drift(0), noDust: true, draw(lt, d, t) {
      const v = A.realMap({ view: { lon: 79.5, lat: 21.5, deg: 52, base: 'asia' }, t: 0 }), at = (n) => A.at(v, n);
      A.inkBleed(...at('Pondicherry'), 470, 1, P.royal, { clipFn: A.mainland(v), seed: 2, alpha: 0.86 });
      A.inkBleed(...at('Calcutta'), 300, 1, P.crimson, { clipFn: A.mainland(v), seed: 5, alpha: 0.75 });
      for (const n of ['Pondicherry', 'Masulipatnam', 'Mahe', 'Karaikal', 'Yanam', 'Chandernagore']) A.pin(...at(n), 'french', { r: 13, star: n === 'Pondicherry' });
      vignette(0.55);
      person('dupleix', { x: 1500, y: 1110, h: 1000, t: 0, arm: 105, prop: 'none' }); SC.crown(1835, 190, 1.0);
      big('FRANCE', 80, 150, 210, '#F7F1E1'); big('ALMOST', 80, 360, 210, '#F7F1E1'); big('WON INDIA', 80, 570, 210, P.gold, { stroke: '#2A1E16' });
      K.ribbon('1746 – 1761', 430, 790, 1, 70);
    } });
  }
  if (lab === 'thumbC') {   // Executed for losing India
    S.push({ id: 'TC', at: 0, move: cam.drift(0), noDust: true, draw(lt, d, t) {
      R.room({ wall: '#8E7E62', floor: '#4E3E2E', fl: 860, seed: 17 }); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#1D2236'; ctx.fillRect(0, 0, W, H); ctx.restore();
      R.door(80, 200, 300, 660); ctx.save(); const gl = ctx.createRadialGradient(560, 520, 0, 560, 520, 520); gl.addColorStop(0, 'rgba(242,190,90,0.42)'); gl.addColorStop(1, 'rgba(242,190,90,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H); ctx.restore();
      person('lally', { x: 560, y: 1150, h: 1050, t: 0 });
      R.table(1050, 860, 240, { h: 160 }); R.candle(1050, 836, 0, { s: 1.5, out: 0.55 });
      big('EXECUTED', 1880, 200, 200, P.crimson, { align: 'right', stroke: '#F7F1E1', sw: 0.12 });
      big('FOR LOSING', 1880, 400, 132, '#F7F1E1', { align: 'right' }); big('INDIA', 1880, 560, 150, P.gold, { align: 'right' });
      A.wordSeal('GUILTY', 1560, 790, 1.55, 1, P.crimson, 40); vignette(0.45); K.ribbon('PARIS · 1766', 300, 960, 1, 60);
    } });
  }
  return { shots: S, cues, events };
}
