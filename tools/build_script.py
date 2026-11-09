"""review/PLAN.md -> script.json (one line per cut). Phonetic spellings go into "text" only (section 11 of the brief);
"caps" keep the correct spellings. Each chapter's last line gets a longer gap for the chapter card (+ sting).

  python3 tools/build_script.py
"""
import json, re
from pathlib import Path
R = Path(__file__).resolve().parent.parent
plan = (R / 'review/PLAN.md').read_text()
PHON = [('Comte de Lally', 'Kont duh Lally'), ('Colbert', 'Kol-bair'), ('Caron', 'Ka-ron'), ('Marcara', 'Mar-kaa-ra'),
        ('Masulipatnam', 'Mussoo-lee-putnam'), ('Chandernagore', 'Chun-der-na-gore'), ('Sher Khan Lodi', 'Shayr Khaan Lo-dee'),
        ('Bijapur', 'Bee-jah-poor'), ('Pondicherry', 'Pon-di-cherry'), ('Réunion', 'Ray-oon-yon'), ('La Bourdonnais', 'La Boor-do-nay'),
        ('Adyar', 'Ud-yaar'), ('Dupleix', 'Doo-play'), ('Muzaffar Jang', 'Moo-zaf-far Jung'), ('Chanda Sahib', 'Chun-da Saa-hib'),
        ('Ambur', 'Aam-boor'), ('Anwar-ud-din', 'Un-war-ood-deen'), ('Bussy', 'Boo-see'), ('Arcot', 'Aar-kot'),
        ('Wandiwash', 'Won-dee-wosh'), ('Eyre Coote', 'Air Koot'), ('Kizhur', 'Kee-zhoor')]
lines, sources, ch = [], [], -1
for l in plan.splitlines():
    if l.startswith('## CH'): ch = int(l[5])
    m = re.match(r'^\| (\d+)\.(\d+) \| (.*?) \| (.*?) \| (.*) \|$', l)
    if not m: continue
    text, caps = m.group(3).strip(), m.group(4).replace('\\|', '|').strip()
    spoken = text
    for a, b in PHON: spoken = spoken.replace(a, b)
    lines.append({'text': spoken, 'caps': caps, 'chapter': ch, 'cut': f'{m.group(1)}.{m.group(2)}', 'shot': m.group(5).strip()})
for i, ln in enumerate(lines):
    if i + 1 < len(lines) and lines[i + 1]['chapter'] != ln['chapter']: ln['gap'] = 1.8     # chapter card beat (1.6 s card + sting)
# half-beat pause BEFORE each cliffhanger line and before "It was a supply line." (on the previous line's gap)
for i, ln in enumerate(lines):
    if i and 'half-beat pause before' in ln['shot'] and 'gap' not in lines[i - 1]: lines[i - 1]['gap'] = 0.55
    if ln['cut'] == '5.5': lines[i - 1]['gap'] = 0.5; ln['gap'] = 0.9                         # the Chanda Sahib silence beat
src = plan[plan.index('## Sources'):].splitlines()[1:]
sources = [s.lstrip('- ').strip() for s in src if s.strip().startswith('-')]
S = {'title': 'So Close to Empire: The French in India, 1664-1954', 'voice': 'bm_george', 'speed': 1.0, 'lead': 0.5, 'outro': 2.0,
     'gap': 0.25, 'music': 'chapters', 'sources': sources,
     'lines': [{k: v for k, v in ln.items() if k != 'shot'} for ln in lines]}
(R / 'script.json').write_text(json.dumps(S, indent=1, ensure_ascii=False))
print(len(lines), 'lines,', sum(len(l['caps'].replace('|', ' ').split()) for l in lines), 'caption words')
