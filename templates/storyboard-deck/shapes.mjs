// shapes.mjs — walk every NN-*.html and emit a full SCENE GRAPH, not a flat plate:
//   _shapes/<name>.json   every box, line, svg and text run with its exact geometry
//   _shapes/<name>-NN.svg every top-level <svg> (with its <text> stripped out, so the copy
//                         stays editable text rather than being baked into the artwork)
// deck.py turns that into a PowerPoint where every element is its own native shape.
import { spawn } from 'node:child_process';
import { writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';

const DIR = path.resolve('.');
const OUT = path.join(DIR, '_shapes');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const files = readdirSync('.').filter(f => /^\d\d-.*\.html$/.test(f)).sort();
const PORT = 9700 + (process.pid % 200);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = `/tmp/cr_shapes_${process.pid}`;
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`,
  '--window-size=1920,1080', '--force-device-scale-factor=2', 'about:blank'], { stdio: 'ignore' });

let nextId = 1;
function send(ws, method, params = {}) {
  const id = nextId++;
  return new Promise((res, rej) => {
    const on = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) { ws.removeEventListener('message', on); m.error ? rej(new Error(m.error.message)) : res(m.result); }
    };
    ws.addEventListener('message', on); ws.send(JSON.stringify({ id, method, params }));
  });
}

const EXTRACT = `(() => {
  const S = document.querySelector('.stage');
  const sr = S.getBoundingClientRect();
  const SVGNS = 'http://www.w3.org/2000/svg';
  const items = [];
  const svgs = [];
  const imgs = [];

  const rgba = c => {
    const m = String(c).match(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?/);
    if (!m) return null;
    const a = m[4] === undefined ? 1 : parseFloat(m[4]);
    if (a === 0) return null;
    return { hex: [1,2,3].map(i => Math.round(+m[i]).toString(16).padStart(2,'0')).join('').toUpperCase(), a };
  };
  const px = v => parseFloat(v) || 0;
  // border-radius can be a percentage; parseFloat would read '50%' as 50px and turn
  // every circle into a squircle. Resolve it against the box before using it.
  const rad = (v, base) => String(v).trim().endsWith('%')
    ? (parseFloat(v) || 0) / 100 * base : (parseFloat(v) || 0);
  const R = el => { const r = el.getBoundingClientRect();
                    return { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height }; };

  // A child clipped by a rounded, overflow:hidden parent inherits that parent's corner radii on
  // the corners it actually touches. This is what rounds the ends of the corner bars and the
  // header row of every card table.
  const clipRadii = (el, box, own) => {
    const out = own.slice();
    let p = el.parentElement, r = box;
    while (p && p !== S) {
      const cs = getComputedStyle(p);
      if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') {
        const pb = R(p);
        const pbase = Math.min(pb.w, pb.h);
        const pr = [rad(cs.borderTopLeftRadius, pbase), rad(cs.borderTopRightRadius, pbase),
                    rad(cs.borderBottomRightRadius, pbase), rad(cs.borderBottomLeftRadius, pbase)];
        const T = 1.5;
        const touch = [
          Math.abs(r.x - pb.x) < T && Math.abs(r.y - pb.y) < T,
          Math.abs(r.x + r.w - pb.x - pb.w) < T && Math.abs(r.y - pb.y) < T,
          Math.abs(r.x + r.w - pb.x - pb.w) < T && Math.abs(r.y + r.h - pb.y - pb.h) < T,
          Math.abs(r.x - pb.x) < T && Math.abs(r.y + r.h - pb.y - pb.h) < T,
        ];
        for (let i = 0; i < 4; i++) if (touch[i]) out[i] = Math.max(out[i], pr[i]);
      }
      p = p.parentElement;
    }
    return out;
  };

  const hasText = el => Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
  const taken = [];
  const insideTaken = el => taken.some(t => t !== el && t.contains(el));
  const hex = c => (rgba(c) || { hex: '0F172A' }).hex;

  const collect = (el) => {
    const parts = [];
    const walk = (node, color, bold, mono) => {
      for (const n of node.childNodes) {
        if (n.nodeType === 3) { if (n.textContent.length) parts.push({ node: n, color, bold, mono }); }
        else if (n.nodeType === 1) {
          const c = getComputedStyle(n);
          walk(n, hex(c.color), parseInt(c.fontWeight) >= 600, /mono/i.test(c.fontFamily));
        }
      }
    };
    const cs = getComputedStyle(el);
    walk(el, hex(cs.color), parseInt(cs.fontWeight) >= 600, /mono/i.test(cs.fontFamily));
    return parts;
  };

  // Per character, so explicit <br>, block children and browser wrapping all come back as
  // separate lines positioned exactly where they render.
  const measure = (parts) => {
    const lines = []; let cur = null;
    const rng = document.createRange();
    for (const p of parts) {
      const t = p.node.textContent;
      for (let i = 0; i < t.length; i++) {
        rng.setStart(p.node, i); rng.setEnd(p.node, i + 1);
        const r = rng.getBoundingClientRect();
        if (!r.width && !r.height) {
          if (cur && cur.runs.length && t[i] === ' ') cur.runs[cur.runs.length - 1].t += ' ';
          continue;
        }
        // Group by VERTICAL OVERLAP, not by an exact top: an inline mono span shares the
        // baseline with the brand-font text around it but has a different ascent, so its rect top can
        // differ by more than a few px. Keyed on the top, that run was thrown onto a second line
        // and rendered on top of the first.
        const ov = cur ? Math.min(cur.bottom, r.bottom) - Math.max(cur.top, r.top) : -1;
        const mh = cur ? Math.min(cur.bottom - cur.top, r.bottom - r.top) : 1;
        if (!cur || ov < mh * 0.5) {
          cur = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, runs: [] };
          lines.push(cur);
        }
        cur.top = Math.min(cur.top, r.top); cur.bottom = Math.max(cur.bottom, r.bottom);
        cur.left = Math.min(cur.left, r.left); cur.right = Math.max(cur.right, r.right);
        const last = cur.runs[cur.runs.length - 1];
        if (last && last.color === p.color && last.bold === p.bold && last.mono === p.mono) last.t += t[i];
        else cur.runs.push({ t: t[i], color: p.color, bold: p.bold, mono: p.mono });
      }
    }
    for (const ln of lines) {
      for (const r of ln.runs) r.t = r.t.replace(/\\s+/g, ' ');
      if (ln.runs.length) {
        ln.runs[0].t = ln.runs[0].t.replace(/^\\s+/, '');
        ln.runs[ln.runs.length - 1].t = ln.runs[ln.runs.length - 1].t.replace(/\\s+$/, '');
      }
      ln.runs = ln.runs.filter(r => r.t.length);
    }
    return lines.filter(l => l.runs.length).sort((a, b) => a.top - b.top || a.left - b.left);
  };

  const textItem = (el, seq, isSvgText) => {
    const lines = measure(collect(el));
    if (!lines.length) return null;
    const cs = getComputedStyle(el);
    const left = Math.min(...lines.map(l => l.left)), right = Math.max(...lines.map(l => l.right));
    const top = Math.min(...lines.map(l => l.top)), bottom = Math.max(...lines.map(l => l.bottom));
    return { kind: 'text', seq: seq + 0.5,
      x: left - sr.left, y: top - sr.top, w: right - left, h: bottom - top,
      pitch: lines.length > 1 ? lines[1].top - lines[0].top : (lines[0].bottom - lines[0].top),
      size: parseFloat(cs.fontSize),
      align: isSvgText ? ({ middle: 'center', end: 'right' }[el.getAttribute('text-anchor')] || 'left')
                       : cs.textAlign,
      mono: /mono/i.test(cs.fontFamily),
      lines: lines.map(l => l.runs) };
  };

  const all = Array.from(S.querySelectorAll('*'));
  all.forEach((el, seq) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'style' || tag === 'script') return;
    const isSvg = el.namespaceURI === SVGNS;

    // --- top-level <svg>: one picture, its <text> lifted out as editable text -----------
    if (isSvg && tag === 'svg' && !el.parentElement.closest('svg')) {
      const b = R(el);
      if (b.w < 1 || b.h < 1) return;
      const clone = el.cloneNode(true);
      clone.querySelectorAll('text').forEach(t => t.remove());
      clone.setAttribute('width', b.w); clone.setAttribute('height', b.h);
      const idx = svgs.length;
      svgs.push(new XMLSerializer().serializeToString(clone));
      let op = 1, p = el;
      while (p && p !== S) { op *= parseFloat(getComputedStyle(p).opacity || 1); p = p.parentElement; }
      items.push({ kind: 'svg', seq, idx, x: b.x, y: b.y, w: b.w, h: b.h, opacity: op });
      return;
    }
    if (isSvg) {
      if (tag === 'text' && el.textContent.trim()) {
        const t = textItem(el, seq, true); if (t) items.push(t);
      }
      return;                                    // everything else lives inside its svg picture
    }

    // --- <img>: a real bitmap asset (the brand icons that only exist as PNG) ------------
    // Without this an <img> falls through to the box branch, has no background or border, and is
    // dropped from the deck entirely - the artwork silently vanishes.
    if (tag === 'img') {
      const b = R(el);
      if (b.w < 1 || b.h < 1) return;
      let op = 1, p = el;
      while (p && p !== S) { op *= parseFloat(getComputedStyle(p).opacity || 1); p = p.parentElement; }
      const idx = imgs.length;
      imgs.push(el.getAttribute('src'));
      items.push({ kind: 'img', seq, idx, x: b.x, y: b.y, w: b.w, h: b.h, opacity: op });
      return;
    }

    // --- boxes, hairlines --------------------------------------------------------------
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const b = R(el);
    if (b.w >= 1 && b.h >= 1) {
      const bg = rgba(cs.backgroundColor);
      const bw = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
      // Per side: a card with only a border-left accent has borderTopStyle 'none', and keying the
      // test on the top side alone dropped that accent bar from the deck entirely.
      const bs = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
      const on = bw.map((v, i) => v > 0 && bs[i] !== 'none');
      const anyBorder = on.some(Boolean);
      const uniform = anyBorder && on.every(Boolean) && bw.every(v => Math.abs(v - bw[0]) < 0.01);
      const grad = /gradient/.test(cs.backgroundImage);
      if (bg || anyBorder || grad) {
        const ob = Math.min(b.w, b.h);
        const own = [rad(cs.borderTopLeftRadius, ob), rad(cs.borderTopRightRadius, ob),
                     rad(cs.borderBottomRightRadius, ob), rad(cs.borderBottomLeftRadius, ob)];
        const item = { kind: 'box', seq, x: b.x, y: b.y, w: b.w, h: b.h,
          fill: bg, radii: clipRadii(el, b, own),
          shadow: cs.boxShadow && cs.boxShadow !== 'none' ? cs.boxShadow : null,
          opacity: parseFloat(cs.opacity || 1),
          grad: grad ? cs.backgroundImage : null };
        if (uniform) {
          item.stroke = { w: bw[0], hex: hex(cs.borderTopColor), dash: cs.borderTopStyle };
        } else if (anyBorder) {
          // one-sided rule (table row separators): emit it as its own hairline
          const sides = [['top', 0], ['right', 1], ['bottom', 2], ['left', 3]];
          for (const [side, i] of sides) {
            if (!on[i]) continue;
            const c = hex(cs[side === 'top' ? 'borderTopColor' : side === 'right' ? 'borderRightColor'
                            : side === 'bottom' ? 'borderBottomColor' : 'borderLeftColor']);
            const hz = side === 'top' || side === 'bottom';
            items.push({ kind: 'box', seq: seq + 0.2, radii: [0,0,0,0], opacity: 1, shadow: null,
              fill: { hex: c, a: 1 },
              x: side === 'right' ? b.x + b.w - bw[i] : b.x,
              y: side === 'bottom' ? b.y + b.h - bw[i] : b.y,
              w: hz ? b.w : bw[i], h: hz ? bw[i] : b.h });
          }
        }
        items.push(item);
      }
    }

    // --- text ---------------------------------------------------------------------------
    if (hasText(el) && !insideTaken(el)) {
      const t = textItem(el, seq, false);
      if (t) { taken.push(el); items.push(t); }
    }
  });

  items.sort((a, b) => a.seq - b.seq);
  return JSON.stringify({ items, svgs, imgs });
})()`;

let wsurl;
for (let i = 0; i < 100; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    wsurl = (await r.json()).webSocketDebuggerUrl; if (wsurl) break;
  } catch {}
  await sleep(150);
}
const ws = new WebSocket(wsurl);
await new Promise((res) => ws.addEventListener('open', res, { once: true }));
await send(ws, 'Page.enable');
await send(ws, 'Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false });

for (const f of files) {
  const name = f.replace('.html', '');
  const loaded = new Promise((res) => {
    const on = (ev) => { if (JSON.parse(ev.data).method === 'Page.loadEventFired') { ws.removeEventListener('message', on); res(); } };
    ws.addEventListener('message', on);
  });
  await send(ws, 'Page.navigate', { url: `file://${DIR}/${f}` });
  await Promise.race([loaded, sleep(2500)]);
  try { await send(ws, 'Runtime.evaluate', { expression: 'document.fonts.ready.then(()=>1)', awaitPromise: true }); } catch {}
  await sleep(120);
  const { result } = await send(ws, 'Runtime.evaluate', { expression: EXTRACT, returnByValue: true });
  const { items, svgs, imgs } = JSON.parse(result.value);
  svgs.forEach((s, i) => writeFileSync(path.join(OUT, `${name}-${String(i).padStart(2, '0')}.svg`), s));
  imgs.forEach((src, i) => {
    const m = /^data:image\/(png|jpeg|jpg|gif|webp);base64,(.*)$/.exec(src || '');
    if (!m) { console.warn(`  ! img ${i} is not a data URI - skipped`); return; }
    writeFileSync(path.join(OUT, `${name}-img-${String(i).padStart(2, '0')}.${m[1]}`),
                  Buffer.from(m[2], 'base64'));
  });
  writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(items));
  const n = k => items.filter(i => i.kind === k).length;
  console.log(`${name}  ${n('box')} boxes  ${n('svg')} svg  ${n('img')} img  ${n('text')} text`);
}
ws.close(); chrome.kill(); process.exit(0);
