# Revision 2: what changed for your ten review notes

Film: `renders/french-in-india.mp4` (1920×1080, 30 fps, about 6:05). Times below are in the new render.

## Your notes, one by one

| # | Your note | What the video shows now | Where |
|---|---|---|---|
| 1 | 0:06–0:13 must show the two armies and the map of southern India | A close map of the Madras coast with the Adyar river, Madras and Pondicherry named. About a thousand French-led soldiers (rows of small figures under the French royal flag) form up south of the river. On "ten thousand" the Nawab's far bigger army fills the north bank under green-and-gold banners, the Adyar card appears, and the big army breaks and flows away. | 0:05–0:13, and again at 2:22–2:30 |
| 2 | The Indian subcontinent map is incomplete | The map data was rebuilt. The subcontinent is now one complete shape from Kashmir to Cape Comorin (India, Pakistan, Bangladesh, Nepal and Bhutan merged, with no modern borders drawn inside), with Sri Lanka beside it and the neighbouring lands in a muted tone. Every whole-India shot uses it. | 0:00, 0:26–0:34, 0:35, 1:14–1:19, 2:30, 4:56, 5:07–5:16, 5:28–5:38 |
| 3 | Transitions and pop-ups are slightly off track | Whip pans now slide both shots together with a smooth blur (24 blended positions, where the old one showed 6 ghost copies) and last 0.36 s. Every pop-up is timed to its spoken word. A new automatic check (`node tools/capture.mjs audit`) tests every pop-up 5 times a second: none overlaps the era bar, the caption, the frame edge or another pop-up. | whole film |
| 4 | French flag from the Wikipedia list | 1664–1763: the royal flag, white strewn with gold fleurs-de-lis. 1950/1954: the blue-white-red tricolour (adopted 1794, per the list). The Pondicherry surrender is now shown by the French flag coming down and the English flag going up, since a white flag would look like the French flag itself. | every flag |
| 5 | Madagascar is not shown properly | Madagascar is drawn whole, with the African coast beside it and both labelled. The French flag droops at the settlement in the south-east and coins sink into the sea. A stray white line across the ocean maps is gone (it was Fiji's outline smeared across the date line in the source data). | 0:52–0:57 |
| 6 | 1:00–1:03 must show the factory opening in Surat | A warehouse on the river at Surat: the doors swing open on "opened", the French flag goes up, a "FRENCH FACTORY" sign appears on "factory", and bales, barrels and crates stack up outside. Caron stands beside it. | 0:59–1:04 |
| 7 | 0:21–1:30 doesn't follow the voice-over; Bijapur state not shown | Every shot in this stretch was rebuilt to show what is being said (see the audit below). The Bijapur Sultanate now inks onto the map of south India, is labelled on "Bijapur", and Sher Khan Lodi's card points to his seat. The grant then travels to the coast and a French flag marks the site. | 0:21–1:31 |
| 8 | From 1:32, box-like animation; e.g. "Pondicherry grew" must show Pondicherry growing | Pondicherry is now a town on the shore that builds itself: first huts, then the fort with the French flag, more houses, a church; ships offshore. The same town is used when the Dutch take it (Dutch ships arrive, the flags swap) and when the treaty returns it. All other box-like shots were replaced too: see the audit. | 1:31–1:48 and the audit |
| 9 | All animations in line with the voice-over | Done shot by shot; the full list is in the audit below. | whole film |
| 10 | 4:27–4:30 shows the wrong supply line; it must run from France to India | A wide map from France to India: the French supply line draws itself as a long, thin, broken blue line from France, round the Cape of Good Hope, past Mauritius, to Pondicherry, with a ship on its tip. The short thick crimson line from Bengal to Madras sits beside it for contrast. The narration line now says "by sea from France" (it said "overland"). | 4:26–4:30 |

## Audit: box-like or off-voice shots that were replaced

| Voice-over | Before | Now |
|---|---|---|
| "How did France beat an army ten times its size, and still lose India?" | a chessboard and two blocks of dots | the whole subcontinent: French blue spreads over the south, a "1 : 10" slip, then the blue drains away on "lose India" |
| "a French governor was choosing who sat on India's thrones" | Dupleix at a chessboard in a room | Dupleix beside the map of south India; crowns come down on the kings standing at Hyderabad and in the Carnatic |
| "France executed its own general, the Comte de Lally" | an empty room with a coat on a chair | General Lally stands in the room; on "executed" he is gone, the candle goes out and a GUILTY seal stamps (the execution itself is still never shown) |
| "The French were the last Europeans to arrive" | four tiny flags | the whole subcontinent with the Portuguese, Dutch, English and Danish flags, each labelled |
| "so they had to move fast" | a short line at the map edge | the voyage map: a ship races from France round Africa toward India |
| "So it turned to India" | a push-in on the map | a ship sails from Madagascar to Surat |
| "a governor under the Sultan of Bijapur granted them a site" | two figures on a beach | the Bijapur state on the map, the governor's card, the grant travelling to the coast |
| "Pondicherry grew… Martin turned it into the heart of French India" | a street grid in a box | the town growing on the shore; Martin in front of it; the capital card |
| "the Dutch captured Pondicherry… a peace treaty got it back" | orange ink over the grid | Dutch ships arrive, the French flag comes down and the Dutch flag goes up; then the reverse |
| "it built a safety net: French islands…" | grid lines over the sea | dashed links from Mauritius and Réunion to Pondicherry, then a sea lane with a ship |
| "captured Madras from the English" | blue ink on a pin | Fort St George: the English flag comes down, the French flag goes up |
| "The French had promised Madras to the Nawab. But they kept it" | a scroll beside the Nawab | Dupleix holds the promise out to the Nawab, then pulls it back |
| "the Nawab sent an army" | three small flags | an army of figures marches from Arcot toward Madras |
| "a small, drilled army could beat a far bigger one" | two blocks of dots | a small neat formation of soldiers facing a big loose crowd |
| "handed Madras back to the English" | ink on a pin and a scroll | the flags swap back on the fort; the treaty named |
| the kingmaker chapters (2:50–3:11, 3:41–3:50, 4:02–4:08, 5:40–5:48, 5:56–6:05) | a chessboard box covering the map | the pieces stand on the real map of south India: the four princes as kings at Hyderabad and in the Carnatic, French and English pieces behind them |
| "at Ambur, Dupleix's side won" | two flags | the two armies of figures at Ambur on the map |
| "his successor signed a truce with the English" | a scroll on blank paper | two officials at a table under their flags; the truce is sealed |
| "he pushed them back toward Madras" | chess pawns on a board | on the Carnatic map the French army advances north and the English fall back on Madras |
| "at Wandiwash…" | blocks of dots | the map first (both armies converge on Wandiwash), then Lally and Coote with armies of figures |
| "the city surrendered" | a white flag | the French flag comes down over Pondicherry and the English flag goes up |
| "The Treaty of Paris" | a scroll on blank paper | a French and an English envoy sign and seal it |
| "Plassey… But it was Wandiwash" | two seals on blank paper | the two seals stamp where the battles happened on the whole map |
| "So the blame fell on one man" | an empty chair | Lally stands alone in the Paris room |
| "after a vote at Kizhur" | a ballot box alone | representatives queue at the ballot box |
| "a company that waits for orders from Paris can't outlast one that pays for itself from Bengal" | a split screen | the voyage map with the orders crawling by ship from France, then the crimson line from Bengal pulsing with coins |

## Checks on the reworked film
- Engine check: OK. No shot has a gap of 4 s or more between visual events.
- Layout audit: no pop-up overlaps the era bar, the caption, the frame edge or another pop-up.
- The narration was re-recorded for the one changed line.

## Things to know
- The skill `skills/lemo-opusca` was not found in the repo or in the installed skills, so it was not used.
- Britannica refused the request for the reference map (HTTP 403). The subcontinent is built from Natural Earth outlines. Aksai Chin is added as an approximate polygon, because Natural Earth draws that area inside China.
- The Bijapur state's outline is approximate: from the west coast near Goa across the Karnataka plateau to the Carnatic lowlands.
- Not checked against a source: the Portuguese, Dutch, English and Danish flags, and the towns they are placed at (Goa, Pulicat, Surat, Tranquebar). Only the French flags were taken from the Wikipedia list.
- "By sea from France": Lally's expedition sailed from France and reached Pondicherry in April 1758, and he lacked naval support. The exact route drawn (round the Cape, via Mauritius) is the standard sea route, not quoted from a source.
- The ink no longer covers land a side did not hold: French blue covers the south, English red covers Bengal and the Carnatic coast.
