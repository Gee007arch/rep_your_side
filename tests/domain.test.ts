import { describe, it, expect } from 'vitest';
import {
  fresh,
  award,
  xp,
  markAnswer,
  complete,
  loadState,
  saveState,
  setSide,
  roundKey,
  validate,
  getStamps,
  getExplorerLevel
} from '../src/domain/model';
import { QUESTIONS, CITIES, STREET, PLACES, PULSE, SOURCES } from '../src/data/fixtures';
import type { Question } from '../src/domain/types';

describe('Domain Model Tests (13 Baseline Checks + Hardening)', () => {
  it('Both editions have distinct five-question rounds with valid sources', () => {
    for (const c of ['lagos', 'abuja'] as const) {
      expect(QUESTIONS[c].length).toBe(5);
      QUESTIONS[c].forEach((q) => {
        expect(SOURCES[q.source!]).toBeDefined();
        expect(q.a[q.correct]).toBeDefined();
      });
      expect(PLACES.filter((p) => p.city === c).length).toBeGreaterThanOrEqual(3);
      expect(PULSE.filter((p) => p.city === c).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('Side selection rejects mismatched city and area', () => {
    const s = fresh();
    expect(setSide(s, 'lagos', 'Wuse', CITIES)).toBe(false);
    expect(setSide(s, 'lagos', 'Yaba', CITIES)).toBe(true);
  });

  it('Answer attempts reject skipped questions and out-of-range options', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');
    expect(markAnswer(s, key, 2, 0, QUESTIONS.lagos)).toBe(false);
    expect(markAnswer(s, key, 0, 9, QUESTIONS.lagos)).toBe(false);
    expect(markAnswer(s, key, 0, 1, QUESTIONS.lagos)).toBe(true);
    expect(markAnswer(s, key, 0, 1, QUESTIONS.lagos)).toBe(false);
  });

  it('Incomplete rounds do not award XP', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');
    expect(complete(s, key, QUESTIONS.lagos)).toBeNull();
    expect(xp(s)).toBe(0);
  });

  it('A saved interrupted round restores exactly', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');
    markAnswer(s, key, 0, 1, QUESTIONS.lagos);
    let stored = '';
    const storage = {
      setItem: (_k: string, v: string) => {
        stored = v;
      },
      getItem: () => stored
    };
    expect(saveState(s, storage)).toBe(true);
    const restored = loadState(storage);
    expect(restored.issue).toBeNull();
    expect(restored.state.attempts[key]?.answers).toEqual([1]);
  });

  it('Completion scores correct answers and awards once', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');
    for (let i = 0; i < 5; i++) {
      markAnswer(s, key, i, QUESTIONS.lagos[i].correct, QUESTIONS.lagos);
    }
    expect(complete(s, key, QUESTIONS.lagos)).toEqual({ score: 5, gained: 70 });
    expect(complete(s, key, QUESTIONS.lagos)).toEqual({ score: 5, gained: 0 });
    expect(xp(s)).toBe(70);
    expect(markAnswer(s, key, 5, 0, QUESTIONS.lagos)).toBe(false);
  });

  it('Discovery awards deduplicate', () => {
    const s = fresh();
    award(s, 'discovery:lcc', 10);
    award(s, 'discovery:lcc', 10);
    expect(xp(s)).toBe(10);
  });

  it('Switching to Abuja preserves Lagos progress', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');
    for (let i = 0; i < 5; i++) {
      markAnswer(s, key, i, QUESTIONS.lagos[i].correct, QUESTIONS.lagos);
    }
    complete(s, key, QUESTIONS.lagos);
    award(s, 'discovery:lcc', 10);
    expect(xp(s)).toBe(80);

    expect(setSide(s, 'abuja', 'Wuse', CITIES)).toBe(true);
    expect(xp(s)).toBe(80);
    expect(s.attempts[key]?.done).toBe(true);
  });

  it('Abuja and Street Sense completions remain independent', () => {
    const s = fresh();
    for (const [city, type, qs] of [
      ['abuja', 'city', QUESTIONS.abuja],
      ['abuja', 'street', STREET]
    ] as const) {
      const k = roundKey(city, type, 'starter-v1');
      qs.forEach((q, i) => markAnswer(s, k, i, q.correct, qs as Question[]));
      expect(complete(s, k, qs as Question[])?.gained).toBe(20 + qs.length * 10);
    }
    expect(xp(s)).toBe(70 + 50); // 120 XP
  });

  it('Failed saves return failure without destroying in-memory progress', () => {
    const s = fresh();
    const before = JSON.stringify(s);
    expect(
      saveState(s, {
        getItem: () => null,
        setItem: () => {
          throw Error('quota');
        }
      })
    ).toBe(false);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('Corrupt and unavailable storage recover to a safe fresh session', () => {
    expect(
      loadState({
        getItem: () => '{bad json',
        setItem: () => {}
      }).issue
    ).toBe('load');

    expect(
      loadState({
        getItem: () => {
          throw Error('blocked');
        },
        setItem: () => {}
      }).issue
    ).toBe('load');

    expect(
      loadState({
        getItem: () => null,
        setItem: () => {}
      }).issue
    ).toBeNull();
  });

  it('Recovery schema rejects malformed nested state and mismatched geography', () => {
    const s = fresh();
    expect(validate(s)).toBe(true);

    const modifications: ((x: any) => void)[] = [
      (x) => (x.story.lagos = { chapter: 99, choices: [], done: false }),
      (x) => (x.saved = ['<script>']),
      (x) => (x.attempts['lagos:city:starter-v1'] = { answers: [999], done: false }),
      (x) => (x.area = 'Yaba', x.city = 'abuja'), // mismatched
      (x) => (x.awards.x = -99),
      (x) => (x.drafts = [{ text: 'bad' }])
    ];

    for (const modify of modifications) {
      const bad = structuredClone(s);
      modify(bad);
      expect(validate(bad)).toBe(false);
    }
  });

  it('Complete five-chapter story and reflection survive recovery', () => {
    const s = fresh();
    s.story.abuja = { chapter: 4, choices: [0, 1, 0, 1, 0], done: true };
    s.activity.lens = { text: 'A warm orange wall caught my attention.', date: Date.now() };
    s.drafts.push({
      id: 'lcc',
      kind: 'place',
      title: 'Lekki Conservation Centre',
      text: 'Please check the current visitor access details.',
      date: Date.now()
    });
    expect(validate(s)).toBe(true);

    const serialized = JSON.stringify(s);
    expect(loadState({ getItem: () => serialized, setItem: () => {} }).state).toEqual(s);
  });

  // Additional hardening checks
  it('D-02 guard: Draft list rejects exceeding 100 items', () => {
    const s = fresh();
    for (let i = 0; i < 100; i++) {
      s.drafts.push({
        id: 'lcc',
        kind: 'place',
        title: 'Title ' + i,
        text: 'Valid text for draft ' + i + ' with enough characters',
        date: Date.now()
      });
    }
    expect(validate(s)).toBe(true);

    s.drafts.push({
      id: 'lcc',
      kind: 'place',
      title: '101st draft',
      text: 'Valid text for draft 101 with enough characters',
      date: Date.now()
    });
    expect(validate(s)).toBe(false);
  });

  it('Stamps calculation matches pilot rules', () => {
    const s = fresh();
    let stamps = getStamps(s);
    expect(stamps.every((st) => !st.earned)).toBe(true);

    // Round stamp
    s.awards['round:lagos:city:starter-v1'] = 70;
    stamps = getStamps(s);
    expect(stamps.find((st) => st.title === 'FIRST ROUND')?.earned).toBe(true);

    // Curiosity stamp
    s.read.push('lcc');
    stamps = getStamps(s);
    expect(stamps.find((st) => st.title === 'LOCAL CURIOSITY')?.earned).toBe(true);

    // Story stamp
    s.story.lagos = { chapter: 4, choices: [0, 1, 0, 1, 0], done: true };
    stamps = getStamps(s);
    expect(stamps.find((st) => st.title === 'STORY SEEKER')?.earned).toBe(true);

    // Both cities stamp (requires award containing lagos AND award containing abuja)
    expect(stamps.find((st) => st.title === 'BOTH CITIES')?.earned).toBe(false);
    s.awards['round:abuja:city:starter-v1'] = 70;
    stamps = getStamps(s);
    expect(stamps.find((st) => st.title === 'BOTH CITIES')?.earned).toBe(true);
  });

  it('Explorer levels threshold', () => {
    expect(getExplorerLevel(0)).toBe('Curious Newcomer');
    expect(getExplorerLevel(149)).toBe('Curious Newcomer');
    expect(getExplorerLevel(150)).toBe('Local Explorer');
    expect(getExplorerLevel(349)).toBe('Local Explorer');
    expect(getExplorerLevel(350)).toBe('Side Storyteller');
    expect(getExplorerLevel(540)).toBe('Side Storyteller');
  });
});
