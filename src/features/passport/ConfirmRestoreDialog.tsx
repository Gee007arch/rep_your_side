import type { PilotPassportV1 } from '../../domain/types';
import { CITIES } from '../../data/fixtures';
import { xp } from '../../domain/model';
import { usePassport } from '../../context/PassportContext';

export interface ConfirmRestoreDialogProps {
  pending: PilotPassportV1;
}

export function ConfirmRestoreDialog({ pending }: ConfirmRestoreDialogProps) {
  const { restorePassport, openModal } = usePassport();
  const currentCity = CITIES[pending.city];

  return (
    <>
      <div className="insight">
        <h3>{pending.nickname}</h3>
        <p>
          {pending.area || 'Visitor'} · {currentCity.name}
          <br />
          {xp(pending)} XP · {pending.saved.length} saved discoveries
        </p>
      </div>

      <p>
        Restoring replaces this browser’s current Passport. Copy your current
        recovery code first if you want to keep both.
      </p>

      <button
        type="button"
        className="btn dark full"
        onClick={() => restorePassport(pending)}
      >
        Restore this Passport
      </button>

      <button
        type="button"
        className="btn text full"
        onClick={() => openModal({ type: 'restore' })}
      >
        Go back
      </button>
    </>
  );
}

