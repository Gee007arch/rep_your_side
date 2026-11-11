import { CITIES, QUESTIONS, STREET, PLACES, PULSE, CIRCLES } from '../data/fixtures';
import type {
  CityId,
  PilotPassportV1,
  Question,
  RoundKey,
  RoundKind,
  StorageIssue
} from './types';

export const KEY = 'rep-your-side-pilot-v1';

export function fresh(): PilotPassportV1 {
  return {
    version: 1,
    city: 'lagos',
    area: '',
    nickname: 'Explorer',
    saved: [],
    read: [],
    awards: {},
    attempts: {},
    story: {},
    interests: [],
    activity: {},
    drafts: [],
    created: Date.now()
  };
}

export function dayKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

export function roundKey(city: CityId, type: RoundKind, day: string = 'starter-v1'): RoundKey {
  return `${city}:${type}:${type === 'city' ? day : 'starter'}` as RoundKey;
}

export function xp(s: PilotPassportV1): number {
  return Object.values(s.awards).reduce((a, b) => a + b, 0);
}

export function award(s: PilotPassportV1, id: string, points: number): number {
  if (Object.hasOwn(s.awards, id)) return 0;
  s.awards[id] = points;
  return points;
}

export function markAnswer(
  s: PilotPassportV1,
  key: RoundKey,
  index: number,
  answer: number,
  questions: Question[]
): boolean {
  let a = s.attempts[key];
  if (!a) {
    a = { answers: [], done: false };
    s.attempts[key] = a;
  }
  if (
    a.done ||
    index !== a.answers.length ||
    index >= questions.length ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= questions[index].a.length
  ) {
    return false;
  }
  a.answers.push(answer);
  return true;
}

export function complete(
  s: PilotPassportV1,
  key: RoundKey,
  questions: Question[]
): { score: number; gained: number } | null {
  const a = s.attempts[key];
  if (!a || a.answers.length !== questions.length) return null;
  const score = a.answers.reduce(
    (n, v, i) => n + Number(v === questions[i].correct),
    0
  );
  const gained = award(s, 'round:' + key, 20 + score * 10);
  a.done = true;
  return { score, gained };
}

export function validate(s: any): s is PilotPassportV1 {
  if (
    !s ||
    s.version !== 1 ||
    !['lagos', 'abuja'].includes(s.city) ||
    typeof s.area !== 'string' ||
    (s.area && !CITIES[s.city as CityId].areas.includes(s.area)) ||
    typeof s.nickname !== 'string' ||
    s.nickname.length > 30 ||
    !Number.isFinite(s.created)
  ) {
    return false;
  }
  const ids = new Set([...PLACES, ...PULSE].map((p) => p.id));
  const circleIds = new Set(CIRCLES.map((c) => c.id));

  for (const k of ['saved', 'read', 'interests', 'drafts'] as const) {
    if (!Array.isArray(s[k]) || s[k].length > 100) return false;
  }

  if (
    !s.saved.every((id: string) => PLACES.some((p) => p.id === id)) ||
    !s.read.every((id: string) => ids.has(id)) ||
    !s.interests.every((id: string) => circleIds.has(id as any))
  ) {
    return false;
  }

  for (const k of ['saved', 'read', 'interests'] as const) {
    if (new Set(s[k]).size !== s[k].length) return false;
  }

  for (const k of ['awards', 'attempts', 'story', 'activity'] as const) {
    if (
      !s[k] ||
      typeof s[k] !== 'object' ||
      Array.isArray(s[k]) ||
      Object.keys(s[k]).length > 100
    ) {
      return false;
    }
  }

  if (
    !Object.values(s.awards).every(
      (x: any) => Number.isFinite(x) && x >= 0 && x <= 1000
    )
  ) {
    return false;
  }

  for (const [key, a] of Object.entries(s.attempts) as [string, any][]) {
    const [c, t] = key.split(':');
    if (
      !['lagos', 'abuja'].includes(c) ||
      !['city', 'street'].includes(t) ||
      key !== roundKey(c as CityId, t as RoundKind, 'starter-v1')
    ) {
      return false;
    }
    const qs = t === 'city' ? QUESTIONS[c as CityId] : STREET;
    if (
      !a ||
      !Array.isArray(a.answers) ||
      a.answers.length > qs.length ||
      !a.answers.every(
        (n: any, i: number) =>
          Number.isInteger(n) && n >= 0 && n < qs[i].a.length
      ) ||
      typeof a.done !== 'boolean' ||
      (a.done && a.answers.length !== qs.length)
    ) {
      return false;
    }
  }

  for (const [c, st] of Object.entries(s.story) as [string, any][]) {
    if (
      !['lagos', 'abuja'].includes(c) ||
      !st ||
      !Number.isInteger(st.chapter) ||
      st.chapter < 0 ||
      st.chapter > 4 ||
      !Array.isArray(st.choices) ||
      st.choices.length > 5 ||
      st.choices.length < st.chapter ||
      st.choices.length > st.chapter + 1 ||
      !st.choices.every((n: any) => n === 0 || n === 1) ||
      typeof st.done !== 'boolean' ||
      (st.done && (st.chapter !== 4 || st.choices.length !== 5))
    ) {
      return false;
    }
  }

  for (const [id, a] of Object.entries(s.activity) as [string, any][]) {
    if (
      !circleIds.has(id as any) ||
      !a ||
      typeof a.text !== 'string' ||
      a.text.length < 10 ||
      a.text.length > 500 ||
      !Number.isFinite(a.date)
    ) {
      return false;
    }
  }

  if (
    !s.drafts.every(
      (d: any) =>
        d &&
        ids.has(d.id) &&
        ['place', 'pulse'].includes(d.kind) &&
        typeof d.title === 'string' &&
        d.title.length < 300 &&
        typeof d.text === 'string' &&
        d.text.length >= 20 &&
        d.text.length <= 1000 &&
        Number.isFinite(d.date)
    )
  ) {
    return false;
  }

  return true;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadState(storage: StorageLike): {
  state: PilotPassportV1;
  issue: StorageIssue;
} {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return { state: fresh(), issue: null };
    const s = JSON.parse(raw);
    if (!validate(s)) throw Error('invalid');
    return { state: { ...fresh(), ...s }, issue: null };
  } catch {
    return { state: fresh(), issue: 'load' };
  }
}

export function saveState(s: PilotPassportV1, storage: StorageLike): boolean {
  try {
    storage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function setSide(
  s: PilotPassportV1,
  city: CityId,
  area: string,
  cities: Record<CityId, { areas: string[] }>
): boolean {
  if (!cities[city] || !cities[city].areas.includes(area)) return false;
  s.city = city;
  s.area = area;
  return true;
}

export function toggle<T>(list: T[], id: T): boolean {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.push(id);
  return i < 0;
}

export function setDesiredState<T>(list: T[], id: T, desired: boolean): boolean {
  const i = list.indexOf(id);
  if (desired && i < 0) {
    list.push(id);
    return true;
  } else if (!desired && i >= 0) {
    list.splice(i, 1);
    return true;
  }
  return false;
}

// Selectors
export function getExplorerLevel(totalXp: number): 'Curious Newcomer' | 'Local Explorer' | 'Side Storyteller' {
  if (totalXp >= 350) return 'Side Storyteller';
  if (totalXp >= 150) return 'Local Explorer';
  return 'Curious Newcomer';
}

export function getStamps(s: PilotPassportV1) {
  return [
    {
      title: 'FIRST ROUND',
      earned: Object.keys(s.awards).some((k) => k.startsWith('round:')),
      icon: 'trophy'
    },
    {
      title: 'LOCAL CURIOSITY',
      earned: s.read.length > 0,
      icon: 'compass'
    },
    {
      title: 'STORY SEEKER',
      earned: Object.values(s.story).some((st) => st?.done),
      icon: 'book'
    },
    {
      title: 'BOTH CITIES',
      earned:
        Object.keys(s.awards).some((k) => k.includes('lagos')) &&
        Object.keys(s.awards).some((k) => k.includes('abuja')),
      icon: 'pin'
    }
  ];
}

