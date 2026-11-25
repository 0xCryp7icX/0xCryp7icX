// Authoring script: writes templates/forest-temple.svg.tpl (the art). Run: node scripts/build-template.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const OUT = fileURLToPath(new URL('../templates/forest-temple.svg.tpl', import.meta.url));
function R(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = R(20240611);
const rr = (a, b) => a + (b - a) * rnd();
const f = (n) => +n.toFixed(1);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const GREENS = ['#14463f', '#1f6a5e', '#2a8a6c', '#3fbf86', '#7ee8a8', '#5fa86b', '#1d5a4e', '#0e3b3a'];
const DARK = ['#082a2a', '#0b3533', '#0e3b3a', '#10463f', '#0a2f2c'];
const lf = (x, y, r, s, fill, id = 'lf1', op) => `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s)})" fill="${fill}"${op ? ` opacity="${op}"` : ''}/>`;
function cluster(cx, cy, n, sx, sy, s0, s1, cols, id, keep) {
  let o = '';
  for (let i = 0; i < n; i++) { const x = cx + rr(-sx, sx), y = cy + rr(-sy, sy), r = rr(0, 360), sc = rr(s0, s1), c = pick(cols), l = rnd() < 0.3 ? 'lf2' : (id || 'lf1'); if (!keep || keep(x, y)) o += lf(x, y, r, sc, c, l); }
  return o;
}
function trees(n, base, h0, h1, col, op) {
  let o = `<g fill="${col}" opacity="${op}">`;
  for (let i = 0; i < n; i++) {
    const x = rr(-20, 1220), h = rr(h0, h1), w = rr(2.5, 5), top = base - h;
    o += `<path d="M${f(x - w)} ${base}L${f(x - w / 2)} ${f(top)}h${f(w)}L${f(x + w)} ${base}Z"/>`;
    for (let k = 0; k < 3; k++) o += `<ellipse cx="${f(x + rr(-16, 16))}" cy="${f(top + rr(-6, 18))}" rx="${f(rr(20, 38))}" ry="${f(rr(12, 22))}"/>`;
  }
  return o + '</g>';
}
// ---- defs
const frond = (() => {
  const x11 = 8; let o = `<g id="frond"><path d="M0 0Q6-45 ${x11}-88" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`;
  for (let i = 1; i <= 11; i++) {
    const t = i / 11, y = 2 * (1 - t) * t * -45 + t * t * -88, x = 2 * (1 - t) * t * 6 + t * t * x11, s = 0.78 - 0.05 * i;
    o += lf(x, y, -42, s, 'currentColor').replace(' fill="currentColor"', '') + lf(x, y, -138, s, 'currentColor').replace(' fill="currentColor"', '');
  }
  return o + lf(x11, -88, -90, 0.28, 'currentColor').replace(' fill="currentColor"', '') + '</g>';
})();
const glyphs = {
  shield: '<path d="M0-10L9-6V1C9 7 4 10 0 12-4 10-9 7-9 1V-6Z"/><path d="M-4 0l3 3 5-6"/>',
  cloud: '<path d="M-8 6H7a5 5 0 0 0 0-10 7 7 0 0 0-13-1 5 5 0 0 0-2 11Z"/>',
  sun: '<circle r="4"/><path d="M0-10V-7M0 7V10M-10 0H-7M7 0H10M-7-7l2 2M5 5l2 2M-7 7l2-2M5-5l2-2"/>',
  leaf: '<path d="M-8 8C-8-4 2-10 10-9 10 0 4 9-8 8ZM-8 8L4-4"/>',
  film: '<rect x="-9" y="-7" width="18" height="14" rx="2"/><path d="M-4-7V7M4-7V7M-9-2H-4M4-2H9M-9 3H-4M4 3H9"/>',
  eye: '<path d="M-11 0C-5-8 5-8 11 0 5 8-5 8-11 0Z"/><circle r="3"/>',
};
const clear = (x, y) => !((x > 8 && x < 320 && y > 88 && y < 416) || (x > 880 && x < 1192 && y > 88 && y < 416) || (x > 372 && x < 828 && y > 24 && y < 256));
const defs = `<defs>
<style>
.sw{transform-box:fill-box;transform-origin:50% 0;animation:sway 9s ease-in-out infinite alternate}
.sw2{animation-duration:13s}
.ff{animation:twinkle 6s ease-in-out infinite}
.fg{animation:drift 14s ease-in-out infinite alternate}
.mote{animation:rise 16s ease-in infinite}
.poolg{animation:breath2 6s ease-in-out infinite alternate}
.shaft{animation:breathe 11s ease-in-out infinite alternate}
.fog{animation:fogdrift 40s ease-in-out infinite alternate}
.pulse{animation:pulse 5.5s ease-in-out infinite}
@keyframes sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.8deg)}}
@keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.95}}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(14px,-18px)}}
@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:.9}80%{opacity:.7}100%{transform:translateY(-90px);opacity:0}}
@keyframes breath2{from{opacity:.8}to{opacity:1}}
@keyframes breathe{from{opacity:.45}to{opacity:1}}
@keyframes fogdrift{from{transform:translateX(-48px)}to{transform:translateX(48px)}}
@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
.t{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif}
.h{font-family:Georgia,'Palatino Linotype','Book Antiqua',serif}
.o{paint-order:stroke;stroke:#03100e;stroke-width:3;stroke-linejoin:round}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.fall{display:none}.ff{opacity:.5}.mote{opacity:.55}.poolg{opacity:.9}.shaft{opacity:.7}.pulse{opacity:.85}}
</style>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#041615"/><stop offset=".45" stop-color="#06201f"/><stop offset=".8" stop-color="#0e3b3a"/><stop offset="1" stop-color="#1a5a50"/></linearGradient>
<radialGradient id="moon"><stop offset="0" stop-color="#d8ffe8" stop-opacity=".95"/><stop offset=".25" stop-color="#7ee8a8" stop-opacity=".35"/><stop offset="1" stop-color="#7ee8a8" stop-opacity="0"/></radialGradient>
<radialGradient id="mist"><stop offset="0" stop-color="#7ee8a8" stop-opacity=".24"/><stop offset="1" stop-color="#7ee8a8" stop-opacity="0"/></radialGradient>
<linearGradient id="ray" x1=".9" y1="0" x2=".1" y2="1"><stop offset="0" stop-color="#d8ffe8" stop-opacity=".35"/><stop offset=".6" stop-color="#7ee8a8" stop-opacity=".19"/><stop offset="1" stop-color="#7ee8a8" stop-opacity="0"/></linearGradient>
<linearGradient id="shaftV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8ffcf" stop-opacity="0"/><stop offset=".5" stop-color="#b8ffcf" stop-opacity=".3"/><stop offset="1" stop-color="#d8ffe8" stop-opacity=".42"/></linearGradient>
<radialGradient id="pool"><stop offset="0" stop-color="#35e0a8" stop-opacity=".95"/><stop offset=".5" stop-color="#35e0a8" stop-opacity=".35"/><stop offset="1" stop-color="#35e0a8" stop-opacity="0"/></radialGradient>
<linearGradient id="face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a1413"/><stop offset=".5" stop-color="#223731"/><stop offset="1" stop-color="#587a6c"/></linearGradient>
<linearGradient id="lintel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f1a19"/><stop offset="1" stop-color="#2d4440"/></linearGradient>
<linearGradient id="warm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8ffcf" stop-opacity="0"/><stop offset="1" stop-color="#b8ffcf" stop-opacity=".3"/></linearGradient>
<linearGradient id="cool" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1fbfb0" stop-opacity=".28"/><stop offset="1" stop-color="#1fbfb0" stop-opacity="0"/></linearGradient>
<linearGradient id="shadeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".7" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="dirL" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(20 .5 .5)"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#d8ffe8" stop-opacity=".12"/></linearGradient>
<radialGradient id="doorLit" cx=".5" cy=".7" r=".5"><stop offset="0" stop-color="#d8ffe8" stop-opacity=".32"/><stop offset="1" stop-color="#d8ffe8" stop-opacity="0"/></radialGradient>
<linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a4743" stop-opacity=".3"/><stop offset="1" stop-color="#0d2b2a" stop-opacity=".75"/></linearGradient>
<linearGradient id="barkL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#04100f"/><stop offset=".6" stop-color="#07201e"/><stop offset=".95" stop-color="#3a8a7c"/><stop offset="1" stop-color="#35e0a8"/></linearGradient>
<linearGradient id="barkR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#04100f"/><stop offset=".6" stop-color="#07201e"/><stop offset=".95" stop-color="#3a8a7c"/><stop offset="1" stop-color="#35e0a8"/></linearGradient>
<linearGradient id="fogv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ee8a8" stop-opacity="0"/><stop offset=".7" stop-color="#7ee8a8" stop-opacity=".18"/><stop offset="1" stop-color="#7ee8a8" stop-opacity=".05"/></linearGradient>
<linearGradient id="doorD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020504"/><stop offset=".42" stop-color="#140c04"/><stop offset=".72" stop-color="#f3a640"/><stop offset=".88" stop-color="#ffc56b"/><stop offset="1" stop-color="#35e0a8"/></linearGradient>
<radialGradient id="bloom"><stop offset="0" stop-color="#ffc56b" stop-opacity=".85"/><stop offset=".5" stop-color="#f3a640" stop-opacity=".3"/><stop offset=".8" stop-color="#ffd98a" stop-opacity=".12"/><stop offset="1" stop-color="#f3a640" stop-opacity="0"/></radialGradient>
<linearGradient id="fan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc56b" stop-opacity=".5"/><stop offset=".5" stop-color="#b8ffcf" stop-opacity=".25"/><stop offset="1" stop-color="#7ee8a8" stop-opacity="0"/></linearGradient>
<linearGradient id="shd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="plq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16282a"/><stop offset="1" stop-color="#07130f"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c0"/><stop offset=".5" stop-color="#f0cf72"/><stop offset="1" stop-color="#b8923a"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".8"/><stop offset="1" stop-color="#e8c66a" stop-opacity="0"/></radialGradient>
<radialGradient id="eh"><stop offset="0" stop-color="#b8ffcf" stop-opacity=".8"/><stop offset="1" stop-color="#7ee8a8" stop-opacity="0"/></radialGradient>
<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14463f"/><stop offset=".4" stop-color="#0a2a28"/><stop offset="1" stop-color="#031211"/></linearGradient>
<linearGradient id="strip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020b0a" stop-opacity="0"/><stop offset=".3" stop-color="#020b0a" stop-opacity=".5"/><stop offset=".45" stop-color="#020b0a" stop-opacity=".86"/><stop offset="1" stop-color="#010605" stop-opacity=".95"/></linearGradient>
<radialGradient id="vigR" cx=".5" cy=".5" r=".72"><stop offset=".38" stop-color="#010605" stop-opacity="0"/><stop offset="1" stop-color="#010605" stop-opacity=".99"/></radialGradient>
<filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="b8" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="ds" x="-10%" y="-10%" width="120%" height="135%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".6"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="stoneTex" x="280" y="70" width="640" height="380" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".035 .06" numOctaves="4" seed="7" result="n"/><feDiffuseLighting in="n" surfaceScale="2.4" diffuseConstant="1" lighting-color="#e8fff0" result="l"><feDistantLight azimuth="305" elevation="38"/></feDiffuseLighting><feColorMatrix in="l" type="matrix" values="1.5 0 0 0 0 0 1.5 0 0 0 0 0 1.45 0 0 0 0 0 1 0" result="l2"/><feBlend in="SourceGraphic" in2="l2" mode="multiply" result="m"/><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="s"/><feColorMatrix in="s" type="matrix" values="0 0 0 0 .01 0 0 0 0 .03 0 0 0 0 .02 3.2 0 0 0 -1.75" result="sp"/><feMerge result="mm"><feMergeNode in="m"/><feMergeNode in="sp"/></feMerge><feComposite in="mm" in2="SourceAlpha" operator="in"/></filter>
<filter id="moss" x="280" y="150" width="640" height="300" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
<clipPath id="barClip"><rect width="680" height="12" rx="6"/></clipPath>
<clipPath id="frame"><rect width="1200" height="600" rx="10"/></clipPath>
<clipPath id="tclip"><rect x="310" y="396" width="580" height="44"/><rect x="345" y="320" width="510" height="76"/><rect x="378" y="244" width="444" height="76"/><rect x="405" y="176" width="390" height="68"/><rect x="440" y="98" width="320" height="78"/><rect x="426" y="84" width="348" height="14"/></clipPath>
<filter id="dsb" x="-5%" y="-60%" width="110%" height="260%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/></filter>
<filter id="b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="barkTex" x="200" y="-20" width="800" height="500" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".06 .004" numOctaves="3" seed="11" result="n"/><feColorMatrix in="n" type="matrix" values=".7 0 0 0 .25 0 .7 0 0 .25 0 0 .7 0 .25 0 0 0 1 0" result="g"/><feBlend in="SourceGraphic" in2="g" mode="multiply" result="m"/><feComposite in="m" in2="SourceAlpha" operator="in"/></filter>
<clipPath id="dclip"><rect x="572" y="330" width="56" height="110"/></clipPath>
<g id="lf1"><path d="M0 0C8-10 22-12 34 0 22 12 8 10 0 0Z"/><path d="M1 0H30" fill="none" stroke="#02100e" stroke-opacity=".35" stroke-width=".9"/></g>
<g id="lf2"><path d="M0 0C6-14 24-16 30 0 24 16 6 14 0 0Z"/><path d="M1 0H26" fill="none" stroke="#02100e" stroke-opacity=".35" stroke-width=".9"/></g>
<g id="lf3"><path d="M0 0C10-6 26-7 40 0 26 7 10 6 0 0Z"/><path d="M1 0H34" fill="none" stroke="#02100e" stroke-opacity=".3" stroke-width=".8"/></g>
${frond}
</defs>`;
let s = '';
s += `<rect width="1200" height="600" fill="url(#sky)"/>`;
s += `<circle cx="1010" cy="58" r="120" fill="url(#moon)"/><circle cx="1010" cy="58" r="15" fill="#d8ffe8" opacity=".9"/>`;
// far trunks: blurred, desaturated teal
s += `<g filter="url(#b3)">${trees(22, 440, 150, 280, '#16403c', 0.5)}</g>`;
s += `<g filter="url(#b3)" fill="url(#trunk)">${[[60, 36], [150, 34], [250, 40], [470, 30], [735, 30], [950, 40], [1050, 36], [1140, 36]].map(([x, w]) => `<polygon points="${x - w * 0.22},-10 ${x + w * 0.22},-10 ${x + w / 2},452 ${x - w / 2},452"/>`).join('')}</g><rect y="240" width="1200" height="220" fill="url(#fogv)"/>`;
s += trees(16, 450, 120, 230, '#06201f', 0.85);
s += trees(12, 470, 90, 170, '#031211', 0.95);
s += `<g class="fog"><ellipse cx="300" cy="430" rx="360" ry="46" fill="url(#mist)"/><ellipse cx="900" cy="440" rx="380" ry="40" fill="url(#mist)"/></g>`;
s += `<g class="fog" style="animation-delay:-9s;animation-duration:44s"><ellipse cx="600" cy="360" rx="500" ry="60" fill="url(#mist)" opacity=".7"/></g>`;
// giant trunks framing the temple
const trunk = (left) => { const cx = left ? 340 : 860, g = left ? 'barL' : 'barkR'; const d = left ? `M${cx - 60} -10H${cx + 56}C${cx + 52} 120 ${cx + 66} 300 ${cx + 72} 452H${cx - 80}C${cx - 66} 300 ${cx - 54} 120 ${cx - 60} -10Z` : `M${cx - 56} -10H${cx + 60}C${cx + 54} 120 ${cx + 66} 300 ${cx + 80} 452H${cx - 72}C${cx - 66} 300 ${cx - 52} 120 ${cx - 56} -10Z`; const rim = left ? `M${cx + 56} 0C${cx + 52} 130 ${cx + 66} 300 ${cx + 72} 440` : `M${cx - 56} 0C${cx - 52} 130 ${cx - 66} 300 ${cx - 72} 440`; let streaks = ''; for (let i = 0; i < 7; i++) { const x = cx + rr(-48, 48); streaks += `M${f(x)} 0Q${f(x + rr(-10, 10))} 220 ${f(x + rr(-14, 14))} 450`; } return `<path d="${d}" fill="url(#${left ? 'barkL' : 'barkR'})"/><path d="${streaks}" stroke="#010807" stroke-opacity=".5" stroke-width="2" fill="none"/><path d="${rim}" stroke="#35e0a8" stroke-opacity=".5" stroke-width="5" fill="none"/>`; };
s += `<g opacity=".9" filter="url(#barkTex)">${trunk(true)}${trunk(false)}</g>`;
s += `<g class="fog" opacity=".67" style="animation-delay:-20s"><ellipse cx="600" cy="450" rx="340" ry="28" fill="url(#mist)" opacity=".7"/><ellipse cx="600" cy="120" rx="440" ry="26" fill="url(#mist)"/><ellipse cx="600" cy="230" rx="470" ry="30" fill="url(#mist)" opacity=".8"/><ellipse cx="600" cy="340" rx="500" ry="34" fill="url(#mist)" opacity=".8"/><ellipse cx="150" cy="260" rx="170" ry="60" fill="url(#mist)" opacity=".7"/><ellipse cx="1050" cy="260" rx="170" ry="60" fill="url(#mist)" opacity=".7"/></g>`;
// ---- temple
const MOSS = ['#2f6a55', '#3b7a62', '#2a5a4a', '#4a8a6e'], MOSSL = ['#1f6a5e', '#2a8a6c', '#14463f', '#1d5a4e'];
s += `<ellipse cx="600" cy="330" rx="270" ry="190" fill="url(#eh)" opacity=".1"/>`;
s += '<g transform="translate(600 440) scale(1 1.16) translate(-600 -440)">';
const T = [[310, 890, 396, 440], [345, 855, 320, 396], [378, 822, 244, 320], [405, 795, 176, 244]];
const LINTEL = [440, 760, 98, 176], CAP = [426, 774, 84, 98];
s += `<g filter="url(#stoneTex)">` + T.map(([a, b, c, d]) => `<rect x="${a}" y="${c}" width="${b - a}" height="${d - c}" fill="url(#face)"/>`).join('') + `<rect x="${LINTEL[0]}" y="${LINTEL[2]}" width="320" height="78" fill="url(#lintel)"/><rect x="${CAP[0]}" y="${CAP[2]}" width="348" height="14" fill="url(#face)"/></g>`;
const bevel = (x1, x2, y1, y2, dark) => {
  const w = x2 - x1;
  return `<rect x="${x1}" y="${y1}" width="${w}" height="${y2 - y1}" fill="url(#shadeL)"/><rect x="${x1}" y="${y1}" width="${w}" height="${y2 - y1}" fill="url(#cool)" opacity=".7"/><rect x="${x1}" y="${y1}" width="${w}" height="${y2 - y1}" fill="url(#warm)"/><rect x="${x1}" y="${y1}" width="16" height="${y2 - y1}" fill="#000" opacity=".15"/>` +
    `<rect x="${x1 + 2}" y="${y1 + 7}" width="${w - 4}" height="6" fill="#000" opacity=".6" filter="url(#b3)"/><rect x="${x1}" y="${y1}" width="${w}" height="7" fill="#d8ffe8" opacity=".22"/><rect x="${x1}" y="${y1}" width="${w}" height="1.5" fill="#bff5e0" opacity=".6"/><rect x="${x1}" y="${y1 - 1}" width="${w}" height="1" fill="#e0fff0" opacity=".3"/><rect x="${x1 + w * .4}" y="${y1 - .5}" width="${w * .6}" height="2.5" fill="#d8ffe8" opacity=".55" filter="url(#b3)"/><rect x="${x1}" y="${y2 - 3}" width="${w}" height="3" fill="#020807" opacity=".6"/>` +
    `<path d="M${x2 - .5} ${y1}V${y2}" stroke="#b8ffcf" stroke-opacity=".7" stroke-width="1"/><path d="M${x1 + .7} ${y1}V${y2}" stroke="#020807" stroke-opacity=".6" stroke-width="1.4"/>`;
};
T.forEach(([a, b, c, d]) => {
  s += bevel(a, b, c, d);
  let j = `M${a} ${f((c + d) / 2)}H${b}`;
  [[c, (c + d) / 2], [(c + d) / 2, d]].forEach(([r0, r1], ri) => { for (let x = a + (ri ? 30 : 60); x < b; x += 72) j += `M${x} ${f(r0)}V${f(r1)}`; });
  s += `<path d="${j}" stroke="#020807" stroke-opacity=".4" fill="none"/>`;
});
s += bevel(...LINTEL, true) + `<rect x="${LINTEL[0] + 4}" y="${LINTEL[2] + 4}" width="312" height="70" fill="none" stroke="#e8c66a" stroke-opacity=".3"/>` + bevel(...CAP, true);
// directional modelling overlay, clipped to the temple, brightest at the door
s += `<g clip-path="url(#tclip)"><rect x="310" y="84" width="580" height="356" fill="url(#dirL)"/><rect x="400" y="240" width="400" height="200" fill="url(#doorLit)" style="mix-blend-mode:screen"/></g>`;
// carved geometric bands
const band = (x0, x1, y) => { let d = ''; for (let x = x0; x + 14 <= x1; x += 16) d += `M${x} ${y}l7-7 7 7-7 7Z`; return `<path d="${d}" fill="none" stroke="#020807" stroke-opacity=".75" stroke-width="1.5"/><path d="${d}" fill="none" stroke="#e8fff0" stroke-opacity=".2" transform="translate(0 1.6)"/>`; };
s += band(392, 506, 284) + band(694, 808, 284);
const lines = (x0, x1, y) => `<path d="M${x0} ${y}H${x1}M${x0} ${y + 5}H${x1}" stroke="#020807" stroke-opacity=".6" stroke-width="1.5" fill="none"/><path d="M${x0} ${y + 1.6}H${x1}M${x0} ${y + 6.6}H${x1}" stroke="#e8fff0" stroke-opacity=".18" fill="none"/>`;
s += lines(360, 840, 352) + lines(325, 875, 414);
s += `<g style="mix-blend-mode:screen"><circle class="pulse" style="animation-duration:6s" cx="600" cy="400" r="175" fill="url(#bloom)" filter="url(#b14)"/><circle cx="520" cy="410" r="26" fill="#ffd98a" opacity=".16" filter="url(#b6)"/><circle cx="680" cy="410" r="26" fill="#ffd98a" opacity=".16" filter="url(#b6)"/></g>`;
// entrance: square pilasters, architrave, door
[534, 632].forEach(x => { s += `<rect x="${x}" y="308" width="34" height="132" fill="url(#face)"/><rect x="${x}" y="308" width="34" height="132" fill="url(#warm)"/><path d="M${x === 534 ? x + 33.5 : x + .5} 308V440" stroke="#ffe9b0" stroke-opacity=".95"/><rect x="${x === 534 ? x + 26 : x}" y="308" width="8" height="132" fill="#ffd98a" opacity=".25"/><path d="M${x + 11} 310V440" stroke="#020807" stroke-opacity=".3"/><rect x="${x - 5}" y="304" width="44" height="10" fill="url(#face)"/><rect x="${x - 5}" y="304" width="44" height="1.8" fill="#f0fff4" opacity=".8"/><rect x="${x - 5}" y="430" width="44" height="10" fill="url(#face)"/>`; });
s += `<rect x="568" y="326" width="64" height="114" fill="#010504" stroke="#0b1513" stroke-width="3"/><rect x="572" y="330" width="56" height="110" fill="url(#doorD)"/><g clip-path="url(#dclip)"><rect x="566" y="324" width="68" height="14" fill="#000" opacity=".95" filter="url(#b6)"/></g>`;
s += `<rect x="514" y="296" width="172" height="30" fill="url(#face)"/><rect x="514" y="296" width="172" height="30" fill="url(#shadeL)"/><rect x="506" y="288" width="188" height="9" fill="url(#face)"/><rect x="506" y="288" width="188" height="1.8" fill="#f0fff4" opacity=".9"/><rect x="514" y="322" width="172" height="5" fill="#000" opacity=".5"/><path d="M686 296V326" stroke="#b8ffcf" stroke-opacity=".7"/><path d="M514 311H686" stroke="#020807" stroke-opacity=".4"/>`;
// moss clumps, heaviest at corners and shadow (left) side
let mo = '';
T.forEach(([a, b, c]) => { for (let k = 0; k < 8; k++) { const u = rnd(), mx = u < 0.45 ? a + 6 + rr(0, 70) : u < 0.7 ? b - 6 - rr(0, 50) : rr(a + 8, b - 8), col = pick(MOSS);
  if (rnd() < 0.4) { const len = rr(30, 80), x0 = Math.min(mx, b - len - 4); mo += `<rect x="${f(x0)}" y="${c + 2}" width="${f(len)}" height="4" rx="2" fill="#0b2a22" opacity=".9"/><rect x="${f(x0)}" y="${c - 1}" width="${f(len)}" height="3.5" rx="1.7" fill="#4a8a6e" opacity=".85"/>`; for (let d = 0; d < 3; d++) mo += `<path d="M${f(x0 + rr(2, len - 2))} ${c + 5}h2.4l-1.2 ${f(rr(8, 18))}z" fill="${col}" opacity=".75"/>`; }
  else { const sz = rnd() < 0.25 ? rr(22, 38) : rr(8, 18); mo += `<ellipse cx="${f(mx)}" cy="${c + 2}" rx="${f(sz)}" ry="${f(sz * rr(0.18, 0.4))}" transform="rotate(${f(rr(-25, 25))} ${f(mx)} ${c + 2})" fill="${col}" opacity="${f(rr(0.6, 0.9))}"/>`; } }
  mo += `<ellipse cx="${a + 14}" cy="${c + 4}" rx="28" ry="8" fill="#2f6a55" opacity=".8"/>`; });
s += `<g filter="url(#moss)">${mo}</g>`;
const cracks = `<g fill="none" stroke="#020807" stroke-opacity=".6" stroke-width="1.2" stroke-linejoin="round"><path d="M470 330l6 12-5 9 8 14"/><path d="M720 252l-7 11 6 9-4 12"/><path d="M428 190l5 10-4 8"/><path d="M790 402l-5 14 4 10"/><path d="M512 262l4 8-3 7"/></g>`;
const vine = (x, y0, y1, amp, pal = MOSSL) => { let d = `M${x} ${y0}`; const segs = 5, h = (y1 - y0) / segs; for (let i = 0; i < segs; i++) d += `Q${f(x + (i % 2 ? amp : -amp))} ${f(y0 + h * i + h / 2)} ${f(x + rr(-2, 2))} ${f(y0 + h * (i + 1))}`; let o = `<path d="${d}" fill="none" stroke="#1f6a5e" stroke-width="2.2" stroke-linecap="round"/>`; for (let i = 0; i < 9; i++) o += lf(x + rr(-amp, amp), y0 + (y1 - y0) * (i + 0.5) / 9, rr(0, 360), rr(0.4, 0.75), pick(pal), 'lf2'); return o; };
s += vine(528, 330, 440, 7, GREENS) + vine(672, 330, 440, 7, GREENS) + vine(392, 244, 320, 6) + vine(808, 244, 320, 6);
s += cracks + '</g>';
// ground + clearing
s += `<path d="M0 452C120 432 250 444 400 446 500 448 700 448 800 446 950 444 1080 432 1200 450V600H0Z" fill="url(#gnd)"/>`;
s += `<polygon points="312,440 888,440 770,468 100,474" fill="#000" opacity=".6" filter="url(#b8)"/><rect x="300" y="437" width="600" height="9" fill="#000" opacity=".65" filter="url(#b3)"/>`;
// wide stair flight (6 steps)
for (let i = 0; i < 6; i++) { const y = 440 + i * 6.5, w = 150 + i * 30; s += `<rect x="${600 - w / 2}" y="${y}" width="${w}" height="6.5" fill="#0a1a18"/><rect x="${600 - w / 2}" y="${y}" width="${w}" height="4.6" fill="url(#face)"/><rect x="${600 - w / 2}" y="${y}" width="${w}" height="1.5" fill="#d8ffe8" opacity=".75"/>${i < 3 ? `<rect x="${600 - w / 2}" y="${y}" width="${w}" height="4.6" fill="#ffd98a" opacity="${f(0.32 - i * 0.08)}"/>` : ''}`; }
// emerald light pool + vertical shaft onto the stairs
s += `<g style="mix-blend-mode:screen"><polygon points="560,440 640,440 760,484 440,484" fill="url(#fan)"/><g class="poolg"><ellipse cx="600" cy="492" rx="380" ry="90" fill="url(#pool)" opacity=".6"/><ellipse cx="600" cy="488" rx="250" ry="58" fill="url(#pool)" opacity=".75"/><ellipse cx="600" cy="484" rx="130" ry="32" fill="url(#pool)"/></g><rect x="300" y="468" width="600" height="14" fill="url(#pool)" opacity=".12" filter="url(#b3)"/><polygon class="shaft" style="animation-delay:-4s" points="585,200 615,200 690,486 510,486" fill="url(#shaftV)" filter="url(#b4)"/></g>`;
// roots crawling over lower tiers and steps
const taper = (P, w0) => {
  const bz = (u) => { const v = 1 - u; return [v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0], v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1]]; };
  const A = [], B = []; let lv = '';
  for (let i = 0; i <= 12; i++) { const u = i / 12, [x, y] = bz(u), [x2, y2] = bz(Math.min(1, u + 0.02)), [x1, y1] = bz(Math.max(0, u - 0.02)), n = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / n, ny = (x2 - x1) / n, w = w0 * (1 - u * 0.88) / 2; A.push(`${f(x + nx * w)} ${f(y + ny * w)}`); B.push(`${f(x - nx * w)} ${f(y - ny * w)}`); if (i % 3 === 1) lv += lf(x, y, rr(0, 360), rr(0.4, 0.7), pick(MOSSL), 'lf2'); }
  return `<path d="M${A.join('L')}L${B.reverse().join('L')}Z" fill="#0a2420"/><path d="M${A.join('L')}" fill="none" stroke="#35e0a8" stroke-opacity=".5" stroke-width="1.2"/>${lv}`;
};
s += taper([[298, 458], [342, 432], [328, 380], [388, 330]], 13) + taper([[902, 458], [858, 432], [872, 380], [812, 330]], 13) + taper([[322, 458], [420, 488], [470, 472], [522, 452]], 9) + taper([[878, 458], [780, 488], [730, 472], [678, 452]], 9);
// grass blades along the clearing
let bl = ''; for (let i = 0; i < 90; i++) { const x = rr(300, 900), y = rr(462, 504), h = rr(8, 20), d = Math.abs(x - 600), col = d < 120 ? '#b8ffcf' : d < 220 ? '#7ee8a8' : '#2a8a6c'; bl += `<path d="M${f(x)} ${f(y)}q${f(rr(-4, 4))} ${f(-h / 2)} ${f(rr(-6, 6))} ${f(-h)}" stroke="${col}" stroke-opacity="${f(d < 220 ? rr(0.6, 0.95) : rr(0.4, 0.7))}" stroke-width="1.3" fill="none"/>`; }
s += bl;
let gl = ''; for (let i = 0; i < 30; i++) gl += lf(rr(0, 1200), rr(436, 456), rr(-170, -10), rr(0.35, 0.7), pick(GREENS), 'lf1'); s += gl;
// god-rays across the upper right to the steps (+ dust only inside the beams)
const RAYS = [[1040, 40, 620, 110], [1110, 36, 700, 100], [900, 28, 470, 120]];
let rays = '', dust = '';
RAYS.forEach(([tx, tw, bx, bw], i) => {
  rays += `<polygon class="shaft" style="animation-delay:-${i * 2.4}s;animation-duration:${9 + i * 1.7}s" points="${tx - tw / 2},-10 ${tx + tw / 2},-10 ${bx + bw / 2},480 ${bx - bw / 2},480" fill="url(#ray)"/>`;
  for (let k = 0; k < 5; k++) { const t = rr(0.15, 0.85), w = tw + (bw - tw) * t; dust += `<g class="fg" style="animation-duration:${f(rr(9, 16))}s;animation-delay:-${f(rr(0, 12))}s"><circle class="ff" cx="${f(tx + (bx - tx) * t + rr(-0.4, 0.4) * w)}" cy="${f(-10 + 490 * t)}" r="${f(rr(0.8, 1.8))}" style="animation-duration:${f(rr(4, 8))}s;animation-delay:-${f(rr(0, 6))}s"/></g>`; }
});
s += `<g style="mix-blend-mode:screen" filter="url(#b6)">${rays}</g><g fill="#e0ffe9" filter="url(#glow)">${dust}</g>`;
// falling leaves
let fall = '<g class="fall">';
for (let i = 0; i < 14; i++) {
  const x = rr(40, 1160), dur = f(rr(12, 20)), a = rr(-90, 90), b = rr(120, 200), c = rr(-90, 90), e = rr(-70, 70);
  const col = pick(['#2a8a6c', '#3fbf86', '#7ee8a8', '#1f6a5e', '#b8ffcf']);
  fall += `<g transform="translate(${f(x)} -24)" fill="${col}"><use href="#${['lf1', 'lf2', 'lf3'][i % 3]}" transform="scale(${f(rr(0.55, 1))})"><animateMotion dur="${dur}s" begin="-${f(rr(0, 18))}s" repeatCount="indefinite" rotate="auto" path="M0 0C${f(a)} ${f(b)} ${f(c)} ${f(b * 2)} ${f(e)} 660" calcMode="spline" keyTimes="0;1" keySplines=".4 .1 .6 .9"/><animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.12;.85;1" dur="${dur}s" repeatCount="indefinite"/></use></g>`;
}
s += fall + '</g>';
s += `<g class="fog" style="animation-delay:-14s"><ellipse cx="600" cy="420" rx="520" ry="44" fill="url(#mist)" opacity=".5"/></g>`;
// plaques
const PL = [
  ['Secure-by-Design Trainer', 'Interactive security training', 'Security', 'Rust/TS', 'shield'],
  ['Cloud &amp; AI Security Study', 'Exam-prep dashboard &amp; drills', 'Cloud', 'JS', 'cloud'],
  ['Structure Vision', 'Construction photo classifier', 'AI/ML', 'Web', 'eye'],
  ['Video Explainer Engine', 'AI-voiced collage reels', 'AI', 'Python', 'film'],
  ['Puzzle Game', 'Browser geometry puzzle', 'Game', 'TS', 'sun'],
  ['Portfolio Lab', 'UI prototypes', 'Frontend', 'Next.js', 'leaf'],
];
const head = (x, label) => `<text class="t o" x="${x}" y="98" font-size="16" font-weight="700" letter-spacing="2.4" fill="#fff6d0">${label}</text><path d="M${x} 104H${x + 288}" stroke="#e8c66a" stroke-opacity=".55"/>`;
s += head(20, 'SECURITY &amp; CLOUD') + head(892, 'CREATIVE &amp; AI TOOLING');
PL.forEach(([t, d, c1, c2, g], i) => {
  const x = i < 3 ? 20 : 892, y = 110 + (i % 3) * 102, w = 288, h = 94;
  const cw = c1.length * 8.2 + 26, sw = c2.length * 8.2 + 26;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#plq)" filter="url(#ds)"/><rect x="${x}" y="${y}" width="${w}" height="26" rx="8" fill="url(#shd)" opacity=".5"/>`;
  s += `<path d="M${x + 8} ${y + .5}H${x + w - 8}Q${x + w - .5} ${y + .5} ${x + w - .5} ${y + 8}V${y + h - 8}" fill="none" stroke="#b9d3c4" stroke-opacity=".75"/><path d="M${x + w - 8} ${y + h - .5}H${x + 8}Q${x + .5} ${y + h - .5} ${x + .5} ${y + h - 8}V${y + 8}" fill="none" stroke="#000" stroke-opacity=".8"/><path d="M${x + 9} ${y + 1.8}H${x + w - 9}" stroke="#fff" stroke-opacity=".12"/>`;
  s += `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="5" fill="none" stroke="#e8c66a" stroke-opacity=".45" stroke-width=".8"/>`;
  s += `<circle class="pulse" style="animation-delay:-${i}.3s" cx="${x + 31}" cy="${y + 40}" r="25" fill="url(#halo)" opacity=".4"/><circle cx="${x + 31}" cy="${y + 40}" r="20" fill="#06130f" stroke="#e8c66a" stroke-opacity=".6"/>`;
  s += `<g transform="translate(${x + 31} ${y + 40})" fill="none" stroke="#f0d57e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${glyphs[g]}</g>`;
  s += `<text class="t" x="${x + 62}" y="${y + 27}" font-size="15" font-weight="700" fill="#f8f6e2">${t}</text><text class="t" x="${x + 62}" y="${y + 47}" font-size="15" fill="#e8efdc">${d}</text>`;
  s += `<rect x="${x + 62}" y="${y + 57}" width="${f(cw)}" height="24" rx="12" fill="#e8c66a" fill-opacity=".18" stroke="#e8c66a" stroke-opacity=".65"/><text class="t" x="${f(x + 62 + cw / 2)}" y="${y + 73.8}" text-anchor="middle" font-size="14.5" font-weight="600" fill="#fbeeb4">${c1}</text>`;
  s += `<rect x="${f(x + 70 + cw)}" y="${y + 57}" width="${f(sw)}" height="24" rx="12" fill="#7ee8a8" fill-opacity=".14" stroke="#7ee8a8" stroke-opacity=".55"/><text class="t" x="${f(x + 70 + cw + sw / 2)}" y="${y + 73.8}" text-anchor="middle" font-size="14.5" font-weight="600" fill="#d8fbe6">${c2}</text>`;
});
// near foreground: ferns, dense foliage masses (clear of text)
let fr = '';
for (let i = 0; i < 14; i++) { const left = i < 8; const x = left ? rr(-10, 330) : rr(870, 1210); fr += `<use href="#frond" transform="translate(${f(x)} ${f(rr(598, 616))}) rotate(${f(rr(-30, 30))}) scale(${f(rr(0.9, 1.7))})" color="${pick(DARK)}" fill="${pick(DARK)}"/>`; }
s += fr;
s += cluster(70, 585, 40, 90, 26, 0.7, 1.4, DARK, null, clear) + cluster(1130, 585, 40, 90, 26, 0.7, 1.4, DARK, null, clear);
s += cluster(18, 300, 34, 16, 170, 0.7, 1.3, DARK, null, clear) + cluster(1182, 300, 34, 16, 170, 0.7, 1.3, DARK, null, clear);
s += cluster(360, 470, 16, 60, 30, 0.5, 1, DARK, null, clear) + cluster(840, 470, 16, 60, 30, 0.5, 1, DARK, null, clear);
// blurred near silhouettes (depth of field)
let nb = ''; [[30, 6], [130, 0], [1170, 6], [1070, 0], [14, 470], [1186, 470], [60, 560], [1140, 570]].forEach(([x, y], i) => { nb += lf(x, y, rr(0, 360), rr(2.2, 3.4), pick(['#02100e', '#04201d', '#06302b']), i % 2 ? 'lf2' : 'lf3'); nb += lf(x + rr(-40, 40), Math.max(0, y + rr(-10, 30)), rr(0, 360), rr(1.6, 2.6), '#031411', 'lf1'); });
[[40, 632, 12, 2.4], [1160, 632, -12, 2.4], [215, 650, -8, 2.1], [985, 650, 8, 2.1]].forEach(([x, y, r, sc]) => { nb += `<use href="#frond" transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" color="#02100e" fill="#02100e"/>`; });
[[260, 0, 2.4], [940, 0, 2.4], [330, 0, 2], [870, 0, 2]].forEach(([x, y, sc], i) => { nb += lf(x, y, rr(0, 360), sc, '#02100e', i % 2 ? 'lf2' : 'lf3'); });
s += `<g filter="url(#b6)" opacity=".92">${nb}</g>`;
s += `<g class="fog" style="animation-duration:40s"><ellipse cx="600" cy="500" rx="640" ry="34" fill="url(#mist)" opacity=".5"/></g>`;
// canopy: layered dense teal masses at the top
const canopy = (x0, x1, n, cls, delay) => `<g class="sw ${cls}" style="animation-delay:-${delay}s">${cluster((x0 + x1) / 2, 10, n / 2, (x1 - x0) / 2, 26, 0.7, 1.3, ['#0e3b3a', '#10463f', '#14463f'], null, clear)}${cluster((x0 + x1) / 2, 16, n, (x1 - x0) / 2, 32, 0.9, 1.9, DARK, null, clear)}${cluster((x0 + x1) / 2, 40, 3, (x1 - x0) / 2, 20, 0.7, 1.2, GREENS, null, clear)}</g>`;
s += canopy(-20, 300, 38, '', 0) + canopy(300, 620, 32, 'sw2', 3) + canopy(620, 920, 32, '', 6) + canopy(920, 1220, 38, 'sw2', 2);
for (let i = 0; i < 12; i++) {
  const x = rr(20, 1180); if ((x > 330 && x < 870) || (x > 8 && x < 320) || x > 880) continue; const L = rr(60, 110);
  let o = `<path d="M${f(x)} 0C${f(x + 10)} ${f(L * 0.3)} ${f(x - 10)} ${f(L * 0.6)} ${f(x + 4)} ${f(L)}" fill="none" stroke="#1f6a5e" stroke-width="2" stroke-linecap="round"/>`;
  for (let k = 0; k < 7; k++) o += lf(x + rr(-6, 8), L * (k + 1) / 8, rr(0, 360), rr(0.35, 0.7), pick(GREENS), 'lf2');
  s += `<g class="sw sw2" style="animation-delay:-${i * 1.7}s">${o}</g>`;
}
// rising green-white motes, more near the light shaft
let mt = '', cnt = 0;
while (cnt < 36) { const near = cnt < 14, x = near ? rr(480, 720) : rr(330, 870), y = near ? rr(300, 490) : rr(250, 560); if (!clear(x, y) || y > 495) continue; cnt++; mt += `<circle class="mote" cx="${f(x)}" cy="${f(y)}" r="${f(rr(1.1, 2.2))}" style="animation-duration:${f(rr(12, 22))}s;animation-delay:-${f(rr(0, 20))}s"/>`; }
s += `<g fill="#e0ffe9" filter="url(#glow)">${mt}</g>`;
s += `<rect width="1200" height="600" fill="url(#vigR)"/>`;
// bottom strip with soft seam
const stat = (cx, num, label) => `<text class="t o" x="${cx}" y="557" text-anchor="middle" font-size="35" font-weight="700" fill="#f8ebb0">${num}</text><text class="t o" x="${cx}" y="579" text-anchor="middle" font-size="15" font-weight="600" fill="#eef4e4" letter-spacing="1.4">${label}</text>`;
s += `<rect y="470" width="1200" height="130" fill="url(#strip)"/>`;
s += stat(150, '{{repos}}', 'REPOS') + stat(335, '{{since}}', 'ON GITHUB SINCE') + `<path d="M245 528V582" stroke="#eef4e4" stroke-opacity=".3"/>`;
s += `<g transform="translate(440 536)"><text class="t o" y="-8" font-size="15" font-weight="600" fill="#eef4e4" letter-spacing="1.4">LANGUAGES</text><rect width="680" height="12" rx="6" fill="#031211" opacity=".8" filter="url(#dsb)"/><g clip-path="url(#barClip)">{{langBars}}</g>{{langLegend}}</g>`;
// dark silhouettes overlapping the seam at the corners (never over text)
let sm = ''; [[22, 645, 8, 2.3], [1186, 645, -8, 2.1]].forEach(([x, y, r, sc]) => { sm += `<use href="#frond" transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" color="#01090a" fill="#01090a"/>`; });
[[4, 515, 2.6], [1196, 515, 2.6]].forEach(([x, y, sc], i) => { sm += lf(x, y, rr(0, 360), sc, '#01090a', i ? 'lf2' : 'lf3'); });
s += `<g filter="url(#b6)" opacity=".92">${sm}</g>`;
// title (last, brightest)
const Z = (dx, dy, col, op, flt) => `<g transform="translate(${dx} ${dy})" fill="none" stroke="${col}" stroke-width="5" opacity="${op}"${flt ? ' filter="url(#b3)"' : ''}><ellipse cx="479" cy="89" rx="10.5" ry="15"/><path d="M472 98L486 80" stroke-width="3.2"/></g>`;
const W = (dx, dy, fill, op, flt, ex = '') => `<text class="h" x="${500 + dx}" y="${104 + dy}" font-size="42" font-weight="700" textLength="236" lengthAdjust="spacing" fill="${fill}" opacity="${op}"${flt ? ' filter="url(#b3)"' : ''}${ex}>xCryp7icX</text>`;
let top = Z(2.4, 4.4, '#000', .85, 1) + W(2.4, 4.4, '#000', .85, 1) + Z(0, 1.4, '#000', .9) + W(0, 1.4, '#000', .9) + Z(-1.4, -1.9, '#fff6cc', .9) + W(-1.4, -1.9, '#fff6cc', .9) + Z(0, 0, 'url(#gold)', 1) + W(0, 0, 'url(#gold)', 1, 0, ' stroke="#5e4510" stroke-width=".6"');
top += `<rect x="400" y="158" width="400" height="30" rx="4" fill="#030c0a" opacity=".9" stroke="#e8c66a" stroke-opacity=".5"/><text class="t" x="600" y="178.5" text-anchor="middle" font-size="15.5" font-weight="700" letter-spacing="1" fill="#f8ebb0">Security · Cloud &amp; AI · Creative Tooling</text>`;
s += top;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600" role="img" aria-labelledby="ti de"><title id="ti">0xCryp7icX: Forest Temple</title><desc id="de">A night forest temple lit by emerald light, with a glowing doorway, stone stairs, giant trees, god-rays, falling leaves and floating motes. Two groups of plaques list project themes: Security and Cloud (secure-by-design training, cloud and AI security study, structure vision) and Creative and AI tooling (video explainer engine, puzzle game, portfolio lab). A strip shows repository count, the year the account started and language shares. Updated {{updated}}.</desc><g clip-path="url(#frame)">${defs}${s}</g><rect x=".5" y=".5" width="1199" height="599" rx="10" fill="none" stroke="#cfd8c4" stroke-opacity=".55"/></svg>`;
writeFileSync(OUT, svg);
console.log('tpl bytes', svg.length);
