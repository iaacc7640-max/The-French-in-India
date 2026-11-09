// 16:9 LAYOUT PROOF (gate 2). Replaced by the chapter files in src/chapters/ once the plan is approved.
import { ctx, W, H, clamp, seg, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [], cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  S.push({ id: 'P01', at: 0, cam: [W / 2, 470], zoom: 0.05, era: 2, note: 'layout proof: map + figure + ribbon + era bar + caption', draw(lt, d, t) {
    K.map({ highlight: 1, route: clamp(lt / 3), labels: [['MAURITIUS', 640, 500], ['MADRAS', 1250, 580]] });
    K.figure({ x: 330, y: 840, h: 520, role: 'scholar', dir: 1 });
    K.ribbon('1746', W / 2, 200, eob(seg(lt, 0.1, 0.5)), 80);
    K.slip('~1,000 vs ~10,000', 1500, 330, eob(seg(lt, 1.5, 1.8)), 0.03, 40);
  } });
  cue(0.1, 'whoosh');
  return { shots: S, cues: CUES };
}
