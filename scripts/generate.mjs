// Fills templates/forest-temple.svg.tpl with aggregate GitHub stats. Node 20+, no deps.
// Only counts, star totals and language shares are written; repo names never reach the SVG.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
// Weekly contribution totals (GraphQL). Self-check: the per-week sums must add up to totalContributions.
const gq = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'forest-temple-banner' },
  body: JSON.stringify({ query: 'query { viewer { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }' }),
});
const gqj = await gq.json();
if (!gq.ok || gqj.errors || !gqj.data) { console.error(`GitHub GraphQL failed: ${gq.status} ${JSON.stringify(gqj.errors || '')}`); process.exit(1); }
const cal = gqj.data.viewer.contributionsCollection.contributionCalendar;
const weeks = cal.weeks.map((w) => ({ sum: w.contributionDays.reduce((n, d) => n + d.contributionCount, 0), first: w.contributionDays[0].date }));
const weekTotal = weeks.reduce((n, w) => n + w.sum, 0);
if (weekTotal !== cal.totalContributions) { console.error(`self-check failed: week sums ${weekTotal} != totalContributions ${cal.totalContributions}`); process.exit(1); }
const total = repos.length;
const counts = new Map();
for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) || 0) + 1);
const CORE = new Set(['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Rust']);
const langCount = counts.size;
const top = [...counts].filter(([nm, c]) => CORE.has(nm) || c / total >= 0.1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4);
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

// ---- stack sonar: one blip per language, labels laid out so no two boxes (or a box and a blip) overlap
const SON = { cx: 935, cy: 190, rx: 200, ry: 82, x0: 700, x1: 1172, y0: 62, y1: 318 };
const LH = 24, CW = 9.9;
const hit = (a, b, m = 4) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;
const nb = shown.length;
const dots = shown.map((s, i) => {
  const th = ((20 + (i * 360) / nb) * Math.PI) / 180, fr = [0.78, 0.5, 0.85, 0.6, 0.72][i % 5], r = 4 + s.pct * 0.2;
  return { s, r, x: SON.cx + SON.rx * fr * Math.cos(th), y: SON.cy + SON.ry * fr * Math.sin(th), text: `${s.name.slice(0, 12)} ${s.pct}%` };
});
const boxes = [];
dots.forEach((d) => {
  const w = d.text.length * CW + 6, spots = [];
  for (const k of [0, 8, 18, 30, 44]) spots.push(
    [d.x - w / 2, d.y - d.r - 6 - k - LH], [d.x - w / 2, d.y + d.r + 6 + k], [d.x + d.r + 6 + k, d.y - LH / 2], [d.x - d.r - 6 - k - w, d.y - LH / 2]);
  const ok = (x, y) => {
    const b = { x, y, w, h: LH };
    if (x < SON.x0 || x + w > SON.x1 || y < SON.y0 || y + LH > SON.y1) return false;
    if (boxes.some((o) => hit(b, o, 8))) return false;
    return !dots.some((o) => hit(b, { x: o.x - o.r, y: o.y - o.r, w: 2 * o.r, h: 2 * o.r }, 10));
  };
  const spot = spots.find(([x, y]) => ok(x, y));
  if (!spot) { console.error('self-check failed: no free label position for a sonar blip'); process.exit(1); }
  d.box = { x: spot[0], y: spot[1], w, h: LH };
  boxes.push(d.box);
});
for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) if (hit(boxes[a], boxes[b], 0)) { console.error('self-check failed: sonar labels overlap'); process.exit(1); }
const blips = dots.map((d, i) => `<g class="blip" style="animation-delay:${(i * 1.1).toFixed(1)}s"><circle class="sm" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(1)}" fill="none" stroke="#f3c66b" stroke-width="1.6"><animate attributeName="r" values="${d.r.toFixed(1)};${(d.r * 3.4).toFixed(1)}" dur="3.5s" begin="${(i * 0.8).toFixed(1)}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0" dur="3.5s" begin="${(i * 0.8).toFixed(1)}s" repeatCount="indefinite"/></circle><circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(1)}" fill="#f3c66b" filter="url(#glow)"/><text class="t o" x="${(d.box.x + 3).toFixed(1)}" y="${(d.box.y + 17).toFixed(1)}" font-size="16" font-weight="600" fill="#eef2ff">${esc(d.text)}</text></g>`).join('');

// ---- activity tide chart (weekly contributions)
const TX0 = 84, TX1 = 840, TB = 248, TT = 66;
const tideChart = (() => {
  const vals = weeks.map((w) => w.sum), mx = Math.max(...vals, 0), nice = Math.max(5, Math.ceil(mx / 5) * 5), avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const X = (i) => TX0 + (i * (TX1 - TX0)) / Math.max(1, vals.length - 1), Y = (v) => TB - (v / nice) * (TB - TT);
  const P = vals.map((v, i) => [X(i), Y(v)]);
  let d = `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = Math.min(TB, p1[1] + (p2[1] - p0[1]) / 6), c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = Math.min(TB, p2[1] - (p3[1] - p1[1]) / 6);
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const area = `${d}V${TB}H${TX0}Z`, mxI = vals.indexOf(mx);
  let g = `<linearGradient id="tideG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b5bb8" stop-opacity=".85"/><stop offset="1" stop-color="#0f2247" stop-opacity=".25"/></linearGradient><linearGradient id="shimG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="tideC"><path d="${area}"/></clipPath>`;
  for (const v of [0, nice / 2, nice]) g += `<path d="M${TX0} ${Y(v).toFixed(1)}H${TX1}" stroke="#9fb8ff" stroke-opacity="${v ? 0.16 : 0.35}" stroke-dasharray="${v ? '3 5' : '0'}"/><text class="t" x="${TX0 - 10}" y="${(Y(v) + 5).toFixed(1)}" text-anchor="end" font-size="16" fill="#b9c3e6">${v}</text>`;
  g += `<path d="${area}" fill="url(#tideG)"/><g clip-path="url(#tideC)"><rect class="sheen" x="${(TX0 + TX1) / 2 - 60}" y="${TT - 10}" width="120" height="${TB - TT + 10}" fill="url(#shimG)"/></g>`;
  g += `<path class="ripple" d="${d}" transform="translate(0 -5)" fill="none" stroke="#9fb8ff" stroke-opacity=".35" stroke-width="1.5"/><path d="${d}" fill="none" stroke="#f3c66b" stroke-width="2.4" stroke-linejoin="round" filter="url(#glow)"/>`;
  g += `<path d="M${TX0} ${Y(avg).toFixed(1)}H${TX1}" stroke="#ffe7a8" stroke-opacity=".55" stroke-dasharray="6 5"/>`;
  g += `<path d="M650 29h26" stroke="#ffe7a8" stroke-opacity=".7" stroke-dasharray="6 5"/><text class="t" x="684" y="35" font-size="16" fill="#b9c3e6">weekly average ${avg.toFixed(1)}</text>`;
  const [px, py] = P[mxI >= 0 ? mxI : 0], lx = Math.min(TX1 - 40, Math.max(TX0 + 40, px)), ly = py - 14 < TT - 6 ? py + 26 : py - 12;
  g += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="#ffe7a8" filter="url(#glow)"/><text class="t o" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="16" font-weight="600" fill="#ffe7a8">peak ${mx}</text>`;
  let lastX = -99;
  weeks.forEach((w, i) => {
    const m = new Date(w.first + 'T00:00:00Z').getUTCMonth(), prev = i ? new Date(weeks[i - 1].first + 'T00:00:00Z').getUTCMonth() : -1;
    if (m !== prev && X(i) - lastX > 54) { lastX = X(i); g += `<text class="t" x="${X(i).toFixed(1)}" y="${TB + 24}" text-anchor="middle" font-size="16" fill="#b9c3e6">${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m]}</text>`; }
  });
  return g;
})();

const fill = (tpl) => tpl
  .split('{{langBars}}').join(bars)
  .split('{{langLegend}}').join(legend)
  .split('{{langBlips}}').join(blips)
  .split('{{tideChart}}').join(tideChart)
  .split('{{repos}}').join(String(total))
  .split('{{since}}').join(String(since))
  .split('{{langCount}}').join(String(langCount))
  .split('{{contrib}}').join(String(cal.totalContributions))
  .split('{{updated}}').join(updated);
const MIN_CONTRIB = 50; // below this, the tide chart would look empty: the Harbour log strip is rendered instead
mkdirSync(path.join(root, 'assets'), { recursive: true });
for (const [tpl, outFile] of [['forest-temple', 'forest-temple.svg'], ['hero', 'assets/hero.svg'], ['stack', 'assets/stack.svg'], [cal.totalContributions < MIN_CONTRIB ? 'activity-log' : 'activity', 'assets/activity.svg']]) {
  const svg = fill(readFileSync(path.join(root, `templates/${tpl}.svg.tpl`), 'utf8'));
  if (/\{\{|<script/i.test(svg)) { console.error(`self-check failed: unresolved placeholder or script in ${tpl}`); process.exit(1); }
  writeFileSync(path.join(root, outFile), svg);
}
console.log(`ok repos=${total} since=${since} contrib=${cal.totalContributions} activity=${cal.totalContributions < MIN_CONTRIB ? 'harbour-log' : 'tide-chart'} weeks=${weeks.length} updated=${updated} langs=${shown.map((s) => `${s.name}:${s.pct}`).join(',')}`);
