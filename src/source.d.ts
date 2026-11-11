declare module 'node:fs' {
  const fs: {
    existsSync(p: string): boolean;
    readFileSync(p: string, encoding: 'utf8'): string;
    readdirSync(p: string): string[];
  };
  export default fs;
}

declare module 'node:path' {
  const path: {
    dirname(p: string): string;
    resolve(...segments: string[]): string;
    join(...segments: string[]): string;
  };
  export default path;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module '*/source/dist/data.mjs' {
  export const SOURCES: any;
  export const CITIES: any;
  export const QUESTIONS: any;
  export const STREET: any;
  export const PLACES: any;
  export const PULSE: any;
  export const CIRCLES: any;
  export const CHAPTERS: any;
}

declare module '*/source/dist/art.mjs' {
  export function skyline(city: string): string;
  export function art(type: string, city?: string): string;
  export function icon(name: string, cls?: string): string;
}

declare module '*/source/dist/model.mjs' {
  export const KEY: string;
  export function fresh(): any;
  export function dayKey(now?: Date): string;
  export function roundKey(city: string, type: string, day?: string): string;
  export function xp(s: any): number;
  export function award(s: any, id: string, points: number): number;
  export function markAnswer(s: any, key: string, index: number, answer: number, questions: any[]): boolean;
  export function complete(s: any, key: string, questions: any[]): { score: number; gained: number } | null;
  export function validate(s: any): boolean;
  export function loadState(storage: any): { state: any; issue: string | null };
  export function saveState(s: any, storage: any): boolean;
  export function setSide(s: any, city: string, area: string, cities: any): boolean;
  export function toggle(list: any[], id: string): boolean;
}
