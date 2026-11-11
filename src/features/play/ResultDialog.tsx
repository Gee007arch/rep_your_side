import { xp } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export interface ResultDialogProps {
  score: number;
  gained: number;
  round: any;
}

export function ResultDialog({ score, gained, round }: ResultDialogProps) {
  const { state, openModal, closeModal } = usePassport();
  const totalQuestions = round?.questions?.length || 5;
  const isPractice = !!round?.practice;

  const headline =
    score === totalQuestions
      ? 'Local knowledge. Big energy.'
      : score >= 3
      ? 'A few answers. A few discoveries.'
      : 'Every answer is a new starting point.';

  const feedbackCopy = isPractice
    ? 'Practice complete. Your original progress is safe.'
    : `You collected ${gained} XP. The explanations are part of the win.`;

  return (
    <>
      <div className="result-art">
        ✳
        <span>
          {score}
          <small>/ {totalQuestions}</small>
        </span>
        <i>Nice one!</i>
      </div>

      <div className="result-copy">
        <h3>{headline}</h3>
        <p>{feedbackCopy}</p>
      </div>

      <div className="result-stats">
        <div>
          <b>{isPractice ? 'Practice' : `+${gained} XP`}</b>
          <small>This round</small>
        </div>
        <div>
          <b>{xp(state)} XP</b>
          <small>Your Passport total</small>
        </div>
      </div>

      <div className="stack">
        <button
          type="button"
          className="btn primary full"
          onClick={() => {
            closeModal();
            window.location.hash = 'passport';
          }}
        >
          See my Passport <Icon name="arrow" />
        </button>

        <button
          type="button"
          className="btn outline full"
          onClick={() => openModal({ type: 'share', round })}
        >
          Challenge a friend <Icon name="share" />
        </button>

        <button
          type="button"
          className="btn text"
          onClick={() => openModal({ type: 'review', round })}
        >
          Review the answers
        </button>
      </div>

      <p className="modal-footnote">
        Personal pilot progress. No public ranking or cash value. The same starter
        round can be replayed for practice.
      </p>
    </>
  );
}

