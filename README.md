# So Close to Empire: The French in India, 1664-1954

A 5-minute, 16:9 (1920x1080) animated history video in the Paper Atlas style, made entirely in code
(canvas drawing in headless Chrome, a local Kokoro voice, Whisper word timing, numpy sound).

## Status
- Gate 1 (setup): done. The Paper Atlas pipeline passed its self-test on the build machine.
- Gate 2 (16:9 engine): done. The proof frame is `review/proof/t3.40.jpg`; the version with layout guides is
  `review/proof-guides/t3.40.jpg`; the contact sheet is `review/proof-sheet.jpg`.
- Next: the plan screen (narration per cut, caption chunks, shot list with camera moves and events).

## 16:9 layout
- Captions: torn paper strip centred at y 935, Caladea 68 px, max width 1500, one crimson word.
- Era bar: y 70, ticks 1664 · 1674 · 1746 · 1749 · 1751 · 1760 · 1763 · 1954, active tick royal blue.
- Title-safe: x 96-1824, y 54-1026. Nothing moving crosses y 860-1010.
- The bottom-right 420x260 corner stays clear in the last 20 s for end-screen elements.

## Run it
Needs the faceless-shorts skill's setup (Node 22+, ffmpeg, Chrome, `~/.faceless-shorts/venv`).

```bash
node tools/capture.mjs check
```

```bash
node tools/capture.mjs frames review/proof "3.4"
```

```bash
QS='&guides=1' node tools/capture.mjs frames review/proof-guides "3.4"
```
