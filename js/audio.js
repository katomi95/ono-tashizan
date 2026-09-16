/* おのたしざん — おと（Web Audio でその場生成） */
(function () {
  'use strict';

  let ctx = null, master, sfxBus, bgmBus, reverb, reverbSend;
  let soundOn = true, voiceOn = true;
  let bgmMode = null, bgmTimer = null, nextTime = 0, step = 0;
  let lastPon = 0;
  let voices = [];

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = soundOn ? 0.9 : 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master.connect(comp); comp.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8; sfxBus.connect(master);
    bgmBus = ctx.createGain(); bgmBus.gain.value = 0.32; bgmBus.connect(master);
    reverb = ctx.createConvolver(); reverb.buffer = impulse(2.2, 2.5);
    reverbSend = ctx.createGain(); reverbSend.gain.value = 0.35;
    reverbSend.connect(reverb); reverb.connect(master);
  }

  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  let noiseBuf = null;
  function noise() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    return s;
  }

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  /* 基本の音：柔らかいマリンバ／トイピアノ */
  function tone(midi, t, o = {}) {
    const dur = o.dur || 0.35, vol = o.vol == null ? 0.3 : o.vol;
    const out = o.bus || sfxBus;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (o.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq || mtof(midi), t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + dur * 0.8);
    osc.connect(g);
    if (o.overtone !== false) {
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.frequency.value = (o.freq || mtof(midi)) * (o.ratio || 4);
      g2.gain.setValueAtTime(vol * 0.25, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.25);
      o2.connect(g2); g2.connect(out); o2.start(t); o2.stop(t + dur);
    }
    g.connect(out);
    if (o.wet) { const w = ctx.createGain(); w.gain.value = o.wet; g.connect(w); w.connect(reverbSend); }
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function noiseHit(t, o = {}) {
    const s = noise();
    const f = ctx.createBiquadFilter(); f.type = o.ftype || 'bandpass'; f.frequency.value = o.freq || 3000; f.Q.value = o.q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(o.vol || 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (o.dur || 0.05));
    s.connect(f); f.connect(g); g.connect(o.bus || sfxBus);
    s.start(t, Math.random()); s.stop(t + (o.dur || 0.05) + 0.02);
  }

  const now = () => ctx.currentTime + 0.005;

  /* ---------------- SFX ---------------- */
  const SFX = {
    click() { tone(84, now(), { dur: 0.12, vol: 0.18, overtone: false, type: 'triangle' }); },
    pon() {
      const t = now();
      tone(72, t, { dur: 0.25, vol: 0.35, slide: mtof(79) });
      tone(91, t + 0.02, { dur: 0.15, vol: 0.08, overtone: false });
    },
    pin() {
      const t = now();
      tone(88, t, { dur: 0.6, vol: 0.2, wet: 0.5, ratio: 2.76 });
      tone(95, t + 0.07, { dur: 0.8, vol: 0.18, wet: 0.6, ratio: 2.76 });
    },
    correct() { // できました！ ジングル
      const t = now();
      [72, 76, 79, 84].forEach((m, i) => tone(m, t + i * 0.08, { dur: 0.4, vol: 0.22, wet: 0.3 }));
      tone(88, t + 0.34, { dur: 0.9, vol: 0.16, wet: 0.6, ratio: 2.76 });
    },
    oops() {
      const t = now();
      tone(67, t, { dur: 0.22, vol: 0.2, type: 'triangle', overtone: false });
      tone(63, t + 0.16, { dur: 0.35, vol: 0.2, type: 'triangle', overtone: false, slide: mtof(60) });
    },
    whoosh() {
      const t = now(); const s = noise();
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2;
      f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.3);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t); s.stop(t + 0.4);
    },
    chalin() {
      const t = now();
      for (let i = 0; i < 6; i++) {
        const tt = t + i * 0.07 + Math.random() * 0.03;
        tone(0, tt, { freq: 2400 + Math.random() * 1600, dur: 0.25, vol: 0.09, ratio: 1.51, wet: 0.3 });
        tone(0, tt, { freq: 5200 + Math.random() * 900, dur: 0.12, vol: 0.05, overtone: false });
      }
    },
    pu() { // ぷっ（控えめ）
      const t = now() + 0.02;
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.16);
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.frequency.value = 38; lg.gain.value = 18; lfo.connect(lg); lg.connect(o.frequency);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(f); f.connect(g); g.connect(sfxBus);
      o.start(t); lfo.start(t); o.stop(t + 0.2); lfo.stop(t + 0.2);
    },
    kira() {
      const t = now();
      [96, 100, 103, 108].forEach((m, i) => tone(m, t + i * 0.05, { dur: 0.4, vol: 0.06, wet: 0.7, overtone: false }));
    },
    pop() { tone(0, now(), { freq: 600, slide: 1400, dur: 0.12, vol: 0.2, overtone: false }); },
    boing() {
      const t = now();
      tone(0, t, { freq: 180, slide: 420, dur: 0.3, vol: 0.2, type: 'triangle', overtone: false });
    },
    rumble() {
      const t = now();
      noiseHit(t, { ftype: 'lowpass', freq: 200, dur: 1.0, vol: 0.25 });
      tone(0, t, { freq: 60, slide: 40, dur: 1.0, vol: 0.25, overtone: false });
    },
    fanfare() {
      const t = now();
      const mel = [[72, 0], [72, .15], [72, .3], [76, .45], [79, .75], [76, 1.0], [79, 1.15], [84, 1.4]];
      mel.forEach(([m, d]) => {
        tone(m, t + d, { dur: 0.35, vol: 0.2, type: 'triangle', wet: 0.3 });
        tone(m - 12, t + d, { dur: 0.3, vol: 0.08, type: 'square', overtone: false });
      });
      [60, 64, 67, 72].forEach(m => tone(m, t + 1.4, { dur: 1.6, vol: 0.08, type: 'triangle', wet: 0.5, overtone: false }));
    },
    taiko() {
      const t = now();
      tone(0, t, { freq: 110, slide: 55, dur: 0.6, vol: 0.5, overtone: false });
      noiseHit(t, { ftype: 'lowpass', freq: 400, dur: 0.12, vol: 0.2 });
    },
    /* 「＋お」連打用。音階が少しずつ上がるが、2オクターブで一巡して耳障りにしない */
    addO(n) {
      const t = now();
      const scale = [0, 2, 4, 7, 9];
      const idx = (n - 1) % 12;
      const m = 67 + 12 * Math.floor(idx / 5) + scale[idx % 5];
      const gap = t - lastPon; lastPon = t;
      const vol = gap < 0.09 ? 0.12 : gap < 0.2 ? 0.17 : 0.24;
      const cosmic = n >= 100, palace = n >= 5 && n < 100;
      tone(m, t, { dur: cosmic ? 0.9 : 0.4, vol, wet: cosmic ? 0.8 : palace ? 0.45 : 0.25, ratio: palace ? 2.76 : 4 });
      tone(0, t, { freq: mtof(m) * 0.5, dur: 0.12, vol: vol * 0.35, type: 'triangle', overtone: false });
      if (n % 10 === 0) {
        [0, 4, 7, 12].forEach((d, i) => tone(m + d, t + 0.06 + i * 0.05, { dur: 0.7, vol: 0.09, wet: 0.7, overtone: false }));
      }
    },
  };

  /* ---------------- BGM ---------------- */
  // 素朴な教育番組ふう（C メジャー、ゆっくりめ）
  const SONG = {
    bpm: 108,
    // 1マス = 8分音符。null = 休符
    mel: [
      76, null, 79, 76, 72, null, 74, 76,   77, null, 76, 74, 72, null, null, null,
      74, null, 76, 77, 79, null, 81, 79,   77, 76, 74, null, 76, null, null, null,
      76, null, 79, 76, 72, null, 74, 76,   77, null, 81, 79, 77, null, 76, 74,
      72, null, 74, 76, 77, 76, 74, 71,     72, null, null, null, 67, null, 71, null,
    ],
    bass: [48, 53, 55, 48, 50, 55, 53, 48], // 1小節ごと
  };
  const GAGAKU = { bpm: 56 };
  const COSMIC = { bpm: 70 };

  function scheduleNormal(t, s) {
    const len = SONG.mel.length;
    const i = s % len;
    const beat = 60 / SONG.bpm / 2;
    const m = SONG.mel[i];
    if (m) tone(m, t, { dur: beat * 1.8, vol: 0.2, bus: bgmBus, wet: 0.2, ratio: 3.9 });
    const bar = Math.floor(i / 8);
    const b = SONG.bass[bar % SONG.bass.length];
    if (i % 8 === 0) tone(b, t, { dur: beat * 3, vol: 0.28, type: 'triangle', bus: bgmBus, overtone: false });
    if (i % 8 === 4) tone(b + 7, t, { dur: beat * 2.5, vol: 0.2, type: 'triangle', bus: bgmBus, overtone: false });
    if (i % 2 === 1) noiseHit(t, { freq: 8000, q: 0.7, dur: 0.03, vol: 0.035, bus: bgmBus });
    if (i % 8 === 2 || i % 8 === 6) {
      const chord = [b + 12 + 4, b + 12 + 7];
      if ([50].includes(b)) chord[0] = b + 12 + 3;
      chord.forEach(c => tone(c, t, { dur: beat, vol: 0.05, type: 'triangle', bus: bgmBus, overtone: false }));
    }
    return beat;
  }

  // 雅楽っぽい：笙の合竹 + 龍笛ふう + 鞨鼓
  const SHO = [[69, 71, 76, 78, 81], [67, 69, 74, 76, 79], [71, 73, 76, 78, 83], [69, 74, 76, 81, 83]];
  const RYU = [81, null, 83, null, 88, null, null, 86, 83, null, null, null, 81, null, 78, null];
  function scheduleGagaku(t, s) {
    const beat = 60 / GAGAKU.bpm / 2;
    if (s % 16 === 0) {
      const chord = SHO[(s / 16) % SHO.length];
      const dur = beat * 16;
      chord.forEach(m => {
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
        const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = mtof(m) * 1.003;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.03, t + dur * 0.35);
        g.gain.linearRampToValueAtTime(0.045, t + dur * 0.8);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.3);
        o.connect(g); o2.connect(g); g.connect(bgmBus);
        const w = ctx.createGain(); w.gain.value = 0.5; g.connect(w); w.connect(reverbSend);
        o.start(t); o2.start(t); o.stop(t + dur + 0.4); o2.stop(t + dur + 0.4);
      });
    }
    const r = RYU[s % RYU.length];
    if (r) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(mtof(r) * 0.97, t);
      o.frequency.exponentialRampToValueAtTime(mtof(r), t + 0.25);
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.frequency.value = 5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency);
      const g = ctx.createGain(); const d = beat * 2.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(bgmBus);
      const w = ctx.createGain(); w.gain.value = 0.8; g.connect(w); w.connect(reverbSend);
      o.start(t); lfo.start(t); o.stop(t + d); lfo.stop(t + d);
    }
    if (s % 8 === 0) {
      tone(0, t, { freq: 90, slide: 50, dur: 0.7, vol: 0.3, bus: bgmBus, overtone: false });
    }
    if (s % 8 === 5 || s % 8 === 6) noiseHit(t, { freq: 1800, q: 4, dur: 0.06, vol: 0.08, bus: bgmBus });
    return beat;
  }

  function scheduleCosmic(t, s) {
    const beat = 60 / COSMIC.bpm / 2;
    if (s % 16 === 0) {
      const roots = [48, 53, 45, 50];
      const r = roots[(s / 16) % roots.length];
      [r, r + 7, r + 12, r + 16, r + 19].forEach(m => {
        const o = ctx.createOscillator(); o.type = 'sine';
        o.frequency.value = mtof(m); o.detune.value = (Math.random() - 0.5) * 12;
        const g = ctx.createGain(); const dur = beat * 16;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.035, t + dur * 0.4);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.5);
        o.connect(g); g.connect(bgmBus);
        const w = ctx.createGain(); w.gain.value = 0.9; g.connect(w); w.connect(reverbSend);
        o.start(t); o.stop(t + dur + 0.6);
      });
    }
    if (Math.random() < 0.55) {
      const pent = [0, 2, 4, 7, 9];
      const m = 84 + pent[Math.floor(Math.random() * 5)] + (Math.random() < 0.3 ? 12 : 0);
      tone(m, t, { dur: 1.2, vol: 0.05, bus: bgmBus, wet: 1, overtone: false });
    }
    return beat;
  }

  function loop() {
    if (!ctx || !bgmMode) return;
    while (nextTime < ctx.currentTime + 0.2) {
      const fn = bgmMode === 'gagaku' ? scheduleGagaku : bgmMode === 'cosmic' ? scheduleCosmic : scheduleNormal;
      const d = fn(nextTime, step);
      nextTime += d; step++;
    }
  }

  function setBgm(mode) {
    ensure();
    if (!ctx || mode === bgmMode) return;
    const t = ctx.currentTime;
    bgmBus.gain.cancelScheduledValues(t);
    bgmBus.gain.setValueAtTime(bgmBus.gain.value, t);
    bgmBus.gain.linearRampToValueAtTime(0.0001, t + 0.35);
    const vol = mode === 'normal' ? 0.32 : 0.5;
    setTimeout(() => {
      bgmMode = mode; step = 0; nextTime = ctx.currentTime + 0.05;
      const t2 = ctx.currentTime;
      bgmBus.gain.cancelScheduledValues(t2);
      bgmBus.gain.setValueAtTime(0.0001, t2);
      bgmBus.gain.linearRampToValueAtTime(vol, t2 + 0.6);
    }, 380);
    if (!bgmTimer) bgmTimer = setInterval(loop, 40);
  }

  /* ---------------- こえ（読み上げ） ---------------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    voices = speechSynthesis.getVoices().filter(v => /ja/i.test(v.lang));
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function say(text, opt = {}) {
    if (!voiceOn || !soundOn || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[　 ]/g, ''));
      u.lang = 'ja-JP';
      const v = voices.find(v => /Nanami|Kyoko|Haruka|Ayumi|Google/i.test(v.name)) || voices[0];
      if (v) u.voice = v;
      u.rate = opt.rate || 1.05;
      u.pitch = opt.pitch || 1.35;
      u.volume = 0.9;
      speechSynthesis.speak(u);
    } catch (e) { /* 読み上げできない環境ではだまって続ける */ }
  }
  let sayTimer = null;
  function sayDebounced(text, wait, opt) {
    clearTimeout(sayTimer);
    if ('speechSynthesis' in window && voiceOn) speechSynthesis.cancel();
    sayTimer = setTimeout(() => say(text, opt), wait);
  }

  window.Sound = {
    unlock: ensure,
    play(name, arg) {
      ensure();
      if (!ctx || !soundOn || !SFX[name]) return;
      try { SFX[name](arg); } catch (e) { console.warn(e); }
    },
    bgm: setBgm,
    say, sayDebounced,
    get soundOn() { return soundOn; },
    get voiceOn() { return voiceOn; },
    setSound(on) {
      soundOn = on;
      if (master) master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.05);
      if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
    },
    setVoice(on) {
      voiceOn = on;
      if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
    },
  };
})();
