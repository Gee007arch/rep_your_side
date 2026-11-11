import type { BackupCodec, BackupParseResult } from '../../ports/BackupCodec';
import type { PilotPassportV1 } from '../../domain/types';
import { loadState } from '../../domain/model';
import { CITIES } from '../fixtures';

const RESTORE_ERROR_MESSAGE =
  'That code could not be read. Copy the whole recovery code from this pilot and try again. Your current progress is unchanged.';

export class LocalBackupCodec implements BackupCodec {
  encode(state: PilotPassportV1): string {
    return JSON.stringify(state);
  }

  decode(raw: string): BackupParseResult {
    try {
      if (!raw || raw.length > 100000) {
        return { ok: false, error: RESTORE_ERROR_MESSAGE };
      }
      const parsed = JSON.parse(raw);
      const check = loadState({
        getItem: () => JSON.stringify(parsed),
        setItem: () => {}
      });
      if (check.issue) {
        return { ok: false, error: RESTORE_ERROR_MESSAGE };
      }
      if (
        parsed.area &&
        !CITIES[parsed.city as 'lagos' | 'abuja']?.areas.includes(parsed.area)
      ) {
        return { ok: false, error: RESTORE_ERROR_MESSAGE };
      }
      return { ok: true, candidate: check.state as PilotPassportV1 };
    } catch {
      return { ok: false, error: RESTORE_ERROR_MESSAGE };
    }
  }
}

export const defaultBackupCodec = new LocalBackupCodec();

