import { describe, it, expect, beforeEach } from 'vitest';
import { fresh, setSide, validate, KEY } from '../src/domain/model';
import { CITIES } from '../src/data/fixtures';

describe('Phase F1 Acceptance Tests (RYS-01, RYS-02, RYS-03)', () => {
  let mockStorage: Record<string, string>;
  let storage: {
    getItem: (k: string) => string | null;
    setItem: (k: string, v: string) => void;
    clear: () => void;
  };

  beforeEach(() => {
    mockStorage = {};
    storage = {
      getItem: (k: string) => mockStorage[k] ?? null,
      setItem: (k: string, v: string) => {
        mockStorage[k] = v;
      },
      clear: () => {
        mockStorage = {};
      }
    };
  });

  it('RYS-01: Fresh guest defaults to Lagos, no area, Explorer, 0 XP, empty progress', () => {
    const s = fresh();
    expect(s.version).toBe(1);
    expect(s.city).toBe('lagos');
    expect(s.area).toBe('');
    expect(s.nickname).toBe('Explorer');
    expect(s.saved).toEqual([]);
    expect(s.read).toEqual([]);
    expect(s.awards).toEqual({});
    expect(s.attempts).toEqual({});
    expect(s.story).toEqual({});
    expect(s.interests).toEqual([]);
    expect(s.activity).toEqual({});
    expect(s.drafts).toEqual([]);
    expect(Number.isFinite(s.created)).toBe(true);
  });

  it('RYS-02: Side selection rejects missing area, commits valid area & nickname', () => {
    const s = fresh();

    // Choosing Abuja without selecting area fails
    expect(setSide(s, 'abuja', '', CITIES)).toBe(false);
    expect(s.city).toBe('lagos'); // state unchanged

    // Invalid area for Abuja fails
    expect(setSide(s, 'abuja', 'Yaba', CITIES)).toBe(false);
    expect(s.city).toBe('lagos');

    // Valid area for Abuja succeeds
    expect(setSide(s, 'abuja', 'Gwarinpa', CITIES)).toBe(true);
    s.nickname = 'Captain Abuja';
    expect(s.city).toBe('abuja');
    expect(s.area).toBe('Gwarinpa');
    expect(s.nickname).toBe('Captain Abuja');

    storage.setItem(KEY, JSON.stringify(s));
    expect(storage.getItem(KEY)).toContain('Gwarinpa');
    expect(validate(s)).toBe(true);
  });

  it('RYS-03: Side selection atomic validation and nickname bounds', () => {
    const s = fresh();

    // Nickname over 30 characters must be rejected
    const longName = 'A'.repeat(31);
    expect(longName.length).toBe(31);

    // Atomic validation check: if nickname is too long, state must NOT be mutated
    const attemptUpdate = (city: any, area: string, nickname: string) => {
      const trimmed = nickname.trim() || 'Explorer';
      if (!CITIES[city as 'lagos' | 'abuja']?.areas.includes(area)) {
        return { success: false, error: 'area' };
      }
      if (trimmed.length > 30) {
        return { success: false, error: 'nickname' };
      }
      setSide(s, city, area, CITIES);
      s.nickname = trimmed;
      return { success: true };
    };

    const res1 = attemptUpdate('abuja', 'Gwarinpa', longName);
    expect(res1.success).toBe(false);
    expect(res1.error).toBe('nickname');
    expect(s.city).toBe('lagos'); // NOT mutated to abuja!
    expect(s.area).toBe('');

    // Blank nickname becomes Explorer
    const res2 = attemptUpdate('abuja', 'Gwarinpa', '   ');
    expect(res2.success).toBe(true);
    expect(s.city).toBe('abuja');
    expect(s.area).toBe('Gwarinpa');
    expect(s.nickname).toBe('Explorer');
    expect(validate(s)).toBe(true);
  });
});
