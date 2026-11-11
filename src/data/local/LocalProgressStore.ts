import type { ProgressStore } from '../../ports/ProgressStore';
import type { PilotPassportV1, StorageIssue } from '../../domain/types';
import { KEY, fresh, loadState, saveState } from '../../domain/model';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class LocalProgressStore implements ProgressStore {
  private readonly getStorage: () => StorageLike | undefined;

  constructor(storageGetter?: () => StorageLike | undefined) {
    this.getStorage =
      storageGetter ??
      (() => (typeof window !== 'undefined' ? window.localStorage : undefined));
  }

  load(): { state: PilotPassportV1; issue: StorageIssue } {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return { state: fresh(), issue: null };
      }
      return loadState(storage);
    } catch {
      return { state: fresh(), issue: 'load' };
    }
  }

  save(state: PilotPassportV1): boolean {
    try {
      const storage = this.getStorage();
      if (!storage) return false;
      return saveState(state, storage);
    } catch {
      return false;
    }
  }

  readRaw(): string | null {
    try {
      const storage = this.getStorage();
      if (!storage) return 'No stored save';
      return storage.getItem(KEY) || 'No stored save';
    } catch {
      return 'Browser storage is unavailable.';
    }
  }

  reset(): PilotPassportV1 {
    const next = fresh();
    this.save(next);
    return next;
  }
}

export const defaultProgressStore = new LocalProgressStore();
