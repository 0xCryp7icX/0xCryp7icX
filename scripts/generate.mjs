// Fills templates/forest-temple.svg.tpl with aggregate GitHub stats. Node 20+, no deps.
// Only counts, star totals and language shares are written; repo names never reach the SVG.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.GITHUB_TOKEN;
if (!token) { console.error('GITHUB_TOKEN is required'); process.exit(1); }

const repos = [];
for (let page = 1; ; page++) {
  const res = await fetch(`https://api.github.com/user/repos?per_page=100&affiliation=owner&page=${page}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'forest-temple-banner', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!res.ok) { console.error(`GitHub API ${res.status}`); process.exit(1); }
  const batch = await res.json();
  repos.push(...batch);
  if (batch.length < 100) break;
}

const me = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'forest-temple-banner', 'X-GitHub-Api-Version': '2022-11-28' } });
if (!me.ok) { console.error(`GitHub API ${me.status}`); process.exit(1); }
const created = new Date((await me.json()).created_at);
const since = created.getUTCFullYear();
const total = repos.length;
const counts = new Map();
for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) || 0) + 1);
const top = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4);
const other = total - top.reduce((n, [, c]) => n + c, 0);
const segs = top.map(([name, c]) => ({ name, c }));
if (other > 0) segs.push({ name: 'Other', c: other });
if (!segs.length) segs.push({ name: 'None', c: 1 });

// largest-remainder rounding so integer shares sum to exactly 100
const sum = segs.reduce((n, s) => n + s.c, 0);
segs.forEach((s) => { const raw = (s.c / sum) * 100; s.pct = Math.floor(raw); s.rem = raw - s.pct; });
let left = 100 - segs.reduce((n, s) => n + s.pct, 0);
[...segs].sort((a, b) => b.rem - a.rem).slice(0, left).forEach((s) => s.pct++);

const shareSum = segs.reduce((n, s) => n + s.pct, 0);
console.assert(Math.abs(shareSum - 100) < 0.5, 'language shares must sum to ~100');
console.assert(segs.every((s) => s.pct >= 0), 'language shares must be non-negative');
if (Math.abs(shareSum - 100) >= 0.5 || segs.some((s) => s.pct < 0)) { console.error('self-check failed: shares'); process.exit(1); }

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const palette = ['#3fbf86', '#e8c66a', '#7fd0e0', '#b98a54'];
const colorOf = (s, i) => (s.name === 'Other' ? '#6f766a' : palette[i % palette.length]);
const W = 680;
let x = 0, bars = '', legend = '';
const shown = segs.filter((s) => s.pct > 0);
shown.forEach((s, i) => {
  const w = (s.pct / 100) * W;
  bars += `<rect x="${x.toFixed(1)}" width="${w.toFixed(1)}" height="12" fill="${colorOf(s, i)}" stroke="#031211" stroke-width="1"/>`;
  if (i) bars += `<rect x="${x.toFixed(1)}" width="1.5" height="12" fill="#07140d"/>`;
  x += w;
  const lx = i * 136, ly = 36;
  legend += `<circle cx="${lx + 4}" cy="${ly - 4.5}" r="4" fill="${colorOf(s, i)}"/><text class="t o" x="${lx + 14}" y="${ly}" font-size="16" font-weight="600" fill="#f4f8ec">${esc(s.name.slice(0, 12))} ${s.pct}%</text>`;
});
const updated = new Date().toISOString().slice(0, 10);

const tpl = readFileSync(path.join(root, 'templates/forest-temple.svg.tpl'), 'utf8');
const svg = tpl
  .split('{{langBars}}').join(bars)
  .split('{{langLegend}}').join(legend)
  .split('{{repos}}').join(String(total))
  .split('{{since}}').join(String(since))
  .split('{{updated}}').join(updated);

if (/\{\{|<script/i.test(svg)) { console.error('self-check failed: unresolved placeholder or script'); process.exit(1); }
writeFileSync(path.join(root, 'forest-temple.svg'), svg);
console.log(`ok repos=${total} since=${since} updated=${updated} langs=${shown.map((s) => `${s.name}:${s.pct}`).join(',')}`);
