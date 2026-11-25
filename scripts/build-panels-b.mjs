// Builds assets/about.svg, assets/projects.svg, assets/footer.svg (static content, no data needed).
// Run: node scripts/build-panels-b.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(out, { recursive: true });

const W = 1200;
const GOLD = '#f3c66b', HI = '#ffe7a8', TXT = '#eef2ff', MUTED = '#b9c3e6';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Shared CSS + defs. extraCss holds panel-specific rules.
const shell = (h, title, desc, body, extraCss = '', extraDefs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" aria-labelledby="ti de"><title id="ti">${esc(title)}</title><desc id="de">${esc(desc)}</desc>
<defs>
<style>
.t{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif}
.h{font-family:Georgia,'Palatino Linotype','Book Antiqua',serif}
.emb{paint-order:stroke;stroke:#060b1d;stroke-width:3;stroke-linejoin:round}
.drift{animation:drift 14s linear infinite}
.drift2{animation:drift 22s linear infinite reverse}
.tw{animation:tw 5s ease-in-out infinite}
.lamp{animation:lamp 4.5s ease-in-out infinite}
.bob{animation:bob 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.shim{animation:shim 8s ease-in-out infinite}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-120px)}}
@keyframes tw{0%,100%{opacity:.15}50%{opacity:.9}}
@keyframes lamp{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes shim{0%{transform:translateX(-160px)}60%,100%{transform:translateX(360px)}}
${extraCss}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.tw{opacity:.5}.lamp{opacity:.85}.shim{opacity:0}}
</style>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset="1" stop-color="#1b2a5a"/></linearGradient>
<linearGradient id="plaque" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16224a"/><stop offset="1" stop-color="#0c1532"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${HI}"/><stop offset=".55" stop-color="${GOLD}"/><stop offset="1" stop-color="#b8863a"/></linearGradient>
<linearGradient id="hair" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${GOLD}" stop-opacity="0"/><stop offset=".5" stop-color="${GOLD}"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></linearGradient>
<linearGradient id="shimg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${HI}" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="${HI}" stop-opacity="0"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${HI}" stop-opacity=".9"/><stop offset=".4" stop-color="${GOLD}" stop-opacity=".35"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
<filter id="ds" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#02040d" flood-opacity=".7"/></filter>
<clipPath id="frame"><rect width="${W}" height="${h}" rx="18"/></clipPath>
${extraDefs}
</defs>
<g clip-path="url(#frame)">
<rect width="${W}" height="${h}" fill="url(#bg)"/>
${body}
<rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="18" fill="none" stroke="#b9c3e6" stroke-opacity=".25"/>
</g>
</svg>
`;

// deterministic stars
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const stars = (n, maxY) => Array.from({ length: n }, () => {
  const x = (rnd() * (W - 20) + 10).toFixed(0), y = (rnd() * maxY + 6).toFixed(0), r = (rnd() * 1.1 + .5).toFixed(1);
  return `<circle class="tw" cx="${x}" cy="${y}" r="${r}" fill="#eef2ff" style="animation-delay:-${(rnd() * 5).toFixed(1)}s"/>`;
}).join('');

// wavy band, period 120, drifts left by one period
const wave = (y, amp, fill, op, cls) => {
  let d = `M-120 ${y}`;
  for (let x = -120; x < W + 120; x += 120) d += ` q30 ${-amp} 60 0 t60 0`;
  d += ` V600 H-120Z`;
  return `<path class="${cls}" d="${d}" fill="${fill}" fill-opacity="${op}"/>`;
};

// plaque: navy panel, gold hairline, bevel highlight, drop shadow
const plaque = (x, y, w, h) => `<g filter="url(#ds)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#plaque)"/></g>
<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="12" fill="none" stroke="${GOLD}" stroke-opacity=".55"/>
<rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h - 5}" rx="10" fill="none" stroke="#fff" stroke-opacity=".07"/>
<path d="M${x + 14} ${y + 1.5}H${x + w - 14}" stroke="${HI}" stroke-opacity=".5"/>`;

const title = (text, x, y, size = 30) => `<text class="h emb" x="${x}" y="${y}" font-size="${size}" font-weight="700" letter-spacing="1" fill="url(#gold)">${text}</text>`;
const rule = (y) => `<rect x="40" y="${y}" width="${W - 80}" height="1.5" fill="url(#hair)"/>`;

// ---------------- about ----------------
function about() {
  const H = 336, y0 = 96, ph = 196;
  const focus = ['Security training', 'Cloud & AI security', 'Computer vision', 'AI-narrated video', 'Browser games'];
  const fw = 704, ex = 40 + fw + 32, ew = W - 40 - ex;
  // top sea-and-stars motif matches the hero: stars above, lit sea strip below
  let body = stars(55, 70) + `<ellipse cx="1010" cy="40" rx="150" ry="60" fill="url(#glow)" opacity=".16"/>`;
  body += `<rect y="${H - 34}" width="${W}" height="34" fill="#0f2247"/><rect y="${H - 34}" width="${W}" height="1.5" fill="${HI}" fill-opacity=".35"/>`;
  body += wave(H - 26, 5, '#0b1a3d', '.9', 'drift') + wave(H - 12, 4, '#081431', '.95', 'drift2');
  body += `<circle class="bob" cx="70" cy="${H - 26}" r="4" fill="#ff5d5d"/><circle class="bob" cx="1130" cy="${H - 26}" r="4" fill="#5dffa0" style="animation-delay:-2s"/>`;
  body += title('SHIP&#8217;S LOG', 40, 62) + `<text class="t" x="${W - 40}" y="60" text-anchor="end" font-size="16" letter-spacing="3" fill="#d5dcf5">0xCryp7icX  ·  ENTRY 01</text>` + rule(76);
  body += plaque(40, y0, fw, ph);
  body += `<text class="t" x="64" y="${y0 + 36}" font-size="16" font-weight="700" letter-spacing="3" fill="${GOLD}">FOCUS</text><rect x="64" y="${y0 + 46}" width="40" height="2" fill="${GOLD}" fill-opacity=".7"/>`;
  focus.forEach((l, j) => {
    const cx = 64 + (j < 3 ? 0 : 330), cy = y0 + 86 + (j % 3) * 40;
    body += `<circle cx="${cx + 5}" cy="${cy - 6}" r="4" fill="${GOLD}"/><text class="t" x="${cx + 22}" y="${cy}" font-size="20" fill="${TXT}">${esc(l)}</text>`;
  });
  body += plaque(ex, y0, ew, ph);
  body += `<text class="t" x="${ex + 24}" y="${y0 + 36}" font-size="16" font-weight="700" letter-spacing="3" fill="${GOLD}">CURRENTLY EXPLORING</text><rect x="${ex + 24}" y="${y0 + 46}" width="40" height="2" fill="${GOLD}" fill-opacity=".7"/>`;
  body += `<circle class="lamp" cx="${ex + ew - 56}" cy="${y0 + 130}" r="46" fill="url(#glow)"/><circle cx="${ex + ew - 56}" cy="${y0 + 130}" r="7" fill="${HI}"/>`;
  body += ['AI security', 'and cloud security.'].map((l, j) => `<text class="h" x="${ex + 24}" y="${y0 + 100 + j * 36}" font-size="28" font-weight="700" fill="${TXT}">${l}</text>`).join('');
  return shell(H, "0xCryp7icX ship's log: focus and exploring",
    "A ship's log panel. Focus: security training, cloud and AI security, computer vision, AI-narrated video and browser games. Currently exploring AI security and cloud security.", body);
}

// ---------------- projects ----------------
const icons = {
  shield: '<path d="M0-17 15-11V1C15 10 8 16 0 19-8 16-15 10-15 1V-11Z"/><path d="M-6 0 -1.5 5 7-5"/>',
  cloud: '<path d="M-10 11H9A8 8 0 0 0 10-5 11 11 0 0 0-11-3 7 7 0 0 0-10 11Z"/>',
  eye: '<path d="M-18 0Q0-17 18 0 0 17-18 0Z"/><circle r="6"/>',
  film: '<rect x="-15" y="-13" width="30" height="26" rx="3"/><path d="M-9-13V13M9-13V13M-15-5H-9M-15 5H-9M9-5H15M9 5H15"/>',
  sun: '<circle r="7"/><path d="M0-17V-11M0 11V17M-17 0H-11M11 0H17M-12-12-8-8M8 8 12 12M-12 12-8 8M8-8 12-12"/>',
  leaf: '<path d="M-13 13C-15-4-4-15 14-14 15 4 4 15-13 13Z"/><path d="M-13 13 3-3"/>',
};
const groups = [
  { name: 'SECURITY & CLOUD', cards: [
    ['Secure-by-Design Trainer', 'Interactive security training', ['Security', 'Rust/TS'], 'shield'],
    ['Cloud & AI Security Study', 'Exam-prep dashboard & drills', ['Cloud', 'JS'], 'cloud'],
    ['Structure Vision', 'Construction photo classifier', ['AI/ML', 'Web'], 'eye'] ] },
  { name: 'CREATIVE & AI TOOLING', cards: [
    ['Video Explainer Engine', 'AI-voiced collage reels', ['AI', 'Python'], 'film'],
    ['Puzzle Game', 'Browser geometry puzzle', ['Game', 'TS'], 'sun'],
    ['Portfolio Lab', 'UI prototypes', ['Frontend', 'Next.js'], 'leaf'] ] },
];
function crate(x, y, w, h, [name, sub, chips, icon], n) {
  let g = `<g transform="translate(${x} ${y})">`;
  g += `<g filter="url(#ds)"><rect width="${w}" height="${h}" rx="12" fill="url(#crate)"/></g><rect width="${w}" height="${h}" rx="12" filter="url(#grain)" opacity=".5"/>`;
  g += `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="12" fill="none" stroke="${GOLD}" stroke-opacity=".6"/><rect x="2.5" y="2.5" width="${w - 5}" height="${h - 5}" rx="10" fill="none" stroke="#fff" stroke-opacity=".07"/><path d="M13 1.5H${w - 13}" stroke="#fff" stroke-opacity=".55"/>`;
  g += `<path d="M14 ${h * .4}H${w - 14}M14 ${h * .7}H${w - 14}" stroke="#fff" stroke-opacity=".04"/>`;
  g += `<path d="M10 18V10H18M${w - 18} 10H${w - 10}V18M10 ${h - 18}V${h - 10}H18M${w - 18} ${h - 10}H${w - 10}V${h - 18}" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width="1.2"/>`;
  g += `<g clip-path="url(#top)"><rect class="shim" x="0" y="0" width="140" height="3" fill="url(#shimg)" style="animation-delay:-${n * 1.3}s"/></g>`;
  g += `<g class="bob" style="animation-delay:-${n * 0.9}s"><circle class="lamp" cx="56" cy="64" r="46" fill="url(#glow)" style="animation-delay:-${n * 0.7}s"/><circle cx="56" cy="64" r="32" fill="#0a1230" stroke="url(#gold)" stroke-width="2.5"/><circle cx="56" cy="64" r="26" fill="none" stroke="${GOLD}" stroke-opacity=".35"/>`;
  g += `<g transform="translate(56 64) scale(1.1)" fill="none" stroke="${HI}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icons[icon]}</g></g>`;
  g += `<text class="t" x="104" y="56" font-size="19" font-weight="700" fill="${TXT}">${esc(name)}</text>`;
  g += `<text class="t" x="104" y="84" font-size="18" fill="#d5dcf5">${esc(sub)}</text>`;
  let cx = 24;
  chips.forEach((c) => {
    const cw = Math.round(c.length * 9.2 + 28);
    g += `<rect x="${cx}" y="${h - 56}" width="${cw}" height="34" rx="17" fill="#1b2a5a" stroke="${GOLD}" stroke-opacity=".55"/><text class="t" x="${cx + cw / 2}" y="${h - 33}" text-anchor="middle" font-size="16" font-weight="600" fill="${HI}">${esc(c)}</text>`;
    cx += cw + 10;
  });
  return g + '</g>';
}
function projects() {
  const H = 568, cw = 352, gap = 32, ch = 184;
  let body = stars(45, 60);
  body += title('CARGO MANIFEST', 40, 62) + `<text class="t" x="${W - 40}" y="60" text-anchor="end" font-size="16" letter-spacing="3" fill="#d5dcf5">6 CRATES  ·  2 HOLDS</text>` + rule(76);
  let n = 0;
  groups.forEach((gr, r) => {
    const gy = 98 + r * 224;
    const lw = gr.name.length * 14 + 14;
    body += `<text class="t" x="40" y="${gy + 14}" font-size="17" font-weight="700" letter-spacing="3.5" fill="${GOLD}">${esc(gr.name)}</text><rect x="${40 + lw}" y="${gy + 8}" width="${W - 80 - lw}" height="1" fill="${GOLD}" fill-opacity=".35"/>`;
    gr.cards.forEach((c, i) => { body += crate(40 + i * (cw + gap), gy + 30, cw, ch, c, n++); });
  });
  const defs = `<clipPath id="top"><rect x="12" y="0" width="328" height="4"/></clipPath>
<linearGradient id="crate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b5c"/><stop offset=".5" stop-color="#121c40"/><stop offset="1" stop-color="#0b1330"/></linearGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .05" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .85  0 0 0 0 .6  0 0 0 .07 0"/></filter>`;
  return shell(H, '0xCryp7icX project manifest',
    'Six project cards in two groups. Security and Cloud: Secure-by-Design Trainer (interactive security training), Cloud and AI Security Study (exam-prep dashboard and drills), Structure Vision (construction photo classifier). Creative and AI tooling: Video Explainer Engine (AI-voiced collage reels), Puzzle Game (browser geometry puzzle), Portfolio Lab (UI prototypes).',
    body, '', defs);
}

// ---------------- footer ----------------
function footer() {
  const H = 190, hy = 128;
  const dawn = `<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset=".45" stop-color="#2f3a80"/><stop offset=".78" stop-color="#b0668a"/><stop offset="1" stop-color="#ffb877"/></linearGradient>
<radialGradient id="sunrise" cx=".5" cy="1"><stop offset="0" stop-color="#fff3c8"/><stop offset=".25" stop-color="${HI}" stop-opacity=".75"/><stop offset=".6" stop-color="#ffa96b" stop-opacity=".3"/><stop offset="1" stop-color="#ffa96b" stop-opacity="0"/></radialGradient>
<linearGradient id="seaglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f7a"/><stop offset=".35" stop-color="#0f2247"/><stop offset="1" stop-color="#081431"/></linearGradient>`;
  let body = `<rect width="${W}" height="${hy}" fill="url(#dawn)"/><ellipse cx="600" cy="${hy}" rx="560" ry="120" fill="url(#sunrise)"/><circle cx="600" cy="${hy}" r="34" fill="#fff3c8" opacity=".9"/>`;
  body += stars(14, 50);
  body += `<rect y="${hy}" width="${W}" height="${H - hy}" fill="url(#seaglow)"/><rect y="${hy}" width="${W}" height="2" fill="#fff3c8" fill-opacity=".8"/>`;
  body += `<path d="M500 ${hy + 8}H700M530 ${hy + 20}H670M560 ${hy + 34}H640M580 ${hy + 46}H620" stroke="${HI}" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>`;
  body += wave(hy + 18, 4, '#0b1a3d', '.8', 'drift') + wave(hy + 40, 4, '#081431', '.95', 'drift2');
  // lighthouse, ~1.3x the first version
  body += `<g transform="translate(120 ${hy}) scale(1.15) translate(0 ${-hy})"><path d="M-22 ${hy + 2}L-12 36H12L22 ${hy + 2}Z" fill="#c9d2f0"/><path d="M-17 ${hy - 22}L-14 ${hy - 40}H14L17 ${hy - 22}ZM-20 ${hy - 56}L-13 ${hy - 70}H13L20 ${hy - 56}Z" fill="#a33b3b"/><rect x="-11" y="${hy - 88}" width="22" height="18" fill="#0a1230" stroke="${GOLD}"/><path d="M-15 ${hy - 88}L0 ${hy - 100}L15 ${hy - 88}Z" fill="#0a1230"/><circle class="lamp" cx="0" cy="${hy - 79}" r="34" fill="url(#glow)"/><circle cx="0" cy="${hy - 79}" r="5" fill="${HI}"/><rect x="-30" y="${hy}" width="60" height="6" rx="2" fill="#0a1230"/></g>`;
  body += `<text class="h emb" x="600" y="62" text-anchor="middle" font-size="34" font-weight="700" fill="url(#gold)">Open to mentoring</text>`;
  body += `<text class="t emb" x="600" y="94" text-anchor="middle" font-size="20" fill="#fff">Walkthroughs of private work on request</text>`;
  return shell(H, '0xCryp7icX: open to mentoring',
    'A dawn harbour with a lighthouse and a rising sun on the horizon. Text: open to mentoring, walkthroughs of private work on request.', body, '', dawn);
}

for (const [f, s] of [['about', about()], ['projects', projects()], ['footer', footer()]]) {
  writeFileSync(join(out, `${f}.svg`), s);
  console.log(f, s.length, 'bytes');
}
