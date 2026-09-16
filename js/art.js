/* おのたしざん — え（キャラクター・かざり・はいけい） */
(function () {
  'use strict';

  const INK = '#5b4636';
  const L = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
  const L3 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  function svg(vb, inner, attrs = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${attrs}>${inner}</svg>`;
  }

  /* ---------- キャラクター ---------- */
  function teacher() {
    return svg('0 0 130 150', `
      <ellipse cx="65" cy="146" rx="42" ry="5" fill="#0001"/>
      <path d="M95 70 L124 34" ${L} />
      <circle cx="125" cy="32" r="5" fill="#ff6b6b" ${L3}/>
      <ellipse cx="65" cy="95" rx="46" ry="50" fill="#c98b5a" ${L}/>
      <ellipse cx="65" cy="108" rx="30" ry="34" fill="#fbe6c2"/>
      <path d="M52 102 q6 5 12 0 M66 114 q6 5 12 0 M50 124 q6 5 12 0 M68 132 q5 4 10 0" stroke="#e0bf93" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M22 88 q-12 26 8 46" fill="#b0764a" ${L}/>
      <path d="M108 88 q10 20 -6 42" fill="#b0764a" ${L}/>
      <path d="M40 142 v6 M48 142 v6 M82 142 v6 M90 142 v6" ${L3}/>
      <circle cx="46" cy="66" r="17" fill="#fff" ${L}/>
      <circle cx="84" cy="66" r="17" fill="#fff" ${L}/>
      <circle cx="49" cy="68" r="6" fill="${INK}"/><circle cx="87" cy="68" r="6" fill="${INK}"/>
      <circle cx="51" cy="65" r="2" fill="#fff"/><circle cx="89" cy="65" r="2" fill="#fff"/>
      <path d="M63 66 h4" ${L3}/>
      <g class="beak"><path d="M58 80 L72 80 L65 92 Z" fill="#ffb347" ${L3}/></g>
      <path d="M28 44 L65 30 L102 44 L65 56 Z" fill="#4a4a6a" ${L}/>
      <path d="M44 50 v10 q21 8 42 0 v-10" fill="#4a4a6a" ${L3}/>
      <path d="M102 44 v20" stroke="#ffd65c" stroke-width="4" stroke-linecap="round"/>
      <circle cx="102" cy="66" r="4" fill="#ffd65c"/>
      <ellipse cx="30" cy="90" rx="6" ry="4" fill="#ff9fbf" opacity=".6"/>
      <ellipse cx="100" cy="90" rx="6" ry="4" fill="#ff9fbf" opacity=".6"/>
    `);
  }

  function kuma() {
    return svg('0 0 110 130', `
      <ellipse cx="55" cy="126" rx="36" ry="5" fill="#0001"/>
      <ellipse cx="55" cy="96" rx="34" ry="30" fill="#d9a066" ${L}/>
      <ellipse cx="55" cy="102" rx="20" ry="18" fill="#f6dcb4"/>
      <ellipse cx="30" cy="120" rx="12" ry="8" fill="#d9a066" ${L}/>
      <ellipse cx="80" cy="120" rx="12" ry="8" fill="#d9a066" ${L}/>
      <path d="M30 70 L80 70 L72 86 L38 86 Z" fill="#6cb8f0" ${L3}/>
      <g class="head">
        <circle cx="28" cy="20" r="12" fill="#d9a066" ${L}/><circle cx="28" cy="20" r="5" fill="#f6b8a0"/>
        <circle cx="82" cy="20" r="12" fill="#d9a066" ${L}/><circle cx="82" cy="20" r="5" fill="#f6b8a0"/>
        <circle cx="55" cy="44" r="32" fill="#d9a066" ${L}/>
        <ellipse cx="55" cy="56" rx="14" ry="10" fill="#f6dcb4"/>
        <ellipse cx="55" cy="51" rx="5" ry="3.5" fill="${INK}"/>
        <path d="M50 59 q5 4 10 0" fill="none" ${L3}/>
        <circle cx="42" cy="40" r="5.5" fill="#fff"/><circle cx="68" cy="40" r="5.5" fill="#fff"/>
        <g class="pupil"><circle cx="42" cy="40" r="3.5" fill="${INK}"/><circle cx="68" cy="40" r="3.5" fill="${INK}"/></g>
        <ellipse cx="34" cy="54" rx="5" ry="3" fill="#ff9f9f" opacity=".6"/>
        <ellipse cx="76" cy="54" rx="5" ry="3" fill="#ff9f9f" opacity=".6"/>
      </g>
    `);
  }

  /* ---------- タイトルのかざり ---------- */
  const COLORS = ['#ff8a5b', '#ffd65c', '#7ccf8a', '#6cb8f0', '#ff9fbf', '#b79cf0'];

  const DECO = {
    block(ch, c) {
      return svg('0 0 80 80', `
        <path d="M10 22 L22 10 L72 10 L72 60 L60 72 L10 72 Z" fill="${c}" ${L}/>
        <path d="M10 22 L60 22 L72 10 M60 22 L60 72" fill="none" ${L}/>
        <path d="M10 22 L60 22 L60 72 L10 72 Z" fill="#fff3"/>
        <text x="35" y="58" font-size="38" font-weight="900" text-anchor="middle" fill="#fff" stroke="${INK}" stroke-width="2" paint-order="stroke" font-family="Zen Maru Gothic, sans-serif">${ch}</text>`);
    },
    crayon(c) {
      return svg('0 0 140 40', `
        <path d="M20 8 H112 V32 H20 Z" fill="${c}" ${L}/>
        <path d="M112 8 L134 20 L112 32 Z" fill="${c}" ${L}/>
        <path d="M20 8 H8 Q2 20 8 32 H20" fill="${c}" ${L}/>
        <path d="M40 8 V32 M92 8 V32" stroke="#fff8" stroke-width="5"/>
        <rect x="46" y="14" width="40" height="12" rx="6" fill="#fff9"/>`);
    },
    pencil() {
      return svg('0 0 180 40', `
        <path d="M30 8 H140 V32 H30 Z" fill="#ffd65c" ${L}/>
        <path d="M30 20 H140" stroke="#e8b83c" stroke-width="4"/>
        <path d="M140 8 L170 20 L140 32 Z" fill="#f6dcb4" ${L}/>
        <path d="M160 16 L170 20 L160 24 Z" fill="${INK}"/>
        <path d="M30 8 H14 Q6 20 14 32 H30 Z" fill="#ff9fbf" ${L}/>
        <path d="M30 6 V34" stroke="#bbb" stroke-width="8"/>`);
    },
    notebook() {
      return svg('0 0 120 150', `
        <rect x="14" y="10" width="96" height="130" rx="8" fill="#6cb8f0" ${L}/>
        <rect x="30" y="28" width="66" height="36" rx="6" fill="#fff" ${L3}/>
        <path d="M40 40 H86 M40 52 H74" stroke="#bbb" stroke-width="4" stroke-linecap="round"/>
        <path d="M14 30 h-8 M14 55 h-8 M14 80 h-8 M14 105 h-8 M14 128 h-8" ${L3}/>
        <text x="62" y="112" font-size="30" font-weight="900" text-anchor="middle" fill="#fff" font-family="Zen Maru Gothic, sans-serif">こくご</text>`);
    },
    flower(c) {
      let petals = '';
      for (let i = 0; i < 5; i++) {
        const a = i * 72 * Math.PI / 180;
        petals += `<circle cx="${40 + Math.cos(a) * 18}" cy="${40 + Math.sin(a) * 18}" r="14" fill="${c}" ${L3}/>`;
      }
      return svg('0 0 80 80', `${petals}<circle cx="40" cy="40" r="11" fill="#ffd65c" ${L3}/>`);
    },
    num(n, c) {
      return svg('0 0 70 80', `<text x="35" y="64" font-size="72" font-weight="900" text-anchor="middle" fill="${c}" stroke="${INK}" stroke-width="4" paint-order="stroke" font-family="Zen Maru Gothic, sans-serif">${n}</text>`);
    },
    kana(ch, c) {
      return svg('0 0 80 80', `<text x="40" y="64" font-size="66" font-weight="900" text-anchor="middle" fill="${c}" stroke="#fff" stroke-width="6" paint-order="stroke" font-family="Zen Maru Gothic, sans-serif">${ch}</text>`);
    },
    rabbit() {
      return svg('0 0 100 120', `
        <ellipse cx="36" cy="30" rx="10" ry="28" fill="#fff" ${L}/><ellipse cx="36" cy="30" rx="4" ry="18" fill="#ffc6d6"/>
        <ellipse cx="62" cy="30" rx="10" ry="28" fill="#fff" ${L}/><ellipse cx="62" cy="30" rx="4" ry="18" fill="#ffc6d6"/>
        <ellipse cx="50" cy="96" rx="32" ry="22" fill="#fff" ${L}/>
        <circle cx="50" cy="68" r="26" fill="#fff" ${L}/>
        <circle cx="41" cy="66" r="3.5" fill="${INK}"/><circle cx="59" cy="66" r="3.5" fill="${INK}"/>
        <path d="M46 76 q4 4 8 0" fill="none" ${L3}/>
        <ellipse cx="34" cy="76" rx="5" ry="3" fill="#ffb3c6"/><ellipse cx="66" cy="76" rx="5" ry="3" fill="#ffb3c6"/>`);
    },
    elephant() {
      return svg('0 0 130 110', `
        <ellipse cx="72" cy="66" rx="44" ry="32" fill="#a9c8ea" ${L}/>
        <rect x="42" y="84" width="16" height="22" rx="6" fill="#a9c8ea" ${L}/>
        <rect x="84" y="84" width="16" height="22" rx="6" fill="#a9c8ea" ${L}/>
        <circle cx="36" cy="50" r="28" fill="#a9c8ea" ${L}/>
        <ellipse cx="52" cy="46" rx="16" ry="20" fill="#c3dbf3" ${L}/>
        <path d="M14 58 q-12 20 4 36" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>
        <path d="M14 58 q-12 20 4 36" fill="none" stroke="#a9c8ea" stroke-width="7" stroke-linecap="round"/>
        <circle cx="28" cy="44" r="3.5" fill="${INK}"/>
        <ellipse cx="22" cy="56" rx="5" ry="3" fill="#ffb3c6"/>`);
    },
    chick() {
      return svg('0 0 90 90', `
        <circle cx="45" cy="50" r="32" fill="#ffe066" ${L}/>
        <path d="M40 20 q4 -12 10 -2" fill="#ffe066" ${L3}/>
        <circle cx="34" cy="46" r="4" fill="${INK}"/><circle cx="56" cy="46" r="4" fill="${INK}"/>
        <path d="M39 56 L51 56 L45 64 Z" fill="#ff9a3c" ${L3}/>
        <path d="M14 58 q-8 -2 -6 -10 M76 58 q8 -2 6 -10" ${L3} fill="none"/>`);
    },
  };

  function titleDeco(el) {
    const items = [
      // [html, left%, top%, width px, rot]
      [DECO.block('あ', '#ff8a5b'), 4, 8, 90, -10],
      [DECO.block('い', '#7ccf8a'), 13, 22, 72, 8],
      [DECO.block('う', '#6cb8f0'), 84, 64, 84, 6],
      [DECO.block('お', '#ffd65c'), 90, 12, 78, -8],
      [DECO.crayon('#ff6b6b'), 68, 84, 150, -18],
      [DECO.crayon('#6cb8f0'), 74, 90, 140, -6],
      [DECO.crayon('#7ccf8a'), 20, 88, 130, 12],
      [DECO.pencil(), 60, 4, 190, 14],
      [DECO.notebook(), 3, 55, 110, -8],
      [DECO.flower('#ff9fbf'), 28, 6, 64, 0],
      [DECO.flower('#b79cf0'), 92, 40, 58, 0],
      [DECO.flower('#ff8a5b'), 42, 88, 54, 0],
      [DECO.flower('#6cb8f0'), 11, 40, 46, 0],
      [DECO.num('1', '#ff8a5b'), 22, 62, 50, -10],
      [DECO.num('2', '#7ccf8a'), 78, 30, 56, 12],
      [DECO.num('3', '#b79cf0'), 50, 2, 44, -6],
      [DECO.kana('か', '#ffd65c'), 72, 48, 60, 10],
      [DECO.kana('ね', '#ff9fbf'), 30, 76, 54, -12],
      [DECO.kana('ち', '#6cb8f0'), 36, 16, 46, 8],
      [DECO.rabbit(), 88, 78, 90, 0],
      [DECO.elephant(), 1, 80, 120, 0],
      [DECO.chick(), 76, 16, 60, 0],
    ];
    el.innerHTML = '';
    items.forEach(([html, x, y, w, r], i) => {
      const d = document.createElement('div');
      d.className = 'float';
      d.style.cssText = `left:${x}%;top:${y}%;width:${w}px;transform:rotate(${r}deg);--r2:${r + (i % 2 ? 4 : -4)}deg;animation-delay:${-i * 0.7}s;animation-duration:${4 + (i % 4)}s`;
      d.innerHTML = html;
      el.appendChild(d);
    });
  }

  function logo(el) {
    el.innerHTML = '';
    ['お', 'の', 'た', 'し', 'ざ', 'ん'].forEach((ch, i) => {
      const b = document.createElement('span');
      b.className = 'blk';
      b.style.setProperty('--c', i === 0 ? '#ff8a5b' : COLORS[(i + 1) % COLORS.length]);
      b.style.animationDelay = `${0.1 + i * 0.1}s, ${-i * 0.3}s`;
      b.style.rotate = `${[-6, 4, -3, 5, -4, 3][i]}deg`;
      b.innerHTML = `<span>${ch}</span>`;
      el.appendChild(b);
    });
  }

  function hanamaru() {
    // うずまき
    let d = '';
    const cx = 100, cy = 100;
    for (let a = 0; a <= Math.PI * 2 * 3.2; a += 0.12) {
      const r = 8 + a * 3.4;
      const x = cx + Math.cos(a) * r * 1.1, y = cy + Math.sin(a) * r * 0.95;
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    let petals = '';
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const x = cx + Math.cos(a) * 88, y = cy + Math.sin(a) * 80;
      petals += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(a * 180 / Math.PI).toFixed(1)})"><ellipse class="petal" style="animation-delay:${1.5 + i * 0.05}s" rx="16" ry="11" fill="none" stroke="#f25c5c" stroke-width="7"/></g>`;
    }
    return svg('-10 -10 220 220', `${petals}<path class="spiral" d="${d}" fill="none" stroke="#f25c5c" stroke-width="9" stroke-linecap="round"/>`);
  }

  /* ---------- ステージの はいけい ---------- */
  const BG = {
    room: `
      <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMax slice" width="100%" height="100%">
        <rect width="800" height="450" fill="#fff6dc"/>
        <g opacity=".5">
          <circle cx="90" cy="70" r="30" fill="#ffe8a0"/><circle cx="700" cy="90" r="22" fill="#d6ecff"/>
          <circle cx="620" cy="40" r="12" fill="#ffd6e4"/><circle cx="180" cy="130" r="10" fill="#d8f2d9"/>
        </g>
        <path d="M0 360 H800 V450 H0 Z" fill="#f2c48d"/>
        <path d="M0 360 H800" stroke="${INK}" stroke-width="5"/>
        <path d="M0 380 H800 M0 410 H800" stroke="#e3ad72" stroke-width="3"/>
      </svg>`,
  };

  /* ---------- こうか ---------- */
  function sparks(fxEl, x, y, n = 10, color) {
    const r = fxEl.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      const a = Math.random() * Math.PI * 2, dist = rnd(40, 120);
      s.style.cssText = `left:${x - r.left - 7}px;top:${y - r.top - 7}px;--dx:${Math.cos(a) * dist}px;--dy:${Math.sin(a) * dist}px;background:${color || pick(COLORS)}`;
      fxEl.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }
  function fxText(fxEl, text, xPct, yPct, opt = {}) {
    const t = document.createElement('div');
    t.className = 'fx-text';
    t.textContent = text;
    t.style.cssText = `left:${xPct}%;top:${yPct}%;font-size:${opt.size || 40}px;color:${opt.color || '#ff8a5b'};animation-duration:${opt.dur || 1}s`;
    fxEl.appendChild(t);
    setTimeout(() => t.remove(), (opt.dur || 1) * 1000 + 50);
  }

  /* ---------- 紙吹雪 ---------- */
  const Confetti = (() => {
    let cv, cx, parts = [], raf = 0;
    function init() {
      cv = document.getElementById('confetti'); cx = cv.getContext('2d');
      const resize = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
      addEventListener('resize', resize); resize();
    }
    function burst(n = 120, opt = {}) {
      if (!cv) init();
      const W = innerWidth, H = innerHeight;
      for (let i = 0; i < n; i++) {
        const kind = opt.stars ? pick(['star', 'star', 'rect', 'circle']) : pick(['rect', 'rect', 'circle', 'star']);
        parts.push({
          x: opt.x != null ? opt.x : rnd(0, W), y: opt.y != null ? opt.y : rnd(-H * 0.3, -10),
          vx: opt.x != null ? rnd(-9, 9) : rnd(-1.5, 1.5), vy: opt.x != null ? rnd(-14, -4) : rnd(1, 4),
          r: rnd(0, Math.PI * 2), vr: rnd(-0.2, 0.2), s: rnd(7, 15),
          c: pick(COLORS.concat(['#f25c5c'])), kind, life: 0,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function star(s) {
      cx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? s * 0.45 : s;
        cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      cx.closePath(); cx.fill();
    }
    function tick() {
      const dpr = devicePixelRatio, H = innerHeight;
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter(p => p.y < H + 40 && p.life < 600);
      for (const p of parts) {
        p.life++; p.vy += 0.18; p.vy = Math.min(p.vy, 4.5); p.vx *= 0.985;
        p.x += p.vx + Math.sin(p.life * 0.05 + p.s) * 0.6; p.y += p.vy; p.r += p.vr;
        cx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        cx.rotate(p.r);
        cx.fillStyle = p.c;
        if (p.kind === 'rect') cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * (0.5 + Math.abs(Math.sin(p.life * 0.1))));
        else if (p.kind === 'circle') { cx.beginPath(); cx.arc(0, 0, p.s / 2.5, 0, 7); cx.fill(); }
        else star(p.s / 1.4);
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
      if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
    }
    return { burst };
  })();

  window.Art = { INK, L, L3, svg, rnd, pick, COLORS, teacher, kuma, titleDeco, logo, hanamaru, BG, sparks, fxText, Confetti, DECO };
})();
