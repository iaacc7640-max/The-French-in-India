// Frame-exact capture through headless Chrome. No npm packages (Node 22+). Run from the project folder.
//   node tools/capture.mjs check                         boot, list shots + captions, report errors
//   node tools/capture.mjs events                        per-shot camera move + ev() list; flags gaps of 4 s or more
//   node tools/capture.mjs cues                          write data/cues.json (the sound cues, for tools/mix.py)
//   node tools/capture.mjs sheet review/all.jpg [step=0.5] [cols=9] [start end]   contact sheet, a frame every `step` s, time-stamped
//   node tools/capture.mjs frames review/full "1.2,8.4"  full-size JPEGs of those times
//   node tools/capture.mjs video renders/out.mp4 [start end] [--draft]   the film (30 fps) with data/mix.wav if it exists
//   node tools/capture.mjs preview                       serve the project and print a URL to watch it in a browser
// CHROME=/path/to/chrome overrides the browser.
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = +(process.env.FPS || 30);
const CHROME = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  '/usr/bin/chromium-browser', '/snap/bin/chromium', 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => p && fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const args = process.argv.slice(2), flags = new Set(args.filter((a) => a.startsWith('--')));
const [mode, ...rest] = args.filter((a) => !a.startsWith('--'));

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.otf': 'font/otf',
  '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg' };
function serve(port = 0) {
  return new Promise((res) => {
    const srv = http.createServer((req, r) => {
      const u = decodeURIComponent(req.url.split('?')[0]), f = path.join(ROOT, u === '/' ? 'index.html' : u);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
      r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(r);
    });
    srv.listen(port, '127.0.0.1', () => res(srv));
  });
}

async function openPage(port) {
  if (!CHROME) throw new Error('Chrome not found: install Google Chrome or set CHROME=/path/to/chrome');
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-chrome-'));
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--window-size=1920,1080', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', ...(process.env.SOFTWARE_GL ? ['--use-angle=swiftshader'] : []), ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []), '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
  let dbg;
  for (let i = 0; i < 200 && !dbg; i++) { try { dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim(); } catch { await sleep(100); } }
  if (!dbg) throw new Error('Chrome did not start');
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(`http://127.0.0.1:${port}/index.html?capture=1${process.env.QS || ''}`)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pend = new Map(), logs = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERROR ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const x = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (x.exceptionDetails) throw new Error(x.exceptionDetails.exception?.description || x.exceptionDetails.text); return x.result.value; };
  await send('Runtime.enable');
  for (let i = 0; ; i++) {
    const st = await ev('window.OP ? (OP.bootError ? "ERR:" + OP.bootError : OP.ready) : false').catch(() => false);
    if (st === true) break;
    if (typeof st === 'string') throw new Error('boot failed: ' + st + '\n' + logs.join('\n'));
    if (i > 1200) throw new Error('boot timeout\n' + logs.join('\n'));
    await sleep(100);
  }
  const close = () => { try { ws.close(); } catch {} chrome.kill('SIGKILL'); setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 300); };
  return { ev, logs, close };
}
const jpg = (d) => Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');
const FRAME = (t, q, label) => `(() => { const d = OP.frame(${t}, ${q}); ${label ? `const cv = document.getElementById('cv'), c = cv.getContext('2d'); c.setTransform(1,0,0,1,0,0); c.fillStyle = '#000'; c.fillRect(0, 0, 250, 86); c.fillStyle = '#fff'; c.font = '700 60px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('${(+t).toFixed(2)}', 14, 64); return cv.toDataURL('image/jpeg', ${q});` : 'return d;'} })()`;

const srv = await serve(mode === 'preview' ? 8765 : 0), port = srv.address().port;
if (mode === 'preview') { console.log(`open http://127.0.0.1:${port}/  (Ctrl+C to stop)`); }
else {
  const P = await openPage(port);
  try {
    const dur = await P.ev('OP.duration()');
    if (mode === 'check') {
      console.log(`duration ${dur.toFixed(2)} s`);
      for (const s of await P.ev('OP.shots()')) console.log(`${s.id.padEnd(5)} ${s.at.toFixed(2).padStart(6)} → ${s.end.toFixed(2).padStart(6)}  (${(s.end - s.at).toFixed(2)} s)  ${s.note}`);
      console.log('captions:'); for (const c of await P.ev('OP.captions()')) console.log(`  ${c.s.toFixed(2).padStart(6)}–${c.e.toFixed(2).padEnd(6)} ${c.text}`);
      let bad = 0; for (let t = 0; t < dur; t += 0.25) { try { await P.ev(`OP.draw(${t})`); } catch (e) { bad++; console.log(`ERROR at ${t.toFixed(2)}: ${e.message.split('\n')[0]}`); } }
      if (P.logs.length) console.log(P.logs.join('\n'));
      console.log(bad || P.logs.length ? 'CHECK FAILED' : 'CHECK OK');
    } else if (mode === 'events') {
      // per shot: its camera move, whip, and every ev() with its time; flag any span of 4 s or more with no visual event
      const shots = await P.ev('OP.shots()'), moves = await P.ev('OP.moves()'), evs = await P.ev('OP.events()'); let gaps = 0;
      shots.forEach((s, i) => {
        const m = moves[i], marks = [s.at, ...evs.filter((e) => e.t >= s.at && e.t < s.end).map((e) => e.t)];
        if (m.snapAt != null) marks.push(m.snapAt);
        marks.sort((a, b) => a - b); marks.push(s.end);
        let worst = 0; for (let k = 1; k < marks.length; k++) worst = Math.max(worst, marks[k] - marks[k - 1]);
        const flag = worst >= 4 ? '  <-- GAP ' + worst.toFixed(2) + ' s' : ''; if (flag) gaps++;
        console.log(`${s.id.padEnd(6)} ${s.at.toFixed(2).padStart(7)}-${s.end.toFixed(2).padEnd(7)} cam=${m.move}${m.whip ? ' whip=' + m.whip : ''}${m.snapAt != null ? ' snap@' + m.snapAt.toFixed(2) : ''}${flag}`);
        evs.filter((e) => e.t >= s.at && e.t < s.end).forEach((e) => console.log(`         ${e.t.toFixed(2).padStart(7)}  ${e.kind}${e.note ? '  ' + e.note : ''}`));
      });
      console.log(gaps ? `EVENTS: ${gaps} shot(s) with a gap of 4 s or more` : 'EVENTS OK: no gap of 4 s or more');
    } else if (mode === 'audit') {
      // layout audit: sample every 0.2 s and report pop-ups that overlap the era bar, the caption, the frame edge or each other
      const seen = new Map(), W = 1920, H = 1080, ov = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)), area = (a) => (a.x1 - a.x0) * (a.y1 - a.y0);
      const note = (shot, t, msg) => { const k = shot + '|' + msg; if (!seen.has(k)) seen.set(k, { t, n: 0 }); seen.get(k).n++; };
      for (let t = 0.1; t < dur; t += 0.2) {
        const a = await P.ev(`OP.audit(${t})`); if (a.inWhip) continue;
        const pops = a.boxes.filter((b) => ['slip', 'ribbon', 'card'].includes(b.kind) && b.x1 - b.x0 > 30), era = a.boxes.find((b) => b.kind === 'era'), cap = a.boxes.find((b) => b.kind === 'caption');
        for (const p of pops) {
          if (era && ov(p, era) > 150) note(a.shot, t, `${p.kind} "${p.text}" overlaps the era bar`);
          if (cap && ov(p, cap) > 150) note(a.shot, t, `${p.kind} "${p.text}" overlaps the caption`);
          if (!a.shot.startsWith('CARD') && (p.x0 < 20 || p.x1 > W - 20 || p.y0 < 4 || p.y1 > H - 4)) note(a.shot, t, `${p.kind} "${p.text}" runs off the frame`);
          if (p.y1 > 850 && !(cap && ov(p, cap) > 150)) note(a.shot, t, `${p.kind} "${p.text}" sits in the caption band (y ${p.y1})`);
        }
        for (let i = 0; i < pops.length; i++) for (let j = i + 1; j < pops.length; j++) if (ov(pops[i], pops[j]) > 0.12 * Math.min(area(pops[i]), area(pops[j]))) note(a.shot, t, `${pops[i].kind} "${pops[i].text}" overlaps ${pops[j].kind} "${pops[j].text}"`);
      }
      for (const [k, v] of seen) console.log(`${k.split('|')[0].padEnd(6)} ${v.t.toFixed(1).padStart(6)} s  ${k.split('|')[1]}  (${(v.n * 0.2).toFixed(1)} s)`);
      console.log(seen.size ? `AUDIT: ${seen.size} layout issue(s)` : 'AUDIT OK: no pop-up overlaps the era bar, the caption, the frame edge or another pop-up');
    } else if (mode === 'srt') {
      // subtitle file from the film's own caption strips (correct spellings, word-synced): node tools/capture.mjs srt review/youtube/captions-en.srt
      const caps = await P.ev('OP.captions()'), out = path.resolve(ROOT, rest[0] || 'review/captions-en.srt'), ts = (t) => { const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
      const body = caps.map((c, i) => `${i + 1}\n${ts(c.s)} --> ${ts(Math.max(c.s + 0.3, c.e - 0.02))}\n${c.text.replace(/\*/g, '')}\n`).join('\n');
      fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, body); console.log(`${out}: ${caps.length} subtitles`);
    } else if (mode === 'cues') {
      const cues = await P.ev('OP.cues()');
      fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
      const chapters = await P.ev('OP.chapters ? OP.chapters() : []');
      fs.writeFileSync(path.join(ROOT, 'data/cues.json'), JSON.stringify({ duration: dur, cues, chapters }, null, 1));
      if (chapters.length) fs.writeFileSync(path.join(ROOT, 'data/chapters.json'), JSON.stringify(chapters.map((c) => ({ ch: c.ch, year: c.year, title: c.title, start: c.start, end: c.end, music: c.music })), null, 1));
      console.log(`data/cues.json: ${cues.length} cues, ${dur.toFixed(2)} s`);
    } else if (mode === 'frames') {
      const dir = path.resolve(ROOT, rest[0] || 'review/frames'); fs.mkdirSync(dir, { recursive: true });
      for (const t of (rest[1] || '0').split(',').map(Number)) { fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.jpg`), jpg(await P.ev(FRAME(t, 0.92)))); }
      console.log(dir);
    } else if (mode === 'sheet') {
      const out = path.resolve(ROOT, rest[0] || 'review/all.jpg'), step = +(rest[1] || 0.5), cols = +(rest[2] || 9), s0 = rest[3] ? +rest[3] : 0, s1 = rest[4] ? Math.min(+rest[4], dur) : dur;
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fs-sheet-')); let n = 0;
      for (let t = s0 + step / 2; t < s1; t += step) fs.writeFileSync(path.join(tmp, `f${String(n++).padStart(4, '0')}.jpg`), jpg(await P.ev(FRAME(t, 0.8, true))));
      const rows = Math.ceil(n / cols); fs.mkdirSync(path.dirname(out), { recursive: true });
      const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 'f%04d.jpg'), '-vf', `scale=384:216,tile=${cols}x${rows}:padding=4:color=black`, '-frames:v', '1', '-q:v', '3', out]);
      fs.rmSync(tmp, { recursive: true, force: true });
      if (r.status) throw new Error('ffmpeg: ' + r.stderr); console.log(`${out} (${n} frames, every ${step} s)`);
    } else if (mode === 'video') {
      const out = path.resolve(ROOT, rest[0] || 'renders/video.mp4'); fs.mkdirSync(path.dirname(out), { recursive: true });
      const mix = path.join(ROOT, 'data/mix.wav'), hasMix = fs.existsSync(mix), a0 = rest[1] ? +rest[1] : 0, a1 = rest[2] ? Math.min(+rest[2], dur) : dur, n = Math.round((a1 - a0) * FPS);
      const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
        ...(hasMix ? ['-ss', String(a0), '-t', String(a1 - a0), '-i', mix] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']), '-map', '0:v', '-map', '1:a',
        '-c:v', 'libx264', '-preset', flags.has('--draft') ? 'ultrafast' : 'veryfast', '-crf', flags.has('--draft') ? '28' : '18', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
      const t0 = Date.now();
      for (let i = 0; i < n; i++) {
        const b = jpg(await P.ev(FRAME(a0 + i / FPS, flags.has('--draft') ? 0.8 : 0.93)));
        if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r));
        if (i % 150 === 0) process.stdout.write(`\r${i}/${n} frames`);
      }
      ff.stdin.end(); await new Promise((r) => ff.on('close', r));
      console.log(`\r${out} (${n} frames, ${hasMix ? 'with data/mix.wav' : 'SILENT: no data/mix.wav'}, ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    } else console.log('modes: check · cues · sheet · frames · video · preview');
  } finally { P.close(); srv.close(); }
}
