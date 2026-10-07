import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as core from '../src/core.mjs';
import * as i18n from '../src/i18n.mjs';

test('clampTempo keeps the metronome between 40 and 220 BPM', () => {
  assert.equal(core.clampTempo(18), 40);
  assert.equal(core.clampTempo(240), 220);
  assert.equal(core.clampTempo('96'), 96);
  assert.equal(core.clampTempo('hızlı'), 92);
});

test('beatIntervalMs derives the beat duration from BPM', () => {
  assert.equal(core.beatIntervalMs(120), 500);
  assert.equal(core.beatIntervalMs(60), 1000);
});

test('readProgress filters invalid lesson IDs and normalizes saved tempo', () => {
  const storage = {
    getItem() {
      return JSON.stringify({ completedLessons: ['quarter-note', 12, 'quarter-note'], tempo: 240 });
    },
  };

  assert.deepEqual(core.readProgress(storage), {
    completedLessons: ['quarter-note'],
    tempo: 220,
  });
});

test('readProgress safely falls back when saved data is malformed', () => {
  const storage = { getItem: () => '{not valid json' };

  assert.deepEqual(core.readProgress(storage), {
    completedLessons: [],
    tempo: 92,
  });
});

test('writeProgress reports storage failures without throwing', () => {
  const storage = {
    setItem() {
      throw new Error('storage disabled');
    },
  };

  assert.equal(core.writeProgress(storage, { completedLessons: ['intro'], tempo: 100 }), false);
});

test('migrateLegacyLessons maps old course progress to equivalent weeks without duplicates', () => {
  assert.deepEqual(core.migrateLegacyLessons(['first-groove', 'rudiments', 'first-groove', 'custom-id']), [
    'week-07-backbeat',
    'week-08-rudiments',
    'custom-id',
  ]);
});

test('readLanguage defaults to Turkish and accepts supported language choices', () => {
  assert.equal(core.readLanguage({ getItem: () => null }), 'tr');
  assert.equal(core.readLanguage({ getItem: () => 'en' }), 'en');
  assert.equal(core.readLanguage({ getItem: () => 'fr' }), 'tr');
});

test('writeLanguage persists the selected supported language', () => {
  let savedValue;
  const storage = { setItem: (key, value) => { savedValue = { key, value }; } };

  assert.equal(core.writeLanguage(storage, 'en'), true);
  assert.deepEqual(savedValue, { key: 'bateri-akademisi-language-v1', value: 'en' });
});

test('each language has a translated navigation label and a complete 12-week lesson path', () => {
  assert.equal(i18n.messagesFor('tr').navLearning, 'Öğrenme yolu');
  assert.equal(i18n.messagesFor('en').navLearning, 'Learning path');
  for (const language of ['tr', 'en']) {
    const lessons = i18n.lessonsFor(language);
    assert.equal(lessons.length, 12);
    assert.deepEqual(lessons.map((lesson) => lesson.week), Array.from({ length: 12 }, (_, index) => index + 1));
    assert.ok(lessons.every((lesson) => lesson.title && lesson.description && lesson.goal && lesson.concept && lesson.count && lesson.tempo && lesson.mastery && lesson.correction && lesson.application));
    assert.ok(lessons.every((lesson) => lesson.practice.length === 3 && lesson.practice.every((step) => step.title && step.instruction)));
  }
});

test('every marked page string has a translation in both supported languages', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const keys = [...html.matchAll(/data-i18n(?:-html|-aria)?="([^"]+)"/g)].map((match) => match[1]);
  const missing = ['tr', 'en'].flatMap((language) => keys.filter((key) => typeof i18n.messagesFor(language)[key] !== 'string').map((key) => `${language}:${key}`));

  assert.deepEqual(missing, []);
});
