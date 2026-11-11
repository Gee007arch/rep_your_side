import type { PilotPassportV1, StorageIssue } from '../domain/types';

/**
 * Port interface for durable Passport state persistence.
 * Phase F0-F4 uses `LocalProgressStore` (`localStorage["rep-your-side-pilot-v1"]`).
 * Phase L1/L2 swaps in `HttpProgressStore` while retaining local fallback.
 */
export interface ProgressStore {
  load(): { state: PilotPassportV1; issue: StorageIssue };
  save(state: PilotPassportV1): boolean;
  readRaw(): string | null;
  reset(): PilotPassportV1;
}

