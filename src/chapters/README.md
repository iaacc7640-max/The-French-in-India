# Chapters

One file per chapter (`ch0_hook.js` … `ch8_takeaway.js`), each exporting `build(ctx)` that adds its shots, events and
cues. `src/shots.js` imports them in order. Shared art lives only in `src/core/` (kit, atlas, cast, motion).
