import type { PilotPassportV1 } from '../domain/types';

export type BackupParseResult =
  | { ok: true; candidate: PilotPassportV1 }
  | { ok: false; error: string };

/**
 * Port interface for exporting and restoring Passport backup payloads.
 * Preserves bidirectional compatibility with the prototype's v1 JSON payload format.
 */
export interface BackupCodec {
  encode(state: PilotPassportV1): string;
  decode(raw: string): BackupParseResult;
}

