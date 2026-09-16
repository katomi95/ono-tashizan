/* おのたしざん — さいごの もんだい「みおつけ」 */
(function () {
  'use strict';
  const { INK, L, L3, rnd } = Art;

  /* 「お」の かず → えの だんかい */
  function levelOf(n) {
    if (n <= 0) return 0;
    if (n < 10) return n;
    if (n < 20) return 10;
    if (n < 30) return 20;
    if (n < 50) return 30;
    if (n < 100) return 50;
    return 100;
  }

  const DEFS = `
    <defs>
      <pattern id="shoji" width="64" height="72" patternUnits="userSpaceOnUse">
        <rect width="64" height="72" fill="#fffbef"/><path d="M0 1 H64 M1 0 V72" stroke="#b68b5c" stroke-width="4"/>
      </pattern>
      <pattern id="tatami" width="240" height="120" patternUnits="userSpaceOnUse">
        <rect width="240" height="120" fill="#d2dc9c"/>
        <path d="M0 3 H240 M3 0 V120" stroke="#4d6b3a" stroke-width="8"/>
        <path d="M0 30 H240 M0 60 H240 M0 90 H240" stroke="#c2cd88" stroke-width="2"/>
      </pattern>
      <pattern id="sudare" width="10" height="7" patternUnits="userSpaceOnUse">
        <rect width="10" height="7" fill="#e3cf94"/><path d="M0 6 H10" stroke="#b89a58" stroke-width="2"/>
      </pattern>
      <radialGradient id="goldBg" cx="50%" cy="45%" r="70%">
        <stop offset="0" stop-color="#fff7cc"/><stop offset=".6" stop-color="#f3cf6a"/><stop offset="1" stop-color="#d9a53c"/>
      </radialGradient>
      <linearGradient id="heavenBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d8efff"/><stop offset=".55" stop-color="#fff5e0"/><stop offset="1" stop-color="#ffe3f0"/>
      </linearGradient>
      <radialGradient id="halo" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fffbe0" stop-opacity="1"/><stop offset=".45" stop-color="#fff2a0" stop-opacity=".75"/><stop offset="1" stop-color="#fff2a0" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="space" cx="50%" cy="50%" r="75%">
        <stop offset="0" stop-color="#3b2a78"/><stop offset=".5" stop-color="#1a1a4a"/><stop offset="1" stop-color="#070a20"/>
      </radialGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" result="b"/>
        <feColorMatrix in="b" type="matrix" values="1 0 0 0 .5  0 1 0 0 .45  0 0 1 0 .1  0 0 0 1.2 0" result="c"/>
        <feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

  const BIG = (fill, y = -3000, h = 3360) => `<rect x="-3000" y="${y}" width="6800" height="${h}" fill="${fill}"/>`;

  /* ---------- うつわ ---------- */
  function soup(rx, ry, gold) {
    const leaf = gold ? [[-30, -4], [24, 6], [44, -6], [-10, 8], [0, -8]].map(([x, y]) =>
      `<path d="M${x * rx / 100} ${y * ry / 20} l7 -4 l5 6 l-8 4z" fill="#ffd84a" stroke="#c9981c" stroke-width="1.5"/>`).join('') : '';
    return `
      <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#d49a58"/>
      <ellipse cx="${-rx * .15}" cy="${-ry * .2}" rx="${rx * .5}" ry="${ry * .45}" fill="#dfae70"/>
      <path d="M${-rx * .5} ${-ry * .1} l${rx * .14} ${-ry * .25} l${rx * .14} ${ry * .1} l${-rx * .14} ${ry * .25}z" fill="#fffdf4" stroke="#e8dcc0" stroke-width="2"/>
      <path d="M${rx * .1} ${ry * .15} l${rx * .14} ${-ry * .25} l${rx * .14} ${ry * .1} l${-rx * .14} ${ry * .25}z" fill="#fffdf4" stroke="#e8dcc0" stroke-width="2"/>
      <path d="M${-rx * .1} ${-ry * .45} q${rx * .12} ${-ry * .2} ${rx * .25} ${ry * .1} q${-rx * .1} ${ry * .3} ${-rx * .25} ${-ry * .1}z" fill="#3f6b3a"/>
      <path d="M${rx * .45} ${-ry * .2} q${rx * .1} ${-ry * .3} ${rx * .2} ${ry * .1} q${-rx * .08} ${ry * .3} ${-rx * .2} ${-ry * .1}z" fill="#3f6b3a"/>
      <circle cx="${-rx * .3}" cy="${ry * .35}" r="${rx * .045}" fill="none" stroke="#8fcf5a" stroke-width="3"/>
      <circle cx="${rx * .35}" cy="${ry * .45}" r="${rx * .04}" fill="none" stroke="#8fcf5a" stroke-width="3"/>
      <circle cx="${rx * .02}" cy="${-ry * .1}" r="${rx * .04}" fill="none" stroke="#8fcf5a" stroke-width="3"/>
      ${leaf}`;
  }

  // 0,0 = うつわの そこ
  function bowl(style, gold) {
    const W = 110, H = 96;
    const body = {
      plain: '#8a4b36', lacquer: '#2a1a1a', gold: '#e8b84a',
    }[style];
    const rim = style === 'plain' ? INK : '#d9a53c';
    const inner = style === 'plain' ? '#6e3a2a' : '#b3261e';
    let deco = '';
    if (style === 'lacquer') {
      deco = [-60, 0, 60].map(x => `<g transform="translate(${x},${-H * .5})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 7}" cy="${Math.sin(a * Math.PI / 180) * 7}" r="5" fill="#e8b84a"/>`).join('')}<circle r="3" fill="#b3261e"/></g>`).join('')
        + `<path d="M${-W + 6} ${-H + 14} Q0 ${-H + 44} ${W - 6} ${-H + 14}" stroke="#e8b84a" stroke-width="3" fill="none"/>`;
    }
    if (style === 'gold') {
      deco = `<path d="M-80 -60 q20 -20 40 0 t40 0 t40 0 t40 0" stroke="#fff3b0" stroke-width="5" fill="none"/>
        <path d="M-70 -30 l8 -8 M40 -40 l10 -6" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
    }
    return `
      <ellipse cx="0" cy="2" rx="${W * .9}" ry="10" fill="#0002"/>
      <path d="M-36 -8 L-30 4 H30 L36 -8Z" fill="${body}" ${L3}/>
      <path d="M${-W} ${-H} Q${-W + 4} -6 0 -6 Q${W - 4} -6 ${W} ${-H}Z" fill="${body}" ${L}/>
      ${deco}
      <ellipse cx="0" cy="${-H}" rx="${W}" ry="26" fill="${inner}" stroke="${rim}" stroke-width="${style === 'plain' ? 5 : 7}"/>
      <g transform="translate(0,${-H + 2})">${soup(W - 12, 19, gold)}</g>
      <path d="M${-W + 14} ${-H + 30} Q${-W + 20} -30 -30 -18" stroke="#fff5" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }

  function lid() {
    return `<g transform="rotate(-18)">
      <path d="M-100 0 Q-96 -70 0 -74 Q96 -70 100 0Z" fill="#2a1a1a" ${L}/>
      <ellipse cx="0" cy="0" rx="100" ry="18" fill="#b3261e" stroke="#d9a53c" stroke-width="6"/>
      <rect x="-26" y="-92" width="52" height="20" rx="6" fill="#2a1a1a" stroke="#d9a53c" stroke-width="4"/>
      <path d="M-50 -40 q20 -10 40 0" stroke="#e8b84a" stroke-width="4" fill="none"/></g>`;
  }

  const miniSteam = (xs, top, k = 1) => `<g class="steam" opacity=".75">${xs.map((x, i) => `<path d="M${x} ${top} q${-10 * k} ${-18 * k} 0 ${-36 * k} t0 ${-36 * k}" stroke="#e8dccf" stroke-width="${6 * k}" fill="none" stroke-linecap="round" style="animation-delay:${-i * 0.6}s"/>`).join('')}</g>`;

  function riceBowl() {
    return `<path d="M-50 -46 Q-48 -2 0 -2 Q48 -2 50 -46Z" fill="#2a1a1a" ${L3}/>
      <path d="M-50 -46 Q-44 -80 0 -82 Q44 -80 50 -46Z" fill="#fff" ${L3}/>
      <path d="M-20 -60 l4 -3 M8 -70 l4 2 M20 -56 l3 -3 M-6 -52 l4 2" stroke="#e4e4e4" stroke-width="4" stroke-linecap="round"/>`;
  }
  function kobachi() {
    return `<path d="M-46 -30 L-30 -2 H30 L46 -30Z" fill="#6cb8f0" ${L3}/>
      <ellipse cx="0" cy="-30" rx="46" ry="11" fill="#e8f4ff" ${L3}/>
      <path d="M-24 -34 q10 -14 22 -2 q8 -10 20 0" fill="#ffd65c" ${L3}/><circle cx="4" cy="-44" r="6" fill="#f25c5c" ${L3}/>`;
  }
  function chopsticks(gold) {
    const c = gold ? '#e8b84a' : '#8a4b36';
    return `<ellipse cx="150" cy="-4" rx="14" ry="7" fill="${gold ? '#fff3b0' : '#ddd'}" ${L3}/>
      <path d="M-150 -10 L160 -14" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M-150 -10 L160 -14" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-150 2 L160 -2" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M-150 2 L160 -2" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  }
  function takatsuki() {
    return `<path d="M-60 0 H60 L26 -22 V-78 H-26 V-22Z" fill="#b3261e" ${L}/>
      <ellipse cx="0" cy="-82" rx="84" ry="16" fill="#b3261e" ${L}/>
      <path d="M-60 -4 H60 M-80 -84 H80" stroke="#e8b84a" stroke-width="3"/>`;
  }

  // 御膳。0,0 = ゆか
  function zen(lv) {
    const gold = lv >= 4;
    const top = -118;
    const bowlStyle = lv >= 10 ? 'gold' : 'lacquer';
    const raised = lv >= 6;
    return `
      <ellipse cx="0" cy="4" rx="250" ry="16" fill="#0002"/>
      <path d="M-200 0 V-70 H-170 V0Z M170 0 V-70 H200 V0Z" fill="#8f2520" ${L}/>
      <path d="M-230 ${top + 20} H230 V-64 Q0 -40 -230 -64Z" fill="#b3261e" ${L}/>
      ${gold ? `<path d="M-120 -80 q30 -14 60 0 t60 0 t60 0" stroke="#e8b84a" stroke-width="4" fill="none"/>` : ''}
      <path d="M-250 ${top} H250 L230 ${top + 20} H-230Z" fill="#c83a30" ${L}/>
      ${gold ? `<path d="M-244 ${top + 4} H244" stroke="#e8b84a" stroke-width="4"/>` : ''}
      <g transform="translate(-150,${top + 8}) scale(.9)">${riceBowl()}</g>
      <g transform="translate(160,${top + 10}) scale(.9)">${kobachi()}</g>
      <g transform="translate(0,${top + 12})">
        ${raised ? takatsuki() : ''}
        <g transform="translate(0,${raised ? -82 : 0}) scale(.62)">${bowl(bowlStyle, gold)}</g>
        ${miniSteam([-24, 20], raised ? -160 : -76)}
      </g>
      <g transform="translate(0,${top + 24}) scale(.55)">${chopsticks(gold)}</g>
      ${gold ? `<g class="shine">${[[-200, top - 30], [210, top - 60], [60, top - 110], [-90, top - 90]].map(([x, y]) => `<path d="M${x} ${y} l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6z" fill="#fff3a0"/>`).join('')}</g>` : ''}`;
  }

  /* ---------- まわりの もの ---------- */
  function attendant(robe, robe2) {
    // 平伏している ひと（ひだりむき）
    return `<g class="bow">
      <path d="M40 0 Q46 -40 96 -34 Q116 -20 112 0Z" fill="${robe2}" ${L}/>
      <path d="M-66 0 Q-74 -74 4 -82 Q78 -84 96 -12 L96 0Z" fill="${robe}" ${L}/>
      <path d="M-30 -60 Q10 -40 30 0" stroke="#0002" stroke-width="5" fill="none"/>
      <path d="M-108 0 Q-104 -22 -56 -18 L-50 0Z" fill="${robe2}" ${L3}/>
      <ellipse cx="-78" cy="-18" rx="20" ry="15" fill="#2a2a2a" ${L3}/>
      <path d="M-86 -30 Q-104 -70 -80 -66 Q-66 -48 -70 -30Z" fill="#1e1e1e" ${L3}/>
    </g>`;
  }
  function attendants(lv) {
    const set = [];
    const robes = [['#6a4c9c', '#fff'], ['#2f6fa8', '#e8e0cc'], ['#c83a30', '#fff'], ['#3f7a4a', '#f4ecd0'], ['#e08a2a', '#fff'], ['#8a3a6a', '#f4ecd0']];
    if (lv >= 5) set.push([650, 360, 1, 1, 0]);
    if (lv >= 6) set.push([150, 360, -1, 1, 1]);
    if (lv >= 10) { set.push([740, 300, 1, .65, 2], [60, 300, -1, .65, 3]); }
    if (lv >= 20) { set.push([580, 425, 1, 1.1, 4], [220, 425, -1, 1.1, 5]); }
    return set.map(([x, y, dir, s, r]) => `<g transform="translate(${x},${y}) scale(${dir * s},${s})">${attendant(robes[r][0], robes[r][1])}</g>`).join('');
  }

  function byobu(x0, w, h, gold2) {
    const n = 6, pw = w / n;
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + i * pw, dy = i % 2 ? 10 : 0;
      s += `<path d="M${x} ${360 - h + dy} H${x + pw} V${360 - dy} H${x}Z" fill="${i % 2 ? '#e8b84a' : '#f3cf6a'}" ${L3}/>`;
    }
    s += `<path d="M${x0 + w * .1} ${360 - h * .45} q${w * .2} ${-h * .12} ${w * .4} 0 q${w * .2} ${h * .1} ${w * .45} -${h * .05}" stroke="#fff3c0" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/>`;
    s += `<path d="M${x0 + w * .3} 356 Q${x0 + w * .34} ${360 - h * .5} ${x0 + w * .5} ${360 - h * .7}" stroke="#6b4a2a" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    s += `<ellipse cx="${x0 + w * .52}" cy="${360 - h * .72}" rx="${w * .16}" ry="${h * .08}" fill="#3f7a4a"/><ellipse cx="${x0 + w * .3}" cy="${360 - h * .56}" rx="${w * .12}" ry="${h * .06}" fill="#3f7a4a"/>`;
    if (gold2) s += `<path d="M${x0 + w * .6} ${360 - h * .85} q20 -16 40 0 q-20 6 -40 0z M${x0 + w * .72} ${360 - h * .9} l30 -10" stroke="${INK}" stroke-width="3" fill="#fff"/>`;
    return s;
  }

  function misu() {
    let tassels = '';
    for (let x = 60; x <= 740; x += 170) {
      tassels += `<path d="M${x} 116 V150" stroke="#c83a30" stroke-width="5"/><circle cx="${x}" cy="152" r="9" fill="#c83a30" ${L3}/><path d="M${x - 6} 160 L${x - 10} 196 M${x} 160 V200 M${x + 6} 160 L${x + 10} 196" stroke="#c83a30" stroke-width="4" stroke-linecap="round"/>`;
    }
    return `<rect x="-600" y="-200" width="2000" height="300" fill="url(#sudare)" ${L3}/>
      <rect x="-600" y="96" width="2000" height="22" fill="#6a4c9c" ${L3}/>
      <path d="M-600 106 H1400" stroke="#e8b84a" stroke-width="3" stroke-dasharray="14 10"/>${tassels}`;
  }

  function bonbori(x) {
    return `<g transform="translate(${x},360)">
      <path d="M-24 0 H24 L8 -12 V-110 H-8 V-12Z" fill="#2a1a1a" ${L3}/>
      <path d="M-32 -110 Q-40 -150 -26 -176 H26 Q40 -150 32 -110Z" fill="#fff3d6" ${L3} class="shine"/>
      <path d="M-30 -176 H30 L20 -190 H-20Z" fill="#2a1a1a" ${L3}/>
      <path d="M-30 -120 H30 M-34 -150 H34" stroke="#c83a30" stroke-width="3"/></g>`;
  }

  function washitsu() {
    return BIG('#f3e6c4') +
      `<rect x="-3000" y="60" width="6800" height="300" fill="url(#shoji)"/>` +
      `<rect x="-3000" y="36" width="6800" height="26" fill="#9a6a3c" ${L3}/>` +
      `<rect x="-3000" y="360" width="6800" height="3000" fill="url(#tatami)"/>` +
      `<path d="M-3000 360 H3800" stroke="${INK}" stroke-width="5"/>`;
  }

  function rays(cx, cy, n, r, fill, cls = 'spin-slow') {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, b = a + Math.PI / n;
      s += `<path d="M0 0 L${(Math.cos(a) * r).toFixed(0)} ${(Math.sin(a) * r).toFixed(0)} L${(Math.cos(b) * r).toFixed(0)} ${(Math.sin(b) * r).toFixed(0)}Z" fill="${fill}"/>`;
    }
    return `<g transform="translate(${cx},${cy})"><g class="${cls}">${s}</g></g>`;
  }

  function petals(n, colors) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = rnd(-100, 900).toFixed(0);
      s += `<g transform="translate(${x},0)"><ellipse class="petal-f" rx="7" ry="4.5" fill="${colors[i % colors.length]}" style="animation-delay:${(-rnd(0, 8)).toFixed(2)}s;animation-duration:${rnd(5, 9).toFixed(2)}s"/></g>`;
    }
    return `<g>${s}</g>`;
  }

  function cloudsFloor() {
    let s = '';
    for (let x = -700; x <= 1500; x += 70) {
      const y = 380 + Math.sin(x * 0.03) * 12;
      s += `<circle cx="${x}" cy="${y}" r="${60 + (x % 3) * 10}" fill="#fff"/>`;
    }
    return `<g>${s}</g><rect x="-3000" y="400" width="6800" height="3000" fill="#fff"/>`;
  }

  function rainbow() {
    const cols = ['#ff9f9f', '#ffd08a', '#fff09a', '#aee6a0', '#9fd4f5', '#c3b0f0'];
    return `<g opacity=".7">${cols.map((c, i) => `<path d="M${40 + i * 18} 380 A${360 - i * 18} ${340 - i * 18} 0 0 1 ${760 - i * 18} 380" stroke="${c}" stroke-width="18" fill="none"/>`).join('')}</g>`;
  }

  function flyingCranes() {
    const crane = `<path d="M0 0 q-30 -30 -60 -20 q30 0 50 26 q-20 6 -50 30 q40 -10 60 -30 l30 -6 l8 -8 l-8 2 z" fill="#fff" ${L3}/><circle cx="36" cy="-12" r="4" fill="#c83a30"/>`;
    return `<g class="bob"><g transform="translate(120,110) scale(.8)">${crane}</g><g transform="translate(640,80) scale(-.7,.7)">${crane}</g></g>`;
  }

  function stars(n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = rnd(-600, 1400).toFixed(0), y = rnd(-400, 700).toFixed(0), r = rnd(1, 3.2).toFixed(1);
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" class="${i % 3 ? '' : 'shine'}" style="animation-delay:${-i * 0.13}s"/>`;
    }
    return s;
  }
  function planet(x, y, r, c, ring) {
    return `<g transform="translate(${x},${y})">${ring ? `<ellipse rx="${r * 1.9}" ry="${r * .45}" fill="none" stroke="#ffd08a" stroke-width="6" transform="rotate(-18)"/>` : ''}
      <circle r="${r}" fill="${c}" ${L3}/><path d="M${-r * .6} ${-r * .3} q${r * .6} ${-r * .3} ${r * 1.2} 0" stroke="#fff6" stroke-width="5" fill="none"/>
      ${ring ? `<path d="M${-r * 1.8} ${r * .55} A${r * 1.9} ${r * .45} 0 0 0 ${r * 1.8} ${-r * .6}" fill="none" stroke="#ffd08a" stroke-width="6" transform="rotate(-18)"/>` : ''}</g>`;
  }

  /* ---------- くみたて ---------- */
  function build(lv) {
    let bg = '', back = '', center = '', front = '', over = '';
    const cx = 400;

    if (lv >= 100) {
      bg = BIG('url(#space)', -3000, 6800) + stars(160) + planet(110, 90, 34, '#ff9fbf', true) + planet(720, 330, 22, '#6cb8f0') + planet(680, 60, 12, '#ffd65c');
      back = `<g id="orbitBack"></g>`;
      center = `<g transform="translate(${cx},250)"><g class="bob"><circle r="230" fill="url(#halo)" opacity=".5" class="shine"/><g transform="translate(0,110) scale(.8)" filter="url(#glow)">${zen(lv)}</g></g></g>`;
      front = `<g id="orbitFront"></g>`;
      return { bg, back, center, front, over };
    }

    if (lv >= 30) {
      bg = BIG('url(#heavenBg)', -3000, 6800) + rays(cx, 220, 24, 900, '#fff6c8aa') + rainbow() + cloudsFloor();
      if (lv >= 50) bg += `<rect x="${cx - 120}" y="-3000" width="240" height="3360" fill="url(#pillar)" class="shine"/>`;
      back = byobu(-260, 300, 260, true) + byobu(760, 300, 260, true) + flyingCranes();
    } else if (lv >= 10) {
      bg = BIG('url(#goldBg)') + rays(cx, 220, 20, 900, '#fff7c855') +
        `<rect x="-3000" y="360" width="6800" height="3000" fill="#9a2a24"/><path d="M-3000 360 H3800" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M250 360 L120 3000 H680 L550 360Z" fill="#c83a30"/><path d="M250 360 L120 3000 M550 360 L680 3000" stroke="#e8b84a" stroke-width="6"/>`;
      back = byobu(-230, 280, 250, true) + byobu(750, 280, 250, true) + misu();
      if (lv >= 20) back += flyingCranes();
    } else if (lv >= 4) {
      bg = washitsu();
      if (lv >= 5) back += byobu(-10, 250, 220, lv >= 9) + byobu(560, 250, 220, lv >= 9) + misu();
      if (lv >= 8) back += bonbori(40) + bonbori(760);
    } else {
      bg = Items.ROOM;
    }

    if (lv >= 50) center += `<g transform="translate(${cx},250)"><circle r="260" fill="url(#halo)" class="shine"/>${rays(0, 0, 16, 330, '#fff9d0cc', 'spin-slow')}</g>`;

    if (lv === 1) {
      center += `<g transform="translate(${cx},360) scale(1.3)">${bowl('plain')}${miniSteam([-30, 26], -120, 1.1)}</g>`;
    } else if (lv === 2) {
      center += `<g transform="translate(${cx - 40},360) scale(1.3)">${bowl('lacquer')}${miniSteam([-30, 26], -124, 1.1)}</g>` +
        `<g transform="translate(${cx + 180},350) scale(.9)">${lid()}</g>`;
    } else if (lv >= 3) {
      const s = lv >= 10 ? 1.15 : 1;
      center += `<g transform="translate(${cx},360) scale(${s})" ${lv >= 50 ? 'filter="url(#glow)"' : ''}>${zen(lv)}</g>`;
    }

    if (lv >= 5) front += attendants(lv);
    if (lv >= 7) {
      front += `<g transform="translate(90,440) scale(.7)">${takatsuki()}<g transform="translate(0,-86)"><path d="M-70 -10 Q-30 -60 40 -30 L70 -50 L64 -10 L70 20 L40 4 Q-30 34 -70 -10Z" fill="#f25c5c" ${L3}/><circle cx="-44" cy="-14" r="4" fill="${INK}"/></g></g>`;
      front += `<g transform="translate(710,440) scale(.7)"><rect x="-60" y="-120" width="120" height="40" fill="#2a1a1a" ${L3}/><rect x="-60" y="-80" width="120" height="40" fill="#b3261e" ${L3}/><rect x="-60" y="-40" width="120" height="40" fill="#2a1a1a" ${L3}/><path d="M-50 -100 H50 M-50 -20 H50" stroke="#e8b84a" stroke-width="3"/></g>`;
    }
    if (lv >= 10) over += petals(lv >= 30 ? 40 : 26, lv >= 30 ? ['#ffc6d6', '#fff3a0', '#fff'] : ['#ffc6d6', '#ffb3c6', '#fff']);
    if (lv >= 4 && lv < 10) over += `<g class="shine">${[[180, 120], [620, 150], [320, 80], [520, 60]].map(([x, y]) => `<path d="M${x} ${y} l5 -14 l5 14 l14 5 l-14 5 l-5 14 l-5 -14 l-14 -5z" fill="#ffe27a"/>`).join('')}</g>`;
    return { bg, back, center, front, over };
  }

  /* ---------- 「お」の こうてん ---------- */
  let orbit = null;
  function startOrbit(svgEl) {
    stopOrbit();
    const back = svgEl.querySelector('#orbitBack'), front = svgEl.querySelector('#orbitFront');
    if (!back) return;
    orbit = { back, front, items: [], raf: 0, t0: performance.now() };
    const RINGS = [
      { rx: 250, ry: 60, tilt: -10, sp: 0.55 },
      { rx: 330, ry: 90, tilt: 14, sp: -0.38 },
      { rx: 400, ry: 120, tilt: -24, sp: 0.26 },
    ];
    const tick = now => {
      if (!orbit || !back.isConnected) { stopOrbit(); return; }
      const t = (now - orbit.t0) / 1000;
      orbit.items.forEach((it, i) => {
        const R = RINGS[it.ring];
        const a = t * R.sp + it.phase;
        let x = Math.cos(a) * R.rx, y = Math.sin(a) * R.ry;
        const tr = R.tilt * Math.PI / 180;
        const X = 400 + x * Math.cos(tr) - y * Math.sin(tr);
        const Y = 250 + x * Math.sin(tr) + y * Math.cos(tr);
        const depth = Math.sin(a);
        const size = 22 + depth * 8;
        it.el.setAttribute('x', X.toFixed(1));
        it.el.setAttribute('y', Y.toFixed(1));
        it.el.setAttribute('font-size', size.toFixed(1));
        const want = depth > 0 ? front : back;
        if (it.el.parentNode !== want) want.appendChild(it.el);
      });
      orbit.raf = requestAnimationFrame(tick);
    };
    orbit.raf = requestAnimationFrame(tick);
  }
  function stopOrbit() {
    if (orbit) cancelAnimationFrame(orbit.raf);
    orbit = null;
  }
  const MAX_ORBIT = 150;
  function syncOrbit(n) {
    if (!orbit) return;
    const want = Math.min(MAX_ORBIT, Math.max(8, n - 92));
    const colors = ['#ffe27a', '#ffc6d6', '#bfe6ff', '#fff', '#c8f0b8'];
    while (orbit.items.length < want) {
      const i = orbit.items.length;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.textContent = 'お';
      el.setAttribute('text-anchor', 'middle');
      el.setAttribute('dominant-baseline', 'middle');
      el.setAttribute('font-weight', '900');
      el.setAttribute('font-family', 'Zen Maru Gothic, sans-serif');
      el.setAttribute('fill', colors[i % colors.length]);
      el.setAttribute('stroke', '#2a1f5a'); el.setAttribute('stroke-width', '3'); el.setAttribute('paint-order', 'stroke');
      orbit.back.appendChild(el);
      orbit.items.push({ el, ring: i % 3, phase: i * 2.39996 });
    }
  }

  /* ---------- こうかい API ---------- */
  let currentLv = -1;
  window.Miso = {
    levelOf,
    render(objEl, n, force) {
      const lv = levelOf(n);
      if (lv === currentLv && !force) {
        syncOrbit(n);
        return false;
      }
      currentLv = lv;
      const p = build(lv);
      objEl.innerHTML = `<svg class="scene miso-lv${lv}" viewBox="0 0 800 450" preserveAspectRatio="xMidYMax meet" width="100%" height="100%">
        ${DEFS}<g class="fade-in">${p.bg}</g><g class="fade-in">${p.back}</g>
        <g id="misoCenter"><g id="misoPulse" class="${lv > 0 ? 'pop-in' : ''}">${p.center}</g></g>
        <g class="fade-in">${p.front}</g>${p.over}</svg>`;
      if (lv >= 100) { startOrbit(objEl.querySelector('svg')); syncOrbit(n); }
      else stopOrbit();
      return true;
    },
    pulse(objEl) {
      const g = objEl.querySelector('#misoPulse');
      if (!g) return;
      g.classList.remove('pop-in', 'boing');
      void g.getBoundingClientRect();
      g.classList.add('boing');
    },
    reset() { currentLv = -1; stopOrbit(); },
    bgmFor(n) { return n >= 100 ? 'cosmic' : n >= 5 ? 'gagaku' : 'normal'; },
  };
})();
