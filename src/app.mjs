import { beatIntervalMs, clampTempo, readLanguage, readProgress, writeLanguage, writeProgress } from './core.mjs';
import { lessonsFor, messagesFor } from './i18n.mjs';

const lessonGrid = document.querySelector('#lesson-grid');
let language = readLanguage();
let messages = messagesFor(language);
let lessons = lessonsFor(language);
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

function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelector('#page-title').textContent = messages.pageTitle;
  document.querySelector('#page-description').setAttribute('content', messages.metaDescription);
  document.querySelector('#og-title').setAttribute('content', messages.pageTitle);
  document.querySelector('#og-description').setAttribute('content', messages.metaDescription);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = messages[element.dataset.i18n];
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = messages[element.dataset.i18nHtml];
    if (typeof value === 'string') element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    const value = messages[element.dataset.i18nAria];
    if (typeof value === 'string') element.setAttribute('aria-label', value);
  });
  const toggle = document.querySelector('#language-toggle');
  toggle.dataset.language = language;
  toggle.setAttribute('aria-label', messages.languageToggleLabel);
  toggle.title = messages.languageToggleLabel;
  toggle.querySelector('.locale-tr').classList.toggle('is-selected', language === 'tr');
  toggle.querySelector('.locale-en').classList.toggle('is-selected', language === 'en');
  document.querySelector('.mobile-menu-toggle').setAttribute('aria-label', messages.menuOpen);
  document.querySelector('#metro-toggle').querySelector('[data-i18n]').textContent = isMetronomeRunning ? messages.metroStop : messages.metroStart;
  document.querySelector('#pattern-toggle').querySelector('[data-i18n]').textContent = isPatternRunning ? messages.patternStop : messages.patternPlay;
}

function setLanguage(nextLanguage) {
  const next = nextLanguage === 'en' ? 'en' : 'tr';
  if (next === language) return;
  language = next;
  messages = messagesFor(language);
  lessons = lessonsFor(language);
  writeLanguage(safeStorage(), language);
  applyTranslations();
  renderLessons();
  renderProgress();
  updateTempo(tempo, false);
  buildSequencer();
  if (selectedLessonId && document.querySelector('#lesson-dialog').open) openLesson(selectedLessonId);
}

document.querySelector('#language-toggle').addEventListener('click', () => setLanguage(language === 'tr' ? 'en' : 'tr'));

function persistProgress() {
  writeProgress(safeStorage(), progress);
  renderProgress();
}

function renderLessons() {
  const visibleLessons = lessons.filter((lesson) => activeFilter === 'all' || lesson.level === activeFilter);
  lessonGrid.innerHTML = visibleLessons.map((lesson) => {
    const complete = progress.completedLessons.includes(lesson.id);
    return `<article class="lesson-card${complete ? ' is-complete' : ''}" style="--card-tone:${lesson.level === 'ileri' ? 'var(--olive)' : lesson.level === 'orta' ? '#c4a13e' : 'var(--orange)'}">
      <div class="lesson-card-top"><span class="lesson-meta">${lesson.stage} <span>·</span> ${lesson.duration}</span><span class="lesson-level">${messages.levelNames[lesson.level]}</span></div>
      <h3>${lesson.title}</h3><p>${lesson.description}</p>
      <button class="lesson-open" data-lesson="${lesson.id}" aria-label="${lesson.title} — ${complete ? messages.lessonReview : messages.lessonOpen}"><span>${complete ? messages.lessonReview : messages.lessonOpen}</span><span class="lesson-complete-label">${complete ? messages.completedBadge : ''}</span><span aria-hidden="true">${complete ? '✓' : '↗'}</span></button>
    </article>`;
  }).join('');
  lessonGrid.querySelectorAll('[data-lesson]').forEach((button) => button.addEventListener('click', () => openLesson(button.dataset.lesson)));
}

function renderProgress() {
  const total = lessons.length;
  const complete = progress.completedLessons.filter((id) => lessons.some((lesson) => lesson.id === id)).length;
  document.querySelector('#progress-count').textContent = messages.progressCount.replace('{done}', complete).replace('{total}', total);
  document.querySelector('#progress-percent').textContent = String(Math.round((complete / total) * 100));
}

function openLesson(id) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return;
  selectedLessonId = id;
  document.querySelector('#dialog-level').textContent = `${lesson.stage}  ·  ${messages.levelNames[lesson.level]}  ·  ${lesson.duration}`;
  document.querySelector('#dialog-title').textContent = lesson.title;
  document.querySelector('#dialog-summary').textContent = lesson.description;
  document.querySelector('#dialog-content').innerHTML = lesson.content;
  const completeButton = document.querySelector('#complete-lesson');
  const complete = progress.completedLessons.includes(id);
  completeButton.disabled = complete;
  completeButton.innerHTML = `<span>${complete ? messages.dialogCompleted : messages.dialogComplete}</span> <span>✓</span>`;
  const dialog = document.querySelector('#lesson-dialog');
  if (!dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
  else if (!dialog.open) dialog.setAttribute('open', '');
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
  completeButton.innerHTML = `<span>${messages.dialogCompleted}</span> <span>✓</span>`;
  document.querySelector('#live-region').textContent = messages.completedStatus;
});

document.querySelector('#lesson-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) {
    document.querySelector('#sound-status').textContent = messages.soundUnavailable;
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
    document.querySelector('#sound-status').textContent = messages.soundInitFailed;
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
  const soundStatus = { kick: messages.soundPlayingKick, snare: messages.soundPlayingSnare, hat: messages.soundPlayingHat, tom: messages.soundPlayingTom };
  document.querySelector('#sound-status').textContent = soundStatus[name];
  globalThis.setTimeout(() => status.classList.remove('is-active'), 160);
}

async function resumeAudio(context) {
  if (!context || context.state !== 'suspended') return;
  try {
    await context.resume();
  } catch {
    document.querySelector('#sound-status').textContent = messages.soundDenied;
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
    button.querySelector('[data-i18n]').textContent = messages.metroStop;
    context.resume().catch(() => { document.querySelector('#sound-status').textContent = messages.soundDenied; });
    nextBeatTime = context.currentTime + 0.05;
    beatNumber = 0;
    scheduleMetronome();
    metronomeTimer = globalThis.setInterval(scheduleMetronome, 25);
  } else {
    isMetronomeRunning = false;
    button.querySelector('[data-i18n]').textContent = messages.metroStart;
    globalThis.clearInterval(metronomeTimer);
    metronomeTimer = null;
    document.querySelectorAll('.beat-lights i').forEach((light) => light.classList.remove('is-on'));
  }
}

document.querySelector('#metro-toggle').addEventListener('click', () => setMetronome(!isMetronomeRunning));

function tempoWord(value) {
  if (value < 60) return messages.tempoLargo;
  if (value < 76) return messages.tempoAdagio;
  if (value < 108) return messages.tempoWalking;
  if (value < 132) return messages.tempoModerato;
  if (value < 168) return messages.tempoAllegro;
  return messages.tempoPresto;
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
  document.querySelector('#tap-tempo').querySelector('[data-i18n]').textContent = messages.tapTempo;
});

function buildSequencer() {
  const grid = document.querySelector('#sequencer-grid');
  const beats = ['1', '2', '3', '4'].map((beat) => `<span class="step-beat">${beat}</span>`).join('');
  const rows = [
    ['kick', messages.sequenceKick],
    ['snare', messages.sequenceSnare],
    ['hat', messages.sequenceHat],
  ].map(([name, label]) => `<span class="step-label">${label}</span>${Array.from({ length: 16 }, (_, step) => `<button class="step-cell${pattern[name].has(step) ? ' is-on' : ''}" data-row="${name}" data-step="${step}" aria-label="${messages.sequenceStep.replace('{row}', label).replace('{step}', step + 1)}" aria-pressed="${pattern[name].has(step)}"></button>`).join('')}`).join('');
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
    button.querySelector('[data-i18n]').textContent = messages.patternStop;
    context.resume().catch(() => { document.querySelector('#sound-status').textContent = messages.soundDenied; });
    patternStep = 0;
    nextStepTime = context.currentTime + 0.05;
    schedulePattern();
    patternTimer = globalThis.setInterval(schedulePattern, 25);
  } else {
    isPatternRunning = false;
    button.querySelector('[data-i18n]').textContent = messages.patternPlay;
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
  menuToggle.setAttribute('aria-label', isOpen ? messages.menuClose : messages.menuOpen);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', messages.menuOpen);
}));

applyTranslations();
renderLessons();
renderProgress();
updateTempo(tempo, false);
buildSequencer();
