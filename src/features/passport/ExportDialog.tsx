import { useRef } from 'react';
import { usePassport } from '../../context/PassportContext';

export function ExportDialog() {
  const { state, backupCodec, browserServices, showToast } = usePassport();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const code = backupCodec.encode(state);

  const handleCopy = async () => {
    const copied = await browserServices.copyText(code, textareaRef.current);
    if (copied) {
      showToast('Recovery code copied. Keep it private.');
    } else {
      showToast('Automatic copying is unavailable. Select and copy the text manually.');
    }
  };

  return (
    <>
      <p>
        This code contains your Passport, progress, reflections and drafts. Treat it
        as private.
      </p>

      <label htmlFor="backup-code">My recovery code</label>
      <textarea
        id="backup-code"
        ref={textareaRef}
        rows={6}
        readOnly
        value={code}
      />

      <button
        type="button"
        className="btn dark full"
        onClick={handleCopy}
      >
        Copy recovery code
      </button>

      <p className="field-note">
        If copying is unavailable, select the code above and copy it manually. Restore
        will replace the local Passport after a review step.
      </p>
    </>
  );
}
