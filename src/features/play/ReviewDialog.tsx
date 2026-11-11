import { SOURCES } from '../../data/fixtures';
import { usePassport } from '../../context/PassportContext';

export interface ReviewDialogProps {
  round: any;
}

export function ReviewDialog({ round }: ReviewDialogProps) {
  const { closeModal } = usePassport();
  const questions = round?.questions || [];
  const answers = round?.answers || [];

  return (
    <>
      <div className="review-list">
        {questions.map((q: any, i: number) => {
          const playerAnswerIndex = answers[i];
          const isCorrect = playerAnswerIndex === q.correct;
          const playerAnswerText =
            playerAnswerIndex !== undefined ? q.a[playerAnswerIndex] : 'Unanswered';

          return (
            <section key={i}>
              <b>
                {i + 1}. {q.q}
              </b>
              <p className={isCorrect ? 'green-text' : 'muted'}>
                Your answer: {playerAnswerText}
              </p>
              <p>
                <b>Answer: {q.a[q.correct]}</b>
                <br />
                {q.why}
              </p>
              {q.source && SOURCES[q.source] ? (
                <a
                  href={SOURCES[q.source].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source ↗
                </a>
              ) : null}
            </section>
          );
        })}
      </div>

      <button
        type="button"
        className="btn dark full"
        onClick={() => {
          closeModal();
          window.location.hash = 'home';
        }}
      >
        Back to my Side
      </button>
    </>
  );
}

