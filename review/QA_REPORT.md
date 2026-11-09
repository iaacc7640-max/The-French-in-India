# Quality check: "So Close to Empire" (final render) against the animation and storytelling framework

Checked file: `renders/french-in-india.mp4` (1920×1080, 30 fps, 5:49, -13.9 LUFS, peak -1.0 dBFS).
Method: I measured the rendered MP4 itself:
- frame differences at 10 fps, ignoring the caption band and the era bar;
- the shot, camera and event list (`review/events.txt`);
- the sound-cue list and the mixed audio;
- the narration text.

Overall: **16 PASS, 6 PARTIAL, 0 FAIL** out of 22 checks. Every PARTIAL has a concrete fix in the last section.

## Part 1: Animation

| # | Framework rule | Result | Evidence |
|---|---|---|---|
| 1 | Rule of 4–6 s: a visual event every 4–6 s | **PASS** | The picture never freezes: the longest fully still moment is 0.3 s. There are 538 big on-screen changes. The longest stretch between two of them is 5.6 s (Chanda Sahib's king being laid down, a silence beat on purpose), and none reaches 6 s. Sixteen stretches of 4–5.6 s contain only small changes (a slip, a pin). Those meet the framework's 4–6 s but not the brief's stricter 4 s. |
| 2a | Slow 5–10% zooms for tension | **PASS** | 61 slow push-ins: 53 shots in the 5–8% range, plus the push on the 8 chapter cards, which is 4%, just under the range. |
| 2b | Quick snap zooms for reveals | **PASS** | 19 snap-zooms of 10–18%, each with an ease-out, landing on the reveal word ("ten thousand", "thrones", "executed", "supply", "Clive", "Wandiwash", …). |
| 2c | Whip pans, not cross-fades, between eras and regions | **PARTIAL** | 64 whip pans with motion blur and zero cross-fades; the only fades are from and to black at the very start and end. But 4 region changes cut hard with no whip: India map → Surat harbour (1:21), Pondicherry → company hall in France (1:42), Ambur map → chessboard (3:03), Hyderabad court → Dupleix's study (3:16). |
| 3a | Idle motion on characters | **PASS** | Every figure breathes (about 1.8% scale, 3.5 s loop) and sways its head (±1.5°). In a test clip, every one of the 19 figures changed between frames 1 s apart. Blinking doesn't apply: the paper figures have no eyes. |
| 3b | Secondary motion: flags, torches, water, dust or smoke | **PARTIAL** | Flags flutter (21 uses), candles and torches flicker, the sea moves, map water has drifting swell lines, gulls fly, rain falls, and the dot armies jitter. Missing: floating dust motes and drifting smoke in the backgrounds. There is no such layer. |
| 4a | Routes that draw themselves | **PASS** | Every route draws itself, often with a flag riding the tip: France → India, Golconda → Masulipatnam, Mauritius → Madras, Madras → Arcot, the supply line from Bengal, the broken French line overland, the Krishna river. |
| 4b | Ink-bleed or wipe for territory changes | **PASS** | Every territory change bleeds in with a ragged edge and drains back out: Madras taken and returned, the Dutch at Pondicherry, south of the Krishna, Bengal, the French collapse, the 1950/1954 tricolour. The ink is clipped to the mainland, so it never covers Ceylon or Burma. |
| 4c | Pop-up cards with a portrait or stat badge | **PARTIAL** | 8 stat cards, all with the numbers from the brief and a date. Only 2 of the 8 carry a portrait: Adyar in CH3, and Arcot. |
| 5a | A sound for every motion | **PARTIAL** | 359 sound cues: 72 whooshes, 62 swells, 59 pops, 28 parchment slides, 20 wax thuds, 19 snap thumps, 17 wooden clicks, and others. Every whip, snap and push has its sound. But 17 of the 217 logged visual events are silent, mostly ribbons popping during a page-turn and light shifts. |
| 5b | Background ambience under the music | **PARTIAL** | 28 ambience beds (court, sea, rain, wind, room, street, market, chess pulse), plus effects for drums, thunder, gavel and door. They cover only 57% of the running time: CH0 100%, CH8 37%. The brief's crowd hush at Kizhur and gulls at Pondicherry are missing as ambience. |
| – | Voice clear over music and effects | **PASS** | The voice sits about 16 dB above the music and effects in every chapter (speech about -15.5 dB, pauses -29 to -33 dB). Peak -1.0 dBFS, no clipping. |

## Part 2: Storytelling

| # | Framework rule | Result | Evidence |
|---|---|---|---|
| 1 | Paradox hook in the first 15–30 s, with a promised answer | **PASS** | 0:00 the underdog: 1,000 beat 10,000. 0:08 France picks India's kings. 0:13 yet France executes its own general. 0:21 the question. 0:27 the promise: "It was a supply line." It is paid off on screen in CH6 (the full supply arrow) and in CH8 ("pays for itself from Bengal"). |
| 1b | The first sentence itself is a paradox | **PARTIAL** | The first sentence is tension (underdog wins), not yet a paradox. The contradiction only completes in the third sentence, at 0:13. |
| 2 | But / therefore, never "and then" | **PASS** | 0 uses of "and then", "after that" or "next,". 20 of 64 sentences open with But, Yet, So or Therefore. |
| 2b | Every bridge is causal | **PARTIAL** | 16 of 64 sentences still open on a date ("In seventeen fifty-two, …"), so they read as chronology. One line is a plain "then" link: "Then, in January 1761, the city surrendered." |
| 3 | Named people with motives; battles as duels | **PASS** | 1–2 named people per chapter (Colbert, Caron, Marcara, Sher Khan Lodi, Martin, La Bourdonnais, Dupleix, Bussy, Clive, Lally, Coote). Two duels run across chapters: Dupleix vs Clive (CH4–5) and Lally vs Coote (CH6). |
| 3b | Motives stated | **PARTIAL** | Dupleix's motive is explicit ("why conquer thrones when you can choose who sits on them"). The others are mostly implied: Colbert's ambition, Lally's desperation and Coote's discipline are never said aloud. |
| 4 | A micro-cliffhanger at the end of every chapter | **PARTIAL** | CH0 to CH5 all end on open loops ("a home", "a weapon", "something bigger", "a young clerk who was watching", "the game was not over"). CH6 ends closed ("the city surrendered"). CH7 closes the opening loop on purpose ("France executed him"). |
| 5 | An insightful takeaway at the end | **PASS** | The ending is a realisation, not a summary: France had the better idea, but a company waiting on orders from Paris couldn't outlast one that paid for itself from Bengal, so the English won by joining Dupleix's idea to Bengal's money. It speaks to a universal lesson (ideas need money), though it doesn't name a modern parallel. |

## Quick pre-export checklist (framework)

| Check | Result |
|---|---|
| 1. Does any shot sit completely still for more than 5 s? | **PASS**: the longest fully still moment is 0.3 s, and the longest low-change stretch is 5.6 s (a deliberate beat). |
| 2. Do sound effects accompany every transition and map movement? | **PARTIAL**: every transition and route has a sound; 17 minor events are silent. |
| 3. Does the first sentence present a question, tension or paradox? | **PASS** (tension: 1,000 beat 10,000). |
| 4. Are beats linked by therefore/but rather than and then/after that? | **PASS**: 0 banned phrases; one "Then," remains. |

## Technical QA

| Check | Result |
|---|---|
| Format 1920×1080, 30 fps, H.264 + AAC | PASS |
| Length | 5:49. You accepted it, but it's outside the brief's 4:55–5:20. |
| Loudness -13.9 LUFS, peak -1.0 dBFS, no silence over 0.6 s | PASS |
| Joins between the four render pieces | PASS (frames checked either side of each join) |
| Captions: one crimson word per strip, at y 935, inside title-safe | PASS (contact sheets) |
| Caption timing | Whisper heard 797 of 814 words. The 17 it missed are mostly names, so those captions are placed by estimate. |

## Not verified
- I haven't watched or listened to the full film in real time. Everything above is measured or checked frame by frame.
- I haven't measured on the rendered frames that each snap-zoom lands within 0.15 s of its word. It's true by construction (the snap is timed to the word's Whisper time) but not measured.

## Fixes that would turn every PARTIAL into a PASS (about 1 hour; re-render the changed ranges only)
1. Add whip pans to the 4 hard region cuts at 1:21, 1:42, 3:03 and 3:16.
2. Add a faint dust-mote and smoke-drift layer to rooms, battles and maps.
3. Add portraits to the 6 stat cards without one: Adyar (CH0), Pondicherry ×2, Ambur, Wandiwash, Kizhur.
4. Give the 17 silent events soft sounds, and lay ambience under the remaining 43% (crowd hush at Kizhur, gulls at Pondicherry, room tone elsewhere).
5. Script edits; these need new narration for those lines:
   - "Then, in January 1761, the city surrendered." → "Therefore, in January 1761, the city surrendered. But France still needed someone to blame." This also opens a cliffhanger for CH7.
   - 3–4 date-led sentences → "Therefore, in 1752, …" and similar.
   - One short motive clause each for Lally (desperate to win) and Coote (patient, well supplied).
   - Optional: a paradox-first opening line.
