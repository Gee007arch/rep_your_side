/**
 * Port interface for browser-specific capabilities (clipboard, network connectivity).
 * Enables deterministic unit and component testing without real browser APIs.
 */
export interface BrowserServices {
  copyText(text: string, fallbackInput?: HTMLInputElement | HTMLTextAreaElement | null): Promise<boolean>;
  isOnline(): boolean;
  subscribeOnlineStatus(onChange: (online: boolean) => void): () => void;
}

