"""Build data/geo.json from Natural Earth (world-atlas 2.0.2, ISC licence; public-domain data).

  ~/.faceless-shorts/venv/bin/python tools/make_geo.py path/to/world-atlas/package

Sets (rings of [lon, lat], rounded to 0.01 degree):
  subcontinent   India + Pakistan + Bangladesh + Nepal + Bhutan merged into ONE outline (no modern borders inside),
                 plus the Siachen Glacier area and an APPROXIMATE Aksai Chin polygon so the north is not cut short.
                 The first ring is the mainland (the largest); the rest are islands (Andamans, Nicobars, ...).
  asia           all land around the subcontinent (lon 40-132, lat -2-46): the neighbours, drawn muted
  indian_ocean   East Africa, Madagascar, the Mascarenes, Arabia, India (lon 25-102, lat -36-32)
  europe         lon -12-32, lat 35-61
  world          1:110m land for the France -> India voyage view (lon -85-165, lat -52-66)
Needs shapely (uv pip install shapely).
"""
import json, sys
from pathlib import Path
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union

PKG = Path(sys.argv[1])

def load(name, obj):
    topo = json.loads((PKG / name).read_text()); sc, tr = topo['transform']['scale'], topo['transform']['translate']
    arcs = []
    for a in topo['arcs']:
        x = y = 0; pts = []
        for dx, dy in a:
            x += dx; y += dy; pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
        arcs.append(pts)
    def arc(i): return arcs[i] if i >= 0 else arcs[~i][::-1]
    def ring(idx):
        out = []
        for k, i in enumerate(idx): out += arc(i)[1 if k else 0:]
        return out
    feats = []
    for g in topo['objects'][obj]['geometries']:
        if g.get('arcs') is None: continue
        polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
        shp = []
        for poly in polys:
            ext = ring(poly[0]); xs = [q[0] for q in ext]; ys = [q[1] for q in ext]
            if xs and max(xs) - min(xs) > 300 and max(ys) - min(ys) < 8: continue   # a polygon smeared across the date line (Fiji): drop it
            if len(ext) >= 4:
                p = Polygon(ext, [ring(h) for h in poly[1:] if len(ring(h)) >= 4])
                shp.append(p if p.is_valid else p.buffer(0))
        feats.append(((g.get('properties') or {}).get('name'), unary_union(shp)))
    return feats

def rings(geom, tol, min_area=0.0):
    geom = geom.simplify(tol, preserve_topology=True)
    polys = list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]
    polys = [p for p in polys if not p.is_empty and p.area >= min_area]
    polys.sort(key=lambda p: -p.area)
    return [[[round(x, 2), round(y, 2)] for x, y in p.exterior.coords] for p in polys]

land50 = unary_union([g for _, g in load('land-50m.json', 'land')])
land110 = unary_union([g for _, g in load('land-110m.json', 'land')])
countries = dict(load('countries-50m.json', 'countries'))
names = ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Bhutan', 'Siachen Glacier']
missing = [n for n in names if n not in countries]
if missing: raise SystemExit(f'missing countries: {missing}')
aksai = Polygon([(77.8, 35.5), (78.0, 34.3), (78.9, 33.6), (79.5, 33.9), (80.3, 34.6), (80.3, 35.6), (79.0, 36.0), (78.0, 35.9)])   # approximate
sub = unary_union([countries[n] for n in names] + [aksai]).buffer(0.02).buffer(-0.02)       # close hairline seams

res = {
    'source': 'Natural Earth 1:50m and 1:110m via world-atlas 2.0.2 (ISC); subcontinent = India+Pakistan+Bangladesh+Nepal+Bhutan merged, Aksai Chin approximate',
    'subcontinent': rings(sub, 0.03, 0.01),
    'asia': rings(land50.intersection(box(40, -2, 132, 46)), 0.05, 0.02),
    'indian_ocean': rings(land50.intersection(box(25, -36, 102, 32)), 0.05, 0.004),
    'europe': rings(land50.intersection(box(-12, 35, 32, 61)), 0.03, 0.01),
    'world': rings(land110.intersection(box(-85, -52, 165, 66)), 0.1, 0.3),
}
out = Path(__file__).resolve().parent.parent / 'data/geo.json'
out.write_text(json.dumps(res, separators=(',', ':')))
print(out, {k: (len(v), sum(map(len, v))) for k, v in res.items() if k != 'source'}, out.stat().st_size // 1024, 'KB')
