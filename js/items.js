/* おのたしざん — もんだいの え */
(function () {
  'use strict';
  const { INK, L, L3, rnd, pick } = Art;

  const ROOM = `
    <rect x="-3000" y="-3000" width="6800" height="3360" fill="#fff6dc"/>
    <g opacity=".55"><circle cx="90" cy="70" r="30" fill="#ffe8a0"/><circle cx="710" cy="80" r="22" fill="#d6ecff"/>
    <circle cx="620" cy="40" r="12" fill="#ffd6e4"/><circle cx="170" cy="150" r="10" fill="#d8f2d9"/><circle cx="-120" cy="200" r="40" fill="#ffe8a0"/><circle cx="930" cy="220" r="36" fill="#ffd6e4"/></g>
    <rect x="-3000" y="360" width="6800" height="3000" fill="#f2c48d"/>
    <path d="M-3000 360 H3800" stroke="${INK}" stroke-width="5"/>
    <path d="M-3000 386 H3800 M-3000 418 H3800" stroke="#e3ad72" stroke-width="3"/>`;

  const wrap = inner => `<svg class="scene" viewBox="0 0 800 450" preserveAspectRatio="xMidYMax meet" width="100%" height="100%">${inner}</svg>`;
  const at = (x, y, inner, cls = 'pop-in', style = '') => `<g transform="translate(${x},${y})"><g class="${cls}" style="${style}">${inner}</g></g>`;
  const steam = (xs, top, color = '#cbb9a6') => `<g class="steam" opacity=".8">${xs.map((x, i) => `<path d="M${x} ${top} q-12 -20 0 -40 t0 -40" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" style="animation-delay:${-i * 0.5}s"/>`).join('')}</g>`;

  /* ---------- パーツ ---------- */
  const P = {
    yunomi: () => `
      <ellipse cx="0" cy="-4" rx="118" ry="20" fill="#b5835a" ${L}/>
      <path d="M-72 -170 L-62 -24 Q-60 -10 -46 -10 L46 -10 Q60 -10 62 -24 L72 -170 Z" fill="#7fb58b" ${L}/>
      <path d="M-66 -110 q22 -14 44 0 t44 0 t44 0" stroke="#fff9" stroke-width="6" fill="none"/>
      <ellipse cx="0" cy="-170" rx="72" ry="16" fill="#e8f3df" ${L}/>
      <ellipse cx="0" cy="-169" rx="60" ry="10" fill="#b8cf5a"/>
      ${steam([-26, 22], -196)}`,

    candy: c => `<path d="M-12 0 L-32 -13 L-32 13 Z" fill="${c}" ${L3}/><path d="M12 0 L32 -13 L32 13 Z" fill="${c}" ${L3}/><circle r="16" fill="${c}" ${L3}/><path d="M-8 -5 q8 8 16 0" stroke="#fff9" stroke-width="4" fill="none"/>`,
    cookie: () => `<circle r="24" fill="#e0a45c" ${L3}/><circle cx="-8" cy="-6" r="3.5" fill="${INK}"/><circle cx="8" cy="4" r="3.5" fill="${INK}"/><circle cx="-4" cy="10" r="3" fill="${INK}"/><circle cx="9" cy="-10" r="2.5" fill="${INK}"/>`,
    lolly: c => `<path d="M0 0 V48" stroke="${INK}" stroke-width="6"/><path d="M0 0 V48" stroke="#fff" stroke-width="2"/><circle r="24" fill="${c}" ${L3}/><path d="M0 0 m-12 0 a12 12 0 1 1 12 12 a8 8 0 1 1 -8 -8" stroke="#fff" stroke-width="4" fill="none"/>`,
    choco: () => `<rect x="-28" y="-17" width="56" height="34" rx="4" fill="#8b5a3c" ${L3}/><path d="M-9 -17 V17 M9 -17 V17 M-28 0 H28" stroke="#6b4028" stroke-width="3"/><path d="M-28 -17 H0 V17 H-28 Z" fill="#ff6b6b" ${L3}/><path d="M-24 -6 H-4" stroke="#ffd65c" stroke-width="4"/>`,
    dango: () => `<path d="M-40 26 L40 -26" stroke="#c9a06a" stroke-width="6" stroke-linecap="round"/><circle cx="-22" cy="14" r="14" fill="#9ed67f" ${L3}/><circle cx="0" cy="0" r="14" fill="#fff" ${L3}/><circle cx="22" cy="-14" r="14" fill="#ffb3c6" ${L3}/>`,
    donut: () => `<circle r="24" fill="#e0a45c" ${L3}/><path d="M-20 -6 Q-22 -22 0 -22 Q22 -22 20 -4 Q14 6 0 4 Q-16 8 -20 -6Z" fill="#ff9fbf"/><circle r="8" fill="#fff6dc" ${L3}/><path d="M-10 -14 l4 2 M8 -16 l3 3 M14 -6 l4 -1" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,

    bell: () => `
      <rect x="-150" y="-260" width="300" height="24" rx="6" fill="#8a5a3b" ${L}/>
      <path d="M0 -236 V-205" ${L}/>
      <g style="transform-origin:0 -205px" class="sway">
        <path d="M-12 -210 h24 v14 h-24 z" fill="#6b8a6a" ${L3}/>
        <path d="M-62 -40 Q-66 -196 0 -198 Q66 -196 62 -40 L72 -30 H-72 Z" fill="#7d9a7a" ${L}/>
        <path d="M-58 -120 H58 M-61 -70 H61" stroke="${INK}" stroke-width="3"/>
        ${[-40, -20, 0, 20, 40].map(x => `<circle cx="${x}" cy="-160" r="4" fill="#5f7d5e"/><circle cx="${x}" cy="-142" r="4" fill="#5f7d5e"/>`).join('')}
        <circle cx="-30" cy="-92" r="10" fill="#9bb89a" ${L3}/>
      </g>`,
    coin: () => `<circle r="24" fill="#ffcf4a" ${L3}/><circle r="16" fill="none" stroke="#e0a82e" stroke-width="3"/><circle r="6" fill="#fff6dc" ${L3}/><path d="M-12 -12 q6 -6 12 -6" stroke="#fff9" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    silver: () => `<circle r="22" fill="#dfe3e8" ${L3}/><circle r="15" fill="none" stroke="#aab2bb" stroke-width="3"/><path d="M-10 -10 q6 -6 12 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    bill: () => `<rect x="-48" y="-25" width="96" height="50" rx="4" fill="#d6e9c6" ${L3}/><rect x="-40" y="-17" width="80" height="34" rx="2" fill="none" stroke="#9cbf8a" stroke-width="3"/><circle cx="18" cy="0" r="11" fill="#fff8" stroke="#9cbf8a" stroke-width="3"/><path d="M-32 -6 H0 M-32 6 H-8" stroke="#9cbf8a" stroke-width="3"/>`,
    cushion: () => `
      <path d="M-160 -8 Q0 -46 160 -8 Q182 6 160 20 Q0 44 -160 20 Q-182 6 -160 -8Z" fill="#d94a5a" ${L}/>
      <path d="M-120 2 Q0 -24 120 2" stroke="#ffd65c" stroke-width="4" fill="none"/>
      ${[-172, 172].map(x => `<path d="M${x} 6 l-8 26 h16 z" fill="#ffd65c" ${L3}/>`).join('')}`,
    rays: (c = '#ffe07a', n = 14, r = 380) => {
      let s = '';
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, b = a + Math.PI / n * 0.8;
        s += `<path d="M0 0 L${Math.cos(a) * r} ${Math.sin(a) * r} L${Math.cos(b) * r} ${Math.sin(b) * r}Z" fill="${c}"/>`;
      }
      return s;
    },

    nigiri: () => `
      <ellipse cx="0" cy="0" rx="48" ry="20" fill="#fff" ${L}/>
      <path d="M-30 4 q4 -3 8 0 M-6 8 q4 -3 8 0 M18 4 q4 -3 8 0" stroke="#ddd" stroke-width="3" fill="none"/>
      <path d="M-58 -12 Q-52 -36 0 -36 Q52 -36 62 -12 Q52 4 0 -2 Q-48 -2 -58 -12Z" fill="#f2787a" ${L}/>
      <path d="M-34 -28 q10 10 4 20 M-6 -32 q10 12 4 26 M22 -30 q10 10 4 22" stroke="#ffc4c4" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    plate: () => `<ellipse cx="0" cy="0" rx="96" ry="24" fill="#fff" ${L}/><ellipse cx="0" cy="-2" rx="70" ry="14" fill="none" stroke="#9cc7e8" stroke-width="3"/>`,
    geta: () => `
      <rect x="-40" y="0" width="22" height="28" fill="#c79352" ${L3}/><rect x="120" y="0" width="22" height="28" fill="#c79352" ${L3}/>
      <rect x="-80" y="0" width="22" height="28" fill="#c79352" ${L3}/>
      <rect x="-200" y="-30" width="400" height="36" rx="6" fill="#e9bf82" ${L}/>
      <path d="M-196 -22 H196" stroke="#ffd65c" stroke-width="4"/>
      <path d="M-180 -12 H-60 M40 -14 H180" stroke="#d6a466" stroke-width="3"/>
      <path d="M100 -32 l14 -30 l10 20 l12 -26 l8 24 l14 -22 l6 34 Z" fill="#6fbf5a" ${L3}/>
      <path d="M-170 -32 q10 -18 30 -14 q14 -10 26 2 q2 12 -14 12 z" fill="#ffc0c8" ${L3}/>`,

    onigiri: () => `
      <path d="M0 -170 Q34 -170 100 -46 Q122 0 76 0 H-76 Q-122 0 -100 -46 Q-34 -170 0 -170Z" fill="#fff" ${L}/>
      <path d="M-46 0 L-50 -74 H50 L46 0Z" fill="#2f4a3a" ${L}/>
      <path d="M-36 -130 q16 -20 26 -24" stroke="#eee" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M-60 -60 l4 -4 M40 -110 l4 4 M60 -40 l-4 4 M-20 -120 l3 -3" stroke="#e4e4e4" stroke-width="4" stroke-linecap="round"/>`,

    whiteCard: () => `
      <rect x="-120" y="-200" width="240" height="190" rx="18" fill="#fff" ${L}/>
      <rect x="-96" y="-176" width="192" height="142" rx="10" fill="#fdfdfd" stroke="#e6e0d6" stroke-width="4"/>
      <path d="M40 -150 l10 -10 M56 -140 l14 -14" stroke="#e6e0d6" stroke-width="5" stroke-linecap="round"/>`,

    castle: () => `
      <path d="M-170 0 L-130 -90 H130 L170 0Z" fill="#b8b0a4" ${L}/>
      <path d="M-150 -30 H150 M-140 -60 H140 M-90 0 L-80 -30 M20 0 L26 -30 M-40 -30 L-34 -60 M70 -30 L76 -60 M100 0 L106 -30" stroke="#8f877b" stroke-width="3"/>
      <rect x="-112" y="-160" width="224" height="72" fill="#fff" ${L}/>
      ${[-80, -40, 0, 40, 80].map(x => `<rect x="${x - 8}" y="-140" width="16" height="22" fill="${INK}"/>`).join('')}
      <path d="M-150 -156 Q-122 -158 -102 -186 H102 Q122 -158 150 -156Z" fill="#5f6a78" ${L}/>
      <rect x="-80" y="-236" width="160" height="52" fill="#fff" ${L}/>
      ${[-50, 0, 50].map(x => `<rect x="${x - 8}" y="-222" width="16" height="20" fill="${INK}"/>`).join('')}
      <path d="M-116 -232 Q-92 -234 -74 -262 H74 Q92 -234 116 -232Z" fill="#5f6a78" ${L}/>
      <path d="M-30 -262 L0 -290 L30 -262Z" fill="#fff" ${L3}/>
      <rect x="-50" y="-306" width="100" height="46" fill="#fff" ${L}/>
      <rect x="-8" y="-296" width="16" height="20" fill="${INK}"/>
      <path d="M-86 -302 Q-64 -304 -44 -334 H44 Q64 -304 86 -302Z" fill="#5f6a78" ${L}/>
      <path d="M-44 -334 q-10 -26 8 -30 q-4 14 6 22Z M44 -334 q10 -26 -8 -30 q4 14 -6 22Z" fill="#ffcf4a" ${L3}/>`,

    oden: () => `
      ${steam([-110, -20, 80], -130)}
      <path d="M-120 -96 L-120 -210" stroke="#c9a06a" stroke-width="7" stroke-linecap="round"/>
      <path d="M-150 -150 L-90 -150 L-120 -196Z" fill="#9a9a9a" ${L3}/><circle cx="-128" cy="-162" r="2.5" fill="#666"/><circle cx="-114" cy="-168" r="2.5" fill="#666"/>
      <circle cx="-120" cy="-126" r="20" fill="#fff" ${L3}/><circle cx="-120" cy="-126" r="10" fill="#ffd65c"/>
      <ellipse cx="-40" cy="-110" rx="46" ry="30" fill="#f5ecd0" ${L}/><ellipse cx="-40" cy="-110" rx="30" ry="18" fill="none" stroke="#e8d7a8" stroke-width="4"/>
      <ellipse cx="40" cy="-118" rx="28" ry="36" fill="#fff8e8" ${L}/><ellipse cx="40" cy="-112" rx="15" ry="16" fill="#ffc94a"/>
      <path d="M80 -96 L110 -160 L140 -96Z" fill="#8f8f8f" ${L}/><circle cx="104" cy="-112" r="3" fill="#555"/><circle cx="118" cy="-124" r="3" fill="#555"/><circle cx="122" cy="-106" r="3" fill="#555"/>
      <rect x="140" y="-150" width="40" height="60" rx="14" fill="#c98b4a" ${L}/><ellipse cx="160" cy="-150" rx="20" ry="8" fill="#f2d9a8" ${L3}/><ellipse cx="160" cy="-150" rx="8" ry="3" fill="${INK}"/>
      <path d="M-200 -100 H200 L184 0 H-184Z" fill="#b7b7b7" ${L}/>
      <path d="M-196 -100 H196" stroke="#e8b85a" stroke-width="16"/>
      <path d="M-200 -100 H200" ${L}/>
      <path d="M-160 -40 H160" stroke="#9a9a9a" stroke-width="4"/>
      <rect x="-230" y="-70" width="30" height="16" rx="6" fill="#8a5a3b" ${L3}/><rect x="200" y="-70" width="30" height="16" rx="6" fill="#8a5a3b" ${L3}/>`,

    puff: () => `
      <g opacity=".9"><circle cx="0" cy="0" r="22" fill="#f1e8cf"/><circle cx="24" cy="-8" r="18" fill="#f1e8cf"/><circle cx="12" cy="12" r="16" fill="#f1e8cf"/><circle cx="-18" cy="10" r="14" fill="#f1e8cf"/></g>
      <text x="8" y="-34" font-size="30" font-weight="900" fill="#b9a07a" text-anchor="middle" font-family="Zen Maru Gothic, sans-serif">ぷっ</text>`,

    ghost: () => `
      <ellipse cx="0" cy="130" rx="60" ry="10" fill="#0001"/>
      <path d="M-74 50 V-40 Q-74 -118 0 -118 Q74 -118 74 -40 V50 L52 32 L30 54 L8 32 L-14 54 L-36 32 L-56 54 Z" fill="#fff" ${L}/>
      <path d="M-74 -10 q-30 10 -24 30 M74 -10 q30 10 24 30" fill="none" ${L}/>
      <ellipse cx="-24" cy="-44" rx="8" ry="11" fill="${INK}"/><ellipse cx="24" cy="-44" rx="8" ry="11" fill="${INK}"/>
      <circle cx="-21" cy="-48" r="3" fill="#fff"/><circle cx="27" cy="-48" r="3" fill="#fff"/>
      <path d="M-16 -16 Q0 4 16 -16 Z" fill="#ff8a8a" ${L3}/>
      <ellipse cx="-44" cy="-22" rx="9" ry="5" fill="#ffc6d6"/><ellipse cx="44" cy="-22" rx="9" ry="5" fill="#ffc6d6"/>`,

    salmon: () => `
      <path d="M-150 0 Q-60 -80 80 -30 L140 -70 L130 0 L140 70 L80 30 Q-60 80 -150 0Z" fill="#ff9a76" ${L}/>
      <path d="M-140 6 Q-60 56 76 26" fill="#fde4d8" stroke="none"/>
      <path d="M-140 4 Q-60 60 80 30" fill="none" ${L3}/>
      <path d="M-40 -40 q10 30 0 60 M0 -38 q10 30 0 56 M40 -32 q8 26 0 48" stroke="#ffc4ac" stroke-width="4" fill="none"/>
      <circle cx="-110" cy="-10" r="8" fill="#fff" ${L3}/><circle cx="-110" cy="-10" r="4" fill="${INK}"/>
      <path d="M-90 -20 q8 20 0 40" fill="none" ${L3}/>`,
    sake: () => `
      <rect x="-190" y="-24" width="380" height="30" rx="8" fill="#b83a3a" ${L}/>
      <path d="M-184 -14 H184" stroke="#ffd65c" stroke-width="3"/>
      <g transform="translate(-60,-24)">
        <path d="M-20 -176 Q-26 -150 -14 -134 Q-68 -92 -58 -36 Q-52 0 0 0 Q52 0 58 -36 Q68 -92 14 -134 Q26 -150 20 -176Z" fill="#f4eedf" ${L}/>
        <ellipse cx="0" cy="-176" rx="22" ry="6" fill="#e6dcc4" ${L3}/>
        <path d="M-60 -70 Q0 -56 60 -70" stroke="#4a78b8" stroke-width="10" fill="none"/>
        <path d="M-46 -104 Q-34 -90 -40 -30" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>
      <g transform="translate(90,-24)">
        <path d="M-34 -44 L-24 -4 Q0 4 24 -4 L34 -44Z" fill="#f4eedf" ${L}/>
        <ellipse cx="0" cy="-44" rx="34" ry="9" fill="#e6dcc4" ${L3}/>
        <circle cx="0" cy="-44" r="10" fill="none" stroke="#4a78b8" stroke-width="3"/>
      </g>`,

    ice: () => {
      const cube = (x, y, s) => `<g transform="translate(${x},${y})">
        <path d="M0 0 H${s} L${s + s * .35} ${-s * .3} H${s * .35} Z" fill="#eefaff" ${L}/>
        <path d="M${s} 0 L${s + s * .35} ${-s * .3} V${s * .7} L${s} ${s} Z" fill="#a6daf5" ${L}/>
        <rect x="0" y="0" width="${s}" height="${s}" fill="#cdeeff" ${L}/>
        <path d="M${s * .15} ${s * .2} V${s * .55} M${s * .28} ${s * .2} V${s * .35}" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`;
      return cube(-150, -110, 110) + cube(10, -110, 110) + cube(-70, -226, 110);
    },

    bunnyBack: () => `
      <ellipse cx="0" cy="6" rx="110" ry="14" fill="#0001"/>
      <ellipse cx="-34" cy="-230" rx="18" ry="54" fill="#fff" ${L} transform="rotate(-10 -34 -230)"/>
      <ellipse cx="34" cy="-230" rx="18" ry="54" fill="#fff" ${L} transform="rotate(10 34 -230)"/>
      <circle cx="0" cy="-160" r="54" fill="#fff" ${L}/>
      <ellipse cx="0" cy="-60" rx="96" ry="72" fill="#fff" ${L}/>
      <path d="M0 -40 V-4" stroke="#eee" stroke-width="5"/>
      <ellipse cx="-60" cy="-6" rx="30" ry="14" fill="#fff" ${L}/><ellipse cx="60" cy="-6" rx="30" ry="14" fill="#fff" ${L}/>
      <ellipse cx="-60" cy="-6" rx="14" ry="7" fill="#ffc6d6"/><ellipse cx="60" cy="-6" rx="14" ry="7" fill="#ffc6d6"/>
      <g class="sway" style="transform-origin:0 -70px"><circle cx="0" cy="-70" r="24" fill="#fff" stroke="#e8dcd0" stroke-width="4"/><circle cx="-8" cy="-76" r="8" fill="#fffdf8"/></g>`,
    book: () => `
      <path d="M0 -160 Q-100 -186 -210 -156 V0 Q-100 -30 0 -6 Q100 -30 210 0 V-156 Q100 -186 0 -160Z" fill="#fff" ${L}/>
      <path d="M0 -160 V-6" ${L3}/>
      ${[-120, -90, -60].map(y => `<path d="M-180 ${y} Q-100 ${y - 22} -30 ${y - 4}" stroke="#ddd" stroke-width="4" fill="none"/><path d="M30 ${y - 4} Q100 ${y - 22} 180 ${y}" stroke="#ddd" stroke-width="4" fill="none"/>`).join('')}`,
    shiori: () => `
      <rect x="-36" y="-150" width="72" height="200" rx="8" fill="#ffe1ec" ${L}/>
      <rect x="-26" y="-140" width="52" height="180" rx="4" fill="none" stroke="#ffb3c6" stroke-width="3"/>
      <circle cx="0" cy="-122" r="8" fill="#fff" ${L3}/>
      <path d="M0 -130 Q-30 -200 10 -230" stroke="#f25c5c" stroke-width="5" fill="none"/>
      <path d="M10 -230 l-12 -8 l20 -10 l-2 18Z" fill="#f25c5c" ${L3}/>
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${Math.cos(a * Math.PI / 180) * 14}" cy="${-50 + Math.sin(a * Math.PI / 180) * 14}" rx="10" ry="6" transform="rotate(${a} ${Math.cos(a * Math.PI / 180) * 14} ${-50 + Math.sin(a * Math.PI / 180) * 14})" fill="#b79cf0"/>`).join('')}
      <circle cx="0" cy="-50" r="6" fill="#ffd65c"/>
      <path d="M0 -36 Q4 0 -6 20" stroke="#7ccf8a" stroke-width="4" fill="none"/>`,

    bird: () => `
      <path d="M-14 58 v18 M14 58 v18 M-22 76 h14 M6 76 h16" ${L3}/>
      <ellipse cx="0" cy="10" rx="62" ry="54" fill="#7cc6f0" ${L}/>
      <ellipse cx="0" cy="28" rx="36" ry="30" fill="#e8f6ff"/>
      <path d="M40 0 Q86 -6 88 30 Q60 30 40 20Z" fill="#5aaee0" ${L3}/>
      <circle cx="-22" cy="-10" r="7" fill="${INK}"/><circle cx="-20" cy="-13" r="2.5" fill="#fff"/>
      <path d="M-62 -2 L-86 8 L-60 16Z" fill="#ffb347" ${L3}/>
      <path d="M-4 -44 q6 -20 16 -16 q-4 8 -8 18" fill="#7cc6f0" ${L3}/>`,
    decoy: () => `
      <rect x="-110" y="40" width="220" height="30" rx="6" fill="#a8743f" ${L}/>
      <path d="M0 40 V20" stroke="${INK}" stroke-width="10"/>
      <path d="M-90 10 Q-100 -40 -40 -40 Q20 -44 60 -30 L110 -50 L96 0 Q60 30 -20 30 Q-80 30 -90 10Z" fill="#c08a52" ${L}/>
      <path d="M-60 -10 Q0 -20 60 -10 M-50 10 Q10 0 70 8" stroke="#9e6c3a" stroke-width="4" fill="none"/>
      <circle cx="-66" cy="-66" r="32" fill="#b07a44" ${L}/>
      <path d="M-96 -60 L-138 -56 L-98 -46Z" fill="#d9a066" ${L3}/>
      <circle cx="-74" cy="-72" r="5" fill="${INK}"/>
      <path d="M-66 -98 q14 10 26 4" stroke="#9e6c3a" stroke-width="4" fill="none"/>`,
    street: () => {
      const house = (x, w, h, c, roof) => `<g transform="translate(${x},360)">
        <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="${c}" ${L}/>
        <path d="M${-w / 2 - 14} ${-h} L0 ${-h - w * .45} L${w / 2 + 14} ${-h}Z" fill="${roof}" ${L}/>
        <rect x="${-w * .15}" y="${-h * .45}" width="${w * .3}" height="${h * .45}" fill="#a8743f" ${L3}/>
        <rect x="${-w * .38}" y="${-h * .8}" width="${w * .2}" height="${w * .2}" fill="#d6ecff" ${L3}/>
        <rect x="${w * .18}" y="${-h * .8}" width="${w * .2}" height="${w * .2}" fill="#d6ecff" ${L3}/></g>`;
      const tree = x => `<g transform="translate(${x},360)"><rect x="-8" y="-50" width="16" height="50" fill="#a8743f" ${L3}/><circle cx="0" cy="-80" r="38" fill="#7ccf8a" ${L}/></g>`;
      return `
        <rect x="-3000" y="360" width="6800" height="3000" fill="#a4a9ae"/>
        <path d="M-3000 360 H3800" stroke="${INK}" stroke-width="5"/>
        <path d="M-3000 404 H3800" stroke="#fff" stroke-width="7" stroke-dasharray="40 30"/>
        <g class="fade-in">${house(-120, 150, 120, '#ffd6a0', '#f25c5c')}${tree(10)}${house(130, 130, 150, '#d6ecff', '#6cb8f0')}${house(300, 160, 110, '#ffe1ec', '#b79cf0')}${tree(430)}${house(560, 140, 140, '#fff1a8', '#7ccf8a')}${house(740, 150, 120, '#d8f2d9', '#ff8a5b')}${tree(880)}</g>
        <g transform="translate(250,360)"><path d="M0 0 V-190 q0 -20 30 -20" ${L} fill="none"/><circle cx="36" cy="-204" r="12" fill="#ffe07a" ${L3}/></g>`;
    },

    tag: () => `
      <g class="spin-slow">${(() => { let s = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, b = a + Math.PI / 16; s += `<path d="M0 0 L${Math.cos(a) * 200} ${Math.sin(a) * 200} L${Math.cos(b) * 140} ${Math.sin(b) * 140}Z" fill="#ffe07a"/>`; } return s; })()}</g>
      <g transform="rotate(-8)">
        <path d="M-150 -74 H110 L166 0 L110 74 H-150 Z" fill="#ff5a5a" ${L}/>
        <circle cx="112" cy="0" r="12" fill="#fff6dc" ${L3}/>
        <path d="M124 0 Q180 -60 220 -40" fill="none" ${L3}/>
        <text x="-24" y="30" font-size="84" font-weight="900" fill="#fff" text-anchor="middle" stroke="${INK}" stroke-width="4" paint-order="stroke" font-family="Zen Maru Gothic, sans-serif">おとく</text>
      </g>`,
    far: () => `
      <rect x="-3000" y="-3000" width="6800" height="3290" fill="#dff1ff"/>
      <path d="M-3000 290 L-40 290 L100 200 L220 290 L330 230 L480 290 L600 180 L760 290 L3800 290 V3000 H-3000Z" fill="#b9dca8"/>
      <path d="M-40 290 L100 200 L220 290 M330 230 L480 290 M480 290 L600 180 L760 290" fill="#9bc6e6" ${L3}/>
      <path d="M-3000 290 H3800" stroke="${INK}" stroke-width="4"/>
      <path d="M392 290 L180 700 H620 L408 290Z" fill="#e8d2a8" ${L3}/>
      <circle cx="650" cy="80" r="40" fill="#ffe07a" opacity=".9"/>`,
    farThings: () => `
      <g transform="translate(-120,0)"><rect x="-14" y="-90" width="28" height="90" fill="#a8743f" ${L}/><circle cx="0" cy="-150" r="70" fill="#7ccf8a" ${L}/></g>
      <g transform="translate(120,0)"><rect x="-80" y="-120" width="160" height="120" fill="#ffd6a0" ${L}/><path d="M-100 -120 L0 -200 L100 -120Z" fill="#f25c5c" ${L}/><rect x="-20" y="-60" width="40" height="60" fill="#a8743f" ${L3}/></g>`,

    pot: () => `
      <path d="M-80 -110 L-64 0 H64 L80 -110Z" fill="#e2885a" ${L}/>
      <rect x="-92" y="-130" width="184" height="26" rx="6" fill="#e9a07a" ${L}/>
      ${[[-60, -250, '#ff9fbf'], [0, -290, '#b79cf0'], [62, -240, '#ffd65c']].map(([x, y, c]) => `
        <path d="M${x * .5} -130 Q${x * .8} ${(y - 130) / 2} ${x} ${y}" stroke="#6fbf5a" stroke-width="7" fill="none"/>
        <g class="sway" style="transform-origin:${x}px ${y}px">${[0, 72, 144, 216, 288].map(a => `<circle cx="${x + Math.cos(a * Math.PI / 180) * 22}" cy="${y + Math.sin(a * Math.PI / 180) * 22}" r="17" fill="${c}" ${L3}/>`).join('')}<circle cx="${x}" cy="${y}" r="13" fill="#fff6a8" ${L3}/></g>`).join('')}`,
  };

  /* ---------- シーン ---------- */
  function drops(pieces, cx, spread, floorY, height, n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const x = cx + g * spread;
      const hh = Math.max(0, height * (1 - Math.abs(x - cx) / spread)) * rnd(0.5, 1);
      arr.push({ x, y: floorY - hh, p: pick(pieces), r: rnd(-40, 40) });
    }
    arr.sort((a, b) => b.y - a.y);
    return arr.map((o, i) => `<g transform="translate(${o.x.toFixed(0)},${o.y.toFixed(0)}) rotate(${o.r.toFixed(0)})"><g class="drop" style="animation-delay:${(i * 0.04).toFixed(2)}s;--rot:${rnd(-90, 90).toFixed(0)}deg">${o.p()}</g></g>`).join('');
  }

  const SCENES = {
    empty: () => ROOM,
    yunomi: () => ROOM + at(400, 360, P.yunomi()),
    okashi: () => ROOM + drops([() => P.candy('#ff9fbf'), () => P.candy('#6cb8f0'), () => P.candy('#ffd65c'), P.cookie, () => P.lolly('#ff8a5b'), () => P.lolly('#7ccf8a'), P.choco, P.dango, P.donut], 400, 330, 350, 190, 64),
    bell: () => ROOM + at(400, 330, P.bell(), ''),
    okane: () => ROOM +
      `<g transform="translate(400,250)" opacity=".55"><g class="spin-slow">${P.rays()}</g></g>` +
      `<g transform="translate(400,250)"><g class="fade-out">${P.bell()}</g></g>` +
      at(400, 340, P.cushion()) +
      drops([P.coin, P.coin, P.silver, P.bill], 400, 150, 318, 120, 42),
    sushi: () => ROOM + at(400, 350, P.plate()) + at(400, 330, P.nigiri()),
    sushiFancy: () => ROOM +
      `<g transform="translate(400,330)"><g class="fade-out">${P.plate()}</g></g>` +
      at(400, 332, P.geta(), 'pop-in') +
      at(400, 280, P.nigiri(), 'boing', 'animation-delay:.35s;transform-box:fill-box;transform-origin:50% 100%'),
    onigiri: () => ROOM + at(400, 350, P.onigiri()),
    whiteCard: () => ROOM + at(400, 350, P.whiteCard()),
    castle: () => ROOM +
      `<defs><clipPath id="floorClip"><rect x="-3000" y="-3000" width="6800" height="3362"/></clipPath></defs>` +
      `<g clip-path="url(#floorClip)"><g transform="translate(400,362)"><g class="rise">${P.castle()}</g></g></g>`,
    oden: () => ROOM + at(400, 360, P.oden()),
    puff: () => ROOM + at(690, 330, P.puff(), 'pop-in'),
    ghost: () => ROOM + `<g transform="translate(400,200)"><g class="bob">${at(0, 0, P.ghost())}</g></g>`,
    salmon: () => ROOM + at(400, 300, P.salmon()),
    sake: () => ROOM + `<g transform="translate(400,300)"><g class="fade-out">${P.salmon()}</g></g>` + at(400, 360, P.sake()),
    ice: () => ROOM + at(400, 356, P.ice()),
    bunny: () => ROOM + at(400, 356, P.bunnyBack()),
    shiori: () => ROOM + at(400, 360, P.book()) + at(420, 225, P.shiori(), 'pop-in', 'animation-delay:.25s'),
    bird: () => ROOM + at(400, 280, P.bird()),
    decoy: () => ROOM + at(400, 290, P.decoy()) + `<g transform="translate(400,280)"><g class="fly-away">${P.bird()}</g></g>`,
    street: () => ROOM + P.street() + `<g transform="translate(400,200)"><g class="fly-away" style="animation-duration:2.4s">${P.bird()}</g></g>`,
    tag: () => ROOM + at(400, 210, P.tag()),
    far: () => P.far() + `<g transform="translate(400,380)"><g class="go-far">${P.farThings()}</g></g>`,
    kaori: () => ROOM + at(400, 360, P.pot()) + `<g transform="translate(400,40)">${steam([-150, -60, 70, 160], 60, '#ffb3d0')}</g>`,
  };

  window.Items = {
    render(el, key) {
      const fn = SCENES[key] || SCENES.empty;
      el.innerHTML = wrap(fn());
    },
    P, ROOM, wrap, at, steam,
  };
})();
