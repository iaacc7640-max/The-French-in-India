# Quality check: "So Close to Empire" against the animation and storytelling framework (re-check after fixes)

Checked file: `renders/french-in-india.mp4`, the re-render after the fixes (1920×1080, 30 fps, **6:04**, -13.8 LUFS, peak -1.0 dBFS, no silence over 0.6 s).
Method: I measured the rendered MP4 itself:
- frame differences at 10 fps, ignoring the caption band and the era bar;
- the shot, camera and event list (`review/events.txt`);
- the sound-cue list and the mixed audio;
- the narration text.

Overall: **22 PASS, 0 PARTIAL, 0 FAIL** (it was 16 / 6 / 0 before the fixes).

## Part 1: Animation

| # | Framework rule | Before | Now | Evidence now |
|---|---|---|---|---|
| 1 | Rule of 4–6 s | PASS | **PASS** | Nothing is ever fully still for more than 0.3 s. There are 553 big on-screen changes. The longest stretch between them is 5.8 s and none reaches 6 s. The engine logs 225 visual events and reports no gap of 4 s or more across 116 shots. |
| 2a | Slow 5–10% zooms for tension | PASS | **PASS** | 64 slow push-ins. Shots use 5–8%; the chapter cards use 4%. |
| 2b | Snap zooms for reveals | PASS | **PASS** | 19 snap-zooms of 10–18%, each timed to its word. |
| 2c | Whip pans between eras and regions, no cross-fades | PARTIAL | **PASS** | 69 whip pans with motion blur, up from 64. The four hard region cuts now whip: Surat, the company hall in France, the chessboard after Ambur, and Dupleix's study (`review/whips.jpg`). No cross-fades anywhere. |
| 3a | Idle motion on characters | PASS | **PASS** | Every figure breathes and sways its head. |
| 3b | Secondary motion: flags, torches, water, dust or smoke | PARTIAL | **PASS** | New: floating dust motes on every shot, kept above the caption band, and drifting smoke at Adyar, Ambur, Arcot and Wandiwash. Flags, candles, torches, sea, map water, gulls and rain move as before. |
| 4a | Routes draw themselves | PASS | **PASS** | |
| 4b | Ink-bleed territory changes | PASS | **PASS** | The ink stays on the mainland: never on Ceylon or Burma. |
| 4c | Pop-up cards with a portrait or stat badge | PARTIAL | **PASS** | **8 of 8** stat cards now carry a portrait: Paradis twice (Adyar), Martin, the Nawab, Clive, Coote, Lally, and a ballot icon for Kizhur. |
| 5a | A sound for every motion | PARTIAL | **PASS** | Every visual event now plays a sound. Events that share a moment with a bigger sound play softly, at 35% volume. 480 sound cues in all. |
| 5b | Background ambience under the music | PARTIAL | **PASS** | Ambience covers 99–100% of every chapter, up from 57% overall. New beds: gulls on the Pondicherry beach and a crowd hush at Kizhur; any remaining gap gets a bed that suits the scene. |
| – | Voice clear over music and effects | PASS | **PASS** | -13.8 LUFS overall, peak -1.0 dBFS. |

## Part 2: Storytelling

| # | Framework rule | Before | Now | Evidence now |
|---|---|---|---|---|
| 1 | Paradox hook in the first 15–30 s, with a promised answer | PASS | **PASS** | The promise "It was a supply line." lands at about 0:33 and is paid off in CH6 and CH8. |
| 1b | The first sentence is a paradox | PARTIAL | **PASS** | It now opens: "How did France beat an army ten times its size, and still lose India?" |
| 2 | No "and then" or "after that" | PASS | **PASS** | 0 uses of "and then", "after that", "next," or "then,". |
| 2b | Every bridge is causal | PARTIAL | **PASS** | 28 of 67 sentences now open with But, Yet, So or Therefore (was 20 of 64). Date-led sentences are down from 16 to 10; those left either open a scene or answer the previous chapter's cliffhanger. "Then, … surrendered" is now "Therefore, … surrendered". |
| 3 | Named people; battles as duels | PASS | **PASS** | |
| 3b | Motives stated | PARTIAL | **PASS** | Now said aloud: Colbert is "ambitious", Lally "a proud and desperate general" (also on a slip), Coote "patient and well supplied", and Dupleix's idea as before. |
| 4 | A micro-cliffhanger at the end of every chapter | PARTIAL | **PASS** | CH6 now ends "But France still needed someone to blame." CH7 ends "But was the loss really his fault?", which CH8 answers. CH0 to CH5 are unchanged open loops. |
| 5 | An insightful takeaway | PASS | **PASS** | |

## Quick pre-export checklist (framework)

| Check | Result |
|---|---|
| 1. Does any shot sit completely still for more than 5 s? | **PASS**: the longest fully still moment is 0.3 s. |
| 2. Do sound effects accompany every transition and map movement? | **PASS**: every event has a sound. |
| 3. Does the first sentence present a question, tension or paradox? | **PASS**: it opens on a paradox question. |
| 4. Are beats linked by therefore/but, not and then/after that? | **PASS** |

## Side effects and things to know
- **Length grew from 5:49 to 6:04** because of the new lines: the opening question, the CH6 cliffhanger, the CH7 question and the motive phrases. The brief's target was 4:55–5:20.
- The new narration was synthesised again. Whisper heard 836 of 854 words; the 18 it missed are mostly names, so their captions are placed by estimate.
- New chapter times are in `review/YOUTUBE.md` (CH1 0:34 … CH8 5:26).

## Not verified
- I haven't watched or listened to the full film in real time. Everything above is measured, or checked on frames and contact sheets of the changed shots.
- The dust motes are faint by design. I confirmed them in the code and on the frames, but didn't measure them separately.
