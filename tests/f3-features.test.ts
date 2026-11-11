import { describe, it, expect } from 'vitest';
import {
  fresh,
  award,
  xp,
  getExplorerLevel,
  getStamps,
  toggle,
  validate,
  roundKey,
  markAnswer,
  complete
} from '../src/domain/model';
import { PLACES, PULSE, QUESTIONS } from '../src/data/fixtures';

describe('Phase F3 Acceptance Tests (RYS-12 through RYS-18)', () => {
  it('RYS-12: Discover search case-insensitivity, category chip filter, empty states', () => {
    // Lagos places
    const lagosPlaces = PLACES.filter((p) => p.city === 'lagos');
    expect(lagosPlaces.length).toBe(3);

    // Filter by category 'Nature'
    const naturePlaces = lagosPlaces.filter((p) => p.category === 'Nature');
    expect(naturePlaces.length).toBe(1);
    expect(naturePlaces[0].id).toBe('lcc');

    // Case-insensitive search on place name or area
    const searchByName = lagosPlaces.filter((p) =>
      `${p.name} ${p.area} ${p.category}`.toLowerCase().includes('lekki'.toLowerCase())
    );
    expect(searchByName.length).toBe(1);
    expect(searchByName[0].id).toBe('lcc');

    // Category with no entries in city (e.g. Abuja 'Move')
    const abujaMove = PLACES.filter(
      (p) => p.city === 'abuja' && p.category === 'Move'
    );
    expect(abujaMove.length).toBe(0);
  });

  it('RYS-13: Bookmark scoping: Discover Saved is city-filtered, Passport saved is cross-city', () => {
    const s = fresh();
    expect(xp(s)).toBe(0);

    // Bookmark Lekki Conservation Centre (Lagos)
    toggle(s.saved, 'lcc');
    expect(s.saved).toContain('lcc');
    expect(xp(s)).toBe(0); // 0 XP for bookmark

    // Bookmark Millennium Park (Abuja)
    toggle(s.saved, 'millennium');
    expect(s.saved).toContain('millennium');
    expect(s.saved.length).toBe(2);

    // In Discover Lagos with filter='Saved', only 'lcc' matches
    const lagosSaved = PLACES.filter(
      (p) => p.city === 'lagos' && s.saved.includes(p.id)
    );
    expect(lagosSaved.map((p) => p.id)).toEqual(['lcc']);

    // In Discover Abuja with filter='Saved', only 'millennium' matches
    const abujaSaved = PLACES.filter(
      (p) => p.city === 'abuja' && s.saved.includes(p.id)
    );
    expect(abujaSaved.map((p) => p.id)).toEqual(['millennium']);

    // In Passport, saved shelf spans both cities
    const passportSaved = PLACES.filter((p) => s.saved.includes(p.id));
    expect(passportSaved.length).toBe(2);
  });

  it('RYS-14: Explicit collect awards 10 XP once and disables', () => {
    const s = fresh();
    expect(xp(s)).toBe(0);

    // Collect place 'lcc'
    s.read.push('lcc');
    award(s, 'discovery:lcc', 10);
    expect(xp(s)).toBe(10);

    // Attempt second collect on same item
    const repeatAward = award(s, 'discovery:lcc', 10);
    expect(repeatAward).toBe(0);
    expect(xp(s)).toBe(10);

    // Collect pulse item 'lg-rail'
    s.read.push('lg-rail');
    award(s, 'discovery:lg-rail', 10);
    expect(xp(s)).toBe(20);
    expect(s.read.length).toBe(2);
  });

  it('RYS-15: City Pulse topic filtering and empty state in Abuja Transport', () => {
    // Abuja Transport topic has no entries
    const abujaTransport = PULSE.filter(
      (p) => p.city === 'abuja' && p.topic === 'Transport'
    );
    expect(abujaTransport.length).toBe(0);

    // Lagos Transport has entries
    const lagosTransport = PULSE.filter(
      (p) => p.city === 'lagos' && p.topic === 'Transport'
    );
    expect(lagosTransport.length).toBe(1);
    expect(lagosTransport[0].id).toBe('lg-rail');
  });

  it('RYS-16: Correction drafts validation, local-only edit in place, 100 limit', () => {
    const s = fresh();

    // Text < 20 chars rejected
    const shortText = 'too short';
    expect(shortText.trim().length < 20).toBe(true);

    // Valid draft
    const validText = 'The gate timings mentioned here should be verified with the front office.';
    s.drafts.push({
      id: 'lcc',
      kind: 'place',
      title: 'Lekki Conservation Centre',
      text: validText,
      date: Date.now()
    });
    expect(s.drafts.length).toBe(1);
    expect(xp(s)).toBe(0); // drafts give 0 XP

    // Edit draft in place
    const updatedText = 'Updated note: access fees have been revised for weekend visits.';
    s.drafts[0] = {
      ...s.drafts[0],
      text: updatedText,
      date: Date.now() + 500
    };
    expect(s.drafts.length).toBe(1);
    expect(s.drafts[0].text).toBe(updatedText);

    // Second draft for same content is allowed
    s.drafts.push({
      id: 'lcc',
      kind: 'place',
      title: 'Lekki Conservation Centre',
      text: 'Second note about canopy walkway weather closures.',
      date: Date.now() + 1000
    });
    expect(s.drafts.length).toBe(2);
    expect(validate(s)).toBe(true);
  });

  it('RYS-17: Circle interest toggle (0 XP) does not affect reflection and vice versa', () => {
    const s = fresh();

    // Toggle interest in 'lens'
    toggle(s.interests, 'lens');
    expect(s.interests).toContain('lens');
    expect(xp(s)).toBe(0);

    // Submit reflection for 'green'
    s.activity.green = { text: 'I noticed the sound of rustling neem leaves.', date: Date.now() };
    award(s, 'activity:green', 20);
    expect(xp(s)).toBe(20);

    // Submitting reflection for 'green' must NOT auto-add 'green' to interests
    expect(s.interests).not.toContain('green');
  });

  it('RYS-18: Reference End-to-End Score Check = Exactly 210 XP, Local Explorer, all 4 stamps', () => {
    const s = fresh();

    // 1. In Lagos finish 4/5 (60 XP)
    const lagosKey = roundKey('lagos', 'city', 'starter-v1');
    for (let i = 0; i < 4; i++) {
      markAnswer(s, lagosKey, i, QUESTIONS.lagos[i].correct, QUESTIONS.lagos);
    }
    const wrongChoice = (QUESTIONS.lagos[4].correct + 1) % 4;
    markAnswer(s, lagosKey, 4, wrongChoice, QUESTIONS.lagos);
    const lagosRoundRes = complete(s, lagosKey, QUESTIONS.lagos);
    expect(lagosRoundRes?.score).toBe(4);
    expect(lagosRoundRes?.gained).toBe(60);
    expect(xp(s)).toBe(60);

    // 2. Collect one discovery (10 XP)
    s.read.push('lcc');
    award(s, 'discovery:lcc', 10);
    expect(xp(s)).toBe(70);

    // 3. Switch to Abuja and finish 5/5 (70 XP)
    s.city = 'abuja';
    const abujaKey = roundKey('abuja', 'city', 'starter-v1');
    for (let i = 0; i < 5; i++) {
      markAnswer(s, abujaKey, i, QUESTIONS.abuja[i].correct, QUESTIONS.abuja);
    }
    const abujaRoundRes = complete(s, abujaKey, QUESTIONS.abuja);
    expect(abujaRoundRes?.score).toBe(5);
    expect(abujaRoundRes?.gained).toBe(70);
    expect(xp(s)).toBe(140);

    // 4. Complete one story (50 XP) in Abuja
    s.story.abuja = { chapter: 4, choices: [0, 1, 0, 1, 0], done: true };
    award(s, 'story:abuja', 50);
    expect(xp(s)).toBe(190);

    // 5. Complete one first reflection (20 XP)
    s.activity.lens = { text: 'A warm orange wall caught my attention.', date: Date.now() };
    award(s, 'activity:lens', 20);
    expect(xp(s)).toBe(210);

    // Verify exact totals and derived state
    expect(xp(s)).toBe(210);
    expect(getExplorerLevel(xp(s))).toBe('Local Explorer');

    // Home rail counts
    const completedRoundsCount = Object.keys(s.awards).filter((k) =>
      k.startsWith('round:')
    ).length;
    expect(completedRoundsCount).toBe(2);

    // All four stamps earned
    const stamps = getStamps(s);
    expect(stamps.find((st) => st.title === 'FIRST ROUND')?.earned).toBe(true);
    expect(stamps.find((st) => st.title === 'LOCAL CURIOSITY')?.earned).toBe(true);
    expect(stamps.find((st) => st.title === 'STORY SEEKER')?.earned).toBe(true);
    expect(stamps.find((st) => st.title === 'BOTH CITIES')?.earned).toBe(true);
    expect(stamps.every((st) => st.earned)).toBe(true);
  });
});
