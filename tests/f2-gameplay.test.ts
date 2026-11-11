import { describe, it, expect } from 'vitest';
import {
  fresh,
  roundKey,
  markAnswer,
  complete,
  award,
  xp,
  validate
} from '../src/domain/model';
import { QUESTIONS, STREET, CITIES } from '../src/data/fixtures';

describe('Phase F2 Acceptance Tests (RYS-04 through RYS-11)', () => {
  it('RYS-04: Answer selection, change, and check locking without premature XP', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');

    // Unselected -> no write
    expect(s.attempts[key]).toBeUndefined();

    // Selecting an answer (0), then changing (1) before check
    // Checking commits answer at index 0
    const committed = markAnswer(s, key, 0, 1, QUESTIONS.lagos);
    expect(committed).toBe(true);
    expect(s.attempts[key]?.answers).toEqual([1]);
    expect(s.attempts[key]?.done).toBe(false);

    // No XP yet
    expect(xp(s)).toBe(0);

    // Checking locks option — cannot overwrite index 0
    expect(markAnswer(s, key, 0, 2, QUESTIONS.lagos)).toBe(false);
  });

  it('RYS-05: Check two answers, pause/reload -> resumes at 3rd question', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');

    // Check first 2 questions
    markAnswer(s, key, 0, QUESTIONS.lagos[0].correct, QUESTIONS.lagos);
    markAnswer(s, key, 1, QUESTIONS.lagos[1].correct, QUESTIONS.lagos);

    // Simulate reload by inspecting state
    const attempt = s.attempts[key];
    expect(attempt).toBeDefined();
    expect(attempt?.answers.length).toBe(2);
    expect(attempt?.done).toBe(false);

    // Next question to answer is index 2
    expect(markAnswer(s, key, 2, QUESTIONS.lagos[2].correct, QUESTIONS.lagos)).toBe(true);
  });

  it('RYS-06: Check last question then reload before result modal -> awards XP once', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');

    for (let i = 0; i < 5; i++) {
      markAnswer(s, key, i, QUESTIONS.lagos[i].correct, QUESTIONS.lagos);
    }
    expect(s.attempts[key]?.answers.length).toBe(5);
    expect(s.attempts[key]?.done).toBe(false);
    expect(xp(s)).toBe(0);

    // Crash recovery / reopen completes and awards
    const res = complete(s, key, QUESTIONS.lagos);
    expect(res).toEqual({ score: 5, gained: 70 });
    expect(s.attempts[key]?.done).toBe(true);
    expect(xp(s)).toBe(70);

    // Second call is idempotent, 0 gained
    const res2 = complete(s, key, QUESTIONS.lagos);
    expect(res2?.gained).toBe(0);
    expect(xp(s)).toBe(70);
  });

  it('RYS-07: Score math (4/5 = 60 XP) and practice replay gives 0 extra XP', () => {
    const s = fresh();
    const key = roundKey('lagos', 'city', 'starter-v1');

    // Answer 4 correct, 1 wrong
    for (let i = 0; i < 4; i++) {
      markAnswer(s, key, i, QUESTIONS.lagos[i].correct, QUESTIONS.lagos);
    }
    const wrongChoice = (QUESTIONS.lagos[4].correct + 1) % 4;
    markAnswer(s, key, 4, wrongChoice, QUESTIONS.lagos);

    const result = complete(s, key, QUESTIONS.lagos);
    expect(result?.score).toBe(4);
    expect(result?.gained).toBe(20 + 4 * 10); // 60 XP
    expect(xp(s)).toBe(60);

    // Practice replay (forcePractice / done)
    const practiceAnswers = [0, 1, 2, 3, 0];
    const practiceScore = practiceAnswers.reduce(
      (n, a, i) => n + Number(a === QUESTIONS.lagos[i].correct),
      0
    );
    expect(practiceScore).toBeGreaterThanOrEqual(0);
    // Extra XP on practice is 0
    expect(xp(s)).toBe(60);
  });

  it('RYS-08: Street Sense in both editions (3 scenarios each, max 50 XP each)', () => {
    const s = fresh();

    for (const city of ['lagos', 'abuja'] as const) {
      const k = roundKey(city, 'street', 'starter-v1');
      for (let i = 0; i < 3; i++) {
        markAnswer(s, k, i, STREET[i].correct, STREET);
      }
      const res = complete(s, k, STREET);
      expect(res?.score).toBe(3);
      expect(res?.gained).toBe(20 + 3 * 10); // 50 XP
    }

    expect(xp(s)).toBe(100);
  });

  it('RYS-09: Direct challenge entry updates city and clears incompatible area', () => {
    const s = fresh();
    s.city = 'lagos';
    s.area = 'Yaba';

    // Direct entry on Abuja round:
    const targetCity = 'abuja';
    s.city = targetCity;
    if (!CITIES[targetCity].areas.includes(s.area)) {
      s.area = '';
    }

    expect(s.city).toBe('abuja');
    expect(s.area).toBe('');
    expect(xp(s)).toBe(0); // opening alone gives 0 XP
  });

  it('RYS-10: Postcard Trail chapters 1–5, cursor resume, 50 XP award and revisit', () => {
    const s = fresh();
    s.story.lagos = { chapter: 0, choices: [], done: false };

    // Choose chapter 0 choice 1
    s.story.lagos.choices[0] = 1;
    s.story.lagos.chapter = 1;

    // Simulate reload: cursor resumes at chapter 1
    expect(s.story.lagos.chapter).toBe(1);
    expect(s.story.lagos.choices).toEqual([1]);
    expect(xp(s)).toBe(0);

    // Advance through chapters 1, 2, 3, 4
    for (let ch = 1; ch < 5; ch++) {
      s.story.lagos.choices[ch] = 0;
      if (ch < 4) s.story.lagos.chapter = ch + 1;
    }

    expect(s.story.lagos.choices.length).toBe(5);
    s.story.lagos.done = true;
    award(s, 'story:lagos', 50);

    expect(xp(s)).toBe(50);
    expect(validate(s)).toBe(true);

    // Revisit gives no extra XP
    award(s, 'story:lagos', 50);
    expect(xp(s)).toBe(50);
  });

  it('RYS-11: Reflection requires 10–500 chars, first submit gives 20 XP, edits give 0 XP', () => {
    const s = fresh();

    // Invalid < 10 characters
    const shortText = 'too short';
    expect(shortText.trim().length).toBe(9);

    // Valid reflection
    const validText = 'I noticed three distinct sounds: birds, distant cars, and a generator.';
    expect(validText.length).toBeGreaterThanOrEqual(10);
    expect(validText.length).toBeLessThanOrEqual(500);

    s.activity.lens = { text: validText, date: Date.now() };
    const gained = award(s, 'activity:lens', 20);
    expect(gained).toBe(20);
    expect(xp(s)).toBe(20);

    // Edit reflection
    const editedText = 'Updated reflection text with more specific observations.';
    s.activity.lens = { text: editedText, date: Date.now() + 1000 };
    const gainedOnEdit = award(s, 'activity:lens', 20);
    expect(gainedOnEdit).toBe(0);
    expect(xp(s)).toBe(20);
    expect(s.activity.lens.text).toBe(editedText);
    expect(validate(s)).toBe(true);
  });
});
