import { usePassport } from '../../context/PassportContext';

export function StorageDialog() {
  const { storageIssue, openModal, retrySave } = usePassport();

  return (
    <>
      <p>
        {storageIssue === 'load'
          ? 'The stored save could not be read. It has not been deleted. You can copy its raw text before deciding what to do.'
          : 'Your browser may be blocking storage or may be full. Keep this tab open while you make a backup.'}
      </p>

      <div className="stack">
        <button
          type="button"
          className="btn dark full"
          onClick={() => openModal({ type: 'export' })}
        >
          Back up current session
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => retrySave()}
        >
          Retry saving current session
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => openModal({ type: 'restore' })}
        >
          Restore a recovery code
        </button>

        {storageIssue === 'load' ? (
          <button
            type="button"
            className="btn text full"
            onClick={() => openModal({ type: 'raw-save' })}
          >
            View unreadable stored save
          </button>
        ) : null}
      </div>

      <p className="modal-footnote">
        Retry saving will replace the old local save with the current session.
      </p>
    </>
  );
}

