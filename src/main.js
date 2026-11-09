// Boot: fonts → script + timing → captions → shots. Then draw(t) renders film time t (pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, setCtx, ctx, clamp, eo, eio, lerp } from './core/lib.js';
import { camAt, WHIP, WHIP_DIR } from './core/motion.js';
import { setGeo } from './core/atlas.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { eraBar, guides } from './core/kit.js';
const GUIDES = new URLSearchParams(location.search).has('guides');

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

const off = document.createElement('canvas'); off.width = W; off.height = H; const offCtx = off.getContext('2d');
/** draw shot i at film time t into the current ctx, with its declared camera move */
function drawShot(i, t, ox = 0, oy = 0) {
  const S = OP._shots, sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at, lt = t - sh.at;
  const c = camAt(sh.move, lt, d);
  ctx.save(); ctx.translate(ox + c.dx, oy); ctx.translate(c.fx, c.fy); ctx.scale(c.s, c.s); ctx.translate(-c.fx, -c.fy);
  sh.draw(lt, d, t);
  ctx.restore(); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
}
/** whip pan: 6 sub-frame samples averaged (running mean) for directional motion blur */
function whipBlur(i, t, dir, e0, e1, sign) {
  const [vx, vy] = WHIP_DIR[dir] || [-1, 0], main = ctx; const N = 6;
  for (let k = 0; k < N; k++) {
    const e = lerp(e0, e1, (k + 0.5) / N);
    setCtx(offCtx); offCtx.setTransform(1, 0, 0, 1, 0, 0); offCtx.fillStyle = '#000'; offCtx.fillRect(0, 0, W, H);
    drawShot(i, t, sign * vx * W * e, sign * vy * H * e);
    setCtx(main); main.globalAlpha = 1 / (k + 1); main.drawImage(off, 0, 0); main.globalAlpha = 1;
  }
}
function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], next = S[i + 1], lt = t - sh.at, hw = WHIP / 2, fr = 1 / 30;
  // a whip pan replaces every cross-fade: the outgoing shot slides out, the incoming slides in, both motion-blurred
  if (next && next.whip && next.at - t < hw) { const a = 1 - (next.at - t) / hw; whipBlur(i, t, next.whip, eio(a) * 0.5, eio(clamp(a + fr / hw)) * 0.5, -1); }
  else if (sh.whip && lt < hw) { const a = lt / hw; whipBlur(i, t, sh.whip, 0.5 - eio(a) * 0.5, 0.5 - eio(clamp(a + fr / hw)) * 0.5, 1); }
  else drawShot(i, t);
  // era bar sits in screen space (outside the camera), so it never zooms or drifts
  if (sh.era != null) eraBar(sh.era, sh.eraP ? sh.eraP(lt) : 1);
  // fade from / to black on the first and last 0.25 s
  const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));
  if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (!OP.lab) drawCaption(t);
  if (GUIDES) guides();
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter'); await document.fonts.load('700 100px Caladea');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    setGeo(await (await fetch('data/geo.json', { cache: 'no-store' })).json());
    buildCaptions(script);
    const LAB = new URLSearchParams(location.search).get('lab');
    const { buildShots } = LAB ? await import('./lab.js') : await import('./shots.js');
    const { shots, cues, events = [] } = buildShots(LAB);
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script; OP.lab = LAB;
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ') }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.events = () => events.slice().sort((a, b) => a.t - b.t);
    OP.moves = () => shots.map((s) => ({ id: s.id, at: s.at, move: s.move ? s.move.kind : 'drift(default)', whip: s.whip || '', snapAt: s.move && s.move.kind === 'snap' ? +(s.at + s.move.at).toFixed(3) : null }));
    OP.ready = true;
    // preview mode (not capture): play in real time, ?t=12.3 to hold a frame
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
