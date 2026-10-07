export const PROGRESS_KEY = 'bateri-akademisi-progress-v1';
export const LANGUAGE_KEY = 'bateri-akademisi-language-v1';
export const DEFAULT_TEMPO = 92;
const LEGACY_LESSON_MAP = {
  'note-values': 'week-03-values', 'counting-meter': 'week-03-values', 'drum-notation': 'week-05-notation',
  'first-groove': 'week-07-backbeat', coordination: 'week-06-coordination', rudiments: 'week-08-rudiments',
  'groove-variations': 'week-10-dynamics', fills: 'week-11-fills', independence: 'week-12-final', 'odd-meter': 'week-12-final',
};

function browserStorage() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

export function normalizeLanguage(value) {
  return value === 'en' ? 'en' : 'tr';
}

export function readLanguage(storage = browserStorage()) {
  try {
    return normalizeLanguage(storage?.getItem(LANGUAGE_KEY));
  } catch {
    return 'tr';
  }
}

export function writeLanguage(storage = browserStorage(), language) {
  try {
    if (!storage?.setItem) return false;
    storage.setItem(LANGUAGE_KEY, normalizeLanguage(language));
    return true;
  } catch {
    return false;
  }
}

export function clampTempo(value) {
  const numericTempo = Number(value);
  if (!Number.isFinite(numericTempo)) return DEFAULT_TEMPO;
  return Math.min(220, Math.max(40, Math.round(numericTempo)));
}

export function beatIntervalMs(bpm) {
  return 60_000 / clampTempo(bpm);
}

export function migrateLegacyLessons(completedLessonIds) {
  return [...new Set(completedLessonIds.map((id) => LEGACY_LESSON_MAP[id] ?? id))];
}

function normalizeProgress(value) {
  const completedLessons = Array.isArray(value?.completedLessons)
    ? [...new Set(value.completedLessons.filter((id) => typeof id === 'string' && id.trim()))]
    : [];

  return {
    completedLessons,
    tempo: clampTempo(value?.tempo),
  };
}

export function readProgress(storage = globalThis.localStorage) {
  const fallback = { completedLessons: [], tempo: DEFAULT_TEMPO };

  try {
    const rawProgress = storage?.getItem(PROGRESS_KEY);
    return rawProgress ? normalizeProgress(JSON.parse(rawProgress)) : fallback;
  } catch {
    return fallback;
  }
}

export function writeProgress(storage = globalThis.localStorage, progress) {
  try {
    storage?.setItem(PROGRESS_KEY, JSON.stringify(normalizeProgress(progress)));
    return Boolean(storage?.setItem);
  } catch {
    return false;
  }
}
