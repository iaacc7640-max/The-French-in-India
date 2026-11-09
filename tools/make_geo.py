"""Build data/geo.json from Natural Earth land (world-atlas land-50m.json, ISC licence, public-domain data).

  python3 tools/make_geo.py path/to/land-50m.json

Keeps the rings inside three boxes: SOUTH_ASIA (India, Bengal, Ceylon), INDIAN_OCEAN (Madagascar, Mauritius,
Reunion) and EUROPE. Coordinates are [lon, lat] rounded to 0.01 degree.
"""
import json, sys
from pathlib import Path

topo = json.loads(Path(sys.argv[1]).read_text())
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs = []
for a in topo['arcs']:
    x = y = 0; pts = []
    for dx, dy in a:
        x += dx; y += dy; pts.append((round(x * sc[0] + tr[0], 2), round(y * sc[1] + tr[1], 2)))
    arcs.append(pts)
def arc(i): return arcs[i] if i >= 0 else arcs[~i][::-1]
def ring(idx):
    out = []
    for k, i in enumerate(idx): out += arc(i)[1 if k else 0:]
    return out
def clip(poly, box):
    """Sutherland-Hodgman clip of a ring to a lon/lat box (edges outside the box land on the box border)."""
    x0, y0, x1, y1 = box
    def cut(pts, inside, inter):
        out = []
        for i, cur in enumerate(pts):
            prev = pts[i - 1]
            if inside(cur):
                if not inside(prev): out.append(inter(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(inter(prev, cur))
        return out
    def ix(xv):
        return lambda a, b: (xv, round(a[1] + (b[1] - a[1]) * (xv - a[0]) / ((b[0] - a[0]) or 1e-9), 2))
    def iy(yv):
        return lambda a, b: (round(a[0] + (b[0] - a[0]) * (yv - a[1]) / ((b[1] - a[1]) or 1e-9), 2), yv)
    pts = poly
    for inside, inter in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)), (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not pts: break
        pts = cut(pts, inside, inter)
    return pts
BOXES = {'south_asia': (66, 5, 97, 28), 'indian_ocean': (42, -27, 58, -11), 'europe': (-12, 35, 32, 61)}
res = {k: [] for k in BOXES}
for g in topo['objects']['land']['geometries']:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        r = ring(poly[0])
        for k, (x0, y0, x1, y1) in BOXES.items():
            if any(x0 <= p[0] <= x1 and y0 <= p[1] <= y1 for p in r):
                rc = clip(r, (x0, y0, x1, y1))
                if len(rc) < 4: continue
                # thin the ring: keep a point only if it moved >= 0.04 degree (keeps the look, cuts the size)
                thin = [rc[0]]
                for p in rc[1:]:
                    if abs(p[0] - thin[-1][0]) + abs(p[1] - thin[-1][1]) >= 0.04: thin.append(p)
                if len(thin) >= 4: res[k].append(thin)
out = Path(__file__).resolve().parent.parent / 'data/geo.json'
out.write_text(json.dumps({'source': 'Natural Earth 1:50m land via world-atlas 2.0.2 (ISC)', **res}, separators=(',', ':')))
print(out, {k: (len(v), sum(map(len, v))) for k, v in res.items()}, out.stat().st_size // 1024, 'KB')
