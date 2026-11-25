// Authoring script (Coder A): writes templates/hero.svg.tpl, stack.svg.tpl, activity.svg.tpl.
// Data placeholders ({{langBlips}}, {{tideChart}}, {{repos}}, {{since}}, {{contrib}}, {{updated}}) are filled by scripts/generate.mjs.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const out = (n) => fileURLToPath(new URL(`../templates/${n}.svg.tpl`, import.meta.url));
function R(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = R(4242);
const rr = (a, b) => a + (b - a) * rnd();
const f = (n) => +n.toFixed(1);

// ---------- shared system ----------
const waveD = (y, a, p, W) => { const h = p / 2, k = Math.ceil((W + 2 * p) / h); let d = `M${-p} ${y}q${h / 2} ${-a} ${h} 0`; for (let i = 1; i < k; i++) d += `t${h} 0`; return d + `V600H${-p}Z`; };
const bands = (list, W, from = 0, fo = 1) => list.map(([y, a, p, dur, col], i) => `<g style="animation:w${from + i} ${dur}s linear infinite${i % 2 ? ' reverse' : ''}"><path d="${waveD(y, a, p, W)}" fill="${col}" fill-opacity="${fo}" stroke="#9fb8ff" stroke-opacity=".2"/></g>`);
const waveCss = (list, from = 0) => list.map(([, , p], i) => `@keyframes w${from + i}{to{transform:translateX(${-p}px)}}`).join('');
const stars = (n, W, H) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle ${i % 6 === 0 ? `class="tw" style="animation-delay:-${f(rr(0, 5))}s" ` : ''}cx="${f(rr(10, W - 10))}" cy="${f(rr(6, H))}" r="${f(rr(0.5, 1.5))}" opacity="${f(rr(0.4, 0.95))}"/>`; return `<g fill="#eef2ff">${s}</g>`; };
const css = (extra = '') => `<style>
.t{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif}
.h{font-family:Georgia,'Palatino Linotype','Book Antiqua',serif}
.o{paint-order:stroke;stroke:#050c24;stroke-width:3;stroke-linejoin:round}
.tw{animation:twinkle 5s ease-in-out infinite}
.fog{animation:fogdrift 40s ease-in-out infinite alternate}
.st{display:none}
.pulse{animation:pulse 6s ease-in-out infinite}
.bob{animation:bob 5s ease-in-out infinite}
.blink{animation:blink 2.4s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes fogdrift{from{transform:translateX(-50px)}to{transform:translateX(50px)}}
@keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes bob{0%,100%{transform:translateY(-2px)}50%{transform:translateY(3px)}}
@keyframes blink{0%,100%{opacity:.35}50%{opacity:1}}
${extra}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.sm{display:none}.st{display:inline}.blip,.pulse,.blink{opacity:1}.tw{opacity:.7}}
</style>`;
const defs = (W, H, extra = '', css2 = '') => `<defs>${css(css2)}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050c24"/><stop offset=".55" stop-color="#0a1230"/><stop offset="1" stop-color="#1b2a5a"/></linearGradient>
<radialGradient id="moonH"><stop offset="0" stop-color="#dfe8ff" stop-opacity=".9"/><stop offset=".2" stop-color="#a9bff5" stop-opacity=".3"/><stop offset="1" stop-color="#6f8be0" stop-opacity="0"/></radialGradient>
<radialGradient id="mist"><stop offset="0" stop-color="#8fa9e8" stop-opacity=".22"/><stop offset="1" stop-color="#8fa9e8" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".7"/><stop offset=".5" stop-color="#f3c66b" stop-opacity=".2"/><stop offset="1" stop-color="#f3c66b" stop-opacity="0"/></linearGradient>
<radialGradient id="lamp"><stop offset="0" stop-color="#fff3c8" stop-opacity=".95"/><stop offset=".3" stop-color="#f3c66b" stop-opacity=".45"/><stop offset="1" stop-color="#f3c66b" stop-opacity="0"/></radialGradient>
<linearGradient id="tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1430"/><stop offset=".55" stop-color="#3d4e7e"/><stop offset="1" stop-color="#9db0e0"/></linearGradient>
<linearGradient id="plq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2a5a"/><stop offset="1" stop-color="#0a1230"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset=".5" stop-color="#f3c66b"/><stop offset="1" stop-color="#b8923a"/></linearGradient>
<linearGradient id="shd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#050a18"/><stop offset="1" stop-color="#1a2646"/></linearGradient>
<linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fd4ff" stop-opacity=".05"/><stop offset="1" stop-color="#9fd4ff" stop-opacity=".5"/></linearGradient>
<radialGradient id="vigR" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#010309" stop-opacity="0"/><stop offset="1" stop-color="#010309" stop-opacity=".75"/></radialGradient>
<filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="ds" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".6"/></filter>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="12"/></clipPath>${extra}
</defs>`;
const panel = (W, H, title, desc, extraDefs, body, css2 = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="ti de"><title id="ti">${title}</title><desc id="de">${desc}</desc>${defs(W, H, extraDefs, css2)}<g clip-path="url(#frame)">${body}</g><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="#cfd8ff" stroke-opacity=".4"/></svg>`;
// slashed-zero title with emboss (x0 = left edge, base = baseline, size = font px)
const title = (x0, base, size) => {
  const k = size / 42, zr = 10.5 * k, zh = 15 * k, zx = x0 + 15 * k, zy = base - zh, tx = x0 + 36 * k, tl = 236 * k, sw = 5 * k;
  const Z = (dx, dy, col, op, flt) => `<g transform="translate(${f(dx * k)} ${f(dy * k)})" fill="none" stroke="${col}" stroke-width="${f(sw)}" opacity="${op}"${flt ? ' filter="url(#b2)"' : ''}><ellipse cx="${f(zx)}" cy="${f(zy)}" rx="${f(zr)}" ry="${f(zh)}"/><path d="M${f(zx - 7 * k)} ${f(zy + 9 * k)}L${f(zx + 7 * k)} ${f(zy - 9 * k)}" stroke-width="${f(sw * 0.65)}"/></g>`;
  const W = (dx, dy, fill, op, flt, ex = '') => `<text class="h" x="${f(tx + dx * k)}" y="${f(base + dy * k)}" font-size="${size}" font-weight="700" textLength="${f(tl)}" lengthAdjust="spacing" fill="${fill}" opacity="${op}"${flt ? ' filter="url(#b2)"' : ''}${ex}>xCryp7icX</text>`;
  return Z(2.4, 4.4, '#000', .85, 1) + W(2.4, 4.4, '#000', .85, 1) + Z(0, 1.4, '#000', .9) + W(0, 1.4, '#000', .9) + Z(-1.4, -1.9, '#fff3cc', .9) + W(-1.4, -1.9, '#fff3cc', .9) + Z(0, 0, 'url(#gold)', 1) + W(0, 0, 'url(#gold)', 1, 0, ' stroke="#5e4510" stroke-width=".6"');
};
const buoy = (x, y, sc, col, glow, dl) => `<g class="bob" style="animation-delay:-${dl}s"><g transform="translate(${x} ${y}) scale(${sc})"><path d="M-9 0L-5-18H5L9 0Z" fill="${col}"/><rect x="-9" y="-2" width="18" height="4" fill="#0a1230" opacity=".6"/><path d="M5-18L9 0" stroke="#fff" stroke-opacity=".4"/><path d="M0-18V-26" stroke="#0a1230" stroke-width="2"/><circle class="blink" cx="0" cy="-28" r="3.2" fill="${glow}" filter="url(#glow)" style="animation-delay:-${dl}s"/></g></g>`;
const plate = (x, y, w, h, label, val, vsize = 30) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#plq)" filter="url(#ds)"/><rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="8" fill="none" stroke="#f3c66b" stroke-opacity=".5"/><rect x="${x}" y="${y + 1.5}" width="${w}" height="1" fill="#fff" opacity=".12"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="5" fill="none" stroke="#b7c8ff" stroke-opacity=".14"/>${[[x + 10, y + 10], [x + w - 10, y + 10], [x + 10, y + h - 10], [x + w - 10, y + h - 10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.8" fill="#f3c66b" opacity=".5"/>`).join('')}<text class="t" x="${x + 24}" y="${y + 24}" font-size="16" font-weight="600" letter-spacing="1.4" fill="#b9c3e6">${label}</text><text class="t" x="${x + 24}" y="${y + h - 11}" font-size="${vsize}" font-weight="700" fill="#ffe7a8">${val}</text>`;

// ================= HERO 1200x380 =================
{
  const B = [[262, 3, 90, 52, '#1c3d80'], [284, 4, 120, 40, '#163169'], [310, 5, 150, 30, '#102555'], [338, 6, 180, 22, '#0b1b42'], [364, 7, 220, 17, '#07122e']];
  const w = bands(B, 1200, 10, 0.62);
  let b = `<rect width="1200" height="380" fill="url(#sky)"/>`;
  b += `<circle cx="1040" cy="64" r="130" fill="url(#moonH)"/><circle cx="1040" cy="64" r="14" fill="#eef2ff"/>`;
  b += stars(60, 1200, 230);
  b += `<g class="fog" style="animation-delay:-8s"><ellipse cx="640" cy="215" rx="520" ry="30" fill="url(#mist)"/><ellipse cx="960" cy="180" rx="360" ry="20" fill="url(#mist)" opacity=".7"/></g>`;
  // far headland (low contrast), town lights, distant ship
  let tl = ''; for (let i = 0; i < 14; i++) tl += `<circle cx="${f(rr(880, 1170))}" cy="${f(rr(247, 258))}" r="1" ${i % 4 === 0 ? 'class="tw" ' : ''}style="animation-delay:-${f(rr(0, 5))}s"/>`;
  b += `<path d="M820 262Q900 238 960 248Q1040 234 1110 246Q1160 242 1200 252V262Z" fill="#12234d" opacity=".8"/><g fill="#f3c66b" opacity=".55">${tl}</g>`;
  b += `<g opacity=".55"><path d="M700 259h46l-6 7h-34z" fill="#12234d"/><path d="M722 259V238M722 242l12 14h-12M722 246l-9 11h9" stroke="#12234d" fill="#12234d"/><circle cx="722" cy="237" r="1.6" fill="#f3c66b" class="blink"/></g>`;
  // sea: lit gradient base so the lower water is not flat bands
  b += `<rect y="262" width="1200" height="118" fill="url(#seaG)"/>`;
  b += w[0] + w[1];
  // sea glints
  let gl = ''; for (let i = 0; i < 52; i++) { const y = rr(268, 376), len = 8 + (y - 262) * 0.22 * rnd() + 6; gl += `<path ${i % 3 === 0 ? 'class="tw" ' : ''}style="animation-delay:-${f(rr(0, 5))}s" d="M${f(rr(300, 1190))} ${f(y)}h${f(len)}" stroke="#cfe0ff" stroke-opacity="${f(rr(0.15, 0.4))}"/>`; }
  b += `<g stroke-width="1" fill="none">${gl}</g>`;
  let sh = ''; for (let i = 0; i < 6; i++) sh += `<ellipse cx="${1040 + (i % 2 ? 5 : -5)}" cy="${268 + i * 9}" rx="${f(24 - i * 2.8)}" ry="1.5"/>`;
  b += `<g fill="#eef2ff" filter="url(#b2)" opacity=".45" style="animation:shim 6s ease-in-out infinite alternate">${sh}</g>`;
  b += w[2];
  // beam glint on the water: gradient strip, displaced by turbulence
  b += `<g class="pulse" style="mix-blend-mode:screen"><polygon points="470,262 570,262 650,380 400,380" fill="url(#refl)" filter="url(#shimmer)"/></g>`;
  // lighthouse (hero element, ~1.3x), drawn in the original 120,312 frame and scaled about its base
  let lh = `<path d="M-60 380V332Q-20 316 40 312L200 310Q240 322 280 342L320 380Z" fill="url(#rock)"/><path d="M40 312L200 310Q240 322 280 342" fill="none" stroke="#9db0e0" stroke-opacity=".5" stroke-width="1.4"/>`;
  lh += `<clipPath id="tC"><polygon points="108,112 132,112 145,312 95,312"/></clipPath><polygon points="108,112 132,112 145,312 95,312" fill="url(#tower)"/><g clip-path="url(#tC)"><rect x="90" y="150" width="60" height="22" fill="#0a1230" opacity=".8"/><rect x="90" y="214" width="60" height="22" fill="#0a1230" opacity=".8"/><rect x="90" y="274" width="60" height="22" fill="#0a1230" opacity=".8"/></g>`;
  lh += `<path d="M132 112L145 312" stroke="#d8e4ff" stroke-opacity=".75" stroke-width="1.2"/><path d="M108 112L95 312" stroke="#000" stroke-opacity=".6"/><rect x="123" y="226" width="5" height="10" rx="1" fill="#ffe7a8" opacity=".85"/><rect x="108" y="262" width="5" height="10" rx="1" fill="#0a1230"/>`;
  lh += `<rect x="98" y="106" width="44" height="7" fill="#16264f"/><path d="M100 106V98M109 106V98M120 106V98M131 106V98M140 106V98M98 98H142" stroke="#2a3b6e" stroke-width="1.5" fill="none"/><rect x="98" y="106" width="44" height="1.4" fill="#d8e4ff" opacity=".7"/>`;
  lh += `<rect x="109" y="76" width="22" height="22" fill="#ffe7a8"/><path d="M114 76V98M120 76V98M126 76V98" stroke="#7a5a18" stroke-opacity=".6"/><path d="M105 76Q120 54 135 76Z" fill="#1c2a50"/><path d="M120 56V50" stroke="#2a3b6e" stroke-width="2"/><path d="M135 76Q129 62 120 58" stroke="#d8e4ff" stroke-opacity=".6" fill="none"/>`;
  b += `<g transform="translate(120 346) scale(1.3) translate(-120 -312)">${lh}</g>`;
  // lantern at (120, 346-(312-87)*1.3 = 54)
  b += `<g style="mix-blend-mode:screen"><circle class="pulse" cx="120" cy="56" r="96" fill="url(#lamp)" filter="url(#b12)"/><circle class="pulse" cx="120" cy="56" r="40" fill="url(#lamp)" filter="url(#b6)" style="animation-delay:-2s"/><circle cx="120" cy="56" r="170" fill="url(#lamp)" opacity=".18"/><g class="beam" filter="url(#b4)"><polygon points="122,50 1200,2 1200,150 122,64" fill="url(#beam)"/></g></g>`;
  b += w[3] + w[4];
  b += buoy(400, 334, 1, '#b3262e', '#ff6b6b', 0) + buoy(620, 350, 1, '#1f7a54', '#6bffb0', 1.5) + buoy(780, 292, .55, '#b3262e', '#ff6b6b', 3);
  // low drifting fog over the water
  b += `<g class="fog" style="animation-delay:-20s"><ellipse cx="600" cy="300" rx="640" ry="16" fill="url(#mist)" opacity=".8"/><ellipse cx="400" cy="340" rx="560" ry="22" fill="url(#mist)" opacity=".6"/></g><g class="fog" style="animation-delay:-6s;animation-duration:55s"><ellipse cx="900" cy="272" rx="420" ry="12" fill="url(#mist)" opacity=".7"/></g>`;
  b += `<g filter="url(#b6)" fill="#010309" opacity=".95"><path d="M1060 380Q1100 352 1160 380Z"/></g>`;
  b += `<rect width="1200" height="380" fill="url(#vigR)"/>`;
  b += `<ellipse cx="580" cy="150" rx="320" ry="70" fill="#050c24" opacity=".35" filter="url(#b12)"/>`;
  b += title(330, 150, 72);
  b += `<path d="M330 172H670" stroke="#f3c66b" stroke-opacity=".6"/>`;
  b += `<text class="t o" x="330" y="212" font-size="26" font-weight="600" fill="#eef2ff">Senior Cybersecurity Engineer · Mentor</text>`;
  b += `<text class="t o" x="330" y="248" font-size="20" font-weight="600" letter-spacing="1.4" fill="#f3c66b">Security · Cloud &amp; AI · Creative Tooling</text>`;
  const extra = `@keyframes shim{from{opacity:.5;transform:translateX(-4px)}to{opacity:1;transform:translateX(4px)}}
.beam{transform-origin:120px 56px;animation:sweep 12s ease-in-out infinite alternate}
@keyframes sweep{from{transform:rotate(-6deg)}to{transform:rotate(8deg)}}${waveCss(B, 10)}`;
  const xd = `<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#244b94"/><stop offset=".5" stop-color="#14306a"/><stop offset="1" stop-color="#0a1a40"/></linearGradient><linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".55"/><stop offset="1" stop-color="#f3c66b" stop-opacity="0"/></linearGradient><filter id="shimmer" x="-20%" y="0" width="140%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .4" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  writeFileSync(out('hero'), panel(1200, 380, '0xCryp7icX: Lighthouse Watch', 'A night harbour with a lighthouse sweeping its beam across the sea. Title 0xCryp7icX, Senior Cybersecurity Engineer and Mentor, Security, Cloud and AI, Creative Tooling. Updated {{updated}}.', xd, b, extra));
}

// ================= STACK 1200x340 =================
{
  const B = [[302, 4, 120, 36, '#102555'], [324, 5, 160, 26, '#0b1b42']];
  const w = bands(B, 1200, 20);
  let b = `<rect width="1200" height="340" fill="url(#sky)"/>` + stars(40, 1200, 220);
  b += `<g class="fog" style="animation-delay:-5s"><ellipse cx="600" cy="270" rx="560" ry="26" fill="url(#mist)"/></g>`;
  b += `<text class="t" x="40" y="42" font-size="16" font-weight="700" letter-spacing="2.4" fill="#f3c66b">SIGNAL FLAGS · STACK</text><path d="M40 52H640" stroke="#f3c66b" stroke-opacity=".5"/>`;
  b += `<text class="t" x="700" y="42" font-size="16" font-weight="700" letter-spacing="2.4" fill="#f3c66b">LANGUAGE SONAR · SHARE OF CODE</text><path d="M700 52H1160" stroke="#f3c66b" stroke-opacity=".5"/>`;
  // flags in the navy / gold / ivory family
  const IV = '#f3ecd8', NV = '#1b2a5a', DN = '#0f2247', GD = '#f3c66b', DG = '#b8923a', INK = '#0a1230';
  const FL = [['Rust', NV, IV], ['TypeScript', IV, INK], ['JavaScript', GD, INK], ['Python', DN, GD], ['Next.js', '#e6dcc0', INK], ['HTML/CSS', NV, GD], ['Node.js', DG, INK]];
  const rows = [[84, 0, 4], [198, 4, 3]];
  const A = 'M0 0H134L114 32L134 64H0Z', A2 = 'M0 0H128L106 32L128 64H0Z';
  rows.forEach(([ry, s0, n]) => {
    const mh = ry === 84 ? 150 : 100;
    b += `<path d="M44 ${ry + 8}Q340 ${ry + 30} 636 ${ry + 8}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3" filter="url(#b2)"/><path d="M44 ${ry}Q340 ${ry + 22} 636 ${ry}" fill="none" stroke="#8fa0d0" stroke-width="2"/><rect x="38" y="${ry - 12}" width="6" height="${mh}" fill="#16264f"/><rect x="636" y="${ry - 12}" width="6" height="${mh}" fill="#16264f"/><circle cx="41" cy="${ry - 14}" r="3" fill="${GD}" class="blink"/><circle cx="639" cy="${ry - 14}" r="3" fill="${GD}" class="blink" style="animation-delay:-1s"/>`;
    for (let i = 0; i < n; i++) {
      const [name, bg, fg] = FL[s0 + i], fx = 56 + i * 142, t = (fx + 67 - 44) / 592, fy = ry + 44 * t * (1 - t) - 2, tr = `translate(${fx} ${f(fy)})`;
      const body = (anim) => `<path d="${A}" fill="${bg}" stroke="${GD}" stroke-opacity=".6">${anim ? `<animate attributeName="d" values="${A};${A2};${A}" dur="${3 + (i % 2) * 0.6}s" begin="-${f(i * 0.8)}s" repeatCount="indefinite"/>` : ''}</path><path d="M0 0H134" stroke="#fff" stroke-opacity=".35"/><path d="M0 64H114" stroke="#000" stroke-opacity=".3"/><text class="t" x="12" y="39" font-size="17" font-weight="700" fill="${fg}">${name}</text>`;
      b += `<g class="sm" transform="${tr}"><g><animateTransform attributeName="transform" type="skewY" values="-2.5;2.5;-2.5" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${3.4 + (i % 3) * 0.4}s" begin="-${f(i * 0.7 + s0 * 0.3)}s" repeatCount="indefinite"/>${body(1)}</g></g><g class="st" transform="${tr}">${body(0)}</g>`;
    }
  });
  const CX = 935, CY = 190, wedge = '<path d="M0 0L215 0A215 215 0 0 0 176 -123Z" fill="url(#sweepG)"/>';
  b += `<g transform="translate(${CX} ${CY}) scale(1 .4)"><circle r="215" fill="#7fb0e8" fill-opacity=".07"/><g fill="none" stroke="#9fd4ff" stroke-opacity=".4" stroke-width="2.2"><circle r="215"/><circle r="143"/><circle r="72"/></g><path d="M-215 0H215M0 -215V215" stroke="#9fd4ff" stroke-opacity=".25" stroke-width="2"/><g class="sm"><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/>${wedge}</g></g><g class="st">${wedge}</g></g>`;
  b += `{{langBlips}}`;
  b += w[0] + w[1];
  b += buoy(100, 332, .8, '#b3262e', '#ff6b6b', 0) + buoy(1120, 318, .8, '#1f7a54', '#6bffb0', 2);
  b += `<rect width="1200" height="340" fill="url(#vigR)"/>`;
  const extra = `.blip{animation:blipA 7s ease-in-out infinite}
@keyframes blipA{0%{opacity:.8}12%{opacity:1}90%{opacity:1}100%{opacity:.8}}${waveCss(B, 20)}`;
  writeFileSync(out('stack'), panel(1200, 340, 'Tech stack', 'Signal flags for Rust, TypeScript, JavaScript, Python, Next.js, HTML/CSS and Node.js, beside a sonar showing one blip per language sized by share. Updated {{updated}}.', '', b, extra));
}

// ================= ACTIVITY 1200x300 (real tide chart) =================
{
  let b = `<rect width="1200" height="300" fill="url(#sky)"/>` + stars(30, 1200, 150);
  b += `<g class="fog" style="animation-delay:-12s"><ellipse cx="460" cy="250" rx="520" ry="30" fill="url(#mist)"/></g>`;
  b += `<text class="t" x="40" y="34" font-size="16" font-weight="700" letter-spacing="2.4" fill="#f3c66b">TIDE CHART · CONTRIBUTIONS PER WEEK, LAST YEAR</text>`;
  b += `{{tideChart}}`;
  b += plate(880, 44, 280, 72, 'REPOS', '{{repos}}') + plate(880, 124, 280, 72, 'ON GITHUB SINCE', '{{since}}') + plate(880, 204, 280, 72, 'CONTRIBUTIONS · 12 MO', '{{contrib}}');
  b += `<rect width="1200" height="300" fill="url(#vigR)"/>`;
  const extra = `.sheen{animation:sheen 9s ease-in-out infinite alternate}@keyframes sheen{from{transform:translateX(-260px)}to{transform:translateX(260px)}}
.ripple{animation:ripple 7s ease-in-out infinite alternate}@keyframes ripple{from{transform:translateX(-10px)}to{transform:translateX(10px)}}`;
  writeFileSync(out('activity'), panel(1200, 300, 'Activity tide chart', 'A tide chart of weekly contributions over the last year, with log plates for repository count, the year the account started and total contributions. Updated {{updated}}.', '', b, extra));
}

// ================= ACTIVITY FALLBACK 1200x170 ("Harbour log", used when contributions are sparse) =================
{
  const WV = [[104, 3, 100, 40, '#163169'], [122, 4, 140, 30, '#102555'], [142, 5, 180, 22, '#0b1b42']];
  const sea = (anim) => WV.map(([y, a, p, dur, col], i) => `<g>${anim ? `<animateTransform attributeName="transform" type="translate" from="0 0" to="${i % 2 ? p : -p} 0" dur="${dur}s" repeatCount="indefinite"/>` : ''}<path d="${waveD(y, a, p, 1200)}" fill="${col}" stroke="#9fb8ff" stroke-opacity=".2"/></g>`).join('');
  let b = `<rect width="1200" height="170" fill="url(#sky)"/>` + stars(22, 1200, 90);
  b += `<circle cx="1090" cy="40" r="70" fill="url(#moonH)"/><circle cx="1090" cy="40" r="10" fill="#eef2ff"/>`;
  b += `<rect y="100" width="1200" height="70" fill="url(#seaG)"/>`;
  b += `<g class="sm">${sea(1)}</g><g class="st">${sea(0)}</g>`;
  b += `<g class="fog" style="animation-delay:-9s"><ellipse cx="600" cy="104" rx="560" ry="10" fill="url(#mist)"/></g>`;
  b += `<text class="t" x="40" y="34" font-size="16" font-weight="700" letter-spacing="2.4" fill="#f3c66b">HARBOUR LOG</text><path d="M40 44H1160" stroke="#f3c66b" stroke-opacity=".4"/>`;
  b += plate(40, 58, 360, 76, 'REPOS', '{{repos}}') + plate(420, 58, 360, 76, 'ON GITHUB SINCE', '{{since}}') + plate(800, 58, 360, 76, 'LANGUAGES', '{{langCount}}');
  b += `<rect width="1200" height="170" fill="url(#vigR)"/>`;
  const xd = `<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#244b94"/><stop offset="1" stop-color="#0a1a40"/></linearGradient>`;
  writeFileSync(out('activity-log'), panel(1200, 170, 'Harbour log', 'A calm harbour horizon with log plates for repository count, the year the account started and the number of languages used. Updated {{updated}}.', xd, b, ''));
}
console.log('templates written');
