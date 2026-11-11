import type { BrowserServices } from '../../ports/BrowserServices';

export class LocalBrowserServices implements BrowserServices {
  async copyText(
    text: string,
    fallbackInput?: HTMLInputElement | HTMLTextAreaElement | null
  ): Promise<boolean> {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard unsupported');
      }
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      if (fallbackInput) {
        fallbackInput.focus();
        fallbackInput.select();
      }
      return false;
    }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  subscribeOnlineStatus(onChange: (online: boolean) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }
    const handleOnline = () => onChange(true);
    const handleOffline = () => onChange(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

export const defaultBrowserServices = new LocalBrowserServices();

