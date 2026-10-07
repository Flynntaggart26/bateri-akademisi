export const PROGRESS_KEY = 'bateri-akademisi-progress-v1';
export const DEFAULT_TEMPO = 92;

export function clampTempo(value) {
  const numericTempo = Number(value);
  if (!Number.isFinite(numericTempo)) return DEFAULT_TEMPO;
  return Math.min(220, Math.max(40, Math.round(numericTempo)));
}

export function beatIntervalMs(bpm) {
  return 60_000 / clampTempo(bpm);
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
