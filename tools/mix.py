"""Inside Out soundtrack: narration + soft procedural sound effects + a quiet music bed, all made here with numpy.
No samples, no AI audio, no downloads.

  python3 tools/mix.py [project=.]          → data/mix.wav (48 kHz stereo)

Reads data/cues.json (node tools/capture.mjs cues), data/narration.wav if it exists (voice.py or words.py --audio),
and script.json "music": "bed" (the procedural score, default) · "none" · "audio/your-track.mp3" (your own royalty-free
track, any format ffmpeg reads). The music ducks under the voice.

Sound rules (STYLE.md): every effect is soft and rounded, nothing above ~5 kHz, no ticks / hats / glitches / beeps.
Cue types: whoosh slide pop plop gulp boing bubbles sizzle sparkle thud slam tock zip alarm  (+ gain, dur)
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

P = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
SR = 48000
rng = np.random.default_rng(11)
cj = json.loads((P / 'data/cues.json').read_text())
script = json.loads((P / 'script.json').read_text())
DUR = float(cj['duration'])
N = int(DUR * SR) + SR // 10


def lp(x, f, o=2): b, a = signal.butter(o, min(f, SR / 2 - 100) / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, o=2): b, a = signal.butter(o, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def bp(x, f0, f1, o=2): b, a = signal.butter(o, [f0 / (SR / 2), f1 / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def db(x): return 10 ** (x / 20)
def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=None):
    """attack a seconds then exponential release over the rest"""
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    rest = n - na; e[na:] = np.exp(-np.linspace(0, r or 5, rest)) if rest > 0 else 1; return e
def sweep(f0, f1, d, shape='exp'):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d) if shape == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d): return rng.standard_normal(int(d * SR))


# ---------- the effects ----------
def whoosh(d=0.38, **_):
    n = noise(d); lo, hi = lp(n, 500), lp(n, 2200)
    k = np.sin(np.pi * np.linspace(0, 1, len(n))); x = (lo * (1 - k) + hi * k) * k ** 1.5
    return x / (np.abs(x).max() + 1e-9) * 0.5
def slide(d=1.0, **_):
    n = lp(noise(d), 700); e = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 2
    return n / (np.abs(n).max() + 1e-9) * e * 0.35 + sweep(260, 120, d) * e * 0.08
def pop(**_): x = sweep(560, 240, 0.11) * env(int(0.11 * SR), 0.002, 6); return lp(x, 3000) * 0.7
def plop(**_): x = sweep(700, 180, 0.14) * env(int(0.14 * SR), 0.002, 5); return lp(x, 2500) * 0.6
def gulp(**_):
    a = sweep(320, 140, 0.16) * env(int(0.16 * SR), 0.01, 4); b = sweep(240, 90, 0.2) * env(int(0.2 * SR), 0.01, 4)
    x = np.concatenate([a, np.zeros(int(0.04 * SR)), b]); return lp(x, 1800) * 0.8
def boing(**_):
    d = 0.42; t = tt(d); f = 200 * (1 + 0.6 * t / d) * (1 + 0.08 * np.sin(2 * np.pi * 18 * t))
    return lp(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, 4), 2000) * 0.55
def bubbles(d=2.0, **_):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * 7)):
        st = rng.integers(0, max(1, len(x) - int(0.08 * SR))); f = rng.uniform(380, 900); b = sweep(f, f * 1.6, 0.06) * env(int(0.06 * SR), 0.003, 5)
        x[st:st + len(b)] += b * rng.uniform(0.2, 0.5)
    return lp(x, 2500) * 0.5
def sizzle(d=1.0, **_):
    n = bp(noise(d), 1800, 4500); crack = (rng.random(len(n)) < 0.002).astype(float); crack = lp(crack, 300) * 40
    e = np.minimum(1, np.linspace(0, 6, len(n))) * np.linspace(1, 0.2, len(n)); return n * (0.4 + crack) * e * 0.12
def sparkle(d=1.2, **_):
    notes = [784, 880, 1047, 1175, 1319, 1568]; x = np.zeros(int(d * SR) + SR // 2)
    for k, f in enumerate(notes):
        st = int(k * d / len(notes) * SR); n = int(0.4 * SR); t = tt(0.4)
        x[st:st + n] += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.004, 6) * 0.22
    return lp(x, 4500)
def thud(**_):
    d = 0.35; t = tt(d); x = np.sin(2 * np.pi * (70 + 40 * np.exp(-t * 30)) * t) * env(len(t), 0.002, 7)
    return x * 0.9 + lp(noise(d), 220) * env(len(t), 0.001, 12) * 0.3
def slam(**_):
    d = 0.5; t = tt(d); x = np.sin(2 * np.pi * (60 + 60 * np.exp(-t * 25)) * t) * env(len(t), 0.002, 6)
    return np.tanh(1.6 * (x + lp(noise(d), 1200) * env(len(t), 0.001, 10) * 0.6)) * 0.9
def tock(**_): d = 0.09; t = tt(d); return (np.sin(2 * np.pi * 420 * t) + 0.3 * np.sin(2 * np.pi * 840 * t)) * env(len(t), 0.001, 9) * 0.35
def zip_(**_):
    d = 0.32; n = bp(noise(d), 400, 3000); k = np.linspace(0, 1, len(n))
    return (n / (np.abs(n).max() + 1e-9) * 0.35 + sweep(300, 1100, d) * 0.12) * np.sin(np.pi * k) ** 1.2
def alarm(d=2.0, **_):
    x = np.zeros(int(d * SR)); one = np.sin(2 * np.pi * 150 * tt(0.22)) * env(int(0.22 * SR), 0.02, 5)
    for st in np.arange(0, d - 0.25, 0.5): i = int(st * SR); x[i:i + len(one)] += one
    return lp(x, 900) * 0.55

def inhale(d=1.0, **_):
    n = bp(noise(d), 300, 2600); k = np.linspace(0, 1, len(n)); e = np.sin(np.pi * np.minimum(1, k * 1.15)) ** 1.5 * (0.6 + 0.4 * k)
    return n / (np.abs(n).max() + 1e-9) * e * 0.5
def heartbeat(**_):
    one = lambda d, f: np.sin(2 * np.pi * f * tt(d)) * env(int(d * SR), 0.004, 7)
    x = np.concatenate([one(0.16, 58), np.zeros(int(0.09 * SR)), one(0.2, 52) * 0.75]); return lp(x, 300) * 1.0


# ---------- Paper Atlas 16:9 effects (French in India): paper, wax, wood, cloth; all soft, nothing above ~5 kHz ----------
def snapthump(**_):
    d = 0.3; t = tt(d); body = np.sin(2 * np.pi * (90 + 50 * np.exp(-t * 28)) * t) * env(len(t), 0.002, 9)
    flick = bp(noise(0.06), 1200, 3800) * env(int(0.06 * SR), 0.001, 6) * 0.5; x = body * 0.9; x[:len(flick)] += flick; return x
def swell(d=1.2, **_):
    n = lp(noise(d), 900); k = np.linspace(0, 1, len(n)); e = k ** 2 * (1 - k) * 4; return n / (np.abs(n).max() + 1e-9) * e * 0.35
def brush(d=0.8, **_):
    n = bp(noise(d), 300, 1800); k = np.linspace(0, 1, len(n)); e = np.sin(np.pi * k) ** 0.8 * (1 + 0.3 * np.sin(2 * np.pi * 7 * k)); return n / (np.abs(n).max() + 1e-9) * e * 0.4
def quill(d=1.0, **_):
    n = bp(noise(d), 1500, 4200); k = np.arange(len(n)) / SR; am = (np.sin(2 * np.pi * 9 * k + np.sin(2 * np.pi * 2.3 * k) * 3) > 0.2).astype(float)
    am = lp(am, 60); return n / (np.abs(n).max() + 1e-9) * am * 0.22 * np.minimum(1, k * 8) * np.minimum(1, (k[-1] - k) * 8 + 0.01)
def parchment(**_):
    d = 0.4; n = bp(noise(d), 500, 3000); k = np.linspace(0, 1, len(n)); x = n / (np.abs(n).max() + 1e-9) * np.sin(np.pi * k) ** 1.5 * 0.4
    p = pop(); x[-len(p):] += p * 0.4; return x
def click(**_):
    d = 0.12; t = tt(d); return (np.sin(2 * np.pi * 950 * t) * 0.6 + np.sin(2 * np.pi * 1700 * t) * 0.3) * env(len(t), 0.0008, 14) + lp(noise(d), 2500) * env(len(t), 0.0005, 30) * 0.4
def waxthud(**_):
    d = 0.35; t = tt(d); return np.sin(2 * np.pi * (80 + 30 * np.exp(-t * 20)) * t) * env(len(t), 0.002, 8) * 0.9 + lp(noise(d), 600) * env(len(t), 0.001, 16) * 0.35
def pageturn(**_):
    d = 0.55; n = bp(noise(d), 600, 3500); k = np.linspace(0, 1, len(n)); flap = 0.6 + 0.4 * np.sin(2 * np.pi * 16 * k * (1 - k))
    return n / (np.abs(n).max() + 1e-9) * np.sin(np.pi * k) ** 1.2 * flap * 0.45
def flutter(d=0.8, **_):
    n = bp(noise(d), 200, 1400); k = np.arange(len(n)) / SR; return n / (np.abs(n).max() + 1e-9) * (0.5 + 0.5 * np.sin(2 * np.pi * 11 * k)) * 0.3
def coins(**_):
    x = np.zeros(int(0.7 * SR))
    for k, f in enumerate([1900, 2350, 2100, 2600]):
        st = int((0.04 + k * 0.11) * SR); n = int(0.25 * SR); t = tt(0.25)
        x[st:st + n] += (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.48 * t)) * env(n, 0.001, 9) * 0.25
    return lp(x, 4500)
def puff(**_):
    d = 0.4; n = lp(noise(d), 1200); k = np.linspace(0, 1, len(n)); return n / (np.abs(n).max() + 1e-9) * np.exp(-k * 6) * np.minimum(1, k * 40) * 0.5
def door(**_):
    d = 1.1; t = tt(d); creak = np.sin(2 * np.pi * np.cumsum(180 + 60 * np.sin(2 * np.pi * 3 * t)) / SR) * np.minimum(1, t / 0.1) * np.exp(-t * 3) * 0.15
    boom = np.zeros(len(t)); bt = tt(0.5); i = int(0.6 * SR); boom[i:i + len(bt)] = np.sin(2 * np.pi * (55 + 30 * np.exp(-bt * 20)) * bt) * env(len(bt), 0.002, 6)
    return lp(creak, 1500) + boom
def gavel(**_):
    one = lambda: (np.sin(2 * np.pi * 520 * tt(0.15)) * 0.5 + lp(noise(0.15), 1800) * 0.5) * env(int(0.15 * SR), 0.0008, 12)
    return np.concatenate([one(), np.zeros(int(0.18 * SR)), one() * 0.9])
def ballot(**_): return np.concatenate([parchment() * 0.6, np.zeros(int(0.1 * SR)), thud() * 0.5])
def drums(d=3.0, **_):
    x = np.zeros(int(d * SR)); hit = lambda g: (np.sin(2 * np.pi * (110 + 40 * np.exp(-tt(0.3) * 25)) * tt(0.3)) * env(int(0.3 * SR), 0.002, 9) + lp(noise(0.3), 900) * env(int(0.3 * SR), 0.001, 20) * 0.4) * g
    beat = 60 / 108
    for k in range(int(d / (beat / 2))):
        if k % 8 in (0, 2, 3, 4, 6):
            i = int(k * beat / 2 * SR); h = hit(1.0 if k % 8 == 0 else 0.55)
            if i + len(h) < len(x): x[i:i + len(h)] += h
    return lp(x, 2000) * np.minimum(1, np.linspace(0, d, len(x)) / 0.6)
def thunder(**_):
    d = 2.5; n = lp(noise(d), 160); k = np.linspace(0, 1, len(n)); return n / (np.abs(n).max() + 1e-9) * np.minimum(1, k * 20) * np.exp(-k * 3) * (1 + 0.5 * np.sin(2 * np.pi * 3 * k))
def sting(**_):
    d = 1.4; x = np.zeros(int(d * SR))
    for st, f in [(0.0, 233.1), (0.18, 246.9)]:                   # an unresolved minor second
        i = int(st * SR); n = len(x) - i; t = tt(n / SR); x[i:] += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env(n, 0.01, 4) * 0.5
    return lp(x, 2500)

# ---------- ambience beds (foley under the music): name -> generator of d seconds ----------
def amb_gen(name, d):
    n = int(d * SR); t = np.arange(n) / SR
    if name == 'wind': x = lp(noise(d), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 5.3))
    elif name == 'room': x = lp(noise(d), 300) * 0.5 + np.sin(2 * np.pi * 60 * t) * 0.02
    elif name == 'street':
        x = lp(noise(d), 700) * 0.6
        for k in range(int(d * 1.2)):                                   # distant cart wheels / steps
            i = rng.integers(0, max(1, n - SR // 4)); h = lp(noise(0.08), 900) * env(int(0.08 * SR), 0.002, 10); x[i:i + len(h)] += h * 1.5
    elif name == 'court':                                               # murmur: band noise with syllable-rate modulation
        x = bp(noise(d), 250, 1100) * (0.55 + 0.45 * lp(rng.standard_normal(n), 6) / 0.05).clip(0, 2)
    elif name == 'pulse':                                               # the sly low pulse under the chess game
        x = np.zeros(n); beat = 60 / 72
        for k in range(int(d / beat)):
            i = int(k * beat * SR); h = np.sin(2 * np.pi * 55 * tt(0.4)) * env(int(0.4 * SR), 0.01, 6)
            if i + len(h) < n: x[i:i + len(h)] += h
    elif name == 'rain': x = bp(noise(d), 800, 4200) * 0.5 + lp(noise(d), 200) * 0.3
    elif name == 'gulls':
        x = lp(noise(d), 600) * 0.4
        for k in range(int(d * 0.8)):
            i = rng.integers(0, max(1, n - SR)); c = sweep(1400, 900, 0.25) * env(int(0.25 * SR), 0.02, 3); x[i:i + len(c)] += c * 1.2
            if i + len(c) * 2 < n: x[i + len(c):i + 2 * len(c)] += c * 0.8
    elif name == 'crowd': x = bp(noise(d), 200, 900) * (0.7 + 0.3 * lp(rng.standard_normal(n), 2) / 0.05).clip(0, 1.5) * 0.7
    elif name == 'market':
        x = bp(noise(d), 300, 1500) * (0.6 + 0.4 * lp(rng.standard_normal(n), 4) / 0.05).clip(0, 2)
    elif name == 'sea': x = lp(noise(d), 600) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 4.0) ** 2)
    else: x = lp(noise(d), 400)
    k = np.minimum(1, np.minimum(t, t[-1] - t) / 0.6); return x / (np.abs(x).max() + 1e-9) * k

FX = dict(inhale=inhale, heartbeat=heartbeat, whoosh=whoosh, slide=slide, pop=pop, plop=plop, gulp=gulp, boing=boing, bubbles=bubbles, sizzle=sizzle,
          sparkle=sparkle, thud=thud, slam=slam, tock=tock, zip=zip_, alarm=alarm, snapthump=snapthump, swell=swell, brush=brush, quill=quill,
          parchment=parchment, click=click, waxthud=waxthud, pageturn=pageturn, flutter=flutter, coins=coins, puff=puff, door=door, gavel=gavel,
          ballot=ballot, drums=drums, thunder=thunder, sting=sting)
LEVEL = dict(inhale=-15, heartbeat=-8, whoosh=-17, slide=-19, pop=-14, plop=-15, gulp=-11, boing=-15, bubbles=-21, sizzle=-18, sparkle=-17,
             thud=-11, slam=-9, tock=-18, zip=-14, alarm=-17, snapthump=-17, swell=-24, brush=-21, quill=-24, parchment=-21, click=-17,
             waxthud=-16, pageturn=-19, flutter=-24, coins=-22, puff=-20, door=-15, gavel=-15, ballot=-17, drums=-19, thunder=-17, sting=-18)


# ---------- the music bed: soft pad + plucked arpeggio, 100 BPM, I–vi–IV–V ----------
def music_bed():
    bpm = 100; beat = 60 / bpm; bar = beat * 4
    chords = [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]]
    x = np.zeros(N)
    nb = int(np.ceil(DUR / bar)) + 1
    for b in range(nb):
        ch = chords[b % 4]; st = int(b * bar * SR); n = int(bar * SR)
        if st >= N: break
        t = tt(bar); e = np.minimum(1, t / 0.4) * np.minimum(1, (bar - t) / 0.4)
        pad = sum(np.sin(2 * np.pi * f / 2 * t) + 0.25 * np.sin(2 * np.pi * f * t) for f in ch) * e * 0.10
        x[st:st + n] += pad[:max(0, min(n, N - st))]
        for k in range(8):                                                       # eighth-note pluck arpeggio
            f = ch[[0, 1, 2, 1, 2, 0, 1, 2][k]] * (2 if k % 4 == 2 else 1); ps = st + int(k * beat / 2 * SR); pn = int(0.5 * SR)
            if ps + pn >= N: continue
            pt = tt(0.5); pl = (np.sin(2 * np.pi * f * pt) + 0.35 * np.sin(4 * np.pi * f * pt)) * env(pn, 0.003, 7) * 0.12
            x[ps:ps + pn] += pl
    x = lp(x, 3200)
    fade = np.ones(N); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo)
    return x / (np.abs(x).max() + 1e-9) * fade

def music_tension():
    """low drone + slow minor pulse, for mysterious / tense explainers (script.json "music": "tension")"""
    t = np.arange(N) / SR; x = np.zeros(N)
    for f, g in [(55, 0.5), (82.4, 0.3), (110, 0.2), (130.8, 0.12)]: x += np.sin(2 * np.pi * f * t + np.sin(t * 0.3) * 0.5) * g
    x *= 0.55 + 0.45 * np.sin(2 * np.pi * t / 8) ** 2
    beat = 60 / 84; ping = lambda f: (np.sin(2 * np.pi * f * tt(1.2)) + 0.3 * np.sin(4 * np.pi * f * tt(1.2))) * env(int(1.2 * SR), 0.01, 5)
    seq = [220.0, 261.6, 196.0, 174.6]
    for k in range(int(DUR / (beat * 2))):
        i = int(k * beat * 2 * SR); pg = ping(seq[(k // 2) % 4]) * 0.35
        if i + len(pg) < N: x[i:i + len(pg)] += pg
    x = lp(x, 2200); fade = np.ones(N); fo = int(1.5 * SR); fade[-fo:] = np.linspace(1, 0, fo); fi = int(0.8 * SR); fade[:fi] *= np.linspace(0, 1, fi)
    return x / (np.abs(x).max() + 1e-9) * fade

def section(kind, n, seed=0):
    """one chapter's music, n samples: bed (light courtly), pulse (bed + sly low pulse), tension, rising (bed -> tension),
    minor (slow, minor), warm (resolving only at the very end)"""
    global N, DUR
    keepN, keepD = N, DUR; N, DUR = n, n / SR
    try:
        if kind in ('bed', 'pulse', 'warm'):
            x = music_bed()
            if kind == 'pulse':
                t = np.arange(n) / SR; x = x + np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * t * 72 / 60))) * 0.12
            if kind == 'warm':                                            # hold the dominant until the last 3 s, then resolve
                t = np.arange(n) / SR; res = np.zeros(n); r0 = max(0, n - int(3.5 * SR)); rt = t[: n - r0]
                res[r0:] = sum(np.sin(2 * np.pi * f * rt) for f in (130.8, 196.0, 261.6, 329.6)) * np.minimum(1, rt / 0.4) * np.exp(-rt * 0.4) * 0.12
                x = x + res
        elif kind == 'rising':
            a, b = music_bed(), music_tension(); k = np.clip(np.linspace(-0.6, 1.4, n), 0, 1)[:len(a)]; x = a * (1 - k) + b * k
        elif kind == 'minor':
            t = np.arange(n) / SR; x = np.zeros(n)
            for i, ch in enumerate([[220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7], [164.8, 207.7, 246.9]]):
                for b in range(i, int(DUR / 3.2) + 1, 4):
                    st = int(b * 3.2 * SR); m = min(int(3.2 * SR), n - st)
                    if m <= 0: continue
                    tt2 = t[:m]; e = np.minimum(1, tt2 / 0.6) * np.minimum(1, (3.2 - tt2) / 0.6)
                    x[st:st + m] += sum(np.sin(2 * np.pi * f / 2 * tt2) for f in ch) * e * 0.12
            x = lp(x, 1800)
        else: x = music_tension()
    finally:
        N, DUR = keepN, keepD
    return x / (np.abs(x).max() + 1e-9)

def chapter_music():
    """script.json "music": "chapters": one section per chapter (data/cues.json "chapters"), 1 s crossfades"""
    chs = cj.get('chapters') or []; x = np.zeros(N); xf = int(1.0 * SR)
    for c in chs:
        a = int(c['start'] * SR); b = min(N, int(c['end'] * SR) + xf)
        if b <= a: continue
        m = section(c.get('music', 'bed'), b - a)
        ramp = np.ones(b - a); ramp[:xf] = np.linspace(0, 1, xf) if a > 0 else 1; ramp[-xf:] = np.minimum(ramp[-xf:], np.linspace(1, 0, xf)) if b < N else ramp[-xf:]
        x[a:b] += m * ramp
    fade = np.ones(N); fo = int(1.5 * SR); fade[-fo:] = np.linspace(1, 0, fo); return x * fade

def load_audio(f):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(out, dtype=np.float32).reshape(-1, 2).astype(np.float64); return a


mix = np.zeros((N, 2))
# voice
vf = P / 'data/narration.wav'
voice = None
if vf.exists():
    v = load_audio(vf)[:N]; voice = np.zeros((N, 2)); voice[:len(v)] = v
    rms = np.sqrt(np.mean(voice ** 2) + 1e-12); voice *= db(-19) / rms
    mix += voice
# music
mus = script.get('music', 'bed')
if mus and mus != 'none':
    m = music_bed() if mus == 'bed' else music_tension() if mus == 'tension' else chapter_music() if mus == 'chapters' else None
    if m is None:
        a = load_audio(P / mus)[:N]; m = np.zeros(N); m[:len(a)] = a.mean(1); m /= np.abs(m).max() + 1e-9
    m = np.stack([m, m], 1) * db(-24 if voice is not None else -20)
    if voice is not None:                                                        # duck under the voice
        lev = np.abs(voice.mean(1)); lev = signal.lfilter([1 - 0.9995], [1, -0.9995], lev); lev /= lev.max() + 1e-9
        m *= (1 - 0.55 * np.clip(lev * 3, 0, 1))[:, None]
    mix += m
# ambience beds (foley), ducked under the voice like the music
amb = np.zeros(N)
for c in cj['cues']:
    if c['type'] != 'amb': continue
    i = int(c['t'] * SR); x = amb_gen(c['name'], c['dur']) * db(-33) * c.get('gain', 1.0); n = min(len(x), N - i)
    if n > 0: amb[i:i + n] += x[:n]
if voice is not None:
    lev = np.abs(voice.mean(1)); lev = signal.lfilter([1 - 0.9995], [1, -0.9995], lev); lev /= lev.max() + 1e-9
    amb *= (1 - 0.4 * np.clip(lev * 3, 0, 1))
mix += np.stack([amb, amb], 1)
# effects
for c in cj['cues']:
    if c['type'] == 'amb': continue
    fn = FX.get(c['type'])
    if not fn: print('unknown cue type, skipped:', c['type']); continue
    x = fn(**({'d': c['dur']} if c.get('dur') else {}))
    x = lp(x, 5000) * db(LEVEL[c['type']]) * c.get('gain', 1.0) / (np.abs(x).max() + 1e-9) * 0.9
    i = int(c['t'] * SR); n = min(len(x), N - i)
    if n > 0 and i >= 0: pan = c.get('pan', 0.0); mix[i:i + n, 0] += x[:n] * (1 - max(0, pan)); mix[i:i + n, 1] += x[:n] * (1 + min(0, pan))
# master: gentle soft-clip, peak -1 dBFS
mix = np.tanh(mix * 1.2) / 1.2
mix *= db(-1) / (np.abs(mix).max() + 1e-9)
wavfile.write(P / 'data/mix.wav', SR, (mix * 32767).astype(np.int16))
print(f"data/mix.wav: {DUR:.2f} s · voice: {'yes' if voice is not None else 'NO (captions-only)'} · music: {mus} · {len(cj['cues'])} cues")
