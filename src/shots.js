// SO CLOSE TO EMPIRE: the shot list. One file per chapter in src/chapters/; this file wires them together and gives
// them a small API (X): cut times by plan id ("4.8"), word cues, events (ev → SFX), ambience beds, chapter cards.
import { W, H, clamp, seg, eob } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import * as A from './core/atlas.js';
import { cam, sfxFor, WHIP } from './core/motion.js';
import { build as ch0 } from './chapters/ch0_hook.js';
import { build as ch4 } from './chapters/ch4_kingmaker.js';
import { build as ch1 } from './chapters/ch1_party.js';
import { build as ch2 } from './chapters/ch2_pondicherry.js';
import { build as ch3 } from './chapters/ch3_adyar.js';
import { build as ch5 } from './chapters/ch5_clive.js';

export const CHAPTERS = [
  { ch: 0, year: '', title: 'Cold open', music: 'tension' },
  { ch: 1, year: '1664', title: 'Last to the Party', music: 'bed', era: 0 },
  { ch: 2, year: '1674', title: 'A Home Called Pondicherry', music: 'bed', era: 1 },
  { ch: 3, year: '1746', title: 'One Thousand vs Ten Thousand', music: 'rising', era: 2 },
  { ch: 4, year: '1749', title: 'The Kingmaker', music: 'pulse', era: 3 },
  { ch: 5, year: '1751', title: 'The Clerk Who Struck Back', music: 'tension', era: 4 },
  { ch: 6, year: '1760', title: 'Wandiwash', music: 'tension', era: 5 },
  { ch: 7, year: '1763', title: 'The Real Turning Point', music: 'minor', era: 6 },
  { ch: 8, year: '1954', title: 'What Really Decided India', music: 'warm', era: 7 },
];
const BUILT = { 0: ch0, 1: ch1, 2: ch2, 3: ch3, 4: ch4, 5: ch5 };          // the pilot chapters; the rest are drafts until built

export function buildShots(lab, script) {
  const lines = script.lines, S = [], CUES = [], EV = [];
  const idx = (cut) => { const i = lines.findIndex((l) => l.cut === cut); if (i < 0) throw new Error(`no cut ${cut}`); return i; };
  const X = {
    S, lines, idx,
    start: (cut) => L(idx(cut)), end: (cut) => Le(idx(cut)),
    /** a shot cut lands just before its line starts */
    at: (cut) => (idx(cut) === 0 ? 0 : L(idx(cut)) - 0.08),
    /** film time of a word in a cut's line (prefix match, case-insensitive; throws if missing) */
    w: (word, cut, which = 's') => Wd(word, idx(cut), which),
    cue: (t, type, o = {}) => CUES.push({ t: +Math.max(0, t).toFixed(3), type, ...o }),
    /** a visual event at film time t (listed by `capture.mjs events`) with its sound */
    ev(t, kind, note = '', o = {}) { EV.push({ t: +t.toFixed(3), kind, note }); if (o.sound !== false) X.cue(t, sfxFor(kind), o); },
    /** an ambience bed from t0 to t1 (foley under the music, ducked under the voice) */
    amb: (t0, t1, name, gain = 1) => CUES.push({ t: +t0.toFixed(3), type: 'amb', name, dur: +(t1 - t0).toFixed(3), gain }),
    add(o) {
      S.push(o);
      if (o.whip) X.cue(o.at - WHIP / 2, 'whoosh', { gain: 0.8 });
      if (o.move && o.move.kind === 'push') X.cue(o.at + 0.05, 'swell', { gain: 0.5 });
      if (o.move && o.move.kind === 'snap') X.cue(o.at + o.move.at - 0.06, 'snapthump');
      return o;
    },
  };
  // chapter boundaries: chapter n (n >= 1) starts with its card, right after chapter n-1's last line
  const lastOf = (ch) => lines.reduce((a, l, i) => (l.chapter === ch ? i : a), -1), firstOf = (ch) => lines.findIndex((l) => l.chapter === ch);
  const chapters = CHAPTERS.map((c) => ({ ...c, start: c.ch === 0 ? 0 : +(Le(lastOf(c.ch - 1)) + 0.12).toFixed(3) }));
  chapters.forEach((c, i) => { c.end = i < chapters.length - 1 ? chapters[i + 1].start : T.dur; c.firstLine = L(firstOf(c.ch)); });
  X.chapters = chapters;

  for (const c of chapters) {
    // chapter card in the beat before the chapter's first line; cliffhanger sting on the previous chapter's last word
    if (c.ch > 0) {
      X.cue(c.start - 0.2, 'sting');
      X.add({ id: `CARD${c.ch}`, at: c.start, whip: 'left', move: cam.push(0.04), era: c.era, chapter: c.ch, note: `chapter card ${c.year}: ${c.title}`,
        draw(lt) { A.chapterCard(c.year, c.title, lt, c.ch === 1 ? { film: { title: 'SO CLOSE TO EMPIRE', span: '1664 – 1954' } } : {}); } });
      X.ev(c.start + 0.05, 'page', 'card page turn'); X.ev(c.start + 0.3, 'ribbon', `ribbon ${c.year}`, { sound: false }); X.ev(c.start + 0.85, 'seal', 'fleur-de-lis seal');
    }
    if (BUILT[c.ch]) BUILT[c.ch](X, c);
    else draft(X, c);
  }
  // first shot of each chapter after a card enters with a whip
  for (const c of chapters) if (c.ch > 0) { const s = S.find((s) => s.chapter === c.ch && !s.id.startsWith('CARD')); if (s && !s.whip) { s.whip = 'left'; X.cue(s.at - WHIP / 2, 'whoosh', { gain: 0.8 }); } }
  S.forEach((s) => { if (s.chapter == null) throw new Error(`shot ${s.id} has no chapter`); });
  return { shots: S, cues: CUES, events: EV, chapters };
}

/** a draft chapter (not built yet): the real map with the cut's id, so the film runs end to end */
function draft(X, c) {
  X.lines.forEach((ln, i) => {
    if (ln.chapter !== c.ch) return;
    X.add({ id: `D${ln.cut}`, at: X.at(ln.cut), chapter: c.ch, era: c.era, move: cam.drift(), note: `DRAFT ${ln.cut}`,
      draw(lt, d, t) { A.realMap({ view: 'india', t }); K.slip(`DRAFT · ${ln.cut}`, W / 2, 230, eob(seg(lt, 0, 0.3)), -0.02, 48); } });
    X.ev(X.at(ln.cut) + 0.05, 'slip', 'draft slip', { sound: false });
  });
}
