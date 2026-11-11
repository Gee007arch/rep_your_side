import { usePassport } from '../../context/PassportContext';

export function ResetDialog() {
  const { openModal, closeModal, resetPilot } = usePassport();

  return (
    <>
      <p>
        This resets the Passport, XP, choices and drafts on this browser. Make a
        recovery copy first if you want to keep them.
      </p>

      <div className="stack">
        <button
          type="button"
          className="btn outline full"
          onClick={() => openModal({ type: 'export' })}
        >
          Make a recovery copy
        </button>

        <button
          type="button"
          className="btn danger full"
          onClick={resetPilot}
        >
          Reset this browser’s pilot
        </button>

        <button
          type="button"
          className="btn text full"
          onClick={closeModal}
        >
          Keep my progress
        </button>
      </div>
    </>
  );
}

