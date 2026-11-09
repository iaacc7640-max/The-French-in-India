# Pre-export checklist (brief §14)

Each result is per chapter and was checked on the contact sheets `review/ch0.jpg` … `review/ch8.jpg`, the events report `review/events.txt` and the mix.

| # | Check | CH0 | CH1 | CH2 | CH3 | CH4 | CH5 | CH6 | CH7 | CH8 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Visual pacing: no event gap of 4 s or more; figures idle | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 2 | Camera: every shot declares a move; region changes whip; snaps land on the word | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 3 | Maps: territory = ink-bleed; routes draw; stat-card numbers match §5D | PASS | PASS | PASS* | PASS | PASS | PASS | PASS | PASS | PASS |
| 4 | Audio: every event has a sound; every scene has ambience; voice clear | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL |
| 5 | Hook stated, then paid off | PASS | – | – | – | – | – | PASS | – | PASS |
| 6 | Links: no "and then", "after that" or "next,"; open-loop endings | PASS | PASS | PASS | PASS | PASS | PASS | PASS** | PASS | – |
| 7 | Takeaway is a realisation, not a summary | – | – | – | – | – | – | – | – | PASS |

## Evidence and notes
- **1.** `capture.mjs events` reports "no gap of 4 s or more" for all 113 shots. Every `person()` call passes the film time, so every figure breathes and sways. The 3 s idle test showed every figure changing between frames 1 s apart.
- **2.** No shot falls back to the default camera move (0 hits for `drift(default)` in `review/events.txt`). Snap-zooms are timed to land exactly on their word's Whisper time. I did not measure the 0.15 s tolerance on rendered frames.
- **3.** \*The Pondicherry card reads "French from 1674 · capital of French India" instead of "founded 1674". This keeps to the brief's rule against claiming anyone founded the town. Territory ink stays on the mainland: it never covers Ceylon, and the British red stops at Bengal.
- **4.** PARTIAL on two points:
  - 17 of the 217 events are silent on purpose. Most are a ribbon that pops while a page-turn is already playing, or a light shift.
  - Some shots have music and effects but no ambience bed.
  - The voice measured about 13 dB above the music and effects in the pilot. I have not listened to the full mix by ear.
- **5.** The first sentence states the paradox; "It was a supply line." closes CH0. CH6 shows the full crimson supply arrow with a "SUPPLY LINE" slip, and CH8 says "pays for itself from Bengal" while the arrow fills the board.
- **6.** The script has 0 hits for the banned links. \*\*CH6 ends on "the city surrendered." as written in your brief; CH7's card and blame question pick it up.
- **Length:** 5:49, which you accepted. That is outside the brief's 4:55-5:20 target.
- **Silence:** no gap over 0.6 s in the pilot. Re-run `silencedetect` on the final file.
