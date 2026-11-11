import { usePassport } from '../../context/PassportContext';

export function RawSaveDialog() {
  const { openModal, progressStore } = usePassport();

  const rawRead = progressStore.readRaw();
  const raw = rawRead === null ? 'No stored save' : rawRead || 'No stored save';

  return (
    <>
      <p>You can copy this before replacing your local save.</p>

      <label htmlFor="raw-code">Stored text</label>
      <textarea
        id="raw-code"
        rows={8}
        readOnly
        value={raw}
      />

      <button
        type="button"
        className="btn dark full"
        onClick={() => openModal({ type: 'storage' })}
      >
        Recovery options
      </button>
    </>
  );
}
