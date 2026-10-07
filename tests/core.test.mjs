import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../src/core.mjs';

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
