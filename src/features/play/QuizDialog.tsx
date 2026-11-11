import React, { useState } from 'react';
import type { Question, RoundKind } from '../../domain/types';
import { QUESTIONS, STREET, SOURCES } from '../../data/fixtures';
import { roundKey, markAnswer, complete } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export interface QuizDialogProps {
  roundType: RoundKind;
  forcePractice?: boolean;
}

export function QuizDialog({ roundType, forcePractice = false }: QuizDialogProps) {
  const { state, persist, closeModal, openModal, showToast, publishFeedActivity, catalog } = usePassport();
  const city = state.city;
  const key = roundKey(city, roundType, 'starter-v1');
  const questions: Question[] = roundType === 'city' ? QUESTIONS[city] : STREET;

  const old = state.attempts[key];
  const isPractice = forcePractice || !!old?.done;

  // Answers array
  const [answers, setAnswers] = useState<number[]>(
    isPractice || old?.done ? [] : [...(old?.answers || [])]
  );
  const [index, setIndex] = useState<number>(
    isPractice || old?.done
      ? 0
      : Math.min(old?.answers?.length || 0, questions.length)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean>(false);

  // If already at end on open (final answer crash recovery)
  React.useEffect(() => {
    if (index >= questions.length) {
      if (isPractice) {
        const score = answers.reduce(
          (n, a, i) => n + Number(a === questions[i].correct),
          0
        );
        openModal({
          type: 'result',
          score,
          gained: 0,
          round: { city, type: roundType, key, questions, answers, practice: true }
        });
      } else {
        const result = complete(state, key, questions);
        if (result) {
          persist();
          openModal({
            type: 'result',
            score: result.score,
            gained: result.gained,
            round: { city, type: roundType, key, questions, answers: old?.answers || [], practice: false }
          });
        }
      }
    }
  }, []);

  if (index >= questions.length) {
    return null;
  }

  const q = questions[index];

  const handleCheckAnswer = () => {
    if (selected === null || feedback) return;

    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setFeedback(true);

    if (!isPractice) {
      markAnswer(state, key, index, selected, questions);
      persist();
    }
  };

  const handleNextQuestion = () => {
    if (!feedback) return;

    const nextIndex = index + 1;
    setSelected(null);

    if (nextIndex >= questions.length) {
      if (isPractice) {
        const score = answers.reduce(
          (n, a, i) => n + Number(a === questions[i].correct),
          0
        );
        openModal({
          type: 'result',
          score,
          gained: 0,
          round: { city, type: roundType, key, questions, answers, practice: true }
        });
      } else {
        const result = complete(state, key, questions);
        persist();
        const cityName = catalog.getCity(city).name;
        const roundTitle = roundType === 'city' ? `${cityName} in five` : 'Street Sense';
        publishFeedActivity({
          kind: 'quiz',
          actionText: `scored ${result?.score || 0}/${questions.length} on`,
          targetTitle: roundTitle,
          detailText: `Completed ${roundTitle} and added ${result?.gained || 0} XP for their Side.`,
          xpGained: result?.gained || undefined
        });
        openModal({
          type: 'result',
          score: result?.score || 0,
          gained: result?.gained || 0,
          round: { city, type: roundType, key, questions, answers, practice: false }
        });
      }
    } else {
      setIndex(nextIndex);
      setFeedback(false);
    }
  };

  const handlePause = () => {
    closeModal();
    window.location.hash = 'play';
    showToast(
      isPractice
        ? 'Practice closed.'
        : 'Round paused. Continue whenever you’re ready.'
    );
  };

  return (
    <>
      <div className="card-row">
        <span className="small muted">
          {isPractice
            ? 'PRACTICE · NO EXTRA XP'
            : 'STARTER ROUND · PERSONAL PROGRESS'}
        </span>
        <b className="small">
          {index + 1} / {questions.length}
        </b>
      </div>

      <div className="round-dots">
        {questions.map((_, i) => (
          <span key={i} className={i <= index ? 'filled' : ''} />
        ))}
      </div>

      <h3 className="question">{q.q}</h3>

      <div className="answers" role="group" aria-label="Answer choices">
        {q.a.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = feedback && i === q.correct;
          const isWrong = feedback && isSelected && selected !== q.correct;

          return (
            <button
              key={i}
              type="button"
              className={`answer ${isSelected ? 'selected' : ''} ${
                isCorrect ? 'correct' : ''
              } ${isWrong ? 'wrong' : ''}`.trim()}
              onClick={() => {
                if (!feedback) setSelected(i);
              }}
              aria-pressed={isSelected}
              disabled={feedback}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {opt}
              {isCorrect ? <Icon name="check" /> : null}
            </button>
          );
        })}
      </div>

      {feedback ? (
        <>
          <div
            className={`answer-feedback ${
              selected === q.correct ? 'positive' : 'correction'
            }`}
            role="status"
          >
            <b>
              {selected === q.correct
                ? 'Nice one. You know your Side!'
                : 'A little discovery for next time.'}
            </b>
            <p>{q.why}</p>
            {q.source && SOURCES[q.source] ? (
              <>
                <a
                  href={SOURCES[q.source].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the source ↗
                </a>
                <small>Source checked 21 Oct 2026</small>
              </>
            ) : null}
          </div>

          <button
            type="button"
            className="btn dark full"
            onClick={handleNextQuestion}
          >
            {index === questions.length - 1 ? 'See my result' : 'Next question'}{' '}
            <Icon name="arrow" />
          </button>
        </>
      ) : (
        <>
          <p className="field-note">
            Tap an answer. You can change it before you check.
          </p>
          <button
            type="button"
            className="btn dark full"
            onClick={handleCheckAnswer}
            disabled={selected === null}
          >
            Check my answer <Icon name="arrow" />
          </button>
        </>
      )}

      <button type="button" className="text-btn quiz-exit" onClick={handlePause}>
        {isPractice ? 'Leave practice' : 'Pause & return to my Side'}
      </button>
    </>
  );
}
