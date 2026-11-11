import { usePassport } from '../../context/PassportContext';

export function SettingsDialog() {
  const { openModal, retrySave } = usePassport();

  return (
    <>
      <p className="modal-lead">
        This is a private, playable pilot for Lagos and Abuja. Your game data is stored
        in this browser.
      </p>

      <div className="settings-grid">
        <div>
          <b>Saved on this device</b>
          <p>
            Nickname, Side, answers, XP, story choices, saved discoveries,
            interests and drafts.
          </p>
        </div>
        <div>
          <b>Keep it personal</b>
          <p>
            No public profile or posting. No exact location requested. This pilot
            sends no application data to a moderation team.
          </p>
        </div>
      </div>

      <h3>Make a copy. Keep exploring.</h3>
      <p>
        Copy a recovery code to restore your Passport in this pilot on another browser.
        Keep it private: it contains your local reflections and drafts. Hosting access
        and ordinary hosting logs are managed separately.
      </p>

      <div className="stack">
        <button
          type="button"
          className="btn dark full"
          onClick={() => openModal({ type: 'export' })}
        >
          Show my recovery code
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => openModal({ type: 'restore' })}
        >
          Restore from a recovery code
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => retrySave()}
        >
          Retry saving on this browser
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => openModal({ type: 'operator-studio' })}
        >
          🛠️ Open Operator & Moderation Studio
        </button>

        <button
          type="button"
          className="btn text full"
          onClick={() => openModal({ type: 'reset' })}
        >
          Reset my local pilot
        </button>
      </div>

      <div className="insight">
        <b>Feature status</b>
        <p>
          Games, stories and saves work locally. Circle interests and correction
          drafts are local-only previews. There is no live transport feed, job
          marketplace, member chat, payment or competition service.
        </p>
      </div>

      <p className="modal-footnote">
        Content checked 21 October 2026. One Box ecosystem concept pilot. Branding and
        ownership remain subject to final operational confirmation.
      </p>
    </>
  );
}

