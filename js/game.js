/* おのたしざん — しんこう */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const el = {
    title: $('title'), game: $('game'), result: $('result'),
    eq: $('equation'), stage: $('stage'), obj: $('stageObj'), fx: $('stageFx'),
    bubble: $('bubble'), bubbleText: $('bubbleText'), teacher: $('teacher'), kuma: $('kuma'),
    next: $('nextBtn'), end: $('endBtn'), progress: $('progress'), qLabel: $('qLabel'),
    found: $('found'), oCount: $('oCount'), oMeter: $('oMeter'), oMeterInner: $('oMeterInner'),
  };

  /* ---------- じょうたい ---------- */
  const S = {
    screen: 'title',
    qi: 0,
    phase: 'idle',      // idle | intro | ready | anim | done | final | ending
    found: [],          // みつけた pos
    totalO: 0,          // きょう たした「お」
    misoN: 0,           // みおつけ に たした「お」
    seq: 0,             // がめんが かわったら ふえる。ふるい タイマーを むこうに する
    lastPress: 0,
    meterCount: 0,
  };

  function later(ms, fn) {
    const my = S.seq;
    return setTimeout(() => { if (my === S.seq) fn(); }, ms);
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- がめん ---------- */
  function show(name) {
    S.seq++;
    S.screen = name;
    for (const k of ['title', 'game', 'result']) {
      const s = el[k];
      if (k === name) {
        s.classList.add('active');
        void s.offsetWidth;
        setTimeout(() => s.classList.add('shown'), 20);
      } else {
        s.classList.remove('active', 'shown');
      }
    }
  }

  /* ---------- せんせい ---------- */
  let talkTimer = 0;
  function speak(text, opt = {}) {
    el.bubbleText.textContent = text;
    el.bubble.classList.remove('pop'); void el.bubble.offsetWidth; el.bubble.classList.add('pop');
    el.teacher.classList.add('talk');
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => el.teacher.classList.remove('talk'), Math.min(2200, 250 + text.length * 90));
    if (opt.hop) hop(el.teacher);
    if (opt.voice !== false) Sound.say(opt.voiceText || text);
  }
  function hop(node) {
    node.classList.remove('hop'); void node.offsetWidth; node.classList.add('hop');
  }

  /* ---------- しき ---------- */
  function wordNode(text, opt = {}) {
    const w = document.createElement('span');
    w.className = 'word' + (opt.cls ? ' ' + opt.cls : '');
    const chars = [...text];
    if (opt.abbrev) {
      // おおおおおおおお……みおつけ
      const head = 8;
      for (let i = 0; i < head; i++) w.appendChild(ch('お', i === 0 && opt.newAt === 0));
      const dots = document.createElement('span'); dots.className = 'dots'; dots.textContent = '……';
      w.appendChild(dots);
      [...'みおつけ'].forEach(c => w.appendChild(ch(c)));
      return w;
    }
    chars.forEach((c, i) => w.appendChild(ch(c, i === opt.newAt)));
    return w;
  }
  function ch(c, isNew) {
    const s = document.createElement('span');
    s.className = 'ch' + (isNew ? ' new-o hide' : '');
    s.textContent = c;
    return s;
  }
  function sym(text, anim) {
    const s = document.createElement('span');
    s.className = 'sym' + (anim ? ' show' : '');
    s.textContent = text;
    return s;
  }
  function plusBtn(enabled, ready) {
    const b = document.createElement('button');
    b.className = 'plus-o' + (ready ? ' ready' : '');
    b.id = 'plusO';
    b.textContent = '＋お';
    b.disabled = !enabled;
    b.addEventListener('pointerdown', e => { e.preventDefault(); onPlus(); });
    b.addEventListener('click', e => { if (e.detail === 0) onPlus(); }); // キーボード
    return b;
  }
  function row(...nodes) {
    const r = document.createElement('div');
    r.className = 'eq-row';
    nodes.forEach(n => n && r.appendChild(n));
    return r;
  }
  function setEq(rows, stacked) {
    el.eq.innerHTML = '';
    el.eq.classList.toggle('stacked', !!stacked);
    rows.forEach(r => el.eq.appendChild(r));
    fitEq();
  }
  function fitEq() {
    el.eq.style.removeProperty('--eq-size');
    const base = parseFloat(getComputedStyle(el.eq).fontSize);
    let size = base;
    const min = S.phase === 'final' && S.misoN >= 20 && S.misoN < 30 ? 30 : 20;
    const avail = el.eq.clientWidth;
    const widest = () => Math.max(...[...el.eq.children].map(r => r.scrollWidth));
    let guard = 30;
    while (widest() > avail && size > min && guard--) {
      size = Math.max(min, size * 0.92);
      el.eq.style.setProperty('--eq-size', size + 'px');
    }
  }

  function flyO(fromEl, toSpan, ms = 380) {
    if (!toSpan) return;
    if (!fromEl) { toSpan.classList.remove('hide'); return; }
    const a = fromEl.getBoundingClientRect(), b = toSpan.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'flying-o';
    f.textContent = 'お';
    f.style.fontSize = getComputedStyle(toSpan).fontSize;
    f.style.left = (a.left + a.width / 2) + 'px';
    f.style.top = (a.top + a.height / 2) + 'px';
    document.body.appendChild(f);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    f.animate([
      { transform: 'translate(-50%,-50%) scale(.6)' },
      { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 60}px)) scale(1.3)`, offset: 0.5 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)` },
    ], { duration: ms, easing: 'ease-in-out' });
    setTimeout(() => { f.remove(); toSpan.classList.remove('hide'); }, ms - 10);
  }

  const insertO = (w, pos) => w.slice(0, pos) + 'お' + w.slice(pos);

  /* ---------- しんこうど ---------- */
  function drawProgress() {
    el.progress.innerHTML = '';
    PROBLEMS.forEach((_, i) => {
      const d = document.createElement('i');
      if (S.phase === 'final' || S.phase === 'ending' || i < S.qi || (i === S.qi && S.phase === 'done')) d.className = 'done';
      else if (i === S.qi) d.className = 'now';
      el.progress.appendChild(d);
    });
    const f = document.createElement('i');
    f.className = 'final' + (S.phase === 'final' ? ' now' : '');
    el.progress.appendChild(f);
  }

  function drawFound(q) {
    el.found.innerHTML = '';
    if (q.answers.length < 2) return;
    q.answers.forEach(a => {
      const s = document.createElement('span');
      const got = S.found.includes(a.pos);
      s.className = got ? '' : 'todo';
      s.textContent = got ? insertO(q.base, a.pos) : '？？？';
      el.found.appendChild(s);
    });
  }

  /* ---------- もんだい ---------- */
  function startQuestion(i) {
    S.seq++;
    S.qi = i;
    S.found = [];
    S.phase = 'ready';
    const q = PROBLEMS[i];
    el.next.hidden = true; el.end.hidden = true;
    el.oCount.hidden = true; el.oMeter.hidden = true;
    el.qLabel.textContent = `もんだい ${i + 1}`;
    Items.render(el.obj, q.before || 'empty');
    drawProgress();
    drawFound(q);
    renderReady(q);
    const line = q.intro || (q.mode === 'choose' ? LINES.choose : pick(LINES.press));
    speak(line, { hop: true });
    Sound.play('pop');
  }

  function renderReady(q) {
    if (q.mode === 'prefix') {
      setEq([row(wordNode(q.base), plusBtn(true, true))]);
    } else {
      const sw = document.createElement('span');
      sw.className = 'slotword';
      const chars = [...q.base];
      for (let p = 0; p <= chars.length; p++) {
        const b = document.createElement('button');
        b.className = 'slot';
        b.dataset.pos = p;
        b.setAttribute('aria-label', `${p}ばんめに「お」をいれる`);
        b.disabled = S.found.includes(p);
        b.addEventListener('click', () => onSlot(p, b));
        sw.appendChild(b);
        if (p < chars.length) { const c = document.createElement('span'); c.className = 'ch'; c.textContent = chars[p]; sw.appendChild(c); }
      }
      const hint = document.createElement('div');
      hint.className = 'choose-hint';
      hint.textContent = '▲ 「お」を いれる ところを おしてね';
      setEq([row(sw, sym('＋ お')), hint], true);
    }
  }

  function renderAnswer(q, pos, wrong) {
    const w = insertO(q.base, pos);
    const res = wordNode(w, { newAt: pos, cls: wrong ? 'wrong' : '' });
    const btn = plusBtn(false);
    setEq([row(wordNode(q.base), btn, sym('＝', true), res)]);
    return res.querySelector('.new-o');
  }

  function onPlus() {
    Sound.unlock();
    if (S.screen !== 'game') return;
    if (S.phase === 'final') return onMiso();
    if (S.phase !== 'ready') return;
    const q = PROBLEMS[S.qi];
    if (q.mode !== 'prefix') return;
    const btn = $('plusO');
    S.phase = 'anim';
    Sound.play('pon');
    const a = q.answers[0];
    const from = btn ? btn : null;
    const rect = from && from.getBoundingClientRect();
    const ghost = rect ? { getBoundingClientRect: () => rect } : null;
    const target = renderAnswer(q, a.pos);
    flyO(ghost, target);
    S.totalO++;
    reveal(q, a);
  }

  function onSlot(pos, btn) {
    Sound.unlock();
    if (S.screen !== 'game' || S.phase !== 'ready') return;
    const q = PROBLEMS[S.qi];
    S.phase = 'anim';
    Sound.play('pon');
    const rect = btn.getBoundingClientRect();
    const ghost = { getBoundingClientRect: () => rect };
    const a = q.answers.find(x => x.pos === pos);
    if (!a) {
      const target = renderAnswer(q, pos, true);
      flyO(ghost, target);
      later(420, () => {
        Sound.play('oops');
        speak(LINES.wrong[0]);
      });
      later(1500, () => {
        speak(LINES.wrong[1]);
        renderReady(q);
        S.phase = 'ready';
      });
      return;
    }
    const target = renderAnswer(q, pos);
    flyO(ghost, target);
    S.totalO++;
    reveal(q, a);
  }

  function stageCenter() {
    const r = el.stage.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height * 0.55, r };
  }

  function reveal(q, a) {
    const word = insertO(q.base, a.pos);
    if (a.special === 'nara') {
      // 一瞬の間 → ぷっ → くまくんが こちらを みる → せいかい！
      later(1000, () => {
        Items.render(el.obj, a.scene);
        Sound.play('pu');
      });
      later(1250, () => el.kuma.classList.add('look'));
      later(1950, () => el.kuma.classList.remove('look'));
      later(2150, () => {
        Sound.play('correct');
        speak(a.line, { hop: true, voiceText: `${word}。${a.line}` });
        found(q, a);
      });
      return;
    }
    later(400, () => {
      Items.render(el.obj, a.scene);
      playSceneSound(a.sound);
      const c = stageCenter();
      Art.sparks(el.fx, c.x, c.y, 14);
    });
    later(900, () => {
      Sound.play('correct');
      speak(a.line, { hop: true, voiceText: `${word}。${a.line}` });
      hop(el.kuma);
      found(q, a);
    });
  }

  function playSceneSound(name) {
    if (name === 'okashi') {
      for (let i = 0; i < 14; i++) later(i * 110, () => Sound.play('pop'));
      return;
    }
    if (name === 'chalin') { Sound.play('chalin'); later(500, () => Sound.play('chalin')); return; }
    Sound.play(name);
  }

  function found(q, a) {
    S.found.push(a.pos);
    drawFound(q);
    const c = stageCenter();
    Art.Confetti.burst(40, { x: c.x, y: c.r.top + 20 });
    if (S.found.length >= q.answers.length) {
      S.phase = 'done';
      drawProgress();
      if (q.answers.length > 1) later(1700, () => speak(LINES.allFound, { hop: true }));
      later(q.answers.length > 1 ? 1900 : 500, () => { el.next.hidden = false; });
    } else {
      later(2000, () => {
        speak(LINES.more);
        renderReady(q);
        S.phase = 'ready';
      });
    }
  }

  function onNext() {
    if (S.phase !== 'done') return;
    Sound.play('click');
    el.next.hidden = true;
    if (S.qi + 1 < PROBLEMS.length) startQuestion(S.qi + 1);
    else finalIntro();
  }

  /* ---------- さいごの もんだい ---------- */
  function finalIntro() {
    S.seq++;
    S.phase = 'intro';
    S.qi = PROBLEMS.length;
    el.found.innerHTML = '';
    el.qLabel.textContent = 'さいごの もんだい';
    setEq([]);
    Items.render(el.obj, 'empty');
    drawProgress();
    Sound.play('fanfare');
    Art.Confetti.burst(80);
    speak(LINES.finalIntro[0], { hop: true });
    hop(el.kuma);
    later(2400, () => speak(LINES.finalIntro[1], { hop: true }));
    later(4300, startFinal);
  }

  function startFinal() {
    S.seq++;
    S.phase = 'final';
    S.misoN = 0;
    S.meterCount = 0;
    el.oMeterInner.innerHTML = '';
    el.qLabel.textContent = 'さいごの もんだい';
    el.found.innerHTML = '';
    Miso.reset();
    Miso.render(el.obj, 0, true);
    drawProgress();
    renderMiso(false);
    Sound.play('pop');
    speak('「＋お」を おしてね！');
  }

  const misoWord = n => 'お'.repeat(n) + 'みおつけ';

  function renderMiso(pressed) {
    const n = S.misoN;
    if (n === 0) {
      setEq([row(wordNode(FINAL.base), plusBtn(true, true))]);
      return null;
    }
    const abbrev = n >= 30;
    const prev = wordNode(misoWord(n - 1), { abbrev: n - 1 >= 30 });
    const res = wordNode(misoWord(n), { newAt: 0, abbrev });
    const btn = plusBtn(true, false);
    if (pressed) btn.classList.add('press');
    if (n < 8) {
      setEq([row(prev, btn, sym('＝'), res)]);
    } else {
      setEq([row(prev, btn), row(sym('＝'), res)], true);
    }
    return res.querySelector('.new-o');
  }

  const MILESTONE = {
    1: 'せいかい！', 2: 'できました！', 3: 'できました！', 4: 'できました！', 5: 'できました！',
    6: 'とても じょうずですね！', 10: 'とても じょうずですね！', 20: 'その ちょうし！',
    30: '「お」が いっぱいですね！', 50: 'とても じょうずですね！', 100: '「お」を たくさん たせましたね！',
  };

  function onMiso() {
    const t = performance.now();
    const quick = t - S.lastPress < 160;
    S.lastPress = t;
    const btnOld = $('plusO');
    const rect = btnOld && btnOld.getBoundingClientRect();

    S.misoN++; S.totalO++;
    const n = S.misoN;
    const target = renderMiso(true);
    setTimeout(() => { const b = $('plusO'); b && b.classList.remove('press'); }, 90);
    if (!quick && rect) flyO({ getBoundingClientRect: () => rect }, target, 300);
    else if (target) target.classList.remove('hide');

    Sound.play('addO', n);
    const leveled = Miso.render(el.obj, n);
    const c = stageCenter();
    if (leveled) {
      Sound.bgm(Miso.bgmFor(n));
      if (n === 1) Sound.play('correct');
      else if (n === 5) Sound.play('taiko');
      else if (n >= 10) { Sound.play('kira'); later(120, () => Sound.play('fanfare')); }
      else Sound.play('kira');
      if (n >= 3) Art.Confetti.burst(n >= 10 ? 120 : 50, { stars: n >= 50 });
      Art.sparks(el.fx, c.x, c.y, 18);
    } else {
      Miso.pulse(el.obj);
      if (!quick) Art.sparks(el.fx, c.x, c.y - c.r.height * 0.1, 6);
      if (n % 10 === 0) Art.Confetti.burst(50, { stars: true });
    }

    // せんせい
    let line = MILESTONE[n];
    if (!line && n % 100 === 0) line = `「お」を ${n}こ たせました！`;
    if (!line && n < 10) line = pick(LINES.praise);
    if (!line && n % 5 === 0) line = pick(LINES.praise);
    if (line) {
      speak(line, { hop: true, voice: false });
    }
    if (n <= 14) Sound.sayDebounced(`${misoWord(n)}。${line || ''}`, 320);
    else Sound.sayDebounced(`お が ${n}こ の、みおつけ。${line || ''}`, 320);

    // 「お」の かず
    el.oCount.hidden = false;
    el.oCount.querySelector('b').textContent = n;
    el.oCount.classList.remove('bump'); void el.oCount.offsetWidth; el.oCount.classList.add('bump');

    // お メーター（「お」の ためだけの UI）
    if (n >= 20) {
      if (el.oMeter.hidden) {
        el.oMeter.hidden = false;
        for (; S.meterCount < n - 1; S.meterCount++) addMeter();
        requestAnimationFrame(fitEq);
      }
      if (S.meterCount < 900) { addMeter(); S.meterCount++; }
    }

    if (n >= 10 && el.end.hidden) el.end.hidden = false;
    if (n === 10 || n === 30 || n === 100) hop(el.kuma);
  }

  function addMeter() {
    const i = document.createElement('i');
    i.textContent = 'お';
    el.oMeterInner.appendChild(i);
  }

  /* ---------- けっか ---------- */
  function showResult() {
    if (S.phase !== 'final') return;
    S.phase = 'ending';
    Sound.play('click');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    show('result');
    Sound.bgm('normal');
    Miso.reset();
    Art.titleDeco($('resultDeco'));
    $('hanamaru').innerHTML = Art.hanamaru();
    const numEl = $('resultNum');
    numEl.textContent = '0';
    later(300, () => { Sound.play('fanfare'); Sound.say('よくできました！'); });
    const total = S.totalO;
    const dur = Math.min(2200, 600 + total * 8);
    const t0 = performance.now() + 900;
    const my = S.seq;
    let lastShown = -1;
    const step = now => {
      if (my !== S.seq) return;
      const k = Math.max(0, Math.min(1, (now - t0) / dur));
      const v = Math.round(total * (1 - Math.pow(1 - k, 3)));
      if (v !== lastShown) {
        numEl.textContent = v;
        if (v > 0 && v % Math.max(1, Math.ceil(total / 20)) === 0) Sound.play('addO', v);
        lastShown = v;
      }
      if (k < 1) setTimeout(() => step(performance.now()), 30);
      else {
        Sound.play('correct');
        Art.Confetti.burst(200, { stars: true });
        later(700, () => Sound.say(`きょう たした お は、${total}こ。たしざんが じょうずに なりましたね！`));
      }
    };
    setTimeout(() => step(performance.now()), 30);
    later(400, () => Art.Confetti.burst(160));
  }

  /* ---------- タイトル ---------- */
  function toTitle() {
    show('title');
    S.phase = 'idle';
    Miso.reset();
    Art.logo(document.querySelector('.logo'));
  }

  function startGame() {
    Sound.unlock();
    Sound.play('correct');
    Sound.bgm('normal');
    S.totalO = 0;
    show('game');
    later(350, () => startQuestion(0));
  }

  /* ---------- そうさ ---------- */
  function initControls() {
    $('startBtn').addEventListener('click', startGame);
    $('retryBtn').addEventListener('click', () => { Sound.play('click'); toTitle(); });
    el.next.addEventListener('click', onNext);
    el.end.addEventListener('click', showResult);
    el.title.addEventListener('pointerdown', () => { Sound.unlock(); Sound.bgm('normal'); }, { once: true });

    const sBtn = $('soundBtn'), vBtn = $('voiceBtn');
    sBtn.addEventListener('click', () => {
      Sound.setSound(!Sound.soundOn);
      sBtn.setAttribute('aria-pressed', Sound.soundOn);
    });
    vBtn.addEventListener('click', () => {
      Sound.setVoice(!Sound.voiceOn);
      vBtn.setAttribute('aria-pressed', Sound.voiceOn);
    });

    addEventListener('keydown', e => {
      if (e.repeat) return;
      const k = e.key;
      if (!(k === ' ' || k === 'Enter' || k === 'o' || k === 'O')) return;
      if (S.screen === 'title' && k !== 'o') { e.preventDefault(); startGame(); return; }
      if (S.screen !== 'game') return;
      e.preventDefault();
      if (S.phase === 'done' && k !== 'o' && k !== 'O') onNext();
      else if (S.phase === 'final' || S.phase === 'ready') onPlus();
    });

    let rz = 0;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fitEq, 80); });
  }

  /* ---------- はじまり ---------- */
  function boot() {
    el.teacher.innerHTML = Art.teacher();
    el.kuma.innerHTML = Art.kuma();
    Art.titleDeco($('titleDeco'));
    Art.logo(document.querySelector('.logo'));
    initControls();

    // 確認用: ?q=8 / ?at=final&n=99 / ?at=end
    const p = new URLSearchParams(location.search);
    if (p.has('q')) {
      show('game');
      startQuestion(Math.max(0, Math.min(PROBLEMS.length - 1, (+p.get('q') || 1) - 1)));
      return;
    }
    if (p.get('at') === 'final') {
      show('game');
      startFinal();
      const n = +p.get('n') || 0;
      for (let i = 0; i < n; i++) { S.lastPress = performance.now(); onMiso(); }
      return;
    }
    if (p.get('at') === 'end') {
      show('game'); S.phase = 'final'; S.totalO = +p.get('n') || 127; showResult();
      return;
    }
    show('title');
  }

  boot();
})();
