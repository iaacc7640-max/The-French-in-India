// Paper Atlas 16:9 · CAMERA GRAMMAR, EVENTS and their SOUNDS.
// Every shot declares ONE camera move:
//   cam.push(amt, focus)              slow 5-10% push-in toward focus (tension, turning points)
//   cam.snap(at, amt, focus)          quick snap-zoom (0.35 s, ease-out-back) that LANDS on shot-local time `at` (a word)
//   cam.drift(amt)                    default slow parallax drift (2-3% over the shot)
// and may enter with a whip pan:  whip: 'left'|'right'|'up'|'down'  (0.30 s across the cut, 6-sample motion blur).
// ev(t, kind) records a visual event (film time) for the `events` QA report and cues its sound via sfxFor(kind).
import { W, H, clamp, seg, eio, eo, eob, lerp } from './lib.js';

export const cam = {
  push: (amt = 0.07, focus = [W / 2, H / 2]) => ({ kind: 'push', amt, focus }),
  snap: (at, amt = 0.16, focus = [W / 2, H / 2], dur = 0.35) => ({ kind: 'snap', at, amt, focus, dur }),
  drift: (amt = 0.025, focus = [W / 2, H / 2]) => ({ kind: 'drift', amt, focus }),
};
/** camera scale + focus for a shot at local time lt of duration d */
export function camAt(move, lt, d) {
  const m = move || cam.drift(); let s = 1, fx = m.focus[0], fy = m.focus[1], dx = 0;
  if (m.kind === 'push') s = 1 + m.amt * eio(clamp(lt / d));
  else if (m.kind === 'snap') { const p = seg(lt, m.at - m.dur, m.at); s = 1 + 0.02 * clamp(lt / d) + m.amt * eob(p); }
  else { s = 1 + m.amt * clamp(lt / d); dx = -W * 0.012 * eio(clamp(lt / d)); }
  return { s, fx, fy, dx };
}
export const WHIP = 0.36;
export const WHIP_DIR = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };

/** event kinds → sound cue types in tools/mix.py (soft, -24..-18 LUFS-ish under the voice) */
export const SFX = {
  whip: 'whoosh', snap: 'snapthump', push: 'swell', ink: 'brush', route: 'quill', card: 'parchment', chess: 'click',
  seal: 'waxthud', page: 'pageturn', pop: 'pop', ribbon: 'parchment', slip: 'pop', flag: 'flutter', coin: 'coins',
  drop: 'thud', candle: 'puff', door: 'door', gavel: 'gavel', ballot: 'ballot', drums: 'drums', thunder: 'thunder',
  sting: 'sting', light: 'swell', count: 'tock', fall: 'thud', split: 'whoosh',
};
export const sfxFor = (kind) => SFX[kind] || 'pop';
