import { useRef } from 'react';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export interface ShareDialogProps {
  round: any;
}

export function ShareDialog({ round }: ShareDialogProps) {
  const { catalog, browserServices, showToast } = usePassport();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cities = catalog.getCities();
  const cityName = round?.city ? cities[round.city as 'lagos' | 'abuja']?.name : 'City';
  const roundLabel = round?.type === 'city' ? 'starter round' : 'Street Sense round';

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#play/${round?.city || 'lagos'}/${round?.type || 'city'}`
    : '';

  const handleCopy = async () => {
    const copied = await browserServices.copyText(shareUrl, inputRef.current);
    if (copied) {
      showToast('Challenge link copied.');
    } else {
      showToast('Automatic copying is unavailable. Select and copy the text manually.');
    }
  };

  return (
    <>
      <p>
        Share this same {cityName} {roundLabel}. Your personal score and nickname
        are not included.
      </p>

      <label htmlFor="share-link">Round link</label>
      <input
        id="share-link"
        ref={inputRef}
        readOnly
        value={shareUrl}
      />

      <button
        type="button"
        className="btn dark full"
        onClick={handleCopy}
      >
        Copy challenge link <Icon name="share" />
      </button>

      <p className="modal-footnote">
        This site is private. The recipient must have access to this Site to open
        the link. Copying a link does not change sharing permissions.
      </p>
    </>
  );
}
