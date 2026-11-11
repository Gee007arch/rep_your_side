export type CityId = 'lagos' | 'abuja';
export type RoundKind = 'city' | 'street';
export type CircleId = 'lens' | 'green' | 'makers' | 'books';
export type RoundKey = `${CityId}:city:starter-v1` | `${CityId}:street:starter`;

export interface RoundAttempt {
  answers: number[];
  done: boolean;
}

export interface StoryProgress {
  chapter: number;
  choices: number[];
  done: boolean;
}

export interface Reflection {
  text: string;
  date: number;
}

export interface CorrectionDraft {
  id: string; // place or Pulse ID, not a unique draft ID
  kind: 'place' | 'pulse';
  title: string;
  text: string;
  date: number;
}

export interface PilotPassportV1 {
  version: 1;
  city: CityId;
  area: string; // exact display value from CITIES[city].areas or ''
  nickname: string;
  saved: string[]; // place IDs
  read: string[]; // collected place OR Pulse IDs; not a page-view log
  awards: Record<string, number>;
  attempts: Partial<Record<RoundKey, RoundAttempt>>;
  story: Partial<Record<CityId, StoryProgress>>;
  interests: CircleId[];
  activity: Partial<Record<CircleId, Reflection>>;
  drafts: CorrectionDraft[];
  created: number; // epoch milliseconds
}

export type StorageIssue = null | 'load' | 'save';

export type PageRoute = 'home' | 'play' | 'discover' | 'pulse' | 'circles' | 'passport';

export interface SourceItem {
  name: string;
  url: string;
  date: string;
}

export interface CityConfig {
  name: string;
  tag: string;
  short: string;
  areas: string[];
  colour: string;
  emoji: string;
  fact: string;
  pulseTitle: string;
}

export interface Question {
  q: string;
  a: string[];
  correct: number;
  why: string;
  source?: string;
}

export interface Place {
  id: string;
  city: CityId;
  area: string;
  category: 'Nature' | 'Culture' | 'Move';
  title: string;
  name: string;
  art: 'forest' | 'train' | 'city' | 'park' | 'craft';
  desc: string;
  detail: string;
  source: string;
}

export interface PulseEntry {
  id: string;
  city: CityId;
  tag: string;
  topic: 'Community' | 'Transport' | 'Environment' | 'Culture';
  title: string;
  summary: string;
  body: string;
  insight: string;
  limit: string;
  source: string;
  area: string;
  art: 'forest' | 'train' | 'city' | 'park' | 'craft';
}

export interface CircleItem {
  id: CircleId;
  name: string;
  tag: string;
  icon: string;
  colour: string;
  desc: string;
  task: string;
}

export interface StoryChapter {
  title: string;
  text: string;
  choices: [ [string, string], [string, string] ];
}

