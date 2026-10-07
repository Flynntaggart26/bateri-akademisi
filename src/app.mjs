import { beatIntervalMs, clampTempo, readProgress, writeProgress } from './core.mjs';

const lessons = [
  {
    id: 'note-values', level: 'başlangıç', stage: '01 / DUY', duration: '6 DK', title: 'Nota değerleri ve suslar',
    description: 'Birlikten onaltılığa kadar nota sürelerini ve sessizliğin ritimdeki yerini keşfet.',
    content: '<p>Bir ölçüyü dört eşit vuruşa böl. <strong>Dörtlük</strong> her vuruşta bir kez çalar; iki sekizlik aynı bir vuruşu paylaşır. Onaltılıklar vuruş başına dört eşit parçadır.</p><p>Sus işareti de bir süre kaplar: çalmadığın anı saymaya devam edersin. Metronomu 60 BPM’e getirip “1, 2, 3, 4” diye sayarken her vuruşta kick pad’ine bas.</p>',
  },
  {
    id: 'counting-meter', level: 'başlangıç', stage: '01 / DUY', duration: '8 DK', title: 'Ölçü, tempo ve sayım',
    description: '4/4 ölçünün içindeki nabzı bul; sekizlikleri “ve” diyerek say.',
    content: '<p><strong>Tempo</strong> dakikadaki vuruş sayısıdır (BPM). <strong>Ölçü</strong> ise bu vuruşların düzenli gruplara ayrılmasıdır. 4/4’te her ölçüde dört dörtlük vuruş vardır.</p><p>Sekizlikleri eşit aralıklarla “1 ve 2 ve 3 ve 4 ve” diye seslendir. Metronomun ilk vuruşunu ölçünün başlangıcı gibi hisset; sayım döngü halinde sürsün.</p>',
  },
  {
    id: 'drum-notation', level: 'başlangıç', stage: '02 / OKU', duration: '7 DK', title: 'Bateri notasyonu',
    description: 'Nota çizgisinde hi-hat, trampet ve kick’in nasıl gösterildiğini öğren.',
    content: '<p>Bateride nota yüksekliği melodi perdesini değil, <strong>hangi parçaya vuracağını</strong> gösterir. Çarpı biçimli nota başı çoğunlukla hi-hat veya zili; normal yuvarlak nota başı davulları belirtir.</p><p>Bu atölyedeki basit gösterimde kick alt çizgide, trampet orta alanda, hi-hat üstte düşünülür. Aynı anda yazılmış notalar birlikte çalınır — örneğin hi-hat ile kick aynı vuruşa denk gelebilir.</p>',
  },
  {
    id: 'first-groove', level: 'başlangıç', stage: '02 / OKU', duration: '10 DK', title: 'İlk rock groove’un',
    description: 'Hi-hat’i sabit tut; kick’i 1 ve 3’e, trampeti 2 ve 4’e yerleştir.',
    content: '<p>Bir ölçü boyunca hi-hat’i sekizliklerle say: <strong>1 ve 2 ve 3 ve 4 ve</strong>. Kick’i 1 ve 3’e, trampeti 2 ve 4’e ekle. Bu, sayısız şarkının iskeletidir.</p><p>Önce 60–70 BPM’de çal. Kick ve trampet aynı anda geldiğinde hi-hat elinin akışını kesme. Temiz çalabiliyorsan tempoyu küçük adımlarla artır.</p>',
  },
  {
    id: 'coordination', level: 'başlangıç', stage: '02 / OKU', duration: '8 DK', title: 'El ve ayak koordinasyonu',
    description: 'Tek bir uzvu değil, birbirini dinleyen dört uzvu yönet.',
    content: '<p>Bateride koordinasyonun sırrı hız değil, <strong>katman katman eklemektir</strong>. Sadece hi-hat ile sekizlikleri say; sabitlenince kick’i 1’e, sonra trampeti 3’e ekle.</p><p>Bir uzuv şaşırırsa diğerlerini durdurmak zorunda değilsin. Tempoyu düşür, kısa döngüler çalış ve her uzvun görevini ayrı ayrı duy.</p>',
  },
  {
    id: 'rudiments', level: 'orta', stage: '03 / KONTROL ET', duration: '9 DK', title: 'Rudiment: tek, çift, paradiddle',
    description: 'Vuruş kontrolünü ve el değişimini üç temel alıştırmayla geliştir.',
    content: '<p><strong>Tek vuruş:</strong> sağ-sol-sağ-sol. <strong>Çift vuruş:</strong> sağ-sağ-sol-sol. <strong>Paradiddle:</strong> sağ-sol-sağ-sağ / sol-sağ-sol-sol.</p><p>Pad’de veya dizlerinde yavaş çalış. Her nota aynı ses yüksekliğinde olsun. Hareket rahat ve dengeli hale gelmeden hız artırma; amaç elleri eşitlemek, yarıştırmak değil.</p>',
  },
  {
    id: 'groove-variations', level: 'orta', stage: '03 / KONTROL ET', duration: '12 DK', title: 'Groove’a karakter kat',
    description: 'Vurgu, ghost note ve açık hi-hat ile aynı ölçünün hissini değiştir.',
    content: '<p>Groove yalnızca hangi parçaya vurduğun değildir; vuruşların <strong>ne kadar güçlü ve nerede</strong> olduğudur. Vurgulu notayı belirgin çal, ghost note’u ise trampette çok hafif hissettir.</p><p>Önce basit rock kalıbını sabit tut. Ardından ölçü sonundaki hi-hat’i aç veya trampet vurgusunun öncesine hafif bir ghost note ekle.</p>',
  },
  {
    id: 'fills', level: 'orta', stage: '03 / KONTROL ET', duration: '10 DK', title: 'Ölçü sonuna fill yerleştir',
    description: 'Groove’u bozmadan kısa bir davul cümlesiyle yeni bölüme bağlan.',
    content: '<p><strong>Fill</strong>, çoğunlukla ölçünün sonunda groove’dan kısa süre ayrılan geçiş cümlesidir. Önce üç vuruş groove çal, son vuruşta tom’lara dört eşit nota koy ve sonraki ölçünün 1’inde kick ile geri dön.</p><p>Fill’in son notası, sonraki bölümün başlangıcını desteklemeli. Basit ve zamanında bir fill, hızlı ama ölçüyü kaybettiren doluluktan daha etkilidir.</p>',
  },
  {
    id: 'independence', level: 'ileri', stage: '04 / YARAT', duration: '15 DK', title: 'Bağımsızlık ve dinamik',
    description: 'Sabit zaman tutuşunu korurken el ve ayak katmanlarını özgürleştir.',
    content: '<p>Bağımsızlık, her uzvun ayrı bir görev sürdürürken ortak nabızda buluşmasıdır. Hi-hat’i sabit sekizlikte tut; kick’i her ölçüde farklı vuruşlara taşı ve trampetin 2 ile 4’ünü koru.</p><p>Ardından vuruş şiddetini katmanla: hi-hat daha hafif, trampet daha belirgin, kick dengeli. Dinamik, groove’un nefes almasını sağlar.</p>',
  },
  {
    id: 'odd-meter', level: 'ileri', stage: '04 / YARAT', duration: '14 DK', title: 'Alışılmadık ölçüler',
    description: '5/4 ve 7/8’i küçük gruplara ayırarak doğal biçimde say.',
    content: '<p>Alışılmadık ölçüler “garip” değil, farklı uzunlukta döngülerdir. <strong>5/4</strong> için 3+2; <strong>7/8</strong> için 2+2+3 gibi küçük gruplar seçip vurguları hisset.</p><p>Önce grupları sesli say ve el çırp. Sonra her grubun ilk vuruşuna kick ekle. Alt bölümleri sabit tutarsan ölçünün şekli kısa sürede duyulur hale gelir.</p>',
  },
];

const lessonGrid = document.querySelector('#lesson-grid');
const levelNames = { başlangıç: 'Başlangıç', orta: 'Orta', ileri: 'İleri' };
let progress = readProgress(safeStorage());
let activeFilter = 'all';
let selectedLessonId = null;
let audioContext = null;
let noiseBuffer = null;
let metronomeTimer = null;
let patternTimer = null;
let nextBeatTime = 0;
let beatNumber = 0;
let nextStepTime = 0;
let patternStep = 0;
let tapTimes = [];
let tempo = progress.tempo;
let isMetronomeRunning = false;
let isPatternRunning = false;
const pattern = {
  kick: new Set([0, 8]),
  snare: new Set([4, 12]),
  hat: new Set([0, 2, 4, 6, 8, 10, 12, 14]),
};

function safeStorage() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

function persistProgress() {
  writeProgress(safeStorage(), progress);
  renderProgress();
}

function renderLessons() {
  const visibleLessons = lessons.filter((lesson) => activeFilter === 'all' || lesson.level === activeFilter);
  lessonGrid.innerHTML = visibleLessons.map((lesson, index) => {
    const complete = progress.completedLessons.includes(lesson.id);
    return `<article class="lesson-card${complete ? ' is-complete' : ''}" style="--card-tone:${lesson.level === 'ileri' ? 'var(--olive)' : lesson.level === 'orta' ? '#c4a13e' : 'var(--orange)'}">
      <div class="lesson-card-top"><span class="lesson-meta">${lesson.stage} <span>·</span> ${lesson.duration}</span><span class="lesson-level">${levelNames[lesson.level]}</span></div>
      <h3>${lesson.title}</h3><p>${lesson.description}</p>
      <button class="lesson-open" data-lesson="${lesson.id}" aria-label="${lesson.title} dersini aç"><span>${complete ? 'Tekrar göz at' : 'Dersi aç'}</span><span aria-hidden="true">${complete ? '✓' : '↗'}</span></button>
    </article>`;
  }).join('');
  lessonGrid.querySelectorAll('[data-lesson]').forEach((button) => button.addEventListener('click', () => openLesson(button.dataset.lesson)));
}

function renderProgress() {
  const total = lessons.length;
  const complete = progress.completedLessons.filter((id) => lessons.some((lesson) => lesson.id === id)).length;
  document.querySelector('#progress-count').textContent = `${complete} / ${total} ders`;
  document.querySelector('#progress-percent').textContent = String(Math.round((complete / total) * 100));
}

function openLesson(id) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return;
  selectedLessonId = id;
  document.querySelector('#dialog-level').textContent = `${lesson.stage}  ·  ${levelNames[lesson.level]}  ·  ${lesson.duration}`;
  document.querySelector('#dialog-title').textContent = lesson.title;
  document.querySelector('#dialog-summary').textContent = lesson.description;
  document.querySelector('#dialog-content').innerHTML = lesson.content;
  const completeButton = document.querySelector('#complete-lesson');
  const complete = progress.completedLessons.includes(id);
  completeButton.disabled = complete;
  completeButton.innerHTML = complete ? 'Ders tamamlandı <span>✓</span>' : 'Dersi tamamla <span>✓</span>';
  const dialog = document.querySelector('#lesson-dialog');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

document.querySelectorAll('.level-tab').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.level;
    document.querySelectorAll('.level-tab').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    renderLessons();
  });
});

document.querySelector('#complete-lesson').addEventListener('click', () => {
  if (!selectedLessonId || progress.completedLessons.includes(selectedLessonId)) return;
  progress.completedLessons = [...progress.completedLessons, selectedLessonId];
  persistProgress();
  renderLessons();
  const completeButton = document.querySelector('#complete-lesson');
  completeButton.disabled = true;
  completeButton.innerHTML = 'Ders tamamlandı <span>✓</span>';
  document.querySelector('#live-region').textContent = 'Ders tamamlandı. İlerlemen kaydedildi.';
});

document.querySelector('#lesson-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) {
    document.querySelector('#sound-status').textContent = 'Ses üretimi bu tarayıcıda desteklenmiyor.';
    return null;
  }
  try {
    audioContext = new AudioContextClass();
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) channel[i] = Math.random() * 2 - 1;
    noiseBuffer = buffer;
    return audioContext;
  } catch {
    document.querySelector('#sound-status').textContent = 'Ses aygıtı başlatılamadı.';
    return null;
  }
}

function makeGain(context, value, time, duration, endValue = 0.001) {
  const gain = context.createGain();
  gain.gain.setValueAtTime(value, time);
  gain.gain.exponentialRampToValueAtTime(endValue, time + duration);
  gain.connect(context.destination);
  return gain;
}

function playDrum(name, atTime = getAudioContext()?.currentTime ?? 0) {
  const context = getAudioContext();
  if (!context) return;
  const time = Math.max(atTime, context.currentTime);

  if (name === 'kick') {
    const oscillator = context.createOscillator();
    const gain = makeGain(context, 0.9, time, 0.34);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(145, time);
    oscillator.frequency.exponentialRampToValueAtTime(48, time + 0.16);
    oscillator.connect(gain);
    oscillator.start(time);
    oscillator.stop(time + 0.36);
    return;
  }

  if (name === 'tom') {
    const oscillator = context.createOscillator();
    const gain = makeGain(context, 0.58, time, 0.34);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(175, time);
    oscillator.frequency.exponentialRampToValueAtTime(82, time + 0.22);
    oscillator.connect(gain);
    oscillator.start(time);
    oscillator.stop(time + 0.36);
    return;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = makeGain(context, name === 'hat' ? 0.25 : 0.52, time, name === 'hat' ? 0.055 : 0.17);
  source.buffer = noiseBuffer;
  filter.type = name === 'hat' ? 'highpass' : 'highpass';
  filter.frequency.setValueAtTime(name === 'hat' ? 7200 : 1400, time);
  source.connect(filter);
  filter.connect(gain);
  source.start(time);
  source.stop(time + (name === 'hat' ? 0.06 : 0.18));

  if (name === 'snare') {
    const body = context.createOscillator();
    const bodyGain = makeGain(context, 0.28, time, 0.12);
    body.type = 'triangle';
    body.frequency.setValueAtTime(185, time);
    body.connect(bodyGain);
    body.start(time);
    body.stop(time + 0.14);
  }
}

function flashPad(name) {
  const pad = document.querySelector(`[data-drum="${name}"]`);
  if (!pad) return;
  pad.classList.add('is-playing');
  globalThis.setTimeout(() => pad.classList.remove('is-playing'), 110);
  const status = document.querySelector('.pad-foot');
  status.classList.add('is-active');
  document.querySelector('#sound-status').textContent = `${name === 'hat' ? 'Hi-hat' : name === 'kick' ? 'Kick' : name === 'snare' ? 'Trampet' : 'Tom'} çalıyor`;
  globalThis.setTimeout(() => status.classList.remove('is-active'), 160);
}

async function resumeAudio(context) {
  if (!context || context.state !== 'suspended') return;
  try {
    await context.resume();
  } catch {
    document.querySelector('#sound-status').textContent = 'Ses aygıtına erişilemedi.';
  }
}

document.querySelectorAll('.drum-pad').forEach((pad) => {
  pad.addEventListener('pointerdown', async () => {
    const context = getAudioContext();
    await resumeAudio(context);
    playDrum(pad.dataset.drum);
    flashPad(pad.dataset.drum);
  });
});

document.addEventListener('keydown', async (event) => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName))) return;
  const pad = document.querySelector(`.drum-pad[data-key="${event.key}"]`);
  if (!pad) return;
  const context = getAudioContext();
  await resumeAudio(context);
  playDrum(pad.dataset.drum);
  flashPad(pad.dataset.drum);
});

function playClick(time, accented) {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(accented ? 1030 : 680, time);
  gain.gain.setValueAtTime(accented ? 0.32 : 0.19, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(time);
  oscillator.stop(time + 0.05);
}

function lightBeat(index) {
  document.querySelectorAll('.beat-lights i').forEach((light, beat) => light.classList.toggle('is-on', beat === index));
}

function scheduleMetronome() {
  if (!audioContext || !isMetronomeRunning) return;
  while (nextBeatTime < audioContext.currentTime + 0.12) {
    const time = nextBeatTime;
    const beat = beatNumber % 4;
    playClick(time, beat === 0);
    globalThis.setTimeout(() => lightBeat(beat), Math.max(0, (time - audioContext.currentTime) * 1000));
    nextBeatTime += beatIntervalMs(tempo) / 1000;
    beatNumber += 1;
  }
}

function setMetronome(running) {
  const button = document.querySelector('#metro-toggle');
  if (running) {
    const context = getAudioContext();
    if (!context) return;
    isMetronomeRunning = true;
    button.innerHTML = '<span class="button-play">■</span> Metronomu durdur';
    context.resume().catch(() => { document.querySelector('#sound-status').textContent = 'Ses aygıtına erişilemedi.'; });
    nextBeatTime = context.currentTime + 0.05;
    beatNumber = 0;
    scheduleMetronome();
    metronomeTimer = globalThis.setInterval(scheduleMetronome, 25);
  } else {
    isMetronomeRunning = false;
    button.innerHTML = '<span class="button-play">▶</span> Metronomu başlat';
    globalThis.clearInterval(metronomeTimer);
    metronomeTimer = null;
    document.querySelectorAll('.beat-lights i').forEach((light) => light.classList.remove('is-on'));
  }
}

document.querySelector('#metro-toggle').addEventListener('click', () => setMetronome(!isMetronomeRunning));

function tempoWord(value) {
  if (value < 60) return 'LARGO';
  if (value < 76) return 'ADAGIO';
  if (value < 108) return 'YÜRÜYÜŞ';
  if (value < 132) return 'MODERATO';
  if (value < 168) return 'ALLEGRO';
  return 'PRESTO';
}

function updateTempo(value, save = true) {
  tempo = clampTempo(value);
  document.querySelector('#tempo-value').textContent = String(tempo);
  document.querySelector('#sequence-tempo-value').innerHTML = `${tempo} <small>BPM</small>`;
  document.querySelector('#tempo-word').textContent = tempoWord(tempo);
  const slider = document.querySelector('#tempo-slider');
  slider.value = String(tempo);
  slider.style.setProperty('--range-progress', `${((tempo - 40) / 180) * 100}%`);
  if (save) {
    progress.tempo = tempo;
    writeProgress(safeStorage(), progress);
  }
}

document.querySelector('#tempo-slider').addEventListener('input', (event) => updateTempo(event.target.value));
document.querySelectorAll('[data-change]').forEach((button) => button.addEventListener('click', () => updateTempo(tempo + Number(button.dataset.change))));

document.querySelector('#tap-tempo').addEventListener('click', () => {
  const now = performance.now();
  if (tapTimes.length && now - tapTimes.at(-1) > 2200) tapTimes = [];
  tapTimes.push(now);
  tapTimes = tapTimes.slice(-5);
  if (tapTimes.length > 1) {
    const gaps = tapTimes.slice(1).map((time, index) => time - tapTimes[index]);
    const mean = gaps.reduce((sum, value) => sum + value, 0) / gaps.length;
    if (mean >= 273 && mean <= 1500) updateTempo(60_000 / mean);
  }
  document.querySelector('#tap-tempo').innerHTML = `TEMPOYA DOKUN <span>⌁</span>`;
});

function buildSequencer() {
  const grid = document.querySelector('#sequencer-grid');
  const beats = ['1', '2', '3', '4'].map((beat) => `<span class="step-beat">${beat}</span>`).join('');
  const rows = [
    ['kick', 'KICK'],
    ['snare', 'SNARE'],
    ['hat', 'HI-HAT'],
  ].map(([name, label]) => `<span class="step-label">${label}</span>${Array.from({ length: 16 }, (_, step) => `<button class="step-cell${pattern[name].has(step) ? ' is-on' : ''}" data-row="${name}" data-step="${step}" aria-label="${label}, adım ${step + 1}" aria-pressed="${pattern[name].has(step)}"></button>`).join('')}`).join('');
  grid.innerHTML = '<span></span>' + beats + rows;
  grid.querySelectorAll('.step-cell').forEach((cell) => {
    cell.addEventListener('click', () => {
      const set = pattern[cell.dataset.row];
      const index = Number(cell.dataset.step);
      if (set.has(index)) set.delete(index); else set.add(index);
      cell.classList.toggle('is-on', set.has(index));
      cell.setAttribute('aria-pressed', String(set.has(index)));
    });
  });
}

function updateCurrentStep(step) {
  document.querySelectorAll('.step-cell').forEach((cell) => cell.classList.toggle('is-current', Number(cell.dataset.step) === step));
}

function schedulePattern() {
  if (!audioContext || !isPatternRunning) return;
  const stepDuration = beatIntervalMs(tempo) / 4000;
  while (nextStepTime < audioContext.currentTime + 0.12) {
    const step = patternStep % 16;
    const time = nextStepTime;
    for (const drum of Object.keys(pattern)) if (pattern[drum].has(step)) playDrum(drum, time);
    globalThis.setTimeout(() => updateCurrentStep(step), Math.max(0, (time - audioContext.currentTime) * 1000));
    nextStepTime += stepDuration;
    patternStep += 1;
  }
}

function setPattern(running) {
  const button = document.querySelector('#pattern-toggle');
  if (running) {
    const context = getAudioContext();
    if (!context) return;
    isPatternRunning = true;
    button.innerHTML = '<span class="button-play">■</span> Durdur';
    context.resume().catch(() => { document.querySelector('#sound-status').textContent = 'Ses aygıtına erişilemedi.'; });
    patternStep = 0;
    nextStepTime = context.currentTime + 0.05;
    schedulePattern();
    patternTimer = globalThis.setInterval(schedulePattern, 25);
  } else {
    isPatternRunning = false;
    button.innerHTML = '<span class="button-play">▶</span> Pattern’i dinle';
    globalThis.clearInterval(patternTimer);
    patternTimer = null;
    document.querySelectorAll('.step-cell.is-current').forEach((cell) => cell.classList.remove('is-current'));
  }
}

document.querySelector('#pattern-toggle').addEventListener('click', () => setPattern(!isPatternRunning));
document.querySelectorAll('[data-sequence-change]').forEach((button) => button.addEventListener('click', () => updateTempo(tempo + Number(button.dataset.sequenceChange))));
document.querySelector('#clear-pattern').addEventListener('click', () => {
  for (const row of Object.values(pattern)) row.clear();
  document.querySelectorAll('.step-cell').forEach((cell) => {
    cell.classList.remove('is-on');
    cell.setAttribute('aria-pressed', 'false');
  });
});

const menuToggle = document.querySelector('.mobile-menu-toggle');
menuToggle.addEventListener('click', () => {
  const menu = document.querySelector('.main-nav');
  const isOpen = menu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Menüyü aç');
}));

renderLessons();
renderProgress();
updateTempo(tempo, false);
buildSequencer();
